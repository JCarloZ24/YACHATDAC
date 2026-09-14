"use client";

/**
 * Truth — what each section does while it is being read.
 *
 * The deck pins every slide, so nothing inside one ever crosses the viewport
 * and a viewport-relative trigger measures a journey that does not happen:
 * `top 88% → top 38%` on a pinned heading is spent while the slide is still
 * behind the one covering it, and the reader sees nothing move. So interior
 * motion binds to the slide's own reading clock instead (SCR-02), handed out
 * by the deck through `onSlideSpans`. Every beat below is a FRACTION of its
 * section's read span, which is why the windows read like a storyboard.
 *
 * One loud channel per screen (F7); `docs/motion/scenes.md` says which.
 * Screens whose channel is `none` get no recipe at all — enforced by the
 * table not listing them, rather than by anyone remembering.
 *
 * MARKUP CONTRACT
 * ---------------
 *   [data-truth-tile="<n>"]        a montage / strip cell, in laying order
 *   [data-truth-strip]             the six-up grid that drifts as one
 *   [data-truth-card]              an Ahead deck record — one phase of a screen
 *   [data-truth-ahead-phases]      the wrapper truth.css stacks those into
 *   [data-truth-focus-row]         a row the reader's scroll walks a focus along
 *   [data-truth-entry-copy]        a record's copy column, revealed element by
 *                                  element (was unclaimed by any module until
 *                                  the phase swap, 13 September 2026)
 *   [data-truth-attribution]       a speaker's name, held until they finish
 *   [data-truth-strata-layer="n"]  a seabed layer, built top → bottom
 *   [data-truth-deteriorates]      a ground that deteriorates as it is read
 *   [data-v2-dissolve]             a shot lying over another, fading out
 *   [data-truth-break-wave]        the box a break's closing crest travels in
 *   [data-v2-camera] / [data-v2-plate]   ordinary movable image frames
 *   [data-v2-static]               held: never given motion by this module
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type { DeckSlideSpan } from "@/lib/motion/gated-deck";
import { registerYachatdacEffects } from "@/lib/motion/effects";
import { SCRUB } from "@/lib/motion/tokens";
import { Y2_DIM } from "@/lib/sections/y2";

gsap.registerPlugin(ScrollTrigger, SplitText);

/** M1's dim state. The same 0.4 the flow path uses, so the two agree. */
const M1_DIM = 0.4;

/** Ordinary movable media pushes exactly this far, and no further. */
const CAMERA_PUSH = 1.06;

/** The hero opens 4% over and breathes down to its resting size. */
const HERO_BREATH = 1.04;

/**
 * Montage delays, as fractions of a read span. Uneven on purpose — evenly
 * spaced arrivals read as a slideshow. Written out rather than generated so
 * two screenshots of the same scroll position match (JITTER, tokens.ts).
 */
const MONTAGE_STARTS = [0.1, 0.17, 0.21, 0.3] as const;
const MONTAGE_STARTS_SIX = [0.08, 0.15, 0.19, 0.26, 0.3, 0.39] as const;
const MONTAGE_LENGTH = 0.18;

/** The strip arrives as one pull, so its cells are ~50ms apart, not ~100ms. */
const STRIP_STEP = 0.012;
const STRIP_FROM = 0.12;
const STRIP_LENGTH = 0.1;

/** How far the whole strip drifts left once it has arrived. */
const STRIP_DRIFT = -40;

/**
 * The 1950s crossing, in hex. GSAP interpolates colour values, not `var()`
 * references, so a tween between two custom properties snaps. Same values
 * globals.css declares — if the palette moves, move these with it.
 */
const CANVAS = "#f6f6ec";
const CHARCOAL = "#090e12";
/** The heading's opening colour in that band — `--color-evergreen`. */
const EVERGREEN = "#22372b";

/** The seabed builds downward — the only section that moves with the scroll. */
const STRATA_WINDOWS = [
  [0.08, 0.28],
  [0.22, 0.44],
  [0.36, 0.6],
] as const;

type Recipe = (
  timeline: gsap.core.Timeline,
  slide: HTMLElement,
  span: DeckSlideSpan,
) => void;

const query = <T extends HTMLElement>(root: ParentNode, selector: string) =>
  Array.from(root.querySelectorAll<T>(selector));

/**
 * Matches inside this slide, including the slide itself — the two breaks carry
 * their marker on the `<section>` that IS the slide, and a plain
 * `querySelectorAll` from it finds nothing.
 */
const within = (slide: HTMLElement, selector: string) => {
  const found = query<HTMLElement>(slide, selector);
  return slide.matches(selector) ? [slide, ...found] : found;
};

/**
 * Held subtrees never receive motion, whatever a recipe asks for.
 *
 * Checking the ancestor chain rather than listing ids here is what makes the
 * stillness survive: two held beats ride inside slides that DO move, so a
 * slide-level exclusion would be wrong in both directions at once.
 */
const isHeld = (el: HTMLElement) => Boolean(el.closest("[data-v2-static]"));

/** Ordinary media frames inside this slide, minus anything held. */
const cameraFrames = (slide: HTMLElement) =>
  within(slide, "[data-v2-camera], [data-v2-plate]").filter(
    (frame) => !isHeld(frame),
  );

const planesOf = (frame: HTMLElement) =>
  query<HTMLElement>(frame, "[data-media-plane]");

/* -------------------------------------------------------------------------
   The shared beats
   ------------------------------------------------------------------------- */

/**
 * M1 / emerging from the ground. Brightness only, never travel — the descent
 * supplies all the movement, and an element that also slides competes with it.
 */
function brightenAt(
  timeline: gsap.core.Timeline,
  targets: HTMLElement[],
  from: number,
  to: number,
) {
  if (!targets.length) return;
  timeline.brighten(
    targets,
    { dim: M1_DIM, duration: Math.max(0.01, to - from), ease: "none" },
    from,
  );
}

