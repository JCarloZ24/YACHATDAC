"use client";

import gsap from "gsap";

/**
 * Grammar: "the world opening", handprintPortal / SCR-11, 2026-09-08.
 * The user replaces The Record's static intro with a scroll-through aperture.
 * This effect owns only a unitless camera progress value and quiet copy
 * opacity. WebGL resources and ScrollTrigger belong to record-portal.ts.
 */
export function registerPortal(): void {
  gsap.registerEffect({
    name: "handprintPortal",
    extendTimeline: true,
    defaults: { duration: 1, copy: [] },
    effect: (targets: object, config: Record<string, unknown>) => {
      const duration = config.duration as number;
      const timeline = gsap.timeline();
      timeline.fromTo(
        targets,
        { progress: 0 },
        {
          progress: 1,
          duration,
          ease: "none",
        },
        0,
      );
      timeline.to(
        config.copy as gsap.TweenTarget,
        {
          opacity: 0,
          duration: duration * 0.18,
          ease: "none",
        },
        0,
      );
      return timeline;
    },
  });
}
