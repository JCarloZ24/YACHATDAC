"use client";

import gsap from "gsap";

/** Grammar: being drawn in, Record masonry / SCR-12, 2026-09-09. */
export function registerRecordMasonry() {
  gsap.registerEffect({
    name: "recordMasonryPass",
    defaults: { travel: 0 },
    effect: (targets: gsap.TweenTarget, config: { travel: () => number }) => {
      const timeline = gsap.timeline();
      timeline.fromTo(targets, { y: () => config.travel() },
        { y: () => -config.travel(), duration: 1, ease: "none" }, 0);
      // SCR-12: opacity is driven by actual viewport overlap in the module,
      // including the current scrubbed translation, rather than shared phases.
      return timeline;
    },
  });
}