/** Being drawn in. Ordinary movable planes, 1.00 → 1.06 across the read. */
function pushMedia(timeline: gsap.core.Timeline, slide: HTMLElement) {
  cameraFrames(slide).forEach((frame) => {
    const planes = planesOf(frame);
    if (!planes.length) return;
    timeline.pushIn(
      planes,
      { scale: CAMERA_PUSH, y: "0%", duration: 1, ease: "none" },
      0,
    );
  });
}

/* THE PULL-BACK CUT IS RETIRED ON THIS PAGE (11 September 2026). Both breaks
   carried it — §14 lost its photographs when the client withdrew them, and §08
   lost the scale itself when the ERA DISSOLVE reference's "nothing scales
   during the dissolve (P9's rule)" was taken over this break's own note. No
   element on Truth carries `[data-v2-pullback]` any more, so the helper that
   drove them is gone rather than left looking live. The `pullBack` EFFECT is
   untouched and still registered for whoever wants it; what has gone is this
   page's use of it. The hero's own breath is `heroBreath` below, which has
   always built its own tween. */

/** B5 / what endures. Line masks, scrubbed against the reading clock. */
function revealHeadings(
  timeline: gsap.core.Timeline,
  slide: HTMLElement,
  splits: SplitText[],
) {
  query<HTMLElement>(slide, "[data-descent-heading]")
    .filter((heading) => !isHeld(heading))
    // Skip the section's own headline: on a deck the slide arrives whole and
    // holds, so masking its title means the reader waits on an empty screen to
    // find out what it says. Later headings still rise (user, 9 Sep 2026).
    .slice(1)
    .forEach((heading) => {
      const split = SplitText.create(heading, {
        type: "lines",
        mask: "lines",
        aria: "auto",
      });
      splits.push(split);
      timeline.fromTo(
        split.lines,
        { yPercent: 110 },
        { yPercent: 0, stagger: 0.09, ease: "none", duration: 0.3 },
        0.02,
      );
    });
}

/**
 * Everything the section marked as an M1 arrival, unless a recipe took it.
 *
 * Early and short (0.02–0.16) because opacity multiplies down the tree: this
 * block is the parent of any montage tiles, so it has to resolve before they
 * are laid into it or they spend their own window muddy.
 */
function arriveRest(
  timeline: gsap.core.Timeline,
  slide: HTMLElement,
  claimed: Set<HTMLElement>,
) {
  const rest = query<HTMLElement>(slide, "[data-descent-arrive]").filter(
    (el) => !claimed.has(el) && !isHeld(el),
  );
  // The lead block is at full strength from the first frame — on a pinned
  // deck a dimmed opening line means the reader must scroll before the section
  // will tell them anything. Everything below it still emerges.
  brightenAt(timeline, rest.slice(1), 0.02, 0.16);
}

/* -------------------------------------------------------------------------
   The section recipes
   ------------------------------------------------------------------------- */

/**
 * §01 Intro. The photograph opens 4% over and settles.
 *
 * Its own trigger, across read + cover, because the hero's 20vh read exists to
 * let the navbar clear — a 4% settle inside a fifth of a viewport is a twitch,
 * not a breath. Supersedes the ledger's "held at its rendered state": the copy
 * is still held, only the photograph moves.
 */
const heroBreath: Recipe = (_timeline, slide, span) => {
  const planes = query<HTMLElement>(
    slide,
    "[data-v2-hero-media] [data-media-plane]",
  );
  if (!planes.length) return;
  gsap.fromTo(
    planes,
    { scale: HERO_BREATH },
    {
      scale: 1,
      ease: "none",
      immediateRender: true,
      scrollTrigger: {
        trigger: span.runway,
        start: () => span.read.start,
        end: () => span.cover?.end ?? span.read.end,
        scrub: SCRUB.heavy,
        invalidateOnRefresh: true,
        refreshPriority: span.index * 10 + 5,
      },
    },
  );
};

/**
 * §02–§03 — the Ahead deck, read as TWO PHASES of one screen (user direction,
 * 13 September 2026).
 *
 * Grammar: "emerging from the ground, the phase swap" (M1 · Truth §02–§03) for
 * the records, and "the world opening, one frame at a time, Truth cut" for the
 * precinct's photographs. Geometry: ../../app/truth/_components/truth.css.
 *
 * WHAT WAS WRONG. The two records shared one pinned viewport in ordinary flow —
 * 743px of precinct and 424px of partnership against a ~900px screen — so the
 * deck's track slid about 270px and both were on screen, crowding each other,
 * for almost the whole read. They are now stacked in one grid cell by truth.css
 * and read one at a time: the precinct owns the first half of the span, the
 * partnership the second.
 *
 * ⚠ SCRUBBED, NOT PLAYED. This recipe used to build its own timeline with
 * `toggleActions: "play none none reverse"`, on the argument that it was "the
 * one beat on the page that is played rather than scrubbed". A phase swap
 * cannot be: the reader has to be able to stop between the two records and
 * scroll back into the first, which is a position on a clock rather than a
 * direction of travel. It now runs on the scrubbed timeline `bindTruthScenes`
 * hands in — the one that was previously built empty for this slide and killed.
 *
 * ⚠ THE COPY TAKES NO TRAVEL, AND THAT IS NOT A STYLE CHOICE — it is the same
 * law this recipe's old comment stated and then broke. `[data-truth-card]`
 * carries its hover lift as a CSS `transform` rule, GSAP writes transforms
 * inline, and an inline transform beats a stylesheet: a card given `y` silently
 * never lifts again for the rest of the visit. The old code selected
 * `[data-descent-arrive]` — which on this slide IS the two articles — and gave
 * them `arrive`, i.e. `y: 16`, exactly the failure globals.css:407-410
 * predicts. Brightness only here, on the copy's CHILDREN, and the one thing
 * that scales is the tile.
 *
 * ⚠ SEQUENCED, WITH CLEAR AIR. About §03 measured both of its claims at full
 * opacity for .14 of its read when the exit and the entrance were run together
 * (recipes-about.ts:1303). Two records on one grid cell would print on top of
 * each other the same way, so the second starts only after the first has gone,
 * and there is deliberate empty screen between them.
 *
 * ⚠ NO SPLIT BEAT. `freshSplit` keeps one live SplitText per element and
 * reverts the previous one, so a block that both arrives and leaves loses its
 * arrival — which is why the sequence is `brighten` per element rather than
 * `settle` per line. The elements are the beat here, which is also what the
 * direction asked for: the eyebrow, then the title, then the description.
 */

