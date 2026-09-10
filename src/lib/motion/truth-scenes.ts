"use client";

/**
 * Truth — what each section does while it is being read.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * The gated deck pins every slide (`gated-deck.ts`, extended to /truth by user
 * direction 9 September 2026). Once a slide is pinned at `top top` with
 * `pinSpacing: false`, its contents never cross the viewport, so a
 * viewport-relative trigger on anything inside it is measuring a journey that
 * does not happen. `top 88% → top 38%` on a heading in slide N is consumed
 * while slide N is still travelling up BEHIND the slide covering it: the
 * animation runs to completion off-screen, and then nothing at all moves
 * across the 125vh the reader actually spends in that section.
 *
 * That is the whole defect. The page was not missing its choreography; it was
 * playing it where nobody could see it.
 *
 * So interior motion binds to the slide's own reading clock instead — SCR-02,
 * "section locks to viewport while an internal timeline scrubs". The deck
 * hands every clock out through `onSlideSpans`, and every beat below is
 * written as a FRACTION of the section's own read span, which is why the
 * windows read like a storyboard rather than like pixel offsets.
 *
 * THE ONE-LOUD-CHANNEL RULE STILL APPLIES (F7). Each scene's declared channel
 * is in `docs/motion/scenes.md`; interior motion here stays inside it and
 * stays quiet. Screens whose channel is `none` — 2022, the count, Older than
 * the record, the closing shot — get NOTHING, and that is enforced below by
 * refusing to build a recipe for them rather than by remembering not to.
 *
 * MARKUP CONTRACT
 * ---------------
 *   [data-truth-tile="<n>"]        a montage / strip cell, in laying order
 *   [data-truth-strip]             the six-up grid that drifts as one
 *   [data-truth-card]              an Ahead deck record, entering as a set
 *   [data-truth-attribution]       a speaker's name, held until they finish
 *   [data-truth-strata-layer="n"]  a seabed layer, built top → bottom
 *   [data-truth-deteriorates]      a ground that deteriorates as it is read
 *   [data-v2-pullback]             a frame the camera withdraws from
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

/** A pull-back departs from here and settles at rest. */
const CAMERA_PULL = 1.06;

/** The hero opens 4% over and breathes down to its resting size. */
const HERO_BREATH = 1.04;

/**
 * Montage delays, as fractions of a read span. DELIBERATELY UNEVEN — "like a
 * hand laid them down". Evenly spaced arrivals read as a slideshow, which is
 * the one thing a montage of Country must not read as.
 *
 * Fixed, never generated: a random offset per load makes every screenshot
 * comparison flap and turns a reviewer's "it felt different that time" into
 * something nobody can reproduce. This is the JITTER doctrine in tokens.ts —
 * seeded, not random.
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
 * The 1950s crossing, in hex.
 *
 * Written out rather than read from the tokens because GSAP interpolates
 * colour values, not `var()` references — a tween from "var(--color-canvas)"
 * to "var(--color-charcoal)" has nothing to interpolate and snaps. These are
 * the same four values globals.css declares; if the palette moves, they move.
 */
const CANVAS = "#f6f6ec";
const CHARCOAL = "#090e12";

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
 * Elements matching a selector inside this slide, INCLUDING the slide itself.
 *
 * The two breaks carry their marker on the `<section>` that is the slide, so a
 * plain `querySelectorAll` from the slide finds nothing and the break silently
 * loses its camera. Worth the extra line.
 */
const within = (slide: HTMLElement, selector: string) => {
  const found = query<HTMLElement>(slide, selector);
  return slide.matches(selector) ? [slide, ...found] : found;
};

