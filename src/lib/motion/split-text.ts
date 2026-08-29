"use client";

/**
 * The split-text engine behind <SplitReveal>.
 *
 * Modes map to sketches: "lines" is B5 (the workhorse — line mask, settle),
 * "words" is the softer variant for standfirsts, "chars" is B6 and is for
 * SHORT display headings only — narrative and testimony copy stays line-split
 * (tokens.md). `aria: "auto"` keeps the accessible name intact either way.
 *
 * autoSplit re-splits on resize and late font arrival and re-runs onSplit,
 * which is why the tween is created inside onSplit and returned — SplitText
 * reverts and rebuilds it with the fresh targets. Callers still wait for
 * document.fonts.ready before wiring (the brand faces swap late and line
 * breaks depend on their metrics).
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export type SplitMode = "lines" | "words" | "chars";

/** tokens.md values. */
const EASE_COUNTRY = "expo.out";
const DUR_LARGE = 0.82;
const STAGGER: Record<SplitMode, number> = {
  lines: 0.09,
  words: 0.045,
  chars: 0.028,
};

export type SplitRevealOptions = {
  mode: SplitMode;
  /** Scrub the reveal against scroll instead of playing it once. */
  scrub?: boolean;
  /**
   * "view" (default) — reveal when scrolled into view, once.
   * "now" — play immediately (callers gate on awaitEntry first).
   */
  trigger?: "view" | "now";
};

export function wireSplitReveal(
  el: HTMLElement,
  { mode, scrub = false, trigger = "view" }: SplitRevealOptions,
): () => void {
  if (mode === "chars" && (el.textContent ?? "").trim().length > 48) {
    // B6 is capped at short display headings. Longer copy gets lines.
    mode = "lines";
  }

  const split = SplitText.create(el, {
    type: mode === "lines" ? "lines" : mode === "words" ? "lines,words" : "chars",
    ...(mode === "chars" ? {} : { mask: "lines" as const }),
    autoSplit: true,
    aria: "auto",
    onSplit: (self) => {
      const targets =
        mode === "lines" ? self.lines : mode === "words" ? self.words : self.chars;

      const vars: gsap.TweenVars = {
        yPercent: 110,
        ...(mode === "chars" ? { opacity: 0 } : {}),
        duration: DUR_LARGE,
        ease: EASE_COUNTRY,
        stagger: STAGGER[mode],
      };

      if (trigger === "view" || scrub) {
        vars.scrollTrigger = scrub
          ? { trigger: el, start: "top 88%", end: "top 38%", scrub: 0.8 }
          : { trigger: el, start: "top 85%", once: true };
      }

      return gsap.from(targets, vars);
    },
  });

  return () => split.revert();
}
