"use client";

import { useEffect, useRef } from "react";

/**
 * Mouse drag for a `CardRail` scroller — and ONLY mouse.
 *
 * User direction, 17 September 2026 ("i can't do drag action on these cards
 * on Open research, Get involved"): the rails were native touch scrolling
 * and scroll-snap alone, which is right on a phone and does nothing under
 * a mouse in a narrow desktop window — the case a reviewer sits in when
 * they resize a browser to 375 instead of picking up a phone. Pressing on a
 * card and pulling did nothing, and a swipe row that will not swipe reads
 * as broken.
 *
 * WHAT THIS IS NOT. It is not the mechanism: the rail scrolls and snaps
 * with this component absent or JS off exactly as it did before (see
 * CardRail's own note). It renders nothing, attaches to its parent scroller
 * on mount, and listens for `pointerType === "mouse"` only — touch and pen
 * keep the browser's native pan, which is better than anything scripted
 * and which `touch-action` must never be taken from (CardRail: "NOT
 * `touch-pan-y`"). It is not GSAP Draggable either; RangerCarousel owns
 * that for a reason, and this is one scroll property written on move.
 *
 * Scroll-snap is switched off for the length of the drag and restored on
 * release, otherwise `snap-mandatory` fights every pointer move and the row
 * judders. A drag past `SLOP` px swallows the click that follows it, so a
 * card that is a link is not followed at the end of a pull.
 */
const SLOP = 6;

export function RailDrag() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const rail = ref.current?.parentElement;
    if (!rail) return;

    let down = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      // Nothing to drag when the rail is the desktop grid.
      if (rail.scrollWidth <= rail.clientWidth) return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = rail.scrollLeft;
      rail.style.scrollSnapType = "none";
      rail.style.cursor = "grabbing";
      rail.style.userSelect = "none";
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > SLOP) {
        moved = true;
        rail.setPointerCapture(e.pointerId);
      }
      if (moved) rail.scrollLeft = startLeft - dx;
    };
    const onUp = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      rail.style.cursor = "";
      rail.style.userSelect = "";
      if (rail.hasPointerCapture(e.pointerId)) rail.releasePointerCapture(e.pointerId);
      // Restoring snap after the frame lets the browser settle the row on
      // the nearest card instead of the pixel the mouse let go at.
      requestAnimationFrame(() => {
        rail.style.scrollSnapType = "";
      });
    };
    const onClick = (e: MouseEvent) => {
      if (!moved) return;
      moved = false;
      e.preventDefault();
      e.stopPropagation();
    };

    rail.addEventListener("pointerdown", onDown);
    rail.addEventListener("pointermove", onMove);
    rail.addEventListener("pointerup", onUp);
    rail.addEventListener("pointercancel", onUp);
    rail.addEventListener("click", onClick, true);
    return () => {
      rail.removeEventListener("pointerdown", onDown);
      rail.removeEventListener("pointermove", onMove);
      rail.removeEventListener("pointerup", onUp);
      rail.removeEventListener("pointercancel", onUp);
      rail.removeEventListener("click", onClick, true);
      rail.style.scrollSnapType = "";
      rail.style.cursor = "";
      rail.style.userSelect = "";
    };
  }, []);

  return <span ref={ref} hidden aria-hidden />;
}
