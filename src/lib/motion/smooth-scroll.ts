"use client";

/**
 * Smooth scroll — Lenis, wheel only, scoped to each opting-in page or segment.
 * SCR-09; motion grammar row "being drawn in". The Record opts in on
 * 2026-09-08 to match Living Work's scroll feel without section animation.
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

/**
 * WHEEL WEIGHT — how far one wheel notch moves the document, as a multiplier.
 *
 * 1 is Lenis's own default and the feel every page shipped with; a page passes
 * something lower to make its scrubbed beats cost more wheel WITHOUT changing a
 * single scroll span, CSS height or measured seam. /about is the first caller
 * (14 September 2026, user direction: the page read too fast and sections went
 * past unread) — see its layout for the reasoning and the number.
 *
 * ⚠ CONSTRUCTION-TIME ONLY. Lenis reads `wheelMultiplier` off the options it was
 * constructed with, and its public `options` type exposes only
 * `duration | easing | prevent | virtualScroll | naiveDimensions` as mutable. A
 * page that wants a different weight therefore needs a NEW instance, which is
 * why `build` compares and rebuilds rather than early-returning on any live one.
 *
 * ⚠ WHEEL ONLY, AND THAT IS THE WHOLE SURFACE. This scales Lenis's virtual
 * scroll and nothing else: keyboard paging stays native (see objection 2 above),
 * touch never constructs Lenis at all, a scrollbar drag is native, and
 * `lenis.scrollTo` glides carry their own duration. About's deck reads raw
 * `deltaY` from a capture-phase listener that runs BEFORE Lenis, so its gate
 * charge is unaffected too — the hold still fires on the same wheel travel.
 */
export const DEFAULT_WHEEL = 1;

export type SmoothScrollConfig = {
  /** Wheel weight; see DEFAULT_WHEEL. Lower is heavier. */
  wheel?: number;
};

/** The weight the LIVE instance was built with, so a route wanting a different
    one can be told apart from a route wanting the one already running. */
let liveWheel = DEFAULT_WHEEL;

/** The mount that currently owns the instance. React can mount the incoming
    route's SmoothScroll before the outgoing route's cleanup runs, and an
    unguarded cleanup then destroys the instance its successor just built. */
let owner: symbol | null = null;

const canSmooth = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches &&
  window.matchMedia("(pointer: fine)").matches;

function build(wheel: number): void {
  if (!canSmooth()) return;
  // A live instance is reused only when it already has the requested weight.
  if (lenis) {
    if (liveWheel === wheel) return;
    teardown();
  }
  lenis = new Lenis({ lerp: 0.12, wheelMultiplier: wheel, anchors: true });
  liveWheel = wheel;
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

/** Mounted by SmoothScroll in the active route. Returns its unmount cleanup. */
export function createSmoothScroll(
  config: SmoothScrollConfig = {},
): () => void {
  const wheel = config.wheel ?? DEFAULT_WHEEL;
  const token = Symbol("smooth-scroll");
  owner = token;
  build(wheel);
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onChange = () => (media.matches ? teardown() : build(wheel));
  media.addEventListener("change", onChange);
  return () => {
    media.removeEventListener("change", onChange);
    // Someone else owns the instance now — they built it, they tear it down.
    if (owner !== token) return;
    owner = null;
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

/** A rebuilt pin changes document height immediately. Refresh Lenis's
 * cached limit before restoring a reading position; its observer normally
 * catches up later, which would clamp a mobile rebuild to the desktop end.
 * Our People's single canvas calls this only when its geometry changes.
 */
export function refreshScrollBounds(): void {
  lenis?.resize();
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
  /** Called after the magnetic seat lands. Optional so existing callers keep
      their current fire-and-forget behaviour. */
  onComplete?: () => void,
): void {
  if (lenis) {
    lenis.scrollTo(target, {
      duration,
      lock,
      force,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      onComplete,
    });
  } else {
    gsap.to(window, {
      scrollTo: target,
      duration,
      ease: "power2.out",
      overwrite: "auto",
      onComplete,
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
