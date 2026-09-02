"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SCRUB } from "@/lib/motion/tokens";
import { markEntered } from "@/lib/site-entry";

gsap.registerPlugin(ScrollTrigger);

/**
 * The Truth hero's motion, per the hi-fi note (2026-09-02):
 *
 *   · The photograph is on screen before anything animates — no fade, no
 *     arrival. It starts ~4% larger than the frame and settles to rest over
 *     a long scroll, so it breathes rather than sits still. Scrubbed: the
 *     settling IS scroll position.
 *   · The cue's brightness pulse (CSS, scroll-cue-glow) stops the moment the
 *     reader scrolls — killed permanently, like the homepage cue.
 *
 * The headline's line-by-line uncover is SplitReveal's job, not this file's.
 * Reduced motion: the resting markup is the final state — the photo simply
 * sits at rest and the CSS pulse never runs (globals.css).
 */
export function TruthHeroMotion() {
  useEffect(() => {
    // No Preloader on this route: entry is now, so the headline's
    // entry-gated reveal can play (same pattern as V2TruthMotion).
    markEntered();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const media = document.querySelector<HTMLElement>("[data-truth-hero-media]");
    const cue = document.querySelector<HTMLElement>("[data-hero-cue]");

    const ctx = gsap.context(() => {
      if (media) {
        gsap.fromTo(
          media,
          { scale: 1.04 },
          {
            scale: 1,
            ease: "none",
            immediateRender: true,
            scrollTrigger: {
              trigger: media,
              start: "top top",
              end: "bottom top",
              scrub: SCRUB.light,
            },
          },
        );
      }
    });

    const killCue = () => {
      if (cue) cue.style.animation = "none";
    };
    window.addEventListener("scroll", killCue, { once: true, passive: true });

    return () => {
      window.removeEventListener("scroll", killCue);
      ctx.revert();
    };
  }, []);

  return null;
}
