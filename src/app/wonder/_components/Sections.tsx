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
  whereYouSleep,
  whoYouAreWith,
  wonderClose,
  wonderHero,
  wonderHighlights,
  wonderStories,
} from "@/content/wonder";
import {
  hostsSlot,
  stayStageMedia,
  turraburraSlot,
  whatItIsLikeSlot,
  whereYouSleepMedia,
  wonderHeroSlot,
  wonderHighlightMedia,
  wonderStoryMedia,
} from "@/content/wonder-media";
import { CardRail } from "@/components/ui/CardRail";
import { MediaOrField } from "@/components/ui/MediaOrField";
import {
  BlobButton,
  BlobHold,
  WAVE_PATH,
  WaveDivider,
} from "@/components/ui/Furniture";

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
  className = "object-cover",
}: {
  slot: MediaSlot;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <MediaOrField
      src={presentSrc(slot.src)}
      alt={slot.expects}
      sizes={sizes}
      priority={priority}
      className={className}
      fieldClass={FIELD_CLASS[slot.tone]}
    />
  );
}

/* The frames' type ramps, Typography/Mobile → Typography/Desktop. Set as
   explicit sizes rather than the `text-h*` tokens because this page is built
   to its frame, and the frame's Display sizes (96 / 56 / 40) are the
   Typography/* TEXT STYLES, not the variable collection the tokens carry —
   see the globals.css note on the two coexisting scales. The site's `eyebrow`
   utility is the 13px nav size; the frames' eyebrows are 16 → 20. */
const H1 = "headline text-[56px] leading-[1.2] lg:text-[96px] lg:leading-none";
const H2 = "headline text-[36px] leading-[1.2] lg:text-[56px]";
const H3 = "headline text-[32px] leading-[1.2] lg:text-[40px] lg:leading-none";
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

