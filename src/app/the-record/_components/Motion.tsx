"use client";

import { useEffect } from "react";
import { register, start, stop, watchVisibility } from "@/lib/motion-controller";
import { createRecord } from "@/lib/motion/record";
import { markEntered } from "@/lib/site-entry";

/**
 * Mounts The Record's motion. Renders nothing.
 *
 * markEntered() runs here for the same reason it does on /truth: this page has
 * no Preloader, so on a direct load nothing else would open the entry gate and
 * the hero's gate="entry" reveal would wait forever. Idempotent, so arriving
 * from a page whose loader already marked entry is unaffected.
 */
export function V2RecordMotion() {
  useEffect(() => {
    markEntered();
    const unregister = register(createRecord());
    start();
    const unwatch = watchVisibility();
    return () => {
      unwatch();
      unregister();
      stop();
    };
  }, []);

  return null;
}
