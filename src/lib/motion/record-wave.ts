"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "../motion-controller";
import { registerYachatdacEffects } from "./effects";

/** F7/F8, SCR-11, 2026-09-09: About's crest motion on the catalogue seam. */
export function createRecordWave(root: HTMLElement): MotionModule {
  let cleanup: (() => void) | undefined;
  return {
    init() {
      cleanup?.();
      registerYachatdacEffects();
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const ink = root.querySelector("[data-seam='record-wave'] [data-wave-ink]");
        if (!ink) return;
        const animation = gsap.effects.recordWaveRoll(ink) as gsap.core.Tween;
        ScrollTrigger.create({
          trigger: root, start: "top bottom", end: "top top",
          animation, scrub: 0.3, invalidateOnRefresh: true,
        });
      }, root);
      cleanup = () => media.revert();
    },
    destroy() { cleanup?.(); cleanup = undefined; },
  };
}