/** A tile at rest: smaller and quieter than the one the focus is on. */
const FOCUS_REST_SCALE = 0.88;
const FOCUS_REST_DIM = 0.55;

/**
 * The beat sheet, as fractions of the slide's own read span.
 *
 * ⚠ THE SCALE DOWN, NOT UP, IS LOAD-BEARING. About §07 grows its focused plate
 * from rest and pays for it with a `sizes` bug — a `transform: scale()` is
 * invisible to the browser's image selection, which sizes the request from the
 * layout box. Running 0.88 → 1 keeps the largest painted size inside the layout
 * box, so `FeatureMedia`'s `sizes` is simply true. Do not invert it.
 */
const AHEAD = {
  /** The precinct's copy, one element per beat. */
  copyAt: 0,
  copyStep: 0.015,
  copyFor: 0.05,
  /** The walk along the photographs. */
  walkAt: 0.09,
  walkFor: 0.33,
  /** The precinct goes, then nothing is on screen for a moment. */
  outAt: 0.42,
  outFor: 0.06,
  /** The partnership arrives on ground the precinct has left. */
  inAt: 0.54,
  /** The trailing rest that holds the clock open. */
  restAt: 0.94,
  restFor: 0.06,
} as const;

type Setter = (value: number) => void;

/** Copy elements in reading order. The figure is the walk's, not the sequence's. */
const copyBeats = (card: HTMLElement) =>
  query<HTMLElement>(card, "[data-truth-entry-copy] > *").filter(
    (el) => !isHeld(el) && el.tagName !== "FIGURE",
  );

/** Brighten a record's blocks one after another, `step` apart. */
function revealCopy(
  timeline: gsap.core.Timeline,
  card: HTMLElement,
  at: number,
) {
  copyBeats(card).forEach((el, index) => {
    const start = at + index * AHEAD.copyStep;
    brightenAt(timeline, [el], start, start + AHEAD.copyFor);
  });
}

const aheadPhases: Recipe = (timeline, slide) => {
  /* DOM order is reading order, and the beat sheet is inherently ordered: the
     record the reader meets first owns the first half of the span. Selecting on
     `[data-truth-card]` rather than on `#precinct` / `#partner` keeps this
     consistent with the RECIPES table's own rule — anchors, never indexes —
     while still not hard-coding which anchor is which phase. */
  const cards = query<HTMLElement>(slide, "[data-truth-card]").filter(
    (card) => !isHeld(card),
  );
  if (!cards.length) return;

  const [first, ...rest] = cards;

  // ---- phase one: the precinct ----------------------------------------
  revealCopy(timeline, first, AHEAD.copyAt);

  /* The walk. One scrubbed cursor and every tile's state derived from it —
     n tiles cannot drift out of step with each other if there is only one
     clock (theRoster, recipes-about.ts:2420). The module writes two unitless
     custom properties per tile and measures nothing; truth.css owns the
     geometry and composes the transform, because a GSAP `scale` here would
     replace the stylesheet's transform rather than merge with it. */
  const row = query<HTMLElement>(first, "[data-truth-focus-row]")[0];
  const tiles = row
    ? query<HTMLElement>(row, "[data-truth-tile]").filter((t) => !isHeld(t))
    : [];

  if (tiles.length > 1) {
    /* ⚠ REGISTER BOTH PROPERTIES WITH GSAP BEFORE THE WALK TOUCHES THEM.
       `quickSetter` writes straight to the style attribute and keeps no
       record, so `ctx.revert()` in `bindTruthScenes`' teardown would leave the
       last scrubbed values behind — a tile stuck at .88 and half lit. Below
       1024px that is invisible, because the rule that READS these lives in
       truth.css's media query; but the deck also reverts on a route change and
       on a reduced-motion switch with the window still wide, and there it
       would show. One `set` inside the context records the original (empty)
       inline style for both properties, so revert clears them. */
    gsap.set(tiles, { "--t2-s": 1, "--t2-o": 1 });

    const scale = tiles.map((t) => gsap.quickSetter(t, "--t2-s") as Setter);
    const glow = tiles.map((t) => gsap.quickSetter(t, "--t2-o") as Setter);

    const walk = (focus: number) => {
      tiles.forEach((_, i) => {
        const d = Math.abs(i - focus);
        // Smoothstep over one pitch either side: flat at the extremes, so a
        // tile neither snaps into focus nor creeps out of it. Continuous, with
        // no index and no snap, which is what makes the reverse scrub retrace.
        const near = d >= 1 ? 0 : (1 - d) * (1 - d) * (3 - 2 * (1 - d));
        scale[i](FOCUS_REST_SCALE + (1 - FOCUS_REST_SCALE) * near);
        glow[i](FOCUS_REST_DIM + (1 - FOCUS_REST_DIM) * near);
      });
    };
    walk(0);

    const cursor = { focus: 0 };
    timeline.to(
      cursor,
      {
        focus: tiles.length - 1,
        duration: AHEAD.walkFor,
        ease: "none",
        onUpdate: () => walk(cursor.focus),
      },
      AHEAD.walkAt,
    );
  }

  // ---- the swap --------------------------------------------------------
  /* `autoAlpha`, so the retired record's two links leave the tab order rather
     than sitting invisible and focusable in the middle of the pin. `visibility`
     inherits, which is the reason About avoids autoAlpha on focusable content
     (recipes-about.ts:131) and exactly the reason it is wanted here. */
  timeline.to(
    first,
    { autoAlpha: 0, duration: AHEAD.outFor, ease: "none" },
    AHEAD.outAt,
  );

  // ---- phase two: everything after the first --------------------------
  rest.forEach((card) => {
    /* Pre-hidden at build, so the rest state of the document is the FINISHED
       page: below the deck's breakpoint, with JavaScript off or under reduced
       motion, both records are simply there in ordinary flow. `fromTo` rather
       than a `from`, because a `from` off a hidden element animates 0 → 0 and
       the record would never appear (recipes-about.ts:115). */
    gsap.set(card, { autoAlpha: 0 });
    timeline.fromTo(
      card,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.02, ease: "none" },
      AHEAD.inAt,
    );
    revealCopy(timeline, card, AHEAD.inAt);
  });

  /* ⚠ A TRAILING REST HAS TO HOLD THE CLOCK OPEN, or it is not a rest at all —
     it is every earlier beat played late. A scrub maps the reader's 0 → 1 onto
     0 → `tl.duration()`, and the duration is wherever the last tween ends.
     An inert tween occupies the last stretch and touches nothing. */
  timeline.to({}, { duration: AHEAD.restFor }, AHEAD.restAt);
};