/**
 * Held subtrees never receive motion, whatever else a recipe asks for.
 *
 * `data-v2-static` is the page's single "this does not move" hook, and the
 * still beats are marked with it in the markup: §06 the 2022 study, §15 the
 * count, §17 the engraving, §20 the closing shot, and Suzanne's portrait.
 * Checking the ancestor chain rather than keeping a list of ids here is what
 * makes the stillness survive: §06 and §15 both ride inside slides that DO
 * move, so a slide-level exclusion would either kill a section that should
 * animate or miss one that should not.
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
 * M1 / emerging from the ground. Brightness only, never travel — on Truth the
 * descent supplies all the movement there is, and an element that also slides
 * is competing with the page.
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

/** Being drawn in, pull-back cut. The camera withdraws instead. */
function pullMedia(
  timeline: gsap.core.Timeline,
  slide: HTMLElement,
  from = CAMERA_PULL,
) {
  const frames = within(slide, "[data-v2-pullback]").filter(
    (frame) => !isHeld(frame),
  );
  frames.forEach((frame) => {
    const planes = planesOf(frame);
    if (!planes.length) return;
    timeline.pullBack(
      planes,
      { from, scale: 1, duration: 1, ease: "none" },
      0,
    );
  });
}

/**
 * B5 / what endures. Line masks, scrubbed and reversible, but now measured
 * against the reading clock rather than against a viewport the pinned heading
 * never crosses.
 */
