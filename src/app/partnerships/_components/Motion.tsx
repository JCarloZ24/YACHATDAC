"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { register, start, stop, watchVisibility } from "@/lib/motion-controller";
import { partnershipsHero } from "@/lib/motion/partnerships";
import { markEntered } from "@/lib/site-entry";

/**
 * /partnerships — the page's motion script. Verb: HOSTS.
 *
 * §01 ONLY. This host wires the hero's arrival overture and nothing else; §02
 * down are still static by decision and their headers in ./Sections.tsx say
 * so. The score is documented at `src/lib/motion/partnerships.ts` and
 * ledgered at `docs/motion/scenes.md`.
 *
 * Built at 1440 × 900 first (user direction, 9 September 2026). Nothing here
 * is width-gated — an arrival and a divider cost no scroll and do not argue
 * with a touch scroller — so the same score runs at 375.
 *
 * The font wait lives in the module, not here: the hero is on screen the
 * instant the page paints, so it hides its own copy synchronously and only
 * the split waits for Block Berthold.
 *
 * ⚠ markEntered() RUNS HERE, and the hero is hidden until it does. This page
 * has no Preloader, so on a direct load of /partnerships nothing else would
 * ever open the entry gate and the overture — which starts from opacity 0 —
 * would wait for ever with the hero blank. Same reason and same fix as
 * /truth's host (`truth/_components/Motion.tsx:22`). Idempotent, so arriving
 * from a page whose loader already marked entry is unaffected, and the wipe's
 * own gate still holds the overture until the incoming page is visible.
 *
 * Renders nothing.
 */
export function PartnershipsMotion() {
  useEffect(() => {
    markEntered();
    let disposed = false;
    const unregister: Array<() => void> = [];

    const build = () => {
      if (disposed) return;
      const hero = document.querySelector<HTMLElement>('[data-pt="hero"]');
      if (hero) unregister.push(register(partnershipsHero(hero)));
      start();
    };

    build();

    // The hero is 100svh of photograph above everything else on the page; one
    // refresh once the layout has settled keeps every later trigger measured
    // against the same document. Harmless while §01 is the only scene, and
    // already correct for the next one.
    const settle = window.setTimeout(() => ScrollTrigger.refresh(), 900);

    const unwatch = watchVisibility();
    return () => {
      disposed = true;
      window.clearTimeout(settle);
      unwatch();
      unregister.forEach((fn) => fn());
      stop();
    };
  }, []);

  return null;
}
