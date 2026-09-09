"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "../motion-controller";
import { registerLandscapeEffects } from "./effects/landscape";

/** F7, SCR-01 / AMB-04 — user direction 9 September 2026.
 * Shared by Turraburra and What it is like out here. Once the screen seats,
 * CSS holds the photograph and copy through 80vh of extra scroll effort.
 * Tall content stays in ordinary flow, so CMS copy and zoom cannot trap text.
 */
export function wonderLandscape(root: HTMLElement): MotionModule {
  let cleanup: (() => void) | undefined;
  return {
    init() {
      cleanup?.();
      registerLandscapeEffects();
      const media = gsap.matchMedia();
      media.add({
        motion: "(prefers-reduced-motion: no-preference)",
        pointer: "(hover: hover) and (pointer: fine)",
      }, (context) => {
        if (!context.conditions?.motion) return;
        const section = root.querySelector<HTMLElement>("[data-landscape-section]");
        const screen = root.querySelector<HTMLElement>("[data-landscape-screen]");
        const viewport = root.querySelector<HTMLElement>("[data-landscape-viewport]");
        const approach = root.querySelector<HTMLElement>("[data-landscape-approach]");
        const image = root.querySelector<HTMLElement>("[data-landscape-image]");
        if (!section || !screen || !viewport || !approach || !image) return;

        root.setAttribute("data-landscape-motion", "");
        const fit = () => {
          const fits = screen.scrollHeight <= viewport.clientHeight + 1;
          if (fits !== root.hasAttribute("data-landscape-hold")) {
            root.toggleAttribute("data-landscape-hold", fits);
            ScrollTrigger.refresh();
          }
        };
        fit();
        const sizing = new ResizeObserver(fit);
        sizing.observe(screen);
        sizing.observe(viewport);
        const animation = gsap.effects.landscapeApproach(approach) as gsap.core.Tween;
        ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "top top",
          animation,
          scrub: 0.8,
          invalidateOnRefresh: true,
        });

        let removePointer: (() => void) | undefined;
        if (context.conditions.pointer) {
          const horizontal = gsap.effects.landscapeGyroscope(image, { axis: "x" }) as gsap.core.Timeline;
          const vertical = gsap.effects.landscapeGyroscope(image, { axis: "y" }) as gsap.core.Timeline;
          const position = { x: 0.5, y: 0.5 };
          const xTo = gsap.quickTo(position, "x", {
            duration: 0.8, ease: "power3.out", onUpdate: () => horizontal.progress(position.x),
          });
          const yTo = gsap.quickTo(position, "y", {
            duration: 0.8, ease: "power3.out", onUpdate: () => vertical.progress(position.y),
          });
          let visible = false;
          const centre = () => { xTo(0.5); yTo(0.5); };
          const move = (event: PointerEvent) => {
            if (!visible || event.pointerType !== "mouse") return;
            xTo(gsap.utils.clamp(0, 1, event.clientX / window.innerWidth));
            yTo(gsap.utils.clamp(0, 1, event.clientY / window.innerHeight));
          };
          const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (!visible) centre();
          });
          observer.observe(section);
          root.addEventListener("pointermove", move);
          root.addEventListener("pointerleave", centre);
          window.addEventListener("blur", centre);
          removePointer = () => {
            observer.disconnect();
            root.removeEventListener("pointermove", move);
            root.removeEventListener("pointerleave", centre);
            window.removeEventListener("blur", centre);
          };
        }
        return () => {
          removePointer?.();
          sizing.disconnect();
          root.removeAttribute("data-landscape-hold");
          root.removeAttribute("data-landscape-motion");
        };
      }, root);
      cleanup = () => media.revert();
    },
    destroy() { cleanup?.(); cleanup = undefined; },
  };
}
