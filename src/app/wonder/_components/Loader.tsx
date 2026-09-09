"use client";

import { PageLoader } from "@/components/ui/PageLoader";

/**
 * Wonder's loading screen.
 *
 * IT DOES NOT WAIT FOR THE HERO FILM. It used to, and that was the wrong
 * gate: measured 9 Sep 2026 on a production build, the panel held for 8.3s
 * on desktop and 14.1s on a phone, while first paint was already done at
 * ~400ms. The film is not worth waiting for anyway — the poster IS its
 * first frame, so the swap from still to moving picture is invisible.
 *
 * What is left is a short cover for the settling window (fonts resolving,
 * the motion pass building) and nothing more: ~1.6s floor against the
 * shared default's ~3s, and a 2.5s ceiling past which it lifts regardless.
 * Deleting `<WonderLoader />` from the page is the whole removal if even
 * that reads as too long.
 */
export function WonderLoader() {
  return (
    <PageLoader
      name="Wonder"
      hardCapMs={2500}
      rampMs={900}
      sweepMs={800}
      dwellMs={700}
    />
  );
}
