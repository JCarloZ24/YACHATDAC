import Image from "next/image";
import Link from "next/link";
import { photoById } from "@/content/kit";
import { FadeIn } from "@/components/motion/text/FadeIn";
import { SeamGlyph } from "@/components/ui/Furniture";
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
 * A name that does not fit is now a wrap, not a silent truncation — the
 * `whitespace-nowrap` and the `overflow-hidden` box went with the stroked
 * layer on 8 Sep. The ramp still exists so the names do not wrap in practice,
 * because a two-line name under a one-line rule reads badly.
 *
 * The original fault was a `clamp(…,6.4vw,2.25rem) sm:text-6xl` that stepped
 * from 36px straight to 60px at exactly 640. The longest name, "Biological
 * Sequestration" (24 characters), needs roughly 13.7em, and against the house
 * column (24 / 40 / 100px gutters, capped at 1440) the ceilings are:
 *
 *   375  → column 327  → 23.9 max     1024 → column 824  → 60.1 max
 *   640  → column 560  → 40.9 max     1440 → column 1240 → 90.5 max
 *
 * This ramp runs 22px at 375 to the drawn 60px at 1280 and holds there, which
 * clears every one of them. If a longer name is ever added, re-run the
 * arithmetic — do not just raise the cap.
 */
const VESSEL_SIZE = "text-[clamp(1.25rem,calc(0.39rem+4.2vw),3.75rem)]";

/**
 * The page column — the house column, verbatim.
 *
 * `/about`, `/connect`, `/partnerships` and `/our-people` all carry this exact
 * string, and `lg:px-25` is 100px: content 1240 starting at x=100 on a 1440
 * viewport, which is the gutter every page artboard is drawn on. Living Work
 * was the one page still on `max-w-7xl` (1152, starting at x=144), which is
 * why its copy did not line up with anything.
 *
 * Kept byte-identical to the sibling pages so it greps as one value. If this
 * changes, change it everywhere or not at all.
 *
 * The nav is a separate question: `SiteHeader` is built to Marc's `Navbar / 1 /`
 * component, which is drawn with a 64px gutter, so the logo sits 36px outside
 * this column on every page of the site. That is Marc's geometry and is not
 * this page's to settle.
 */
