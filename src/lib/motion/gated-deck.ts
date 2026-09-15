"use client";

/**
 * Gated section deck — motion grammar row "the page holding its ground".
 *
 * ScrollTrigger owns geometry: each slide reports its own 0–100% reading
 * span and stays under one uninterrupted viewport pin until the following
 * slide has covered it. The runway length is hidden behind that surface. The
 * establishing hero uses a deliberately short runway that clears site chrome
 * without moving its image or copy. Input is intercepted solely while a gate
 * is held. A partial wheel gesture drains; a committed hand-off always lands
 * at an endpoint. No snap tween writes against Lenis and no wave root receives
 * a transform.
 *
 * The deck owns geometry, not content. What a section does with the span it is
 * given is authored elsewhere — `onSlideSpans` hands every read clock out so
 * interior choreography can ride it (SCR-02), and `[data-deck-active]` on the
 * root tells the flow-path modules to stand down for whatever it takes over.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "@/lib/motion-controller";
import { registerYachatdacEffects } from "@/lib/motion/effects";
import { scene } from "@/lib/motion/scene";
import {
  clampScrollTo,
  lockScroll,
  smoothScrollActive,
  smoothScrollTo,
  unlockScroll,
} from "@/lib/motion/smooth-scroll";
import { SCRUB } from "@/lib/motion/tokens";

/**
 * The seam crests' scrub. Not in `SCRUB` because it is not a deck-wide
 * weight: it is the grammar row's own number for `recordWaveRoll`
 * ("scrub 0.3s"), shared with wave-roll.ts so every page carrying About's
 * crest carries it at the same lag.
 */
const WAVE_SCRUB = 0.3;

gsap.registerPlugin(ScrollTrigger);

export type GatedDeckOptions = {
  root: string;
  slides: string;
  runways?: string;
  railTraveller?: string;
  railGuide?: string;
  wave?: string;
  /**
   * A crest hanging below a slide's own foot, rather than overhanging the
   * top of the one arriving. Same hand-off clock, opposite seating — for a
   * join where the INCOMING section is a photograph, so the outgoing ground
   * is the only thing that can carry the change.
   */
  footWave?: string;
  railTerminalSlide?: string;
  /**
   * PAGE PROGRESS → rail fraction, 0–1 (user direction, 15 September 2026).
   * The finite sticky rail's pointer no longer travels each slide top to
   * bottom: its y is the document's scroll position through this map — on
   * /truth the piecewise era-anchor map in truth-rail-map.ts, shared with
   * the record fill's clip so tip and pointer cannot disagree. Defaults to
   * the plain document fraction.
   */
  railProgress?: (scrollY: number) => number;
  /** The pointer's travel box inside the sticky rail screen, px. */
  railTravel?: { top: number; bottomInset: number };
  /**
   * Slides whose ground under the sticky rail is dark for their WHOLE read
   * (the count's screens, the escarpment break between them). The painter
   * flips `data-rail-dark` on the rail root there — the rail stays VISIBLE
   * on the dark bands (user direction, 15 September 2026); truth.css owns
   * the ink values.
   */
  railDarkSlides?: string;
  /**
   * The one slide whose ground WALKS to dark as it is read (Truth's 1950s).
   * The rail's ink steps at that band's own luminance crossover, the same
   * instant its type steps — see `nineteenFifties` in truth-scenes.ts.
   */
  railRampSlide?: string;
  /**
   * Where a slide states the era the traveller is pointing at, and its sub.
   * A slide with no match gets NO traveller: the pointer and the label are one
   * object, and an arrow indicating nothing is what this replaced.
   */
  railLabel?: string;
  railLabelSub?: string;
  /**
   * Cuts a slide's era string down to the mark the rail prints. The gutter
   * block the string is read from carries the FULL line ("Before people ·
   * about 100 million years ago" — that is its job in the section); the
   * pointer's label wears only the short mark, so the caller passes the cut
   * (/truth passes truth-rail-map's `shortMark`). Identity when omitted.
   */
  railLabelText?: (text: string) => string;
  siteHeader?: string;
  bufferVh?: number;
  openingReadVh?: number;
  readVh?: number;
  /**
   * How far the outgoing slide travels up while the next one arrives, as a
   * percentage of the viewport.
   *
   * 100 is lockstep: the outgoing's foot stays against the incoming's head and
   * the hand-off plays as ordinary scrolling. Below that it becomes a
   * parallax, and at 0 the outgoing sits still and is simply covered — which
   * is what a deck used to do when every section arrived in a different
   * colour to announce itself. Above 100 the two separate and show bare page.
   */
  exitVh?: number;
  transitionDuration?: number;
  eventPrefix?: string;
  /**
   * Hands each slide's own reading clock to whoever authors its interior
   * motion. SCR-02 — "section locks to viewport while an internal timeline
   * scrubs" (MOTION-SYSTEM §SCR-02).
   *
   * Interior motion cannot use viewport-relative triggers on a deck. A slide
   * pinned at `top top` with `pinSpacing: false` consumes a `top 88%` span
   * while it is still travelling up BEHIND the slide covering it, so the
   * animation finishes before the reader ever sees the section — and then
   * nothing moves at all across the 125vh they spend reading it. Binding to
   * `read.start`/`read.end` instead puts the choreography where the reading is.
   *
   * Called once, inside the deck's own matchMedia branch, after every read
   * clock exists. Any teardown returned is run on revert, so interior motion
   * inherits both the deck's lifecycle and its gating: no callback fires on
   * touch, under 1024px, without Lenis, or under reduced motion.
   */
  onSlideSpans?: (spans: readonly DeckSlideSpan[]) => (() => void) | void;
};

/** One slide's geometry, as the deck measured it. */
export type DeckSlideSpan = {
  index: number;
  slide: HTMLElement;
  runway: HTMLElement;
  /** The 0–100% reading clock. Read `.start`/`.end` lazily — both move on refresh. */
  read: ScrollTrigger;
  /** The cover travel into the next slide. Null on the last slide. */
  cover: ScrollTrigger | null;
};

type Phase = "reading" | "holding" | "playing";

