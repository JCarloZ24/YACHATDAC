"use client";

import gsap from "gsap";

/** Grammar: "the world opening", Home photo collage, 8 September 2026.
 * Gallery first, type second (F7). Semantic word wrappers remain CMS-safe.
 */
export function registerHome(): void {
  // Grammar: a change of ground / Home hero dissolve, 9 September 2026.
  gsap.registerEffect({
    name: "homeHeroDissolve",
    defaults: {},
    effect: (targets: HTMLElement[], config: { state: { progress: number; portal: number; wonder: number }; render: () => void }) => {
      const root = targets[0];
      const timeline = gsap.timeline({ paused: true });
      timeline.fromTo(config.state, { progress: 0 },
        { progress: 1, duration: 1, ease: "none", onUpdate: config.render }, 0);
      timeline.fromTo(root.querySelectorAll("[data-hero-copy]"),
        { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.3, ease: "none" }, 0);
      timeline.fromTo(root.querySelectorAll("[data-hero-scrim]"),
        { opacity: 1 }, { opacity: 0, duration: 0.4, ease: "none" }, 0);
      // SCR-09: quiet text fades overlap the painting's 45–95% reveal.
      timeline.fromTo(root.querySelector("[data-painting-entrance]"),
        { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1, ease: "sine.out" }, 0.55);
      timeline.fromTo(root.querySelector("[data-painting-place]"),
        { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1, ease: "sine.out" }, 0.65);
      timeline.fromTo(root.querySelector("[data-painting-story]"),
        { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12, ease: "sine.out" }, 0.77);
      timeline.to(root.querySelectorAll(".home-painting-copy"),
        { autoAlpha: 0, duration: 0.15, ease: "sine.inOut" }, 1.03);
      timeline.fromTo(config.state, { portal: 0 },
        { portal: 1, duration: 1, ease: "sine.inOut", onUpdate: config.render }, 1.18);
      timeline.to({}, { duration: 0.12 }, 2.18);
      timeline.fromTo(config.state, { wonder: 0 },
        { wonder: 1, duration: 0.8, ease: "none", onUpdate: config.render }, 2.3);
      timeline.fromTo(root.querySelector("[data-home-wonder]"),
        { y: () => root.clientHeight, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: "none" }, 2.3);
      timeline.to({}, { duration: 0.3 }, 3.1);
      return timeline;
    },
  });
  gsap.registerEffect({
    name: "homeHeroOpen",
    defaults: {},
    effect: (targets: HTMLElement[], config: {
      gallery: { x: number; y: number; z: number; yaw: number };
      render: () => void;
    }) => {
      const root = targets[0];
      const timeline = gsap.timeline({ paused: true });
      // 9 September: move the photos to the viewer in one uninterrupted glide.
      timeline.fromTo(root.querySelector("[data-hero-black]"),
        { opacity: 1 }, { opacity: 0, duration: 0.12, ease: "none" }, 0.14,
      );
      timeline.call(() => { root.dataset.heroPhase = "gallery"; }, [], 0.14);
      timeline.fromTo(config.gallery, { x: 24, y: -1, z: -16, yaw: -0.3 }, {
        x: 0, y: 0, z: 0, yaw: 0,
        duration: 3, ease: "power2.out", onUpdate: config.render,
      }, 0.14);
      timeline.call(() => { root.dataset.heroPhase = "type"; }, [], 3.14);
      timeline.fromTo(root.querySelectorAll("[data-hero-word]"),
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "sine.out" }, 3.14,
      );
      timeline.fromTo(root.querySelectorAll("[data-hero-quiet]"),
        { opacity: 0 }, { opacity: 1, duration: 0.45, stagger: 0.12, ease: "power1.out" }, 3.5,
      );
      return timeline;
    },
  });
}
