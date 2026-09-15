"use client";

import gsap from "gsap";

/** Grammar: being drawn in, Record masonry / SCR-12, 2026-09-09. */
export function registerRecordMasonry() {
  gsap.registerEffect({
    name: "recordMasonryPass",
    defaults: { travel: 0, entranceOnly: false },
    effect: (targets: gsap.TweenTarget, config: { travel: () => number; entranceOnly: boolean }) => {
      const timeline = gsap.timeline();
      // SCR-12, Wonder correction, 15 Sep 2026: a rail arrives into its
      // layout slot. Continuing above it crosses the section heading.
      timeline.fromTo(targets,
        { y: () => config.travel(), ...(config.entranceOnly ? { opacity: 0 } : {}) },
        { y: () => config.entranceOnly ? 0 : -config.travel(),
          ...(config.entranceOnly ? { opacity: 1 } : {}), duration: 1, ease: "none" }, 0);
      // The catalogue's opacity still follows actual viewport overlap in
      // the module; entrance-only rails share the timeline above instead.
      return timeline;
    },
  });
}