type Gate = {
  index: number;
  slide: HTMLElement;
  over: HTMLElement | null;
  read: ScrollTrigger;
  cover: ScrollTrigger | null;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

function readableLabel(slide: HTMLElement, index: number): string {
  const raw = slide.dataset.truthSlideLabel || slide.id || `Section ${index + 1}`;
  return raw
    .replace(/^break-/, "")
    .replaceAll("-", " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

/**
 * How much of the strand's tangent the pointer actually shows.
 *
 * The guide is `72 + 8·sin(2πy/214)` sampled ±8 units either side, so its
 * tangent spans about ±13.2° — and at 96px long the arrow turned that into a
 * visible wobble rather than into tracking. Showing a seventh of it keeps the
 * arrow following the strand at roughly ±2° (user, 10 September 2026).
 *
 * Scaled, not clamped: a sine spends most of its length near the peaks, so a
 * clamp would flatten the movement into two constants and lose the tracking
 * altogether.
 */
const POINTER_TILT_DEG = 2;
const TANGENT_SPAN_DEG = 13.2;
const TILT_RATIO = POINTER_TILT_DEG / TANGENT_SPAN_DEG;

/**
 * The arrow DRAWS ITSELF OUT of the rosette rather than fading in:
 *
 *     ●        ●-        ●-->
 *
 * and runs back the same way on the way out. The artwork is one 96px image
 * whose rosette occupies the first 44px, so clipping the right 54.2% leaves
 * the dot alone and 0% shows the whole arrow — the tail and its chevron are
 * revealed left to right, which is the growth.
 *
 * A CIRCLE ALWAYS REMAINS. A section with no era keeps the dot and simply
 * never grows a tail (user, 10 September 2026); only the 1902 band, where the
 * rail goes under entirely, has no mark at all.
 */
const ROSETTE_CUT = 54.2;
/** ENTRIES ARE CATCHES, AND ONCE OUT THE POINTER STAYS OUT (user direction,
 * 15 September 2026, twice in one day: the morning removed the entry ramps,
 * the afternoon removed the exits too — grammar row "the guide leading the
 * eye, Truth cut"). The arrow and its era persist down the whole descent,
 * across seams and across sections naming no era of their own, withdrawing
 * only where a full-bleed photograph takes the screen (a plate phase) and
 * at the terminal fade. The one true entry is the first labelled slide;
 * everywhere else the pointer arrives already dressed. */
const TAIL_ENTRY = 0.04;
const LABEL_ENTRY = 0.06;
/** Share of a gate cover across which the pointer ramps out (when the cover
 *  reveals a plate-led slide) or catches back in (leaving one upward). */
const COVER_WITHDRAW = 0.3;

/** A YEAR HANDS TO A YEAR BY COUNTING (user direction, 15 September 2026;
 * grammar row "the guide leading the eye, Truth cut"). When both marks are
 * year marks — plain years or decades, "1950s" counting by its own numeral
 * — the label counts through the years between them — down with the
 * descent, up on rewind — enlarging as the count runs and settling back
 * as it lands. Triggered at the band crossing, then on its OWN clock: the
 * scroll decides when, the tween owns the seconds. Never scrubbed. */
const YEAR_HANDOFF = 0.8;
const YEAR_HANDOFF_SCALE = 1.3;
const YEAR_MARK = /^\d{4}s?$/;

/** Binary-searches the full-height rail guide at a document-space y. */
function pointAtY(path: SVGPathElement, targetY: number) {
  const length = path.getTotalLength();
  if (!length) return null;
  let low = 0;
  let high = length;
  for (let i = 0; i < 14; i += 1) {
    const middle = (low + high) / 2;
    if (path.getPointAtLength(middle).y < targetY) low = middle;
    else high = middle;
  }
  const at = (low + high) / 2;
  const point = path.getPointAtLength(at);
  const before = path.getPointAtLength(Math.max(0, at - 8));
  const after = path.getPointAtLength(Math.min(length, at + 8));
  return {
    point,
    rotation:
      (-Math.atan2(after.x - before.x, after.y - before.y) * 180) /
      Math.PI,
  };
}

export function createGatedDeck({
  root: rootSelector,
  slides: slideSelector,
  runways: runwaySelector = "[data-truth-slide-runway]",
  railTraveller = "[data-truth-trail-traveller]",
  railGuide = "[data-truth-trail-guide]",
  wave: waveSelector = '[data-seam="truth-wave"]',
  footWave: footSelector = '[data-seam="truth-foot-wave"]',
  railTerminalSlide = "#seabed",
  railProgress,
  railTravel = { top: 176, bottomInset: 176 },
  railDarkSlides = '#break-escarpment, [data-truth-ground="count"]',
  railRampSlide = "#art-gallery",
  railLabel = "[data-era-label]",
  railLabelSub = "[data-era-sub]",
  railLabelText = (text: string) => text,
  siteHeader = "[data-site-header]",
  bufferVh = 20,
  openingReadVh = 20,
  readVh = 125,
  exitVh = 100,
  transitionDuration = 0.9,
  eventPrefix = "deck",
  onSlideSpans,
}: GatedDeckOptions): MotionModule {
  let ctx: gsap.Context | null = null;
  let revertScene: (() => void) | null = null;

  const init = () => {
    const root = document.querySelector<HTMLElement>(rootSelector);
    if (!root) return;
    registerYachatdacEffects();

    ctx = gsap.context(() => {
      revertScene = scene(
        () => {
          const pointerMedia = gsap.matchMedia();
          pointerMedia.add(
            "(pointer: fine) and (min-width: 1024px)",
            () => {
              const slides = Array.from(
                root.querySelectorAll<HTMLElement>(slideSelector),
              );
              if (slides.length < 2 || !smoothScrollActive()) return;

              const runways = slides.map(
                (slide) =>
                  slide.closest<HTMLElement>(runwaySelector) ?? slide,
              );
              const tracks = slides.map((slide) =>
                slide.querySelector<HTMLElement>("[data-truth-deck-track]"),
              );
              const trackViewports = slides.map((slide) =>
                slide.querySelector<HTMLElement>(
                  "[data-truth-deck-viewport]",
                ),
              );

              // How far the reader scrolls to read a slide. A slide may set
              // its own `data-truth-read-vh` when it holds more than the
              // normalised span comfortably carries.
              const readDistance = (index: number) => {
                const own = Number(slides[index].dataset.truthReadVh);
                const vh =
                  own > 0 ? own : index === 0 ? openingReadVh : readVh;
                return Math.max(1, window.innerHeight * (vh / 100));
              };

              /**
               * Where in each slide's read its own track finishes covering the
               * plate it rises over, 0 for a slide with nothing to cover.
               *
               * A deck track that LEADS WITH PADDING — the ENTRY plates, whose
               * record sits a full viewport below the photograph — spends that
               * much of its travel before its ground reaches the top of the
               * slide. Until it does, the plate is what is on screen, and the
               * rail's arrow and era label were being drawn across the
               * photograph (user, 11 September 2026). Measured here rather
               * than read per frame: `paintRail` runs every frame, and
               * `getComputedStyle` in it would be a layout read per frame.
               */
              const coverFractions: number[] = [];

              // The runway is a clock, not content spacing. Its extra block
              // size sits behind a continuously pinned viewport surface, so
              // it can never appear as an empty tail. The first portion is
              // the equal read span; the final viewport is the cover travel.
              const prepareRunways = () => {
                slides.forEach((slide, index) => {
                  const runway = runways[index];
                  const track = tracks[index];
                  const trackViewport = trackViewports[index];
                  gsap.set(runway, {
                    paddingBottom: readDistance(index),
                  });
                  gsap.set(slide, {
                    height: "100svh",
                    minHeight: "100svh",
                    position: "relative",
                    top: "auto",
                  });
                  if (track) {
                    // Clip only the moving content viewport. The incoming
                    // Wave / Divider is a sibling that must overhang above
                    // the slide onto the outgoing hero.
                    gsap.set(slide, { overflow: "visible" });
                    if (trackViewport) {
                      gsap.set(trackViewport, {
                        position: "absolute",
                        inset: 0,
                        overflow: "hidden",
                      });
                    }
                  }
                  // Measured after the height above is set, so the slide is
                  // already at the 100svh the travel is calculated against.
                  const lead = track
                    ? parseFloat(getComputedStyle(track).paddingTop) || 0
                    : 0;
                  const travel = track
                    ? Math.max(0, track.scrollHeight - slide.clientHeight)
                    : 0;
                  /* ⚠ A COVER IS VIEWPORT-SCALE. `lead > 0` was the first cut
                     of this test and it was wrong: EVERY EntryBlock puts its
                     `entryLayout` on its own deck track, and that carries
                     `py-10` — 40px of reading padding, not a cover. On a slide
                     whose track is only a little taller than the viewport
                     `travel` is small, so 40/travel landed late in the read and
                     the era label waited almost to the end of the section
                     instead of arriving in it (reported on "Before people",
                     11 September 2026). What the plates actually lead with is
                     `pt-[100svh]` — one whole slide — so the test is against
                     the slide, not against zero. */
                  const isCover = lead >= slide.clientHeight * 0.5;
                  coverFractions[index] =
                    isCover && travel > 0 ? clamp01(lead / travel) : 0;
                });
              };
              prepareRunways();

              const traveller = root.querySelector<HTMLElement>(railTraveller);
              const guide = root.querySelector<SVGPathElement>(railGuide);
              const pointer = traveller?.querySelector<HTMLElement>(
                "[data-truth-trail-pointer]",
              );
              const labelBox = traveller?.querySelector<HTMLElement>(
                "[data-truth-trail-label-box]",
              );
              const labelNode = traveller?.querySelector<HTMLElement>(
                "[data-truth-trail-label]",
              );
              const subNode = traveller?.querySelector<HTMLElement>(
                "[data-truth-trail-sub]",
              );
              /* The rail's root carries the ink flag the stylesheet reads
                 (`data-rail-dark`, truth.css). Written only when the state
                 changes — never per frame. */
              const railRoot = traveller?.closest<HTMLElement>(
                "[data-truth-trail-rail]",
              );

              let phase: Phase = "reading";
              let disposed = false;
              let activeIndex = 0;
              let holding: Gate | null = null;
              let playingGate: Gate | null = null;
              let lastY = window.scrollY;
              let drain: gsap.core.Tween | null = null;
              const charge = { progress: 0 };
              const gates: Gate[] = [];
              /* Per-frame crest welds, held so teardown can release them:
                 `gsap.ticker` callbacks are not owned by the gsap.context and
                 would otherwise outlive a revert. */
              const welds: Array<() => void> = [];
              /* Slides that stand the rail on a dark ground for their whole
                 read; the 1950s ramp joins them from its own crossover. */
              const darkRailIndexes = new Set(
                slides.flatMap((slide, index) =>
                  slide.matches(railDarkSlides) ? [index] : [],
                ),
              );
              const rampRailIndex = slides.findIndex((slide) =>
                slide.matches(railRampSlide),
              );
              /**
               * A slide's era labels, in reading order. Most slides carry one
               * (or none — no era, no tail); the count's figures screen
               * carries TWO, each stamped with the fraction of the read it
               * belongs to (`data-era-at`), so 1902 and 1886 meet the reader
               * at their own figures (user direction, 15 September 2026).
               */
              const labelSources = slides.map((slide) => {
                const sources = Array.from(
                  slide.querySelectorAll<HTMLElement>(railLabel),
                ).map((el) => ({
                  el,
                  at: Number(el.dataset.eraAt) || 0,
                }));
                sources.sort((a, b) => a.at - b.at);
                return sources;
              });
              // Which slides name an era of their own. The pointer's arrow
              // and year PERSIST from the first of these to the terminal
              // fade (user direction, 15 September 2026) — a slide in
              // between that names none simply keeps the standing era.
              const labelledIndexes = new Set(
                slides.flatMap((_, index) =>
                  labelSources[index].length ? [index] : [],
                ),
              );
              /* The chronology's first voice — before it (the hero) the
                 pointer rides bare, and rewinding above it clears. */
              const firstLabelledIndex = slides.findIndex((_, index) =>
                labelledIndexes.has(index),
              );
              const labelBandAt = (index: number, progress: number) => {
                const sources = labelSources[index];
                let band = 0;
                for (let i = 0; i < sources.length; i += 1) {
                  if (sources[i].at <= progress) band = i;
                }
                return band;
              };
              let labelIndex = -1;
              /* The gate cover currently being tracked for the era stamp —
                 the seam stamps the INCOMING era as soon as the hand-off
                 commits, so the year count plays WITH the deck transition
                 rather than after it lands (user direction, 15 September
                 2026). Cleared on every reading paint so a fresh crossing
                 always re-reads its own direction. */
              let coverTrack: {
                index: number;
                last: number;
                forward: boolean;
              } | null = null;
              let labelBand = -1;
              const terminalRailIndex = slides.findIndex((slide) =>
                slide.matches(railTerminalSlide),
              );

              /** Opacity is derived only from a slide's read ScrollTrigger.
               * The rail no longer goes silent across the dark bands (user
               * direction, 15 September 2026) — it swaps ink instead, see
               * `railDarkAt`. The one remaining fade is the permanent one:
               * out over the final fifth of Before people, absent for the
               * Wattanuri floor, because a rail that IS the descent must not
               * run past it (D20). */
              const railOpacityAt = (index: number, progress: number) => {
                const p = clamp01(progress);
                if (index === terminalRailIndex) {
                  return clamp01((1 - p) / 0.2);
                }
                if (terminalRailIndex >= 0 && index > terminalRailIndex) {
                  return 0;
                }
                return 1;
              };

              /**
               * Is the ground under the sticky rail dark here? The count's
               * screens (and the escarpment break between them) for their
               * whole read; the 1950s from its own 0.53 crossover — the same
               * instant the band's type steps (`nineteenFifties`,
               * truth-scenes.ts). A STEP, not a tween: walked across, ink
               * and ground meet in the mid-greys and vanish.
               */
              const INK_CROSS = 0.53;
              const railDarkAt = (index: number, progress: number) => {
                if (darkRailIndexes.has(index)) return true;
                if (index === rampRailIndex) {
                  return clamp01(progress) >= INK_CROSS;
                }
                return false;
              };

              /* The flag write — cheap, and only on change. */
              let railDarkState: boolean | null = null;
              const paintRailInk = (dark: boolean) => {
                if (dark === railDarkState || !railRoot) return;
                railDarkState = dark;
                if (dark) railRoot.dataset.railDark = "true";
                else delete railRoot.dataset.railDark;
              };

              /**
               * A slide whose record covers a plate hands the pointer a
               * different clock: the arrow and the label belong to the RECORD,
               * not to the photograph it rises over, so they wait for the
               * cover and then HOLD to the end of the section rather than
               * ramping back out. Nothing is retracted at this seam because
               * the record's own ground is behind them the whole way — the
               * "label crossing a seam" problem the ramp below exists for
               * cannot arise once the cover has landed.
               *
               * THE DOT IS UNAFFECTED. It always remains (grammar: "the guide
               * leading the eye, Truth cut"); what waits is the tail it grows.
               */
              const afterCover = (index: number, p: number, ramp: number, delay = 0) =>
                clamp01((p - coverFractions[index] - delay) / ramp);

              /**
               * How dressed the pointer is on a slide's read, 0 → 1 —
               * PERSISTENT (user direction, 15 September 2026): once the
               * first labelled slide has caught, arrow and era ride every
               * read at 1 — labelled or not — and withdraw only across a
               * plate phase (`afterCover`: hidden while the full-bleed
               * photograph holds the screen, caught again once the record
               * covers it) and at the terminal fade, which the traveller's
               * own opacity carries. The entry catch survives only at the
               * chronology's first voice; the tail's runs a beat ahead of
               * the label's, so the arrow still arrives before its words.
               */
              const pointerAt = (
                index: number,
                progress: number,
                entry: number,
              ) => {
                if (firstLabelledIndex < 0 || index < firstLabelledIndex)
                  return 0;
                const p = clamp01(progress);
                if (coverFractions[index] > 0)
                  return afterCover(index, p, entry);
                if (index === firstLabelledIndex) return clamp01(p / entry);
                return 1;
              };
              const tailAt = (index: number, progress: number) =>
                pointerAt(index, progress, TAIL_ENTRY);
              const labelAt = (index: number, progress: number) =>
                pointerAt(index, progress, LABEL_ENTRY);

              /* The pointer's state at a slide's two boundaries, for the
                 gate covers: entering a plate-led slide it is hidden (the
                 photograph is about to take the screen); entering any other
                 slide past the first era it is already dressed; leaving any
                 slide past the first era it is dressed (a plate slide ends
                 covered by its record, `afterCover` holding 1). */
              const standingAtStart = (index: number) =>
                firstLabelledIndex >= 0 &&
                index > firstLabelledIndex &&
                index < slides.length &&
                coverFractions[index] === 0;
              const standingAtEnd = (index: number) =>
                firstLabelledIndex >= 0 && index >= firstLabelledIndex;

              /**
               * PAGE PROGRESS, mapped. The pointer's y inside the sticky rail
               * screen is the document's scroll position through the caller's
               * map (on /truth, the piecewise era-anchor map — Ahead at the
               * head, 2020 near three quarters), inside the travel box the
               * rail's masks bracket. The scroll clock covers every phase by
               * construction: a read advances it, the hold clamps it, and a
               * playing cover is itself a scroll.
               */
              const railFractionAt =
                railProgress ??
                ((scrollY: number) =>
                  clamp01(
                    scrollY /
                      Math.max(
                        1,
                        document.documentElement.scrollHeight -
                          window.innerHeight,
                      ),
                  ));
              const railTravelBox = () => {
                const top = railTravel.top;
                const bottom = Math.max(
                  top + 1,
                  window.innerHeight - railTravel.bottomInset,
                );
                return { top, span: bottom - top };
              };

              const announce = (
                kind: "progress" | "buffer" | "gate",
                detail: Record<string, unknown>,
              ) => {
                window.dispatchEvent(
                  new CustomEvent(`${eventPrefix}:${kind}`, { detail }),
                );
              };

              /**
               * Put an era on the pointer.
               *
               * Called on slide or band change only — never per frame. The
               * strings are read straight out of the section's own gutter
               * block (or, on the count's figures screen, the figure's own
               * year term), so there is one source for what the era is and no
               * second copy to drift. Whether the words are actually VISIBLE
               * is `labelAt`'s business, scrubbed on the read; this only
               * decides what they say.
               *
               * Colour is deliberately NOT touched here. The label rides the
               * rail root's `--rail-ink` custom properties, stepped by
               * `paintRailInk` — the inline colour write the 1950s recipe
               * used to leave stranded is gone with the recipe's tween
               * (15 September 2026), and an inline write here would now be
               * clobbering the component's own `var(--rail-ink)` style.
               */
              /* The year hand-off's running count. One at a time: a new
                 stamp kills it and, because the count below starts from the
                 year ON SHOW rather than the band's own year, a reversal
                 mid-count walks back from wherever it got to. */
              let yearHandoff: gsap.core.Timeline | null = null;
              const setRailLabel = (index: number, band: number) => {
                const slide = slides[index];
                const source = labelSources[index]?.[band]?.el;
                // RETENTION (user direction, 15 September 2026): a slide
                // naming no era keeps the standing one — text, sub and the
                // has-sub flag all ride through untouched. Only above the
                // first labelled slide does the fall-through blank it.
                if (
                  !source &&
                  firstLabelledIndex >= 0 &&
                  index >= firstLabelledIndex
                )
                  return;
                const sub = slide?.querySelector<HTMLElement>(railLabelSub);
                // The gutter holds the full era line; the pointer wears the
                // short mark (grammar row "the guide leading the eye, Truth
                // cut" — the caller's cut, /truth's `shortMark`).
                const text = railLabelText(source?.textContent?.trim() ?? "");
                if (labelNode) {
                  // A decade reads "1950s", not "1950S" — the eyebrow
                  // uppercases, so a label opening on a digit opts out.
                  labelNode.classList.toggle("normal-case", /^\d/.test(text));
                  // A YEAR HANDS TO A YEAR BY COUNTING (user direction,
                  // 15 September 2026). Triggered here — this stamp only
                  // runs on a band or slide crossing, which is the scroll
                  // position deciding WHEN — and then on its own clock,
                  // never scrubbed. It rides textContent and scale, the two
                  // properties `paintRail` never writes per frame, so the
                  // painter cannot fight it. The chronology counts; the
                  // count's FIGURES stay stated and held (figures-of-loss
                  // ban, untouched).
                  const shown = labelNode.textContent?.trim() ?? "";
                  // parseInt, not Number: a decade mark counts by its own
                  // numeral — "1950s" is 1950 mid-count and lands with its s.
                  const from = YEAR_MARK.test(shown)
                    ? Number.parseInt(shown, 10)
                    : null;
                  const to = YEAR_MARK.test(text)
                    ? Number.parseInt(text, 10)
                    : null;
                  yearHandoff?.kill();
                  yearHandoff = null;
                  if (from !== null && to !== null && from !== to) {
                    const node = labelNode;
                    const counter = { year: from };
                    // Grows away from the arrow's tip, not across it.
                    gsap.set(node, { transformOrigin: "0% 50%" });
                    yearHandoff = gsap
                      .timeline({
                        onComplete: () => {
                          node.textContent = text;
                          yearHandoff = null;
                        },
                      })
                      .to(
                        counter,
                        {
                          year: to,
                          duration: YEAR_HANDOFF,
                          ease: "power2.out",
                          onUpdate: () => {
                            node.textContent = String(
                              Math.round(counter.year),
                            );
                          },
                        },
                        0,
                      )
                      .to(
                        node,
                        {
                          scale: YEAR_HANDOFF_SCALE,
                          duration: YEAR_HANDOFF * 0.45,
                          ease: "power2.out",
                        },
                        0,
                      )
                      .to(
                        node,
                        {
                          scale: 1,
                          duration: YEAR_HANDOFF * 0.55,
                          ease: "power2.inOut",
                        },
                        YEAR_HANDOFF * 0.45,
                      );
                  } else {
                    labelNode.textContent = text;
                    gsap.set(labelNode, { scale: 1 });
                  }
                }
                const subText = sub?.textContent?.trim() ?? "";
                if (subNode) subNode.textContent = subText;
                // The label box's layout flag: with no sub-line the year
                // centres on the arrow's axis, with one the pair stacks —
                // truth.css owns the geometry and the .25s transition (user
                // direction, 15 September 2026).
                labelBox?.toggleAttribute("data-has-sub", subText.length > 0);
              };

              /* THE EASED FOLLOW (user direction, 15 September 2026 —
                 "continuous + eased", chosen over park-and-glide). The
                 chronological map makes some reads long reaches — the 1950s
                 alone crosses ~29% of the rail — so the position write is no
                 longer paintRail's: paintRail sets the TARGET each frame and
                 this ticker weld carries the pointer to it through a
                 critically-damped lerp, sampling the strand at the SMOOTHED
                 y so the rosette never leaves the dots. Still scroll-derived
                 — the target is the map, every frame — and never a scrubbed
                 tween; settled, it costs one comparison per frame. A
                 ScrollTrigger refresh snaps it (`snapFollow`): a resize is a
                 teleport, not travel. */
              const FOLLOW = 0.12;
              let followTarget: number | null = null;
              let followY: number | null = null;
              const followTick = () => {
                if (
                  followTarget === null ||
                  !traveller ||
                  !guide ||
                  !pointer ||
                  followY === followTarget
                )
                  return;
                const blend =
                  1 - Math.pow(1 - FOLLOW, gsap.ticker.deltaRatio());
                followY =
                  followY === null
                    ? followTarget
                    : followY + (followTarget - followY) * blend;
                if (Math.abs(followTarget - followY) < 0.05) {
                  followY = followTarget;
                }
                const sampled = pointAtY(guide, followY);
                if (!sampled) return;
                gsap.set(traveller, { x: sampled.point.x, y: followY });
                gsap.set(pointer, {
                  rotation: sampled.rotation * TILT_RATIO,
                  transformOrigin: "22px 50%",
                });
              };
              welds.push(followTick);
              gsap.ticker.add(followTick);
              const snapFollow = () => {
                followY = followTarget;
              };

              const paintRail = (
                index: number,
                progress: number,
                bufferProgress = 0,
                mode: "reading" | "buffer" | "cover" = "reading",
                opacityOverride?: number,
                coverPointer = 0,
              ) => {
                if (!traveller || !guide || !pointer) return;
                const p = clamp01(progress);
                const buffer = clamp01(bufferProgress);
                // A cover walks progress backwards and its label is hidden
                // anyway (labelAlpha 0 below), so the band holds — without
                // this, leaving the count re-stamped 1902 over 1886 mid-seam.
                // During a cover the SEAM owns the stamp
                // (paintTransitionRail stamps the incoming era as the
                // hand-off commits, so the count plays with the transition);
                // re-deriving the band from the walked-back cover progress
                // here would immediately restamp the outgoing era over it.
                if (mode !== "cover") {
                  coverTrack = null;
                  const band = labelBandAt(index, p);
                  if (index !== labelIndex || band !== labelBand) {
                    labelIndex = index;
                    labelBand = band;
                    setRailLabel(index, band);
                  }
                }
                // A cover interpolates two slides' grounds, so it makes the
                // ink call itself (paintTransitionRail); everywhere else the
                // slide's own clock decides.
                if (mode !== "cover") paintRailInk(railDarkAt(index, p));
                // PAGE PROGRESS. The pointer's y ignores the slide clock: it
                // is the document's scroll position through the map, placed
                // inside the travel box the end masks bracket. Only the
                // TARGET is set here — the eased follow above owns the
                // position write, sampling the guide at its smoothed y.
                const { top, span } = railTravelBox();
                followTarget = top + span * railFractionAt(window.scrollY);

                const opacity = opacityOverride ?? railOpacityAt(index, p);

                // During a gate cover the pointer's dress is the SEAM's call
                // (`paintTransitionRail`): carried across whole between two
                // standing slides, ramped out only into a plate.
                const tail = mode === "cover" ? coverPointer : tailAt(index, p);
                const labelAlpha =
                  mode === "cover" ? coverPointer : labelAt(index, p);

                gsap.set(traveller, { autoAlpha: opacity });
                gsap.set(pointer, {
                  scale: mode === "buffer" ? 1 + buffer * 0.12 : 1,
                  clipPath: `inset(0% ${((1 - tail) * ROSETTE_CUT).toFixed(2)}% 0% 0%)`,
                });
                if (labelBox) gsap.set(labelBox, { autoAlpha: labelAlpha });
                announce(mode === "buffer" ? "buffer" : "progress", {
                  index,
                  label: readableLabel(slides[index], index),
                  progress: mode === "buffer" ? buffer : p,
                });
              };

              const transitionRailOpacity = (
                index: number,
                progress: number,
              ) =>
                gsap.utils.interpolate(
                  railOpacityAt(index, 1),
                  railOpacityAt(index + 1, 0),
                  progress,
                );

              const paintTransitionRail = (gate: Gate) => {
                const progress = clamp01(gate.cover?.progress ?? 0);
                // THE SEAM STAMPS THE ERA (user direction, 15 September
                // 2026: "match the count to the deck transition — it was
                // animating afterwards"). Direction from the cover's own
                // motion — first sight of a crossing reads its starting
                // end (≈0 forward, ≈1 reverse) — then the target era is
                // stamped at once, so the 0.8s year count runs WITH the
                // ~0.9s cover instead of after it. paintRail's own stamp is
                // suspended in cover mode, so nothing overwrites this; a
                // slide naming no era retains the standing one as usual.
                const prior =
                  coverTrack?.index === gate.index ? coverTrack : null;
                const forward = prior
                  ? progress === prior.last
                    ? prior.forward
                    : progress > prior.last
                  : progress < 0.5;
                coverTrack = { index: gate.index, last: progress, forward };
                const targetIndex = forward ? gate.index + 1 : gate.index;
                const targetBand = forward ? 0 : labelBandAt(gate.index, 1);
                if (labelIndex !== targetIndex || labelBand !== targetBand) {
                  labelIndex = targetIndex;
                  labelBand = targetBand;
                  setRailLabel(targetIndex, targetBand);
                }
                // The cover is itself a scroll, so the pointer's mapped y
                // already travels toward the incoming era's anchor, and
                // opacity crossfades between the two slides' own values. The
                // ink steps when the cover is half played — by then the
                // incoming plate is what stands under the rail.
                paintRailInk(
                  progress < 0.5
                    ? railDarkAt(gate.index, 1)
                    : railDarkAt(gate.index + 1, 0),
                );
                // THE POINTER RIDES THE SEAM (user direction, 15 September
                // 2026): between two slides where it stands, the arrow and
                // year carry straight across — the year count is what the
                // reader sees at the hand-off. It ramps out over the first
                // `COVER_WITHDRAW` of a cover revealing a plate-led slide
                // (the photograph is about to take the screen), and back in
                // over the last stretch when the reverse crossing leaves
                // one. Reverse plays the same progress backwards, so one
                // expression serves both directions.
                const outStanding = standingAtEnd(gate.index);
                const inStanding = standingAtStart(gate.index + 1);
                const hold =
                  outStanding && inStanding
                    ? 1
                    : outStanding
                      ? 1 - clamp01(progress / COVER_WITHDRAW)
                      : inStanding
                        ? clamp01(
                            (progress - (1 - COVER_WITHDRAW)) / COVER_WITHDRAW,
                          )
                        : 0;
                paintRail(
                  gate.index,
                  1 - progress,
                  0,
                  "cover",
                  transitionRailOpacity(gate.index, progress),
                  hold,
                );
              };

              const live = document.createElement("div");
              live.className = "sr-only";
              live.setAttribute("aria-live", "polite");
              root.appendChild(live);

              const removeWheel = () =>
                window.removeEventListener("wheel", onWheel, true);

              const releaseHold = () => {
                drain?.kill();
                drain = null;
                removeWheel();
                holding = null;
                live.textContent = "";
                unlockScroll();
                if (phase !== "playing") phase = "reading";
              };

              const completePlay = (gate: Gate, reverse: boolean) => {
                if (disposed) return;
                playingGate = null;
                phase = "reading";
                charge.progress = 0;
                activeIndex = reverse ? gate.index : gate.index + 1;
                paintRail(activeIndex, reverse ? 1 : 0);
                announce("gate", {
                  action: reverse ? "rewound" : "played",
                  index: gate.index,
                });
              };

              const play = (gate: Gate, reverse: boolean) => {
                if (!gate.cover || phase === "playing") return;
                phase = "playing";
                playingGate = gate;
                releaseHold();
                // Transfer with the cover instead of teleporting after it.
                // As scroll advances, screen y travels from the outgoing
                // foot to the incoming head while x and rotation continue
                // sampling the same full-height SVG guide.
                paintTransitionRail(gate);
                announce("gate", {
                  action: reverse ? "rewind" : "play",
                  index: gate.index,
                });
                smoothScrollTo(
                  reverse ? gate.cover.start : gate.cover.end,
                  transitionDuration,
                  true,
                  false,
                  () => completePlay(gate, reverse),
                );
              };

              const renderCharge = () => {
                if (!holding) return;
                paintRail(holding.index, 1, charge.progress, "buffer");
              };

              const fire = () => {
                if (!holding || phase !== "holding") return;
                const gate = holding;
                charge.progress = 1;
                renderCharge();
                play(gate, false);
              };

              function onWheel(event: WheelEvent) {
                if (!holding || phase !== "holding") return;
                event.preventDefault();
                const delta =
                  event.deltaY *
                  (event.deltaMode === 1
                    ? 40
                    : event.deltaMode === 2
                      ? window.innerHeight
                      : 1);
                if (delta < 0) {
                  const gate = holding;
                  charge.progress = 0;
                  paintRail(gate.index, 1, 0, "buffer");
                  releaseHold();
                  smoothScrollTo(
                    Math.max(0, gate.read.end - Math.abs(delta)),
                    0.2,
                  );
                  return;
                }
                if (delta === 0) return;
                drain?.kill();
                charge.progress = Math.min(
                  1,
                  charge.progress +
                    delta / (window.innerHeight * (bufferVh / 100)),
                );
                renderCharge();
                if (charge.progress >= 1) {
                  fire();
                  return;
                }
                drain = gsap.to(charge, {
                  progress: 0,
                  delay: 0.4,
                  duration: 0.5,
                  ease: "power2.out",
                  onUpdate: renderCharge,
                });
              }

              const engage = (gate: Gate) => {
                if (
                  phase !== "reading" ||
                  !gate.cover ||
                  !smoothScrollActive()
                ) {
                  return;
                }
                phase = "holding";
                holding = gate;
                activeIndex = gate.index;
                charge.progress = 0;
                lockScroll();
                clampScrollTo(gate.read.end);
                paintRail(gate.index, 1, 0, "buffer");
                live.textContent =
                  "Section complete. Keep scrolling, or press Page Down, to open the next section.";
                window.addEventListener("wheel", onWheel, {
                  passive: false,
                  capture: true,
                });
              };

              slides.forEach((slide, index) => {
                // Upstream runways must measure before downstream triggers so
                // their virtual reading spans are included in every later start.
                // Refreshing in the opposite order lets a later slide pin
                // inside the current slide's read span and exposes the
                // hidden runway as apparently empty ground.
                const refreshPriority = index * 10;
                const gate: Gate = {
                  index,
                  slide,
                  over: slides[index + 1] ?? null,
                  read: null as unknown as ScrollTrigger,
                  cover: null,
                };
                gates.push(gate);
                const read = ScrollTrigger.create({
                  id: `${eventPrefix}-read-${index}`,
                  trigger: runways[index],
                  start: "top top",
                  end: () => `+=${readDistance(index)}`,
                  // Grammar: "the page holding its ground". This trigger is
                  // only the 0–100% reading clock. The single surface pin
                  // below owns both this span and the following cover.
                  invalidateOnRefresh: true,
                  refreshPriority,
                  onEnter: (self) => {
                    if (phase !== "reading") return;
                    activeIndex = index;
                    paintRail(index, self.progress);
                  },
                  onEnterBack: (self) => {
                    if (phase !== "reading") return;
                    activeIndex = index;
                    paintRail(index, self.progress);
                  },
                  onUpdate: (self) => {
                    if (phase !== "reading" || activeIndex !== index) return;
                    paintRail(index, self.progress);
                    if (self.progress >= 0.999 && index < slides.length - 1) {
                      engage(gate);
                    }
                  },
                  onLeave: () => {
                    if (index < slides.length - 1) engage(gate);
                  },
                });

                gate.read = read;
                const track = tracks[index];
                if (track) {
                  const trackTrigger = {
                    id: `${eventPrefix}-track-${index}`,
                    trigger: runways[index],
                    start: () => read.start,
                    end: () => read.end,
                    scrub: SCRUB.normal,
                    invalidateOnRefresh: true,
                    refreshPriority: refreshPriority + 1,
                  };
                  // Grammar: "the page holding its ground". The complete
                  // inner panel rises as one cover; its leading wave, ground
                  // and authored contents therefore cannot detach.
                  const trackTimeline = gsap
                    .timeline({ scrollTrigger: trackTrigger })
                    .fromTo(
                      track,
                      { y: 0 },
                      {
                        y: () =>
                          -Math.max(
                            0,
                            track.scrollHeight - slides[index].clientHeight,
                          ),
                        duration: 1,
                        ease: "none",
                        immediateRender: true,
                      },
                      0,
                    );
                  const waveHeading = slides[index].querySelector<HTMLElement>(
                    "[data-truth-wave-heading]",
                  );
                  if (waveHeading) {
                    trackTimeline.waveClamp(
                      waveHeading,
                      { track, viewport: slides[index] },
                      0,
                    );
                  }
                }
                const over = gate.over;
                if (over) {
                  ScrollTrigger.create({
                    id: `${eventPrefix}-pin-${index}`,
                    trigger: runways[index],
                    // One uninterrupted pin prevents a frame, background or
                    // rail handoff between the read and cover phases.
                    start: "top top",
                    endTrigger: runways[index + 1],
                    end: "top top",
                    pin: slide,
                    pinSpacing: false,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    refreshPriority: refreshPriority + 3,
                  });
                } else {
                  ScrollTrigger.create({
                    id: `${eventPrefix}-pin-${index}`,
                    trigger: runways[index],
                    start: "top top",
                    end: () => read.end,
                    pin: slide,
                    pinSpacing: false,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    refreshPriority: refreshPriority + 3,
                  });
                }
                // THE HAND-OFF SCROLLS. It does not overlay.
                //
                // A deck's cover was legible on colour alone: a section was
                // replaced by one arriving in a DIFFERENT colour, so "covered"
                // announced itself. Since the page went to one egg-white
                // ground it does not — an identically-coloured slide sliding
                // over a stationary one reads as text swapping on a static
                // page, with the old section's half-covered lines still
                // sitting behind the new heading.
                //
                // So the outgoing travels the full viewport too, and the pair
                // move together: the outgoing's foot stays against the
                // incoming's head for the whole hand-off, which is exactly
                // what ordinary scrolling looks like. The deck keeps its hold
                // and its gate — the page still stops at the end of a section
                // and waits to be committed — but the transition itself is a
                // scroll, not a presentation overlay (user direction,
                // 9 September 2026).
                if (over) {
                  const departing = over;
                  gsap.fromTo(
                    slide,
                    { y: 0 },
                    {
                      y: () => -window.innerHeight * (exitVh / 100),
                      ease: "none",
                      immediateRender: false,
                      // CAPPED AT THE INCOMING'S OWN PENETRATION, every frame.
                      //
                      // The tween says how far this section would like to
                      // drift; the modifier refuses to let it rise faster than
                      // the next one is actually arriving. Without the cap the
                      // two spans disagree — the cover span is whatever the
                      // layout between two runways happens to be, while the
                      // incoming always arrives over exactly one viewport of
                      // scroll — and wherever the layout adds padding between
                      // sections the exit outran the arrival and opened a
                      // strip of bare page along the foot. Measured, that was
                      // 46px at the seabed seam and a 7px hairline at three
                      // others, including one dark-to-light join where it
                      // would have shown.
                      //
                      // Reading the incoming's rect per frame is the honest
                      // fix: it is the real geometry rather than an assumption
                      // about it, so no seam can regress by gaining padding.
                      modifiers: {
                        y: (value: string) => {
                          const wanted = Math.abs(parseFloat(value) || 0);
                          const arrived = Math.max(
                            0,
                            window.innerHeight -
                              departing.getBoundingClientRect().top,
                          );
                          return `${-Math.min(wanted, arrived)}px`;
                        },
                      },
                      scrollTrigger: {
                        id: `${eventPrefix}-exit-${index}`,
                        trigger: runways[index],
                        start: () => read.end,
                        endTrigger: runways[index + 1],
                        end: "top top",
                        scrub: SCRUB.light,
                        invalidateOnRefresh: true,
                        refreshPriority: refreshPriority + 5,
                      },
                    },
                  );
                }
                const cover = over
                  ? ScrollTrigger.create({
                      id: `${eventPrefix}-cover-${index}`,
                      trigger: runways[index],
                      start: () => read.end,
                      endTrigger: runways[index + 1],
                      end: "top top",
                      invalidateOnRefresh: true,
                      refreshPriority: refreshPriority + 4,
                      onEnter: () => engage(gate),
                      onUpdate: () => {
                        if (phase === "playing" && playingGate === gate) {
                          paintTransitionRail(gate);
                        }
                      },
                    })
                  : null;
                gate.cover = cover;

                /* -------------------------------------------------------
                   THE SEAM CRESTS, ON THE HAND-OFF.

                   Grammar: "a change of ground", rolling wave / SCR-11 —
                   About's crest swell and sideways roll, scrubbed. The tween
                   is the registered `recordWaveRoll` effect and this file
                   restates none of its numbers; the deck's own copies of them
                   (a 0.6 crest and a 0.15 roll reach) went with this rewrite.

                   ⚠ THE CLOCK IS THE COVER, AND THAT IS THE CHANGE (user
                   direction, 14 September 2026). It used to be the final
                   `bufferVh` of THIS slide's read, which finished the crest
                   before the hand-off it exists to carry had started — and on
                   the hero, whose whole read is 20vh, the entire roll was
                   spent before the gate even engaged. The old comment here
                   described that as the design ("the crest to full at 100%,
                   then it stands unchanged while the magnetic buffer
                   charges"); it read as a static wave in the one moment the
                   reader is watching the join. Bound to the cover the crest
                   moves while the two slides actually change places, and a
                   cover played backwards retraces it.

                   Scrub 0.3 and not `SCRUB.light`: a committed cover is
                   already an eased 0.9s Lenis tween, and 0.6 lags the crest
                   past the point where the slide has seated. 0.3 is the value
                   the grammar row names and the one wave-roll.ts uses.

                   TWO SEATINGS, because the page needs both:
                     `waveSelector` on the INCOMING slide — this page's law,
                       "a divider has to be attached to the surface that moves
                       during the cover", and what keeps a crest off screen
                       until the hand-off and gone after it.
                     `footSelector` on the OUTGOING slide — a crest hanging
                       below its own foot, for the seabed → Wattanuri join
                       where the arriving section is a photograph and the
                       departing egg white is the only thing that can carry.
                   Both ride this same span; a seam may hold either or none.
                   ------------------------------------------------------- */
                if (cover) {
                  const roll = (crest: SVGElement | null, id: string) => {
                    const ink = crest?.querySelector<SVGGElement>(
                      "[data-wave-ink]",
                    );
                    if (!crest || !ink) return;
                    gsap.set(crest, { autoAlpha: 1 });
                    ScrollTrigger.create({
                      id,
                      trigger: runways[index],
                      start: () => cover.start,
                      end: () => cover.end,
                      animation: gsap.effects.recordWaveRoll(
                        ink,
                      ) as gsap.core.Tween,
                      scrub: WAVE_SCRUB,
                      invalidateOnRefresh: true,
                      refreshPriority: refreshPriority + 2,
                    });
                  };
                  roll(
                    over?.querySelector<SVGElement>(waveSelector) ?? null,
                    `${eventPrefix}-wave-${index}`,
                  );
                  /* THE CREST THAT CAPS A PHOTOGRAPH, and then leaves.

                     Seated INSIDE the incoming section rather than overhanging
                     it, because the section it introduces is a photograph and
                     the crest has to paint over it (Sections.tsx,
                     `WattanuriBand`, has the whole note). That means it is
                     still on screen when its section seats — unlike every
                     overhanging crest, which is above the viewport by then —
                     so it withdraws upward over the tail of the same span
                     instead of being left sitting in the section. Its own box
                     takes the translate; the ink takes the roll.

                     ⚠ It leaves no rest state behind: off the deck the wave is
                     simply the drawn seam capping the photograph, which is the
                     right reading of a page that is not transitioning. */
                  const foot = over?.querySelector<SVGElement>(footSelector) ?? null;
                  const footInk = foot?.querySelector<SVGGElement>(
                    "[data-wave-ink]",
                  );
                  const footBox = over?.querySelector<HTMLElement>(
                    "[data-truth-foot-crest]",
                  );
                  if (over && foot && footInk && footBox) {
                    gsap.set(foot, { autoAlpha: 1 });
                    /* The join, so the pull stretches into the picture rather
                       than off its own seat. */
                    gsap.set(footBox, { transformOrigin: "50% 0%" });
                    const withdraw = gsap
                      .timeline()
                      .add(
                        gsap.effects.recordWaveRoll(footInk) as gsap.core.Tween,
                        0,
                      )
                      /* THE WITHDRAWAL. A crest seated INSIDE the section it
                         introduces is still on screen when that section seats,
                         unlike every overhanging one, so it leaves under its
                         own steam over the tail of the same span. `yPercent` on
                         the BOX, never the svg: `flip` compiles to a transform
                         on the root and a GSAP write there would replace it and
                         un-flip the wave. */
                      .to(
                        footBox,
                        { yPercent: -100, ease: "power2.in", duration: 0.2 },
                        0.8,
                      );

                    /* ⚠ THE CREST IS WELDED TO THE OUTGOING FOOT EVERY FRAME,
                       and a scrub cannot do it.

                       The crest belongs to the INCOMING section — it has to,
                       because it paints over that section's photograph and no
                       stacking context can separate a crest from the ground it
                       sits on (Sections.tsx, `WattanuriBand`). But the two
                       sections travel on different clocks: the incoming one is
                       driven straight off its pin, while the outgoing one is a
                       SCRUBBED exit tween and lags it. Going down, that tween's
                       modifier caps the lag against the incoming's own rect and
                       the seam holds. Coming back up nothing caps it, the
                       outgoing foot runs AHEAD of the incoming head, and the
                       join opens — measured at 1702x918, up to 67px of
                       daylight between the departing record and the crest. It
                       reads as a dark band rather than as bare ground because
                       the deck sets `overflow: visible` on any slide that owns
                       a track, and this one's `scale-105` photograph bleeds
                       23px above its own top edge into exactly that strip
                       (reported with a screenshot, 14 September 2026).

                       So the crest stops inferring its position from a clock
                       and takes it from the thing it has to meet. `min(0, …)`
                       because it may only ever be pulled UP, to reach a foot
                       that has run ahead: pushing it DOWN in the opposite case
                       would open the same band on the other side of the join,
                       where the incoming section is already painting over the
                       outgoing one. Clamped to its own height, which is more
                       than any lag measured here.

                       A per-frame `getBoundingClientRect` is the honest cost,
                       and it is the same one the exit tween's modifier already
                       pays a few lines up — real geometry rather than an
                       assumption about it. It is added and removed with the
                       hand-off, so it runs for one span and no longer. */
                    const setWeld = gsap.quickSetter(footBox, "y", "px");
                    const weld = () => {
                      const lag =
                        slide.getBoundingClientRect().bottom -
                        over.getBoundingClientRect().top;
                      setWeld(
                        Math.max(-footBox.offsetHeight, Math.min(0, lag)),
                      );
                    };

                    welds.push(weld);

                    ScrollTrigger.create({
                      id: `${eventPrefix}-foot-${index}`,
                      trigger: runways[index],
                      start: () => cover.start,
                      end: () => cover.end,
                      animation: withdraw,
                      scrub: WAVE_SCRUB,
                      invalidateOnRefresh: true,
                      refreshPriority: refreshPriority + 2,
                      onToggle: (self) => {
                        if (self.isActive) {
                          /* Once immediately: the ticker's first run is a
                             frame away, and the frame that activates this is
                             the one where the join is closing. Measured
                             without it: a single 14px flash of the picture at
                             the instant the crest takes over. */
                          weld();
                          gsap.ticker.add(weld);
                        } else {
                          gsap.ticker.remove(weld);
                          setWeld(0);
                        }
                      },
                      /* THE PULL, on the way back up (user direction, 14
                         September 2026). Re-entering the hand-off from below,
                         the crest is tugged down from the join before the
                         reverse roll takes it back out — the wave gathering
                         itself before it goes. Box scale, so it composes with
                         the weld's `y` and the withdrawal's `yPercent` inside
                         one transform. `overwrite` because a reader who flicks
                         up and down can start this while the last one is still
                         easing. */
                      onEnterBack: () => {
                        gsap.fromTo(
                          footBox,
                          { scaleY: 1 },
                          {
                            scaleY: 1.14,
                            duration: 0.16,
                            ease: "power2.out",
                            yoyo: true,
                            repeat: 1,
                            overwrite: "auto",
                          },
                        );
                      },
                    });
                  }

                }
              });

              // About selected the first semantic <header>; Truth has two.
              // The stable site hook avoids moving the hero's own header.
              const header = document.querySelector<HTMLElement>(siteHeader);
              const openingCover = gates[0]?.cover;
              if (header && openingCover) {
                gsap.fromTo(
                  header,
                  { y: 0 },
                  {
                    y: () => -header.offsetHeight,
                    ease: "none",
                    immediateRender: true,
                    scrollTrigger: {
                      trigger: runways[0],
                      start: () => gates[0].read.start,
                      end: () => gates[0].read.end,
                      scrub: SCRUB.light,
                      invalidateOnRefresh: true,
                    },
                  },
                );
              }

              const onKey = (event: KeyboardEvent) => {
                if (!holding || phase !== "holding") return;
                const target = event.target as HTMLElement | null;
                if (
                  target?.closest(
                    "input, textarea, select, [contenteditable=true]",
                  )
                ) {
                  return;
                }
                const space = event.key === " " || event.key === "Spacebar";
                if (
                  event.key === "PageDown" ||
                  event.key === "ArrowDown" ||
                  (space && !event.shiftKey)
                ) {
                  event.preventDefault();
                  fire();
                } else if (
                  event.key === "PageUp" ||
                  event.key === "ArrowUp" ||
                  event.key === "Home" ||
                  (space && event.shiftKey)
                ) {
                  charge.progress = 0;
                  paintRail(holding.index, 1, 0, "buffer");
                  releaseHold();
                }
              };

              const onScroll = () => {
                const y = window.scrollY;
                const direction = y >= lastY ? 1 : -1;
                lastY = y;
                if (phase !== "reading") return;

                const inCover = gates.find(
                  (gate) =>
                    gate.cover &&
                    y > gate.cover.start + 2 &&
                    y < gate.cover.end - 2,
                );
                if (!inCover) return;
                if (direction < 0) play(inCover, true);
                else {
                  clampScrollTo(inCover.read.end);
                  engage(inCover);
                }
              };

              window.addEventListener("keydown", onKey);
              window.addEventListener("scroll", onScroll, { passive: true });

              const syncRail = () => {
                if (phase === "holding" && holding) renderCharge();
                else if (phase === "playing" && playingGate) {
                  paintTransitionRail(playingGate);
                } else {
                  const gate = gates[activeIndex];
                  paintRail(activeIndex, gate?.read.progress ?? 0);
                }
              };
              const guideObserver = guide
                ? new MutationObserver(syncRail)
                : null;
              if (guide && guideObserver) {
                guideObserver.observe(guide, {
                  attributes: true,
                  attributeFilter: ["d"],
                });
              }
              const refreshRail = () => {
                snapFollow();
                syncRail();
              };
              ScrollTrigger.addEventListener("refreshInit", prepareRunways);
              ScrollTrigger.addEventListener("refresh", refreshRail);

              // SCR-02. Every read clock now exists, so interior choreography
              // can bind to the span the reader actually spends in a section
              // rather than to a viewport the pinned slide never crosses. The
              // flag lets the flow-path modules stand down for the elements
              // this hands over; it is set before they init, because modules
              // run in registration order and matchMedia.add is synchronous.
              root.dataset.deckActive = "true";
              const releaseSpans = onSlideSpans?.(
                gates.map((gate) => ({
                  index: gate.index,
                  slide: gate.slide,
                  runway: runways[gate.index],
                  read: gate.read,
                  cover: gate.cover,
                })),
              );

              // Resolve restored positions only after every pin has measured.
              const boot = window.setTimeout(() => {
                const y = window.scrollY;
                const inCover = gates.find(
                  (gate) =>
                    gate.cover &&
                    y > gate.cover.start + 2 &&
                    y < gate.cover.end - 2,
                );
                if (inCover) {
                  const midpoint =
                    (inCover.cover!.start + inCover.cover!.end) / 2;
                  play(inCover, y < midpoint);
                  return;
                }
                const active = gates.findIndex(
                  (gate) => y >= gate.read.start && y <= gate.read.end,
                );
                activeIndex =
                  active >= 0 ? active : Math.max(0, slides.length - 1);
                syncRail();
              }, 80);

              return () => {
                disposed = true;
                releaseSpans?.();
                delete root.dataset.deckActive;
                window.clearTimeout(boot);
                drain?.kill();
                yearHandoff?.kill();
                yearHandoff = null;
                welds.forEach((fn) => gsap.ticker.remove(fn));
                welds.length = 0;
                removeWheel();
                if (holding) unlockScroll();
                live.remove();
                guideObserver?.disconnect();
                ScrollTrigger.removeEventListener(
                  "refreshInit",
                  prepareRunways,
                );
                ScrollTrigger.removeEventListener("refresh", refreshRail);
                window.removeEventListener("keydown", onKey);
                window.removeEventListener("scroll", onScroll);
              };
            },
          );
          return () => pointerMedia.revert();
        },
        () => {
          const traveller = root.querySelector<HTMLElement>(railTraveller);
          if (traveller) gsap.set(traveller, { autoAlpha: 0 });
        },
      );
    }, root);
  };

  const destroy = () => {
    revertScene?.();
    revertScene = null;
    ctx?.revert();
    ctx = null;
  };

  return { init, destroy };
}
