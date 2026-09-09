"use client";
import gsap from "gsap";
import type { MotionModule } from "../motion-controller";
import { registerRecordCard } from "./effects/record-card";

/** INT-05: inner card lift does not compete with the masonry's outer motion. */
export function createRecordCardHover(root: HTMLElement): MotionModule {
  let cleanup: (() => void) | undefined;
  return {
    init() {
      registerRecordCard();
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = [...root.querySelectorAll<HTMLElement>("[data-record-card]")];
        const removers = cards.map(card => {
          const inner = card.querySelector<HTMLElement>("[data-card-hover]");
          const enter = () => { gsap.effects.recordCardHover(inner, { active: true }); };
          const leave = () => { if (!card.matches(":hover, :focus-visible")) gsap.effects.recordCardHover(inner, { active: false }); };
          card.addEventListener("pointerenter", enter); card.addEventListener("pointerleave", leave);
          card.addEventListener("focus", enter); card.addEventListener("blur", leave);
          return () => { card.removeEventListener("pointerenter", enter); card.removeEventListener("pointerleave", leave);
            card.removeEventListener("focus", enter); card.removeEventListener("blur", leave);
            gsap.killTweensOf(inner); gsap.set(inner, { clearProps: "transform" }); };
        });
        return () => removers.forEach(remove => remove());
      }, root);
      cleanup = () => media.revert();
    },
    destroy() { cleanup?.(); cleanup = undefined; },
  };
}
