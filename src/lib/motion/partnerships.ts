"use client";

/**
 * /partnerships — the page's motion, section by section. Verb: HOSTS.
 *
 * ⚑ THE "STATIC BY DECISION" ERA IS OVER (user direction, 11 September 2026).
 * This file opened it for §01 on 9 September and closed it for the rest of the
 * page on the 11th. The rule it set then was honoured in the doing: every
 * section landed with its grammar row, its ledger row, and each header that
 * contradicted it amended in the SAME pass — src/app/partnerships/page.tsx,
 * its Sections and Motion modules, and `docs/motion/scenes.md`.
 *
 * §01's score is below; §02, §03, §05, §06 and §08 are at the foot of this
 * file; §04 is `hosting` in recipes.ts. §04b and §07 hold still by instruction.
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
 * No `pushIn`, no `plateParallax`. `pt-hero` is graded `frame` and this obeys
 * it: the world arrives around the picture, the picture does not move.
 *
 * ⚑ THE REASON CHANGED ON 11 SEPTEMBER 2026 AND THE BEHAVIOUR DID NOT. This
 * note used to read "THERE ARE PEOPLE IN THIS FRAME" — the crew on the burn
 * edge, publishable only because nobody is identifiable from height, so a
 * plane that scaled or drifted under them would have turned a held record of
 * real people into a moving backdrop. That frame has been replaced by an
 * aerial with one vehicle and no one in it, so that argument no longer applies
 * to what is on screen.
 *
 * It still holds still because the grade still says `frame` and this score was
 * written around a held photograph. Raising it to `full` is a decision for a
 * person, not a consequence of swapping an image — see the note at `pt-hero`.
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
import { clearAll, composition } from "@/lib/motion/compose";
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

/* -------------------------------------------------------------------------
   §02 – §08 — the rest of the page, scored 11 September 2026
   ------------------------------------------------------------------------- */

/**
 * ⚑ THE SECTIONS BELOW THE HERO NOW MOVE (user direction, 11 September 2026),
 * scored from the wireframe's own side-notes. This supersedes the "§02 down
 * are static by decision" line at the top of this file and the matching
 * headers in the page and its Sections module, all amended in this pass.
 *
 * ⚠ ALMOST EVERY SCREEN HERE DECLARES `none`, AND THAT IS THE HONEST READING
 * rather than an omission. `compose.ts`'s LOUD table is the arbiter of what
 * counts as loud — media: breakOut, bleed, plateParallax, mosaic, aperture ·
 * type: aperture, ghostType, knockout, display · transition: groundRamp,
 * overlap, handoff, escape. `settle`, `arrive`, `scatterResolve` and `hold`
 * appear in none of those lists, so a screen built from them is quiet however
 * much it moves, and declaring a channel it does not spend would make the
 * assertion in `assertChannel` meaningless.
 *
 * That leaves the page with exactly two loud moments — §03's `display` (type)
 * and §04's media — which is what F7's "one loud channel per screen" is for.
 * `docs/motion/scenes.md` is corrected to match: its rows had §02/§03/§05 as
 * type and §06/§08 as transition, written before any of this was built. Same
 * correction §01 already carries in this file.
 *
 * ⚠ ENTRANCES GO IN `enter`, NOT `build`. `build` is the scrubbed span — the
 * reader running the projector — and none of these are scrubbed: the notes ask
 * for settles and arrivals, which play once and stay played. `build` therefore
 * carries an explicit `hold`, the same declaration `breath` makes: this
 * screen's reading span is deliberately still. An empty build would look like
 * an oversight; `hold` says it was a decision.
 *
 * Markup contract, per section root:
 *   [data-pt-settle]    a heading that rises from behind its own line mask
 *   [data-pt-display]   ONE short display heading, split by character
 *   [data-pt-arrive]    anything that arrives 16px and a fade
 *   [data-pt-card]      one card in a group that resolves or arrives together.
 *                       Tagged per card, NOT as `[data-pt-cards] > *`: CardRail
 *                       wraps its grid in a scroller, so the cards are not
 *                       direct children of anything a section can name.
 *   [data-pt-media]     a photograph that is deliberately held
 */

const qa = (root: HTMLElement, sel: string) =>
  Array.from(root.querySelectorAll<HTMLElement>(sel));
const q1 = (root: HTMLElement, sel: string) =>
  root.querySelector<HTMLElement>(sel);

