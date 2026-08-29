"use client";

import { useEffect, useRef } from "react";
import type { ReactNode, RefObject } from "react";
import { awaitEntry } from "@/lib/motion/route-entry";
import { wireSplitReveal, type SplitMode } from "@/lib/motion/split-text";

/**
 * Split-text reveal for display type. Server pages use it directly — the
 * heading renders complete and real in the server HTML (zero hydration
 * mismatch, readable with JS off), and the split happens in an effect after
 * fonts are ready.
 *
 * gate="entry" is for above-the-fold headings: the reveal waits for the
 * loader (first visit) or the route wipe (navigation) via awaitEntry, so it
 * never plays hidden. Everything below the fold uses the default view gate.
 *
 * Reduced motion: never splits at all — the heading is simply there (X6).
 */
type SplitRevealProps = {
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  mode?: SplitMode;
  gate?: "view" | "entry";
  scrub?: boolean;
  className?: string;
  children: ReactNode;
};

export function SplitReveal({
  as = "h2",
  mode = "lines",
  gate = "view",
  scrub = false,
  className,
  children,
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;
    let ungate: (() => void) | undefined;

    const go = (trigger: "view" | "now") => {
      if (!cancelled) cleanup = wireSplitReveal(el, { mode, scrub, trigger });
    };

    document.fonts.ready.then(() => {
      if (cancelled) return;
      if (gate === "entry") {
        ungate = awaitEntry(() => go("now"));
      } else {
        go("view");
      }
    });

    return () => {
      cancelled = true;
      ungate?.();
      cleanup?.();
    };
  }, [mode, gate, scrub]);

  const Tag = as as "div";
  return (
    <Tag ref={ref as RefObject<HTMLDivElement>} className={className}>
      {children}
    </Tag>
  );
}
