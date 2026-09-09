"use client";

/**
 * /partnerships — the page's motion, section by section. Verb: HOSTS.
 *
 * ⚠ THIS FILE ENDS THE PAGE'S "STATIC BY DECISION" ERA, and only for §01.
 * Every section from §02 down is still static and the headers in
 * `src/app/partnerships/_components/Sections.tsx` still say so. Adding motion
 * to another section means writing it here, citing its grammar row, and
 * amending that header in the same pass — not quietly leaving two documents
 * disagreeing about what the page does.
 *
 * §01 · THE HERO — an overture, not a scroll scene (user direction,
 * 9 September 2026). The hero opens at the top of the document, so there is no
 * scroll span to hang it off: `composition()`'s entry trigger resolves to
 * progress(1) the moment it refreshes at scroll 0 and the arrival never plays.
 * It is gated on `awaitEntry` instead — after the X1 loader on a first visit,
 * after the X7 wipe on a navigation — the same gate The Record's hero uses
 * (`record.ts:147`).
 *
 * THE SCORE, in grammar rows:
 *
 *   the eyebrow      arriving quietly · X4        `arrive`        t = 0
 *   the headline     what endures · B5, BY LINE   `settle`        t = 0.20
 *   standfirst + action row · X4                  `arrive`        t = 0.75
 *   the wave at the photograph's foot             `waveHandoff`   t = 0.75
 *
 * ⚠ THE PHOTOGRAPH HOLDS STILL, and that is the direction, not an omission.
 * No `pushIn`, no `plateParallax` — THERE ARE PEOPLE IN THIS FRAME. The crew
 * on the burn edge is publishable because nobody is identifiable from height
 * (`kit.ts`, `pt-hero`); a plane that scales or drifts under them turns a
 * held record of real people into a moving backdrop, which is the distinction
 * the media grade exists to draw. `pt-hero` is graded `frame` and this obeys
 * it: the world arrives around the picture, the picture does not move.
 *
 * LOUD CHANNEL: NONE, honestly declared. `settle`, `arrive` and `waveHandoff`
 * are all quiet by the LOUD table's own reading — the wave is furniture
 * (`compose.ts:128`) and nothing here takes the screen. The ledger row for
 * §01 read **media** while the media moment was hypothetical; it is now a
 * rest screen that arrives, and `docs/motion/scenes.md` says so. That also
 * keeps §01 · §02 · §03 from running three type-loud screens deep.
 *
 * ⚠ NO GSAP TRANSFORM TOUCHES THE WAVE SVG. `WaveDivider` seats itself with a
 * Tailwind `-translate-y-[calc(100%-1px)]` compiled onto `transform`, and an
 * inline write clobbers it — that was About's disappearing-wave defect
 * (`recipes-about.ts`). `waveHandoff` is pointed at the WRAPPER box the
 * markup puts around it, which is why that box exists and has the wave's own
 * height: `yPercent: 100` on it is exactly one wave-height of travel.
 *
 * Markup contract, all inside `[data-pt="hero"]`:
 *   [data-pt-eyebrow]   the gold eyebrow
 *   [data-pt-heading]   the H1 — split by LINE, never by character
 *   [data-pt-arrive]    the standfirst and the action row, one beat later
 *   [data-pt-wave]      the wrapper box around the divider, wave-height tall
 */

import gsap from "gsap";
import { registerYachatdacEffects, revertSplits } from "@/lib/motion/effects";
import { awaitEntry } from "@/lib/motion/route-entry";
import { scopedScene } from "@/lib/motion/scene";
import { DUR } from "@/lib/motion/tokens";
import type { MotionModule } from "@/lib/motion-controller";

/**
 * The beat. `DUR.medium` is the length of one X4 arrival, so "one beat later"
 * means the standfirst starts as the eyebrow finishes rather than at some
 * number chosen by eye.
 */
const BEAT = DUR.medium;

/** Where the headline starts. Long enough that the eyebrow reads first. */
const HEADLINE_AT = 0.2;

export function partnershipsHero(root: HTMLElement): MotionModule {
  let revert: (() => void) | null = null;

  const init = () => {
    if (revert) return;
    registerYachatdacEffects();

    revert = scopedScene(
      root,
      () => {
        const q = (sel: string) => root.querySelector<HTMLElement>(sel);
        const eyebrow = q("[data-pt-eyebrow]");
        const heading = q("[data-pt-heading]");
        const wave = q("[data-pt-wave]");
        const arrivals = Array.from(
          root.querySelectorAll<HTMLElement>("[data-pt-arrive]"),
        );
        const copy = [eyebrow, heading, ...arrivals].filter(
          (el): el is HTMLElement => Boolean(el),
        );

        /* ⚠ HIDDEN SYNCHRONOUSLY, BEFORE THE TIMELINE EXISTS. This is a hero
           at the top of the document: it is on screen the instant the page
           paints, so it cannot wait for fonts in its finished state and then
           blink back to the start of its own entrance. It is LIFTED again the
           instant the timeline is built — see the note there; a from-tween
           built against a pinned value animates to that pinned value. The
           heading is in this list too: `settle` only moves the split LINES,
           so the element itself must be visible for their reveal to show. */
        gsap.set(copy, { opacity: 0 });
        if (wave) gsap.set(wave, { yPercent: 100 });

        let disposed = false;
        let tl: gsap.core.Timeline | null = null;
        let ungate: (() => void) | undefined;

        /* Fonts first, because `settle` splits the H1 into LINES and Block
           Berthold arriving after the split re-wraps the headline underneath
           masks measured against the fallback. */
        const fonts = document.fonts?.ready ?? Promise.resolve();
        void fonts.then(() => {
          if (disposed) return;

          /* ⚠ THE PRE-HIDE MUST BE LIFTED BEFORE THE TIMELINE IS BUILT.
             `arrive` is a `gsap.from`, and a from-tween takes the element's
             CURRENT value as its END value — so building it while opacity is
             still pinned at 0 animates 0 → 0 and the eyebrow, the standfirst
             and the action row never appear at all. That is exactly what the
             first cut of this file shipped. Clearing and building happen in
             one synchronous block and the from-tween re-applies opacity 0 on
             creation, so nothing paints in between. */
          gsap.set(copy, { clearProps: "opacity" });

          tl = gsap.timeline({ paused: true });
          if (eyebrow) tl.arrive(eyebrow, {}, 0);
          if (heading) tl.settle(heading, {}, HEADLINE_AT);
          if (arrivals.length) tl.arrive(arrivals, {}, HEADLINE_AT + BEAT);
          if (wave) tl.waveHandoff(wave, {}, HEADLINE_AT + BEAT);

          ungate = awaitEntry(() => tl?.play());
        });

        return () => {
          disposed = true;
          ungate?.();
          tl?.kill();
          revertSplits(root);
          gsap.set([...copy, ...(wave ? [wave] : [])], { clearProps: "all" });
        };
      },
      () => {
        /* The cut. The server markup IS the finished hero, so reduced motion
           needs the splits undone and nothing else set. */
        revertSplits(root);
        gsap.set(root.querySelectorAll("*"), { clearProps: "all" });
      },
    );
  };

  const destroy = () => {
    revert?.();
    revert = null;
  };

  return { init, destroy };
}
