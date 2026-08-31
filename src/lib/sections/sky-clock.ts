"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "@/lib/motion-controller";
import { Y2_DIM } from "@/lib/sections/y2";

/**
 * A2 — Sky coupled to content. Signature moment 1 of 2 (F4 budget).
 *
 * Spec, from the motion skill's sketch library:
 *   "Same ramp, but narrative beats advance on the same clock. Pinned, ~250vh,
 *    three beats at 0 / .33 / .66 with overlapping fades."
 *
 * Tier 1, homepage only. A CMS template must never be able to reach this.
 *
 * WHY THE SKY IS STACKED LAYERS AND NOT AN ANIMATED backgroundColor
 * ------------------------------------------------------------------
 * The obvious implementation tweens `backgroundColor` across the scrub. That
 * would put a paint property in the per-frame path, which the skill forbids:
 * "Per-frame work touches transform and opacity only." So the ramp is three
 * solid fields stacked on top of each other, cross-faded by opacity. Same
 * result on screen, and the compositor does the work.
 *
 * Solid fields rather than gradients is also the briefing decision recorded in
 * docs/design/README.md — the imagery is strong enough without gradient
 * overlays.
 *
 * REDUCED MOTION
 * --------------
 * Nothing here is created at all. The React component renders a different tree
 * (see SkyClock.tsx) in which the three beats are ordinary stacked sections at
 * their own tone, in document flow. Pins are never built, per X6 and the
 * accessibility hard rule — not slowed, not gentled, absent.
 */

/**
 * Scroll span in vh. The wireframe labels this section 250vh and the token set
 * fixes it: "coupled sky beats (A2) ~250vh for three beats". If this number
 * changes, the Figma frame's section name has to change with it — that label
 * is the handoff contract.
 */
export const SKY_CLOCK_SPAN_VH = 250;

/** Beat centres on the scroll clock. Straight from the sketch spec. */
const BEAT_STOPS = [0, 0.33, 0.66] as const;

/**
 * Half-width of each cross-fade, in progress units. The fades overlap by
 * design — a hard cut between beats reads as a slideshow, which is the exact
 * impression this section exists to avoid.
 */
const FADE = 0.085;

type Els = {
  root: HTMLElement;
  pin: HTMLElement;
  skies: HTMLElement[];
  beats: HTMLElement[];
  ghosts: HTMLElement[];
  /** Y2 words. Truth only — see the Y2 block below for why. */
  y2Words: HTMLElement[];
  /** Beat media. Restricted buckets are excluded at selection time. */
  tiles: HTMLElement[];
};

function collect(root: HTMLElement): Els | null {
  const pin = root.querySelector<HTMLElement>("[data-sky-pin]");
  const skies = [...root.querySelectorAll<HTMLElement>("[data-sky-layer]")];
  const beats = [...root.querySelectorAll<HTMLElement>("[data-sky-beat]")];
  if (!pin || skies.length !== beats.length || beats.length === 0) return null;
  return {
    root,
    pin,
    skies,
    beats,
    ghosts: [...root.querySelectorAll<HTMLElement>("[data-ghost]")],
    y2Words: [...root.querySelectorAll<HTMLElement>("[data-y2-word]")],
    tiles: [
      ...root.querySelectorAll<HTMLElement>(
        "[data-media-tile]:not([data-motion='frame'])",
      ),
    ],
  };
}

/**
 * Cross-fade schedule for element `i` of `n`, expressed on a 0..1 timeline.
 *
 * Beat 0 and the last beat hold at full opacity at their outer edges rather
 * than fading from nothing — the section should never open or close on an
 * empty screen.
 */
function scheduleFor(i: number, n: number) {
  const stop = BEAT_STOPS[i] ?? i / n;
  const next = BEAT_STOPS[i + 1];
  return {
    inFrom: i === 0 ? null : Math.max(0, stop - FADE),
    inTo: i === 0 ? null : Math.min(1, stop + FADE),
    outFrom: next === undefined ? null : Math.max(0, next - FADE),
    outTo: next === undefined ? null : Math.min(1, next + FADE),
  };
}

export function createSkyClock(root: HTMLElement): MotionModule {
  const mm = gsap.matchMedia();

  function init() {
    const els = collect(root);
    if (!els) return;
    const { pin, skies, beats, ghosts, y2Words, tiles } = els;
    const n = beats.length;

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Opening state: first beat and first sky visible, everything else off.
      gsap.set([...skies, ...beats], { opacity: 0 });
      gsap.set([skies[0], beats[0]], { opacity: 1 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          pin,
          // The root already reserves SKY_CLOCK_SPAN_VH of document height, so
          // ScrollTrigger must not insert its own spacer on top of it.
          pinSpacing: false,
          scrub: 0.8,
          invalidateOnRefresh: true,
          // No snap. Snapping would make the sky jump between beats, and the
          // brand rule is that things settle rather than click into place.
        },
      });

      for (let i = 0; i < n; i += 1) {
        const { inFrom, inTo, outFrom, outTo } = scheduleFor(i, n);
        const pair = [skies[i], beats[i]];

        if (inFrom !== null && inTo !== null) {
          tl.fromTo(
            pair,
            { opacity: 0 },
            { opacity: 1, duration: inTo - inFrom },
            inFrom,
          );
        }
        if (outFrom !== null && outTo !== null) {
          tl.to(pair, { opacity: 0, duration: outTo - outFrom }, outFrom);
        }
      }

      /* ------------------------------------------------------------------
         What the sky ramp alone could not do
         ------------------------------------------------------------------
         The colour ramp is the section's whole idea, and against an empty
         screen it reads as nothing happening. These three layers give it
         something to be behind. None of them is a new behaviour — each is an
         existing sketch riding the pin that already exists, so no additional
         pin and no additional scroll span is claimed.
         ------------------------------------------------------------------ */

      // Oversized letterforms drifting at the slowest parallax ratio (0.15).
      // One continuous move across the whole pin, not a move per beat — the
      // beats are meant to read as one passage of time, not three sections.
      if (ghosts.length) {
        tl.fromTo(
          ghosts,
          { yPercent: 15 },
          { yPercent: -15, duration: 1 },
          0,
        );
      }

      // Beat media settles rather than arrives: scale only, no travel, so it
      // does not compete with the cross-fade for attention.
      if (tiles.length) {
        tl.fromTo(tiles, { scale: 1.08 }, { scale: 1, duration: 1 }, 0);
      }

      // Y2 — word emphasis, Truth beat only.
      //
      // This is here because of a permission, not a preference: story-wall
      // imagery is unresolved and permissions.md directs that the Truth beat
      // be built typographically (B5, Y2) instead. Opacity only — Y2's spec
      // says "no movement", and truth-telling sections are the ones that must
      // move less than the rest of the site, not more.
      if (y2Words.length) {
        tl.fromTo(
          y2Words,
          { opacity: Y2_DIM },
          {
            opacity: 1,
            duration: 0.2,
            stagger: { each: 0.012 },
          },
          // Anchored to the Truth beat's own stop on the clock.
          BEAT_STOPS[1],
        );
      }

      // matchMedia reverts everything created in this scope, including the
      // ScrollTrigger and the pin spacer.
      return () => {
        tl.kill();
      };
    });
  }

  function destroy() {
    mm.revert();
    ScrollTrigger.refresh();
  }

  return { init, destroy };
}
