"use client";

import { useEffect, useRef, useState } from "react";
import { register, start } from "@/lib/motion-controller";
import { createTerrainDolly } from "@/lib/motion/terrain-dolly";
import { DETAIL_PRESETS, type DetailLevel } from "@/lib/terrain/generic-field";

/**
 * E1 — terrain dolly. The one WebGL section on the site.
 *
 * Sits in a tall container so the camera move is scrubbed across real scroll
 * rather than judged from a still. The canvas is sticky inside it, so the view
 * holds while the scroll drives the dolly — no pin, so nothing steals the
 * scrollbar and nothing needs unwinding under reduced motion.
 */

const FALLBACK_REASONS: Record<string, string> = {
  "reduced-motion":
    "Reduced motion is on, so the scene is not built at all — a slower dolly is not an accommodation. The real page shows a composed poster frame here.",
  "no-webgl":
    "This browser has no WebGL2 context. The real page shows a composed poster frame here.",
  "save-data":
    "Save-Data is on. Three.js is never downloaded. The real page shows a composed poster frame here.",
  "context-lost":
    "The GL context was lost. The render loop stopped and the poster took over.",
  "no-canvas": "No canvas element was found.",
};

export function TerrainDollySection({
  detail,
  relief,
  reduced,
}: {
  detail: DetailLevel;
  relief: number;
  /** Owned by the page so the prototype's motion override can drive it. */
  reduced: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState<string | null>(null);

  const preset = DETAIL_PRESETS[detail];

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    setFallback(null);

    const unregister = register(
      createTerrainDolly(host, {
        reduced,
        segments: preset.segments,
        octaves: preset.octaves,
        relief,
        onFallback: setFallback,
      }),
    );
    start();
    return unregister;
  }, [reduced, preset.segments, preset.octaves, relief]);

  return (
    /* 220vh of scroll for the dolly. Documented here rather than in a wireframe
       because this route is the wireframe for now. Nothing is pinned. */
    <div className="relative h-[220vh]">
      <div
        ref={hostRef}
        className="sticky top-0 h-svh w-full overflow-hidden bg-midnight"
      >
        <canvas className="block h-full w-full" />

        {fallback ? (
          /* Poster-frame stand-in. A grey box reads as broken, so this says
             what it is and why. Swap for a real WebP still of the scene at
             scroll progress 0.35 before this goes anywhere near the site. */
          <div
            data-poster=""
            className="absolute inset-0 flex items-center justify-center bg-midnight p-8"
          >
            <div className="max-w-md text-center">
              <p className="eyebrow text-ochre">Poster frame</p>
              <p className="mt-3 text-sm leading-relaxed text-canvas/70">
                {FALLBACK_REASONS[fallback] ?? fallback}
              </p>
            </div>
          </div>
        ) : null}

        {/* Standing reminder of what is on screen. The mesh density is only
            claimed when there is actually a mesh — under the fallback there is
            no wireframe to describe. */}
        <p className="pointer-events-none absolute bottom-6 left-6 text-xs tracking-[0.14em] text-canvas/50 uppercase">
          Generic landform · not Turraburra
          {fallback ? null : (
            <> · {preset.segments}&times;{preset.segments} wireframe</>
          )}
        </p>
      </div>
    </div>
  );
}
