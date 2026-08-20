"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { register, start } from "@/lib/motion-controller";
import { createContourMap } from "@/lib/motion/contour-map";
import {
  buildContours,
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
} from "@/lib/terrain/contours";
import { DETAIL_PRESETS, type DetailLevel } from "@/lib/terrain/generic-field";
import styles from "./ContourMap.module.css";

/**
 * D4 — contour map with sequential waypoints.
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
  /** Percentage position within the arbitrary viewBox. Not a coordinate. */
  left: number;
  top: number;
};

const WAYPOINTS: Waypoint[] = [
  { id: "01", at: 0.42, left: 26, top: 34 },
  { id: "02", at: 0.55, left: 61, top: 27 },
  { id: "03", at: 0.68, left: 72, top: 64 },
  { id: "04", at: 0.81, left: 37, top: 71 },
];

export function ContourMapSection({
  detail,
  reduced,
}: {
  detail: DetailLevel;
  /** Owned by the page so the prototype's motion override can drive it. */
  reduced: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [openWaypoint, setOpenWaypoint] = useState<string | null>(null);

  const preset = DETAIL_PRESETS[detail];

  // Deterministic and pure, so this is the same drawing on every load and in
  // every screenshot. Cheap enough to recompute when the detail preset changes.
  const contours = useMemo(
    () => buildContours(preset.contourLevels, preset.octaves),
    [preset.contourLevels, preset.octaves],
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
  }, [reduced, contours]);

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
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center gap-4 px-4 pt-28 pb-8">
        <div className={styles.map}>
        <svg
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          aria-hidden="true"
        >
          {contours.map((contour, index) => (
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

        <div className="min-h-24 w-full max-w-3xl rounded-sm border border-canvas/15 p-4">
        {openWaypoint ? (
          <>
            <p className="eyebrow text-ochre">Point {openWaypoint}</p>
            <p className="mt-2 text-sm leading-relaxed text-canvas/70">
              Detail panel placeholder. This is where a waypoint&rsquo;s copy and
              image would sit. It is empty on purpose — waypoint names are
              blocked until the land-detail permission comes back, and inventing
              plausible-looking ones is how a placeholder survives into a build.
            </p>
          </>
        ) : (
          <p className="text-sm text-canvas/45">
            Scroll to draw the map, then choose a point. Waypoints are real
            buttons — reachable by keyboard whether or not scroll has lit them.
          </p>
        )}
        </div>
      </div>
    </div>
  );
}
