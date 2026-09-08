import Image from "next/image";
import Link from "next/link";
import { photoById } from "@/content/kit";
import { SignupField } from "@/components/ui/SignupField";
import { RangerCarousel } from "./RangerCarousel";
import {
  challengeGroups,
  challenges,
  getInvolved,
  infrastructure,
  livingWorkHero,
  outputs,
  outputsNote,
  outputsRestsOn,
  outputsStandfirst,
  rangers,
  workStreams,
} from "@/content/living-work";

/**
 * /living-work — the markup. Verb: ACCUMULATES.
 *
 * Built to `03 · Living Work · HI-FI · Desktop · the field notebook`
 * (Figma 2137:2613, 1440 × 18407 ≈ 2045vh, twelve sections).
 *
 * The server owns structure and stamps the `data-*` hooks the recipes in
 * src/lib/motion/recipes.ts read. Nothing here imports GSAP: with JavaScript
 * off this page is a readable document in the right order, which is both an
 * accessibility floor and the reason the reduced-motion cut works — the markup
 * IS the final state, and motion only ever animates toward it.
 *
 * PHOTOGRAPHY. The Living Work batch landed 2026-08-31 (gathered per slot —
 * see the manifest note in src/content/kit.ts). The hero is the hi-fi's own
 * 1.40.2 and BREATH is its 1.65.1. The spring frame is still a stand-in by
 * design: the restored waterhole holding water has never been photographed.
 *
 * Every media wrapper is stamped `data-motion` with the photo's grade so
 * grade-aware modules can hold a `frame` image plane still — the hero is a
 * portrait and the rule is the brief's own corollary, not a design choice.
 */

const HERO = photoById("lw-hero"); // frame — portrait; the plane holds
const PLAIN = photoById("lw-plain");
const BREAK = photoById("lw-escarpment-sunset"); // frame — escarpment country
const SPRING = photoById("lw-spring-dry");
const BREATH_FRAME = photoById("lw-seedhead"); // 1.65.1 — a hand and a seed head
const SUNSET = photoById("lw-sunset-grass"); // 1.76.2 — §09's opening band

/**
 * §06 stream photographs — one per stream, per the wireframe. The Living Work
 * batch was exported per slot (kit.ts manifest note): work1…work7 ARE streams
 * 01…07, so every row carries its own frame. Anchor tier (01, 04, 07 — the
 * correction pass's choice) bleeds to the viewport edge via stickyStreams'
 * `[data-frame]` hook; the rest sit inside the column.
 */
const STREAM_PHOTOS: Record<string, ReturnType<typeof photoById>> = {
  "01": photoById("lw-fire"),
  "02": photoById("lw-seed-collect"),
  "03": photoById("lw-seed-sort"),
  "04": photoById("lw-seed-grind"),
  "05": photoById("lw-regrowth-dusk"),
  "06": photoById("lw-yumba-sign"),
  "07": photoById("lw-seed-grind-2"),
};

/** The anchor streams — their frames bleed past the container to the
    viewport edge, on the side the image already sits. */
const STREAM_ANCHORS = new Set(["01", "04", "07"]);

/** The four figures of §02, counted DOWN — biggest first, so the sequence
    reads as a countdown that lands on 120, the figure whose 0 becomes the
    aperture onto the plain. All figures of return. */
const FIGURES = [
  { value: "8,870", caption: "hectares of Iningai Country" },
  { value: "2019", caption: "bought back for the Iningai people" },
  { value: "480", caption: "metre bore · one water system" },
  { value: "120", caption: "kilometres south to Barcaldine" },
] as const;

/** §08's fills, in the content file's order. The fifth has not started. */
const FILLS = [78, 58, 42, 26, 0];

/**
 * §08's vessel size — one continuous ramp, and it has to be.
 *
 * The names are `whitespace-nowrap` inside an `overflow-hidden` box, so a size
 * the column cannot hold is not a reflow, it is a word silently cut in half —
 * and the fill layer, the track and the gold tick all inherit the same box, so
 * the proportion reads wrong too.
 *
 * The previous `clamp(…,6.4vw,2.25rem) sm:text-6xl` stepped from 36px straight
 * to 60px at exactly 640, where the column is only ~592 wide. The longest name,
 * "Biological Sequestration" (24 characters), needs roughly 13.7em, so:
 *
 *   375  → column 327 → 23.9 max      1024 → column 896  → 65.4 max
 *   640  → column 592 → 43.2 max      1280 → column 1152 → 84.0 max
 *
 * This ramp runs 22px at 375 to the drawn 60px at 1280 and holds there, which
 * clears every one of those ceilings. If a longer name is ever added, re-run
 * the arithmetic — do not just raise the cap.
 */
const VESSEL_SIZE = "text-[clamp(1.25rem,calc(0.39rem+4.2vw),3.75rem)]";

/**
 * The page column, written once instead of eleven times.
 *
 * The frame's gutter is 100 on a 1440 artboard, giving 1240 of content;
 * `max-w-7xl` + `lg:px-16` gives 1152 and starts at x=144. That 88px is held
 * deliberately: it is the container every other hi-fi page uses and the one
 * `SiteFooter` uses, so matching the frame here would align this page to the
 * frame and misalign it from the site. Recorded for the review rather than
 * silently closed.
 *
 * The phone gutter stays `px-6` and does NOT take Wonder's 20 — Wonder had a
 * drawn 375 frame specifying it and Living Work has none, and px-6 is what the
 * global header and footer use at that width.
 */
const COLUMN = "mx-auto w-full max-w-7xl px-6 lg:px-16";

/* -------------------------------------------------------------------------
   01 — the hero
   ------------------------------------------------------------------------- */

