"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Tier 2 motion primitives.
 *
 * Source of truth for all motion on this project is the `yachatdac-motion`
 * skill (.claude/skills/yachatdac-motion/). Read it before writing animation
 * code, not after. This file implements only the Tier 2 vocabulary:
 *
 *   X4  entry stagger  — start "top 82%", once, y16 + fade, 60ms stagger
 *   X6  reduced-motion twin — same code path, zero duration, nothing pinned
 *
 * Tier 1 behaviour (pinning, scrubbing, parallax, WebGL, signature moments) is
 * homepage-only, is built with GSAP + ScrollTrigger from the skill's templates
 * in `assets/`, and must register with the motion controller in
 * `src/lib/motion-controller.ts`. Do not grow this file into that — a CMS
 * template must not be able to reach Tier 1 motion.
 */

/* -------------------------------------------------------------------------
   Reduced motion
   ------------------------------------------------------------------------- */

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Tracks the reduced-motion preference, and keeps tracking it — people change
 * this setting mid-session and the page should respond without a reload.
 *
 * The server snapshot is `true`, so the first paint is always the safe one:
 * content visible, nothing animating.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => true,
  );
}

/* -------------------------------------------------------------------------
   X4 — entry stagger
   ------------------------------------------------------------------------- */

/**
 * ScrollTrigger's `start: "top 82%"` expressed as an IntersectionObserver
 * root margin: fire when the element's top crosses 82% of the viewport.
 */
const ENTRY_ROOT_MARGIN = "0px 0px -18% 0px";

/**
 * Fires once when the element first enters the viewport.
 *
 * One-way by design (`once: true` in the skill's spec): sections do not
 * re-hide when scrolled past. Re-triggering on scroll-up reads as flicker.
 */
export function useInView<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  { rootMargin = ENTRY_ROOT_MARGIN }: { rootMargin?: string } = {},
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // No IntersectionObserver (ancient browser, some test environments).
    // Show the content rather than stranding it hidden. Deferred to a
    // microtask so this is not a synchronous setState inside the effect.
    if (typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setInView(true));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { rootMargin, threshold: 0.05 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
}

/* -------------------------------------------------------------------------
   Page scroll progress
   ------------------------------------------------------------------------- */

/**
 * Scroll progress through the document, 0 → 1.
 *
 * rAF-throttled, passive listeners. Used by the homepage progress rule; see
 * ThreadLine for why that rule is a plain vertical line and not a path.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const measure = () => {
      frameRef.current = 0;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0);
    };

    const schedule = () => {
      if (frameRef.current) return;
      frameRef.current = window.requestAnimationFrame(measure);
    };

    // Initial read is scheduled, not synchronous — the page may be restored
    // mid-scroll, and this keeps setState out of the effect body.
    schedule();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return progress;
}
