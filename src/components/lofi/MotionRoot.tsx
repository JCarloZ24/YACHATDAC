"use client";

import { useEffect } from "react";
import { start, stop, watchVisibility } from "@/lib/motion-controller";

/**
 * Starts the Tier 1 motion controller for the page that mounts it.
 *
 * Renders nothing. Mount it once per Tier 1 page — currently the homepage
 * only, and by F4 that is the whole list. Do NOT put this in the root layout:
 * pulling the controller (and therefore GSAP) into every route is how a CMS
 * template ends up one import away from Tier 1 behaviour.
 *
 * Sections register themselves with the controller as they mount, so the order
 * of mounting does not matter — register() inits immediately if start() has
 * already run.
 */
export function MotionRoot() {
  useEffect(() => {
    start();
    const unwatchVisibility = watchVisibility();
    return () => {
      unwatchVisibility();
      stop();
    };
  }, []);

  return null;
}
