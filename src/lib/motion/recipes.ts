"use client";

/**
 * The screen recipes.
 *
 * Six compositions, each a screen's worth of layered motion. Every one is drawn
 * from a section of the Living Work hi-fi (`03 · Living Work · HI-FI · the
 * field notebook`, Figma 2137:2613), because that file is the most complete
 * statement of what this site is supposed to feel like.
 *
 * Each recipe declares its markup contract in its doc comment. The server owns
 * structure and stamps `data-*` hooks; the recipe owns behaviour and knows
 * nothing about what the section is *about*. That is what makes them reusable
 * beyond the page they came from.
 *
 * Spans are in vh and are load-bearing. A pin whose span is not in the layout
 * gets retrofitted badly later, and a reader who scrolls through 300vh of
 * nothing thinks the page is broken.
 */

import gsap from "gsap";
import { clearAll, composition } from "@/lib/motion/compose";
import { DUR } from "@/lib/motion/tokens";
import type { MotionModule } from "@/lib/motion-controller";

const q = <T extends HTMLElement>(root: HTMLElement, sel: string) =>
  root.querySelector<T>(sel);
const qa = <T extends HTMLElement>(root: HTMLElement, sel: string) =>
  Array.from(root.querySelectorAll<T>(sel));

/* -------------------------------------------------------------------------
   01 — fullBleedOpen
   ------------------------------------------------------------------------- */

/**
 * The full-bleed hero. Hi-fi §01.
 *
 * A photograph takes the whole screen, the scrim comes up under the copy as it
 * arrives, the heading settles, and the wave divider hands the photograph off
 * into the page below it.
 *
 * Loud channel: MEDIA. The type is a plain settle and the transition is one
 * divider — the picture is what takes the screen.
 *
 * Markup:
 *   [data-media]    the image plane
 *   [data-scrim]    the legibility scrim (X5) — required where copy sits on media
 *   [data-heading]  the headline
 *   [data-wave]     the divider at the foot
 */
export function fullBleedOpen(root: HTMLElement, span = 100): MotionModule {
  return composition("fullBleedOpen", root, {
    channel: "media",
    span,
    uses: ["plateParallax", "scrimRamp", "settle", "waveHandoff"],
    build: (tl) => {
      const media = qa(root, "[data-media]");
      const scrim = q(root, "[data-scrim]");
      const wave = q(root, "[data-wave]");

      if (media.length) tl.plateParallax(media, { duration: 1 }, 0);
      if (scrim) tl.scrimRamp(scrim, { duration: 1 }, 0);
      if (wave) tl.waveHandoff(wave, { duration: 1 }, 0);
    },
    enter: (tl) => {
      const heading = q(root, "[data-heading]");
      if (heading) tl.settle(heading, { duration: DUR.large });
    },
    cut: clearAll,
  });
}

/* -------------------------------------------------------------------------
   02 — apertureSequence
   ------------------------------------------------------------------------- */

/**
 * THE APERTURE. Hi-fi §02, and the page's signature.
 *
 * "The 0 is a portal onto the plain · 300vh sticky · Y1 · M2 · C2 into the O of
 * 'Our'." The aperture opens as the figures change — the counter of the 0, then
 * the whole glyph, then the whole screen.
 *
 * Pinned, because the reader has to stay with one frame while it opens; the
 * whole device collapses if the screen scrolls away mid-open.
 *
 * Loud channel: TYPE. The photograph is enormous by the end, but it is the
 * letterform that is doing the work — the picture only exists where the type
 * lets it through. The figures and rail are quiet; nothing else on the screen
 * moves.
 *
 * Markup:
 *   [data-aperture]   the clipped container holding the photograph
 *   [data-glyph]      the `0` whose box is measured for stages 1 and 2
 *   [data-figure]     each figure in the cycle (four of them)
 *   [data-rail-tick]  the progress ticks
 */
export function apertureSequence(root: HTMLElement, span = 300): MotionModule {
  return composition("apertureSequence", root, {
    channel: "type",
    span,
    pin: true,
    uses: ["aperture", "stepCounter", "stickyIndex"],
    build: (tl) => {
      const container = q(root, "[data-aperture]");
      const glyph = q(root, "[data-glyph]");
      const figures = qa(root, "[data-figure]");
      const ticks = qa(root, "[data-rail-tick]");

      // The figures change and the ticks follow — quiet, and simultaneous with
      // the opening rather than sequenced after it, because the design says the
      // aperture opens *as* the figures change.
      if (figures.length > 1) tl.stepCounter(figures, { duration: DUR.medium }, 0);
      if (ticks.length > 1) tl.stickyIndex(ticks, { duration: DUR.small }, 0);

      // Three stages, one growing ellipse.
      if (container) {
        tl.aperture(container, { glyph, duration: 2 }, 0);
      }
    },
    cut: (el) => {
      clearAll(el);
      // Stage 3 is the honest still: the photograph already open.
      const container = q(el, "[data-aperture]");
      if (container) gsap.set(container, { clipPath: "none" });

      // ONE figure, not all four. The figures are absolutely stacked so the
      // aperture never has to re-measure between them; showing them all at once
      // superimposes four numerals into an unreadable blot. The caption strip
      // below carries all four, which is what the design's own closed state
      // does — so nothing is lost but the overlap.
      const figures = qa(el, "[data-figure]");
      gsap.set(figures, { opacity: 0 });
      if (figures[0]) gsap.set(figures[0], { opacity: 1 });
    },
  });
}

