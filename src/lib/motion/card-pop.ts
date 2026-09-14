"use client";

import gsap from "gsap";
import type { MotionModule } from "../motion-controller";

/**
 * A card that pops under the pointer.
 *
 * Grammar row: "pops", Wonder rail card (user direction, 14 September 2026:
 * "on hover the card will zoom and scale (not full)"). Under a fine pointer
 * or keyboard focus the whole card grows a little about its own centre and
 * settles back on leave. Small on purpose — 3% — so the row it sits in is
 * still read as a row and the neighbours are not crowded.
 *
 * ⚠ THE SCALE IS ON THE CARD'S INNER WRAPPER, NEVER THE CARD OR THE IMAGE
 * PLANE. `[data-card]` is transformed on y by the masonry pass every scroll
 * frame, so a hover written there would fight it and lose; the tile above
 * both is what the trigger measures. And the plate grows as a whole — the
 * picture inside is not zoomed against its frame — which is the same reading
 * Truth's roster row took for its `frame`-graded photographs: a uniform
 * scale on the container is a hover rule, not a warp of the plane.
 *
 * Replaced `createCardShy` (the same day) — one hover per card. The same
 * day it went to the homepage's Invitation and Pathway cards, registered
 * from app/_components/Motion.tsx.
 */
export function createCardPop(
  root: HTMLElement,
  { card = "[data-card]", inner = "[data-card-hover]" as string | null, scale = 1.03 } = {},
): MotionModule {
  let cleanup: (() => void) | undefined;
  return {
    init() {
      cleanup?.();
      const media = gsap.matchMedia();
      media.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const removers = Array.from(root.querySelectorAll<HTMLElement>(card)).map((el) => {
            // `inner: null` scales the card itself — for cards nothing else
            // transforms (the homepage's, 14 Sep 2026, user direction:
            // "apply the hover effects on the cards").
            const target = inner ? el.querySelector<HTMLElement>(inner) : el;
            if (!target) return () => {};
            const pop = (to: number) =>
              gsap.to(target, { scale: to, duration: 0.4, ease: "power3.out", overwrite: true, transformOrigin: "50% 50%" });
            const enter = () => pop(scale);
            const leave = () => { if (!el.matches(":hover, :focus-within")) pop(1); };
            el.addEventListener("pointerenter", enter);
            el.addEventListener("pointerleave", leave);
            el.addEventListener("focusin", enter);
            el.addEventListener("focusout", leave);
            return () => {
              el.removeEventListener("pointerenter", enter);
              el.removeEventListener("pointerleave", leave);
              el.removeEventListener("focusin", enter);
              el.removeEventListener("focusout", leave);
              gsap.killTweensOf(target);
              gsap.set(target, { clearProps: "transform" });
            };
          });
          return () => removers.forEach((remove) => remove());
        },
        root,
      );
      cleanup = () => media.revert();
    },
    destroy() { cleanup?.(); cleanup = undefined; },
  };
}