/** §04/§05 TODAY. The plate pushes; the montage is laid down by hand. */
const todayDeck: Recipe = (timeline, slide) => {
  pushMedia(timeline, slide);
  layTiles(timeline, slide, MONTAGE_STARTS);
  todayCrest(timeline, slide);
};

/**
 * TODAY's crest, over the stretch where it is actually crossing the plate.
 *
 * Grammar: "a change of ground", rolling wave / SCR-11 — `recordWaveRoll`,
 * the same swell-and-roll the deck gives the seam crests. This one is not at
 * a gate: it is seated on the leading edge of the record panel that rises
 * over the fire photograph INSIDE this slide (Sections.tsx, `EntryPlate`), so
 * its clock is the slide's own read rather than a hand-off.
 *
 * ⚠ AND IT IS THE ONE CREST THAT STAYS. Every other wave on the page is off
 * screen once its section has seated; this one is a boundary between an image
 * and the record laid over it, so it belongs to the page at rest and is
 * meant to still be there (user direction, 14 September 2026). Nothing here
 * takes it away again.
 *
 * The window is the track's lead-in. The panel opens `pt-[100svh]` below the
 * plate, so the crest is on screen from the read's start until the track has
 * travelled that lead — which is the fraction gated-deck measures for its own
 * purposes as `coverFractions`, computed the same way from the same two
 * numbers rather than plumbed across a module boundary.
 *
 * ⚠ MEASURED ONCE, at build. Every beat in this file is a fixed fraction of
 * the read for the same reason; a resize tears the deck down and rebuilds it,
 * which is what re-measures this.
 */
function todayCrest(timeline: gsap.core.Timeline, slide: HTMLElement) {
  const ink = slide.querySelector<SVGGElement>(
    '[data-seam="today-wave"] [data-wave-ink]',
  );
  const track = slide.querySelector<HTMLElement>("[data-truth-deck-track]");
  if (!ink || !track) return;
  const lead = parseFloat(getComputedStyle(track).paddingTop) || 0;
  const travel = Math.max(0, track.scrollHeight - slide.clientHeight);
  /* No lead means no rise to ride — the crest is simply drawn, which is its
     rest state and the correct no-JS/reduced-motion reading of it. */
  if (travel <= 0 || lead <= 0) return;
  const crossing = Math.min(1, lead / travel);
  timeline.add(
    (gsap.effects.recordWaveRoll(ink) as gsap.core.Tween).duration(crossing),
    0,
  );
}

/** §18 Still to be found. Same hand, six frames, different unevenness. */
const openResearch: Recipe = (timeline, slide) => {
  pushMedia(timeline, slide);
  layTiles(timeline, slide, MONTAGE_STARTS_SIX);
};

function layTiles(
  timeline: gsap.core.Timeline,
  slide: HTMLElement,
  starts: readonly number[],
) {
  query<HTMLElement>(slide, "[data-truth-tile]")
    .filter((tile) => !isHeld(tile))
    .forEach((tile) => {
      const order = Number(tile.dataset.truthTile ?? 0);
      const from = starts[order] ?? starts[starts.length - 1];
      brightenAt(timeline, [tile], from, from + MONTAGE_LENGTH);
    });
}

/**
 * §07 Research & discovery. Six frames arrive left to right fast enough to
 * read as one strip pulled across, then the whole strip drifts left — the
 * evidence carrying on past the edge of what is said about it.
 */
const researchStrip: Recipe = (timeline, slide) => {
  const strip = slide.querySelector<HTMLElement>("[data-truth-strip]");
  if (!strip || isHeld(strip)) return;
  query<HTMLElement>(strip, "[data-truth-tile]").forEach((tile) => {
    const order = Number(tile.dataset.truthTile ?? 0);
    const from = STRIP_FROM + order * STRIP_STEP;
    brightenAt(timeline, [tile], from, from + STRIP_LENGTH);
  });
  timeline.fromTo(
    strip,
    { x: 0 },
    { x: STRIP_DRIFT, ease: "none", duration: 0.8 },
    0.2,
  );
};

/**
 * A scrub span for a screen's own words.
 *
 * `leadVh` starts it early, while the previous slide is still clearing, so the
 * first words are already moving as the screen settles rather than sitting
 * dim until it stops. `endFraction` is the share of the read the words take;
 * the remainder is the screen held, fully lit, before the next one covers.
 */
function arrivalTimeline(
  span: DeckSlideSpan,
  endFraction: () => number,
  leadVh: number,
) {
  return gsap.timeline({
    scrollTrigger: {
      trigger: span.runway,
      start: () => span.read.start - window.innerHeight * leadVh,
      end: () =>
        span.read.start + (span.read.end - span.read.start) * endFraction(),
      scrub: SCRUB.normal,
      invalidateOnRefresh: true,
      refreshPriority: span.index * 10 + 6,
    },
  });
}

