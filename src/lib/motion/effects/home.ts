"use client";

import gsap from "gsap";
import { homeTruthScenes } from "@/content/home-truth-scenes";

/** Grammar: "the world opening", Home photo collage, 8 September 2026.
 * Gallery first, type second (F7). Semantic word wrappers remain CMS-safe.
 */
export function registerHome(): void {
  // Grammar: the road opens into an invitation (SCR-09 / ENT-05).
  gsap.registerEffect({
    name: "homeInvitation",
    defaults: {},
    effect: (targets: HTMLElement[]) => {
      const root = targets[0];
      return gsap.timeline({ paused: true })
        .fromTo(root.querySelector("[data-invitation-heading]"),
          { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "none" })
        .fromTo(root.querySelectorAll("[data-invitation-card]"),
          { y: 64, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7,
            stagger: 0.1, ease: "none" }, 0.2);
    },
  });
  // AMB-05: one seamless phase; the canvas owner controls visibility/cleanup.
  gsap.registerEffect({
    name: "homeLandscapeBreeze",
    defaults: {},
    effect: (_targets: HTMLElement[], config: { phase: { value: number }; render: () => void }) =>
      gsap.timeline({ paused: true, repeat: -1 }).fromTo(config.phase,
        { value: 0 }, { value: Math.PI * 2, duration: 24, ease: "none", onUpdate: config.render }),
  });
  // Grammar: a change of ground / Home hero dissolve, 9 September 2026.
  gsap.registerEffect({
    name: "homeHeroDissolve",
    defaults: {},
    effect: (targets: HTMLElement[], config: { state: { progress: number; portal: number; wonder: number; truth: number; truthSky: number; truthLight: number; belonging: number }; render: () => void }) => {
      const root = targets[0];
      const timeline = gsap.timeline({ paused: true });
      timeline.fromTo(config.state, { progress: 0 },
        { progress: 1, duration: 1, ease: "none", onUpdate: config.render }, 0);
      timeline.fromTo(root.querySelectorAll("[data-hero-copy]"),
        { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.3, ease: "none" }, 0);
      timeline.fromTo(root.querySelectorAll("[data-hero-scrim]"),
        { opacity: 1 }, { opacity: 0, duration: 0.4, ease: "none" }, 0);
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
      timeline.to(root.querySelector("[data-home-wonder]"),
        { y: () => -root.clientHeight, autoAlpha: 0, duration: 0.65, ease: "none" }, 3.4);
      timeline.fromTo(config.state, { truth: 0 },
        { truth: 1, duration: 0.8, ease: "none", onUpdate: config.render }, 3.4);
      timeline.fromTo(root.querySelector("[data-home-truth]"),
        { y: () => root.clientHeight * 0.35, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, ease: "none" }, 3.6);
      timeline.to({}, { duration: 0.4 }, 4.2);
      // SCR-10: measured Figma layer offsets; still prose between transitions.
      const marker = root.querySelector("[data-truth-marker]");
      const markerY = (y: number) => root.clientWidth < 1024
        ? (730 / 901 + (y - 730) * root.clientWidth / 1440 / root.clientHeight) * 100
        : y / 9.01;
      timeline.set(marker, { xPercent: homeTruthScenes[0].x / 14.4, yPercent: () => markerY(homeTruthScenes[0].y) }, 0);
      timeline.fromTo(root.querySelector("[data-truth-timeline]"),
        { autoAlpha: 0, xPercent: 100 }, { autoAlpha: 1, xPercent: 0, duration: 0.4, ease: "sine.inOut" }, 4.6);
      homeTruthScenes.forEach((scene, index) => {
        const at = 4.6 + index;
        timeline.to(config.state, { truthSky: scene.sky, truthLight: scene.light,
          duration: 1, ease: "none", onUpdate: config.render }, at);
        if (index) {
          timeline.to(marker, { xPercent: scene.x / 14.4, yPercent: () => markerY(scene.y),
            duration: 1, ease: "none" }, at);
          timeline.to(root.querySelector('[data-truth-panel="' + (index - 1) + '"]'),
            { autoAlpha: 0, duration: 0.3, ease: "sine.inOut" }, at);
          timeline.to(root.querySelector('[data-truth-year="' + (index - 1) + '"]'),
            { autoAlpha: 0, duration: 0.3, ease: "sine.inOut" }, at);
          timeline.fromTo(root.querySelector('[data-truth-panel="' + index + '"]'),
            { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: "sine.inOut" }, at + 0.32);
          timeline.fromTo(root.querySelector('[data-truth-year="' + index + '"]'),
            { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: "sine.inOut" }, at + 0.32);
        }
        // Continuous travel between years; pause only on the final account.
        if (index === homeTruthScenes.length - 1) timeline.to({}, { duration: 0.9 }, at + 1);
      });
      // SCR-10: the dated account clears before Belonging arrives.
      const belongingAt = timeline.duration();
      timeline.to(root.querySelectorAll("[data-home-truth], [data-truth-timeline]"),
        { autoAlpha: 0, duration: 0.45, ease: "sine.inOut" }, belongingAt);
      timeline.to(config.state, { truthSky: 5822, truthLight: 5822, belonging: 1,
        duration: 1.2, ease: "sine.inOut", onUpdate: config.render }, belongingAt);
      timeline.fromTo(root.querySelector("[data-home-belonging]"),
        { y: () => root.clientHeight * 0.3, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, ease: "sine.out" }, belongingAt + 0.45);
      timeline.to({}, { duration: 1.2 }, belongingAt + 1.45);
      const invitationAt = timeline.duration();
      timeline.to(root.querySelector("[data-home-belonging]"),
        { autoAlpha: 0, duration: 0.6, ease: "sine.inOut" }, invitationAt);
      timeline.to(root.querySelector("[data-landscape-exit-shade]"),
        { opacity: 1, duration: 0.6, ease: "none" }, invitationAt);
      // SCR-09, 9 September: reveal completes at 0.95; give the copy its own
      // quiet reading span. Shift the continuation without changing its pace.
      timeline.addLabel("wonderReady", 3.1);
      timeline.shiftChildren(2, true, 1.03);
      timeline.fromTo(root.querySelector("[data-painting-entrance]"),
        { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "sine.inOut" }, 1.08);
      timeline.fromTo(root.querySelector("[data-painting-place]"),
        { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "sine.inOut" }, 1.62);
      timeline.fromTo(root.querySelector("[data-painting-story]"),
        { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.55, ease: "sine.inOut" }, 2.18);
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
