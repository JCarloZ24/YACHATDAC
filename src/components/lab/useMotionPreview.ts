"use client";

import { useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Prototype-only override for the reduced-motion branch.
 *
 * The site itself has no such thing and must not grow one: it follows the
 * system preference, full stop. But a review page has a different job. If the
 * reviewer's machine asks for reduced motion — which Windows does by default
 * once "Animation effects" is off, and which headless Chrome does always — then
 * every prototype here correctly shows its cut version, and the reviewer has no
 * way to see the behaviour they were asked to judge, and no clue why.
 *
 * So: "System" is the default and the honest one. The other two force a branch
 * so both can be looked at deliberately, side by side, on one machine.
 */

export type MotionPreview = "system" | "motion" | "reduced";

export function useMotionPreview() {
  const systemReduced = usePrefersReducedMotion();
  const [preview, setPreview] = useState<MotionPreview>("system");

  const reduced =
    preview === "system" ? systemReduced : preview === "reduced";

  return { preview, setPreview, systemReduced, reduced };
}