/* -------------------------------------------------------------------------
   03 — clusterDescent
   ------------------------------------------------------------------------- */

/**
 * A ground that changes under the reader. Hi-fi §03.
 *
 * "Four clusters on a ground that thins" — the ground ramp walks bone → dust →
 * dry earth across them. The colour is the argument: the section is about
 * drought and erosion, and the page dries out while you read it.
 *
 * Loud channel: TRANSITION. The clusters themselves arrive quietly; what takes
 * the screen is the ground moving underneath them.
 *
 * Markup:
 *   [data-ground]   the element whose --ground custom property is ramped
 *   [data-cluster]  each cluster
 */
export function clusterDescent(
  root: HTMLElement,
  stops: string[],
  span = 330,
): MotionModule {
  return composition("clusterDescent", root, {
    channel: "transition",
    span,
    uses: ["groundRamp", "triad", "arrive"],
    build: (tl) => {
      const ground = q(root, "[data-ground]");
      if (ground) tl.groundRamp(ground, { stops, duration: 1 }, 0);
    },
    enter: (tl) => {
      const clusters = qa(root, "[data-cluster]");
      const lines = qa(root, "[data-cluster] [data-line]");
      if (clusters.length) tl.triad(clusters, { duration: DUR.medium }, 0);
      if (lines.length) tl.arrive(lines, { duration: DUR.medium }, 0.1);
    },
    cut: clearAll,
  });
}

/* -------------------------------------------------------------------------
   04 — pinnedCount
   ------------------------------------------------------------------------- */

/**
 * THE SPRING. Hi-fi §05 — "the page's pinned moment · eight days".
 *
 * "Counter · X3 scrubbed 1→8, the only place scroll controls time." Eight days
 * a spring ran, one per step, the reader turning them over.
 *
 * Snapped, because a scrubbed counter stranded between two days shows a number
 * that does not exist. `snap` is 1/(steps-1).
 *
 * Loud channel: MEDIA. The photograph behind the count is the thing; the
 * numerals are large but they are an index, not a display.
 *
 * Markup:
 *   [data-step]   each step, crossfaded in turn
 *   [data-media]  the plate behind them
 */
export function pinnedCount(root: HTMLElement, span = 150): MotionModule {
  const steps = qa(root, "[data-step]");
  return composition("pinnedCount", root, {
    channel: "media",
    span,
    pin: true,
    snap: steps.length > 1 ? 1 / (steps.length - 1) : undefined,
    uses: ["stepCounter", "dissolve"],
    build: (tl) => {
      const media = qa(root, "[data-media]");
      if (steps.length > 1) tl.stepCounter(steps, { duration: DUR.medium }, 0);
      if (media.length > 1) tl.dissolve(media, { duration: DUR.large }, 0);
    },
    cut: (el) => {
      clearAll(el);
      // All eight days visible as a list, in order. The story still lands.
      gsap.set(qa(el, "[data-step]"), { opacity: 1 });
    },
  });
}

/* -------------------------------------------------------------------------
   05 — stickyStreams
   ------------------------------------------------------------------------- */

/**
 * The work, and what it takes. Hi-fi §06 and §07.
 *
 * Seven streams, three of them anchor tier (L2), anchor images bleeding to the
 * edge; alongside them a sticky index that lights each one as it passes, so a
 * long stretch stays navigable rather than becoming endless.
 *
 * Loud channel: MEDIA. The anchor images bleeding past the column edge are what
 * takes the screen; the index is deliberately small and quiet.
 *
 * Markup:
 *   [data-index-item]  index rows, lit in turn; may contain [data-index-rule]
 *   [data-stream]      each stream, carrying data-tier for L2
 *   [data-frame]       anchor frames that bleed; media inside is [data-frame-media]
 */
