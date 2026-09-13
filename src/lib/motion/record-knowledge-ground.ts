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
            tilt: [2.5, -2, -5, 4][index % 4],
            // User direction, 14 September 2026: 03 and 04 enter together
            // and read as one move. 03 now swings in from the left on a
            // steeper tilt; 04 rises from further below, off the right, and
            // follows a beat later.
            get travel() { return window.innerHeight * [0.12, 0.12, 0.06, 0.2][index % 4]; },
            get shift() { return window.innerWidth * [0, 0, -0.06, 0.05][index % 4]; },
          }) as gsap.core.Tween;
          // User direction, 14 September 2026 (second pass): attach
          // immediately. No longer scrubbed across the scroll — the panel
          // snaps into place in one quick play the moment it enters, and
          // reverses only when the reader scrolls back above it.
          // Eased back a little the same day: 0.45s, then 0.9s, read as too abrupt.
          attach.duration(1.4).delay(index % 4 === 3 ? 0.25 : 0).pause(0);
          ScrollTrigger.create({ trigger: panel, start: "top 95%",
            animation: attach, toggleActions: "play none none reverse",
            invalidateOnRefresh: true });
        });
      }, root);
      cleanup = () => media.revert();
    },
    destroy() { cleanup?.(); cleanup = undefined; },
  };
}
