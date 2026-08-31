"use client";

import { photoById, type MotionGrade } from "@/content/kit";

/**
 * Shared pieces for the effects gallery.
 *
 * Split out so the demo list can grow without EffectsGallery.tsx becoming a
 * file nobody wants to open. The gallery owns the page; this owns the parts
 * every panel is built from.
 */

export type Demo = {
  effect: string;
  role: string;
  sketch: string;
  plate?: string;
  blurb: string;
  /** Render the demo body; `run` fires the effect on the panel's root. */
  render: (reduced: boolean) => React.ReactNode;
  run: (root: HTMLElement, reduced: boolean) => void;
};

export const GRADE_LABEL: Record<MotionGrade, string> = {
  full: "full — the image plane may move",
  frame: "frame — the world moves, the record holds",
};

/**
 * One photograph, stamped with its motion grade.
 *
 * The `frame` badge is deliberately visible in the gallery: a reviewer looking
 * at an effect that does not move a held image should be able to see *why*
 * without reading the code.
 */
export function Frame({
  photo,
  className = "",
  framed = false,
}: {
  photo: string;
  className?: string;
  framed?: boolean;
}) {
  const p = photoById(photo);
  if (!p) return null;
  return (
    <div
      {...(framed ? { "data-frame": "" } : {})}
      data-media-tile={p.id}
      data-motion={p.grade}
      className={`relative overflow-hidden bg-charcoal ${className}`}
    >
      {/* Plain <img>: the gallery wants the raw frame at a known size, and
          next/image's layout machinery fights the clip-path demos. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        {...(framed ? { "data-frame-media": "" } : {})}
        src={p.src}
        alt=""
        width={p.width}
        height={p.height}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {p.grade === "frame" ? (
        <span className="absolute top-2 left-2 rounded-xs bg-charcoal/80 px-2 py-1 text-[0.6rem] tracking-widest text-ochre uppercase">
          frame
        </span>
      ) : null}
    </div>
  );
}
