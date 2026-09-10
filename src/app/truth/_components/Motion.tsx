"use client";

import { useEffect } from "react";
import { register, start, stop, watchVisibility } from "@/lib/motion-controller";
import { createTruthDescent } from "@/lib/motion/truth-descent";
import { createTruthDescentV2 } from "@/lib/motion/truth-descent-v2";
import { createGatedDeck } from "@/lib/motion/gated-deck";
import { bindTruthScenes } from "@/lib/motion/truth-scenes";
import { markEntered } from "@/lib/site-entry";

/**
 * Mounts Truth's scroll clock: section hand-offs, rail, reversible headings
 * and M1 arrivals in the base module; image-plane and scene treatments in the
 * V2 module. Renders nothing.
 *
 * TWO PATHS, one of which runs at a time.
 *
 * Where the deck engages — fine pointer, 1024px and up, Lenis present — every
 * section is pinned, and interior motion is authored against each slide's own
 * reading clock by `bindTruthScenes` (SCR-02). The descent modules stand down
 * for whatever it takes over; they check `[data-deck-active]`, which the deck
 * sets before either of them initialises.
 *
 * Everywhere else — touch, narrow, no Lenis — nothing is pinned, sections
 * cross the viewport normally, and the descent modules' own viewport-relative
 * triggers are exactly right. That path is unchanged.
 *
 * markEntered() runs here because this page has no Preloader: on a direct
 * load nothing else would ever open the entry gate and every gate="entry"
 * reveal would wait forever. Idempotent, so arriving from /v2/home (where the
 * loader already marked entry) is unaffected.
 */
export function V2TruthMotion() {
  useEffect(() => {
    markEntered();
    let cancelled = false;
    let bootFrame = 0;
    let unwatch: (() => void) | null = null;
    let unregister: Array<() => void> = [];

    // The deck changes measured slide heights before any interior scrub is
    // created. Waiting for the brand faces also prevents a second set of pin
    // starts after headline wrapping changes. The next frame also lets the
    // layout's SmoothScroll effect construct Lenis before the gated deck
    // checks for it; React does not promise sibling effect ordering here.
    void document.fonts.ready.then(() => {
      bootFrame = window.requestAnimationFrame(() => {
        if (cancelled) return;
        unregister = [
          register(
            createGatedDeck({
              root: "[data-descent-root]",
              slides: "[data-truth-slide]",
              eventPrefix: "truth",
              onSlideSpans: bindTruthScenes,
            }),
          ),
          register(createTruthDescent()),
          register(createTruthDescentV2()),
        ];
        start();
        unwatch = watchVisibility();
      });
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(bootFrame);
      unwatch?.();
      unregister.forEach((fn) => fn());
      stop();
    };
  }, []);

  return null;
}
