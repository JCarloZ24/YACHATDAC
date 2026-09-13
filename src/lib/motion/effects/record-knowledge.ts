"use client";

import gsap from "gsap";

/** A change of ground, Record questions / SCR-13, 2026-09-09. */
export function registerRecordKnowledge() {
  gsap.registerEffect({
    name: "recordQuestionAttach",
    defaults: { tilt: 3, travel: 100, shift: 0 },
    // SCR-14: the panel surfaces, then joins the edges of its neighbours.
    effect: (targets: gsap.TweenTarget, config: { tilt: number; travel: number; shift: number }) => gsap.fromTo(targets,
      { x: () => config.shift, y: () => config.travel, rotation: config.tilt, rotationX: 7, opacity: 0,
        transformPerspective: 1100, transformOrigin: "50% 100%" },
      { x: 0, y: 0, rotation: 0, rotationX: 0, opacity: 1, duration: 1, ease: "power2.out" },
    ),
  });
  gsap.registerEffect({
    name: "recordKnowledgeGround",
    effect: (targets: gsap.TweenTarget) => gsap.fromTo(targets,
      { "--record-ground-progress": "0%" },
      { "--record-ground-progress": "100%", duration: 1, ease: "none" },
    ),
  });
}
