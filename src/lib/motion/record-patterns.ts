"use client";

import gsap from "gsap";
import type { MotionModule } from "../motion-controller";
import { registerRecordPatterns } from "./effects/record-patterns";

/** F7/F8, AMB-04: artwork alone moves behind the Record's readable questions. */
export function createRecordPatterns(root: HTMLElement): MotionModule {
  let cleanup: (() => void) | undefined;
  return {
    init() {
      cleanup?.();
      registerRecordPatterns();
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () => {
        const rings = root.querySelectorAll<HTMLElement>("[data-artwork^='ring-']");
        const section = root.closest("section") ?? root;
        const horizontal = gsap.effects.recordPatternDrift(rings, { axis: "x" }) as gsap.core.Timeline;
        const vertical = gsap.effects.recordPatternDrift(rings, { axis: "y" }) as gsap.core.Timeline;
        const position = { x: 0.5, y: 0.5 };
        const xTo = gsap.quickTo(position, "x", {
          duration: 0.8, ease: "power3.out", onUpdate: () => horizontal.progress(position.x),
        });
        const yTo = gsap.quickTo(position, "y", {
          duration: 1.05, ease: "power3.out", onUpdate: () => vertical.progress(position.y),
        });
        const centre = () => { xTo(0.5); yTo(0.5); };
        const move = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          // Viewport-relative input stays stable as this long section scrolls.
          xTo(gsap.utils.clamp(0, 1, event.clientX / window.innerWidth));
          yTo(gsap.utils.clamp(0, 1, event.clientY / window.innerHeight));
        };
        const observer = new IntersectionObserver(([entry]) => {
          if (!entry.isIntersecting) centre();
        });
        observer.observe(root);
        section.addEventListener("pointermove", move);
        section.addEventListener("pointerleave", centre);
        window.addEventListener("blur", centre);
        return () => {
          observer.disconnect();
          section.removeEventListener("pointermove", move);
          section.removeEventListener("pointerleave", centre);
          window.removeEventListener("blur", centre);
        };
      }, root);
      cleanup = () => media.revert();
    },
    destroy() { cleanup?.(); cleanup = undefined; },
  };
}
