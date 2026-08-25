"use client";

import { useEffect, useRef } from "react";
import { BeatContent, toneClasses } from "@/components/lofi/BeatContent";
import { GhostType } from "@/components/lofi/ui/GhostType";
import { MediaTile } from "@/components/lofi/ui/MediaTile";
import type { Beat } from "@/content/lofi/homepage";
import { livingWorkPlanes } from "@/content/lofi/media";
import { usePrefersReducedMotion } from "@/lib/motion";
import { register } from "@/lib/motion-controller";
import {
  createFrameExpand,
  FRAME_EXPAND_SPAN_VH,
} from "@/lib/sections/frame-expand";
import {
  createLayeredDolly,
  planeDepthPx,
} from "@/lib/sections/layered-dolly";

/**
 * M2 + D1 — Frame expand onto a scene with depth. Homepage beat 5, Living Work.
 *
 * M2 opens the frame from an inset while the contents counter-scale 1.3 → 1.
 * D1 puts three planes at fixed z inside it and dollies one camera across
 * them, so the frame opens onto a receding scene rather than onto a flat
 * field.
 *
 * ⚠ D1 IS OVER F4's BUDGET — pending decision D9. See layered-dolly.ts.
 * M2 alone is the approved behaviour here; the dolly is the exception.
 *
 * WHY THE DOLLY IS INSIDE THE FRAME AND NOT BEHIND IT
 * ---------------------------------------------------
 * The frame's clip-path is the aperture. Putting the scene inside means the
 * opening frame is literally revealing more of a real space, which is the
 * effect; putting it behind would mean the frame opens onto an opaque field
 * with the depth hidden underneath it, and the two behaviours would fight.
 *
 * ⚠ Media: tonal squares. The planes are `work` bucket — ranger work, right-way
 * fire, restoration, the flux towers. Working imagery, not portraiture (see
 * the beat's mediaNote), and the bucket carries no motion restriction.
 */

/** Where each plane sits in frame. Uneven, so the recession reads as space. */
const PLANE_POSITION = [
  "left-[6%] top-[14%] w-[34%]",
  "right-[8%] top-[30%] w-[30%]",
  "left-[36%] bottom-[10%] w-[28%]",
] as const;

export function FrameExpandBeat({ beat }: { beat: Beat }) {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // Both registered in both modes: each module's reduced branch sets its own
    // end state, so nothing is left sitting at a start value.
    const unregisterFrame = register(createFrameExpand(root));
    const unregisterDolly = register(createLayeredDolly(root));
    return () => {
      unregisterFrame();
      unregisterDolly();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id={beat.id}
      data-motion="M2+D1"
      data-span-vh={FRAME_EXPAND_SPAN_VH}
      data-tier1-exception="D9"
      className="relative flex min-h-svh items-center overflow-hidden bg-charcoal"
    >
      {/* The frame. clip-path opens across the approach. */}
      <div
        aria-hidden
        data-frame
        className="absolute inset-0"
        style={
          prefersReduced ? undefined : { clipPath: "inset(12% 14% 12% 14%)" }
        }
      >
        <div
          data-frame-media
          className={`absolute inset-0 ${toneClasses[beat.tone]}`}
          style={prefersReduced ? undefined : { transform: "scale(1.3)" }}
        >
          {/* D1 — the 3D scene. `perspective` here, `preserve-3d` on the
              camera, fixed translateZ on each plane. Only the camera moves. */}
          <div
            className="absolute inset-0"
            style={{ perspective: "1200px" }}
          >
            <div
              data-dolly-camera
              className="absolute inset-0"
              style={{ transformStyle: "preserve-3d" }}
            >
              {livingWorkPlanes.map((slot, index) => (
                <div
                  key={slot.id}
                  className={`absolute ${PLANE_POSITION[index]}`}
                  style={{
                    transform: `translateZ(${planeDepthPx(index)}px)`,
                  }}
                >
                  <MediaTile slot={slot} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Oversized eyebrow behind the copy, drifting at the 0.15 ratio. */}
      <GhostType word={beat.eyebrow} />

      {/* X5 — legibility scrim. Non-negotiable wherever copy sits on media,
          and it must be re-tested against the brightest frame of the real
          footage rather than against these flat fields. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-charcoal/85 via-charcoal/45 to-charcoal/70"
      />

      <BeatContent beat={beat} />
    </section>
  );
}
