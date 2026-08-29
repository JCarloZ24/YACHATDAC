"use client";

/**
 * A5 — The Recall. Home hero, proposal 1 (Ivy's direction: "the site opens
 * are blur motion like giving an illusion of going back to the past").
 *
 * The opening arrives from deep time: the frame starts out of focus under a
 * charcoal wash, the era colours return in sequence — charcoal, navy,
 * roasted, evergreen, the Truth ladder run upward — and focus lands on the
 * present-day statement. The journey Truth will take the visitor down, run
 * backwards in two and a half seconds.
 *
 * HOW THE BLUR MOVES WITHOUT ANIMATING FILTER
 * -------------------------------------------
 * Per-frame `filter` is banned (SKILL.md §1). So the rack focus is three
 * plates of the same photograph at fixed blur levels — deep, mid, sharp —
 * cross-faded by opacity. Each plate's blur is static CSS rendered once; the
 * per-frame path touches transform and opacity only. Same trick as the
 * sky-clock's colour ramps and the descent's grounds.
 *
 * MARKUP CONTRACT
 * ---------------
 *   [data-recall-root]              the hero section
 *   [data-recall-plate="deep|mid|sharp"]   stacked plates, deep on top at rest
 *   [data-recall-tint="charcoal|navy|roasted|evergreen"]   colour washes
 *   [data-recall-title]             the headline block
 *   [data-recall-cue]               the scroll cue (killed on first scroll, X2)
 *
 * ▲ ARTWORK — no artwork plate is used. If one ever is, that is artwork
 * motion and goes on the permissions sign-off queue first.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "@/lib/motion-controller";
import { awaitEntry } from "@/lib/motion/route-entry";

gsap.registerPlugin(ScrollTrigger);

const EASE_COUNTRY = "expo.out";

export function createRecall(): MotionModule {
  let ctx: gsap.Context | null = null;
  let ungate: (() => void) | undefined;

  const init = () => {
    const root = document.querySelector<HTMLElement>("[data-recall-root]");
    if (!root) return;

    const plate = (name: string) =>
      root.querySelector<HTMLElement>(`[data-recall-plate="${name}"]`);
    const tint = (name: string) =>
      root.querySelector<HTMLElement>(`[data-recall-tint="${name}"]`);

    const deep = plate("deep");
    const mid = plate("mid");
    const sharp = plate("sharp");
    const title = root.querySelector<HTMLElement>("[data-recall-title]");
    const cue = root.querySelector<HTMLElement>("[data-recall-cue]");

    ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        // The finished frame, immediately. Absent, not slowed (X6).
        gsap.set([deep, mid], { opacity: 0 });
        gsap.set(sharp, { opacity: 1, scale: 1 });
        gsap.set(
          ["charcoal", "navy", "roasted", "evergreen"].map(tint),
          { opacity: 0 },
        );
        gsap.set(title, { opacity: 1, y: 0 });
        gsap.set(cue, { opacity: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Rest state: deep past. Out of focus, under charcoal.
        gsap.set(deep, { opacity: 1, scale: 1.06 });
        gsap.set([mid, sharp], { opacity: 0, scale: 1.06 });
        gsap.set(tint("charcoal"), { opacity: 0.9 });
        gsap.set(["navy", "roasted", "evergreen"].map(tint), { opacity: 0 });
        gsap.set(title, { opacity: 0, y: 28 });
        gsap.set(cue, { opacity: 0 });

        const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });

        // The eras return, oldest ground first — deep time up to today.
        tl.to(tint("navy"), { opacity: 0.85, duration: 0.3 }, 0.15)
          .to(tint("charcoal"), { opacity: 0, duration: 0.3 }, 0.35)
          .to(tint("roasted"), { opacity: 0.85, duration: 0.3 }, 0.5)
          .to(tint("navy"), { opacity: 0, duration: 0.3 }, 0.7)
          .to(tint("evergreen"), { opacity: 0.8, duration: 0.3 }, 0.85)
          .to(tint("roasted"), { opacity: 0, duration: 0.3 }, 1.05)
          .to(tint("evergreen"), { opacity: 0, duration: 0.5 }, 1.25)
          // Rack focus: deep → mid → sharp, and the frame settles.
          .to(mid, { opacity: 1, duration: 0.4 }, 0.9)
          .to(deep, { opacity: 0, duration: 0.4 }, 0.95)
          .to(sharp, { opacity: 1, duration: 0.5 }, 1.25)
          .to(mid, { opacity: 0, duration: 0.5 }, 1.3)
          .to(
            sharp,
            { scale: 1, duration: 0.82, ease: EASE_COUNTRY },
            1.25,
          )
          // Focus lands on today: the statement settles.
          .to(
            title,
            { opacity: 1, y: 0, duration: 0.82, ease: EASE_COUNTRY },
            1.7,
          )
          .to(cue, { opacity: 1, duration: 0.55 }, 2.3);

        // First visit: after the loader. Navigation: after the wipe.
        ungate = awaitEntry(() => tl.play());

        // Leaving the hero: gentle push-in, title drifts ahead (M1 lineage).
        gsap.to(sharp, {
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
        gsap.to(title, {
          yPercent: -22,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });

        // X2 — the cue dies permanently on first scroll.
        ScrollTrigger.create({
          trigger: root,
          start: "2px top",
          once: true,
          onEnter: () => {
            gsap.to(cue, { opacity: 0, duration: 0.32 });
          },
        });

        return () => tl.kill();
      });
    }, root);
  };

  const destroy = () => {
    ungate?.();
    ungate = undefined;
    ctx?.revert();
    ctx = null;
  };

  return { init, destroy };
}
