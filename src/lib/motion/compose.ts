"use client";

/**
 * Compositions — screen recipes.
 *
 * THE PROBLEM THIS SOLVES
 * -----------------------
 * A vocabulary of named effects is not immersion. Lumen is not dense because it
 * has forty effects; it is dense because every screen runs three or four at
 * once. Our code fired one effect per element, which is exactly why the result
 * read as a list of tricks rather than as a place.
 *
 * The hi-fi proves it. Living Work §02 runs, on one screen: a pin, the aperture
 * opening in three stages, four figures cycling, a progress rail drawing, a
 * full-bleed break-out, and a Flip handoff into the next section's heading. Six
 * behaviours, one timeline, one meaning.
 *
 * So a composition is a named recipe: a screen's worth of layered motion, built
 * once, with its scroll span and its loud channel declared.
 *
 * WHAT A COMPOSITION OWNS THAT AN EFFECT DOES NOT
 * -----------------------------------------------
 *   - the ScrollTrigger, and therefore the span in vh
 *   - the ordering and overlap of several effects
 *   - the reduced-motion cut for the whole screen
 *   - the loud-channel declaration, asserted in development
 *
 * Effects stay pure builders that know nothing about scroll. That separation is
 * what lets `pushIn` serve a hero, a scrub and a composition without three
 * copies of it existing.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "@/lib/motion-controller";
import {
  registerYachatdacEffects,
  revertSplits,
  type EffectName,
} from "@/lib/motion/effects";
import { SCRUB } from "@/lib/motion/tokens";

gsap.registerPlugin(ScrollTrigger);

/**
 * F7's pacing law: every screen declares ONE loud channel and keeps the other
 * two quiet. Plain text means a big media or transition moment; plain media
 * means big type. This is what stops "cinematic everywhere" becoming noise, and
 * it is the only reason a page can carry this much motion and still be read.
 */
export type LoudChannel = "media" | "type" | "transition" | "none";

export type CompositionSpec = {
  /** Which effects are allowed to be loud on this screen. */
  channel: LoudChannel;
  /** Scroll cost in vh. Required — a pin without a documented span is the
      thing that makes a reader think the page is broken. */
  span: number;
  /** Whether the screen pins. */
  pin?: boolean;
  /** Snap points, for step-throughs. `1 / (steps - 1)`. */
  snap?: number;
  /**
   * The effects this recipe reaches for.
   *
   * Declared rather than detected: GSAP does not tag a tween with the effect
   * that made it, and inferring it would be guesswork. Declaring it costs one
   * line, makes the loud-channel assertion real, and doubles as the recipe's
   * own documentation — you can read what a screen does without reading its
   * build function.
   */
  uses: EffectName[];
  /**
   * Scrubbed motion — tied to scroll position. Parallax, ramps, apertures,
   * counters: anything where the reader is running the projector.
   */
  build: (tl: gsap.core.Timeline, root: HTMLElement) => void;
  /**
   * Entry motion — plays once when the screen arrives, and never again.
   *
   * Kept off the scrubbed timeline deliberately. X4 says `once: true`, and
   * scrubbing an entry stagger makes it run backwards when the reader scrolls
   * up — which patterns.md calls "the single most irritating thing a site can
   * do", and it is right. A screen almost always wants both: its ground scrubs
   * while its cards arrive.
   */
  enter?: (tl: gsap.core.Timeline, root: HTMLElement) => void;
  /** The cut. Final state, instantly. No tweens with a duration, no pins. */
  cut: (root: HTMLElement) => void;
};

/**
 * Effects that count as loud in each channel.
 *
 * Used by the development assertion below. This is deliberately a short list:
 * the question is not "does this move" — on this site nearly everything moves —
 * but "does this take the screen".
 *
 * `waveHandoff` is deliberately NOT here, though it is a transition effect. A
 * 9vw divider rising at the foot of a hero is furniture: it carries one ground
 * into the next without ever competing for attention. `groundRamp` walking a
 * colour across four screens is the loud version of the same idea, and that one
 * is listed. The distinction is scale, not category.
 */