/** How many rendered lines these words occupy. Words on a line share a top. */
const lineCount = (words: HTMLElement[]) =>
  new Set(words.map((w) => Math.round(w.getBoundingClientRect().top / 4))).size;

/**
 * A person speaking — words undim in reading order, nothing moves.
 *
 * `at` and `amount` are timeline fractions: the block starts at `at` and its
 * last word lights at `at + amount`. Callers tile them so the blocks do not
 * overlap.
 *
 * Two non-obvious mechanics, both of which were bugs here: `gsap.set` first,
 * because a staggered fromTo in a scrubbed timeline applies its from-value to
 * the first target only; and `amount`, not `each`, because `each` adds the
 * tween duration on top of every offset and the block overruns its share.
 */
function speakWords(
  timeline: gsap.core.Timeline,
  words: HTMLElement[],
  at: number,
  amount: number,
) {
  if (!words.length) return;
  gsap.set(words, { opacity: Y2_DIM });
  timeline.fromTo(
    words,
    { opacity: Y2_DIM },
    { opacity: 1, ease: "none", duration: WORD_FADE, stagger: { amount } },
    at,
  );
}

/**
 * §12 2003. Suzanne's father, in his own words. The attribution is held until
 * the last word has landed — someone finishes speaking, then they are named.
 */

const testimony: Recipe = (timeline, slide) => {
  const block = slide.querySelector<HTMLElement>("[data-y2]");
  const words = block ? query<HTMLElement>(block, "[data-y2-word]") : [];
  if (words.length) {
    speakWords(timeline, words, 0.1, 0.55);
  }
  const attribution = slide.querySelector<HTMLElement>(
    "[data-truth-attribution]",
  );
  if (attribution) {
    timeline.fromTo(
      attribution,
      { opacity: 0 },
      { opacity: 1, ease: "none", duration: 0.1 },
      0.8,
    );
  }
};

/**
 * §13 1950s — "the light is going out of this band".
 *
 * The one ground on the page that MOVES: it opens on the page's egg white and
 * walks down to the count's charcoal as the band is read, so the reader
 * arrives at the hard stop already in the dark.
 *
 * It ramps the ground COLOUR rather than dimming it. Over the old roasted-brown
 * ground a charcoal wash read as a light going out; over egg white the same
 * wash renders grey — a bruise, not a dusk.
 *
 * Ground, ink and accent all cross, because this palette has no middle tier
 * (tone.ts): charcoal type is 17.83:1 on egg white and invisible on charcoal,
 * off-white is the exact inverse, and the warm accents fail in opposite
 * directions — burnt-deep needs a ground lighter than ~L 0.56, gold needs one
 * darker than ~L 0.08, and the ramp spends most of its length between them.
 * Move one without the others and the band is unreadable for half its span.
 *
 * Grammar: "a change of ground", the row `groundRamp` carries — but written as
 * plain `fromTo`s, because `groundRamp` builds its own root timeline and
 * nested inside a scrubbed parent it renders at its end stop for the whole
 * span: the band sat charcoal from the first frame and never travelled.
 */
const nineteenFifties: Recipe = (timeline, slide) => {
  const [band] = within(slide, "[data-truth-deteriorates]");
  if (!band) return;

  // The CSS rest state is the END of this journey, so no-JS, reduced motion
  // and the unpinned flow path all read "the light has gone out" as a
  // statement. On the deck it has to be put back to its opening first, or the
  // band shows dark while the cover reveals it and then jumps back to light.
  gsap.set(band, { "--truth-slide-ground": CANVAS, "--truth-ink": CHARCOAL });

  // Egg white straight down to charcoal, linear, no intermediate stop (user,
  // 9 Sep 2026). A version routed through Roasted Brown measured better —
  // worst contrast 5.89:1 against this one's 3.47:1 — but read as a third
  // ground appearing halfway down. `power3.inOut` was tried for the same
  // reason and rejected: it left the ground visibly still for the first third
  // and scrubbed motion that sits still while you scroll reads as broken.
  timeline.fromTo(
    band,
    { "--truth-slide-ground": CANVAS },
    { "--truth-slide-ground": CHARCOAL, ease: "none", duration: 1 },
    0,
  );

  // The ink STEPS rather than travelling with it. Crossed linearly, ink and
  // ground both arrive at grey at the midpoint — measured rgb(133,135,132) on
  // rgb(122,125,122), 1.05:1, the whole middle of the band invisible. Stepping
  // where the ground's luminance passes ~0.16 keeps both states above ~4.3:1.
  // A hard swap of type colour would be crude anywhere else; here the ground
  // is already moving under it, so the reader reads a change of light.
  //
  // The accent steps with it rather than staying warm, because no warm in this
  // palette clears 4.5:1 across the middle of the ramp — carrying gold through
  // put the eyebrow at 2.08:1 on its own ground. The colour draining out of
  // the labels is the argument, not a compromise.
  //
  // A near-zero `fromTo`, not two `set`s: a `set` is a zero-duration tween
  // with immediateRender on, so both would fire at build time and the later
  // would win — off-white ink on the off-white opening ground.
  const CROSS_AT = 0.53;
  timeline.fromTo(
    band,
    { "--truth-ink": CHARCOAL },
    { "--truth-ink": CANVAS, ease: "none", duration: 0.004 },
    CROSS_AT,
  );

  // THE RAIL CARRIES THIS ERA'S NAME, so the light goes out of it too (user,
  // 11 September 2026). "1950s / ADMIRED UNDER THE WRONG NAME" is the band's
  // own gutter block, copied onto the traveller — but the traveller is a
  // sibling of the section, not a descendant, so the `color: var(--truth-ink)`
  // above never reached it and the label sat burnt-deep on charcoal at 1.4:1
  // for the second half of the band. Same crossover, same step, same
  // argument: the colour drains out of the labels as the light goes out.
  //
  // Written inline on the traveller's nodes, which are shared by every era;
  // the deck clears them on the next slide change (`setRailLabel`), because a
  // scrub that has been left behind cannot undo itself.
  const railLabels = query<HTMLElement>(
    document,
    "[data-truth-trail-label], [data-truth-trail-sub]",
  );
  if (railLabels.length) {
    timeline.fromTo(
      railLabels,
      { color: CHARCOAL },
      { color: CANVAS, ease: "none", duration: 0.004 },
      CROSS_AT,
    );
  }

  // AND THE HEADING, which is the dark green of the section above it (client
  // direction, 11 September 2026) rather than the band's travelling ink. It
  // steps at the same instant for the same reason everything else in here does:
  // evergreen is 11.71:1 on the opening egg white and 1.52:1 on the charcoal
  // this band walks to, so a heading that simply stayed green would be gone for
  // the whole second half of its own section.
  /* `[data-descent-heading]` is NOT what this band's title is — the entry
     title is a plain `<h3 class="headline …">` and the descent hook sits on
     era headlines, of which this folded band has none. Targeting it found zero
     elements and the step silently never ran (measured 12 September 2026: the
     heading stayed evergreen straight into the charcoal, at 1.52:1, which is
     the exact failure this step exists to prevent). Both the title and the
     coda beneath it carry `inkHead`, so both are taken. */
  const heading = query<HTMLElement>(band, ".headline, [data-descent-heading]");
  if (heading.length) {
    timeline.fromTo(
      heading,
      { color: EVERGREEN },
      { color: CANVAS, ease: "none", duration: 0.004 },
      CROSS_AT,
    );
  }
};

