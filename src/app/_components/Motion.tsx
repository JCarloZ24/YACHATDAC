"use client";

import { useEffect } from "react";
import { start, stop, watchVisibility } from "@/lib/motion-controller";

/**
 * The homepage's motion lifecycle. Renders nothing.
 *
 * ⚠ WITHOUT THIS, EVERY CLIENT-SIDE NAVIGATION TO `/` ARRIVED WITH NO MOTION
 * AT ALL (August, 11 September 2026: "when clicking on logo homepage shows
 * unexplained broken frame with random elements"). Measured on the production
 * build, 1440x900:
 *
 *   hard load  /                    23,303px document, 1 pin spacer
 *   click      /truth       → /      5,141px document, 0 pin spacers
 *   click      /living-work → /      5,141px document, 0 pin spacers
 *   click      /about       → /      5,141px document, 0 pin spacers
 *   click      /truth → /living-work 21,054px, 2 pins — i.e. NOT a general bug
 *
 * With no pins the hero's panels have no scroll distance to occupy, so every
 * screen of the page renders at one offset: the headline over the pathway
 * cards over the photographs, which is the frame August screenshotted. It was
 * not a transient — the document was still 5,141px four seconds later.
 *
 * THE CAUSE IS EFFECT ORDERING, and it is why only `/` was affected. Every
 * other route owns a `Motion.tsx` that calls `start()` inside a plain
 * `useEffect` and `stop()` from its cleanup. React runs all passive unmount
 * cleanups before any passive mount effect, so the outgoing page's `stop()`
 * always lands BEFORE the incoming page's `start()` and the two interleave
 * correctly.
 *
 * The homepage had no such component. Its motion is registered by
 * `HomeHeroCanvas` and `HomeLoader` through `useGSAP`, which is a LAYOUT
 * effect — and layout effects run before every passive effect in the commit.
 * So the order on a navigation into `/` was:
 *
 *   1. home registers; `started` is still true from the outgoing page, so
 *      `register()` inits each module immediately and `start()` early-returns
 *   2. the outgoing page's passive cleanup calls `stop()`, which destroys
 *      every registered module — including the homepage's, which had just
 *      been built — and sets `started = false`
 *   3. nothing calls `start()` again, because the only calls were in step 1
 *
 * This is step 3. Its `start()` is passive, so it runs after that `stop()`,
 * finds `started === false`, and initialises the modules the outgoing page
 * destroyed. The matching `stop()` restores the symmetry every other route
 * already has, so leaving `/` tears down the way leaving any page does.
 *
 * ⚠ DO NOT "SIMPLIFY" THIS BY MOVING THE START INTO `HomeHeroCanvas` OR
 * `HomeLoader`. Both reach the controller from `useGSAP`, which is the layout
 * phase the bug lives in; the whole point is to hold a call in the passive
 * phase, after the outgoing route has finished tearing itself down.
 */
export function HomeMotion() {
  useEffect(() => {
    start();
    const unwatch = watchVisibility();
    return () => {
      unwatch();
      stop();
    };
  }, []);

  return null;
}
