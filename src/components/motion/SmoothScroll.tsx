"use client";

import { useEffect } from "react";
import { createSmoothScroll } from "@/lib/motion/smooth-scroll";

/**
 * Mounts the shared SCR-09 wheel inertia for the page or segment that renders
 * it (grammar: "being drawn in"). Renders nothing and cleans up on unmount.
 * Keep this opt-in rather than moving it into the root layout: The Record's
 * 2026-09-08 direction adds scroll inertia while its content stays static.
 */
export function SmoothScroll() {
  useEffect(() => createSmoothScroll(), []);
  return null;
}