/**
 * §08 · BREAK Country Now — "you never see the join" (Figma 2051:5464 and the
 * ERA DISSOLVE reference 2309:4172, built 11 September 2026).
 *
 * Grammar: "time handing over" (`dissolve`, P9) for the photographs, and "a
 * change of ground" (`waveHandoff`) for the crest that closes it.
 *
 * TWO BEATS, and nothing else happens on this screen:
 *
 *   0 → 1     shot A fades to nothing over shot B. Opacity ONLY. The
 *             reference's opacity ladder — 1 / 0.55 / 0.2 / 0 at 0 / 40 / 70 /
 *             100% — is a straight line across the whole read, so this is
 *             linear and starts at zero rather than at the 40% the frame
 *             caption names; that caption describes when the fade becomes
 *             VISIBLE, not when it begins.
 *
 *   0.70 → 1  the next era's colour rises over the bottom of the shot as a
 *             wave, "before the page releases you". One wave-height of travel,
 *             which is what `yPercent: 100 → 0` on a box of the divider's own
 *             height gives.
 *
 * ⛔ NOTHING SCALES. This break used to take a pull-back; the reference is
 * explicit that "the photographs cross-dissolve on opacity — nothing scales
 * during the dissolve (P9's rule)", and that ruling was taken over this
 * break's own note asking for a slow withdrawal (user, 11 September 2026).
 * With shot A undelivered the result is a completely still screen until the
 * wave — which is the honest read of a page that has stopped.
 *
 * ⚠ THE WAVE'S REST STATE IS ITS END STATE, which is why the 100 is set here
 * rather than in the markup. The deck is desktop-only, so touch, narrow, no-JS
 * and reduced motion never play this timeline; a wave parked below the foot by
 * CSS would simply be missing for all of them, and the seam would go hard.
 * Same reasoning as the 1950s ground below.
 */
const breakDissolve: Recipe = (timeline, slide) => {
  const dissolve = slide.querySelector<HTMLElement>("[data-v2-dissolve]");
  if (dissolve) {
    timeline.fromTo(
      dissolve,
      { opacity: 1 },
      { opacity: 0, ease: "none", duration: 1 },
      0,
    );
  }

  const wave = slide.querySelector<HTMLElement>("[data-truth-break-wave]");
  if (wave) {
    timeline.waveHandoff(wave, { duration: WAVE_RISE }, WAVE_AT);
  }
};

/** Where the crest starts rising, and how much of the read it takes. */
const WAVE_AT = 0.7;
const WAVE_RISE = 0.3;

/**
 * §19 100 million years. The only section that builds downward, with the
 * scroll — top, middle, bottom, the way the strata were laid.
 */
const strata: Recipe = (timeline, slide) => {
  pushMedia(timeline, slide);
  query<HTMLElement>(slide, "[data-truth-strata-layer]")
    .filter((layer) => !isHeld(layer))
    .forEach((layer) => {
      const order = Number(layer.dataset.truthStrataLayer ?? 0);
      const at =
        STRATA_WINDOWS[order] ?? STRATA_WINDOWS[STRATA_WINDOWS.length - 1];
      brightenAt(timeline, [layer], at[0], at[1]);
    });
};

/* -------------------------------------------------------------------------
   Which recipe a slide gets
   ------------------------------------------------------------------------- */

/**
 * Selected by the anchors already in the markup, never by index — a slide
 * re-order would silently re-point an index-keyed table, and the failure would
 * be a section quietly performing another section's choreography.
 *
 * A slide that matches nothing gets the ordinary treatment: headings, M1
 * arrivals, and a 6% push on movable media.
 */
/* -------------------------------------------------------------------------
   §15 Suzanne's screens — the only ones tuned by hand

   PACE IS SCROLL DISTANCE, NOT DURATION. Every `duration:` in this file is a
   fraction of the span ScrollTrigger hands the timeline, so changing one
   re-orders the beats and never changes how fast the section feels. Only
   these do:

     LINE_VH, *_TAIL_VH, LEAD_VH   below
     readVh                        on the screen, in Sections.tsx

   The first three are wishes; `readVh` is the scroll the deck actually gives
   the screen, and it wins. If it is too short to honour LINE_VH and still
   leave the tail, the words are compressed to fit and dev builds say so in
   the console — raise `readVh` there rather than fighting it here.
   ------------------------------------------------------------------------- */

/** Scroll one rendered line of her speech costs. */
const LINE_VH = 0.4;

