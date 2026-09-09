"use client";

import gsap from "gsap";

/** Grammar: being drawn in, Wonder landscapes (F7, user direction 2026-09-09).
 * Separate transform layers let scroll approach and pointer gaze coexist.
 */
export function registerLandscapeEffects() {
  gsap.registerEffect({
    name: "landscapeApproach",
    extendTimeline: true,
    defaults: {},
    effect: (targets: gsap.TweenTarget) =>
      gsap.fromTo(targets, { scale: 1.035 }, {
        scale: 1, duration: 1, ease: "none",
      }),
  });
  gsap.registerEffect({
    name: "landscapeGyroscope",
    extendTimeline: true,
    defaults: { axis: "x" },
    effect: (targets: gsap.TweenTarget, config: { axis: "x" | "y" }) => {
      const horizontal = config.axis === "x";
      const translation = horizontal ? "xPercent" : "yPercent";
      const rotation = horizontal ? "rotationY" : "rotationX";
      return gsap.timeline({ paused: true }).fromTo(targets, {
        [translation]: -1.2,
        [rotation]: horizontal ? -1 : 1,
      }, {
        [translation]: 1.2,
        [rotation]: horizontal ? 1 : -1,
        transformPerspective: 1600,
        duration: 1,
        ease: "none",
      }).progress(0.5);
    },
  });
}
