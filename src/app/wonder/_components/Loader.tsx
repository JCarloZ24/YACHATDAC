"use client";

import { PageLoader } from "@/components/ui/PageLoader";

/**
 * Wonder's loading screen. Over Living Work's gates (fonts, window load) it
 * adds the hero film: the count cannot pass 80% until the video has enough
 * data to play (readyState ≥ HAVE_FUTURE_DATA), so the panel lifts onto a
 * hero that is already moving rather than one still buffering — the refresh
 * stall this exists to cover. The cap is 4s — enough for the film's first
 * seconds to buffer on a fair connection, and past it the panel lifts onto
 * the poster rather than hold the reader. A missing video (no encode on
 * disk, or reduced motion's poster) passes straight through.
 */
const heroFilmReady = () => {
  const video = document.querySelector<HTMLVideoElement>("main header video");
  return !video || video.readyState >= 3;
};

export function WonderLoader() {
  return <PageLoader name="Wonder" ready={heroFilmReady} hardCapMs={4000} />;
}