/**
 * How long a screen is held, fully lit, after she stops speaking and before
 * the next one covers it. Her testimony needs a real one — it is the longest
 * screen on the page and the 1840s used to arrive on top of it half-read.
 */
const TESTIMONY_TAIL_VH = 1.2;
const OPENING_TAIL_VH = 0.3;
const COUNT_TAIL_VH = 0.5;

/** Pre-roll while the screen is still settling. */
const LEAD_VH = 0.25;

/** One word's own fade, as a fraction of the timeline. */
const WORD_FADE = 0.06;

/**
 * The share of a read span these words should take, and the timeline that
 * scrubs across it.
 *
 * Asking for `lines × LINE_VH` is what makes the section feel heavy: it is
 * indifferent to how many words there are and tracks what the reader actually
 * has to get through.
 */
function speakingSpan(
  span: DeckSlideSpan,
  words: HTMLElement[],
  label: string,
  tailVh: number,
) {
  // Re-measured rather than captured: a resize or a late font changes how
  // many lines the same words wrap to, and ScrollTrigger calls this again on
  // every refresh.
  const share = () => {
    const vh = window.innerHeight;
    const read = span.read.end - span.read.start;
    const wanted = lineCount(words) * LINE_VH * vh;
    return Math.min(wanted / read, Math.max(0.1, (read - tailVh * vh) / read));
  };

  if (process.env.NODE_ENV !== "production") {
    const vh = window.innerHeight;
    const read = span.read.end - span.read.start;
    const lines = lineCount(words);
    const wanted = lines * LINE_VH * vh;
    if (wanted + tailVh * vh > read) {
      console.warn(
        `[truth] ${label}: ${lines} lines want ${Math.round(wanted)}px of scroll ` +
          `plus a ${Math.round(tailVh * vh)}px tail, but readVh gives only ` +
          `${Math.round(read)}px — the words are compressed to fit. ` +
          `Set readVh={${Math.ceil(((wanted + tailVh * vh) / vh) * 100)}} ` +
          `on this screen in Sections.tsx.`,
      );
    }
  }
  return arrivalTimeline(span, share, LEAD_VH);
}

/**
 * Blocks laid end to end across the timeline, each taking a share of it in
 * proportion to its own length — a six-word line does not take as long to
 * arrive as a paragraph.
 */
function speakBlocks(timeline: gsap.core.Timeline, blocks: HTMLElement[][]) {
  const total = blocks.reduce((sum, w) => sum + w.length, 0) || 1;
  let at = 0;
  blocks.forEach((w) => {
    const portion = w.length / total;
    speakWords(timeline, w, at, Math.max(0.02, portion - WORD_FADE));
    at += portion;
  });
}

const wordsIn = (slide: HTMLElement) =>
  query<HTMLElement>(slide, "[data-y2]")
    .filter((el) => !isHeld(el))
    .map((block) => query<HTMLElement>(block, "[data-y2-word]"))
    .filter((w) => w.length > 0);

/**
 * §15A who is speaking. Her opening line is testimony too, so it is read the
 * same way; the marker, title and lede around it take the ordinary M1.
 */
const herOpening: Recipe = (_timeline, slide, span) => {
  const blocks = wordsIn(slide);
  if (!blocks.length) return;
  speakBlocks(
    speakingSpan(span, blocks.flat(), "#the-count", OPENING_TAIL_VH),
    blocks,
  );
};

/**
 * §15B the count. The sentence each figure belongs to is read a word at a
 * time; the figures themselves never move.
 *
 * The stillness is not this recipe's doing and must not be — the numerals
 * carry their own `data-v2-static`, so `wordsIn` and every other collector
 * here filters them out however this function is edited later. What is being
 * animated is the source line under the count, not the count.
 */
const theCount: Recipe = (_timeline, slide, span) => {
  const blocks = wordsIn(slide);
  if (!blocks.length) return;
  speakBlocks(
    speakingSpan(span, blocks.flat(), "#the-count-figures", COUNT_TAIL_VH),
    blocks,
  );
};

/**
 * §15C her testimony. Her words undim at speaking pace and nothing else on the
 * screen moves — the same act as the 2003 beat, so the same treatment.
 */
const herTestimony: Recipe = (timeline, slide, span) => {
  const blocks = wordsIn(slide);
  if (!blocks.length) return;
  speakBlocks(
    speakingSpan(span, blocks.flat(), "#the-count-testimony", TESTIMONY_TAIL_VH),
    blocks,
  );

  // Her standing line and the closing paragraphs, once she has stopped. These
  // ride the slide's own read clock, so they land inside the tail.
  const rest = query<HTMLElement>(slide, "blockquote, p").filter(
    (el) =>
      !isHeld(el) &&
      !el.closest("[data-y2]") &&
      !el.querySelector("[data-y2-word]") &&
      !el.closest("figcaption"),
  );
  rest.forEach((el, index) => {
    const from = 0.78 + index * 0.05;
    brightenAt(timeline, [el], from, from + 0.16);
  });
};

/**
 * §20 · the closing plate drifts (client direction, 11 September 2026).
 *
 * Grammar: "being drawn in" — the camera moving over a held frame. The plate is
 * `country` bucket, so `full` grade: the image plane itself may be moved.
 *
 * ⚠ THIS REACHES PAST A HOLD, AND DOES SO DELIBERATELY. The Wattanuri band is
 * `data-v2-static`, and `isHeld()` is an ancestor test — every shared beat in
 * this file skips everything inside it, which is still what the copy wants. So
 * this recipe does NOT go through `cameraFrames`; it takes
 * `[data-truth-galaxy]` directly, a hook nothing else reads. The band's own doc
 * comment records that its stillness was overruled rather than forgotten.
 *
 * Bottom-right to top-left, which is a negative x and a negative y in equal
 * measure — that equality IS the 45°. Small: the whole point is that the sky
 * looks like it is moving, not that the page is panning. The plane opens at
 * `scale-105` in the markup so the travel never walks an edge into frame.
 */
const CLOSING_DRIFT = 26;

