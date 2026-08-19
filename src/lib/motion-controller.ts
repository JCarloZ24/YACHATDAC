"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Central motion controller.
 *
 * TypeScript port of .claude/skills/yachatdac-motion/assets/motion-controller.js.
 * The skill is the source of truth — if the two ever disagree, the skill wins
 * and this file gets updated, not the other way round.
 *
 * Every Tier 1 section registers here so reduced motion, route changes and
 * teardown are handled in one place instead of being reimplemented per
 * section. No timelines are created outside the controller, and nothing calls
 * ScrollTrigger.killAll().
 *
 * Tier 2 (entry staggers, hovers) does NOT go through here — it is plain CSS
 * plus IntersectionObserver in src/lib/motion.ts, so CMS-generated pages never
 * pull GSAP or reach Tier 1 behaviour.
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
