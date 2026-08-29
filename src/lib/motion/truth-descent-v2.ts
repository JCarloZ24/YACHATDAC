"use client";

/**
 * /v2/truth — additions on top of the descent.
 *
 * The committed truth-descent module (grounds, bands, rail, settling
 * headings, arrivals) is mounted unchanged alongside this one; this file adds
 * only what F7 newly permits. The v1 file is not edited — its header still
 * quotes the superseded doctrine and stays as the historical record.
 *
 *   [data-v2-hero-media]   the hero photograph — slow push-in (M1), scrubbed
 *   [data-v2-depth]        era media/figures drift against the copy (D3-lite,
 *                          ±40px, transform only — depth without WebGL)
 *   [data-v2-count]        the 1902/1886 numerals — they arrive at scale and
 *                          take the screen; the count is the page's loudest
 *                          typographic moment and everything near it is still
 *
 * Suzanne's testimony itself carries NO motion attributes. That stillness is
 * the doctrine's stated exception (F7 rule 1): the reader is being read to.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "@/lib/motion-controller";

gsap.registerPlugin(ScrollTrigger);

export function createTruthDescentV2(): MotionModule {
  let ctx: gsap.Context | null = null;

  const init = () => {
    ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const hero = document.querySelector<HTMLElement>(
          "[data-v2-hero-media]",
        );
        if (hero) {
          gsap.fromTo(
            hero,
            { scale: 1 },
            {
              scale: 1.1,
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 0.6,
              },
            },
          );
        }

        gsap.utils.toArray<HTMLElement>("[data-v2-depth]").forEach((el) => {
          gsap.fromTo(
            el,
            { y: 40 },
            {
              y: -40,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-v2-count]").forEach((el) => {
          gsap.from(el, {
            scale: 0.9,
            opacity: 0.3,
            transformOrigin: "left center",
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "top 45%",
              scrub: 0.7,
            },
          });
        });
      });

      // Reduced motion: nothing to do — every element's resting markup IS the
      // final state, and the base descent module handles ground/rail snapping.
      mm.add("(prefers-reduced-motion: reduce)", () => undefined);
    });
  };

  const destroy = () => {
    ctx?.revert();
    ctx = null;
  };

  return { init, destroy };
}