const closingDrift: Recipe = (timeline, slide) => {
  const plane = slide.querySelector<HTMLElement>("[data-truth-galaxy]");
  if (!plane) return;
  timeline.fromTo(
    plane,
    { xPercent: 0, yPercent: 0 },
    {
      /* px, not percent: percent would scale the travel with the plate, and
         this plate is a whole viewport tall on desktop and taller on a phone —
         the same number would read as a crawl on one and a lurch on the other. */
      x: -CLOSING_DRIFT,
      y: -CLOSING_DRIFT,
      ease: "none",
      duration: 1,
    },
    0,
  );
};

/**
 * Selected by the anchors already in the markup, never by index: re-ordering
 * the slides would silently re-point an index-keyed table and a section would
 * quietly perform another section's choreography. A slide matching nothing
 * gets headings, M1 arrivals and a 6% push on movable media.
 */
const RECIPES: ReadonlyArray<{ match: string; recipe: Recipe }> = [
  { match: "[data-v2-hero-media]", recipe: heroBreath },
  { match: "[data-truth-card]", recipe: aheadPhases },
  { match: "#today-fire", recipe: todayDeck },
  { match: "#research-discovery", recipe: researchStrip },
  { match: "#break-country-now", recipe: breakDissolve },
  { match: "#father", recipe: testimony },
  { match: "#art-gallery", recipe: nineteenFifties },
  /* §14 kept its slide and its wave when the client withdrew its photographs
     on 11 September 2026, but it has no image plane left to move and its wave
     is the count deck's leading crest, not a trailing one — so it is listed
     with no recipe rather than pointed at a beat that would find nothing. */
  { match: "#opportunities", recipe: openResearch },
  { match: "#the-count", recipe: herOpening },
  { match: "#the-count-figures", recipe: theCount },
  { match: "#the-count-testimony", recipe: herTestimony },
  { match: "#seabed", recipe: strata },
  { match: "#underneath-all-of-it", recipe: closingDrift },
];

/**
 * THE STILLNESSES. Marked `data-v2-static` in the markup, not listed here, so
 * a still beat stays still without any module remembering it:
 *
 *   §06 #study-2022            "the page stops moving here, on purpose"
 *   §15 the count's numerals   the hard stop. No animation, no count-up, no
 *                              glow: the figure is stated and held, which is
 *                              the grammar's figures-of-loss rule. Marked on
 *                              the numerals rather than on the screen, so the
 *                              source line beneath each one can still be
 *                              read. (The "only red on the page" belongs to
 *                              §15A's title, not here — this screen is
 *                              off-white on charcoal throughout.)
 *   §17 #engraving             older than the record; the stillness is the
 *                              argument
 *   §20 #underneath-all-of-it  the descent has ended
 *   §12 the portrait           a person speaking is read in stillness
 */

export function bindTruthScenes(
  spans: readonly DeckSlideSpan[],
): () => void {
  registerYachatdacEffects();
  const splits: SplitText[] = [];

  const ctx = gsap.context(() => {
    spans.forEach((span) => {
      const { slide } = span;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: span.runway,
          start: () => span.read.start,
          end: () => span.read.end,
          scrub: SCRUB.normal,
          invalidateOnRefresh: true,
          // After the deck's own track (+1) and wave (+2) so this measures
          // against spans that have already settled.
          refreshPriority: span.index * 10 + 5,
        },
      });

      /* A crest that marks an arrival and then gets out of the way.
         Grammar: "a change of ground" — the divider is part of the TRANSITION,
         not furniture the section keeps. On an ordinary page it leaves by being
         scrolled past; on a pinned slide nothing scrolls, so it has to be told.
         It lifts by exactly its own height, which puts it above the slide's top
         edge where `overflow-hidden` takes it, and it goes early — the reader
         has seen the hand-off by 18% of a read and wants the photograph. */
      revealHeadings(timeline, slide, splits);

      const matched = RECIPES.filter(({ match }) =>
        within(slide, match).length > 0,
      );
      if (matched.length) {
        matched.forEach(({ recipe }) => recipe(timeline, slide, span));
      } else {
        pushMedia(timeline, slide);
      }

      // The Ahead deck animates ITSELF — so the generic scrubbed arrival must
      // not also claim anything in it. It used to claim only the cards; since
      // 11 September 2026 the copy blocks enter with them, so the whole slide
      // is handed over when cards are present.
      //
      // ⚠ "on its own played clock" was true until 13 September 2026 and is
      // not any more: `aheadPhases` runs on the scrubbed timeline handed in
      // above, because a two-phase screen is a position on a clock rather than
      // a direction of travel. The handover below is unchanged and is what
      // keeps `arriveRest` from brightening a phase the swap owns.
      const aheadOwned = query<HTMLElement>(slide, "[data-truth-card]");
      arriveRest(
        timeline,
        slide,
        new Set<HTMLElement>(
          aheadOwned.length
            ? [...aheadOwned, ...query<HTMLElement>(slide, "[data-descent-arrive]")]
            : aheadOwned,
        ),
      );

      // A wholly still slide — the closing shot, the engraving — ends up here
      // with an empty timeline. Kill it rather than leaving a scrubbed
      // ScrollTrigger measuring a section that will never move: an empty
      // timeline is an invitation for a later pass to "just add one thing".
      if (!timeline.getChildren().length) {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      }
    });

    // §21 The footer. Links fade up ONCE, all together, no stagger — the page
    // has finished talking, and a stagger here would start a rhythm again.
    // Outside the deck, so it takes an ordinary viewport trigger.
    const footerLinks = document.querySelector<HTMLElement>(
      "footer [data-footer-links]",
    );
    if (footerLinks) {
      gsap.from(footerLinks, {
        opacity: 0,
        y: 16,
        duration: 0.55,
        ease: "country",
        scrollTrigger: { trigger: footerLinks, start: "top 90%", once: true },
      });
    }
  });

  return () => {
    splits.forEach((split) => split.revert());
    splits.length = 0;
    ctx.revert();
  };
}
