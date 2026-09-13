"use client";

import gsap from "gsap";
import type { MotionModule } from "../motion-controller";

/** Our People, user direction 14 September 2026: every pattern on the page
 * (the rings and the gold clusters, including the testimony screen's pattern
 * layer) answers a fine mouse pointer — the Home closing ground's drift
 * ("what radiates", motion-grammar.md) carried across this page's artwork.
 * The footer's patterns sit outside the stage and are deliberately untouched.
 *
 * Transform only, on the artwork's own box, whose placement is class-based
 * offsets with no transform of its own. Alternate pieces drift in opposite
 * directions; a piece and its twin (the testimony layer and Who decides'
 * rings) share a name and so move identically. Touch, reduced motion and
 * pointer exit return to rest. */
export function createPeoplePatterns(root: HTMLElement): MotionModule {
  let cleanup: (() => void) | undefined;
  return {
    init() {
      cleanup?.();
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () => {
        const pieces = Array.from(root.querySelectorAll<HTMLElement>("[data-artwork]"));
        if (!pieces.length) return;
        const sign = (piece: HTMLElement) =>
          piece.dataset.artwork === "ring-a" ? -1 : piece.dataset.artwork === "cluster" ? 0.6 : 1;
        const movers = pieces.map(piece => ({
          sign: sign(piece),
          x: gsap.quickTo(piece, "x", { duration: 0.8, ease: "power3.out" }),
          y: gsap.quickTo(piece, "y", { duration: 1.05, ease: "power3.out" }),
          r: gsap.quickTo(piece, "rotation", { duration: 1.05, ease: "power3.out" }),
        }));
        const to = (nx: number, ny: number) => {
          for (const m of movers) {
            m.x(nx * 32 * m.sign);
            m.y(ny * 24 * m.sign);
            m.r(nx * 3.5 * m.sign);
          }
        };
        const move = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          to(event.clientX / window.innerWidth * 2 - 1, event.clientY / window.innerHeight * 2 - 1);
        };
        const centre = () => to(0, 0);
        root.addEventListener("pointermove", move, { passive: true });
        root.addEventListener("pointerleave", centre);
        window.addEventListener("blur", centre);
        return () => {
          root.removeEventListener("pointermove", move);
          root.removeEventListener("pointerleave", centre);
          window.removeEventListener("blur", centre);
          gsap.set(pieces, { clearProps: "transform" });
        };
      }, root);
      cleanup = () => media.revert();
    },
    destroy() { cleanup?.(); cleanup = undefined; },
  };
}
