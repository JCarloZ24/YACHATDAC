"use client";

import { useEffect } from "react";
import { register, start, stop, watchVisibility } from "@/lib/motion-controller";
import { createTruthDescent } from "@/lib/motion/truth-descent";
import { createTruthDescentV2 } from "@/lib/motion/truth-descent-v2";
import { createGatedDeck } from "@/lib/motion/gated-deck";
import { bindTruthScenes } from "@/lib/motion/truth-scenes";
import { createTruthRewind } from "@/lib/motion/truth-rewind";
import { createTruthMobileRail } from "@/lib/motion/truth-mobile-rail";
import {
  calibrateRailMap,
  railProgressAt,
  shortMark,
  RAIL_TRAVEL_BOTTOM_INSET,
  RAIL_TRAVEL_TOP,
} from "@/lib/motion/truth-rail-map";
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
              /* The finite rail's shared map (15 September 2026): the deck
                 hands its measured read clocks to truth-rail-map, and the
                 pointer's y comes back out of the same map the record
                 fill's clip rides. Calibrated FIRST, so the scenes bind
                 against a map that already exists. */
              onSlideSpans: (spans) => {
                const releaseMap = calibrateRailMap(spans);
                const releaseScenes = bindTruthScenes(spans);
                return () => {
                  releaseScenes();
                  releaseMap();
                };
              },
              railProgress: railProgressAt,
              /* The gutter holds the full era line; the pointer wears only
                 the short mark — the same cut the mobile wave prints. */
              railLabelText: shortMark,
              railTravel: {
                top: RAIL_TRAVEL_TOP,
                bottomInset: RAIL_TRAVEL_BOTTOM_INSET,
              },
            }),
          ),
          register(createTruthDescent()),
          register(createTruthDescentV2()),
          /* The mobile rewind cue. Its own media query is the complement of
             the deck's, so exactly one of the two ever owns the hero's
             "Start from the beginning" press. */
          register(createTruthRewind()),
          /* The mobile timeline — the homepage's two-line rail at the
             viewport's foot (15 September 2026, superseding the same day's
             wave rules). Its matchMedia is the deck's complement: below lg
             the bar is the chronology, riding the same map through its own
             section calibration. */
          register(createTruthMobileRail()),
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
