"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { register, start } from "@/lib/motion-controller";
import { createContourMap } from "@/lib/motion/contour-map";
import { buildContours, DEFAULT_ASPECT } from "@/lib/terrain/contours";
import { DETAIL_PRESETS, type DetailLevel } from "@/lib/terrain/generic-field";
import styles from "./ContourMap.module.css";

/**
 * D4 — contour map with sequential waypoints.
 *
 * Simulated at the full viewport: the map is the frame, edge to edge, at the
 * screen's own aspect ratio. The contours are re-traced to that ratio rather
 * than letterboxed into it — a wider screen shows a wider crop of the same
 * country at the same scale, which is what a map does and what a stretched
 * drawing does not.
 *
 * WAYPOINT LABELS ARE PLACEHOLDERS ON PURPOSE. permissions.md blocks place
 * names, boundaries and waypoint labels until the land-detail question comes
 * back from Marc. The mechanism is real — real buttons, real focus, real panel
 * — and the copy is visibly a stand-in so nobody mistakes it for approved text.
 */

type Waypoint = {
  id: string;
  /** Scroll progress at which it lights. */
  at: number;
  /** Percentage position within the frame. Not a coordinate. */
  left: number;
  top: number;
};

/**
 * Positioned as percentages of the frame, so they hold their place in the
 * composition on any screen. They do not follow a terrain feature across aspect
 * ratios, and are not meant to: they stand in for points that will be placed
 * against real ground once the land-detail permission lands.
 */
const WAYPOINTS: Waypoint[] = [
  { id: "01", at: 0.42, left: 26, top: 34 },
  { id: "02", at: 0.55, left: 61, top: 27 },
  { id: "03", at: 0.68, left: 72, top: 64 },
  { id: "04", at: 0.81, left: 37, top: 71 },
];

/**
 * Frame proportions are rounded to this step before the map is re-traced.
 *
 * Without it, dragging a window edge re-runs marching squares on every pixel of
 * the drag. A twentieth is finer than anyone can see in a contour crop.
 */
const ASPECT_STEP = 20;

export function ContourMapSection({
  detail,
  reduced,
}: {
  detail: DetailLevel;
  /** Owned by the page so the prototype's motion override can drive it. */
  reduced: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [openWaypoint, setOpenWaypoint] = useState<string | null>(null);
  const [aspect, setAspect] = useState(DEFAULT_ASPECT);

  const preset = DETAIL_PRESETS[detail];

  // The frame is the viewport, so its proportions are the screen's and are only
  // known on the client. Measured rather than assumed, and re-measured on
  // rotate, on resize, and when the mobile URL bar collapses.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (!width || !height) return;
      const next = Math.round((width / height) * ASPECT_STEP) / ASPECT_STEP;
      setAspect((current) => (current === next ? current : next));
    });

    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  // Deterministic and pure, so this is the same drawing on every load and in
  // every screenshot of a given frame. Cheap enough to recompute when the
  // detail preset or the frame's proportions change.
  const map = useMemo(
    () => buildContours(preset.contourLevels, preset.octaves, aspect),
    [preset.contourLevels, preset.octaves, aspect],
  );

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // The module is rebuilt when `reduced` or the contour set changes. Reduced
    // motion is read through a store rather than a one-time if-statement, so a
    // visitor who changes the setting mid-session gets the cut immediately.
    const unregister = register(createContourMap(host, { reduced }));
    start();
    return unregister;
  }, [reduced, map]);

  const ridgeFrom = preset.contourLevels - 3;

  return (
    /* 240vh of scroll, with the map sticky inside it — the same shape as E1.
       The whole drawing stays in view and completes as you scroll past, rather
       than scrolling out of frame half-drawn.

       Sticky, not ScrollTrigger's pin: nothing steals the scrollbar, keyboard
       focus order is untouched, and the reduced-motion branch has nothing to
       unwind. The trigger is on this outer element because the sticky child
       stops moving relative to the viewport once it is stuck. */
    <div ref={hostRef} className="relative h-[240vh]">
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-charcoal">
        <div ref={frameRef} className={styles.map}>
          <svg viewBox={`0 0 ${map.width} ${map.height}`} aria-hidden="true">
            {map.contours.map((contour, index) => (
              <path
                key={index}
                data-contour=""
                data-level={contour.level}
                className={`${styles.contour} ${
                  contour.level >= ridgeFrom ? styles.ridge : ""
                }`}
                d={contour.d}
              />
            ))}
          </svg>

          {WAYPOINTS.map((waypoint) => (
            <button
              key={waypoint.id}
              type="button"
              data-waypoint=""
              data-at={waypoint.at}
              aria-pressed={openWaypoint === waypoint.id}
              className={styles.waypoint}
              style={{ left: `${waypoint.left}%`, top: `${waypoint.top}%` }}
              onClick={() =>
                setOpenWaypoint((current) =>
                  current === waypoint.id ? null : waypoint.id,
                )
              }
            >
              <span className={styles.dot} />
              <span className={styles.label}>Point {waypoint.id}</span>
            </button>
          ))}
        </div>

        {/* Floats over the map, top left — the controls are bottom right and
            the standing caption is bottom left, so nothing lands on top of
            anything else. In the flow it would crop the frame. */}
        <div className="absolute top-6 left-6 w-[min(28rem,calc(100%-3rem))] rounded-sm border border-canvas/20 bg-charcoal/85 p-4 backdrop-blur">
          {openWaypoint ? (
            <>
              <p className="eyebrow text-ochre">Point {openWaypoint}</p>
              <p className="mt-2 text-sm leading-relaxed text-canvas/70">
                Detail panel placeholder. This is where a waypoint&rsquo;s copy
                and image would sit. It is empty on purpose — waypoint names are
                blocked until the land-detail permission comes back, and
                inventing plausible-looking ones is how a placeholder survives
                into a build.
              </p>
            </>
          ) : (
            <p className="text-sm leading-relaxed text-canvas/50">
              Scroll to draw the map, then choose a point. Waypoints are real
              buttons — reachable by keyboard whether or not scroll has lit
              them.
            </p>
          )}
        </div>

        {/* Standing reminder of what is on screen, matching E1's. The frame
            ratio is named because it is what the crop is generated from. */}
        <p className="pointer-events-none absolute bottom-6 left-6 text-xs tracking-[0.14em] text-canvas/50 uppercase">
          Generic landform · not Turraburra · {preset.contourLevels} levels ·
          frame {aspect.toFixed(2)}:1
        </p>
      </div>
    </div>
  );
}
