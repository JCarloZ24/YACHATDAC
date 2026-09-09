"use client";

import gsap from "gsap";

/**
 * Grammar: "the world opening", homepage loading cut (8 September 2026).
 * User-requested one-second prototype: time progress, not asset readiness.
 * The supplied artwork holds its geometry; only its reveal mask changes.
 */
export function registerLoading(): void {
  gsap.registerEffect({
    name: "homeLoader",
    defaults: {},
    effect: (targets: HTMLElement[]) => {
      const cover = targets[0];
      const wave = cover.querySelector("[data-loader-wave]");
      const count = cover.querySelector("[data-loader-count]");
      let lastPercent = -1;
      const timeline = gsap.timeline({
        onUpdate: () => {
          const percent = Math.min(100, Math.round(timeline.time() / 0.78 * 100));
          // Only the requested numeric readout changes text; no React render
          // per frame, and no live-region announcement for every percentage.
          if (percent !== lastPercent && count) {
            count.textContent = String(percent);
            cover.setAttribute("aria-valuenow", String(percent));
            lastPercent = percent;
          }
        },
      });
      timeline.fromTo(wave,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 0.78, ease: "none" },
        0,
      );
      // 9 September: start on black before the supplied loading artwork enters.
      timeline.to(cover.querySelector("[data-loader-art]"), { opacity: 1, duration: 0.1 }, 0.14);
      timeline.to(cover, { opacity: 0, duration: 0.12, ease: "none" }, 0.88);
      return timeline;
    },
  });
}
