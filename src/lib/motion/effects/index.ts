"use client";

/**
 * The effects registry — the site's motion vocabulary, stored by name.
 *
 * Built on `gsap.registerEffect()`. Every effect cites a row of
 * docs/motion/motion-grammar.md and the sketch it comes from, which is what
 * makes the brief's central rule mechanical rather than aspirational:
 *
 *     "Every animation in the codebase must cite a row of this table.
 *      One that cites nothing is decoration — delete it."
 *
 * Registering with `extendTimeline: true` means each effect is BOTH a call and
 * a timeline method, so choreography reads as the grammar does:
 *
 *     gsap.effects.settle(heading);
 *     tl.settle(heading).pushIn(plate, {}, "<").hold(quote, { duration: 1.4 });
 *
 * WHAT BELONGS HERE. Pure animation builders. An effect returns a tween or a
 * timeline and knows nothing about ScrollTrigger, so the same effect works on
 * entry, on scrub, or inside a hero timeline. Scroll wiring lives in the
 * section modules and in compose.ts, where the span in vh is documented next to
 * it.
 *
 * WHAT DOES NOT. Anything stateful — ticker loops, pointer listeners, WebGL.
 * Those are modules with init/destroy.
 *
 * Per-frame work is transform, opacity and clip-path only, plus CSS custom
 * properties where a value feeds a gradient or colour string.
 *
 * Files are split by grammar family. Adding an effect means adding it to its
 * family, adding its name to EffectName below, and adding its row (or its
 * variant note) to docs/motion/motion-grammar.md — in that order, because the
 * table is the source and this is the implementation.
 */

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { EASE_CSS } from "../tokens";
import { registerAccumulate } from "./accumulate";
import { registerContinuity } from "./continuity";
import { registerCore } from "./core";
import { registerGrid } from "./grid";
import { registerMedia } from "./media";
import { registerType } from "./type";

gsap.registerPlugin(CustomEase);

export { revertSplits } from "./shared";

let registered = false;

/**
 * Idempotent. Called from every page's motion host; calling it twice is a
 * no-op rather than a double registration.
 */
export function registerYachatdacEffects(): void {
  if (registered) return;
  registered = true;

  registerEases();

  registerCore();
  registerMedia();
  registerType();
  registerGrid();
  registerContinuity();
  registerAccumulate();
}

/**
 * The brand curves, drawn once.
 *
 * `country` was `expo.out`, which is close to the CSS token
 * cubic-bezier(.16,1,.3,1) but not the same curve — so a section animated in
 * GSAP and a hover transitioned in CSS settled at visibly different rates. With
 * CustomEase the two are the same curve by construction, which is the point of
 * having a token at all.
 *
 * Named from EASE_CSS so there is exactly one place the numbers are written.
 */
function registerEases(): void {
  CustomEase.create("country", bezierOf(EASE_CSS.country));
  CustomEase.create("quiet", bezierOf(EASE_CSS.quiet));
}

/** "cubic-bezier(a,b,c,d)" -> "a,b,c,d", which is CustomEase's shorthand. */
function bezierOf(css: string): string {
  return css.replace(/^cubic-bezier\(|\)$/g, "");
}

/**
 * Every registered name.
 *
 * GSAP declares `[key: string]: any` on Timeline for extendTimeline, so a typo
 * in an effect name typechecks and fails at runtime. Keeping this list current
 * is what gives the vocabulary autocomplete and makes it discoverable.
 */
export type EffectName =
  // core — arrival, type, the rest
  | "settle"
  | "display"
  | "arrive"
  | "emanate"
  | "triad"
  | "dim"
  | "hold"
  // media — full-bleed depth
  | "frameOpen"
  | "breakOut"
  | "pushIn"
  | "plateParallax"
  | "scrimRamp"
  | "bleed"
  | "dissolve"
  // type at scale
  | "aperture"
  | "knockout"
  | "ghostType"
  | "velocityDrift"
  // grid and Flip
  | "handoff"
  | "escape"
  | "mosaic"
  | "scatterResolve"
  // section-to-section continuity
  | "ground"
  | "groundRamp"
  | "waveHandoff"
  | "stickyIndex"
  | "overlap"
  // accumulating
  | "stepCounter"
  | "splitFlap"
  | "vesselFill"
  | "flattenReveal";
