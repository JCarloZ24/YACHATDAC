"use client";

/**
 * scene() — a behaviour and its reduced-motion cut, together or not at all.
 *
 * The rule this enforces is old and keeps being missed:
 *
 *     "Every behaviour ships a prefers-reduced-motion branch that CUTS —
 *      instant final state. Never a slowed-down or gentler variant.
 *      Pinning is disabled entirely."
 *
 * Both callbacks are required by the type signature, so a section cannot be
 * written without its cut. That is the whole point: X6 and the brief's section
 * 7 become a compile error rather than something caught in review, or not.
 *
 * Why matchMedia and not an if-statement: an if-statement checks once at init
 * and never updates. People change this setting mid-session — and on Windows it
 * is on by default once "Animation effects" is off, which is most reviewers'
 * machines. matchMedia also reverts everything created inside a branch when the
 * branch stops matching, which is the teardown we would otherwise write by
 * hand and get wrong.
 *
 * The reduced cut is a DESIGNED experience, not the site turned off. Dissolves
 * become state changes, pinned scrubs become sequential sections, parallax
 * stops. The story still lands in the right order with the right weight.
 */

import gsap from "gsap";

export type SceneContext = {
  /** True inside the reduced branch. Handy for shared setup helpers. */
  reduced: boolean;
};

export type SceneCleanup = void | (() => void);

/**
 * Build a scene with both of its branches.
 *
 * @param build  Full motion. Timelines, pins and scrubs go here.
 * @param cut    Reduced motion. Set the final state and return. No tweens with
 *               a duration, no pins — if this branch animates, it is wrong.
 *
 * Returns a teardown that reverts everything either branch created.
 *
 * @example
 *   const revert = scene(
 *     () => {
 *       const tl = gsap.timeline({ scrollTrigger: { trigger: el, scrub: SCRUB.normal } });
 *       tl.settle(heading).pushIn(plate, {}, "<");
 *     },
 *     () => {
 *       gsap.set([heading, plate], { clearProps: "all" });
 *     },
 *   );
 */
export function scene(
  build: (ctx: SceneContext) => SceneCleanup,
  cut: (ctx: SceneContext) => SceneCleanup,
): () => void {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => build({ reduced: false }));
  mm.add("(prefers-reduced-motion: reduce)", () => cut({ reduced: true }));

  return () => mm.revert();
}

/**
 * The same contract, scoped to a container so selector strings inside both
 * branches resolve against it rather than the document. Prefer this in
 * components — an unscoped selector in one section reaching into another is a
 * bug that only shows up once two sections use the same class.
 */
export function scopedScene(
  scope: Element | React.RefObject<Element | null>,
  build: (ctx: SceneContext) => SceneCleanup,
  cut: (ctx: SceneContext) => SceneCleanup,
): () => void {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => build({ reduced: false }), scope);
  mm.add("(prefers-reduced-motion: reduce)", () => cut({ reduced: true }), scope);

  return () => mm.revert();
}

/**
 * Pointer-refinement branch — hover tilt, cursor gravity (X8).
 *
 * Separate from scene() because these need no cut: they are wired only where a
 * fine pointer exists AND motion is welcome, so on touch and under reduced
 * motion they simply never come into being. Nothing to undo.
 */
export function pointerScene(build: () => SceneCleanup): () => void {
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", build);
  return () => mm.revert();
}
