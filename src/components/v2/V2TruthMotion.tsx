"use client";

import { useEffect } from "react";
import { register, start, stop, watchVisibility } from "@/lib/motion-controller";
import { createTruthDescent } from "@/lib/motion/truth-descent";
import { createTruthDescentV2 } from "@/lib/motion/truth-descent-v2";
import { markEntered } from "@/lib/site-entry";

/**
 * Mounts /v2/truth's motion: the committed descent module (grounds, bands,
 * rail, settling headings, arrivals — unedited) plus the v2 additions that F7
 * newly permits. Renders nothing.
 *
 * markEntered() runs here because this page has no Preloader: on a direct
 * load nothing else would ever open the entry gate and every gate="entry"
 * reveal would wait forever. Idempotent, so arriving from /v2/home (where the
 * loader already marked entry) is unaffected.
 */
export function V2TruthMotion() {
  useEffect(() => {
    markEntered();
    const unregister = [
      register(createTruthDescent()),
      register(createTruthDescentV2()),
    ];
    start();
    const unwatch = watchVisibility();
    return () => {
      unwatch();
      unregister.forEach((fn) => fn());
      stop();
    };
  }, []);

  return null;
}
