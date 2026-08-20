"use client";

/**
 * D4 — Contour map with sequential waypoints.
 *
 * Tier 1. Vector only: no WebGL, no shoot, no georeference in the shipped file.
 * Status in the sketch library is *hold* — approved in principle for About and
 * Research, land-detail level unconfirmed — so this runs on the synthetic field
 * in `src/lib/terrain`. See that module for the swap point.
 *
 * Markup this expects (see ContourMapSection.tsx):
 *
 *   <div>
 *     <svg viewBox="0 0 1000 640" aria-hidden="true">
 *       <path data-contour data-level="0" d="…" />
 *     </svg>
 *     <button data-waypoint data-at="0.42" style="left:31%;top:36%">…</button>
 *   </div>
 *
 * Waypoints are real buttons: focusable, readable, and positioned in PERCENTAGES
 * of an arbitrary viewBox. No coordinates anywhere, and no labels that resolve to
 * a location — permissions.md blocks place names until Marc confirms.
 *
 * Per-frame path note: this writes `stroke-dashoffset`, not `transform`. It is
 * the sanctioned stroke-reveal technique for B1 and D4 in the skill library and
 * the only way to draw a line along itself. It repaints; it does not lay out.
 * Nothing here touches width, height, top, left or filter.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "@/lib/motion-controller";

gsap.registerPlugin(ScrollTrigger);

export type ContourMapOptions = {
  /** Reduced motion cuts: everything is simply there. Never a slower version. */
  reduced: boolean;
  /** Fraction of the scroll each level takes to draw. */
  drawSpan?: number;
  scrub?: number;
};

export function createContourMap(
  host: HTMLElement,
  { reduced, drawSpan = 0.55, scrub = 0.6 }: ContourMapOptions,
): MotionModule {
  const paths = [...host.querySelectorAll<SVGPathElement>("[data-contour]")];
  const waypoints = [...host.querySelectorAll<HTMLElement>("[data-waypoint]")];

  let trigger: ScrollTrigger | null = null;

  // Tracked so the per-frame path only writes to the DOM when a waypoint
  // actually changes state, rather than every frame for every waypoint.
  //
  // `null` means "not written yet", and it matters: a previous instance of this
  // module may have left the DOM lit — the reduced-motion branch does exactly
  // that, and the module is rebuilt when the preference changes mid-session. If
  // this started at `false` the first write would be skipped as a no-op and the
  // waypoints would stay lit against a map that has not been drawn yet.
  const lit = new Array<boolean | null>(waypoints.length).fill(null);

  const setLit = (index: number, on: boolean) => {
    if (lit[index] === on) return;
    lit[index] = on;
    waypoints[index].dataset.on = on ? "true" : "false";
  };

  function init() {
    if (!paths.length) return;

    // pathLength="1" normalises every contour regardless of its real length, so
    // the stagger is about level order rather than how long each squiggle is.
    for (const path of paths) {
      path.setAttribute("pathLength", "1");
      path.style.strokeDasharray = "1";
    }

    if (reduced) {
      for (const path of paths) path.style.strokeDashoffset = "0";
      waypoints.forEach((_, i) => setLit(i, true));
      return;
    }

    for (const path of paths) path.style.strokeDashoffset = "1";
    waypoints.forEach((_, i) => setLit(i, false));

    // Level starts are spread across the scroll left over after the draw span,
    // so the map finishes at `FINISH_AT` however many levels the detail preset
    // asked for.
    //
    // Finishing early rather than exactly at the end is deliberate: the last
    // stretch holds the completed map on screen before the section unsticks, so
    // the drawing resolves and is *seen* resolved. Motion that finishes on the
    // last pixel reads as unfinished.
    const FINISH_AT = 0.92;
    const levels = paths.reduce(
      (max, path) => Math.max(max, Number(path.dataset.level ?? 0)),
      0,
    );
    const lead = levels > 0 ? (FINISH_AT - drawSpan) / levels : 0;

    // The host is a tall container with the map sticky inside it, so the draw
    // is timed to the window where the map is actually stuck and fully in view:
    // from the container's top reaching the top of the viewport, to its bottom
    // reaching the bottom. The drawing therefore starts and finishes on screen
    // rather than completing somewhere above the fold.
    const paint = (progress: number) => {
      for (const path of paths) {
        const start = Number(path.dataset.level ?? 0) * lead;
        const t = Math.min(1, Math.max(0, (progress - start) / drawSpan));
        path.style.strokeDashoffset = String(1 - t);
      }

      waypoints.forEach((waypoint, i) =>
        setLit(i, progress >= Number(waypoint.dataset.at ?? 0.5)),
      );
    };

    trigger = ScrollTrigger.create({
      trigger: host,
      start: "top top",
      end: "bottom bottom",
      scrub,
      onUpdate: (self) => paint(self.progress),
    });

    // Measure, then paint once, immediately.
    //
    // A fresh ScrollTrigger does not fire onUpdate until the next scroll, so
    // without this the map sits at its undrawn state at whatever scroll
    // position it was rebuilt at — which is exactly what happens when someone
    // changes the detail preset while looking at the finished map. The refresh
    // is needed too: the trigger is created from inside a React effect, before
    // the browser has settled the layout the sticky child produces, so its
    // start and end are otherwise measured against a stale position.
    trigger.refresh();
    paint(trigger.progress);
  }

  function destroy() {
    trigger?.kill();
    trigger = null;
    for (const path of paths) {
      path.style.strokeDasharray = "";
      path.style.strokeDashoffset = "";
    }
  }

  return { init, destroy };
}
