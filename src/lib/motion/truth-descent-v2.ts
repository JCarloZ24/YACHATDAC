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
 *   [data-v2-trail-fill]   the winding trail's gold layer — clipped open
 *                          linearly with document scroll (machine easing; a
 *                          progress indicator that eases is lying)
 *
 * Suzanne's testimony itself carries NO motion attributes. That stillness is
 * the doctrine's stated exception (F7 rule 1): the reader is being read to.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "@/lib/motion-controller";
import { registerYachatdacEffects } from "@/lib/motion/effects";
import { SCRUB } from "@/lib/motion/tokens";

gsap.registerPlugin(ScrollTrigger);

export function createTruthDescentV2(): MotionModule {
  let ctx: gsap.Context | null = null;

  const init = () => {
    registerYachatdacEffects();

    ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The winding trail. Two clipped layers, both derived from scroll:
        //   · the gold ink ([data-v2-trail-fill]) carries a short scrub lag
        //     so it reads as liquid flowing through the dots — it still maps
        //     linearly to scroll and works in both directions, so a jump
        //     (e.g. "Start from the beginning") just flows down to meet you;
        //   · the gray footsteps ([data-v2-steps-fill]) track the READING
        //     LINE — the same 60%-of-viewport line that lights each pointer.
        //     Its tip starts 0.6vh down the trail and stays glued to that
        //     line the whole descent, so it meets every pointer exactly as
        //     the pointer bursts — top of the page or bottom.
        const root = document.querySelector<HTMLElement>("[data-descent-root]");
        if (root) {
          const wireFill = (
            selector: string,
            lag: number,
            headStart: number,
          ) => {
            const layer = document.querySelector<HTMLElement>(selector);
            if (!layer) return;
            gsap.fromTo(
              layer,
              {
                clipPath: () =>
                  `inset(0% 0% ${Math.max(
                    0,
                    100 -
                      ((headStart * window.innerHeight) / root.offsetHeight) *
                        100,
                  ).toFixed(3)}% 0%)`,
              },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                ease: "none",
                immediateRender: true,
                scrollTrigger: {
                  trigger: root,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: lag,
                  invalidateOnRefresh: true,
                },
              },
            );
          };
          wireFill("[data-v2-trail-fill]", 0.6, 0);
          wireFill("[data-v2-steps-fill]", 0.3, 0.6);
        }

        // The hero settle — the hi-fi motion note (2026-09-02) supersedes the
        // old M1 push-in: the photograph is on screen before anything
        // animates, starts ~4% over frame, and settles to rest over a long
        // scroll. It breathes rather than sits still; the settling IS scroll
        // position, so the scrub stays.
        //
        // GRADE: this selector deliberately excludes frame-graded media. The
        // Truth hero may carry escarpment or engraving material, and on that
        // the plate moves while the record holds — moving the image plane
        // itself is the one thing the grade forbids.
        const hero = document.querySelector<HTMLElement>(
          "[data-v2-hero-media]:not([data-motion='frame'])",
        );
        if (hero) {
          gsap.fromTo(
            hero,
            { scale: 1.04 },
            {
              scale: 1,
              ease: "none",
              immediateRender: true,
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: SCRUB.light,
              },
            },
          );
        }

        // Entry plates (04 · ENTRY TODAY) — the spec's push in, 1.06→1.00,
        // scrubbed over the plate's travel through the viewport so it works
        // in both directions. Same grade exclusion as the hero: a
        // frame-graded record never has its image plane moved.
        gsap.utils
          .toArray<HTMLElement>("[data-v2-plate]:not([data-motion='frame'])")
          .forEach((plate) => {
            gsap.fromTo(
              plate,
              { scale: 1.06 },
              {
                scale: 1,
                ease: "none",
                immediateRender: true,
                scrollTrigger: {
                  trigger: plate,
                  start: "top bottom",
                  end: "top top",
                  scrub: SCRUB.light,
                },
              },
            );
          });

        // The cue's brightness pulse (CSS) dies on the first scroll, for good.
        const cue = document.querySelector<HTMLElement>("[data-hero-cue]");
        if (cue) {
          window.addEventListener(
            "scroll",
            () => {
              cue.style.animation = "none";
            },
            { once: true, passive: true },
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

      // Reduced motion: the trail shows the whole record, statically open —
      // its resting markup clips it shut, which would read as "no progress".
      // Everything else's resting markup IS the final state, and the base
      // descent module handles ground/rail snapping.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        ["[data-v2-trail-fill]", "[data-v2-steps-fill]"].forEach((selector) => {
          const layer = document.querySelector<HTMLElement>(selector);
          if (layer) gsap.set(layer, { clipPath: "inset(0% 0% 0% 0%)" });
        });
      });
    });
  };

  const destroy = () => {
    ctx?.revert();
    ctx = null;
  };

  return { init, destroy };
}
