"use client";

import gsap from "gsap";

/**
 * Grammar: "the world opening", homepage loading cut (motion-grammar row 48).
 *
 * ⚠ The 8 September one-second prototype counted WALL CLOCK — `timeline.time()
 * / 0.78`. From 10 September (user direction) the count belongs to the film:
 * the timeline is PAUSED and normalised to a duration of 1, and home-loader.ts
 * scrubs `progress()` from `video.currentTime / video.duration` every frame.
 *
 * That normalisation is the whole trick. It makes "the film's last frame is
 * 100%" true by construction rather than by two numbers being kept in step —
 * a 39-second wall-clock ramp drifts the instant the film buffers, and then
 * the door opens over footage still playing.
 *
 * The supplied artwork holds its geometry; only its reveal mask changes.
 */
export function registerLoading(): void {
  gsap.registerEffect({
    name: "homeLoaderFilm",
    defaults: {},
    effect: (targets: HTMLElement[]) => {
      const cover = targets[0];
      const wave = cover.querySelector("[data-loader-wave]");
      const count = cover.querySelector("[data-loader-count]");
      let lastPercent = -1;
      const timeline = gsap.timeline({
        paused: true,
        onUpdate: () => {
          const percent = Math.round(timeline.progress() * 100);
          // Only the requested numeric readout changes text; no React render
          // per frame, and no live-region announcement for every percentage.
          if (percent !== lastPercent && count) {
            count.textContent = String(percent);
            cover.setAttribute("aria-valuenow", String(percent));
            lastPercent = percent;
          }
        },
      });
      // Duration 1: this timeline is never played, only scrubbed, so its
      // seconds are meaningless and its progress is everything.
      timeline.fromTo(wave,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 1, ease: "none" },
        0,
      );
      return timeline;
    },
  });
}
