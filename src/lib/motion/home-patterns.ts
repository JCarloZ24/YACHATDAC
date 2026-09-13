"use client";

import gsap from "gsap";
import type { MotionModule } from "../motion-controller";
import { registerHomePatterns } from "./effects/home-patterns";

/** F7 / what radiates, Home closing ground, 13 September 2026 user request.
 * Pointer intent animates two wrappers, with no idle loop or layout reads on
 * pointermove. The existing canvas timeline still owns entrance and exit. */
export function createHomePatterns(root: HTMLElement): MotionModule {
  let cleanup: (() => void) | undefined;
  return {
    init() {
      cleanup?.();
      registerHomePatterns();
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () => {
        const panel = root.querySelector<HTMLElement>("[data-home-way-forward]");
        const ground = panel?.querySelector<HTMLElement>("[data-way-forward-ground]");
        const rings = panel?.querySelectorAll<HTMLElement>("[data-home-pattern]");
        if (!panel || !ground || !rings?.length) return;

        const horizontal = gsap.effects.homePatternDrift(rings, { axis: "x" }) as gsap.core.Timeline;
        const vertical = gsap.effects.homePatternDrift(rings, { axis: "y" }) as gsap.core.Timeline;
        const position = { x: 0.5, y: 0.5 };
        const xTo = gsap.quickTo(position, "x", {
          duration: 0.8, ease: "power3.out", onUpdate: () => horizontal.progress(position.x),
        });
        const yTo = gsap.quickTo(position, "y", {
          duration: 1.05, ease: "power3.out", onUpdate: () => vertical.progress(position.y),
        });
        const centre = () => { xTo(0.5); yTo(0.5); };
        let onscreen = true;
        let active = false;
        const sync = () => {
          // Intersection alone cannot detect hidden panels inside a pin.
          // Read the scroll owner's state, not transformed DOM rectangles.
          const next = onscreen && !document.hidden
            && root.dataset.heroCanvas === "ready"
            && Number(panel.style.opacity) > 0.95
            && panel.style.visibility !== "hidden"
            && Math.abs(Number(gsap.getProperty(ground, "yPercent"))) < 0.01;
          if (active && !next) centre();
          active = next;
        };
        const move = (event: PointerEvent) => {
          if (!active || event.pointerType !== "mouse") return;
          xTo(Math.max(0, Math.min(1, event.clientX / window.innerWidth)));
          yTo(Math.max(0, Math.min(1, event.clientY / window.innerHeight)));
        };
        const visibility = () => {
          if (document.hidden) {
            // The controller pauses GSAP in hidden tabs. Reset immediately
            // so resuming cannot replay a stale mouse position behind text.
            xTo.tween.pause();
            yTo.tween.pause();
            position.x = position.y = 0.5;
            horizontal.progress(0.5);
            vertical.progress(0.5);
          }
          sync();
        };
        const observer = new MutationObserver(sync);
        observer.observe(root, { attributes: true, attributeFilter: ["data-hero-canvas"] });
        observer.observe(panel, { attributes: true, attributeFilter: ["style"] });
        observer.observe(ground, { attributes: true, attributeFilter: ["style"] });
        const intersection = new IntersectionObserver(([entry]) => {
          onscreen = entry.isIntersecting;
          sync();
        });
        intersection.observe(root);
        // The shared root also receives events over the later offer. The
        // artwork remains pointer-transparent and never covers its links.
        root.addEventListener("pointermove", move, { passive: true });
        root.addEventListener("pointerleave", centre);
        root.addEventListener("pointercancel", centre);
        window.addEventListener("blur", centre);
        document.addEventListener("visibilitychange", visibility);
        sync();
        return () => {
          observer.disconnect();
          intersection.disconnect();
          root.removeEventListener("pointermove", move);
          root.removeEventListener("pointerleave", centre);
          root.removeEventListener("pointercancel", centre);
          window.removeEventListener("blur", centre);
          document.removeEventListener("visibilitychange", visibility);
        };
      }, root);
      // matchMedia owns the effect timelines AND the reusable quickTo tweens.
      cleanup = () => media.revert();
    },
    destroy() { cleanup?.(); cleanup = undefined; },
  };
}
