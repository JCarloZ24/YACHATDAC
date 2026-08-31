"use client";

import { useEffect } from "react";
import { register, start, stop, watchVisibility } from "@/lib/motion-controller";
import {
  breath,
  clusterDescent,
  fullBleedOpen,
  apertureSequence,
  pinnedCount,
  quietArrival,
  stickyStreams,
  vessels,
} from "@/lib/motion/recipes";

/**
 * /v2/living-work — the page's motion script. Verb: ACCUMULATES.
 *
 * One recipe per screen, each declaring its own loud channel and its span in
 * vh. Renders nothing.
 *
 * THE SCENE LEDGER, in order, so the pacing is readable here as well as in
 * docs/motion/scenes.md:
 *
 *   §01 hero        media       100vh   ⚡5   → rest
 *   §02 aperture    type        300vh   ⚡5   pinned · the signature
 *   §03 challenges  transition  330vh   ⚡3
 *   §04 rangers     media       100vh   ⚡4   → rest
 *   §05 spring      media       150vh   ⚡5   pinned · snapped
 *   §06 streams     media       360vh   ⚡3
 *   §07b breath     none         47vh   ⚡1   the hold
 *   §08 outputs     none        120vh   ⚡2
 *   §09 invitation  type        100vh   ⚡2
 *
 * No channel runs three deep. The two 5s at §01 and §02 are consecutive, which
 * is the permitted maximum of two, and §03 drops to 3 immediately after. §07b
 * is a real scene, not padding — it is the hinge the hi-fi named.
 *
 * Waits for fonts before building. The aperture measures a glyph's box to place
 * its portal, and Block Berthold arrives late (it is self-hosted, and gitignored
 * under F5) — measure before it lands and the portal sits in the wrong place on
 * a cold cache while looking perfect on a warm one, which is the worst kind of
 * bug to chase.
 */
export function V2LivingWorkMotion() {
  useEffect(() => {
    let disposed = false;
    const unregister: Array<() => void> = [];

    const build = () => {
      if (disposed) return;
      const find = (name: string) =>
        document.querySelector<HTMLElement>(`[data-lw="${name}"]`);

      const wire = (el: HTMLElement | null, make: (e: HTMLElement) => ReturnType<typeof breath>) => {
        if (el) unregister.push(register(make(el)));
      };

      wire(find("hero"), (el) => fullBleedOpen(el, 100));
      wire(find("aperture"), (el) => apertureSequence(el, 300));
      wire(find("challenges"), (el) =>
        // bone → dust → dry earth. The ground dries out while the section is
        // read, because the section is about drought and erosion.
        clusterDescent(el, ["#f6f6ec", "#e3dcc9", "#c9b79a", "#8a7455"], 330),
      );
      wire(find("rangers"), (el) => fullBleedOpen(el, 100));
      wire(find("spring"), (el) => pinnedCount(el, 150));
      wire(find("streams"), (el) => stickyStreams(el, 360));
      wire(find("breath"), (el) => breath(el, 47));
      wire(find("outputs"), (el) => vessels(el, 120));
      wire(find("invitation"), (el) => quietArrival(el, 100));

      start();
    };

    if (document.fonts?.status === "loaded") build();
    else void document.fonts?.ready.then(build);

    const unwatch = watchVisibility();
    return () => {
      disposed = true;
      unwatch();
      unregister.forEach((fn) => fn());
      stop();
    };
  }, []);

  return null;
}
