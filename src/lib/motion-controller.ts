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
/** See motionSettled(). Cleared by stop() so a route change re-arms it. */
let settled = false;

/**
 * Has this page's motion pass finished building?
 *
 * The one honest readiness signal for a loading panel, and the reason
 * RouteLoader exists. Measured on the production build 11 September 2026,
 * refreshing `/`: the document is 5,139px tall with ZERO pin spacers from
 * first paint until roughly 890ms, then becomes 23,303px as ScrollTrigger
 * inserts them. That is a 4.5x height change, and until it lands every pinned
 * screen is stacked at the same offset — the overlapping frame August
 * screenshotted. `document.fonts.ready` and window `load` both resolve well
 * inside that window (89ms and 193ms in the same trace), so neither one can
 * stand in for it.
 *
 * True from the moment start() has refreshed ScrollTrigger against resolved
 * fonts, which is when pin geometry is finally correct.
 *
 * ⚠ THE SECOND BRANCH IS NOT A CONVENIENCE. A page with no motion modules
 * never calls start(), so `settled` would stay false forever and a panel
 * gated on it would sit there until its hard cap — three seconds of loading
 * screen on a page that was ready immediately. /about, /our-people, /connect
 * and the legal pages are all in that position. So: once the document has
 * finished loading and a grace beat has passed with nothing registered, there
 * is no motion pass to wait for and this reports settled.
 *
 * The grace beat guards a real race — React effects (where modules register)
 * can run after window `load` on a slow first paint, and without it such a
 * page would be declared motionless a frame before its motion arrived.
 */
export function motionSettled(): boolean {
  if (settled) return true;
  if (started || modules.size > 0) return false;
  if (document.readyState !== "complete") return false;
  return performance.now() - loadedAt() > NO_MOTION_GRACE_MS;
}

const NO_MOTION_GRACE_MS = 200;

/** When the document finished loading, in performance.now() terms. */
function loadedAt(): number {
  const [navigation] = performance.getEntriesByType(
    "navigation",
  ) as PerformanceNavigationTiming[];
  // loadEventEnd is 0 while the load event is still in flight.
  return navigation?.loadEventEnd || 0;
}

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
  document.fonts?.ready.then(() => {
    ScrollTrigger.refresh();
    // Pin spacers are in and measured against the real faces: this is the
    // moment the page stops being the stacked frame. See motionSettled().
    settled = true;
  });
}

/** Call on route change / unmount. */
export function stop(): void {
  modules.forEach((module) => module.destroy?.());
  started = false;
  settled = false;
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