function revealHeadings(
  timeline: gsap.core.Timeline,
  slide: HTMLElement,
  splits: SplitText[],
) {
  query<HTMLElement>(slide, "[data-descent-heading]")
    .filter((heading) => !isHeld(heading))
    // THE SECTION'S OWN HEADLINE IS NOT REVEALED — it is already there.
    // On a deck a section arrives whole and then holds, so a masked heading
    // means the reader looks at an empty slide and has to scroll to find out
    // what it says. That reads as a page still loading, not as a page being
    // read to. Any LATER heading in the same slide still rises, because by
    // then the reader has arrived and the reveal is a reward rather than a
    // toll (user direction, 9 September 2026).
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
 * This lands EARLY and finishes early — 0.02 to 0.16 — because the record it
 * brightens is the parent of any montage tiles below it, and opacity
 * multiplies down the tree. The block resolves first, then the photographs are
 * laid into it; overlapping the two would leave the tiles muddy for the first
 * part of their own window for no reason anyone could name.
 */
function arriveRest(
  timeline: gsap.core.Timeline,
  slide: HTMLElement,
  claimed: Set<HTMLElement>,
) {
  const rest = query<HTMLElement>(slide, "[data-descent-arrive]").filter(
    (el) => !claimed.has(el) && !isHeld(el),
  );
  // The LEAD block of every section is at full strength from the first frame:
  // its year, its kicker, its headline, its opening paragraph. M1 is "emerging
  // from the ground", not "withheld until paid for", and on a pinned deck a
  // dimmed opening line means the reader has to scroll before the section will
  // tell them anything. Everything BELOW the lead still emerges.
  brightenAt(timeline, rest.slice(1), 0.02, 0.16);
}

/* -------------------------------------------------------------------------
   The section recipes
   ------------------------------------------------------------------------- */

/**
 * §01 Intro. The photograph breathes rather than sitting still: it opens 4%
 * over and settles to its resting size.
 *
 * It runs on its OWN trigger, across read + cover, not on the slide timeline.
 * The hero's read runway is a deliberately short 20vh — it exists to let the
 * navbar clear, not to be a reading span — and a 4% settle compressed into a
 * fifth of a viewport is a twitch, not a breath. Spending the cover as well
 * gives it a little over a full viewport to relax across, and the hero is on
 * screen for all of it.
 *
 * This supersedes the ledger's "the hero … held at its rendered state"; the
 * copy is still held, only the photograph moves.
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
 * §02/§03 Ahead. The two records arrive as a set — left, then right, each
 * lifting as it brightens. The frame draws three across at ~100ms apart; the
 * governing draft carries two, so two is what staggers. The gap between them
 * is the ~100ms reading equivalent, not a literal delay.
 *
 * Their photographs deliberately take no push (see FeatureMedia) — the plane's
 * transform belongs to the hover.
 */
const aheadCards: Recipe = (timeline, slide) => {
  query<HTMLElement>(slide, "[data-truth-card]")
    .filter((card) => !isHeld(card))
    .forEach((card, index) => {
      // The first card is already legible; the set assembles behind it.
      if (index === 0) {
        query<HTMLElement>(card, "[data-truth-tile]").forEach((tile) => {
          const order = Number(tile.dataset.truthTile ?? 0);
          const from = 0.08 + order * 0.06;
          brightenAt(timeline, [tile], from, from + 0.18);
        });
        return;
      }
      const at = index * 0.3;
      // BRIGHTNESS ONLY, no travel. Two reasons that happen to agree.
      //
      // M1 says so — "an element brightens from a visible dim state without
      // moving ... the descent supplies all travel" — and a card that also
      // slides is competing with the page it is sliding down.
      //
      // And the card's transform is spoken for: the hover lift is a CSS rule,
      // and GSAP writes transforms inline, which beats a stylesheet. An
      // entrance that animates `y` silently kills the hover — it does not
      // error, the card simply never lifts. The brief's "lifting" is the
      // pointer gesture; the entrance is the brightening.
      timeline.fromTo(
        card,
        { opacity: M1_DIM },
        { opacity: 1, ease: "none", duration: 0.18 },
        at,
      );
      query<HTMLElement>(card, "[data-truth-tile]").forEach((tile) => {
        const order = Number(tile.dataset.truthTile ?? 0);
        const from = at + 0.08 + order * 0.06;
        brightenAt(timeline, [tile], from, from + 0.18);
      });
    });
};

/** §04/§05 TODAY. The plate pushes; the montage is laid down by hand. */
const todayDeck: Recipe = (timeline, slide) => {
  pushMedia(timeline, slide);
  layTiles(timeline, slide, MONTAGE_STARTS);
};

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
 * read as ONE strip being pulled across rather than six things appearing,
 * then the whole strip drifts left as the reading continues — the evidence
 * carrying on past the edge of what is being said about it.
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
 * §12 2003. Suzanne's father, in his own words.
 *
 * The words undim one at a time at speaking pace — not a typing effect, not a
 * block fade. The attribution is held back until the last word has landed:
 * someone finishes speaking, and only then are they named.
 *
 * The portrait itself is held (`data-v2-static` in the markup), so nothing
 * here touches it.
 */
/**
 * A person speaking — words undim at speaking pace, no movement at all.
 *
 * THE ONE IMPLEMENTATION. Every quotation on Truth runs through this: the 2003
 * portrait beat and both of Suzanne's screens on the hard stop. They are the
 * same act — a person being read — so they are the same code rather than two
 * things tuned to look alike (user direction, 10 September 2026).
 *
 * A reading-line variant was built and rejected: it lit each word as it crossed
 * 62% of the viewport, which put the boundary in a tidier place but did not
 * read like this one.
 */
/**
 * A scrub span that STARTS WHILE THE SECTION IS STILL ARRIVING.
 *
 * The undim itself is unchanged — same staggered tween, same feel. What moves
 * is when it runs. Bound to the reading span alone, the words light while they
 * sit near the top of the screen: the section is already pinned, its block has
 * already climbed, and measured on her testimony the read/unread boundary sat
 * between 35px and 190px down a 900px viewport for the whole beat.
 *
 * Words light where they are when their turn comes, so the fix is to give them
 * their turn earlier — during the viewport of scroll in which the section is
 * rising into view, when the copy is still low on the screen and near the rail
 * pointer, which sits at about 96% of the viewport. The reveal then runs from
 * the foot of the screen upward with the reader, instead of at the ceiling
 * ahead of them.
 */
function arrivalTimeline(span: DeckSlideSpan) {
  return gsap.timeline({
    scrollTrigger: {
      trigger: span.runway,
      start: () => span.read.start - window.innerHeight,
      end: () => span.read.start + (span.read.end - span.read.start) * 0.45,
      scrub: SCRUB.normal,
      invalidateOnRefresh: true,
      refreshPriority: span.index * 10 + 6,
    },
  });
}

function speakWords(
  timeline: gsap.core.Timeline,
  words: HTMLElement[],
  at = 0.1,
  amount = 0.55,
) {
  if (!words.length) return;
  // State the dim explicitly instead of trusting the fromTo to do it.
  //
  // A STAGGERED fromTo inside a scrubbed timeline only renders its from-value
  // for the FIRST target: the quotation loaded with its opening word dim and
  // every other word already at full strength, and only snapped into its
  // proper dim state once ScrollTrigger first rendered the timeline — which
  // reads as the words FADING as you scroll into them, exactly backwards. The
  // unstaggered tweens on this page (tiles, strata) never showed it, which is
  // what gave the stagger away.
  gsap.set(words, { opacity: Y2_DIM });
  // `amount`, not `each`. With `each` every word ALSO gets the full duration
  // on top of its own offset, so the quotation overruns the span it was given
  // and whatever follows arrives while half the words are still unread.
  timeline.fromTo(
    words,
    { opacity: Y2_DIM },
    { opacity: 1, ease: "none", duration: 0.12, stagger: { amount } },
    at,
  );
}

const testimony: Recipe = (timeline, slide) => {
  const block = slide.querySelector<HTMLElement>("[data-y2]");
  const words = block ? query<HTMLElement>(block, "[data-y2-word]") : [];
  if (words.length) {
    speakWords(timeline, words);
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
 * The one ground on the page that MOVES. It opens on the page's egg white and
 * walks down to the count's charcoal as the band is read, so the reader
 * arrives at the hard stop already in the dark.
 *
 * This replaced an alpha dim. Over the old roasted-brown ground a charcoal
 * wash read as a light going out; over egg white the identical wash renders
 * grey — a bruise, not a dusk. So the band ramps the ground COLOUR rather
 * than dimming it, through the same `::before` painter every other slide uses.
 *
 * Three properties, not one, and the other two are not decoration. This
 * palette has no middle tier (tone.ts): charcoal type is 17.83:1 on the egg
 * white and invisible on charcoal, off-white type is the exact inverse, and
 * the warm accent has the same problem in reverse — burnt-deep is the only
 * compliant warm on cream and is illegal on charcoal, where gold is the accent
 * and gold is illegal on cream. Ground, ink and accent cross over together or
 * the band spends half its span unreadable.
 *
 * The photograph still takes no push: giving it camera movement would flatter
 * it. The document slot stays a held frame.
 *
 * Grammar: "a change of ground", scrubbed cut — the row `groundRamp` carries.
 * Written as plain `fromTo`s rather than through that effect, deliberately:
 * `groundRamp` builds its own root timeline internally, and nested inside a
 * scrubbed parent it renders at its end stop for the whole span — the band
 * sat charcoal from the first frame and never travelled. Every other beat in
 * this file states its own start and end on the master timeline, which is
 * also the only form that reverses correctly on scroll-back.
 */
const nineteenFifties: Recipe = (timeline, slide) => {
  const [band] = within(slide, "[data-truth-deteriorates]");
  if (!band) return;
  // The CSS rest state is the END of this journey (charcoal), so that no-JS,
  // reduced motion and the unpinned flow path all read "the light has gone
  // out" as a statement. On the deck the band has to be put back to its
  // opening before the scrub takes over, or it shows dark while the cover
  // reveals it and then jumps back to light to start.
  gsap.set(band, { "--truth-slide-ground": CANVAS, "--truth-ink": CHARCOAL });

  // LINEAR, so the ground tracks the scroll one-for-one.
  //
  // This was `power3.inOut` for one pass, to hurry the ground through the
  // mid-greys where contrast is weakest. It measured better and read wrong:
  // the first third of the section scrolled with the ground visibly still,
  // then the colour lurched through its whole change between 40% and 70% and
  // was finished before the reader reached the foot. Scrubbed motion that
  // sits still while you scroll does not read as eased, it reads as broken —
  // and `machine` is the token rule here anyway ("only ever correct for
  // scrubbed media... the visitor sets the pace"). The visitor sets the pace.
  //
  // The cost is taken knowingly: a linear walk spends longer in the middle,
  // where no ink in this palette clears 4.5:1 against the ground. See the
  // step below, which is what keeps that window survivable.
  // Egg white straight down to the count's charcoal. No intermediate stop:
  // user direction, 9 September 2026, after seeing a version routed through
  // Roasted Brown. That version measured better — it kept every intermediate
  // on the palette's warm axis and its worst contrast was 5.89:1 against this
  // one's 3.47:1 — but a straight fade is what the band is for, and the brown
  // read as a third ground appearing halfway down.
  //
  // The ease still matters, and carries the whole legibility argument below.
  timeline.fromTo(
    band,
    { "--truth-slide-ground": CANVAS },
    { "--truth-slide-ground": CHARCOAL, ease: "none", duration: 1 },
    0,
  );

  // The ink does NOT walk with it. Crossing type linearly against its own
  // ground is how you get invisible copy: measured at the midpoint, ground
  // and ink both arrive at grey — rgb(133,135,132) against rgb(122,125,122),
  // which is 1.05:1. The whole middle of the band was unreadable.
  //
  // So the ink SWITCHES rather than travels, and it switches inside the
  // ground's own fast middle.
  //
  // It has to be a step, not a short tween. A tween walks the ink through the
  // greys at the same moment the ground is walking through them, so the two
  // meet: measured, the heading hit 1.05:1 against its own ground at the
  // crossing — briefly invisible, which is worse than a visible cut. Stepping
  // at the point the ground's luminance passes ~0.16 means neither state is
  // ever worse than about 4.3:1, and both improve immediately either side.
  //
  // A hard swap of type colour would be crude anywhere else on this site. It
  // is right here because the ground is already moving under it: the reader
  // reads a change of light, not a change of typeface.
  // Written as a near-zero fromTo rather than two `set`s: a GSAP `set` is a
  // zero-duration tween with immediateRender on, so BOTH would fire at build
  // time and the later one would simply win — the band rendered off-white ink
  // on its off-white opening ground, which is the invisible state this whole
  // comment exists to avoid. A fromTo states both ends, applies the "from"
  // immediately, and reverses correctly on scroll-back.
  //
  // THE WARM ACCENT DOES NOT SURVIVE THIS BAND, so it is not asked to.
  // Measured: burnt-deep needs a ground lighter than about L 0.56 and gold
  // needs one darker than about L 0.08 — between those the band has no warm
  // that clears 4.5:1, and that gap is most of the ramp. Carrying gold through
  // it put the eyebrow at 2.08:1 against its own ground. So in this band the
  // accent steps with the ink instead of staying warm: 17.83:1 at both ends,
  // and the eyebrow stays legible the whole way down.
  //
  // It also happens to be the right reading. This is the band where the light
  // goes out; the colour draining out of its labels with it is the argument,
  // not a compromise. The eyebrow is still ExtraBold and uppercased, so it
  // remains an eyebrow without needing to be a different hue.
  const CROSS_AT = 0.53;
  timeline.fromTo(
    band,
    { "--truth-ink": CHARCOAL },
    { "--truth-ink": CANVAS, ease: "none", duration: 0.004 },
    CROSS_AT,
  );
};

/**
 * §08 / §14 the breaks. The page has already stopped; the camera pulls back
 * while one full-bleed image crosses into the other.
 */
const breakPullBack: Recipe = (timeline, slide) => {
  pullMedia(timeline, slide);
  const dissolve = slide.querySelector<HTMLElement>("[data-v2-dissolve]");
  if (dissolve) {
    timeline.fromTo(
      dissolve,
      { opacity: 1 },
      { opacity: 0, ease: "none", duration: 1 },
      0,
    );
  }
};

/**
 * §19 100 million years. The only section that builds DOWNWARD, in the same
 * direction as the scroll — three layers arriving top, middle, then bottom,
 * the way the strata themselves were laid.
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
/**
 * §15C her testimony. Her words undim at speaking pace and nothing else on the
 * screen moves — the same treatment the 2003 portrait beat gets, because it is
 * the same act: a person is being read.
 *
 * There is deliberately no recipe for the count itself. That screen carries
 * `data-v2-static`, so every helper here filters it out and the numerals are
 * simply there when it lands.
 */
const herTestimony: Recipe = (timeline, slide, span) => {
  // Her quotations are read, not revealed: each one undims word by word, in
  // turn, at the pace someone would say it. A long quote gets a longer span
  // than a short one — "So they decided we needed blankets." should not take
  // as long to arrive as the paragraph before it.
  // Each quotation in turn, and each gets a share of the reading span in
  // proportion to its own length: "So they decided we needed blankets." should
  // not take as long to arrive as the paragraph before it.
  const blocks = query<HTMLElement>(slide, "[data-y2]").filter(
    (el) => !isHeld(el),
  );
  const perBlock = blocks.map((b) => query<HTMLElement>(b, "[data-y2-word]"));
  const total = perBlock.reduce((sum, w) => sum + w.length, 0) || 1;
  const speaking = arrivalTimeline(span);
  const READING = 0.82;
  let at = 0.02;
  perBlock.forEach((w) => {
    const share = (w.length / total) * READING;
    speakWords(speaking, w, at, Math.max(0.05, share - 0.1));
    at += share;
  });

  // After she has finished speaking: her standing line, then the closing
  // paragraphs. M1 brightness, no travel — the words above did the work.
  // Plain selectors and a filter, not `:has()`. An unsupported selector makes
  // querySelectorAll throw a SyntaxError, and that would take the whole
  // module down rather than degrading — too much to risk on a nicety.
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
 * §15A who is speaking. Her opening line is testimony too, so it is read the
 * same way; the marker, title and lede around it take the ordinary M1.
 */
const herOpening: Recipe = (_timeline, slide, span) => {
  const block = slide.querySelector<HTMLElement>("[data-y2]");
  speakWords(
    arrivalTimeline(span),
    block ? query<HTMLElement>(block, "[data-y2-word]") : [],
  );
};

const RECIPES: ReadonlyArray<{ match: string; recipe: Recipe }> = [
  { match: "[data-v2-hero-media]", recipe: heroBreath },
  { match: "[data-truth-card]", recipe: aheadCards },
  { match: "#today-fire", recipe: todayDeck },
  { match: "#research-discovery", recipe: researchStrip },
  { match: "#break-country-now", recipe: breakPullBack },
  { match: "#father", recipe: testimony },
  { match: "#art-gallery", recipe: nineteenFifties },
  { match: "#break-escarpment", recipe: breakPullBack },
  { match: "#opportunities", recipe: openResearch },
  { match: "#the-count", recipe: herOpening },
  { match: "#the-count-testimony", recipe: herTestimony },
  { match: "#seabed", recipe: strata },
];

/**
 * THE STILLNESSES, and why each one is still.
 *
 * There is no list of them in this file, deliberately. Each is marked
 * `data-v2-static` in the markup and every helper above filters on
 * `isHeld()`, so a still beat stays still without any module having to
 * remember it. Two of them ride inside slides that DO move — the 2022 study
 * shares a slide with Research & discovery, and the count rides inside the
 * escarpment break — so a slide-level exclusion would have been wrong in both
 * directions at once.
 *
 *   §06 #study-2022   "the page stops moving here, on purpose" (Figma)
 *   §15 #the-count-figures  the hard stop's own screen. The rail has
 *                     drained, the ground is charcoal, and the number is the
 *                     only red on the page — no animation, no count-up, no
 *                     glow. The two screens either side of it DO arrive, and
 *                     that is the point: stillness only reads as stillness
 *                     next to something that moved.
 *   §17 #engraving    older than the record. The stillness is the argument
 *   §20 #underneath-all-of-it   the closing shot. The descent has ended; it
 *                     does not dissolve back to where it started
 *   §12 the portrait  a person speaking is read in stillness
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

      revealHeadings(timeline, slide, splits);

      const matched = RECIPES.filter(({ match }) =>
        within(slide, match).length > 0,
      );
      if (matched.length) {
        matched.forEach(({ recipe }) => recipe(timeline, slide, span));
      } else {
        pushMedia(timeline, slide);
      }

      // The Ahead cards animate themselves, so the generic arrival pass must
      // not brighten them a second time.
      arriveRest(
        timeline,
        slide,
        new Set<HTMLElement>(query<HTMLElement>(slide, "[data-truth-card]")),
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