/** Chip — the eucalyptus tag the frame uses for the summary line and cards. */
function Chip({ children }: { children: string }) {
  return (
    <span
      className={`inline-block rounded-lg bg-eucalyptus px-3.5 py-1.5 whitespace-nowrap text-canvas ${H6}`}
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
  className = "",
}: {
  ground: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="1.00123 0 1467.84877 105.324"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 -top-px z-10 h-16 w-full scale-y-[-1] sm:h-26 ${className}`}
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
  return (
    <header className="relative flex min-h-svh items-end overflow-hidden bg-roasted lg:min-h-[720px]">
      <div className="absolute inset-0">
        <Slot slot={wonderHeroSlot} sizes={COVER_FULL_BLEED} priority />
      </div>
      {/* X5 — copy sits on media. Foot-weighted, never opaque. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-charcoal/70 via-charcoal/20 to-charcoal/10"
      />
      <div className={`relative z-10 w-full pb-24 lg:pb-[120px] ${GUTTER}`}>
        <Container>
          <div className="flex w-[900px] max-w-full flex-col gap-5 text-canvas lg:gap-6">
            <p className={H5}>{wonderHero.eyebrow}</p>
            <h1 className={H1}>{wonderHero.title}</h1>
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
    <section
      className={`relative overflow-hidden bg-canvas py-16 text-charcoal ${GUTTER}`}
    >
      <WaveDivider ground="var(--color-canvas)" />
      {/* The illustrated map (2033:5376 › 3238:34073) — 1129 × 783, seated
          at x=205 y=83 in the 1440 frame, running behind the right column. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 hidden h-full w-[1440px] -translate-x-1/2 lg:block"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
        <img
          src="/wonder/facts-map.svg"
          alt=""
          className="absolute top-[83px] left-[205px] h-[783px] w-[1129px] max-w-none"
        />
      </div>
      {/* The phone's cut of the same map (2576:22001 › 2576:22115) — 506 × 359,
          seated over the frame's 240px image slot and bleeding 65px past
          either edge and 27px past the foot, exactly as the frame draws it. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
      <img
        src="/wonder/facts-map-mobile.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-[-27px] left-1/2 h-[359px] w-[506px] max-w-none -translate-x-1/2 lg:hidden"
      />
      <Container>
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-20">
          <div className="flex min-w-0 flex-1 flex-col gap-5 lg:gap-8">
            <p className={H4}>{wonderHero.standfirst}</p>
            <div className="flex flex-wrap gap-2.5">
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
    </section>
  );
}

/* -------------------------------------------------------------------------
   03 — Highlights (Layout / 267, 2033:5436 · Team / 10, 2576:24607) —
        three 500px photo cards, a 400px swipe rail on the phone
   ------------------------------------------------------------------------- */

export function WonderHighlights() {
  return (
    <section
      className={`relative bg-canvas py-16 text-charcoal lg:pt-[120px] lg:pb-[160px] ${GUTTER}`}
    >
      <Container className="flex flex-col gap-6 lg:gap-10">
        {/* The one heading the phone frame keeps at the desktop size. */}
        <h2 className="font-eyebrow text-[36px] leading-[1.3] font-extrabold">
          HIGHLIGHTS
        </h2>
        <CardRail
          bleed={RAIL_BLEED}
          columns="sm:grid-cols-2 lg:grid-cols-3"
          gap="sm:gap-6 lg:gap-12"
          label="Highlights"
        >
          {wonderHighlights.map((card, i) => {
            const media = wonderHighlightMedia[i];
            return (
              <article
                key={card.title}
                className="relative flex min-h-[400px] min-w-0 flex-col justify-end gap-4 overflow-hidden rounded-3xl p-5 text-canvas lg:min-h-[500px] lg:p-10"
              >
                <div className="absolute inset-0">
                  <Slot slot={media} sizes="(min-width: 1024px) 400px, 78vw" />
                </div>
                <div aria-hidden className="absolute inset-0 bg-charcoal/25" />
                <div className="relative flex flex-col items-start gap-4">
                  <Chip>{card.eyebrow}</Chip>
                  <div className="flex flex-col gap-2">
                    <h3 className={H3}>{card.title}</h3>
                    <p className="text-base leading-normal font-medium">
                      {card.body}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </CardRail>
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

/** The same icons as pins on the map, at the frame's own coordinates. */
const MAP_PINS = [
  { icon: 0, left: 1196, top: 325 },
  { icon: 1, left: 1131, top: 368 },
  { icon: 2, left: 1179, top: 403 },
  { icon: 3, left: 1227, top: 355 },
] as const;

export function WonderGettingHere() {
  return (
    <section
      className={`relative overflow-hidden bg-charcoal pt-10 pb-20 text-canvas lg:min-h-[900px] lg:pb-0 ${GUTTER}`}
    >
      <WaveDivider ground="var(--color-charcoal)" />
      {/* The route map (3238:34130) — 2278 × 1580, clipped to 1973 wide and
          centred at (50% − 266px, 50% + 57px) in the frame. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 hidden h-full w-[1440px] -translate-x-1/2 lg:block"
      >
        <div className="absolute top-[calc(50%+57px)] left-[calc(50%-266px)] h-[1580px] w-[1973px] -translate-x-1/2 -translate-y-1/2 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
          <img
            src="/wonder/getting-here-map.svg"
            alt=""
            className="absolute top-0 left-0 h-[1580px] w-[2278px] max-w-none"
          />
        </div>
        {MAP_PINS.map((pin) => {
          const icon = STOP_ICONS[pin.icon];
          return (
            /* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */
            <img
              key={pin.icon}
              src={icon.src}
              alt=""
              width={icon.w}
              height={icon.h}
              className="absolute"
              style={{ left: pin.left, top: pin.top, width: icon.w, height: icon.h }}
            />
          );
        })}
      </div>
      {/* The phone's cut (2576:22630 › 2576:22808) — 518 × 368 with the pin
          drawn in, centred and seated 28px past the section's foot. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
      <img
        src="/wonder/getting-here-map-mobile.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-[-28px] left-1/2 h-[368px] w-[518px] max-w-none -translate-x-1/2 lg:hidden"
      />

      <Container className="flex flex-col gap-12 lg:gap-20">
        <div className="flex w-[720px] max-w-full flex-col gap-5 lg:gap-6">
          <p className={`${H5} text-burnt`}>Getting here</p>
          <h2 className={H2}>{gettingHere.title}</h2>
          <div className="flex flex-col gap-5 text-base leading-normal lg:gap-7 lg:text-xl">
            {gettingHere.body.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
          <ul className="flex flex-col gap-4 text-base leading-normal lg:gap-6 lg:text-xl">
            {gettingHere.stops.map((stop, i) => {
              const icon = STOP_ICONS[i];
              return (
                <li key={stop.name} className="flex items-center gap-3">
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
                  <span>
                    <strong className="font-medium">{stop.name}</strong> — {stop.detail}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="text-base leading-normal lg:text-xl">{gettingHere.coda}</p>
        </div>
        {/* The frame's 240px image slot on the phone; the map rides over it. */}
        <div aria-hidden className="h-[240px] w-full lg:hidden" />
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------
   05 — Turraburra (Header / 5, 2033:5687 · 2576:22824) — full-bleed, copy
        right at 1440 and bottom-left on the phone
   ------------------------------------------------------------------------- */

export function WonderTurraburra() {
  return (
    <section
      id="turraburra"
      className={`relative flex min-h-svh items-end overflow-hidden bg-burnt pb-16 text-canvas lg:min-h-[720px] lg:pb-20 ${GUTTER}`}
    >
      <div className="absolute inset-0">
        <Slot slot={turraburraSlot} sizes={COVER_FULL_BLEED} />
      </div>
      <div aria-hidden className="absolute inset-0 bg-charcoal/10" />
      <WaveDrip ground="var(--color-charcoal)" />
      <Container className="flex flex-col lg:flex-row lg:items-start lg:gap-20">
        <div aria-hidden className="hidden min-w-0 flex-1 lg:block" />
        <div className="flex min-w-0 flex-1 flex-col gap-5 lg:gap-6">
          <h2 className={H2}>{turraburra.title}</h2>
          <p className="text-base leading-normal font-medium lg:text-xl">
            {turraburra.body}
          </p>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------
   06 — What a stay looks like (Layout / 18, 2033:5889 · 2576:22882) — the
        stage list
   ------------------------------------------------------------------------- */

function DottedLine() {
  return (
    /* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */
    <img
      src="/wonder/dotted-line.svg"
      alt=""
      aria-hidden
      className="block h-[7px] w-full lg:h-[10px]"
    />
  );
}

export function WonderStay() {
  return (
    <section
      id="experience"
      className={`relative bg-canvas py-10 text-charcoal lg:pt-28 lg:pb-[164px] ${GUTTER}`}
    >
      <Container width="max-w-[1040px]" className="flex flex-col gap-5 lg:gap-10">
        <div className="flex flex-col gap-5 lg:gap-6">
          <p className={`${H5} text-burnt`}>Itinerary</p>
          <h2 className={H2}>What a stay looks like</h2>
        </div>

        <div className="flex flex-col">
          <DottedLine />
          {stayStages.map((stage, i) => {
            const media = stayStageMedia[stage.title];
            return (
              <div key={stage.title}>
                {/* Native disclosure — works before hydration, no client
                    boundary (see components/ui/Disclosure). The first stage
                    opens as the frame shows it. */}
                <details className="group py-5 lg:py-12" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 lg:gap-8 [&::-webkit-details-marker]:hidden">
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
                      <span className={H3}>{stage.title}</span>
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
                    <img
                      src="/wonder/chevron-up.svg"
                      alt=""
                      aria-hidden
                      className="h-8 w-[33px] shrink-0 rotate-180 transition-transform duration-(--dur-small) ease-quiet group-open:rotate-0"
                    />
                  </summary>

                  <div className="flex flex-col gap-5 pt-5 lg:flex-row lg:items-start lg:gap-10 lg:pt-[30px]">
                    <div className="flex min-w-0 flex-1 flex-col gap-4 text-base leading-normal font-medium lg:text-xl">
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
                        <p className="callout text-scroll text-burnt">{stage.coda}</p>
                      ) : null}
                    </div>
                    <div className="relative h-[200px] w-full min-w-0 overflow-hidden rounded-3xl lg:h-[400px] lg:w-auto lg:flex-1">
                      {media ? (
                        <Slot slot={media} sizes="(min-width: 1024px) 500px, 100vw" />
                      ) : null}
                    </div>
                  </div>
                </details>
                <DottedLine />
              </div>
            );
          })}
        </div>
      </Container>
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
    <section className="relative flex flex-col items-center gap-12 bg-evergreen px-5 py-16 text-canvas lg:gap-14 lg:px-[120px] lg:py-24">
      <WaveDivider ground="var(--color-evergreen)" />
      <Container className="flex flex-col items-center">
        <div className="flex w-full max-w-[768px] flex-col items-center gap-3 lg:gap-4">
          <p className={`${H5} text-gold text-center`}>{beforeYouCome.eyebrow}</p>
          <div className="flex w-full flex-col items-center gap-5 lg:gap-10">
            <h2 className={`${H2} text-center`}>{beforeYouCome.title}</h2>
            {/* `max-w-full` on the cells is a guard: a 378px cell in a
                narrower column with nothing clipping it pans the whole
                document sideways. On the phone the cells are full-width. */}
            {[row1, row2].map((row, i) => (
              <dl key={i} className="flex w-full flex-col gap-6 lg:w-auto lg:flex-row">
                {row.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex w-full max-w-full flex-col gap-2 lg:w-[378px]"
                  >
                    <dt className={`${H5} text-gold`}>{fact.label}</dt>
                    <dd className="text-base leading-normal lg:text-lg">{fact.value}</dd>
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
      <BlobButton href={beforeYouCome.action.href} tone="oxide">
        {beforeYouCome.action.label}
      </BlobButton>
    </section>
  );
}

/* -------------------------------------------------------------------------
   08 — Where you sleep (Layout / 267, 2033:6782 · Team / 10, 2576:22530) —
        two 400px cards, a 200px swipe rail on the phone
   ------------------------------------------------------------------------- */

export function WonderWhereYouSleep() {
  return (
    <section
      className={`relative bg-canvas py-10 text-charcoal lg:pt-[120px] lg:pb-28 ${GUTTER}`}
    >
      {/* The evergreen drips down into the canvas (frame wave 2033:6770). */}
      <WaveDrip ground="var(--color-evergreen)" />
      <Container className="flex flex-col gap-6 lg:gap-10">
        <div className="flex w-[720px] max-w-full flex-col gap-5 lg:gap-4">
          <h2 className={H2}>{whereYouSleep.title}</h2>
          <p className="text-base leading-normal font-medium">{whereYouSleep.body}</p>
        </div>
        <CardRail
          bleed={RAIL_BLEED}
          columns="sm:grid-cols-2"
          gap="sm:gap-6 lg:gap-12"
          label="Where you sleep"
        >
          {whereYouSleepMedia.map((slot) => (
            <div
              key={slot.id}
              className="relative min-h-[200px] min-w-0 overflow-hidden rounded-3xl lg:min-h-[400px]"
            >
              <Slot slot={slot} sizes="(min-width: 1024px) 620px, 78vw" />
              <div aria-hidden className="absolute inset-0 bg-charcoal/10" />
            </div>
          ))}
        </CardRail>
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
    <section
      className={`relative flex min-h-svh items-end overflow-hidden bg-evergreen pb-16 text-canvas lg:min-h-[720px] lg:pb-28 ${GUTTER}`}
    >
      <div className="absolute inset-0">
        <Slot slot={whatItIsLikeSlot} sizes={COVER_FULL_BLEED} />
      </div>
      <div aria-hidden className="absolute inset-0 bg-charcoal/10" />
      <WaveDrip ground="var(--color-canvas)" />
      <Container className="flex flex-col lg:flex-row lg:items-start lg:gap-20">
        <div aria-hidden className="hidden min-w-0 flex-1 lg:block" />
        <div className="flex min-w-0 flex-1 flex-col gap-5 lg:gap-6">
          <h2 className={H2}>{whatItIsLike.title}</h2>
          <ul className="text-base leading-normal font-medium lg:text-xl">
            {whatItIsLike.points.map((point) => (
              <li key={point}>· {point}</li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------
   10 — Your hosts (Layout / 267, 2033:7003 · Team / 10, 2576:24677) — copy
        left, one card right; stacked on the phone
   ------------------------------------------------------------------------- */

export function WonderHosts() {
  return (
    <section
      className={`relative bg-canvas pt-10 pb-16 text-charcoal lg:py-28 ${GUTTER}`}
    >
      <WaveDivider ground="var(--color-canvas)" />
      <Container className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
        <div className="flex min-w-0 flex-1 flex-col gap-5 lg:gap-4">
          <p className={`${H5} text-burnt`}>Your hosts</p>
          <h2 className={H2}>{whoYouAreWith.title}</h2>
          <p className="text-base leading-normal font-medium lg:text-xl">
            {whoYouAreWith.body}
          </p>
        </div>
        <div className="relative h-[200px] w-full min-w-0 overflow-hidden rounded-3xl lg:h-[400px] lg:w-auto lg:flex-1">
          <Slot slot={hostsSlot} sizes="(min-width: 1024px) 620px, 100vw" />
          <div aria-hidden className="absolute inset-0 bg-charcoal/10" />
        </div>
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
      className={`relative bg-canvas pt-10 pb-16 text-charcoal lg:pt-[120px] lg:pb-[160px] ${GUTTER}`}
    >
      <Container className="flex flex-col gap-6 lg:gap-10">
        <div className="flex flex-col gap-5 lg:gap-4">
          {/* 16 on both frames — the one eyebrow that does not step up. */}
          <p className="font-eyebrow text-base leading-[1.4] font-extrabold text-burnt uppercase">
            From Country
          </p>
          <h2 className={H2}>{wonderStories.title}.</h2>
        </div>
        <CardRail
          bleed={RAIL_BLEED}
          columns="sm:grid-cols-2 lg:grid-cols-3"
          gap="sm:gap-6 lg:gap-12"
        >
          {wonderStories.items.map((item, i) => {
            const media = wonderStoryMedia[i];
            return (
              <article
                key={item.href}
                className="flex min-w-0 flex-col overflow-hidden rounded-3xl bg-charcoal text-canvas"
              >
                <div className="relative h-[240px] w-full lg:h-[320px]">
                  <Slot slot={media} sizes="(min-width: 1024px) 400px, 78vw" />
                </div>
                <div className="flex flex-col items-start gap-4 p-6 lg:px-9 lg:py-10">
                  <Chip>{item.tag.replace("#", "")}</Chip>
                  <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-4">
                      <h3 className={H3}>{item.title}</h3>
                      <p className="text-base leading-normal font-medium">
                        {item.summary}
                      </p>
                    </div>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-2 font-eyebrow text-base leading-normal font-bold text-gold uppercase"
                    >
                      Read the story
                      {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
                      <img
                        src="/wonder/chevron-right.svg"
                        alt=""
                        aria-hidden
                        className="size-6 transition-transform duration-(--dur-small) ease-quiet group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </CardRail>
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
    <section className="relative flex flex-col items-center gap-12 bg-roasted px-5 pt-16 pb-28 text-canvas lg:gap-14 lg:px-[120px] lg:pt-20 lg:pb-[300px]">
      <WaveDivider ground="var(--color-roasted)" />
      <Container className="flex flex-col items-center">
        <div className="flex w-full max-w-[768px] flex-col items-center gap-3 lg:gap-4">
          <p className={`${H5} text-center text-gold`}>{wonderClose.eyebrow}</p>
          <div className="flex w-full flex-col items-center gap-5 lg:gap-6">
            <h2 className={`${H2} text-center`}>{wonderClose.title}</h2>
            <p className="text-center text-base leading-normal lg:text-xl">
              {wonderClose.body}
            </p>
            <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
              {wonderClose.facts.map((fact) => (
                <Chip key={fact}>{fact}</Chip>
              ))}
            </div>
            <p className="text-center text-lg leading-normal lg:text-xl">
              {wonderClose.download}
            </p>
            <p className="text-center text-lg leading-normal lg:text-xl">
              {wonderClose.note}
            </p>
          </div>
        </div>
      </Container>
      <div className="flex flex-col items-center gap-6 lg:flex-row">
        <BlobButton href="/connect" tone="oxide">
          Register your interest
        </BlobButton>
        {/* R14 — no brochure file exists yet; the shape renders held. */}
        <BlobHold>Download the brochure</BlobHold>
      </div>
    </section>
  );
}
