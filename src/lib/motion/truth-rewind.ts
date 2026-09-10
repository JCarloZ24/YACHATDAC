"use client";

/**
 * Truth — the rewind cue.
 *
 * Grammar row: "the guide leading the eye", Truth's rewind cue
 * (docs/motion/motion-grammar.md, user direction 11 September 2026).
 *
 * The hero's "Start from the beginning ↓" points at `#beginning`, and an
 * anchor is the right thing for it to be: it works with no JavaScript, it is
 * what the v3 draft writes, and on the deck the browser's jump is absorbed by
 * the shared wheel inertia. On a phone there is no deck and no inertia, so the
 * same press teleported the reader nineteen thousand pixels with no account of
 * what was crossed — the page's whole argument is that this Country has depth
 * in time, and the button skipped it (user, 11 September 2026).
 *
 * So below `lg` the press becomes travel. One fast pass down the descent, and
 * it lands on the Wattanuri floor rather than on `#beginning`: the floor is
 * where the page says the beginning actually is ("Lore is not a date. It is
 * the floor everything above has been resting on"), and it is the screen the
 * reader is asked to start reading upward from.
 *
 * WHY THIS IS A MODULE AND NOT AN EFFECT. Effects are pure builders that know
 * nothing about scroll (see effects/index.ts). This is scroll wiring and a
 * pointer listener, which is exactly what the file says belongs in a module.
 * The one thing that IS an effect here — the arrow's own entrance — is the
 * registered `arrive`.
 *
 * Desktop is untouched: the media query never matches, no listener is bound,
 * and the anchor does what it has always done.
 */

import gsap from "gsap";
import type { MotionModule } from "@/lib/motion-controller";
import { prefersReduced } from "@/lib/motion-controller";
import { registerYachatdacEffects } from "@/lib/motion/effects";
import { clampScrollTo, smoothScrollTo } from "@/lib/motion/smooth-scroll";

/** The cue in the hero. Carries its own anchor for the no-JS path. */
const CUE = "[data-truth-rewind]";
/** The band the travel lands on — the Wattanuri floor. */
const TARGET = "[data-truth-rewind-target]";
/** The arrow at the head of that band. */
const HINT = "[data-truth-rewind-hint]";

/**
 * 1.15s for the whole descent. Fast enough to read as being carried rather
 * than as a scroll the reader is waiting out, slow enough that the eras go
 * past as eras. The easing is the shared glide's own cubic ease-out
 * (`smoothScrollTo`) — it leaves the hero at speed and settles onto the floor
 * rather than slamming into it — and it stays interruptible, so a reader who
 * changes their mind halfway takes the page back.
 */
const TRAVEL_SECONDS = 1.15;

/** The arrow clears itself. Eight seconds, or the reader's own first scroll. */
const HINT_SECONDS = 8;

export function createTruthRewind(): MotionModule {
  let ctx: gsap.Context | null = null;

  const init = () => {
    const cue = document.querySelector<HTMLAnchorElement>(CUE);
    const target = document.querySelector<HTMLElement>(TARGET);
    if (!cue || !target) return;
    registerYachatdacEffects();

    ctx = gsap.context(() => {
      const media = gsap.matchMedia();
      /* The deck's own gate is `(pointer: fine) and (min-width: 1024px)`. This
         is its complement by width alone: a narrow window on a laptop is still
         the layout being fixed here, and a reader who has resized to it should
         get the behaviour that layout was built for. */
      media.add("(max-width: 1023px)", () => {
        const hint = document.querySelector<HTMLElement>(HINT);
        let clear: number | undefined;

        const hideHint = () => {
          window.clearTimeout(clear);
          window.removeEventListener("wheel", onReaderScroll);
          window.removeEventListener("touchmove", onReaderScroll);
          if (!hint) return;
          hint.dataset.state = "off";
          if (prefersReduced()) {
            gsap.set(hint, { opacity: 0 });
            return;
          }
          gsap.to(hint, { opacity: 0, duration: 0.4, ease: "power2.out" });
        };

        function onReaderScroll() {
          hideHint();
        }

        const showHint = () => {
          if (!hint) return;
          hint.dataset.state = "on";
          /* `arrive` is a `from` tween, so it animates out of opacity 0 into
             whatever the element is currently at — which, with the resting
             `opacity-0` class, is nothing at all. Seat it visible first and
             the effect plays as written. */
          gsap.set(hint, { opacity: 1, y: 0 });
          if (!prefersReduced()) gsap.effects.arrive(hint);
          /* Armed a beat late: the travel's own settle would otherwise be read
             as the reader scrolling and clear the arrow on arrival. */
          window.setTimeout(() => {
            window.addEventListener("wheel", onReaderScroll, { passive: true });
            window.addEventListener("touchmove", onReaderScroll, {
              passive: true,
            });
          }, 400);
          clear = window.setTimeout(hideHint, HINT_SECONDS * 1000);
        };

        const onPress = (event: MouseEvent) => {
          /* Leave every modified press to the browser — a reader opening the
             beginning in a new tab is asking for the anchor, not the journey. */
          if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          ) {
            return;
          }
          event.preventDefault();
          /* And stop it here. `preventDefault` alone is not enough: the shared
             wheel inertia is built with lenis's `anchors: true`, whose own
             document-level handler does not consult `defaultPrevented` — it
             read the href, started a second glide to `#beginning`, and
             replaced this one mid-flight, so the reader landed on the seabed
             and the arrow never seated (measured 11 September 2026). */
          event.stopPropagation();

          const top =
            target.getBoundingClientRect().top + window.scrollY;
          /* Never past the document's own end, or the landing overshoots and
             the arrow is already off the top of the screen when it arrives. */
          const seat = Math.min(
            top,
            document.documentElement.scrollHeight - window.innerHeight,
          );

          /* preventDefault costs the anchor's own focus move, and a reader
             on a keyboard or a screen reader has otherwise been silently
             relocated. Seat focus on the landing band instead — `preventScroll`
             because the travel has already put it on screen. */
          const land = () => {
            target.focus({ preventScroll: true });
            showHint();
          };

          if (prefersReduced()) {
            /* X6 — absent, not slowed. The reader still arrives, and still
               gets told which way to read. */
            clampScrollTo(seat);
            land();
            return;
          }
          smoothScrollTo(seat, TRAVEL_SECONDS, false, false, land);
        };

        cue.addEventListener("click", onPress);
        return () => {
          cue.removeEventListener("click", onPress);
          hideHint();
        };
      });
    });
  };

  const destroy = () => {
    ctx?.revert();
    ctx = null;
  };

  return { init, destroy };
}