const LOUD: Record<Exclude<LoudChannel, "none">, string[]> = {
  media: ["breakOut", "bleed", "plateParallax", "mosaic", "aperture"],
  type: ["aperture", "ghostType", "knockout", "display"],
  transition: ["groundRamp", "overlap", "handoff"],
};

/**
 * Fails in development when a screen stacks loud effects from two channels.
 *
 * The rule was written down in F7 and in the motion grammar and then obeyed by
 * memory, which is the same as not being obeyed. A composition declares its
 * channel, so this can be checked rather than remembered.
 *
 * `aperture` appears under both media and type on purpose — it is a typographic
 * device that takes the screen with a photograph, so it is legitimately either,
 * and the declaring composition decides which.
 */
function assertChannel(
  name: string,
  spec: CompositionSpec,
  used: readonly string[],
): void {
  if (process.env.NODE_ENV === "production") return;
  if (spec.channel === "none") {
    const loud = used.filter((u) => Object.values(LOUD).flat().includes(u));
    if (loud.length) {
      throw new Error(
        `[motion] composition "${name}" declares no loud channel but uses ${loud.join(", ")}. ` +
          `A rest screen holds still — that is what makes the loud ones land.`,
      );
    }
    return;
  }

  const allowed = LOUD[spec.channel];
  const trespass = used.filter(
    (u) => !allowed.includes(u) && Object.values(LOUD).flat().includes(u),
  );
  if (trespass.length) {
    const channels = trespass.map(
      (t) =>
        `${t} (${(Object.keys(LOUD) as Array<keyof typeof LOUD>).find((c) => LOUD[c].includes(t))})`,
    );
    throw new Error(
      `[motion] composition "${name}" declares the "${spec.channel}" channel loud, ` +
        `but also uses ${channels.join(", ")}. One loud channel per screen (F7) — ` +
        `keep the other two quiet, or change which channel this screen is loud in.`,
    );
  }
}

/**
 * Build a composition as a MotionModule.
 *
 * Both branches are required by CompositionSpec, so a screen cannot ship
 * without its reduced-motion cut — the same contract scene() enforces, at
 * screen scale.
 */
export function composition(
  name: string,
  root: HTMLElement,
  spec: CompositionSpec,
): MotionModule {
  let mm: gsap.MatchMedia | null = null;

  const init = () => {
    registerYachatdacEffects();
    mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: `+=${spec.span}%`,
          scrub: SCRUB.normal,
          pin: spec.pin ?? false,
          invalidateOnRefresh: true,
          ...(spec.snap
            ? { snap: { snapTo: spec.snap, duration: 0.3, ease: "power2.inOut" } }
            : {}),
        },
      });

      spec.build(tl, root);

      // Entry motion gets its own trigger: starts a little before the screen
      // is centred, plays once, never reverses.
      let entryTl: gsap.core.Timeline | null = null;
      if (spec.enter) {
        entryTl = gsap.timeline({
          scrollTrigger: { trigger: root, start: "top 82%", once: true },
        });
        spec.enter(entryTl, root);
      }

      assertChannel(name, spec, spec.uses);

      return () => {
        tl.kill();
        entryTl?.kill();
      };
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      // The cut. Splits go back to plain text, styles clear, nothing pins.
      revertSplits(root);
      spec.cut(root);
    });
  };

  const destroy = () => {
    mm?.revert();
    mm = null;
  };

  return { init, destroy };
}

/**
 * The default cut for most screens: everything at its natural final state.
 *
 * Works because the server markup IS the final state — content is laid out
 * readable, and motion only ever animates *from* somewhere else to here. That
 * is also what makes the JS-disabled case work, and the two are the same
 * property rather than two features.
 */
export function clearAll(root: HTMLElement): void {
  gsap.set(root.querySelectorAll("*"), { clearProps: "all" });
}
