"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "@/lib/motion-controller";

/**
 * M2 — Frame expand + counter-scale. Signature moment 2 of 2 (F4 budget).
 *
 * Spec, from the motion skill's sketch library:
 *   "clip-path: inset() opens while the image scales 1.3→1. Most reusable
 *    behaviour on the site."
 *
 * Tier 1, homepage only. Applied to the Living Work beat.
 *
 * ON clip-path AND THE PER-FRAME RULE
 * -----------------------------------
 * The performance rule is "transform and opacity only" in the per-frame path,
 * and clip-path is neither. It is here because M2's own definition prescribes
 * it — the skill is the source of truth, and this is the behaviour it names.
 * `inset()` is compositor-friendly in current browsers, and the counter-scale
 * (the expensive half) is a plain transform. The banned properties in that
 * rule are width/height/top/left/filter, which force layout or paint; none of
 * those are touched here.
 *
 * No scrub on the media beyond the counter-scale: the image must finish
 * arriving before the copy is read, per the brand note that "motion finishes
 * before reading starts".
 */

/** Scroll span in vh. Matches the wireframe label on Home section 05. */
export const FRAME_EXPAND_SPAN_VH = 100;

/** Start state: image over-scaled so the opening frame reveals more of it. */
const MEDIA_SCALE_FROM = 1.3;

export function createFrameExpand(root: HTMLElement): MotionModule {
  const mm = gsap.matchMedia();

  function init() {
    const frame = root.querySelector<HTMLElement>("[data-frame]");
    const media = root.querySelector<HTMLElement>("[data-frame-media]");
    if (!frame || !media) return;

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          // Runs across the approach, so it has resolved by the time the
          // section is centred and the copy is being read.
          start: "top bottom",
          end: "center center",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        frame,
        { clipPath: "inset(12% 14% 12% 14%)" },
        { clipPath: "inset(0% 0% 0% 0%)" },
        0,
      ).fromTo(media, { scale: MEDIA_SCALE_FROM }, { scale: 1 }, 0);

      return () => {
        tl.kill();
      };
    });

    // X6 — the end state, instantly. Not a slower version of the same thing.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(frame, { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(media, { scale: 1 });
    });
  }

  function destroy() {
    mm.revert();
    ScrollTrigger.refresh();
  }

  return { init, destroy };
}
