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

/**
 * A seeded lay order for a field of tiles.
 *
 * Returns a permutation of 0…count-1: read it as "the tile at index `n` takes
 * the `order[n]`-th arrival slot". Grammar: "the world opening, laid by hand,
 * Truth montage cut" — laying a grid in reading order reads as a mechanical
 * sweep, which is the same failure the older "laid by hand" row was written
 * against, and shuffling the order is what restores the hand.
 *
 * ⚠ SEEDED, AND THE SEED IS THE WHOLE POINT. A pure function of (count, seed)
 * through `noise` above, so a reload, a screenshot test, a reviewer's machine
 * and a deck rebuild after a resize all lay the SAME order. `Math.random()`
 * here would make every screenshot flap and two reviewers see two designs —
 * the rule `noise` and JITTER already state, applied to order rather than to
 * offset.
 *
 * Reversibility is free and does not belong here: callers bake the order into
 * positions on a scrubbed timeline, so scrolling back up retraces it exactly
 * rather than replaying anything.
 *
 * Fisher–Yates, walked backwards, drawing each swap index from `noise`.
 */
export const layOrder = (count: number, seed = 0): number[] => {
  const order = Array.from({ length: Math.max(0, count) }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(noise(seed * 101 + i * 7 + 1) * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
};

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
 *
 * ⚠ THE COROLLARY: ONE SPLIT BEAT PER ELEMENT, PER TIMELINE. Reverting the
 * previous split destroys the line nodes it made, so a tween built against
 * those nodes is left animating elements that are no longer in the document —
 * silently, because nothing errors and the element simply sits at its rest
 * state. Give one element two split effects (say `settle` in and `vacate` out)
 * and the FIRST one stops working while the second looks perfect.
 *
 * Found on /about §03, 12 September 2026: claim 2 was the only element on that
 * timeline that both arrives and leaves, and its arrival did nothing. If an
 * element needs both, drive one of the two beats off something that does not
 * split — a fade or a transform on the element itself — or author both against
 * a single split you own.
 */
const splits = new WeakMap<Element, SplitText>();

export function freshSplit(el: Element, vars: SplitText.Vars): SplitText {
  splits.get(el)?.revert();
  const split = SplitText.create(el, vars);
  splits.set(el, split);
  return split;
}

/**
 * A split beat that survives its own element re-splitting.
 *
 * ⚠ THIS EXISTS BECAUSE `autoSplit` SILENTLY UNDOES A PLAYED BEAT, and the
 * symptom is a sentence that will not leave the screen.
 *
 * Every split effect here asks for `autoSplit: true`, which is right: SplitText
 * re-splits when the text re-wraps — a window resize, a browser zoom, a font
 * arriving late — so the line boxes keep matching the lines. But a re-split
 * BUILDS NEW LINE NODES and throws the old ones away, and the tween the
 * timeline is holding goes on animating the nodes that left the document. The
 * fresh lines render at their own rest state: `yPercent: 0`, `opacity: 1`.
 *
 * For an arrival (`gsap.from`) that is invisible — rest IS the arrived state.
 * For an exit it is the bug: the sentence that had left comes back at full
 * opacity and can never leave again, because nothing is animating it any more.
 * Measured on /about §03, 14 September 2026 — claim 1 vacated correctly
 * (`yPercent −110`, `opacity 0`), a re-wrap restored it to `0 / 1`, and it then
 * sat under claim 2 in the one grid cell the two share. Reported as the two
 * claims conflicting.
 *
 * So the beat is rebuilt against the new nodes and put back where the old one
 * sat: same parent, same start time, and wound to the local time the parent is
 * already at, so a scrubbed timeline keeps the state its progress has earned
 * instead of jumping. `onSplit` is GSAP's own hook for this; what it does not
 * do by itself is re-seat the replacement on a parent timeline, which is the
 * whole of the work here.
 *
 * The first call is not a re-split: it returns the tween for the effect to hand
 * to its timeline in the ordinary way, and no parent exists yet.
 */
export function splitTween(
  el: Element,
  vars: SplitText.Vars,
  build: (split: SplitText) => gsap.core.Tween,
): gsap.core.Tween {
  let current: gsap.core.Tween | undefined;

  const rebuild = (split: SplitText) => {
    const next = build(split);
    const prev = current;
    current = next;
    if (!prev) return next;

    const parent = prev.parent;
    const at = prev.startTime();
    prev.kill();
    if (parent) {
      parent.add(next, at);
      /* Wind the replacement to where the parent already is. Without this the
         new nodes sit at their rest state until the next scroll moves the
         scrub, which is the same defect one frame later. */
      const local = parent.time() - at;
      next.time(Math.min(Math.max(local, 0), next.duration()), true);
    }
    return next;
  };

  splits.get(el)?.revert();
  const split = SplitText.create(el, {
    ...vars,
    onSplit: (self: SplitText) => rebuild(self),
  });
  splits.set(el, split);
  if (!current) {
    /* `onSplit` fires synchronously inside `create`, so this cannot happen —
       and if a future SplitText ever changes that, failing here is better than
       handing a timeline an undefined beat and losing the effect in silence. */
    throw new Error("splitTween: SplitText did not call onSplit");
  }
  return current;
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
    .filter(
      (el) =>
        el.dataset.motion !== "frame" &&
        !el.closest<HTMLElement>("[data-motion='frame']"),
    );
}
