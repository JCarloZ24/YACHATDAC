"use client";

import gsap from "gsap";

/** SYS-02 / Record loading cut, user direction 2026-09-09.
 * Progress is resource-driven; this effect runs only after readiness/fallback. */
export function registerRecordLoading() {
  gsap.registerEffect({
    name: "recordLoader",
    defaults: {},
    effect: (targets: HTMLElement[]) => {
      const cover = targets[0];
      return gsap.timeline()
        .to(cover.querySelector("[data-loader-wave]"), {
          clipPath: "inset(0 0% 0 0)", duration: 0.16, ease: "none",
        })
        .to(cover, { opacity: 0, duration: 0.24, ease: "none" });
    },
  });
}
