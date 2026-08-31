"use client";

/**
 * Shared machinery for the effects registry.
 *
 * Guard rails, split bookkeeping and the small helpers every family needs.
 * Nothing here registers an effect; the families do that.
 */

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { BANNED_EASES } from "../tokens";

/* -------------------------------------------------------------------------
   Guard rails
   ------------------------------------------------------------------------- */

/**
 * The banned eases were a rule in two documents that nothing enforced.
 * Overshoot and bounce read as playful, and this site is a community's
 * testimony. Throwing in development turns "we agreed not to" into "it does not
 * build".
 *
 * Stripped from production: the check costs nothing there, but neither should a
 * visitor ever hit an exception over a style rule.
 */
export function assertEase(name: string, ease: unknown): void {
  if (process.env.NODE_ENV === "production") return;
  if (typeof ease !== "string") return;
  const banned = BANNED_EASES.find((b) => ease.startsWith(b));
  if (banned) {
    throw new Error(
      `[motion] effect "${name}" was given the banned ease "${ease}". ` +
        `${banned} easing overshoots, which reads as playful — the brand is grounded. ` +
        `Use EASE.country for anything large, EASE.quiet for interface furniture.`,
    );
  }
}

/**
 * Deterministic pseudo-noise for L3 hand irregularity. Seeded by index, so a
 * reload, a screenshot test and a reviewer's machine all agree. Random per load
 * is a bug, not a feature.
 */
export const noise = (i: number) =>
  Math.abs((Math.sin(i * 12.9898) * 43758.5453) % 1);

/** First element of whatever a caller passed as targets. */
export const first = (targets: object) =>
  gsap.utils.toArray<HTMLElement>(targets)[0];

/* -------------------------------------------------------------------------
   Split bookkeeping
   ------------------------------------------------------------------------- */

/**
 * One live SplitText per element.
 *
 * SplitText rewrites the element's DOM into wrapped lines/words/chars. Running
 * a split effect twice on the same element without reverting nests the wrappers
 * inside the previous ones — the text still reads, but line measurement drifts
 * and the accessible name degrades a little further each time.
 *
 * That never bites when an effect fires once on scroll, which is why it is easy
 * to miss. It bites immediately behind a replay button, and on any element
 * re-revealed after a route change. So splits are tracked and reverted before
 * re-splitting.
 */
const splits = new WeakMap<Element, SplitText>();

export function freshSplit(el: Element, vars: SplitText.Vars): SplitText {
  splits.get(el)?.revert();
  const split = SplitText.create(el, vars);
  splits.set(el, split);
  return split;
}

/**
 * Undo every split under `root` and clear inline styles.
 *
 * Used by the reduced-motion cut: an element that was split under full motion
 * must go back to plain text, not to split-but-visible markup.
 */
export function revertSplits(root: ParentNode): void {
  root.querySelectorAll("*").forEach((el) => {
    const split = splits.get(el);
    if (split) {
      split.revert();
      splits.delete(el);
    }
  });
}

/* -------------------------------------------------------------------------
   Grade
   ------------------------------------------------------------------------- */

/**
 * Filter targets down to those whose image plane may move.
 *
 * `frame`-graded media — cultural sites, the engravings, portraits — gets the
 * world moving around it and the record holding still. Effects that deform an
 * image call this; effects that move a plate, ground, scrim or type do not,
 * because moving those *is* the frame grade rather than a violation of it.
 */
export function movable(targets: object): HTMLElement[] {
  return gsap.utils
    .toArray<HTMLElement>(targets)
    .filter((el) => el.dataset.motion !== "frame");
}
