"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * A nav link that fills with gold from the point the cursor entered it —
 * the CONNECT blob's hover, carried onto the words (10 September 2026, user
 * direction: "do the same animation on connect button to nav bar text").
 *
 * The gesture is the blob's, beat for beat: the fill spreads from the entry
 * point, keyboard focus runs it from the centre, and leaving drains it back
 * toward the exit point — so a cursor crossing a link left-to-right pulls the
 * gold across and lets it fall away behind. Same gold, same durations, same
 * eases as `ConnectButton`, because it has to read as one behaviour and not
 * two that happen to share a colour.
 *
 * What does NOT carry across is the roughened waterline. On the blob that is
 * an SVG displacement filter on the fill layer; a CSS filter applies to the
 * whole element before its background is clipped to the text, so the same
 * trick here would ripple the letterforms rather than the edge. See the
 * `water-fill` utility in globals.css. The glyphs do the ragged edge instead.
 *
 * The painting is all in that utility. This component only moves three custom
 * properties, which is why it can stay a thin wrapper around `Link` and leave
 * the type, colour and layout classes to the call site.
 */

/** Fill and drain, matching ConnectButton's. */
const FILL = 0.65;
const DRAIN = 0.5;

/** Distance from a point to the farthest corner of a w×h box — the radius at
 *  which the fill has covered the whole word from that entry point. */
function coverRadius(w: number, h: number, x: number, y: number) {
  return Math.max(
    Math.hypot(x, y),
    Math.hypot(w - x, y),
    Math.hypot(x, h - y),
    Math.hypot(w - x, h - y),
  );
}

export function WaterNavLink({
  href,
  className = "",
  children,
  ...rest
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = usePrefersReducedMotion();

  /** Pointer position within the link, in CSS px from its top-left. */
  const toLocal = (event: React.PointerEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      w: rect.width,
      h: rect.height,
    };
  };

  const fillFrom = (x: number, y: number, w: number, h: number) => {
    const el = ref.current;
    if (!el) return;
    gsap.killTweensOf(el);
    gsap.set(el, { "--water-x": `${x}px`, "--water-y": `${y}px` });
    const cover = coverRadius(w, h, x, y);
    if (reduced) {
      gsap.set(el, { "--water-r": `${cover}px` });
      return;
    }
    gsap.to(el, { "--water-r": `${cover}px`, duration: FILL, ease: "power2.out" });
  };

  const drainTo = (x: number, y: number) => {
    const el = ref.current;
    if (!el) return;
    gsap.killTweensOf(el);
    if (reduced) {
      gsap.set(el, { "--water-r": "0px" });
      return;
    }
    gsap.to(el, {
      "--water-x": `${x}px`,
      "--water-y": `${y}px`,
      "--water-r": "0px",
      duration: DRAIN,
      ease: "power2.in",
    });
  };

  /** Focus has no coordinates, so it runs from the middle of the word. */
  const fromCentre = (out = false) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = rect.width / 2;
    const y = rect.height / 2;
    if (out) drainTo(x, y);
    else fillFrom(x, y, rect.width, rect.height);
  };

  return (
    <Link
      ref={ref}
      href={href}
      className={`water-fill ${className}`}
      onPointerEnter={(event) => {
        const p = toLocal(event);
        if (p) fillFrom(p.x, p.y, p.w, p.h);
      }}
      onPointerLeave={(event) => {
        const p = toLocal(event);
        if (p) drainTo(p.x, p.y);
      }}
      onFocus={() => fromCentre()}
      onBlur={() => fromCentre(true)}
      {...rest}
    >
      {children}
    </Link>
  );
}
