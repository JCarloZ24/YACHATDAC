"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "../motion-controller";
import { registerRecordKnowledge } from "./effects/record-knowledge";

/** SCR-13, 2026-09-09: cream-to-blue entrance, with still readable content. */
export function createRecordKnowledgeGround(root: HTMLElement): MotionModule {
  let cleanup: (() => void) | undefined;
  return {
    init() {
      cleanup?.();
      registerRecordKnowledge();
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        // SCR-13 clarification: the catalogue and questions share one ground.
        const grid = root.parentElement?.querySelector<HTMLElement>("[data-record-grid]");
        const animation = gsap.effects.recordKnowledgeGround(grid ? [grid, root] : root) as gsap.core.Tween;
        ScrollTrigger.create({ trigger: root, start: "top 85%", end: "top 15%",
          animation, scrub: 0.4, invalidateOnRefresh: true });
        root.querySelectorAll<HTMLElement>(".record-question-panel").forEach((panel, index) => {
          const attach = gsap.effects.recordQuestionAttach(panel, {
            tilt: [2.5, -2, -3, 2][index % 4],
            get travel() { return window.innerHeight * 0.12; },
          }) as gsap.core.Tween;
          ScrollTrigger.create({ trigger: panel, start: "top 95%", end: "top 25%",
            animation: attach, scrub: 0.8, invalidateOnRefresh: true });
        });
      }, root);
      cleanup = () => media.revert();
    },
    destroy() { cleanup?.(); cleanup = undefined; },
  };
}
