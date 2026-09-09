"use client";

import gsap from "gsap";
import { prefersReduced, type MotionModule } from "@/lib/motion-controller";
import { registerLoading } from "./effects/loading";

/**
 * Home opens — loader lifecycle, requested 8 September 2026 (F7 / X1 override).
 * Registration belongs to the central controller. Cleanup owns only this
 * cover, its timer and listeners; it must not stop other sections' motion.
 */
export function createHomeLoader(cover: HTMLDivElement): MotionModule {
  let context: gsap.Context | undefined;
  let release: (() => void) | undefined;

  const destroy = () => {
    release?.();
    context?.revert();
    context = undefined;
    release = undefined;
  };

  return {
    init() {
      destroy();
      if (prefersReduced()) {
        cover.hidden = true;
        return;
      }

      cover.hidden = false;
      const root = document.documentElement;
      const previousOverflow = root.style.overflow;
      root.style.overflow = "hidden";
      const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
      let finished = false;
      let timeline: gsap.core.Timeline | undefined;

      const onKey = (event: KeyboardEvent) => {
        // Preserve the normal Tab action: reveal the page before focus moves.
        if (event.key === "Escape" || event.key === "Tab") finish();
      };
      const onPreference = () => {
        if (preference.matches) finish();
      };
      const finish = () => {
        if (finished) return;
        finished = true;
        timeline?.kill();
        window.clearTimeout(timeout);
        cover.hidden = true;
        root.style.overflow = previousOverflow;
        window.removeEventListener("keydown", onKey);
        preference.removeEventListener("change", onPreference);
      };
      release = finish;
      window.addEventListener("keydown", onKey);
      preference.addEventListener("change", onPreference);
      // Independent of GSAP, including a paused ticker or background tab.
      const timeout = window.setTimeout(finish, 1500);
      context = gsap.context(() => {
        registerLoading();
        timeline = gsap.effects.homeLoader(cover) as gsap.core.Timeline;
        timeline.eventCallback("onComplete", finish);
      }, cover);
    },
    destroy,
  };
}
