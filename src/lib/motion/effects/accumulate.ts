"use client";

/**
 * Accumulating — the new grammar row, and Living Work's verb.
 *
 * Grammar row: "accumulating".
 *
 * Every other row in the grammar describes something arriving, opening or
 * holding. None of them describe something *adding up*, and Living Work's whole
 * argument is that the work adds up: eight days at the spring, seven streams of
 * work, five vessels filling. The page's verb earned a row.
 *
 * THE ONE RULE THIS FAMILY MUST NOT BREAK. The brief bans count-up odometers on
 * figures of loss: "A number describing people who died or land taken must not
 * tick upward like a sales metric. State it. Hold it."
 *
 * Everything here is a figure of RETURN — hectares held, a bore sunk, days a
 * spring ran, land bought back. That is a different register and the ban does
 * not reach it. But the distinction lives in the content, not in the code, so
 * these effects are deliberately built to animate a MARK to a position rather
 * than to count text upward. Point `vesselFill` at a figure of loss and you get
 * a bar sliding, which is still wrong — the guard is editorial, and this note is
 * where it is written down.
 */

import gsap from "gsap";
import { DUR, EASE, STAGGER } from "../tokens";
import { assertEase } from "./shared";

export function registerAccumulate(): void {
  /* --- the step counter --------------------------------------------------
     Grammar: "accumulating" · sketch X3 · hi-fi §05, THE SPRING.

     A pinned step-through where scroll advances a count. The hi-fi is explicit:
     "counter · X3 scrubbed 1→8, the only place scroll controls time" — eight
     days of a spring running, one per step, the reader turning the days over.

     Snapping is not optional on a scrubbed counter. Stranded between day 3 and
     day 4 the reader sees a number that does not exist, so the section module
     that pins this supplies `snap: 1 / (steps - 1)`.

     Steps declare themselves with data-step; the effect crossfades them. The
     numeral is swapped, never tweened — a day is a discrete thing and a
     half-transitioned "3.5" is a lie about what is being counted. */
  gsap.registerEffect({
    name: "stepCounter",
    extendTimeline: true,
    defaults: { duration: DUR.medium, ease: EASE.machine },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("stepCounter", config.ease);
      const steps = gsap.utils.toArray<HTMLElement>(targets);
      const duration = config.duration as number;
      const ease = config.ease as string;
      const tl = gsap.timeline();

      gsap.set(steps, { opacity: 0 });
      gsap.set(steps[0], { opacity: 1 });
      steps.slice(1).forEach((step, i) => {
        tl.to(steps[i], { opacity: 0, duration, ease }, i);
        tl.to(step, { opacity: 1, duration, ease }, i);
      });
      return tl;
    },
  });

  /* --- the split-flap counter --------------------------------------------
     Grammar: "accumulating" · hi-fi §05, THE SPRING — the departure-board cut.

     Same contract as stepCounter — steps declare themselves with data-step,
     the numeral is swapped, never tweened — but the swap is mechanical: the
     outgoing day folds away about its horizontal middle and the incoming one
     drops down into place, like a flap turning on an airport board. The hinge
     is the card's centre, so the step's box must be sized to the glyph — a
     taller box moves the hinge off the digit and the turn floats. The
     container must carry a perspective for the fold to read in 3D.

     EASE.machine on purpose: a board is a mechanism, and country easing would
     make it look like it was deciding. Each half-flip gets half the duration,
     back to back, so scrubbing backwards runs the board in reverse.

     No opacity tweens — a flap does not fade, it folds. At ±90° a step is
     edge-on and invisible on its own; the instant visibility toggles at the
     half-way point only guard against the 1px edge sliver, and being set()s
     they reverse cleanly under scrub. */
  gsap.registerEffect({
    name: "splitFlap",
    extendTimeline: true,
    defaults: { duration: DUR.medium, ease: EASE.machine },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("splitFlap", config.ease);
      const steps = gsap.utils.toArray<HTMLElement>(targets);
      const duration = config.duration as number;
      const ease = config.ease as string;
      const half = duration / 2;
      const tl = gsap.timeline();

      // `opacity: 1` because the markup holds the resting step visible and the
      // rest at opacity-0 — that is what makes the no-JS and reduced-motion
      // states readable when the steps are absolutely stacked. Without it the
      // flap would turn a digit that is still transparent.
      gsap.set(steps, { visibility: "hidden", opacity: 1, rotationX: 90, transformOrigin: "50% 50%" });
      gsap.set(steps[0], { visibility: "visible", rotationX: 0 });
      steps.slice(1).forEach((step, i) => {
        tl.to(steps[i], { rotationX: -90, duration: half, ease }, i);
        tl.set(steps[i], { visibility: "hidden" }, i + half);
        tl.set(step, { visibility: "visible" }, i + half);
        tl.fromTo(
          step,
          { rotationX: 90 },
          { rotationX: 0, duration: half, ease, immediateRender: false },
          i + half,
        );
      });
      return tl;
    },
  });

  /* --- the vessels -------------------------------------------------------
     Grammar: "accumulating" · hi-fi §08.

     "Five vessels, four filling." Each vessel fills to a proportion of its own
     row — 78%, 58%, 42%, 26%, and one at 0% that has not started. The fifth
     staying empty is the honest part of the section and must not be quietly
     rounded up to look better.

     Each vessel declares its own target with data-fill="78". Reading the value
     off the element rather than passing an array means the number lives beside
     the label it describes, so the two cannot drift apart.

     scaleX with a left origin, so this is a transform rather than a width
     animation. The mark moves; no text counts.

     ⚠ R14 — the regulatory status labels beside these are an open risk. The
     mechanism is fine; the wording is not settled, so it comes from the content
     file and is never hardcoded here. */
  gsap.registerEffect({
    name: "vesselFill",
    extendTimeline: true,
    defaults: { duration: DUR.large, ease: EASE.country, stagger: STAGGER.grid * 2 },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("vesselFill", config.ease);
      const marks = gsap.utils.toArray<HTMLElement>(targets);
      const duration = config.duration as number;
      const ease = config.ease as string;
      const stagger = config.stagger as number;
      const tl = gsap.timeline();

      marks.forEach((mark, i) => {
        const fill = Number(mark.dataset.fill ?? 0) / 100;
        // Two markups share this effect. The vessel redesign (hi-fi §08, third
        // pass) nests the moving part: [data-vessel] is the whole word — the
        // outline layer plus a clipped [data-vessel-fill] whose WIDTH is the
        // rest state. There the crop is what moves (the word underneath never
        // distorts, and a 0% vessel keeps its outline standing — the honest
        // empty word is the point). Scaling the wrapper squashed every title
        // by its fill ratio and erased the empty one entirely.
        const inner = mark.querySelector<HTMLElement>("[data-vessel-fill]");
        if (inner) {
          tl.fromTo(
            inner,
            { width: "0%" },
            { width: `${fill * 100}%`, duration, ease },
            i * stagger,
          );
          const track = mark.parentElement?.querySelector<HTMLElement>(
            "[data-vessel-track]",
          );
          if (track) {
            tl.fromTo(
              track,
              { scaleX: 0, transformOrigin: "left center" },
              { scaleX: 1, duration, ease },
              i * stagger,
            );
          }
        } else {
          // A bare mark IS the bar — the original contract.
          tl.fromTo(
            mark,
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: fill, duration, ease },
            i * stagger,
          );
        }
      });
      return tl;
    },
  });

  /* --- flatten to reveal -------------------------------------------------
     Grammar: "accumulating", disclosure cut · hi-fi §08.

     The hi-fi hides each vessel's funding source behind the vessel itself —
     "source · Biological Sequestration (hidden — the vessel above is
     flattened)". The vessel flattens on its own baseline and the source is
     underneath.

     scaleY to zero from the bottom, so the vessel collapses onto its own line
     rather than shrinking toward its middle. The revealed source fades up as it
     goes, which is why the two are on one timeline and not two.

     Not a hover: this is scroll-driven or it is a disclosure control with a real
     button. Content that only exists on hover does not exist on touch. */
  gsap.registerEffect({
    name: "flattenReveal",
    extendTimeline: true,
    defaults: { duration: DUR.medium, ease: EASE.country },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("flattenReveal", config.ease);
      const duration = config.duration as number;
      const ease = config.ease as string;
      const tl = gsap.timeline();

      gsap.utils.toArray<HTMLElement>(targets).forEach((vessel) => {
        const source = vessel.parentElement?.querySelector<HTMLElement>(
          "[data-vessel-source]",
        );
        tl.to(
          vessel,
          { scaleY: 0, transformOrigin: "left bottom", duration, ease },
          0,
        );
        if (source) {
          tl.fromTo(source, { opacity: 0 }, { opacity: 1, duration, ease }, 0);
        }
      });
      return tl;
    },
  });
}
