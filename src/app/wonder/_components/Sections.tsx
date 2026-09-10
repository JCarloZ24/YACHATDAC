import { existsSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import type { ReactNode } from "react";
import type { MediaSlot } from "@/content/lofi/media";
import {
  beforeYouCome,
  gettingHere,
  stayStages,
  turraburra,
  whatItIsLike,
  whereYouStay,
  whoYouAreWith,
  wonderClose,
  wonderHero,
  wonderHighlights,
  wonderStories,
} from "@/content/wonder";
import {
  hostsPeople,
  hostsSlot,
  stayStageMedia,
  turraburraSlot,
  whatItIsLikeSlot,
  whereYouStayMedia,
  wonderHeroSlot,
  wonderHeroVideo,
  wonderHighlightMedia,
  wonderStoryMedia,
} from "@/content/wonder-media";
import { CardRail } from "@/components/ui/CardRail";
import { DragScrollRail } from "@/components/ui/DragScrollRail";
import { StayRail } from "./StayRail";
import { MediaOrField } from "@/components/ui/MediaOrField";
import {
  BlobButton,
  BlobHold,
  WAVE_PATH,
  WaveDivider,
} from "@/components/ui/Furniture";
import { HeroVideo } from "./HeroVideo";
import { HostNames } from "./HostNames";
import { FactsMap, RouteMap } from "./RouteMap";
import { factsMapMarkup, routeMapMarkup } from "./route-map-markup";
import itineraryStyles from "./Itinerary.module.css";
import landscapeStyles from "./Landscape.module.css";

/**
 * /wonder — the markup, built to `01 · Wonder · HI-FI · Desktop`
 * (Figma 2033:4367, 1440 × 11900) and, from 7 Sep, to
 * `01 · Wonder · HI-FI · Mobile` (2576:21896, 375 × 12699).
 *
 * TWO GRIDS, ONE BREAKPOINT. The V2 file defines exactly two grid styles,
 * Desktop/1440 and Mobile/375, and nothing between (globals.css says the
 * same for the type tokens). So every class here is the 375 frame's value by
 * default and the 1440 frame's value under `lg:` (64rem) — the desktop
 * rendering at 1440 × 900 is byte-for-byte what it was before the responsive
 * pass, and the tablet band inherits the phone layout at desktop widths of
 * text, which is the frame's own answer to a width it never drew.
 *
 * The frame's own numbers, where they differ from the site's tokens:
 *
 *   gutter    20 → 64        section pad  40/64 → 112/120/160
 *   H1        56/1.2 → 96/1  H2  36/1.2 → 56/1.2   H3  32/1.2 → 40/1
 *   H4        24/1.4 → 36/1.3 (HIGHLIGHTS alone stays 36 on the phone)
 *   H5        16 → 20        body 16 → 20/18      card pad 20 → 40
 *
 * Copy is src/content/wonder.ts verbatim (D5 — the draft governs copy, the
 * frame governs layout). Where the frame carries copy the draft does not,
 * it is registered in wonder.ts with a hi-fi flag rather than typed here.
 *
 * Photography is src/content/wonder-media.ts: a slot whose file is not on
 * disk renders a tonal field. The Wonder batch is still to be gathered.
 *
 * Card rows on the phone are `CardRail` — the house swipe rail (Ivy,
 * 2026-09-05) rather than the frame's one-card-plus-dots slider: the peek is
 * the affordance and it needs no JavaScript; dots would.
 *
 * Load-bearing anchors (src/content/site.ts points at them):
 * #experience (What a stay looks like), #turraburra.
 */

/* -------------------------------------------------------------------------
   Shared bits
   ------------------------------------------------------------------------- */

/** Photograph on disk, or null so the slot renders its field. */
function presentSrc(src: string | null): string | null {
  return src && existsSync(join(process.cwd(), "public", src)) ? src : null;
}

/** Tailwind cannot see a computed class — the tone map has to be literal. */
const FIELD_CLASS: Record<MediaSlot["tone"], string> = {
  evergreen: "bg-evergreen",
  midnight: "bg-midnight",
  roasted: "bg-roasted",
  oxide: "bg-oxide",
  burnt: "bg-burnt",
  eucalyptus: "bg-eucalyptus",
  charcoal: "bg-charcoal",
};

/** Every photograph in the library is ~1.9:1; cover crops need height. */
const COVER_FULL_BLEED = "(min-width: 1024px) 100vw, 260vw";

function Slot({
  slot,
  sizes,
  priority = false,
  quality,
  className = "object-cover",
}: {
  slot: MediaSlot;
  sizes: string;
  priority?: boolean;
  quality?: number;
  className?: string;
}) {
  return (
    <MediaOrField
      src={presentSrc(slot.src)}
      alt={slot.expects}
      sizes={sizes}
      priority={priority}
      quality={quality}
      className={className}
      fieldClass={FIELD_CLASS[slot.tone]}
    />
  );
}

/* ⚠ THE FRAME-LITERAL RAMP IS GONE (August, 11 September 2026). This page
   used to take its heading sizes straight from its own frames — 56/96 for H1,
   36/56 for H2 — which is the Typography/* TEXT STYLES scale, and it made
   Wonder the one page disagreeing with every other about how big a hero is.
   The `text-h*` tokens carry the `YACHATDAC Type` VARIABLE collection, that
   collection is what Marc's sheet prints in its rem column, and August's call
   is that the rem column is the hierarchy. So these now point at the tokens
   and the page is on the same scale as the rest of the site.

   What moved: H1 96 → 56 and 56 → 40, H2 56 → 48. H3 needed no change at all
   — 32/40 was already exactly the token — which is the clearest sign the two
   scales only ever diverged at the top.

   H4–H6 below are NOT this scale and are left alone: they are the frames'
   eyebrow ramp in Bantayog (`font-eyebrow`), sized 14–36 and uppercased,
   where the tokens' H4–H6 are 18–32 heading sizes. Converting them would
   resize every eyebrow on the page to answer a question about headings. The
   site's own `eyebrow` utility is the 13px nav size, smaller than either. */
const H1 = "headline text-h1";
const H2 = "headline text-h2";
const H3 = "headline text-h3";
const H4 =
  "font-eyebrow text-[24px] leading-[1.4] font-extrabold lg:text-[36px] lg:leading-[1.3]";
const H5 =
  "font-eyebrow text-[16px] leading-[1.4] font-extrabold uppercase lg:text-[20px]";
const H6 = "font-eyebrow text-[14px] leading-[1.4] font-extrabold uppercase";

/** The frames' page gutter: 20 on the phone, 64 at 1440. */
const GUTTER = "px-5 lg:px-16";
/** CardRail's bleed through that gutter — see its `bleed` prop. Cards inside
    a rail size with `min-h-*`, not `h-*`: the rail's cell sets `[&>*]:h-full`
    on the phone to square the row, and that wins over a card's own `h-*`. */
const RAIL_BLEED = "-mx-5 px-5 scroll-px-5";

/** The section frame: a 1280 container inside the gutter. */
function Container({
  children,
  className = "",
  width = "max-w-[1280px]",
}: {
  children: ReactNode;
  className?: string;
  width?: string;
}) {
  return (
    <div className={`relative mx-auto w-full ${width} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Wonder's CTA hover — this page only. The shared blob already lifts 2px;
 * here the whole shape lifts further and the chevron slides on. Interface
 * response under a pointer, not narrative motion, so it lives in CSS on
 * --dur-small rather than in the controller.
 */
const BLOB_HOVER =
  "hover:-translate-y-1 hover:scale-[1.03] [&>svg]:transition-transform [&>svg]:duration-(--dur-small) [&>svg]:ease-quiet hover:[&>svg]:translate-x-1";

/** Chip — the eucalyptus tag the frame uses for the summary line and cards. */
function Chip({ children }: { children: string }) {
  return (
    <span
      className={`inline-block rounded-lg bg-eucalyptus px-3 py-1.5 whitespace-nowrap text-canvas ${H6}`}
    >
      {children}
    </span>
  );
}

/**
 * The OUTGOING ground dripping down into the section below — the frame's
 * other use of the wave. WaveDivider is the incoming ground rising up out
 * of the join; this is the same path, flipped, seated inside the top of the
 * incoming section and filled with the ground it is leaving.
 */
function WaveDrip({
  ground,
  seat = "-top-px",
  mirror = false,
  className = "",
}: {
  ground: string;
  /** Where the crest starts, as a `top-*` utility. Measured off the frame
      render, not the layer list: the layer list seats Wave Line 2033:5430
      at +87 but the render puts its ink from −12 to +93. */
  seat?: string;
  /** Wave Lines the frame lays out at x=1441 with a 1441 width are
      flipped horizontally — thick end on the LEFT (2033:5432, 2033:5434). */
  mirror?: boolean;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="1.00123 0 1467.84877 105.324"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 z-10 h-10 w-full sm:h-26 ${
        mirror ? "scale-[-1]" : "scale-y-[-1]"
      } ${seat} ${className}`}
    >
      <path d={WAVE_PATH} fill={ground} />
    </svg>
  );
}

/* -------------------------------------------------------------------------
   01 — Hero (Header / 5, 2033:5352 · 2576:21921) — the phone's full screen,
        720 at 1440; copy bottom-left
   ------------------------------------------------------------------------- */

export function WonderHero() {
  // The film only ships when its encode is on disk; otherwise the still, and
  // failing that the field — same contract as every other slot.
  const tiers = {
    small: presentSrc(wonderHeroVideo.tiers.small),
    medium: presentSrc(wonderHeroVideo.tiers.medium),
    large: presentSrc(wonderHeroVideo.tiers.large),
    portraitSmall: presentSrc(wonderHeroVideo.tiers.portraitSmall),
    portrait: presentSrc(wonderHeroVideo.tiers.portrait),
    portraitWide: presentSrc(wonderHeroVideo.tiers.portraitWide),
  };
  const film = tiers.medium ?? tiers.large ?? tiers.small;
  const poster = presentSrc(wonderHeroSlot.src);
  return (
    /* Full-bleed and PINNED (decided 8 Sep 2026, a departure from the frame's
       720 band): the film fills the viewport on load and holds while the
       facts section — wave first — scrolls up over it. Sticky makes its own
       stacking context, so the copy and sound button stay inside the hero
       and every later section, being positioned, paints on top. */
    <header
      data-wonder="hero"
      className="sticky top-0 flex min-h-svh items-end overflow-hidden bg-roasted"
    >
      <div className="absolute inset-0">
        {film && poster ? (
          <HeroVideo
            /* The three landscape widths fall back to whichever encode is
               on disk; the portrait cuts pass through as-is, because absent
               is a meaningful answer to `pickTier` — it keeps the landscape
               ladder rather than serving a wide file to a portrait box under
               a portrait name. */
            tiers={{
              small: tiers.small ?? film,
              medium: tiers.medium ?? film,
              large: tiers.large ?? film,
              portraitSmall: tiers.portraitSmall ?? undefined,
              portrait: tiers.portrait ?? undefined,
              portraitWide: tiers.portraitWide ?? undefined,
            }}
            poster={poster}
            silentFrom={0}
            label={wonderHeroVideo.label}
          />
        ) : (
          <Slot slot={wonderHeroSlot} sizes={COVER_FULL_BLEED} priority />
        )}
      </div>
      {/* X5 — copy sits on media. Foot-weighted, never opaque. */}
      <div
        aria-hidden
        data-wonder-scrim
        className="absolute inset-0 bg-linear-to-t from-charcoal/70 via-charcoal/20 to-charcoal/10"
      />
      <div className={`relative z-10 w-full pb-24 lg:pb-[120px] ${GUTTER}`}>
        <Container>
          <div className="flex w-[900px] max-w-full flex-col gap-5 text-canvas lg:gap-6">
            <p className={H5}>{wonderHero.eyebrow}</p>
            <h1 data-wonder-title className={H1}>
              {wonderHero.title}
            </h1>
          </div>
        </Container>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------
   02 — The facts (Layout / 18, 2033:5376 · 2576:22001) — canvas, the map
        artwork right at 1440 and under the list on the phone
   ------------------------------------------------------------------------- */

export function WonderFacts() {
  const [left, right] = [
    wonderHero.facts.slice(0, 3),
    wonderHero.facts.slice(3),
  ];
  return (
    /* At 1440 the section is a sticky span (the D4 lab's shape): 220vh of
       scroll with the screen held inside it while the map draws. The phone
       keeps its flow — the stacked layout is taller than a screen. */
    /* 320vh, up from 220 on 9 Sep 2026: the draw completed with scroll to
       spare, which is what made it read as quick. */
    <section
      data-sticky-span
      data-wonder="facts"
      className="relative pt-10 text-charcoal sm:pt-26 lg:h-[320vh]"
    >
      {/* Wave Line 2033:5350 — canvas rising over the hero's foot. With the
          hero pinned full-bleed (8 Sep 2026) the wave belongs to THIS
          section's first band rather than overhanging the hero: at rest the
          film fills the screen untouched, and the crest rides up over it as
          the section scrolls in. So the section has no ground of its own —
          the band the wave occupies is transparent to the film beneath, and
          canvas starts at the wave's foot on the wrapper below. Neither the
          sticky screen (overflow-hidden at lg) nor the map clip may parent
          the wave, or it is cut off. */}
      <div className="absolute inset-x-0 top-10 z-10 sm:top-26">
        <WaveDivider ground="var(--color-canvas)" />
      </div>
      {/* Padding on the section, not a margin here — a margin collapses
          through the section and shoves the whole section below the hero. */}
      <div className="bg-canvas lg:sticky lg:top-0 lg:h-svh lg:overflow-hidden">
        <div className={`relative overflow-hidden py-16 lg:h-full ${GUTTER}`}>
          {/* The illustrated map, both cuts, inlined so it draws itself on
          scroll (route-map.ts · `the guide leading the eye` · routeDraw).
          Placement is unchanged from the <img> version — see FactsMap. */}
          <FactsMap {...factsMapMarkup()} />
          <Container>
            <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-20">
              <div className="flex min-w-0 flex-1 flex-col gap-5 lg:gap-8">
                <p data-tier="anchor" className={H4}>
                  {wonderHero.standfirst}
                </p>
                <div data-tier="mid" className="flex flex-wrap gap-2.5">
                  {wonderHero.summary.map((item) => (
                    <Chip key={item}>{item}</Chip>
                  ))}
                </div>
                <div className="flex flex-col gap-6 py-2 lg:flex-row lg:gap-4">
                  {[left, right].map((column, i) => (
                    <dl key={i} className="flex flex-col gap-6">
                      {column.map((fact) => (
                        <div
                          key={fact.label}
                          data-tier="detail"
                          className="flex w-full flex-col gap-2 lg:w-[378px]"
                        >
                          <dt className={`${H5} text-burnt`}>{fact.label}</dt>
                          <dd className="text-base leading-normal font-medium lg:text-lg">
                            {fact.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ))}
                </div>
              </div>
              {/* The frame's Placeholder Image slot — empty; the map fills it. A
              240-tall block on the phone, the right-hand column at 1440. */}
              <div
                aria-hidden
                className="h-[240px] w-full lg:aspect-[600/640] lg:h-auto lg:w-auto lg:min-w-0 lg:flex-1"
              />
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   03 — Highlights (Layout / 267, 2033:5436 · Team / 10, 2576:24607) —
        three 500px photo cards, a 400px swipe rail on the phone
   ------------------------------------------------------------------------- */

/** Per-card overlay, in `wonderHighlights` order — see the note in the markup. */
const HIGHLIGHT_OVERLAY = ["bg-black/10", "bg-black/25", "bg-black/25"];
/** Per-card focal point, in the same order: the hand on the wall, the hand
    over the tray, the sun breaking through the treeline. Literal — Tailwind
    cannot see a computed class. */
const HIGHLIGHT_FOCUS = [
  "object-[28%_60%]",
  "object-[35%_50%]",
  // The break of light sits mid-frame, a little under the horizon line.
  "object-[50%_60%]",
];

export function WonderHighlights() {
  return (
    <section
      data-wonder="highlights"
      className={`relative bg-white py-16 text-charcoal lg:pt-[120px] lg:pb-[160px] ${GUTTER}`}
    >
      {/* Wave Line 2033:5430 / 2576:22128 — the facts' canvas dripping into
          the white highlights ground. */}
      <WaveDrip ground="var(--color-canvas)" seat="-top-3" />
      <Container className="relative flex flex-col gap-6 lg:gap-10">
        {/* The one heading the phone frame keeps at the desktop size. */}
        <h2 className="font-eyebrow text-[36px] leading-[1.3] font-extrabold">
          HIGHLIGHTS
        </h2>
        {/* One card at a time with the frame's dots under it (2576:24613 is a
            single 335 × 400 Column, 2576:24656 the dots 24 below it), not the
            house peek — August, 9 Sep 2026. */}
        {/* Mouse drag, added 10 September 2026 — wrapped rather than passed
            as a CardRail prop, because CardRail is shipped by three pages
            that are static by decision and importing a client component into
            it put the drag chunk in all three (measured on the build).
            `DragScrollRail` is a `display: contents` scope that finds this
            rail by its `role="group"` and attaches a handler; the markup is
            unchanged and CardRail is untouched.

            ⚠ IT ONLY BITES BELOW 640. CardRail is the house grid from `sm`
            up, where the row does not overflow — the cursor stays a pointer
            and nothing drags, correctly. If Highlights should be a carousel
            at desktop too, that is a layout decision, not this. */}
        <DragScrollRail>
          <CardRail
            bleed={RAIL_BLEED}
            columns="sm:grid-cols-2 lg:grid-cols-3"
            gap="sm:gap-6 lg:gap-12"
            label="Highlights"
            dots
          >
            {wonderHighlights.map((card, i) => {
              const media = wonderHighlightMedia[i];
              return (
                <article
                  key={card.title}
                  data-card
                  className="relative flex min-h-[400px] min-w-0 flex-col justify-end gap-4 overflow-hidden rounded-3xl p-5 text-canvas lg:min-h-[500px] lg:p-10"
                >
                  {/* frame grade: the clip opens, the picture inside holds. */}
                  <div
                    data-frame-media
                    data-motion="frame"
                    className="absolute inset-0"
                  >
                    {/* A 1.9:1 photograph covering a 395 × 500 card renders
                      about 950px wide, so the sizes hint has to say so or the
                      browser picks a candidate half the size and the card
                      blurs at 2×. The focal point per card is the frame's
                      own crop (2033:5436), read off its image offsets. */}
                    <Slot
                      slot={media}
                      sizes="(min-width: 1024px) 960px, 160vw"
                      className={`object-cover ${HIGHLIGHT_FOCUS[i] ?? "object-center"}`}
                    />
                  </div>
                  {/* The frame's overlay (2033:5436): flat black, no gradient —
                    10% on the pale sandstone card, 25% on the two darker
                    photographs. Literal per card; Tailwind cannot see a
                    computed class. */}
                  <div
                    aria-hidden
                    className={`absolute inset-0 ${HIGHLIGHT_OVERLAY[i] ?? "bg-black/25"}`}
                  />
                  <div
                    data-card-copy
                    className="relative flex flex-col items-start gap-4"
                  >
                    <Chip>{card.eyebrow}</Chip>
                    <div className="flex flex-col gap-2">
                      <h3 className={H3}>{card.title}</h3>
                      {/* The frame sets the body pure white, the title off-white. */}
                      <p className="text-base leading-normal font-medium text-white">
                        {card.body}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </CardRail>
        </DragScrollRail>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------
   04 — Getting here (Header / 5, 2033:5572 · 2576:22630) — charcoal, the
        route map right at 1440 and under the copy on the phone
   ------------------------------------------------------------------------- */

/** The route icons, in `gettingHere.stops` order — the frame's four vectors. */
const STOP_ICONS = [
  { src: "/wonder/icon-lake.svg", w: 32, h: 24 },
  { src: "/wonder/icon-sculpture.svg", w: 31, h: 30 },
  { src: "/wonder/icon-gorge.svg", w: 33, h: 32 },
  { src: "/wonder/icon-grayrock.svg", w: 28, h: 28 },
] as const;

/** The same icons as legends on the map (3238:34149, 34151, 34154, 34158) —
    layout positions inside the drawing, not geographic ones. `at` is the
    scroll progress each lights at, after the roads have inked in, in stop
    order (route-map.ts).

    PERCENTAGES OF THE MAP BOX since 9 Sep 2026, converted from the frame's
    1440 pixel offsets: each icon's CENTRE in frame coordinates, measured
    against the 2278 × 1580 artwork at its frame position. They used to be
    raw frame pixels, which pinned the whole map layer to a 1440-wide box and
    cut the artwork off on any wider screen. See RoutePin in RouteMap.tsx.

    RE-DERIVED 10 Sep 2026 from August's own measurements off the file, which
    are offsets inside the ROADS bounding box (3238:34141, 879.68 × 1109.54,
    sitting at (1388.09, 0.08) in the 2277.93 × 1580 artwork). Icon top-lefts
    in that box: lake 340.91/607.92, sculpture 275.91/650.92, gorge
    323.91/685.92, gray rock 387.91/637.92, at the frame's own 32×24, 31×30,
    33×32 and 28×28. Centred and converted they land within 0.02% of the
    9 Sep numbers — the placement was never the problem. What moved the icons
    was a 75% scale on the map box (tried and reverted, see RouteMap.tsx):
    the icon GRAPHICS keep their frame pixel size, so when the roads under
    them shrank they read a third too large and too close together.

    `at` PULLED FORWARD from 0.76–0.91. The legends were the last thing the
    scrub reached, so the reader had to scroll nearly the whole section
    before the four stops they had just read about appeared on the map. */
const MAP_PINS = [
  { icon: 0, left: 76.6, top: 39.24, at: 0.5 },
  { icon: 1, left: 73.73, top: 42.15, at: 0.56 },
  { icon: 2, left: 75.88, top: 44.43, at: 0.62 },
  { icon: 3, left: 78.58, top: 41.27, at: 0.68 },
] as const;

/**
 * The same four stops on the PHONE cut (Frame 15423, 3439:30182 — 343 × 343).
 *
 * A different window on the same drawing, so a different set of numbers:
 * these are the frame's own icon boxes (3439:30185 lake, 30186 sculpture,
 * 30192 gorge, 30190 gray rock), centred and expressed as percentages of the
 * 343 box. `w` here is a PERCENTAGE of the box width, not pixels — the frame
 * draws these at 12–14px against 343, and a fixed size would shrink against
 * the map on a wider phone.
 *
 * Layout positions inside one drawing. Never a geographic coordinate.
 */
const MOBILE_MAP_PINS = [
  { icon: 0, left: 61.52, top: 27.11, w: 3.5, at: 0.5 },
  { icon: 1, left: 53.64, top: 32.65, w: 3.5, at: 0.56 },
  { icon: 2, left: 59.48, top: 37.03, w: 4.08, at: 0.62 },
  { icon: 3, left: 66.76, top: 30.76, w: 3.5, at: 0.68 },
] as const;

export function WonderGettingHere() {
  return (
    /* Sticky span at 1440, as §02: the screen is held while the map forms. */
    /* 180vh — was 300 (August, 10 Sep 2026). Three viewports of scroll to
       ink one map is longer than the drawing is interesting, and the legends
       sat at the far end of it. It draws in stages across 180 and finishes
       with the section still on screen. */
    /* ⚠ `deck:` NOT `lg:` (August, 10 Sep 2026, reported from a 2560 × 1680
       laptop). The held screen is `h-svh` + `overflow-hidden`, so a column
       taller than the viewport is cut off with no scroll that can reach it —
       exactly the trap `deck:` (1024 wide AND 820 tall, globals.css) exists
       to withhold the hold for. Below it the section is ordinary flow, the
       same trade the Truth deck makes. This briefly needed its own taller
       threshold; the 10 Sep copy rewrite took the column from 873px to 647
       and the house one fits again. If the copy grows past ~780px,
       re-measure before trusting this. */
    <section
      data-sticky-span
      data-wonder="getting-here"
      className="relative bg-charcoal text-canvas deck:h-[180vh]"
    >
      {/* Wave Line 2033:5432 / 2576:22626 — charcoal rising over the white
          highlights ground. Above the top edge, so it sits on the section
          itself: the sticky screen below is overflow-hidden at lg and would
          cut it off. */}
      <WaveDivider ground="var(--color-charcoal)" mirror />
      {/* Wave Line 2033:5434 / 2576:22821 — charcoal dripping down over the
          Turraburra photo. Hung off this section's foot (1px overlapped so
          the seam never shows) above the shared landscape backdrop. On the
          section, not the sticky screen, for the same reason as above. */}
      <WaveDrip
        ground="var(--color-charcoal)"
        mirror
        seat="top-[calc(100%-1px)]"
      />
      <div className="deck:sticky deck:top-0 deck:h-svh deck:overflow-hidden">
        <div
          /* Padding is the FLOW case only — the held screen centres itself in
             `h-full` and resets the foot. 120px there rather than 80: below
             the hold threshold the coda is the last thing on a black ground
             before the wave drips into Turraburra, and 80 read as the
             paragraph running into the seam (August, 10 Sep 2026). */
          className={`relative overflow-hidden pt-10 pb-20 lg:pt-20 lg:pb-[120px] deck:h-full deck:pt-10 deck:pb-0 ${GUTTER}`}
        >
          {/* The route map, both cuts, inlined so it inks itself in on scroll
          (route-map.ts · `the guide leading the eye` · routeDraw). Placement
          is unchanged from the <img> version — see RouteMap.tsx. */}
          <RouteMap
            {...routeMapMarkup()}
            pins={MAP_PINS.map((pin) => ({ ...STOP_ICONS[pin.icon], ...pin }))}
            mobilePins={MOBILE_MAP_PINS.map((pin) => ({
              ...STOP_ICONS[pin.icon],
              ...pin,
            }))}
          />

          {/* Centred in the held screen, top-aligned in flow — the column is
              shorter than the viewport wherever the hold applies, and
              top-aligning it left the coda floating above a third of a screen
              of bare charcoal (August, 10 Sep 2026). */}
          <Container className="flex flex-col gap-12 lg:gap-20 deck:h-full deck:justify-center">
            <div className="flex w-[720px] max-w-full flex-col gap-5 lg:gap-6">
              <p data-eyebrow className={`${H5} text-burnt`}>
                Getting here
              </p>
              <h2 className={H2}>{gettingHere.title}</h2>
              <div className="flex flex-col gap-5 text-base leading-normal lg:gap-7 lg:text-xl">
                {gettingHere.body.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>
              {/* The list's lead-in — copy, from the draft, not markup. */}
              <p className="text-base leading-normal lg:text-xl">
                {gettingHere.stopsIntro}
              </p>
              <ul className="flex flex-col gap-4 text-base leading-normal lg:gap-6 lg:text-xl">
                {gettingHere.stops.map((stop, i) => {
                  const icon = STOP_ICONS[i];
                  return (
                    <li
                      key={stop.name}
                      data-cell
                      className="flex items-center gap-3"
                    >
                      <span
                        aria-hidden
                        className="flex w-[33px] shrink-0 items-center justify-center"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
                        <img
                          src={icon.src}
                          alt=""
                          width={icon.w}
                          height={icon.h}
                          style={{ width: icon.w, height: icon.h }}
                        />
                      </span>
                      {/* The frame (2033:5572) sets the whole line regular;
                          the name carries no weight of its own. Since the
                          10 Sep rewrite most stops are a name on its own, so
                          the em dash belongs to the detail and not to the
                          row — an empty one would leave a dangling dash. */}
                      <span>
                        {stop.name}
                        {stop.detail ? ` — ${stop.detail}` : ""}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="text-base leading-normal lg:text-xl">
                {gettingHere.coda}
              </p>
            </div>
            {/* The frame's 240px image slot on the phone; the map rides over it. */}
            <div aria-hidden className="h-[240px] w-full lg:hidden" />
          </Container>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   05 — Turraburra (Header / 5, 2033:5687 · 2576:22824) — full-bleed, copy
        right at 1440 and bottom-left on the phone
   ------------------------------------------------------------------------- */

/** F7 / SCR-01, user direction 9 September 2026: the black section scrolls
 * off one viewport landscape. A shared grid bounds its sticky background;
 * the static cut places the same image only behind Turraburra. */
export function WonderCountry() {
  return (
    <div data-wonder="country" className={landscapeStyles.scene}>
      <LandscapeBackdrop slot={turraburraSlot} />
      <WonderGettingHere />
      <WonderTurraburra />
    </div>
  );
}

/** Shared photographic layers and legibility scrim, F7 / X5, 9 Sep 2026. */
function LandscapeBackdrop({ slot }: { slot: MediaSlot }) {
  return (
    <div className={landscapeStyles.backdrop}>
      <div data-landscape-viewport className={landscapeStyles.viewport}>
        <div data-landscape-approach className={landscapeStyles.approach}>
          <div
            data-landscape-image
            data-motion="full"
            className={landscapeStyles.image}
          >
            <Slot slot={slot} sizes="(min-width: 1024px) 110vw, 300vw" />
          </div>
        </div>
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-charcoal/80 via-charcoal/30 to-charcoal/10"
        />
      </div>
    </div>
  );
}

/** Same reading position and 80vh hold for both landscapes. D5: words remain
 * supplied by the content module; only their container sticks (9 Sep 2026). */
function LandscapeScreen({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div data-landscape-screen className={landscapeStyles.screen}>
      <Container className="flex flex-col lg:flex-row lg:items-start lg:gap-20">
        <div aria-hidden className="hidden min-w-0 flex-1 lg:block" />
        <div
          data-plate-copy
          className="flex min-w-0 flex-1 flex-col gap-5 lg:gap-6"
        >
          <h2 className={H2}>{title}</h2>
          {children}
        </div>
      </Container>
    </div>
  );
}

function WonderTurraburra() {
  return (
    <section
      id="turraburra"
      data-wonder="turraburra"
      data-landscape-section
      className={`${landscapeStyles.section} text-canvas`}
    >
      <LandscapeScreen title={turraburra.title}>
        <p className="text-base leading-normal font-medium lg:text-xl">
          {turraburra.body}
        </p>
      </LandscapeScreen>
    </section>
  );
}

/* -------------------------------------------------------------------------
   06 — What a stay looks like (Layout / 18, 2033:5889 · 2576:22882) — the
        stage list
   ------------------------------------------------------------------------- */

/**
 * The rule under a stop doubles as the itinerary's scroll indicator (motion
 * grammar, "the world opening" / itinerary rule, 10 September 2026, user
 * direction). The burnt-ochre layer is the same artwork used as a mask, so
 * the dots that fill are the artist's dots; `--stage-fill` is written by
 * `src/lib/motion/wonder-itinerary.ts` and is 0% with no JavaScript.
 */
function DottedLine() {
  return (
    <div
      data-stage-rule
      aria-hidden
      className="relative block h-[7px] w-full lg:h-[9.59848px]"
    >
      {/* Two cuts of the same hand-drawn rule: the 335 artwork the 375 frame
          draws with, and the 1040 one. Supplied 10 September 2026. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
      <img
        src="/wonder/dotted-line-mobile.svg"
        alt=""
        aria-hidden
        className="block h-full w-full lg:hidden"
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
      <img
        src="/wonder/dotted-line.svg"
        alt=""
        aria-hidden
        className="hidden h-full w-full lg:block"
      />
      <span data-stage-fill className={itineraryStyles.ruleFill} />
    </div>
  );
}

/**
 * Restored to 2033:5889 on 9 September 2026, user direction (D5/F7).
 * Native disclosures are the base layout at every width. Later user direction
 * on the same day adds viewport-aligned automatic opening and scroll entrances.
 * The controller enables the held layout only when every stop fits the screen.
 * The supplied desktop reference includes a closing rule; the 375 frame does
 * not, so that last rule is desktop-only.
 */
export function WonderStay() {
  return (
    <section
      id="experience"
      data-wonder="itinerary"
      className={`${itineraryStyles.itinerary} relative flex flex-col items-center gap-20 bg-canvas px-5 py-10 text-charcoal lg:px-[200px] lg:pt-28 lg:pb-[164px]`}
    >
      <div data-itinerary-screen className="w-full">
        <Container
          width="max-w-[1040px]"
          /* 48px between the heading block and the list on the phone, from
             the 375 frame (2576:23040); the 1440 frame keeps 40. */
          className="flex flex-col gap-12 lg:gap-10"
        >
          <div data-itinerary-heading className="flex flex-col gap-5 lg:gap-6">
            <p data-eyebrow className={`${H5} text-burnt`}>
              Itinerary
            </p>
            <h2 className={H2}>What a stay looks like</h2>
          </div>

          {/* A rule above each stage. The mobile frame ends on the last item;
              the restored desktop reference also carries a closing rule. */}
          <div data-stage-viewport>
            <div data-stage-track className="relative flex flex-col">
              {stayStages.map((stage, i) => {
                const media = stayStageMedia[stage.title];
                return (
                  <div key={stage.title} data-stage-row>
                    <DottedLine />
                    <details
                      data-stage
                      className="group relative py-5 lg:py-12"
                      open={i === 0}
                    >
                      <summary
                        data-stage-head
                        className="flex cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-burnt list-none items-center justify-between gap-4 lg:gap-8 [&::-webkit-details-marker]:hidden"
                      >
                        <span className="flex items-center gap-4">
                          {/* The numbered badge (2033:6000) — the artist's mark
                            with the figure set on it. 44 × 40 on the phone,
                            71 × 64 at 1440. */}
                          <span className="relative block h-10 w-[44px] shrink-0 lg:h-16 lg:w-[71px]">
                            {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
                            <img
                              src="/wonder/stage-badge.svg"
                              alt=""
                              aria-hidden
                              className="absolute inset-0 h-full w-full"
                            />
                            <span
                              className={`absolute inset-0 flex items-center justify-center pt-0.5 text-canvas lg:pt-1 ${H5}`}
                            >
                              {i + 1}
                            </span>
                          </span>
                          <span data-stage-title className={H3}>
                            {stage.title}
                          </span>
                        </span>
                        {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
                        <img
                          data-stage-chevron
                          src="/wonder/chevron-up.svg"
                          alt=""
                          aria-hidden
                          /* The turn is CSS so it is smooth in both the
                             manual accordion and the held reading screen,
                             where the module changes `open` directly.
                             Grammar: "the world opening", chevron `quiet`. */
                          className="h-8 w-[33px] shrink-0 rotate-180 transition-[rotate] duration-[320ms] ease-out group-open:rotate-0 motion-reduce:transition-none"
                        />
                      </summary>

                      <div
                        data-stage-panel
                        className="flex flex-col gap-5 pt-5 lg:flex-row lg:items-start lg:gap-10 lg:pt-[30px]"
                      >
                        <div
                          data-stage-copy
                          className="flex min-w-0 flex-1 flex-col gap-4 text-base leading-normal font-medium lg:text-xl"
                        >
                          {stage.body.map((para) => (
                            <p key={para}>{para}</p>
                          ))}
                          {stage.points ? (
                            <ul className="list-disc space-y-1 pl-6">
                              {stage.points.map((point) => (
                                <li key={point}>{point}</li>
                              ))}
                            </ul>
                          ) : null}
                          {stage.coda ? (
                            <p className="callout text-scroll text-burnt">
                              {stage.coda}
                            </p>
                          ) : null}
                        </div>
                        <div
                          data-stage-picture
                          data-motion="frame"
                          className="relative h-[200px] w-full min-w-0 overflow-hidden rounded-3xl lg:h-[400px] lg:w-auto lg:flex-1"
                        >
                          {media ? (
                            <Slot
                              slot={media}
                              sizes="(min-width: 1024px) 500px, 100vw"
                            />
                          ) : null}
                        </div>
                      </div>
                    </details>
                  </div>
                );
              })}
              <div data-stage-end className="hidden lg:block">
                <DottedLine />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   07 — Before you come (Layout / 360, 2033:6742 · 2576:24527) — evergreen,
        centred; the fact cells stack left-aligned on the phone
   ------------------------------------------------------------------------- */

export function WonderBeforeYouCome() {
  const [row1, row2] = [
    beforeYouCome.facts.slice(0, 2),
    beforeYouCome.facts.slice(2),
  ];
  return (
    <section
      data-wonder="before"
      className="relative flex flex-col items-center gap-12 bg-evergreen px-5 py-16 text-canvas lg:gap-14 lg:px-[120px] lg:py-24"
    >
      <WaveDivider ground="var(--color-evergreen)" />
      <Container className="flex flex-col items-center">
        <div className="flex w-full max-w-[768px] flex-col items-center gap-3 lg:gap-4">
          <p data-eyebrow className={`${H5} text-gold text-center`}>
            {beforeYouCome.eyebrow}
          </p>
          <div className="flex w-full flex-col items-center gap-5 lg:gap-10">
            <h2 className={`${H2} text-center`}>{beforeYouCome.title}</h2>
            {/* `max-w-full` on the cells is a guard: a 378px cell in a
                narrower column with nothing clipping it pans the whole
                document sideways. On the phone the cells are full-width. */}
            {[row1, row2].map((row, i) => (
              <dl
                key={i}
                className="flex w-full flex-col gap-6 lg:w-auto lg:flex-row"
              >
                {row.map((fact) => (
                  <div
                    key={fact.label}
                    data-cell
                    className="flex w-full max-w-full flex-col gap-2 lg:w-[378px]"
                  >
                    <dt className={`${H5} text-gold`}>{fact.label}</dt>
                    <dd className="text-base leading-normal lg:text-lg">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ))}
            <div className="flex flex-col gap-5 text-center text-base leading-normal lg:gap-7 lg:text-xl">
              {beforeYouCome.body.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </Container>
      {/* One attention beat when the section has settled, never a loop —
          this is the page's first conversion point. */}
      <div data-cta>
        <BlobButton
          href={beforeYouCome.action.href}
          tone="oxide"
          icon="right"
          size="lg"
          className={BLOB_HOVER}
        >
          {beforeYouCome.action.label}
        </BlobButton>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   08 — Where you stay (Layout / 267, 2033:6782 · Team / 10, 2576:22530) —
        the frame's two 400px cards, now the visible window on a ten-frame
        carousel (August, 10 September 2026)
   ------------------------------------------------------------------------- */

export function WonderWhereYouStay() {
  return (
    <section
      data-wonder="sleep"
      className={`relative bg-canvas py-10 text-charcoal lg:pt-[120px] lg:pb-28 ${GUTTER}`}
    >
      {/* The evergreen drips down into the canvas (frame wave 2033:6770). */}
      <WaveDrip ground="var(--color-evergreen)" />
      <Container className="flex flex-col gap-6 lg:gap-10">
        <div className="flex w-[720px] max-w-full flex-col gap-5 lg:gap-4">
          <h2 className={H2}>{whereYouStay.title}</h2>
          <div
            data-card-copy
            className="flex flex-col gap-4 text-base leading-normal font-medium"
          >
            {whereYouStay.body.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </div>
        {/* A rail at every width now, not a rail that becomes a grid — see
            StayRail for why this is not CardRail. The dots sit 24 under the
            row, as on Highlights (2576:22570 / 2576:22542). */}
        <StayRail label="Where you stay">
          {whereYouStayMedia.map((slot) => (
            <div
              key={slot.id}
              className="relative min-h-[200px] min-w-0 overflow-hidden rounded-3xl lg:min-h-[400px]"
            >
              {/* Six of the ten frames have identifiable people in them.
                  Hold the image plane still, as the two cards this replaces
                  did. No scrim is needed without overlaid text.

                  10 Sep 2026: `data-card` is gone from these on August's
                  direction — it was the entrance hook, and a carousel does
                  not stage arrivals for cards a reader will swipe past. */}
              <div
                data-frame-media
                data-motion="frame"
                className="absolute inset-0"
              >
                {/* One card on the phone, two from 1024. The 400px-tall
                    cover crop still needs 600 source pixels across the 3:2
                    photograph at the narrowest desktop. */}
                <Slot
                  slot={slot}
                  sizes="(min-width: 1408px) 616px, (min-width: 1024px) max(600px, calc(50vw - 88px)), calc(100vw - 40px)"
                  quality={85}
                />
              </div>
            </div>
          ))}
        </StayRail>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------
   09 — What it is like out here (Header / 5, 2033:6800 · 2576:24666) —
        full-bleed, copy right at 1440 and bottom-left on the phone
   ------------------------------------------------------------------------- */

export function WonderOutHere() {
  return (
    <div data-wonder="out-here" className={landscapeStyles.scene}>
      <LandscapeBackdrop slot={whatItIsLikeSlot} />
      {/* No wave at this join — the frame runs Where you sleep straight
          into the photo (the next Wave Line is 2033's at y=8265, which is
          Your hosts rising). */}
      <section
        data-landscape-section
        className={`${landscapeStyles.section} text-canvas`}
      >
        <LandscapeScreen title={whatItIsLike.title}>
          <ul className="text-base leading-normal font-medium lg:text-xl">
            {whatItIsLike.points.map((point) => (
              <li key={point}>· {point}</li>
            ))}
          </ul>
        </LandscapeScreen>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------
   10 — Your hosts (Layout / 267, 2033:7003 · Team / 10, 2576:24677) — copy
        left, one card right; stacked on the phone
   ------------------------------------------------------------------------- */

export function WonderHosts() {
  return (
    <section
      data-wonder="hosts"
      className={`relative bg-canvas pt-10 pb-16 text-charcoal lg:py-28 ${GUTTER}`}
    >
      <WaveDivider ground="var(--color-canvas)" />
      <Container className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
        <div
          data-plate-copy
          className="flex min-w-0 flex-1 flex-col gap-5 lg:gap-4"
        >
          <p data-eyebrow className={`${H5} text-burnt`}>
            Your hosts
          </p>
          <h2 className={H2}>{whoYouAreWith.title}</h2>
          <p className="text-base leading-normal font-medium lg:text-xl">
            {whoYouAreWith.body}
          </p>
        </div>
        {/* Three of the eight in frame are named (hostsPeople). The pointer
            names them; the photograph itself never moves — portraits hold
            still and the world moves around them. */}
        <HostNames people={hostsPeople}>
          <Slot slot={hostsSlot} sizes="(min-width: 1024px) 620px, 100vw" />
          <div aria-hidden className="absolute inset-0 bg-charcoal/10" />
        </HostNames>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------
   11 — Stories from out here (Layout / 267, 2033:7021 · Team / 10,
        2576:24723) — three story cards, a swipe rail on the phone
   ------------------------------------------------------------------------- */

export function WonderStories() {
  return (
    <section
      data-wonder="stories"
      className={`relative bg-white pt-16 pb-20 text-charcoal lg:pt-[120px] lg:pb-[160px] ${GUTTER}`}
    >
      {/* THE WAVE IS BACK, BUT ON THE WIDE FRAMES ONLY (August, 9 Sep 2026).
          The frame's y=9096 Wave Line was pulled from this join earlier the
          same day because of what it did on the PHONE: Hosts' canvas and this
          white ground are a shade apart, so at 40px tall the crest read as a
          stray white band above the eyebrow rather than as a join. That is a
          375 problem and only a 375 problem — at 104px over a 1440 column the
          same crest reads as the frame draws it. So it returns from `sm` up
          and the phone keeps the straight canvas-into-white join it has now.
          The bottom join is unchanged either way — it is Close's roasted. */}
      <WaveDivider ground="white" className="hidden sm:block" />
      <Container className="flex flex-col gap-6 lg:gap-10">
        <div className="flex flex-col gap-5 lg:gap-4">
          {/* 16 on both frames — the one eyebrow that does not step up. */}
          <p className="font-eyebrow text-base leading-[1.4] font-extrabold text-burnt uppercase">
            From Country
          </p>
          <h2 className={H2}>{wonderStories.title}.</h2>
        </div>
        {/* One card at a time with the frame's dots under it, as Highlights
            (§03) and Where you sleep — August, 9 Sep 2026. The peek was
            leaving a sliced second plate under the phone's 375 gutter. */}
        {/* Mouse drag, as Highlights — wrapped at the call site so CardRail
            stays untouched for the three static pages. See §03. */}
        <DragScrollRail>
          <CardRail
            bleed={RAIL_BLEED}
            columns="sm:grid-cols-2 lg:grid-cols-3"
            gap="sm:gap-6 lg:gap-12"
            label="Stories from out here"
            dots
          >
            {wonderStories.items.map((item, i) => {
              const media = wonderStoryMedia[i];
              return (
                <article
                  key={item.href}
                  data-card
                  className="group/card relative flex min-w-0 flex-col overflow-hidden rounded-3xl bg-charcoal text-canvas transition-transform duration-(--dur-small) ease-quiet hover:-translate-y-1"
                >
                  {/* Marra Wonga is frame-grade: the image plane holds under
                    the pointer; the card lifts, the label answers. */}
                  <div
                    data-frame-media
                    data-motion="frame"
                    className="relative h-[240px] w-full lg:h-[320px]"
                  >
                    <Slot
                      slot={media}
                      sizes="(min-width: 1024px) 400px, 78vw"
                    />
                  </div>
                  {/* flex-1 + mt-auto: the link seats on the card's foot so
                    the three CTAs line up whatever the summary's length. */}
                  <div
                    data-card-copy
                    className="flex flex-1 flex-col items-start gap-4 p-6 lg:px-9 lg:py-10"
                  >
                    <Chip>{item.tag.replace("#", "")}</Chip>
                    <div className="flex flex-1 flex-col gap-10">
                      <div className="flex flex-col gap-4">
                        <h3 className={H3}>{item.title}</h3>
                        <p className="text-base leading-normal font-medium">
                          {item.summary}
                        </p>
                      </div>
                      <Link
                        href={item.href}
                        className="mt-auto inline-flex items-center gap-2 font-eyebrow text-base leading-normal font-bold text-gold uppercase after:absolute after:inset-0 group-hover/card:underline group-hover/card:underline-offset-4"
                      >
                        {wonderStories.cta}
                        {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
                        <img
                          src="/wonder/chevron-right.svg"
                          alt=""
                          aria-hidden
                          className="size-6 transition-transform duration-(--dur-small) ease-quiet group-hover/card:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </CardRail>
        </DragScrollRail>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------
   12 — Come and see it (Layout / 360, 2033:7085 · 2576:24814) — roasted,
        centred, two buttons (stacked on the phone). pb-300 is the 1440
        frame's own: it leaves room for the footer's double wave to ride up
        into the band; the phone frame gives it 112.
   ------------------------------------------------------------------------- */

export function WonderClose() {
  return (
    <section
      data-wonder="close"
      className="relative flex flex-col items-center gap-12 bg-roasted px-5 pt-16 pb-28 text-canvas lg:gap-14 lg:px-[120px] lg:pt-20 lg:pb-[300px]"
    >
      {/* Wave Line at y=9975, laid out at x=1440 — a flipped instance, so
          the thick end is on the LEFT like 2033:5432. */}
      <WaveDivider ground="var(--color-roasted)" mirror />
      <Container className="flex flex-col items-center">
        {/* THE 768 CLAMP IS ON THE PROSE, NOT ON THE BLOCK (9 Sep 2026).
            `Max Width/max-width-large` = 768 governs the measure of the
            reading lines; the chip row is not a reading line. Measured off
            the 1440 frame, the container runs the full 1200 (1440 − 2 × 120)
            and the four chips sit on ONE row across 874 of it, while the
            standfirst wraps inside 768. With the clamp on the wrapper the row
            had only 768 to work with, so "Best May to September" dropped to a
            second line on its own. The phone is unchanged either way — four
            chips stack inside 335 whatever the ceiling above them. */}
        <div className="flex w-full flex-col items-center gap-3 lg:gap-4">
          <p data-eyebrow className={`${H5} text-center text-gold`}>
            {wonderClose.eyebrow}
          </p>
          <div className="flex w-full flex-col items-center gap-5 lg:gap-6">
            <h2 className={`${H2} max-w-[768px] text-center`}>
              {wonderClose.title}
            </h2>
            <p className="max-w-[768px] text-center text-base leading-normal lg:text-xl">
              {wonderClose.body}
            </p>
            <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
              {wonderClose.facts.map((fact) => (
                <span key={fact} data-cell>
                  <Chip>{fact}</Chip>
                </span>
              ))}
            </div>
            <p className="max-w-[768px] text-center text-lg leading-normal lg:text-xl">
              {wonderClose.download}
            </p>
            <p className="max-w-[768px] text-center text-lg leading-normal lg:text-xl">
              {wonderClose.note}
            </p>
          </div>
        </div>
      </Container>
      <div data-cta className="flex flex-col items-center gap-6 lg:flex-row">
        <BlobButton
          href="/connect"
          tone="oxide"
          icon="right"
          size="lg"
          className={BLOB_HOVER}
        >
          Register your interest
        </BlobButton>
        {/* R14 — no brochure file exists yet; the shape renders held, but in
            the frame's own Burnt Ochre (2033:7110) rather than muted. */}
        <BlobHold tone="burnt" icon="down" size="lg">
          Download the brochure
        </BlobHold>
      </div>
    </section>
  );
}
