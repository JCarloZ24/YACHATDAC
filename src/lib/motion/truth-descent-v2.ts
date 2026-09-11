"use client";

/**
 * /v2/truth — additions on top of the descent.
 *
 * The base descent module owns section grounds, the rail, headings, arrivals
 * and Wave / Divider hand-offs. This file owns image-plane and scene-specific
 * treatments that sit on top of that common scroll clock.
 *
 *   [data-v2-hero-media]   the hero photograph — held through its read gate
 *   [data-v2-camera]       ordinary image frames — M1 1.00→1.06 push-in,
 *                          scrubbed; frame-grade and held scenes stay still
 *   [data-v2-steps-fill]   the record strand's ochre fill — clipped open
 *                          linearly with document scroll, trailing it on a
 *                          heavy scrub (scroll-derived; the lag is the only
 *                          easing, and it settles to the true position)
 * The gated-deck module owns the G1 rail traveller and the navbar exit. This
 * module keeps the chronology fill and scene-interior media treatments only.
 *
 * Suzanne's testimony itself carries NO motion attributes. That stillness is
 * the doctrine's stated exception (F7 rule 1): the reader is being read to.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "@/lib/motion-controller";
import { registerYachatdacEffects } from "@/lib/motion/effects";
import { SCRUB } from "@/lib/motion/tokens";
import { Y2_DIM } from "@/lib/sections/y2";

gsap.registerPlugin(ScrollTrigger);

export function createTruthDescentV2(): MotionModule {
  let ctx: gsap.Context | null = null;

  const init = () => {
    registerYachatdacEffects();

    ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const localCleanup: Array<() => void> = [];
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
            // Tween a number, not the clip-path string: the browser
            // re-serialises `inset(0% 0% X% 0%)` as `inset(0% 0% X%)` (and
            // `inset(0%)` at rest), so when GSAP re-read the layer on a
            // refresh the value counts no longer matched and the
            // interpolation ran off — a 489% bottom inset mid-descent, the
            // strand gone. The proxy's start is re-evaluated on refresh.
            const startBottom = () =>
              Math.max(
                0,
                100 -
                  ((headStart * window.innerHeight) / root.offsetHeight) * 100,
              );
            const proxy = { bottom: startBottom() };
            const paint = () => {
              layer.style.clipPath = `inset(0% 0% ${proxy.bottom.toFixed(3)}% 0%)`;
            };
            paint();
            gsap.fromTo(
              proxy,
              { bottom: startBottom },
              {
                bottom: 0,
                ease: "none",
                immediateRender: true,
                onUpdate: paint,
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
          // The record strand's colour drops behind the scroll on purpose
          // (2026-09-03): a heavy scrub, so the ochre trails the reader
          // down the dots and catches up when they pause. Still scroll-
          // derived, still both directions. The tip aims at the 0.6vh
          // reading line, arriving there once the lag settles.
          wireFill("[data-v2-steps-fill]", SCRUB.heavy * 1.5, 0.6);

        }

        // THE FLOW PATH ONLY — everything from here to the Y2 words below is
        // authored against the viewport, which is correct exactly when nothing
        // is pinned: touch, under 1024px, or no Lenis. On a deck the same
        // spans are consumed behind the covering slide, so truth-scenes.ts
        // rebuilds them against each slide's reading clock instead. The two
        // must not both run, or every plane gets two competing scrubs.
        const onDeck = Boolean(root?.dataset.deckActive);

        // M1 / being drawn in. Every ordinary movable image plane pushes
        // 1.00→1.06 over its frame's viewport travel. The marker sits on the
        // frame or group; `pushIn` filters any plane beneath frame-grade media.
        gsap.utils
          .toArray<HTMLElement>(
            onDeck ? [] : "[data-v2-plate], [data-v2-camera]",
          )
          .forEach((frame) => {
            if (frame.closest("[data-v2-static]")) return;
            const planes = frame.querySelectorAll<HTMLElement>("[data-media-plane]");
            if (!planes.length) return;
            const timeline = gsap.timeline({ paused: true });
            timeline.pushIn(planes, {
              scale: 1.06,
              y: "0%",
              duration: 1,
              ease: "none",
            });
            ScrollTrigger.create({
              trigger: frame,
              start: "top bottom",
              end: "bottom top",
              scrub: SCRUB.light,
              animation: timeline,
            });
          });

        // 08 · BREAK Country Now — shot A dissolves 1 → 0 over the break's
        // own travel, revealing shot B beneath it. Opacity only: nothing
        // scales during a dissolve (P9). The attribute is absent while shot A
        // is undelivered, so the delivered photograph simply holds.
        //
        // This is the OFF-DECK path — below lg, on touch, wherever the deck
        // stands down — and it drives the attribute rather than a section, so
        // it needs no change when a break gains or loses its pair. §14 carried
        // the only other one until its photographs were withdrawn on
        // 11 September 2026.
        gsap.utils
          .toArray<HTMLElement>(onDeck ? [] : "[data-v2-dissolve]")
          .forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 1 },
            {
              opacity: 0,
              ease: "none",
              immediateRender: true,
              scrollTrigger: {
                trigger: el,
                start: "top 60%",
                end: "bottom 40%",
                scrub: SCRUB.normal,
              },
            },
          );
        });

        // Y2 — testimony beside the portrait. Per-word opacity ramp from the
        // 0.28 dim state, no movement. The dim state is applied here, not in
        // markup, so reduced motion and no-JS read the words at full.
        gsap.utils
          .toArray<HTMLElement>(onDeck ? [] : "[data-y2]")
          .forEach((block) => {
          const words = block.querySelectorAll<HTMLElement>("[data-y2-word]");
          if (!words.length) return;
          gsap.fromTo(
            words,
            { opacity: Y2_DIM },
            {
              opacity: 1,
              ease: "none",
              stagger: { each: 0.04 },
              scrollTrigger: {
                trigger: block,
                start: "top 85%",
                end: "top 40%",
                scrub: SCRUB.normal,
              },
            },
          );
        });

        // The cue's brightness pulse (CSS) dies on the first scroll, for good.
        const cue = document.querySelector<HTMLElement>("[data-hero-cue]");
        if (cue) {
          const stopCue = () => {
            cue.style.animation = "none";
          };
          window.addEventListener(
            "scroll",
            stopCue,
            { once: true, passive: true },
          );
          localCleanup.push(() => window.removeEventListener("scroll", stopCue));
        }

        return () => localCleanup.forEach((cleanup) => cleanup());
      });

      // Reduced motion: the trail shows the whole record, statically open —
      // its resting markup clips it shut, which would read as "no progress".
      // Everything else's resting markup IS the final state, and the base
      // descent module handles ground/rail snapping.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        ["[data-v2-steps-fill]"].forEach((selector) => {
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
