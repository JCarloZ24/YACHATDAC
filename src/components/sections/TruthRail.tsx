"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion, useScrollProgress } from "@/lib/motion";

/**
 * The Truth page rail — a plain vertical progress rule that is genuinely
 * ABSENT across the hard stop.
 *
 * ⚠ C1 (continuous line with lit waypoints) is on **hold** in the motion
 * skill: "a meandering line with waypoints reads as iconography; needs
 * sign-off, or use a plain vertical rule with no meander." This is the cleared
 * alternative. Do not curve it, do not add waypoint nodes, do not make it
 * wander. The copy calls it "the band that has run beside the reader since the
 * first screen" — that is not licence to elaborate it. See decision F2 and the
 * standing rule against generated Aboriginal iconography.
 *
 * The break is real, not decorative. The draft's build note for the hard stop
 * says "No rail, no markers, nothing else on screen", and the wireframe builds
 * it as two segments rather than one node claiming a gap it does not have. Here
 * that is expressed by hiding the rail entirely while the hard stop is on
 * screen — same result, without a second fixed element to keep in sync.
 *
 * Hidden under reduced motion (X6) and below lg, where it has no room to read
 * as anything but a stray rule.
 */
export function TruthRail({ hardStopId }: { hardStopId: string }) {
  const progress = useScrollProgress();
  const prefersReduced = usePrefersReducedMotion();
  const [atHardStop, setAtHardStop] = useState(false);

  useEffect(() => {
    const target = document.getElementById(hardStopId);
    if (!target || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setAtHardStop(entry.isIntersecting),
      // Any meaningful overlap counts: the rail should already be gone by the
      // time the block is what the reader is looking at.
      { threshold: 0.2 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hardStopId]);

  if (prefersReduced) return null;

  return (
    <div
      aria-hidden
      data-motion="rail"
      data-absent={atHardStop || undefined}
      className={`pointer-events-none fixed inset-y-0 left-8 z-20 hidden w-px bg-canvas/15 transition-opacity duration-(--dur-medium) ease-quiet lg:block ${
        atHardStop ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* transform-only per-frame path — scaleY, not height. */}
      <div
        className="h-full w-px origin-top bg-ochre"
        style={{ transform: `scaleY(${Math.min(progress, 1)})` }}
      />
    </div>
  );
}
