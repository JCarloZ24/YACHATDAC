"use client";

import { useRef } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * The nav's gold water fill, as a hook, so anything in the band can wear it —
 * not only the five `WaterNavLink`s.
 *
 * ⚠ EXTRACTED BECAUSE "ABOUT" LOOKED BOLDER THAN ITS NEIGHBOURS (August,
 * 11 September 2026: "remove the bold text for ABOUT on nav bar"). Every nav
 * item is already the same face at the same weight — `.eyebrow`, Bantayog
 * Sans ExtraBold — so nothing was setting About heavier. The difference was
 * how the glyphs are PAINTED. The `water-fill` utility sets
 * `-webkit-text-fill-color: transparent` and clips a gradient to the text,
 * and text painted through a background loses subpixel antialiasing: the five
 * links render greyscale and therefore slightly lighter, while About — a
 * plain `<button>` with a solid colour — kept subpixel AA and rendered a
 * touch heavier. One item out of six on a different rasterisation path reads
 * as a weight change, because at 16px that is the only thing weight is.
 *
 * The fix is to put About on the same path rather than to nudge a font
 * weight, which would have left the two rasterisations still disagreeing at
 * some sizes and on some displays. It also means About finally gets the same
 * hover as the rest of the nav instead of a hard `hover:text-gold` switch.
 *
 * The painting lives in the `water-fill` utility in globals.css; this only
 * moves the three custom properties it reads. See WaterNavLink for why the
 * blob's roughened waterline does not come across with it.
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

export function useWaterFill<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();

  /** Pointer position within the painted element, in CSS px from its top-left. */
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

  /**
   * Spread onto the element that RECEIVES the pointer, which is not always
   * the element being painted: About's trigger is a button holding a label
   * and a chevron, and only the label is painted. `toLocal` measures the
   * painted box either way, so a pointer entering over the chevron simply
   * starts the fill from beyond the word's edge — which is where it is.
   */
  const handlers = {
    onPointerEnter: (event: React.PointerEvent) => {
      const p = toLocal(event);
      if (p) fillFrom(p.x, p.y, p.w, p.h);
    },
    onPointerLeave: (event: React.PointerEvent) => {
      const p = toLocal(event);
      if (p) drainTo(p.x, p.y);
    },
    onFocus: () => fromCentre(),
    onBlur: () => fromCentre(true),
  };

  return { ref, handlers };
}
