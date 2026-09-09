"use client";

/**
 * Section-to-section continuity.
 *
 * Grammar row: "a change of ground".
 *
 * This is the family that answers "almost every scroll has movement". The other
 * families make a screen move; this one makes the space *between* screens move,
 * so a page reads as one continuous descent rather than as a stack of sections
 * that each happen to be animated.
 *
 * The Living Work hi-fi specifies it directly: §03's "ground ramp — bone → dust
 * → dry earth, scrubbed across the four clusters", §01's Wave / Divider that
 * "hands the photograph off into the page", and §07's "sticky index".
 *
 * All transform, opacity or CSS custom properties. A custom property feeding a
 * gradient or a background colour is cheaper to animate than re-parsing the
 * whole declaration each frame, and patterns.md sanctions it.
 */

import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { DUR, EASE } from "../tokens";
import { assertEase } from "./shared";
import { WAVE_ROLL } from "@/components/ui/Furniture";

gsap.registerPlugin(DrawSVGPlugin);

export function registerContinuity(): void {
  // Grammar: a change of ground, Record wave / SCR-11. About's short roll
  // and crest swell, applied to the ink so the SVG's seated offset survives.
  gsap.registerEffect({
    name: "recordWaveRoll",
    extendTimeline: true,
    effect: (targets: gsap.TweenTarget) => gsap.fromTo(targets,
      { x: -WAVE_ROLL * 0.15, scaleY: 0.6, transformOrigin: "0% 100%" },
      { x: 0, scaleY: 1, duration: 1, ease: "power2.inOut" },
    ),
  });
  /* --- a change of ground ------------------------------------------------
     Grammar: "a change of ground" · X7 lineage · plate P7.
     The new ground sweeps over the old as a scaleY wipe. Transform only, so it
     is free per frame even at full bleed. */
  gsap.registerEffect({
    name: "ground",
    extendTimeline: true,
    defaults: { origin: "top center", duration: DUR.large, ease: EASE.machine },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("ground", config.ease);
      return gsap.fromTo(
        targets,
        { scaleY: 0, transformOrigin: config.origin as string },
        {
          scaleY: 1,
          duration: config.duration as number,
          ease: config.ease as string,
        },
      );
    },
  });

  /* --- the ground ramp ---------------------------------------------------
     Grammar: "a change of ground", scrubbed cut · hi-fi §03.

     Where `ground` is one sweep, this is a ramp: a colour walked across several
     sections as the reader descends. §03's is "bone → dust → dry earth", which
     is the ground literally drying out underneath four clusters about drought,
     erosion and water. The colour is the argument, so it must move at the pace
     of the reading rather than snapping at section boundaries.

     Animates a CSS custom property, so the value can feed a background, a
     gradient stop or a border without this effect knowing which. The element
     declares what `--ground` means; the effect only moves it along the ramp. */
  gsap.registerEffect({
    name: "groundRamp",
    extendTimeline: true,
    defaults: { stops: [], prop: "--ground", duration: DUR.large, ease: EASE.machine },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("groundRamp", config.ease);
      const stops = config.stops as string[];
      const prop = config.prop as string;
      const tl = gsap.timeline();
      if (stops.length < 2) return tl;

      const step = (config.duration as number) / (stops.length - 1);
      gsap.set(targets, { [prop]: stops[0] });
      stops.slice(1).forEach((stop) => {
        tl.to(targets, { [prop]: stop, duration: step, ease: config.ease as string });
      });
      return tl;
    },
  });

  /* --- the wave handoff --------------------------------------------------
     Grammar: "a change of ground", divider cut · hi-fi §01.

     Marc's Wave / Divider is the piece of furniture that carries one section's
     ground into the next — the kit holds it in five fills and two flips, and
     the hi-fi uses it to "hand the photograph off into the page".

     It rises into place rather than wiping: the wave's own crest does the work,
     so it translates up from below its own height. Recolouring is the caller's
     job via the fill; this only moves it. */
  gsap.registerEffect({
    name: "waveHandoff",
    extendTimeline: true,
    defaults: { duration: DUR.large, ease: EASE.country },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("waveHandoff", config.ease);
      return gsap.fromTo(
        targets,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: config.duration as number,
          ease: config.ease as string,
        },
      );
    },
  });

  /* --- the sticky index --------------------------------------------------
     Grammar: "a change of ground", index cut · hi-fi §07.

     An index that stays on screen while its sections pass, lighting the current
     one. §07 marks its items LIT, two at a time. The reader always knows where
     they are in a long stretch, which is what makes a 360vh section feel
     navigable rather than endless.

     Items declare their index with data-index; the effect lights them in turn.
     Opacity only on the labels, and DrawSVG on the rule beside them if one is
     present — a line that draws itself down the margin as you descend. */
  gsap.registerEffect({
    name: "stickyIndex",
    extendTimeline: true,
    defaults: { dim: 0.3, duration: DUR.medium, ease: EASE.quiet },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("stickyIndex", config.ease);
      const items = gsap.utils.toArray<HTMLElement>(targets);
      const duration = config.duration as number;
      const ease = config.ease as string;
      const tl = gsap.timeline();

      gsap.set(items, { opacity: config.dim as number });
      items.forEach((item, i) => {
        tl.to(item, { opacity: 1, duration, ease }, i);
        if (i > 0) {
          tl.to(items[i - 1], { opacity: config.dim as number, duration, ease }, i);
        }
        const rule = item.querySelector<SVGPathElement>("[data-index-rule]");
        if (rule) {
          tl.fromTo(rule, { drawSVG: "0%" }, { drawSVG: "100%", duration, ease }, i);
        }
      });
      return tl;
    },
  });

  /* --- overlap -----------------------------------------------------------
     Grammar: "a change of ground", overlap cut.

     Sections push each other instead of simply ending. The outgoing section
     lifts and dims a little as the incoming one arrives over it, so the join is
     a movement rather than a boundary.

     Small numbers on purpose. This runs at every section join on a long page,
     and anything large here reads as the page sliding around. */
  gsap.registerEffect({
    name: "overlap",
    extendTimeline: true,
    defaults: { lift: 6, dim: 0.55, duration: DUR.large, ease: EASE.machine },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("overlap", config.ease);
      return gsap.fromTo(
        targets,
        { yPercent: 0, opacity: 1 },
        {
          yPercent: -(config.lift as number),
          opacity: config.dim as number,
          duration: config.duration as number,
          ease: config.ease as string,
        },
      );
    },
  });
}