/** §02 · the obligation — one sentence on a screen. Note: settle B5, line masks. */
export function partnershipsObligation(root: HTMLElement): MotionModule {
  return composition("partnerships/obligation", root, {
    channel: "none",
    span: 100,
    uses: ["settle", "arrive", "hold"],
    build: (tl, r) => {
      /* The ground does not change here — the note is explicit, and the wave
         at the foot is what carries it into canvas. Nothing to scrub. */
      const held = q1(r, "[data-pt-settle]");
      if (held) tl.hold(held, {}, 0);
    },
    enter: (tl, r) => {
      const claim = q1(r, "[data-pt-settle]");
      const consequence = qa(r, "[data-pt-arrive]");
      if (claim) tl.settle(claim, { duration: DUR.large }, 0);
      if (consequence.length) tl.arrive(consequence, {}, HEADLINE_AT + BEAT);
    },
    cut: clearAll,
  });
}

/**
 * §03 · open research — the three disciplines.
 *
 * ⚠ THE ONE CHARACTER SPLIT ON THE SITE'S CRITICAL PATH, and it is permitted
 * rather than snuck in. The note says "display B6, character stagger, 120ms
 * between lines. Permitted here — these are short headings, not testimony",
 * and the engine agrees on its own terms: `split-text.ts` allows `chars` for
 * SHORT DISPLAY HEADINGS ONLY and `core.ts` downgrades anything over 48
 * characters to lines without being asked. The three lines are 29, 24 and 16
 * characters. CLAUDE.md's blanket "never by character" was corrected in this
 * pass to state the real rule.
 *
 * ⚠ ONE CALL PER LINE. `display` splits `els[0]` and nothing else, so handing
 * it all three at once would animate the first and leave the other two
 * untouched. The 0.12 offsets ARE the note's 120ms.
 */
export function partnershipsOpenResearch(root: HTMLElement): MotionModule {
  return composition("partnerships/open-research", root, {
    channel: "type",
    span: 120,
    uses: ["display", "hold"],
    build: (tl, r) => {
      /* R24 — the research frame shows an identifiable person. It is graded
         `frame` in kit.ts and it holds, like the hero's crew. */
      const media = qa(r, "[data-pt-media]");
      if (media.length) tl.hold(media, {}, 0);
    },
    enter: (tl, r) => {
      qa(r, "[data-pt-display]").forEach((line, i) => {
        tl.display(line, {}, i * 0.12);
      });
    },
    cut: clearAll,
  });
}

/**
 * §05 · who we already work with — nine names in three groups.
 *
 * `scatterResolve` is the card choreography approved on Our People §03, which
 * is what the note points at. Quiet by the LOUD table's reading, so this screen
 * declares no channel; the cards resolving is the whole of it.
 */
export function partnershipsPartners(root: HTMLElement): MotionModule {
  return composition("partnerships/partners", root, {
    channel: "none",
    span: 130,
    uses: ["settle", "scatterResolve", "hold"],
    build: (tl, r) => {
      const heading = q1(r, "[data-pt-settle]");
      if (heading) tl.hold(heading, {}, 0);
    },
    enter: (tl, r) => {
      const heading = q1(r, "[data-pt-settle]");
      const cards = qa(r, "[data-pt-card]");
      if (heading) tl.settle(heading, { duration: DUR.large }, 0);
      if (cards.length) tl.scatterResolve(cards, {}, BEAT);
    },
    cut: clearAll,
  });
}

/** §06 · ways in — four cards. Note: arrive X4 with a grid stagger. */
export function partnershipsWaysIn(root: HTMLElement): MotionModule {
  return composition("partnerships/ways-in", root, {
    channel: "none",
    span: 140,
    uses: ["settle", "arrive", "hold"],
    build: (tl, r) => {
      const heading = q1(r, "[data-pt-settle]");
      if (heading) tl.hold(heading, {}, 0);
    },
    enter: (tl, r) => {
      const heading = q1(r, "[data-pt-settle]");
      const cards = qa(r, "[data-pt-card]");
      const rest = qa(r, "[data-pt-arrive]");
      if (heading) tl.settle(heading, { duration: DUR.large }, 0);
      if (cards.length) tl.arrive(cards, {}, HEADLINE_AT);
      if (rest.length) tl.arrive(rest, {}, HEADLINE_AT + BEAT);
    },
    cut: clearAll,
  });
}

/** §08 · the ending — one address and one action. Note: arrive X4. */
export function partnershipsEnding(root: HTMLElement): MotionModule {
  return composition("partnerships/ending", root, {
    channel: "none",
    span: 70,
    uses: ["arrive", "hold"],
    build: (tl, r) => {
      const arrivals = qa(r, "[data-pt-arrive]");
      if (arrivals.length) tl.hold(arrivals[0], {}, 0);
    },
    enter: (tl, r) => {
      const arrivals = qa(r, "[data-pt-arrive]");
      if (arrivals.length) tl.arrive(arrivals, {}, 0);
    },
    cut: clearAll,
  });
}
