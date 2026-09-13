"use client";

/**
 * Core effects — arrival, type, and the rest.
 *
 * Grammar rows: "what endures", "emerging from the ground", "arriving
 * quietly", "what radiates from a source", "a person speaking", "the rest".
 *
 * These are the effects a quiet screen is built from. Every page uses several;
 * a page that uses *only* these is a rest page, and should say so.
 */

import gsap from "gsap";
import { DUR, EASE, JITTER, STAGGER, TRIAD } from "../tokens";
import { assertEase, first, freshSplit, noise } from "./shared";

export function registerCore(): void {
  /* --- what endures ------------------------------------------------------
     Grammar: "what endures" · sketch B5 · the workhorse for every heading.
     A line rising from behind an edge reads as inscription, which is the
     register this site wants. Masked at the line, never per character —
     character reveals read as technology and play. */
  gsap.registerEffect({
    name: "settle",
    extendTimeline: true,
    defaults: { duration: DUR.large, ease: EASE.country, stagger: STAGGER.line },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("settle", config.ease);
      const split = freshSplit(first(targets), {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        aria: "auto",
      });
      return gsap.from(split.lines, {
        yPercent: 110,
        duration: config.duration as number,
        ease: config.ease as string,
        stagger: config.stagger as number,
      });
    },
  });

  /* --- the screen clears -------------------------------------------------
     Grammar: "the screen clears" · About §03 · P9.

     `settle` read backwards and upwards, and deliberately its counterpart:
     what endures rises from behind its edge and never exits, what has been
     answered leaves through the top and does not come back. Same line split,
     same mask, same 90ms — so the two read as one gesture in two directions
     rather than as two unrelated animations.

     ⚠ NEVER ON TESTIMONY. A person's recorded words are read in stillness
     (`dim`) and are not taken off the screen; this is for the page's OWN
     claims, which exist to be measured against something and then to get out
     of the way of it.

     The fade is not decoration on top of the mask: masked travel alone leaves
     the last sliver of a tall line hanging at the mask edge for the whole
     exit, and the direction was asked for as "fade out and text moves up"
     (user direction, 12 September 2026). Both, on the same span.

     -110 rather than -100 so a descender clears the mask completely; `settle`
     uses +110 for the ascender on the same reasoning. */
  gsap.registerEffect({
    name: "vacate",
    extendTimeline: true,
    defaults: { duration: DUR.large, ease: EASE.country, stagger: STAGGER.line },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("vacate", config.ease);
      const split = freshSplit(first(targets), {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        aria: "auto",
      });
      return gsap.to(split.lines, {
        yPercent: -110,
        opacity: 0,
        duration: config.duration as number,
        ease: config.ease as string,
        stagger: config.stagger as number,
      });
    },
  });

  /* --- a short display heading -------------------------------------------
     Grammar: "what endures", display cut · sketch B6.
     Characters ONLY on short display headings. tokens.md caps this at roughly
     six words; narrative and testimony copy stays line-split, where a character
     reveal would break the reading and read as a gimmick. The length guard
     downgrades the obvious misuse rather than trusting the caller. */
  gsap.registerEffect({
    name: "display",
    extendTimeline: true,
    defaults: { duration: DUR.large, ease: EASE.country, stagger: STAGGER.char },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("display", config.ease);
      const els = gsap.utils.toArray<HTMLElement>(targets);
      const tooLong = els.some((el) => (el.textContent ?? "").trim().length > 48);
      const split = freshSplit(els[0], {
        type: tooLong ? "lines" : "chars",
        ...(tooLong ? { mask: "lines" as const } : {}),
        autoSplit: true,
        aria: "auto",
      });
      return gsap.from(tooLong ? split.lines : split.chars, {
        yPercent: 110,
        ...(tooLong ? {} : { opacity: 0 }),
        duration: config.duration as number,
        ease: config.ease as string,
        stagger: (tooLong ? STAGGER.line : config.stagger) as number,
      });
    },
  });

  /* --- what endures: wave clamp -----------------------------------------
     Grammar: "what endures", wave clamp · Truth / Today.
     The heading shares the incoming record's exact scrubbed travel until its
     crown reaches the viewport crown. It then holds on transform alone while
     the higher-z wave and ground continue upward and cover it. */
  gsap.registerEffect({
    name: "waveClamp",
    extendTimeline: true,
    defaults: { duration: 1 },
    effect: (targets: object, config: Record<string, unknown>) => {
      const heading = first(targets);
      const track = config.track as HTMLElement;
      const viewport = config.viewport as HTMLElement;

      return gsap.fromTo(
        heading,
        { y: 0 },
        {
          y: () => -Math.max(0, track.scrollHeight - viewport.clientHeight),
          duration: config.duration as number,
          ease: "none",
          modifiers: {
            y: (value: string) =>
              `${Math.max(Number.parseFloat(value) || 0, -heading.offsetTop)}px`,
          },
        },
      );
    },
  });

  /* --- emerging from the ground -----------------------------------------
     Grammar: "emerging from the ground" · Truth-local sketch M1.
     The element is already in its final layout and simply gains brightness
     as the reader reaches it. No translation, scale or filter: the descent is
     the movement, and reversing the scroll reverses the brightening. */
  gsap.registerEffect({
    name: "brighten",
    extendTimeline: true,
    defaults: { dim: 0.4, duration: DUR.medium, ease: EASE.machine },
    effect: (targets: object, config: Record<string, unknown>) =>
      gsap.fromTo(
        targets,
        { opacity: config.dim as number },
        {
          opacity: 1,
          duration: config.duration as number,
          ease: config.ease as string,
        },
      ),
  });

  /* --- arriving quietly --------------------------------------------------
     Grammar: "arriving quietly" · sketch X4 · the baseline for quiet screens,
     and what CMS surfaces inherit. Small travel, once, no re-trigger. */
  gsap.registerEffect({
    name: "arrive",
    extendTimeline: true,
    defaults: {
      y: 16,
      duration: DUR.medium,
      ease: EASE.country,
      stagger: STAGGER.grid,
    },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("arrive", config.ease);
      return gsap.from(targets, {
        y: config.y as number,
        opacity: 0,
        duration: config.duration as number,
        ease: config.ease as string,
        stagger: config.stagger as number,
      });
    },
  });

  /* --- what radiates from a source ---------------------------------------
     Grammar: "what radiates from a source" · sketches L1 + L3.
     Stagger by distance from a chosen origin rather than DOM order, with the
     seeded hand jitter on top. Pick the origin per section deliberately — the
     logo, a subject's face, the sun in the photograph. A default centre origin
     wastes the idea. */
  gsap.registerEffect({
    name: "emanate",
    extendTimeline: true,
    defaults: {
      from: "center",
      grid: "auto",
      duration: DUR.medium,
      ease: EASE.country,
      each: STAGGER.radial,
      jitter: true,
    },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("emanate", config.ease);
      return gsap.from(targets, {
        scale: 0.7,
        opacity: 0,
        duration: config.duration as number,
        ease: config.ease as string,
        delay: config.jitter ? (i: number) => noise(i) * JITTER.maxDelay : 0,
        stagger: {
          each: config.each as number,
          grid: config.grid as "auto" | [number, number],
          from: config.from as number | "center" | "edges" | "start" | "end",
        },
      });
    },
  });

  /* --- the scale triad ---------------------------------------------------
     Grammar: "what radiates from a source", layout cut · sketch L2.
     Three arrival tiers with internal micro-stagger. Elements declare their own
     tier with data-tier, so layout and motion agree by construction instead of
     via two lists kept in step by hand.

     The Living Work hi-fi leans on this: §06's seven streams are "three of them
     anchor tier", and the anchors are the ones whose images bleed to the edge. */
  gsap.registerEffect({
    name: "triad",
    extendTimeline: true,
    defaults: { duration: DUR.medium, ease: EASE.country, each: STAGGER.grid },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("triad", config.ease);
      const els = gsap.utils.toArray<HTMLElement>(targets);
      const tl = gsap.timeline();
      (Object.keys(TRIAD) as Array<keyof typeof TRIAD>).forEach((tier) => {
        const group = els.filter((el) => el.dataset.tier === tier);
        if (!group.length) return;
        tl.from(
          group,
          {
            y: 24,
            opacity: 0,
            duration: config.duration as number,
            ease: config.ease as string,
            stagger: config.each as number,
          },
          TRIAD[tier],
        );
      });
      return tl;
    },
  });

  /* --- a person speaking -------------------------------------------------
     Grammar: "a person speaking" · sketch Y2 · plate P6.
     Per-word opacity ramp with NO movement. The dim state is 0.28, not
     near-invisible: the unread words are still there, still readable, just not
     the one being spoken. Right for quoted speech, wrong for marketing copy. */
  gsap.registerEffect({
    name: "dim",
    extendTimeline: true,
    defaults: {
      dim: 0.28,
      duration: DUR.medium,
      ease: EASE.quiet,
      stagger: STAGGER.word,
    },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("dim", config.ease);
      const split = freshSplit(first(targets), {
        type: "words",
        autoSplit: true,
        aria: "auto",
      });
      return gsap.fromTo(
        split.words,
        { opacity: config.dim as number },
        {
          opacity: 1,
          duration: config.duration as number,
          ease: config.ease as string,
          stagger: config.stagger as number,
        },
      );
    },
  });

  /* --- the rest ----------------------------------------------------------
     Grammar: "the rest" · brief section 3 · plates P1 and P8.

     Stillness, with a name and a duration. This looks like a no-op and is not
     one. The brief is explicit that "a rest scene is a real scene, not
     padding", and the kit agrees — it drew P8 · CINEMATIC HOLD as a plate, and
     the Living Work hi-fi drew §07b BREATH as a whole section, "held, no
     caption". An unnamed pause is indistinguishable from a section somebody
     forgot to animate; a `hold` in a timeline is a decision anyone can read.

     It is also how `frame` material gets its weight. The plate holds; the
     ground, scrim and type around it are what move. */
  gsap.registerEffect({
    name: "hold",
    extendTimeline: true,
    defaults: { duration: DUR.large * 2 },
    effect: (targets: object, config: Record<string, unknown>) =>
      gsap.to(targets, { duration: config.duration as number }),
  });
}
