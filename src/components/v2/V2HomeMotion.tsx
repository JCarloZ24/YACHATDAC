"use client";

import { useEffect } from "react";
import { register, start, stop, watchVisibility } from "@/lib/motion-controller";
import { createOrbit } from "@/lib/motion/orbit";
import { createRecall } from "@/lib/motion/recall";
import { createV2Home } from "@/lib/motion/v2-home";

/**
 * Mounts /v2/home's motion: the chosen hero proposal plus the page
 * choreography. Renders nothing. The Preloader owns entry — this component
 * must not call markEntered().
 *
 * `variant` is decided server-side from ?hero= so the two proposals can be
 * reviewed side by side without a rebuild (F7, Ivy's request: "proposal 2
 * just so we can pick").
 */
export function V2HomeMotion({ variant }: { variant: "recall" | "orbit" }) {
  useEffect(() => {
    const unregister = [
      register(variant === "orbit" ? createOrbit() : createRecall()),
      register(createV2Home()),
    ];
    start();
    const unwatch = watchVisibility();
    return () => {
      unwatch();
      unregister.forEach((fn) => fn());
      stop();
    };
  }, [variant]);

  return null;
}
