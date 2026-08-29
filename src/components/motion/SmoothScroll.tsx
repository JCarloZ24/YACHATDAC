"use client";

import { useEffect } from "react";
import { createSmoothScroll } from "@/lib/motion/smooth-scroll";

/**
 * Mounts Lenis for the segment that renders it — currently /v2 only. Renders
 * nothing. Do NOT move into the root layout: the current pages ship without
 * smooth scroll by design, and the v2 build must not change how they feel.
 */
export function SmoothScroll() {
  useEffect(() => createSmoothScroll(), []);
  return null;
}