export function stickyStreams(root: HTMLElement, span = 360): MotionModule {
  return composition("stickyStreams", root, {
    channel: "media",
    span,
    uses: ["stickyIndex", "bleed", "triad"],
    build: (tl) => {
      const index = qa(root, "[data-index-item]");
      const frames = qa(root, "[data-frame]");

      if (index.length) tl.stickyIndex(index, { duration: DUR.medium }, 0);
      if (frames.length) tl.bleed(frames, { duration: DUR.large }, 0);
    },
    enter: (tl) => {
      const streams = qa(root, "[data-stream]");
      if (streams.length) tl.triad(streams, { duration: DUR.medium });
    },
    cut: clearAll,
  });
}

/* -------------------------------------------------------------------------
   06 — breath
   ------------------------------------------------------------------------- */

/**
 * BREATH. Hi-fi §07b — "1.65.1 held, no caption · the hinge between the
 * apparatus and what it earns."
 *
 * One photograph, held, with nothing on it and nothing happening. This is the
 * shortest recipe in the file and the one that makes the rest work: after 360vh
 * of streams and index, the page stops talking for half a screen.
 *
 * Loud channel: NONE, and the assertion enforces it — reach for a loud effect
 * here and the build fails. That is the point. A rest scene is a real scene.
 *
 * Markup:
 *   [data-media]  the held photograph
 */
export function breath(root: HTMLElement, span = 47): MotionModule {
  return composition("breath", root, {
    channel: "none",
    span,
    uses: ["hold"],
    build: (tl) => {
      const media = qa(root, "[data-media]");
      if (media.length) tl.hold(media, { duration: 1 }, 0);
    },
    cut: clearAll,
  });
}

/* -------------------------------------------------------------------------
   07 — vessels (the accumulating close)
   ------------------------------------------------------------------------- */

/**
 * What the work produces. Hi-fi §08.
 *
 * Five vessels, four filling — 78%, 58%, 42%, 26%, and one at 0% that has not
 * started. The fifth staying empty is the honest part of the section.
 *
 * Loud channel: NONE declared, because nothing here takes the screen: the marks
 * are small and the movement is proportional. The section's weight comes from
 * what it says, which is the correct answer for a page's final claim.
 *
 * ⚠ R14 — the regulatory status labels are an open risk. Copy comes from the
 * content file; this only moves the marks.
 *
 * Markup:
 *   [data-vessel]  each fill mark, carrying data-fill="78"
 */
export function vessels(root: HTMLElement, span = 120): MotionModule {
  return composition("vessels", root, {
    channel: "none",
    span,
    uses: ["vesselFill", "arrive"],
    // Nothing scrubs here. A fill that runs backwards as the reader scrolls up
    // would read as the work being undone, which is the opposite of the claim.
    build: () => {},
    enter: (tl) => {
      const marks = qa(root, "[data-vessel]");
      const labels = qa(root, "[data-vessel-label]");
      if (labels.length) tl.arrive(labels, { duration: DUR.medium }, 0);
      if (marks.length) tl.vesselFill(marks, { duration: DUR.large }, 0.1);
    },
    cut: (el) => {
      clearAll(el);
      // Fills shown at their true proportions, statically. The figures are the
      // content; only the animation of them is optional.
      qa(el, "[data-vessel]").forEach((mark) => {
        gsap.set(mark, {
          scaleX: Number(mark.dataset.fill ?? 0) / 100,
          transformOrigin: "left center",
        });
      });
    },
  });
}

/* -------------------------------------------------------------------------
   08 — quietArrival
   ------------------------------------------------------------------------- */

/**
 * A screen that simply arrives. Hi-fi §09.
 *
 * Heading settles, cards come in on their tiers, nothing scrubs and nothing
 * pins. Most of a site is this, and a page that ends on it ends by getting out
 * of its own way — which is right for the screen that carries the one ask.
 *
 * Loud channel: TYPE, by elimination. There is no media and no transition, so
 * the heading is the only thing that can be the loudest thing present.
 *
 * Markup:
 *   [data-heading]  the headline
 *   [data-cluster]  each card, carrying data-tier
 */
export function quietArrival(root: HTMLElement, span = 100): MotionModule {
  return composition("quietArrival", root, {
    channel: "type",
    span,
    uses: ["settle", "triad", "arrive"],
    build: () => {},
    enter: (tl) => {
      const heading = q(root, "[data-heading]");
      const clusters = qa(root, "[data-cluster]");
      const lines = qa(root, "[data-cluster] [data-line]");
      if (heading) tl.settle(heading, { duration: DUR.large }, 0);
      if (clusters.length) tl.triad(clusters, { duration: DUR.medium }, 0.1);
      if (lines.length) tl.arrive(lines, { duration: DUR.medium }, 0.2);
    },
    cut: clearAll,
  });
}

/** Everything, for the lab. */
export const RECIPES = {
  fullBleedOpen,
  apertureSequence,
  clusterDescent,
  pinnedCount,
  stickyStreams,
  breath,
  vessels,
  quietArrival,
} as const;

export type RecipeName = keyof typeof RECIPES;

