"use client";

/**
 * The WebGL activation manager.
 *
 * F7 allows several WebGL scenes across the site; the performance rule that
 * survives is "at most one renderer live at a time" (SKILL.md §1). Scenes
 * register their handle when they scroll near, and the manager guarantees the
 * invariant: activating one suspends whatever else was running.
 *
 * Suspend cancels the rAF loop but keeps GPU resources, so scrolling back to
 * a scene on the same page resumes instantly. Full disposal is the scene's
 * own destroy(), which the motion controller runs on route change — contexts
 * never accumulate across pages.
 */

export type ManagedScene = {
  resume(): void;
  suspend(): void;
};

let active: ManagedScene | null = null;

export function requestActive(scene: ManagedScene): void {
  if (active === scene) return;
  active?.suspend();
  active = scene;
  scene.resume();
}

export function releaseActive(scene: ManagedScene): void {
  scene.suspend();
  if (active === scene) active = null;
}