export function LivingWorkHero() {
  return (
    <section
      id="hero"
      data-lw="hero"
      className="relative -mb-0.5 flex min-h-svh items-end overflow-hidden bg-charcoal"
    >
      {/* 1.40.2 — the subject sits right of centre and the headline never
          crosses her. Hold that relationship if the crop is ever adjusted:
          object-position keeps her right of centre when narrow viewports crop
          the sides, and the copy column below is capped so it stays left. */}
      {HERO ? (
        <div data-media data-plane="far" data-motion={HERO.grade} className="absolute inset-0">
          <Image
            src={HERO.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[68%_40%]"
          />
        </div>
      ) : null}

      {/* X5 — required wherever copy sits on media. Bottom-weighted, because
          that is where the copy is. Test against the brightest frame. */}
      <div
        data-scrim
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-charcoal via-charcoal/50 to-charcoal/20"
      />

      <div className={`relative ${COLUMN} pt-32 pb-16 lg:pb-32`}>
        <p className="eyebrow text-gold">{livingWorkHero.eyebrow}</p>
        {/* max-w keeps the headline in the left half — it must never cross
            the subject, whatever the copy does. */}
        <h1
          data-heading
          className="headline mt-6 max-w-xl text-h1 text-canvas lg:max-w-2xl"
        >
          {livingWorkHero.title}
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-canvas/85">
          {livingWorkHero.standfirst}
        </p>
      </div>

      {/* Marc's divider hands the photograph off into the page. The path's
          closing corner is pushed past the box on the left (x=-4) and below it
          (y=120): the supplied asset closed at x=1, which left a one-pixel
          column of photograph beside the fill at the left edge. */}
      <div
        data-wave
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 text-canvas"
      >
        {/* viewBox bottom sits just above where the path bottoms out (y≈105.3)
            so the fill overdraws the box's lower edge. The path's shallowest
            point (x=0, y≈93) leaves only ~11 units of flat fill above the
            box's bottom, so the seam cover below must stay thinner than that
            or it shows as a flat step at the left edge — hence the section's
            2px overlap into the next, and nothing taller. */}
        <svg
          viewBox="0 0 1442 104"
          preserveAspectRatio="none"
          className="block h-[9vw] w-full"
        >
          <path
            d="M1470 8C1427.5 -2.1 1377.2 -2.7 1334 6.6c-63.6 13.6-109.7 36-176.5 44.2-44.4 5.5-85.4 1.5-129.4-.3-59-2.3-111-.6-167.3 9.8-52.9 9.7-104.2 22.3-159.8 27.2-67.6 6-136.5-3.7-201.6-15.2C434.4 62 369.3 48.6 300.8 46.8 195.6 44 95.7 68.9 1 93.1L-4 94.4V120h1480V8Z"
            fill="currentColor"
          />
        </svg>
      </div>
      {/* Seam: the motion pass leaves a transform on [data-wave], promoting it
          to its own compositing layer, and the GPU can rasterise that layer's
          bottom edge a device pixel short of the section edge. The section's
          -mb-0.5 pulls the next section 2px up over this edge so the canvas
          fills overlap. 2px, not more: the wave's left edge has ~4px of flat
          fill on phones and anything taller reads as a step. */}
    </section>
  );
}

/* -------------------------------------------------------------------------
   02 — THE APERTURE
   ------------------------------------------------------------------------- */

/**
 * The 0 is a portal onto the plain.
 *
 * The photograph sits behind the figure and is clipped to an ellipse centred on
 * the `0`'s counter; the ellipse grows through three stages. The figure itself
 * is ordinary text in the display face — no SVG text, so it stays selectable
 * and the accessible name is just the number.
 *
 * `data-glyph` marks the `0` so the effect can measure its box rather than
 * trusting the design's fixed x=833. Block Berthold is gitignored (F5) and on a
 * machine without it the glyph is a different width, so measuring is what keeps
 * the portal inside the counter whichever face renders.
 */
/** The figure the section rests on with no JS — the countdown's own last
    frame: 120 with the plain showing through its 0. */
const APERTURE_REST = 3; // 120

/** Split a figure at its LAST zero — the 0 is the portal. 2019 is the only
    figure with digits after its aperture (2 · 0 · 19), which is why slicing
    the final character was wrong for it. */
function splitAtAperture(value: string): [string, string, string] {
  const i = value.lastIndexOf("0");
  if (i === -1) return [value, "", ""];
  return [value.slice(0, i), "0", value.slice(i + 1)];
}

export function LivingWorkAperture() {
  return (
    <section id="aperture" data-lw="aperture" className="relative min-h-svh bg-canvas">
      {/* The artist's ring as ground — a whisper on the canvas behind the
          countdown, per the 2 Sep hi-fi. White over cream so it reads as a
          lift, not a mark; data-artwork-drift hands it to the recipe's quiet
          scroll drift. The wrapper clips to the section's FIRST viewport —
          the pinned countdown's own frame — so the ring never bleeds into
          the tail where §03's hand-off rides up, and the offset never widens
          the page. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-svh overflow-hidden">
        <div
          data-artwork="ring-c"
          data-artwork-drift
          className="absolute top-[4%] -right-80 h-[1100px] w-[1100px] opacity-[0.11]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/artwork/ring-c.svg" alt="" className="h-full w-full brightness-0" />
        </div>
      </div>

      {/* The theater — the wide shot's final frame. NOT full-screen: a wide
          band with the section's own canvas (#F6F6EC) above and below, the way
          a cinema screen sits in a wall. Hidden at rest: the rest state is the
          crop inside 120's glyph below, and the motion pass grows the opening
          from that glyph until it fills this band. */}
      {PLAIN ? (
        <div
          data-aperture
          data-motion={PLAIN.grade}
          aria-hidden
          className="absolute inset-x-0 top-[16svh] h-[68svh] opacity-0"
        >
          {/* The reveal mask — a smooth, irregular blob in the brand's own
              furniture language (the wave, the Button/Blob). The 0 hands over
              to it and it grows until the photograph has the frame. Drawn
              freehand: an organic rounded shape, no motif, no geometry the
              cultural rules reserve. */}
          <svg aria-hidden width="0" height="0" className="absolute">
            <defs>
              <clipPath id="lw-zero-clip">
                <path
                  data-reveal-blob
                  d="M100 8 C150 2 185 30 192 75 C199 118 210 150 196 192 C182 232 148 260 104 258 C60 256 28 228 16 186 C4 145 8 104 22 66 C36 29 55 13 100 8 Z"
                />
              </clipPath>
            </defs>
          </svg>
          {/* §02 STAYS ON RAW <img>, deliberately.
              Every other photograph on this page moved to next/image on
              8 Sep. These three did not. They are three stacked copies of ONE
              asset (PLAIN), so the saving is a single image, and they are the
              geometry the aperture measures: two are clipped by `clip-path:
              url(#…)` against SVG paths in the same coordinate space, and the
              third is the plate the glyph zooms into. `fill` re-positions the
              element it is applied to, which is exactly what must not move
              here. Not worth the page's signature effect. */}
          {/* The full frame, fading in behind the zooming glyph. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-reveal-full
            src={PLAIN.src}
            alt=""
            width={PLAIN.width}
            height={PLAIN.height}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            data-reveal-clipped
            className="absolute inset-0 [clip-path:url(#lw-zero-clip)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PLAIN.src}
              alt=""
              width={PLAIN.width}
              height={PLAIN.height}
              className="h-full w-full object-cover"
            />
          </div>
          {/* X5 + the caption — one centred line low in the frame. */}
          <div data-band-dress aria-hidden className="absolute inset-0 opacity-0">
            <div className="absolute inset-0 bg-linear-to-t from-charcoal/50 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-[12%] px-6 text-center">
              <p className="eyebrow text-xs leading-relaxed text-gold">
                8,870 hectares of Iningai Country&ensp;&middot;&ensp;2019
                bought back for the Iningai people&ensp;&middot;&ensp;480
                metre bore, one water system&ensp;&middot;&ensp;120 kilometres
                south to Barcaldine
              </p>
            </div>
          </div>
          {/* The O of "Our challenges", as a letterform mask on THIS frame —
              it absorbs the wide shot at the end of the pin and lands in the
              ghost header below, which assembles around it before the scene
              closes; §03 then opens with the real heading in the same voice.
              One wide shot, one transition. */}
          <div data-o-ghost aria-hidden className="absolute inset-x-0 top-[6%] opacity-0">
            <div className={COLUMN}>
              <p data-ghost-item className="eyebrow text-burnt-deep opacity-0">
                Our challenges
              </p>
              <h2 className="headline mt-5 text-h2 text-evergreen">
                <span data-o-ghost-land className="inline-block">O</span>
                <span data-ghost-item className="opacity-0">ur challenges</span>
              </h2>
            </div>
          </div>
          <svg aria-hidden width="0" height="0" className="absolute">
            <defs>
              <clipPath id="lw-o-clip">
                <text data-o-glyph>O</text>
              </clipPath>
            </defs>
          </svg>
          <div
            data-o-shrink
            className="absolute inset-0 opacity-0 [clip-path:url(#lw-o-clip)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PLAIN.src}
              alt=""
              width={PLAIN.width}
              height={PLAIN.height}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      ) : null}

      {/* data-copy — everything the full-bleed hold clears off the screen. */}
      <div data-copy className={`relative ${COLUMN} pt-24 pb-16 lg:pt-32 lg:pb-24`}>
        <p data-fade className="eyebrow text-burnt-deep">The numbers</p>

        {/* The rail — the scroll progress bar, divided into four segments,
            one per figure; each fills across its own stretch of the pin.
            Rest state matches the design's own 04/04 frame. */}
        <div data-fade className="mt-6 flex items-center gap-2">
          {FIGURES.map((f, i) => (
            <span
              key={f.value}
              aria-hidden
              className="relative block h-0.5 w-10 overflow-hidden bg-burnt/20 sm:w-14"
            >
              <span
                data-seg-fill
                className={`absolute inset-0 origin-left bg-burnt-deep ${
                  i === APERTURE_REST ? "" : "scale-x-0"
                }`}
              />
            </span>
          ))}
          <span data-rail-count className="eyebrow ml-4 text-xs text-burnt-deep">
            {String(APERTURE_REST + 1).padStart(2, "0")} / {String(FIGURES.length).padStart(2, "0")}
          </span>
        </div>

        <div className="relative mt-16 h-[30vw] min-h-32 sm:min-h-64">
          {/* The live counter — the rolling number the countdown ticks
              through between the four figures. Motion-only. */}
          <p
            data-count-live
            aria-hidden
            className="headline absolute inset-0 text-center text-[20vw] leading-none text-evergreen opacity-0 sm:text-[16vw]"
          />
          {FIGURES.map((figure, i) => {
            const [before, zero, after] = splitAtAperture(figure.value);
            return (
              <p
                key={figure.value}
                data-figure
                data-value={figure.value.replace(/\D/g, "")}
                className={`headline absolute inset-0 text-center text-[20vw] leading-none text-evergreen sm:text-[16vw] ${
                  i === APERTURE_REST ? "" : "opacity-0"
                }`}
              >
                {/* The digits around the 0 get their own wrapper so the exit
                    can fade them while the 0 stays and becomes the reveal. */}
                {before ? <span data-figure-rest>{before}</span> : null}
                {/* Y1 — image-in-type, one per site, spent here. Two layers:
                    the solid ink glyph beneath, and the image-filled glyph
                    above it. At rest the fill shows (the design's own frame);
                    in motion the fill starts clipped away so the 0 stands in
                    font colour, then LIQUID-FILLS bottom-up mid-way through
                    120's stretch. */}
                <span data-zero className="relative inline-block">
                  {zero}
                  <span
                    data-zero-fill
                    aria-hidden
                    className="absolute inset-0 bg-cover bg-center bg-clip-text text-transparent"
                    style={PLAIN ? { backgroundImage: `url(${PLAIN.src})` } : undefined}
                  >
                    {zero}
                  </span>
                </span>
                {after ? <span data-figure-rest>{after}</span> : null}
              </p>
            );
          })}
        </div>

        <div data-fade className="mt-6 border-t border-burnt/50 pt-4">
          <div className="relative h-6">
            {FIGURES.map((figure, i) => (
              <p
                key={figure.value}
                data-figure-caption
                className={`eyebrow absolute inset-0 text-xs text-burnt-deep ${
                  i === APERTURE_REST ? "" : "opacity-0"
                }`}
              >
                {figure.caption}
              </p>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}

/* -------------------------------------------------------------------------
   03 — the challenges, on a ground that thins
   ------------------------------------------------------------------------- */

/**
 * One accordion band — a labelled, counted group of challenge rows. Native
 * `<details>` per the Disclosure rationale: works before hydration, browser
 * keyboard/AT behaviour, stays a server component. The first row of each band
 * ships open, per the 31 Aug hi-fi.
 */
function ChallengeGroup({ group }: { group: (typeof challengeGroups)[number] }) {
  return (
    <div data-cluster>
      <div className="flex items-baseline justify-between gap-6 border-b border-burnt/70 pb-2">
        <p className="eyebrow text-xs text-burnt-deep">{group.label}</p>
        <p className="eyebrow text-xs text-burnt-deep">
          {String(group.items.length).padStart(2, "0")}
        </p>
      </div>

      {group.items.map((index, i) => {
        const challenge = challenges[index];
        return (
          <details
            key={challenge.title}
            data-line
            open={i === 0 || undefined}
            className="group border-b border-evergreen/20"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
              <h3 className="headline text-xl text-evergreen sm:text-2xl">
                {challenge.title}
              </h3>
              <span
                aria-hidden
                className="shrink-0 text-2xl leading-none text-burnt-deep"
              >
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">&minus;</span>
              </span>
            </summary>
            {/* Damage left, response right — the lede explains the columns. */}
            <div className="grid gap-4 pb-8 sm:grid-cols-2 sm:gap-10">
              <p className="text-sm leading-relaxed text-evergreen/80">
                {challenge.problem}
              </p>
              <p className="text-sm leading-relaxed text-evergreen/80 sm:border-l sm:border-burnt/60 sm:pl-6">
                {challenge.response}
              </p>
            </div>
          </details>
        );
      })}
    </div>
  );
}

export function LivingWorkChallenges() {
  return (
    <section
      id="challenges"
      data-lw="challenges"
      data-ground
      className="relative overflow-hidden py-16 lg:py-32"
      /* The hi-fi frame's ground: bone thinning to dry earth down the section.
         The ramp animates only the deep end (--ground), so the rest state IS
         the wireframe gradient and motion darkens it from the bottom up. */
      style={{
        background:
          "linear-gradient(180deg, #f6f6ec 0%, #f5f3e8 22%, #efe9da 55%, #e7decb 80%, var(--ground, #e0d4bd) 100%)",
      }}
    >
      {/* The ring again — same whisper, same slow turn, so §02 and §03 read
          as one passage of ground. The section already clips. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          data-artwork="ring-c"
          data-artwork-drift
          className="absolute -top-48 -right-72 h-[1000px] w-[1000px] opacity-[0.11]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/artwork/ring-c.svg" alt="" className="h-full w-full brightness-0" />
        </div>
        <div
          data-artwork="ring-c"
          data-artwork-drift
          className="absolute bottom-[6%] -left-96 h-[900px] w-[900px] opacity-[0.09]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/artwork/ring-c.svg" alt="" className="h-full w-full brightness-0" />
        </div>
      </div>

      <div className={`relative ${COLUMN}`}>
        {/* data-handoff-title — this header exists for the document: with
            JavaScript off (or reduced motion) it is the section's heading.
            While motion runs, §02's aperture lands the O in ITS header and
            that one stays as the only title, so the motion pass suppresses
            this pair — rendering both would put "Our challenges" on the page
            twice. */}
        <p data-handoff-title className="eyebrow text-burnt-deep">Our challenges</p>
        <h2 data-handoff-title className="headline mt-5 max-w-3xl text-h2 text-evergreen">
          {/* [data-o-land] — the glyph the capture lands in. Measured, never
              hardcoded: the display face is gitignored (F5). */}
          <span data-o-land className="inline-block">O</span>ur challenges
        </h2>
        {/* ⚠ Design-proposal lede, authored on the hi-fi canvas. */}
        <p data-fade-seq className="mt-6 max-w-2xl text-lg leading-relaxed text-evergreen/80">
          What the work is up against. Every one of these is a piece of damage
          and a response to it &mdash; the left column is what happened to
          Country, the right is what the Rangers do about it.
        </p>

        <div data-fade-seq className="mt-16 space-y-16">
          {challengeGroups.slice(0, 2).map((group) => (
            <ChallengeGroup key={group.label} group={group} />
          ))}
        </div>
      </div>

      {/* The landscape that splits the bands — the plain the rows describe. */}
      {BREAK ? (
        <div className="relative my-24 h-[70svh] overflow-hidden">
          <div data-frame data-motion={BREAK.grade} className="absolute inset-0">
            <Image
              data-frame-media
              src={BREAK.src}
              alt={BREAK.subject}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          {/* data-frame-caption — settles in as the frame finishes opening. */}
          <p
            data-frame-caption
            className="absolute bottom-6 left-6 text-sm text-canvas/90 lg:left-16"
          >
            The plain from the escarpment.
          </p>
        </div>
      ) : null}

      <div className={`relative ${COLUMN}`}>
        <div className="space-y-16">
          {challengeGroups.slice(2).map((group) => (
            <ChallengeGroup key={group.label} group={group} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   04 — the Rangers, the page's second dark beat
   ------------------------------------------------------------------------- */

/**
 * Hi-fi §04. Charcoal, the page's second dark beat: the artist's wave rule
 * over the header, a motif ground bleeding in from the left, and the seven
 * ranger slots as a drag strip with an edge fade saying the strip continues.
 *
 * ⚠ Ranger names, identification and consent to be named and photographed are
 * all still to come — the slots are built at full size to receive them. The
 * on-page warning was removed by request (31 Aug); this note is now the only
 * record. Two frames (visiting-group, walking-the-country) include visiting
 * children; the consent question is still open.
 *
 * The artwork is supplied vectors placed whole — `data-artwork` marks them for
 * the motion pass (▲ wave rule draw-in and motif drift are on Leonard's
 * sign-off queue; until then they hold still, which is the cleared fallback).
 */
const RANGER_STRIP: { photo: ReturnType<typeof photoById>; caption: string }[] = [
  { photo: photoById("lw-rangers1"), caption: "Out on Country" },
  { photo: photoById("lw-rangers5"), caption: "Showing plants to a visiting group" },
  { photo: photoById("lw-rangers3"), caption: "Nursery work under shade cloth" },
  { photo: photoById("lw-rangers4"), caption: "Seedlings into trays" },
  { photo: photoById("lw-seed-collect"), caption: "Seed collecting in the scrub" },
  { photo: photoById("lw-rangers2"), caption: "Walking the country" },
  { photo: undefined, caption: "At the escarpment" }, // 1.82.1 — not yet gathered
];

export function LivingWorkRangers() {
  return (
    <section id="rangers" data-lw="rangers" className="relative overflow-hidden bg-charcoal py-16 lg:py-32">
      {/* ▲ ARTWORK — supplied motif, whole. data-media/data-plane hand it to
          fullBleedOpen's plateParallax: the ring drifts against the scroll on
          the near plane, which is the drift the sign-off queue was holding —
          now requested directly (1 Sep). */}
      <div
        data-artwork="motif"
        data-media
        data-plane="near"
        aria-hidden
        className="pointer-events-none absolute top-44 -left-[420px] h-[1000px] w-[1000px] opacity-[0.06]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/artwork/ring-b.svg" alt="" className="h-full w-full" />
      </div>

      <div className={`relative ${COLUMN}`}>
        {/* ▲ ARTWORK — the wave rule. Draw-in is on the sign-off queue. */}
        <div data-artwork="wave-rule" aria-hidden className="mb-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/artwork/dots-wave.svg" alt="" className="w-full max-w-5xl" />
        </div>

        <p className="eyebrow text-burnt">The Rangers</p>
        <h2
          data-heading
          className="headline mt-5 max-w-3xl text-h2 text-canvas"
        >
          {rangers.title}
        </h2>
        <p className="mt-6 max-w-4xl text-lg leading-relaxed text-canvas/80">
          {rangers.body}
        </p>
      </div>

      {/* The carousel — an infinite belt of cards riding a circular arc, with
          the in-place profile overlay behind each. The cards deliberately do
          NOT carry data-media: the recipe's plateParallax would fight the arc
          transforms the client owns. */}
      <div className="mt-12">
        <RangerCarousel slots={[...RANGER_STRIP]} profileBody={rangers.body} />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   05 — THE SPRING, the pinned moment
   ------------------------------------------------------------------------- */

/**
 * Eight days. The only place on this page where scroll controls time.
 *
 * ⚠ The hi-fi marks its photograph a STAND-IN: "the dry creek · brief: the
 * restored waterhole holding water, never photographed". The frame that belongs
 * here does not exist yet, and the section says so rather than pretending.
 */
export function LivingWorkSpring() {
  const days = Array.from({ length: 8 }, (_, i) => i + 1);
  const springStream = workStreams.find((stream) => stream.number === "02");
  // The hi-fi splits the draft's stream-02 story across the pinned moment: the
  // set-up reads at the top, and "Eight days in…" is withheld until day 08.
  // Split on the draft's own sentence so the copy itself stays D5-governed.
  const detail = springStream?.detail ?? "";
  const releaseAt = detail.indexOf("Eight days in");
  const setup = releaseAt > 0 ? detail.slice(0, releaseAt).trim() : detail;
  const release = releaseAt > 0 ? detail.slice(releaseAt).trim() : "";
  return (
    <section
      id="spring"
      data-lw="spring"
      className="relative -mb-0.5 flex min-h-svh items-center overflow-hidden bg-charcoal"
    >
      {SPRING ? (
        <div data-media data-motion={SPRING.grade} aria-hidden className="absolute inset-0">
          <Image
            src={SPRING.src}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      {/* X5 — copy sits on media, so the photo carries a scrim. The hi-fi
          (2137:2617) overlays a neutral dark gradient, not an evergreen tint —
          the photograph keeps its own colour under it. Darkest on the RIGHT —
          it keeps the right-side text legible — and permanent: part of the
          image, never lifted by the motion pass. */}
      <div
        data-scrim
        aria-hidden
        className="absolute inset-0 bg-linear-to-l from-charcoal/25 via-charcoal/60 to-charcoal"
      />

      {/* Bottom padding clears the wave (7.3vw tall) plus breathing room, so
          the stand-in note never sits under the crest on short viewports. */}
      <div className={`relative ${COLUMN} pt-16 pb-[calc(7.3vw+3rem)] lg:pt-20`}>
        {/* Hi-fi 2137:2617 sets this eyebrow in gold and names the stream the
            moment belongs to. */}
        <p className="eyebrow text-gold">The spring · Stream 02</p>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-canvas/85">
          {setup}
        </p>

        {/* The counter — DAY / numeral / rule / OF EIGHT, per the hi-fi frames.
            The board reads two digits, but only the units flap turns: the
            leading 0 is a fixed plate, the way an airport board leaves settled
            digits alone. The step stack sizes the row; the 0 sits beside it. */}
        <div className="mt-12 max-w-sm lg:mt-16">
          <p className="eyebrow text-xs text-gold">Day</p>
          <div className="mt-3 flex items-start">
            <p
              aria-hidden
              className="headline text-[10vw] leading-none text-canvas min-[1440px]:text-9xl"
            >
              0
            </p>
            {/* The stack is sized by an invisible in-flow digit so its box is
                exactly one glyph tall — the flap then hinges at the digit's
                own middle instead of a taller container's top edge, which
                left the turning number floating above the zero. */}
            <div className="relative flex-1 [perspective:800px]">
              <p
                aria-hidden
                className="headline invisible text-[10vw] leading-none min-[1440px]:text-9xl"
              >
                8
              </p>
              {days.map((day) => (
                <p
                  key={day}
                  data-step
                  className="headline absolute inset-0 text-[10vw] leading-none text-canvas backface-hidden min-[1440px]:text-9xl"
                >
                  {day}
                </p>
              ))}
            </div>
          </div>
          <div aria-hidden className="mt-8 h-px w-full bg-gold/80" />
          <p className="eyebrow mt-4 text-xs text-gold">Of eight</p>
        </div>

        {/* The payoff — held back until day 08 by the motion pass; with
            JavaScript off it simply reads in order, which is the final state. */}
        <div data-release className="mt-12 max-w-2xl lg:mt-16">
          <p className="eyebrow text-xs text-gold">On release</p>
          <p className="mt-4 text-2xl leading-snug text-canvas sm:text-3xl">
            {release}
          </p>
        </div>

        {/* Hi-fi 2137:2617 sets the stand-in note as a gold eyebrow annotation,
            ◇-marked with the frame reference — not faded body text. */}
        <p className="eyebrow mt-10 max-w-xl text-xs leading-relaxed text-gold">
          &#9671; Stand-in &middot; 1.87.1 the dry creek &mdash; the restored
          waterhole holding water has never been photographed
        </p>
      </div>

      {/* The wave hands the photograph off into the canvas section below —
          frame 2195:2829's own path. Static: pinnedCount does not animate it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 text-canvas"
      >
        {/* viewBox bottom sits just above where the path bottoms out (y≈105.3)
            so the fill overdraws the box's lower edge — same trick as the hero
            wave; at the path's own depth, rounding left a hairline of
            photograph under the crest on windowed widths. */}
        <svg
          viewBox="0 0 1440 104"
          preserveAspectRatio="none"
          className="block h-[7.3vw] w-full"
        >
          <path
            d="M1469.04 7.9544C1426.51 -2.1372 1376.18 -2.66008 1332.96 6.57748C1269.32 20.155 1223.29 42.5343 1156.49 50.8132C1112.11 56.3209 1071.13 52.2598 1027.08 50.5343C968.069 48.2162 916.126 51.1444 859.791 61.48C806.923 71.1707 755.575 83.7895 699.999 88.7046C632.371 94.6829 563.487 84.9573 498.434 73.4888C433.382 62.0203 368.263 48.5648 299.776 46.7696C194.602 44.0157 94.7447 68.87 0.0055774 93.1491L0.00122744 105.324H1467.85L1469.04 7.97183V7.9544Z"
            fill="currentColor"
          />
        </svg>
      </div>
      {/* 2px overlap into the next section — see the hero wave's note. */}
    </section>
  );
}

/* -------------------------------------------------------------------------
   06 + 07 — the work, and what it takes
   ------------------------------------------------------------------------- */

export function LivingWorkStreams() {
  return (
    <section
      id="streams"
      data-lw="streams"
      className="relative overflow-x-clip bg-canvas py-16 lg:py-32"
    >
      <div className={COLUMN}>
        <p className="eyebrow text-burnt-deep">The work</p>
        <h2 className="headline mt-5 max-w-3xl text-h2 text-evergreen">
          The work
        </h2>
        {/* ⚠ Design-proposal standfirst, authored on the wireframe. */}
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-evergreen/80">
          What Rangers do on the ground. Seven streams, running at once, all
          year.
        </p>

        <div className="mt-16">
          {workStreams.map((stream, i) => {
            const photo = STREAM_PHOTOS[stream.number];
            const anchor = STREAM_ANCHORS.has(stream.number);
            /* Alternation — odd streams carry the image right, even left;
               anchors bleed on the side they already sit. */
            const imageRight = i % 2 === 0;
            return (
              <article
                key={stream.number}
                data-stream
                data-tier={anchor ? "anchor" : i < 5 ? "mid" : "detail"}
                className="grid items-start gap-10 border-t border-evergreen/20 py-14 first:border-t-0 lg:grid-cols-2 lg:gap-16"
              >
                <div className={`flex gap-6 ${imageRight ? "" : "lg:order-2"}`}>
                  <p className="headline w-10 shrink-0 text-2xl text-burnt-deep">
                    {stream.number}
                  </p>
                  <div>
                    <h3 className="headline text-2xl text-evergreen sm:text-3xl">
                      {stream.title}
                    </h3>
                    <p className="mt-5 max-w-md text-sm leading-relaxed text-evergreen/80">
                      {stream.lede}
                    </p>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-evergreen/80">
                      {/* ⚠ Stream 02's detail is the spring story, told in
                          full at §05's pinned moment above — the wireframe
                          points back at it rather than repeating it. */}
                      {stream.number === "02"
                        ? "The spring above is one of them."
                        : stream.detail}
                    </p>
                    {stream.number === "06" ? (
                      /* WHAT STAYS HERE — the lo-fi's governance framing:
                         knowledge that belongs to this Country and does not
                         travel. A label, not a link — it has no destination
                         until that page exists. */
                      <div className="mt-8">
                        <div aria-hidden className="h-px w-32 bg-burnt" />
                        <p className="eyebrow mt-3 text-xs text-burnt-deep">
                          What stays here
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>

                {photo ? (
                  /* Every frame gets stickyStreams' scrubbed frameOpen reveal
                     (clip opens, media counter-scales — the Lumen move).
                     Anchors are [data-frame]; their edge-bleed is this rest
                     state's own negative margin, not a tween. Non-anchors are
                     [data-media]: in-column, same reveal. */
                  <div
                    {...(anchor ? { "data-frame": true } : { "data-media": true })}
                    data-motion={photo.grade}
                    data-reveal-edge={imageRight ? "right" : "left"}
                    className={`relative overflow-hidden ${
                      imageRight ? "" : "lg:order-1"
                    } ${
                      anchor
                        ? imageRight
                          ? "h-[40svh] min-h-64 lg:mr-[calc(-1*(max((100vw-80rem)/2,0px)+4rem))]"
                          : "h-[40svh] min-h-64 lg:ml-[calc(-1*(max((100vw-80rem)/2,0px)+4rem))]"
                        : "aspect-[3/2] max-h-[52svh]"
                    }`}
                  >
                    <Image
                      data-frame-media
                      src={photo.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   07 — infrastructure, what it takes
   ------------------------------------------------------------------------- */

/**
 * Hi-fi §07. Evergreen — with §08's charcoal it reads as one dark passage, the
 * technical end of the argument. Twenty-three facts met four to eight at a
 * time: two blocks per row, a rule under every line, and a sticky WHAT IT
 * TAKES index at the left edge. The artist's Dots / Rule sits whole under the
 * header — the one place on the page it appears.
 *
 * The index lighting as pairs pass is the motion pass's job (sticky, not
 * pinning — the page's one pin stays at §05). Statically the index renders
 * with the first pair lit, which is the design's own rest state.
 */
export function LivingWorkInfrastructure() {
  return (
    <section
      id="infrastructure"
      data-lw="infrastructure"
      className="relative bg-evergreen py-16 lg:py-32"
    >
      <div className={COLUMN}>
        <p className="eyebrow text-gold">Infrastructure</p>
        <h2 className="headline mt-5 max-w-4xl text-h2 text-canvas">
          Infrastructure and technology
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-canvas">
          What it takes to run a property 120 kilometres from the nearest town.
        </p>

        {/* Dots / Rule — the artist's dotted divider, used whole. */}
        <div data-artwork="dots-rule" aria-hidden className="mt-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/artwork/dots-rule.svg" alt="" className="w-full" />
        </div>

        <div className="mt-16 lg:flex lg:gap-[82px]">
          <aside className="hidden lg:sticky lg:top-32 lg:block lg:h-fit lg:w-[258px] lg:shrink-0">
            <p className="eyebrow text-xs text-canvas/45">What it takes</p>
            <ol className="mt-6 space-y-4">
              {/* Rest state IS the wireframe's own frame: the first pair lit,
                  the rest dimmed with their bars retracted. The motion pass
                  (whatItTakes) re-lights pairs as their grid row passes —
                  every item carries its bar so any row can take the light. */}
              {infrastructure.map((block, i) => (
                <li
                  key={block.title}
                  data-index-item
                  className={`relative pl-5 text-xs tracking-[0.08em] text-canvas uppercase ${
                    i < 2 ? "" : "opacity-30"
                  }`}
                >
                  <span
                    data-index-bar
                    aria-hidden
                    className={`absolute top-0 left-0 h-[18px] w-0.5 origin-top bg-gold ${
                      i < 2 ? "" : "scale-y-0"
                    }`}
                  />
                  {String(i + 1).padStart(2, "0")} &nbsp;{block.title}
                </li>
              ))}
            </ol>
          </aside>

          <div className="grid flex-1 gap-x-[60px] gap-y-20 sm:grid-cols-2">
            {infrastructure.map((block, i) => (
              <div key={block.title} data-infra-block>
                <p className="eyebrow text-xs text-gold">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="headline mt-3 text-2xl text-canvas lg:text-[28px]">
                  {block.title}
                </h3>
                <ul className="mt-5">
                  {block.points.map((point) => (
                    <li
                      key={point}
                      className="border-b border-canvas/15 py-3 text-base leading-relaxed text-canvas/85"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
                {block.note ? (
                  <p className="mt-4 text-sm leading-relaxed text-canvas/60">
                    {block.note}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   07b — BREATH
   ------------------------------------------------------------------------- */

/**
 * The hinge between the apparatus and what it earns.
 *
 * One photograph, held, no caption. After 360vh of streams and index the page
 * stops talking for half a screen. This section is the reason the ones either
 * side of it land, and it is a scene rather than padding — `breath` cites the
 * grammar's "the rest" row like anything else.
 */
export function LivingWorkBreath() {
  return (
    <section id="breath" data-lw="breath" className="relative h-[47svh] overflow-hidden bg-charcoal">
      {BREATH_FRAME ? (
        <div data-media data-motion={BREATH_FRAME.grade} className="absolute inset-0">
          <Image
            src={BREATH_FRAME.src}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ) : null}
    </section>
  );
}

/* -------------------------------------------------------------------------
   08 — what the work produces
   ------------------------------------------------------------------------- */

/**
 * Five vessels, four filling.
 *
 * ⚠ R14 — every status label here is an unconfirmed public claim about
 * registration and legal status. The draft's own note renders underneath, and
 * the labels come from the content file so they change in one place when the
 * client confirms them.
 */
/**
 * Hi-fi §08, third redesign — the vessels. Charcoal, so §07 + §08 read as one
 * dark passage. Each of the five names is set solid to where the work has got
 * and outline for what is still to come; a track and a gold stop mark the same
 * point; the status is Marc's Button / Blob, stroke only — drawn, not filled,
 * which is the right weight for an unconfirmed claim (R14). Above each word,
 * WHAT IT RESTS ON names the physical evidence — the §06 apparatus.
 *
 * Every name is measured against itself. No shared scale is claimed, because
 * none exists; no percentage appears anywhere. The last thing you see is a
 * hollow word on an empty track — the honest state of Rainbow Credits.
 *
 * The artist's rings and dot wave are the ground, never furniture: whole
 * instances at single-digit opacity, static (`data-artwork`).
 */
export function LivingWorkOutputs() {
  return (
    <section
      id="outputs"
      data-lw="outputs"
      className="relative overflow-hidden bg-charcoal py-16 lg:py-32"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div data-artwork="ring-b" className="absolute -top-28 right-0 h-[1000px] w-[1000px] translate-x-1/3 opacity-[0.09]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/artwork/ring-b.svg" alt="" className="h-full w-full" />
        </div>
        <div data-artwork="ring-a" className="absolute top-[45%] -left-48 h-[640px] w-[707px] opacity-[0.07]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/artwork/ring-a.svg" alt="" className="h-full w-full" />
        </div>
        <div data-artwork="dots-wave" className="absolute bottom-10 -left-20 w-[120%] opacity-[0.11]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/artwork/dots-wave.svg" alt="" className="w-full" />
        </div>
      </div>

      <div className={`relative ${COLUMN}`}>
        <p className="eyebrow text-gold">What it adds up to</p>
        <h2 className="headline mt-5 max-w-4xl text-h2 text-canvas">
          What the work produces
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-canvas">
          The same activities, measured.
        </p>
        {/* ⚠ Design-proposal copy, for sign-off — see content/living-work.ts. */}
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-canvas/65">
          {outputsStandfirst}
        </p>

        <div className="mt-14 border-t border-canvas/15" aria-hidden />

        <div className="mt-4 space-y-20">
          {outputs.map((output, i) => {
            const fill = FILLS[i];
            const empty = fill === 0;
            return (
              <div key={output.title} className="relative">
                <p
                  className={`eyebrow text-xs ${empty ? "text-gold/40" : "text-gold/85"}`}
                >
                  {outputsRestsOn[output.title] ?? ""}
                </p>

                {/* The vessel — solid to where the work has got, outline for
                    what is still to come. Rest state IS the final fill; the
                    motion pass scrubs toward it, never past it. */}
                <div className="mt-3 inline-block max-w-full align-top">
                  <div
                    data-vessel
                    data-fill={fill}
                    className="relative overflow-hidden whitespace-nowrap"
                  >
                    <span
                      aria-hidden
                      className={`headline block ${VESSEL_SIZE} text-transparent [-webkit-text-stroke:1px_rgba(246,246,236,0.32)]`}
                    >
                      {output.title}
                    </span>
                    <span
                      data-vessel-fill
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: `${fill}%` }}
                    >
                      <span className={`headline block ${VESSEL_SIZE} whitespace-nowrap text-canvas`}>
                        {output.title}
                      </span>
                    </span>
                    {/* Accessible name, once — the two layers above are drawing. */}
                    <span className="sr-only">{output.title}</span>
                  </div>

                  {/* The track: the whole word is the whole job. */}
                  <div className="relative mt-3 h-px w-full bg-canvas/20">
                    {empty ? null : (
                      <>
                        <div
                          data-vessel-track
                          className="absolute top-0 left-0 h-px bg-gold/85"
                          style={{ width: `${fill}%` }}
                        />
                        <div
                          aria-hidden
                          className="absolute -top-4 h-4 w-px bg-gold/85"
                          style={{ left: `${fill}%` }}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Status — Button / Blob, stroke only. R14 on every label. */}
                <div className="mt-6 flex flex-wrap items-start justify-between gap-8">
                  <p
                    className={`max-w-2xl text-base leading-relaxed ${
                      output.unwritten ? "text-canvas/40" : "text-canvas/80"
                    }`}
                  >
                    {output.body}
                  </p>
                  <div className="relative h-11 w-[246px] shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={empty ? "/brand/button-blob-muted.svg" : "/brand/button-blob.svg"}
                      alt=""
                      className="absolute inset-0 h-full w-full"
                    />
                    <p
                      className={`eyebrow absolute inset-0 flex items-center justify-center text-xs ${
                        empty ? "text-canvas/40" : "text-gold/90"
                      }`}
                    >
                      {output.status}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-16 max-w-2xl text-sm text-canvas/50 italic">
          {outputsNote}
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   09 — get involved
   ------------------------------------------------------------------------- */

/**
 * Hi-fi §09, second review — the real card. `Card / Story — no image`:
 * radius 24, padding 36, glyph, gold audience eyebrow, an 84px bottom-aligned
 * title box so one- and two-line titles share a baseline, and the CTA pinned
 * to the card bottom so all three land on the same y whatever the copy does.
 *
 * The grounds are decorative here and carry no meaning — on Truth the same
 * card's ground is era-coded, and a reader of both pages must not assume this
 * one is too. Charcoal sits last so the row hands off into the footer. The
 * glyphs are the artist's three existing motifs, placed whole — nothing drawn.
 */
const PATH_PRESENTATION = [
  { audience: "For other ranger groups", ground: "bg-evergreen", glyph: "/artwork/glyph-a.svg" },
  { audience: "For funders and partners", ground: "bg-roasted", glyph: "/artwork/glyph-c.svg" },
  { audience: "For properties in the district", ground: "bg-charcoal", glyph: "/artwork/glyph-b.svg" },
] as const;

export function LivingWorkInvitation() {
  return (
    <section id="invitation" data-lw="invitation" className="relative bg-canvas pb-16 lg:pb-32">
      {/* 1.76.2 — country at sunset. M1 push-in belongs to the motion pass. */}
      {SUNSET ? (
        <div
          data-media
          data-motion={SUNSET.grade}
          className="relative h-[420px] overflow-hidden"
        >
          {/* The hi-fi band's own crop (pattern transform, 2146:2788): the
              visible slice is rows ~27–83% of the frame, centre ≈ 61% — a
              touch below object-cover's default, so the grass line carries
              the bottom of the band rather than the treetops the top. */}
          <Image
            src={SUNSET.src}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[50%_61%]"
          />
        </div>
      ) : null}

      <div className={`${COLUMN} pt-16 lg:pt-20`}>
        <p className="eyebrow text-burnt-deep">{getInvolved.eyebrow}</p>
        <h2
          data-heading
          className="headline mt-5 max-w-5xl text-h2 text-evergreen"
        >
          {getInvolved.title}
        </h2>
        {/* ⚠ Design-proposal lede, for sign-off — authored on the canvas. */}
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-charcoal">
          Ranger exchange, funding the work, and land management services for
          properties in the district.
        </p>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {getInvolved.paths.map((path, i) => {
            const p = PATH_PRESENTATION[i];
            return (
              <article
                key={path.title}
                data-cluster
                data-tier="mid"
                className={`group relative flex flex-col overflow-hidden rounded-3xl p-6 ${p.ground} lg:min-h-[420px] lg:p-9`}
              >
                {/* The hover lift — the ground lightens 4%, per the card note.
                    A canvas veil rather than a filter, so the motifs and type
                    keep their exact colour. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-canvas opacity-0 transition-opacity duration-(--dur-small) ease-quiet group-hover:opacity-[0.04]"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.glyph} alt="" className="size-11" aria-hidden />
                <p className="eyebrow mt-6 text-xs text-gold">{p.audience}</p>
                <div className="mt-2 flex min-h-21 items-end">
                  <h3 className="headline text-2xl leading-[1.3] text-canvas">
                    {path.title}
                  </h3>
                </div>
                <p data-line className="mt-4 text-base leading-relaxed text-canvas">
                  {path.body}
                </p>
                <Link
                  href={path.cta.href}
                  className="eyebrow mt-auto pt-8 text-gold"
                >
                  {path.cta.label}{" "}
                  {/* 6px of travel on the card's hover — inside the p-9, so it
                      never reaches the clipped edge. */}
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-(--dur-small) ease-quiet group-hover:translate-x-1.5"
                  >
                    &rarr;
                  </span>
                </Link>
              </article>
            );
          })}
        </div>

        <div className="mt-16 border-t border-charcoal/15 pt-8">
          <SignupField tone="light" {...getInvolved.signup} />
        </div>
      </div>
    </section>
  );
}
