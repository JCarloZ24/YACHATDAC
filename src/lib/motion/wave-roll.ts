"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "../motion-controller";
import { registerYachatdacEffects } from "./effects";

/**
 * About's crest motion on any single wave seam.
 *
 * Grammar row: "a change of ground", Record wave / SCR-11 — the cream
 * divider swells from 60% height and rolls sideways by 15% of the shared
 * two-tile strip, settling into its drawn shape as the incoming section
 * reaches the top.
 *
 * ⚠ THIS IS NOT ABOUT'S SEAM DECK, and must not become it. /about hands one
 * section to the next through `coverSeams` in recipes-about.ts: the outgoing
 * slide pins, a hold charges on wheel input, and a full charge PLAYS the
 * hand-off with lenis locked. That machinery is About's verb (ANSWERS) and
 * carrying it onto another page would break the one-verb rule outright. What
 * ports is the WAVE'S OWN MOVEMENT and nothing else — the crest swelling and
 * the ink rolling like water — scrubbed on the host page's ordinary scroll.
 * The Record took exactly this cut on 9 Sep 2026 and Wonder takes it on 11
 * Sep; both read as About's water without either becoming a deck.
 *
 * ⚠ THE INK, NEVER THE SVG. `WaveDivider` seats itself with a Tailwind
 * `-translate-y`, which compiles to `transform` — a GSAP write to the root
 * clobbers that seat and the wave vanishes (the defect recorded in
 * recipes-about.ts). The tween targets `[data-wave-ink]`, the group INSIDE
 * the svg, whose own transform is free.
 *
 * Renamed from `createRecordWave` on 11 September 2026 when /wonder became
 * the second caller; the effect, the trigger window and The Record's
 * behaviour are byte-for-byte what they were.
 */
export function createWaveRoll(
  root: HTMLElement,
  /** The `hook` the seam's `WaveDivider` was given. */
  hook = "record-wave",
): MotionModule {
  let cleanup: (() => void) | undefined;
  return {
    init() {
      cleanup?.();
      registerYachatdacEffects();
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const ink = root.querySelector(
          `[data-seam='${hook}'] [data-wave-ink]`,
        );
        if (!ink) return;
        const animation = gsap.effects.recordWaveRoll(ink) as gsap.core.Tween;
        // The whole approach of the section, so the crest is still settling
        // as its ground reaches the top — not a beat that fires and is over.
        ScrollTrigger.create({
          trigger: root, start: "top bottom", end: "top top",
          animation, scrub: 0.3, invalidateOnRefresh: true,
        });
      }, root);
      cleanup = () => media.revert();
    },
    destroy() { cleanup?.(); cleanup = undefined; },
  };
}
