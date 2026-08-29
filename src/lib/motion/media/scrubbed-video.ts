"use client";

/**
 * M6 — scroll-scrubbed video. TS port of the skill template
 * (assets/image-sequence.js, createScrubbedVideo).
 *
 * Footage contract from the sketch library: 1s keyframe interval, ≤12s,
 * ≤1080p, muted, playsinline, poster. Never tween currentTime directly —
 * the proxy is assigned in onUpdate.
 *
 * No footage meeting the contract exists in the repo yet (R11); this module
 * ships so the /v2 pages that get footage can scrub it without new plumbing.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "@/lib/motion-controller";

gsap.registerPlugin(ScrollTrigger);

export function createScrubbedVideo(
  getRoot: () => HTMLElement | null,
): MotionModule {
  const proxy = { t: 0 };
  let mm: gsap.MatchMedia | null = null;

  const init = () => {
    const root = getRoot();
    const video = root?.querySelector("video");
    if (!root || !video) return;

    // iOS needs all three or it refuses to decode inline.
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.to(proxy, {
        t: () => video.duration || 0,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          scrub: 0.4,
          start: "top bottom",
          end: "bottom top",
        },
        onUpdate: () => {
          if (video.readyState >= 2) video.currentTime = proxy.t;
        },
      });
      return () => tween.kill();
    });

    // Poster frame, full stop.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      video.removeAttribute("src");
      video.load();
    });
  };

  const destroy = () => {
    mm?.revert();
    mm = null;
  };

  return { init, destroy };
}
