"use client";
import gsap from "gsap";

/** INT-05: lift the frame and caption together without warping the photo. */
export function registerRecordCard() {
  gsap.registerEffect({ name: "recordCardHover", defaults: { active: false },
    effect: (target: gsap.TweenTarget, config: { active: boolean }) => gsap.to(target,
      { y: config.active ? -6 : 0, duration: 0.25, ease: "power2.out", overwrite: true }) });
}
