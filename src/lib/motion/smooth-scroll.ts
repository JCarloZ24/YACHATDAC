"use client";

/**
 * Smooth scroll — Lenis, wheel only, scoped to the /v2 segment.
 *
 * WHY LENIS AND NOT SCROLLSMOOTHER
 * --------------------------------
 * ScrollSmoother transforms a content wrapper, inside which `position: fixed`
 * (the Preloader) and `position: sticky` (the contour lab, the aperture
 * lineage) both break. Lenis interpolates the real window scroll position:
 * native scrollbar, native fixed/sticky, and ScrollTrigger reads true
 * positions with no scrollerProxy.
 *
 * THE THREE OBJECTIONS IN globals.css, EACH DODGED
 * ------------------------------------------------
 * globals.css bans CSS `scroll-behavior: smooth` for three recorded reasons.
 * 1. Anchor jumps animate across the whole page — Lenis's `anchors` handling
 *    is short and capped, not distance-proportional.
 * 2. Keyboard paging animates and queues — Lenis leaves keyboard, focus and
 *    programmatic scrolling native and instant; it intercepts wheel only.
 * 3. "The visitor sets the pace" — inertia is now the mandated brand feel
 *    (F7), and touch devices keep fully native scroll: this module is not even
 *    constructed for `(pointer: coarse)`.
 *
 * Reduced motion: never constructed, and torn down live if the preference
 * flips mid-session (X6 — absent, not slowed).
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

let lenis: Lenis | null = null;
let tick: ((time: number) => void) | null = null;

const canSmooth = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches &&
  window.matchMedia("(pointer: fine)").matches;

function build(): void {
  if (lenis || !canSmooth()) return;
  lenis = new Lenis({ lerp: 0.12, anchors: true });
  lenis.on("scroll", ScrollTrigger.update);
  tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  // Lenis drives the frame; GSAP's catch-up jump would fight it.
  gsap.ticker.lagSmoothing(0);
}

function teardown(): void {
  if (tick) gsap.ticker.remove(tick);
  tick = null;
  lenis?.destroy();
  lenis = null;
}

/** Mounted once by the /v2 layout. Returns the destroy for unmount. */
export function createSmoothScroll(): () => void {
  build();
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onChange = () => (media.matches ? teardown() : build());
  media.addEventListener("change", onChange);
  return () => {
    media.removeEventListener("change", onChange);
    teardown();
  };
}

/** The loader holds the page; these wrap lenis so the hold is total. */
export function lockScroll(): void {
  lenis?.stop();
}
export function unlockScroll(): void {
  lenis?.start();
}

/** True while lenis is alive. The deck's hold needs it — only lenis can make
    a scroll stop total; without it the hold degrades gracefully. */
export function smoothScrollActive(): boolean {
  return lenis !== null;
}

/**
 * Instant, force-through-lenis reposition — the hold's clamp. `force` writes
 * lenis's own internal target too, so restarting it after a lock cannot
 * replay stale momentum into the position we just clamped.
 */
export function clampScrollTo(target: number): void {
  if (lenis) {
    lenis.scrollTo(target, { immediate: true, force: true });
  } else {
    window.scrollTo(0, target);
  }
}

/**
 * Programmatic glide to a scroll position — the magnetic seating used by
 * About's seam gates. Goes THROUGH lenis when it is alive, because a tween
 * writing `scrollTop` while lenis interpolates the same value is two hands on
 * one wheel — the recorded reason ScrollTrigger's built-in `snap` was
 * replaced. Falls back to GSAP's ScrollToPlugin on native-scroll surfaces
 * (touch, or lenis torn down). Interruptible: user input takes over.
 */
export function smoothScrollTo(
  target: number,
  duration = 0.7,
  /** Hold the user's wheel until the glide lands — the deck-transition case,
      where a playing slide change is not scrubbable. Lenis-only; the
      fallback tween stays interruptible. */
  lock = false,
  /** Glide even while lenis is stopped (a lockScroll hold) — the hold's own
      settle-back needs to move a page that user input cannot. */
  force = false,
): void {
  if (lenis) {
    lenis.scrollTo(target, {
      duration,
      lock,
      force,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });
  } else {
    gsap.to(window, {
      scrollTo: target,
      duration,
      ease: "power2.out",
      overwrite: "auto",
    });
  }
}

/**
 * Route-change reset. Immediate — a new page starting mid-scroll is a bug,
 * not a transition. Not called on popstate: the browser restores that
 * position itself (see TransitionProvider).
 */
export function scrollToTop(): void {
  if (lenis) {
    lenis.scrollTo(0, { immediate: true, force: true });
  } else {
    window.scrollTo(0, 0);
  }
}
