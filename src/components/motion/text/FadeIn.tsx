"use client";

import { useEffect, useRef } from "react";
import type { ReactNode, RefObject } from "react";
import gsap from "gsap";
import { awaitEntry } from "@/lib/motion/route-entry";
import { DUR, EASE } from "@/lib/motion/tokens";

/**
 * A plain fade-in for copy that should arrive rather than perform.
 *
 * The quiet sibling of `SplitReveal`. Same gating, same tokens — it just does
 * not split: the element fades up as one piece, which is what a lede or an
 * eyebrow wants. Split a short eyebrow by line and you get a mask around a
 * single line, which is a lot of machinery for no visible difference.
 *
 * gate="entry" is for above-the-fold copy: the fade waits for the X1 loader on
 * a first visit, or the route wipe on a navigation, so it never plays behind a
 * cover. Below the fold, the default view gate fires on scroll.
 *
 * `delay` is what lets several of these read as a sequence against ONE gate —
 * eyebrow, then headline, then lede — instead of three things starting at
 * once.
 *
 * The server renders the real element with its real text, so with JavaScript
 * off, or under reduced motion, the copy is simply there. That is the same
 * property the rest of the page relies on: markup IS the final state.
 */
type FadeInProps = {
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  gate?: "view" | "entry";
  /** Seconds to hold before starting — for sequencing a stack. */
  delay?: number;
  /** How far it rises as it fades. Small: this is arrival, not entrance. */
  y?: number;
  className?: string;
  children: ReactNode;
};

export function FadeIn({
  as = "p",
  gate = "view",
  delay = 0,
  y = 14,
  className,
  children,
}: FadeInProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // X6 — reduced motion never animates copy in. It is already there.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let tween: gsap.core.Tween | undefined;
    let ungate: (() => void) | undefined;

    const play = (fromView: boolean) => {
      if (cancelled) return;
      tween = gsap.from(el, {
        autoAlpha: 0,
        y,
        duration: DUR.large,
        ease: EASE.country,
        delay,
        ...(fromView
          ? { scrollTrigger: { trigger: el, start: "top 85%", once: true } }
          : {}),
      });
    };

    // Fonts first: fading in copy that then reflows onto a different face is
    // worse than not fading it at all.
    void document.fonts?.ready.then(() => {
      if (cancelled) return;
      if (gate === "entry") ungate = awaitEntry(() => play(false));
      else play(true);
    });

    return () => {
      cancelled = true;
      ungate?.();
      tween?.scrollTrigger?.kill();
      tween?.kill();
      gsap.set(el, { clearProps: "opacity,visibility,transform" });
    };
  }, [gate, delay, y]);

  const Tag = as as "div";
  return (
    <Tag ref={ref as RefObject<HTMLDivElement>} className={className}>
      {children}
    </Tag>
  );
}
