import { ViewTransition } from "react";
import type { ReactNode } from "react";

/**
 * C4 — cross-route shared element. Wrap BOTH ends (the card tile on one page,
 * the hero media on the other) with the same `name`; the browser morphs
 * between their snapshots during the navigation.
 *
 * Both props matter: `default="none"` stops the named element crossfading on
 * every unrelated transition, and with `default="none"` the explicit
 * `share="morph"` is what keeps the pair morphing at all — dropping either is
 * the documented silent failure (view-transitions.md).
 *
 * Names come from content slugs, never useId — the two ends render in
 * different trees and must agree.
 *
 * ▲ CULTURAL — a morph is motion applied to whatever it wraps. Photo/media
 * tiles are cleared; do NOT wrap Leonard Mickelo's artwork without a recorded
 * permission (permissions.md, sign-off queue).
 */
export function SharedMorph({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  return (
    <ViewTransition name={name} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}
