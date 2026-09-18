"use client";

/**
 * Truth — the count's ring.
 *
 * Grammar row: "the ground drifting, Truth count ring" (docs/motion/
 * motion-grammar.md, user direction 18 September 2026).
 *
 * ONE Ring B for the whole dark run — the escarpment hand-off, the count's
 * opening, the figures and her testimony — where each of those screens used
 * to draw its own. The ring is fixed to the viewport and drifts slowly
 * upward against the scroll, so as the screens hand over beneath it the
 * furniture is the thing that stays: a parallax, and the only motion these
 * screens carry besides their words. It is drawn OVER the screens at 8%
 * off-white (the artwork's own opacity), which on charcoal is the faint ring
 * the frame specifies and on off-white type is nothing at all — which is what
 * lets one overlay serve four pinned slides that each paint their own ground.
 *
 * The clock is the dark run's own scroll extent, first runway's head to last
 * runway's foot, so the drift is scrubbed and reverses; the ring fades in and
 * out on the same trigger. It reads the same on the deck (pinned slides; the
 * runways are their read spans) and off it (ordinary flow), because the
 * trigger is the runways, not the pins.
 *
 * Reduced motion: no drift, the ring simply shows while the run is on screen.
 * Transform and opacity only.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "@/lib/motion-controller";
import { prefersReduced } from "@/lib/motion-controller";

const RING = "[data-truth-count-ring]";
/** The first and last slides of the dark run; the trigger is their runways. */
const FIRST = "#break-escarpment";
const LAST = "#the-count-testimony";
const RUNWAY = "[data-truth-slide-runway]";

/** How far the ring travels across the run, as a share of its own height. */
const DRIFT_PERCENT = 22;
/** The fade at either end of the run, seconds. */
const FADE = 0.45;

export function createTruthCountRing(): MotionModule {
  let ctx: gsap.Context | null = null;

  return {
    init() {
      const ring = document.querySelector<HTMLElement>(RING);
      const first = document
        .querySelector<HTMLElement>(FIRST)
        ?.closest<HTMLElement>(RUNWAY);
      const last = document
        .querySelector<HTMLElement>(LAST)
        ?.closest<HTMLElement>(RUNWAY);
      if (!ring || !first || !last) return;

      ctx = gsap.context(() => {
        gsap.set(ring, { autoAlpha: 0 });
        const onToggle = (self: ScrollTrigger) => {
          gsap.to(ring, {
            autoAlpha: self.isActive ? 1 : 0,
            duration: FADE,
            ease: "none",
            /* "auto", never `true`: a full overwrite kills every tween on the
               ring, including the scrubbed drift below — measured frozen at
               its first value on the first build of this module. */
            overwrite: "auto",
          });
        };
        const bounds = {
          trigger: first,
          endTrigger: last,
          start: "top bottom",
          end: "bottom top",
          invalidateOnRefresh: true,
          onToggle,
        } as const;

        if (prefersReduced()) {
          ScrollTrigger.create(bounds);
          return;
        }
        gsap.fromTo(
          ring,
          { yPercent: DRIFT_PERCENT },
          {
            yPercent: -DRIFT_PERCENT,
            ease: "none",
            scrollTrigger: { ...bounds, scrub: true },
          },
        );
      });
    },
    destroy() {
      ctx?.revert();
      ctx = null;
    },
  };
}
