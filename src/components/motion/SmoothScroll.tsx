"use client";

import { useEffect } from "react";
import { createSmoothScroll } from "@/lib/motion/smooth-scroll";

/**
 * Mounts the shared SCR-09 wheel inertia for the page or segment that renders
 * it (grammar: "being drawn in"). Renders nothing and cleans up on unmount.
 * Keep this opt-in rather than moving it into the root layout: The Record's
 * 2026-09-08 direction adds scroll inertia while its content stays static.
 */
export function SmoothScroll({
  /**
   * Wheel weight — how far one notch moves the document, as a multiplier.
   * Omit it and the page gets the site's default feel; a page passes something
   * lower to slow its scrubbed beats without changing any of its measurements.
   * See DEFAULT_WHEEL in src/lib/motion/smooth-scroll.ts.
   */
  wheel,
}: {
  wheel?: number;
} = {}) {
  useEffect(() => createSmoothScroll({ wheel }), [wheel]);
  return null;
}
