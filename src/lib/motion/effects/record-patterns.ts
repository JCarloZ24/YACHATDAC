"use client";

import gsap from "gsap";

/** Grammar: what radiates, Record question ground / AMB-04, 2026-09-09. */
export function registerRecordPatterns() {
  gsap.registerEffect({
    name: "recordPatternDrift",
    extendTimeline: true,
    defaults: { axis: "x" },
    effect: (targets: gsap.TweenTarget, config: { axis: "x" | "y" }) => {
      const timeline = gsap.timeline({ paused: true });
      gsap.utils.toArray<HTMLElement>(targets).forEach((ring, index) => {
        const distance = index % 2 ? -46 : 30;
        const horizontal = config.axis === "x";
        timeline.fromTo(ring, {
          [config.axis]: -distance,
          ...(horizontal ? { rotation: index % 2 ? 5 : -3.5 } : {}),
        }, {
          [config.axis]: distance,
          ...(horizontal ? { rotation: index % 2 ? -5 : 3.5 } : {}),
          transformOrigin: "50% 50%",
          duration: 1,
          ease: "none",
        }, 0);
      });
      return timeline.progress(0.5);
    },
  });
}
