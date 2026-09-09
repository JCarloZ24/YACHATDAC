"use client";

/**
 * /homepagev2 fork, 10 September 2026, user direction.
 *
 * A copy of src/lib/motion/home-loader.ts, owned by /homepagev2 alone. The two
 * pages share NOTHING but the framework and the site chrome: edit this
 * freely and the live homepage is untouched, and vice versa.
 *
 * ⚠ The GSAP effect registry is global and keyed by NAME, so every effect
 * here is registered as `homeV2*`. Two effects registered under one name
 * silently overwrite each other, and the page that loaded second wins.
 */
import gsap from "gsap";
import { prefersReduced, type MotionModule } from "@/lib/motion-controller";
import { registerHomeV2 } from "./effects";

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
        registerHomeV2();
        timeline = gsap.effects.homeV2Loader(cover) as gsap.core.Timeline;
        timeline.eventCallback("onComplete", finish);
      }, cover);
    },
    destroy,
  };
}
