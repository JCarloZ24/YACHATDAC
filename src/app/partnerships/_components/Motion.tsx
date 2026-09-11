"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { register, start, stop, watchVisibility } from "@/lib/motion-controller";
import {
  partnershipsEnding,
  partnershipsHero,
  partnershipsObligation,
  partnershipsOpenResearch,
  partnershipsPartners,
  partnershipsWaysIn,
} from "@/lib/motion/partnerships";
import { hosting } from "@/lib/motion/recipes";
import { markEntered } from "@/lib/site-entry";

/**
 * /partnerships — the page's motion script. Verb: HOSTS.
 *
 * ⚑ THE "STATIC BY DECISION" ERA IS OVER (user direction, 11 September 2026).
 * The page was built static below §01 and every header here, in ./Sections.tsx
 * and in ../page.tsx said so. It is now being scored section by section from
 * the wireframe's own side-notes. Each section lands with its grammar row, its
 * ledger row in `docs/motion/scenes.md`, and the header it contradicts amended
 * in the SAME pass — that rule is written at the top of
 * `src/lib/motion/partnerships.ts` and it is the reason those headers were
 * trustworthy in the first place.
 *
 * WIRED HERE: §01's arrival overture, §02's settle, §03's character display,
 * §04's disclosure (`hosting`), §05's card resolve, §06's arrivals and §08's.
 * §04b and §07 are the page's two rest screens and stay still on purpose — the
 * breath is a held photograph and the protocol screen "cites hold".
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

      // ⚠ REGISTERED TOP-TO-BOTTOM, and the order is load-bearing rather than
      // tidy. ScrollTrigger refreshes in creation order unless every trigger
      // carries a refreshPriority, and §04 pins — a pin refreshed before the
      // sections above it have been measured lays its spacer against a
      // document that then changes height underneath it. Page order is the
      // cheapest correct answer. Keep new sections in their true position.
      // ⚠ `data-pt` RATHER THAN NEW IDS on the three sections that have none.
      // The page header names exactly three anchors as load-bearing, and an id
      // is a link target: minting `#obligation` so a motion host can find a
      // section would publish a URL nobody decided to publish and that nothing
      // links to. `data-pt` is what the hero already uses.
      const sections: Array<[string, (el: HTMLElement) => ReturnType<typeof partnershipsHero>]> = [
        ['[data-pt="obligation"]', partnershipsObligation],
        ["#research-opportunities", partnershipsOpenResearch],
        // §04 — the gaps disclose. `hosting` was written for this section and
        // had no consumer outside /lab/compose until now; the markup contract
        // it documents ([data-heading], [data-shutter], [data-vessel-source])
        // is in ./Sections.tsx.
        //
        // ⚠ NOT PINNED, against the wireframe note's "PINNED 190vh". The
        // section is 190vh TALL — SCREEN.openQuestions gives it
        // `lg:min-h-[190vh]` so it matches the frame's own artboard — and
        // pinning a 1,710px section at `top top` holds its first 900px still
        // while the reader scrolls another 1,710px. The four shutters sit 929
        // and 1,433 from the section's top, so every one of them opened below
        // the fold and the page read as stuck. Reported and fixed on the same
        // day it landed.
        //
        // The 190vh is not lost: unpinned, the scrub runs across exactly the
        // scrolling it takes to pass a 190vh section, so the shutters open as
        // their own cards reach the reader. That is closer to what the note
        // describes — "as the reader scrolls" — than a held screen was.
        ["#open-questions", (el: HTMLElement) => hosting(el, 190, false)],
        ['[data-pt="partners"]', partnershipsPartners],
        ["#ways-in", partnershipsWaysIn],
        ['[data-pt="ending"]', partnershipsEnding],
      ];
      for (const [selector, build] of sections) {
        const el = document.querySelector<HTMLElement>(selector);
        if (el) unregister.push(register(build(el)));
      }

      start();
    };

    build();

    // The hero is 100svh of photograph above everything else on the page; one
    // refresh once the layout has settled keeps every later trigger measured
    // against the same document. It stopped being a precaution the moment §04
    // started pinning: the gap photographs load lazily above it, and a pin
    // measured before they land holds the wrong span.
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
