"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Central motion controller.
 *
 * Originally a TypeScript port of the yachatdac-motion skill's controller
 * template (skill removed under decision F8, 31 Aug 2026). This file is now
 * the source of truth.
 *
 * Every section module registers here so reduced motion, route changes and
 * teardown are handled in one place instead of being reimplemented per
 * section. No timelines are created outside the controller, and nothing calls
 * ScrollTrigger.killAll().
 *
 * ⚠ The tier system this file used to describe is SUPERSEDED — decision F7,
 * 2026-08-29, the immersive mandate. There is no longer a "Tier 1 is
 * homepage-only" rule and no per-site cap: motion is the default on every page,
 * governed by the Loud Channel rule and per-page vh budgets instead.
 *
 * What survives the change is the split of concerns, not the ration:
 * src/lib/motion.ts still holds the GSAP-free primitives so a CMS-generated
 * page need not pull the library, and the named vocabulary lives in
 * src/lib/motion/effects.ts.
 */

gsap.registerPlugin(ScrollTrigger);

/** A section module. Both hooks are optional so partial modules still register. */
export type MotionModule = {
  init?: () => void;
  destroy?: () => void;
};

const modules = new Set<MotionModule>();
let started = false;

export const prefersReduced = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Register a section module. Returns its unregister function. */
export function register(module: MotionModule): () => void {
  modules.add(module);
  if (started) module.init?.();

  return () => {
    module.destroy?.();
    modules.delete(module);
  };
}

export function start(): void {
  if (started) return;
  started = true;
  modules.forEach((module) => module.init?.());

  // Pins land in the wrong place if fonts arrive after layout. Relevant here:
  // the brand faces are self-hosted and swap in late (see public/fonts).
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

/** Call on route change / unmount. */
export function stop(): void {
  modules.forEach((module) => module.destroy?.());
  started = false;
}

/** Pause anything expensive while the tab is hidden. */
export function watchVisibility(): () => void {
  const onVisibilityChange = () => {
    if (document.hidden) {
      gsap.globalTimeline.pause();
    } else {
      gsap.globalTimeline.resume();
    }
  };

  document.addEventListener("visibilitychange", onVisibilityChange);
  return () =>
    document.removeEventListener("visibilitychange", onVisibilityChange);
}