const COLUMN = "mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-25";

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
          crosses her.

          THE CROP IS THE FRAME'S, TAKEN FROM ITS OWN TRANSFORM. The frame
          does not use `cover` at all. Node 2139:2613 places the image at
          `w-[154.13%] h-[125%] left-[-5.49%] top-[-12.5%]` in a 1440x1000 box,
          which is a 1.25x zoom PAST cover:

            cover would paint 1776 wide = 123.3% of the container
            the frame paints  2219 wide = 154.1%

          So the frame shows 64.9% of the source width and 80% of its height,
          where a plain `object-cover` hero shows 81.1% — and on a wide window
          (min-h-svh is ~1.95 against the frame's 1.44) it shows the whole
          photograph and crops nothing at all. That is why this read as the
          full image.

          Two boxes reproduce it exactly at any viewport. The PLANE is held to
          the frame's 1.44 by a min-height on wide-short windows and a
          min-width on tall-narrow ones, and centred in the section, which
          clips it. The CROP BOX inside carries the frame's own four numbers
          verbatim — and because 1.5413 / (1.25 / 1.4409) is 1.7767 against the
          source's 1.7762, the box IS the image's aspect and `object-cover`
          inside it has nothing left to crop.

          `sizes` is 160vw, not 100vw: the image is painted half again wider
          than the viewport, so a 100vw hint would fetch a variant too small
          and soften the crop. */}
      {HERO ? (
        <div data-media data-plane="far" data-motion={HERO.grade} className="absolute inset-0">
          {/* Centred on desktop, where the plane is at most a little wider
              than the window. On a phone the plane is 1.44x the viewport
              HEIGHT — far wider than the screen — and centring it showed the
              middle of the frame's window while she stands at 55-92% of it,
              so she was half out of shot. The translate IS the visible centre
              as a fraction of the plane, so it tracks wherever she lands.

              60%, not the 66% that centres her, and the 6% is a legibility
              decision. A phone sees a ~24% slice of the source, and centring
              it on her puts her sunlit shirt directly behind the eyebrow:
              measured off the file, the backdrop there is L=0.482 and the gold
              lands 3.78:1, under the 4.5 a 13px label needs. Sampling the
              photograph across the range:

                t=0.66  bg L 0.482  gold 3.78      her 97% in frame
                t=0.60  bg L 0.283  gold 4.97 AA   her 78%
                t=0.55  bg L 0.111  gold 7.03 AA   her 62%

              0.60 is the first that clears AA and still holds most of her.
              She reads as entering from the right edge, which is the same
              relationship the frame has, just tighter. Desktop is untouched —
              there the copy already sits over the dark scrub at L=0.086 and
              the gold is 7.5:1. */}
          <div className="absolute top-1/2 left-1/2 h-full min-h-[69.4vw] w-full min-w-[144svh] -translate-x-[60%] -translate-y-1/2 lg:-translate-x-1/2">
            {/* ⚠ ZOOMED OUT FROM THE FRAME, on Ivy's call — the one place the
                hero deliberately departs from 2139:2613.

                The frame's transform is w-154.13% / h-125% / left--5.49% /
                top--12.5%, which shows 64.9% of the source width. That read
                too tight in the build, so the box comes back to 130%: 76.9% of
                the source, about halfway to a plain object-cover (81.1%). She
                sits at 51-82% across the frame where the frame puts her at
                55-92%, so the composition holds — still right of centre, with
                the headline clear of her.

                Height and top are DERIVED, not chosen: h = k / 1.7762 x 1.4409
                keeps the box on the source's own aspect, so object-cover
                inside it still has nothing to crop, and top centres the
                overflow. Change k and re-derive both, and the phone's
                translate below with them. */}
            <div className="absolute top-[-2.73%] left-0 h-[105.46%] w-[130%]">
              <Image
                src={HERO.src}
                alt=""
                fill
                priority
                sizes="160vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* X5 — required wherever copy sits on media. Bottom-weighted, because
          that is where the copy is, and MEASURED against the brightest thing
          under it, which the rule asks for and this had never had.
          
          The frame's own three stops (transparent / 0.35 at 42% / 0.88) were
          ported exactly and were not enough once the crop zoomed out and put
          more sunlit grass and sky behind the copy. Cream on 0.35 over bright
          grass is 4.44:1 and over sky 3.00:1 — under the 4.5 the standfirst
          needs.
          
          Five stops now, shaped to where the copy actually sits: clear sky
          down to 25%, 0.56 across the eyebrow and headline band, 0.80 by the
          standfirst, 0.94 at the foot. Cream lands 5.2-9.5:1 against every
          backdrop in the frame.
          
          The gold eyebrow clears AA on the strength of WHERE it sits rather
          than how dark the scrim is. Measured against the file itself, the
          copy lands on the photograph's dark lower-left — L=0.086 on desktop,
          so the gold is 7.5:1. An earlier note here claimed it failed; that
          was computed against an assumed "sunlit grass" backdrop of L=0.45,
          which is not what is behind the copy. Sample the file before
          trusting a number about it. */}
      <div
        data-scrim
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(5,10,8,0.15)_25%,rgba(5,10,8,0.56)_46%,rgba(5,10,8,0.80)_70%,rgba(5,10,8,0.94)_100%)]"
      />

      <div className={`relative ${COLUMN} pt-32 pb-16 lg:pb-32`}>
        {/* THE ENTRANCE — the three lines fade up in order: eyebrow, then
            the headline, then the lede. A fade, not a line-by-line uncover:
            the hero sits on a photograph and a masked rise reads as machinery
            over a picture, where a fade reads as the page arriving.

            They share ONE gate — `entry` waits for the X1 loader on a first
            visit and the route wipe on a navigation, so this never plays
            behind a cover — and separate on `delay`, which is what makes it a
            sequence the eye can follow rather than three things appearing at
            once.

            The h1 carries no `data-heading`: fullBleedOpen's own `settle`
            would fight this. §04 keeps the hook and still settles, which is
            right — it is a section heading, not a hero. */}
        <FadeIn as="p" gate="entry" className="eyebrow text-gold">
          {livingWorkHero.eyebrow}
        </FadeIn>
        {/* max-w keeps the headline in the left half — it must never cross
            the subject, whatever the copy does. */}
        <FadeIn
          as="h1"
          gate="entry"
          delay={0.22}
          className="headline mt-6 max-w-xl text-h1 text-canvas lg:max-w-2xl"
        >
          {livingWorkHero.title}
        </FadeIn>
        <FadeIn
          as="p"
          gate="entry"
          delay={0.48}
          className="mt-8 max-w-xl text-lg leading-relaxed text-canvas"
        >
          {livingWorkHero.standfirst}
        </FadeIn>
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
    <section
      id="aperture"
      data-lw="aperture"
      /* Below `lg` the copy is vertically centred in the screen. The aperture
         does not run at those widths (see DESKTOP in recipes.ts), so nothing
         is coming to fill the space beneath the figure and it sat at the top
         of a full-height section with the rest of the screen empty. The only
         in-flow child here is [data-copy] — the artwork and the theater are
         both absolute — so centring the section centres exactly that.

         `lg:block` hands the desktop layout back untouched, where the empty
         space below IS the composition: it is where the theater opens. */
      className="relative flex min-h-svh flex-col justify-center bg-canvas lg:block"
    >
      {/* The artist's rings as ground.
          
          TWO THINGS ABOUT THE OPACITY, both easy to get wrong. The ring SVGs
          are WHITE (#F6F6EC / white) — they are drawn for dark grounds — so on
          cream they need `brightness-0` to read at all. And each file carries
          its own `opacity="0.08"` internally, which the CSS then MULTIPLIES:
          the 0.11 this used to carry rendered at 0.08 x 0.11 = 0.0088, i.e.
          under one percent, which is why the screen looked bare and why
          removing the filter looked like deleting the artwork.
          
          So the CSS opacity is left at full and the artwork's own 8% governs.
          If these ever need tuning, tune against the EFFECTIVE number, not the
          class — and on a dark ground (§04, §08) drop the filter instead,
          because there the white is already correct.

          data-artwork-drift hands them to the recipe's quiet scroll drift.
          The wrapper clips to the section's FIRST viewport —
          the pinned countdown's own frame — so the ring never bleeds into
          the tail where §03's hand-off rides up, and the offset never widens
          the page. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-svh overflow-hidden">
        <div
          data-artwork="ring-c"
          data-artwork-drift
          /* Sized for the screen it is on. At the desktop 1100 this ring
             spans an entire phone (x -405 to 695 of 375) and reads as a wash
             rather than a motif. lg: is the drawn value, untouched. */
          className="absolute top-[2%] -right-32 h-[440px] w-[440px] lg:top-[4%] lg:-right-80 lg:h-[1100px] lg:w-[1100px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/artwork/ring-c.svg" alt="" className="h-full w-full brightness-0" />
        </div>
        {/* Ring A, lower left — the frame carries two rings here and only one
            was built, which left the whole left half of the screen bare.

            DESKTOP ONLY. On a phone the two overlap outright: ring C already
            covers the full width, and this one lands across its lower half,
            so the pair read as one muddy wash behind the copy. The frame
            draws two because it is 1440 wide; one is the right answer on a
            narrow screen. */}
        <div
          data-artwork="ring-a"
          data-artwork-drift
          className="absolute -bottom-40 -left-48 hidden h-[577px] w-[640px] lg:block"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/artwork/ring-a.svg" alt="" className="h-full w-full brightness-0" />
        </div>
      </div>

      {/* The theater — the wide shot's final frame. NOT full-screen: a wide
          band with the section's own canvas (#F6F6EC) above and below, the way
          a cinema screen sits in a wall. Hidden at rest: the rest state is the
          crop inside 120's glyph below, and the motion pass grows the opening
          from that glyph until it fills this band.

          Every motion-only layer in here is `pointer-events-none` — this band,
          the band dressing, the ghost header and the O layer. Opacity 0 still
          captures clicks and drags, so a 68svh invisible block was swallowing
          taps and text selection over the middle of this screen. Nothing
          visual changes; it is the one part of this that is not about a
          breakpoint. */}
      {PLAIN ? (
        <div
          data-aperture
          data-motion={PLAIN.grade}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[16svh] h-[68svh] opacity-0"
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
          <div data-band-dress aria-hidden className="pointer-events-none absolute inset-0 opacity-0">
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
          <div data-o-ghost aria-hidden className="pointer-events-none absolute inset-x-0 top-[6%] opacity-0">
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
            className="pointer-events-none absolute inset-0 opacity-0 [clip-path:url(#lw-o-clip)]"
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
      <div data-copy className={`relative ${COLUMN} py-16 lg:pt-32 lg:pb-24`}>
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

        {/* THE FIGURE, THEN WHAT IT COUNTS, DIRECTLY UNDER IT.

            This is the frame's own arrangement and it took two goes to get
            here. The build had a fixed `h-[30vw]` box around a `16vw` glyph,
            which left ~200px of dead air and pushed the label to the foot of
            the screen. Splitting it into two columns then pushed the label to
            the far RIGHT of a 1240 column — a worse answer, because a label
            600px from its number is not a label.

            So: the numeral, the artist's rule across the column, the unit
            immediately beneath it. Nothing between the number and the words
            that explain it. The stack is sized by an invisible in-flow copy of
            the widest figure, so the box never resizes as the sequence runs
            and the four real figures sit absolute over it, left-aligned as
            drawn. */}
        <div className="relative mt-10 lg:mt-14">
          <p aria-hidden className="headline invisible text-[20vw] leading-none lg:text-[15vw]">
            8,870
          </p>
          {/* The live counter — the rolling number the countdown ticks
              through between the four figures. Motion-only. */}
          {/* THE ROLLING NUMBER IS NOT THE FACT. It spins through values that
              were never true — 8,870 down through 4,200 to 2019 — so it is
              drawn in the warm ghost the rail and the label use rather than
              the settled figure's deep green. The reader can tell at a glance
              whether they are looking at a number or at a number arriving. */}
          <p
            data-count-live
            aria-hidden
            className="headline absolute inset-0 text-[20vw] leading-none text-burnt-deep/35 opacity-0 lg:text-[15vw]"
          />
          {FIGURES.map((figure, i) => {
            const [before, zero, after] = splitAtAperture(figure.value);
            return (
              <p
                key={figure.value}
                data-figure
                data-value={figure.value.replace(/\D/g, "")}
                className={`headline absolute inset-0 text-[20vw] leading-none text-evergreen lg:text-[15vw] ${
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

        {/* The unit, on the rule, right under the numeral — cross-faded in
            place so it changes WITH the number rather than after it. The box
            is fixed so a wrapped label and a short one share a top edge and
            the rule never moves mid-sequence. */}
        <div data-fade className="mt-6 border-t border-burnt/50 pt-4">
          <div className="relative h-12 lg:h-7">
            {FIGURES.map((figure, i) => (
              <p
                key={figure.value}
                data-figure-caption
                className={`eyebrow absolute inset-0 text-base leading-snug text-burnt-deep ${
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
      <div className="flex items-baseline justify-between gap-6 border-b-2 border-burnt/70 pb-2">
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
              <p className="text-sm leading-relaxed text-evergreen/80 sm:border-l-2 sm:border-burnt/60 sm:pl-6">
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
          className="absolute -top-24 -right-32 h-[420px] w-[420px] opacity-75 lg:-top-48 lg:-right-72 lg:h-[1000px] lg:w-[1000px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/artwork/ring-c.svg" alt="" className="h-full w-full brightness-0" />
        </div>
        <div
          data-artwork="ring-c"
          data-artwork-drift
          /* Desktop only, for the same reason as §02's pair: at these sizes
             the two rings sit on top of each other on a narrow screen. */
          className="absolute bottom-[6%] -left-96 hidden h-[900px] w-[900px] opacity-60 lg:block"
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
          {/* NO CAPTION. The frame's own layer reads "BREAK · 1.91.1 the
              plain from the escarpment — silent, no copy", and Ivy confirmed
              it on review. The notes lane argues the opposite ("every
              photograph on this page is captioned"); the layer name and the
              designer agree, so the band is silent. */}
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
          <img src="/artwork/dots-wave.svg" alt="" className="w-full" />
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
                  /* The steps are absolutely stacked, so exactly one may be
                     visible at rest — otherwise no-JS and reduced motion both
                     render eight digits on top of each other. Day 08 is the
                     rest state, which is what the copy beside it describes and
                     what the 29 Aug frame QA settled. */
                  className={`headline absolute inset-0 text-[10vw] leading-none text-canvas backface-hidden min-[1440px]:text-9xl ${
                    day === days.length ? "" : "opacity-0"
                  }`}
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
          {/* THE CODA. Work Sans MEDIUM, 40/43 — the frame's own values, off
              node 2143:2624. It had been shipping Regular at 30px with looser
              leading, which is why it read as body rather than as the payoff.

              `text-h3` rather than an arbitrary pair: the V2 scale puts
              Heading 3 at 40 desktop / 32 mobile, so the desktop end IS the
              frame's 40 and the phone end lands on the scale instead of the
              28 that was here, which was on no scale at all. Leading is
              overridden at lg to the frame's 43/40; the phone keeps the
              token's looser 1.15, which suits a sentence that wraps.

              ⚠ It carries no font utility ON PURPOSE — that resolves to Work
              Sans, which is what the frame draws and the right family for a
              sentence of narration. But 40 is Heading 3 in the V2 scale, and
              the type skill maps H1-H3 to Block Berthold, so this is a
              heading-sized line deliberately set in the body face. Worth
              Marc confirming rather than a reviewer finding it. */}
          <p className="mt-4 text-h3 font-medium text-canvas lg:leading-[1.075]">
            {release}
          </p>
        </div>

        {/* The stand-in note is NOT rendered. "◇ Stand-in · 1.87.1 the dry
            creek — the restored waterhole holding water has never been
            photographed" is production language: a frame reference and an
            account of a gap in the shoot. It belongs in the notes lane and to
            the photo manifest in src/content/kit.ts, which still records that
            this frame is a stand-in. A visitor should not be reading our
            asset log. */}
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
                          ? "h-[40svh] min-h-64 lg:mr-[calc(-1*(max((100vw-90rem)/2,0px)+6.25rem))]"
                          : "h-[40svh] min-h-64 lg:ml-[calc(-1*(max((100vw-90rem)/2,0px)+6.25rem))]"
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
      className="relative bg-evergreen py-16 lg:pt-0 lg:pb-32"
    >
      <div className={COLUMN}>
        {/* THE HEADER STAYS. Twenty-three facts in six blocks is a long read,
            and the section's own question — what it takes to run a property
            120km from town — was scrolling away before the first block. It
            now holds at the top on `lg` and the blocks pass beneath the
            artist's rule, which becomes the edge they disappear under.

            Opaque ground and a z-index, or the blocks would show through it.
            Phone is left alone: a header this tall pinned to a 375 screen
            would cost more than the context is worth, and the index beside it
            is `hidden` below `lg` anyway. */}
        {/* Sticks at a NEGATIVE top so its own lead-in padding rides up off
            the screen and only the title block and the rule stay — the blocks
            then read nearer the middle of the window instead of starting two
            thirds of the way down. The offset matches the padding exactly, so
            nothing is ever cut mid-line, and the index below reads the real
            stuck height rather than assuming one. */}
        <div
          data-infra-head
          className="bg-evergreen lg:sticky lg:top-[-96px] lg:z-10 lg:pt-24 lg:pb-6"
        >
          <p className="eyebrow text-gold">Infrastructure</p>
          <h2 className="headline mt-5 max-w-4xl text-h2 text-canvas">
            Infrastructure and technology
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-canvas">
            What it takes to run a property 120 kilometres from the nearest town.
          </p>

          {/* Dots / Rule — the artist's dotted divider, used whole. It is the
              header's bottom edge, so it is what the blocks clip under. */}
          <div data-artwork="dots-rule" aria-hidden className="mt-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/artwork/dots-rule.svg" alt="" className="w-full" />
          </div>
        </div>

        <div className="mt-16 lg:flex lg:gap-[82px]">
          <aside className="hidden lg:sticky lg:top-[calc(var(--infra-head,20rem)+2rem)] lg:block lg:h-fit lg:w-[258px] lg:shrink-0">
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

          <div data-infra-grid className="grid flex-1 gap-x-[60px] gap-y-20 sm:grid-cols-2">
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

                {/* THE NAME — one solid text node, wiped in left to right.
                    It used to be three: an aria-hidden stroked outline, a
                    clipped solid copy, and an sr-only name. The stroke was
                    Ivy's way of DRAWING the animation on the artboard, never a
                    thing to ship, and the partial fills left names half-read.
                    All five now arrive whole and readable; the proportion
                    moved to the rule below, which is the better place for it —
                    text is for reading, a rule is for measuring. */}
                <div className="mt-3 inline-block max-w-full align-top">
                  <h3 data-vessel className={`headline block ${VESSEL_SIZE} text-canvas`}>
                    {output.title}
                  </h3>

                  {/* The track: the whole word is the whole job. Gold to where
                      the work has got, grey after it, and the tick on the
                      boundary. Rainbow Credits has not started, so it gets an
                      empty track and no tick — that IS its status. */}
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
  { audience: "For other ranger groups", ground: "bg-evergreen", motif: "a" },
  { audience: "For funders and partners", ground: "bg-roasted", motif: "c" },
  { audience: "For properties in the district", ground: "bg-charcoal", motif: "b" },
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

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-[77px]">
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
                <SeamGlyph motif={p.motif} className="relative top-0 left-0 w-11 shrink-0" />
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
