"use client";

import { useRef, type ReactNode } from "react";
import { useInView, usePrefersReducedMotion } from "@/lib/motion";

/** Stagger step between siblings. Fixed by the motion skill's token set. */
export const STAGGER_STEP_MS = 60;

type RevealProps = {
  children: ReactNode;
  /**
   * Position in a staggered group. Multiplied by the 60ms step — pass an
   * index rather than a hand-tuned millisecond value so groups stay in sync.
   */
  index?: number;
  className?: string;
};

/**
 * X4 — entry stagger. The Tier 2 default; CMS pages inherit it.
 *
 * Fade + 16px translate-up on first entry, once, `country` easing at medium
 * duration. Does not re-trigger on scroll-up.
 *
 * X6 — reduced-motion twin: same markup, no transition, no transform. It cuts
 * to the final state rather than playing a gentler version, because a slowed
 * animation is still an animation.
 */
export function Reveal({ children, index = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-(--dur-medium) ease-country ${
        inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${index * STAGGER_STEP_MS}ms` }}
    >
      {children}
    </div>
  );
}
