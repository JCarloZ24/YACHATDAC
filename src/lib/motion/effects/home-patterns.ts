"use client";

import gsap from "gsap";

/** Grammar: what radiates, Home closing ground / user direction, 2026-09-13.
 * Hover moves inner wrappers, never the supplied artwork or scroll carrier. */
export function registerHomePatterns(): void {
  gsap.registerEffect({
    name: "homePatternDrift",
    defaults: { axis: "x" },
    effect: (targets: gsap.TweenTarget, config: { axis: "x" | "y" }) => {
      const timeline = gsap.timeline({ paused: true });
      gsap.utils.toArray<HTMLElement>(targets).forEach((ring, index) => {
        const distance = index === 0 ? 32 : -24;
        const turn = index === 0 ? 3 : -4;
        timeline.fromTo(ring, {
          [config.axis]: -distance,
          ...(config.axis === "x" ? { rotation: -turn } : {}),
        }, {
          [config.axis]: distance,
          ...(config.axis === "x" ? { rotation: turn } : {}),
          transformOrigin: "50% 50%",
          duration: 1,
          ease: "none",
        }, 0);
      });
      return timeline.progress(0.5);
    },
  });
}
