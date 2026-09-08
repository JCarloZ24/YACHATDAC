"use client";

import { usePrefersReducedMotion, useScrollProgress } from "@/lib/motion";

/**
 * Homepage progress rule.
 *
 * The build documentation asks for a connecting "thread" through the page. In
 * the motion skill that behaviour is C1 (continuous line), and C1 is on
 * **hold**: a meandering line with lit waypoints reads as Aboriginal
 * iconography and needs sign-off. The skill records the cleared alternative —
 * "a plain vertical rule with no meander" — which is what this is.
 *
 * Do not upgrade this into a path, add nodes to it, or make it wander until a
 * decision is recorded in the skill's permissions.md. See also the standing
 * rule: no generated Aboriginal iconography in code.
 *
 * Hidden under reduced motion (X6) and below lg, where it has no room to read
 * as anything but a stray rule.
 */
export function ThreadLine() {
  const progress = useScrollProgress();
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) return null;

  return (
    <div
      aria-hidden
      data-home-thread
      className="pointer-events-none fixed inset-y-0 left-8 z-20 hidden w-px bg-canvas/15 lg:block"
    >
      {/* transform-only per-frame path — scaleY, not height. */}
      <div
        className="h-full w-px origin-top bg-ochre"
        style={{ transform: `scaleY(${Math.min(progress, 1)})` }}
      />
    </div>
  );
}
