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
 *
 * ⚠ NOT MOUNTED, and SUPERSEDED — 11 September 2026, user direction. Wonder's
 * panel is now the site's panel: components/layout/RouteLoader renders the
 * same PageLoader on every route from the root layout, announcing whichever
 * page it covers, so mounting this as well would put two covers on Wonder.
 *
 * Kept rather than deleted (explicitly "hide it only"), and it is still the
 * one place Wonder's own timing argument is written down — the 8.3s/14.1s
 * measurement above is why RouteLoader does not wait for hero media either.
 * If Wonder ever needs a panel tuned differently from the rest of the site,
 * this is the shape that does it.
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
