"use client";

/**
 * Shared machinery for the effects registry.
 *
 * Guard rails, split bookkeeping and the small helpers every family needs.
 * Nothing here registers an effect; the families do that.
 */

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

/* -------------------------------------------------------------------------
   Guard rails
   ------------------------------------------------------------------------- */

/**
 * No-op since decision F8 (31 Aug 2026): the grounded-character ease ban was
 * lifted — motion character is a design choice, not a rule. The hook is kept
 * so every effect still routes its ease through one place if a check is ever
 * wanted again.
 */
export function assertEase(name: string, ease: unknown): void {
  void name;
  void ease;
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
 * `frame`-graded media gets the world moving around it and the record holding
 * still. Since F8 (31 Aug 2026) the grade is a design choice, not a governance
 * rule — regrade a tile in `src/content/lofi/media.ts` to let its plane move.
 */
export function movable(targets: object): HTMLElement[] {
  return gsap.utils
    .toArray<HTMLElement>(targets)
    .filter((el) => el.dataset.motion !== "frame");
}
