/**
 * Central motion controller.
 * Every section registers here so reduced motion, route changes and teardown are
 * handled in one place instead of being reimplemented per section.
 */
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const modules = new Set();
let started = false;

export const prefersReduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Register a section module. Must expose init() and destroy(). */
export function register(module) {
  modules.add(module);
  if (started) module.init?.();
  return () => { module.destroy?.(); modules.delete(module); };
}

export function start() {
  if (started) return;
  started = true;
  modules.forEach(m => m.init?.());

  // Pins land in the wrong place if fonts arrive after layout.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

/** Call on route change / unmount. Never ScrollTrigger.killAll(). */
export function stop() {
  modules.forEach(m => m.destroy?.());
  started = false;
}

/** Pause anything expensive while the tab is hidden. */
document.addEventListener('visibilitychange', () => {
  gsap.globalTimeline[document.hidden ? 'pause' : 'resume']();
});
