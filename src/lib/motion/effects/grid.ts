"use client";

/**
 * Grid and Flip choreography.
 *
 * Grammar row: "the world opening", grid cuts.
 *
 * Flip is the plugin Lumen's grid work is built on, and it has been installed
 * and unused in this repo since the start. It measures an element in state A,
 * lets you move it, measures state B, and animates the difference with
 * transforms only — which is how you get an element to travel between two
 * layouts without animating a single layout property.
 *
 * The hi-fi's §02 ends with "M2 opens from the glyph, then closes into the O of
 * 'Our'" — a full-bleed photograph shrinking into a letterform in the next
 * section's heading. That is a Flip handoff, and it is the single most
 * expensive-looking move on the page.
 */

import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { DUR, EASE, STAGGER } from "../tokens";
import { assertEase, noise } from "./shared";

gsap.registerPlugin(Flip);

export function registerGrid(): void {
  /* Grammar: "the world opening", Record's measured surface cut (F7/F8,
     2026-09-08). React owns both endpoints. Counter-scaling interpolated
     endpoints independently distorts the middle of the flight; the inverse
     must be calculated from the plate's current transform instead. */
  gsap.registerEffect({
    name: "surface",
    extendTimeline: true,
    defaults: { release: 0.35, duration: 0.9, ease: EASE.country, radius: 24 },
    effect: (targets: object, config: Record<string, unknown>) => {
      const plate = gsap.utils.toArray<HTMLElement>(targets)[0];
      const cell = config.cell as HTMLElement;
      const image = config.image as HTMLElement | null;
      const scrim = config.scrim as HTMLElement | null;
      const lane = config.lane as HTMLElement | null;
      const copy = config.copy as HTMLElement[];
      const neighbours = config.neighbours as HTMLElement[];
      const release = config.release as number;
      const duration = config.duration as number;
      const ease = config.ease as string;
      const tl = gsap.timeline({ paused: true });
      if (!plate || !cell) return tl;

      gsap.set(plate, { x: 0, y: 0, scaleX: 1, scaleY: 1, autoAlpha: 0 });
      gsap.set(cell, { autoAlpha: 1 });
      if (neighbours.length) gsap.set(neighbours, { opacity: 1 });
      if (copy.length) gsap.set(copy, { opacity: 0, y: 20 });
      if (image) gsap.set(image, { scaleX: 1, scaleY: 1 });
      if (lane) gsap.set(lane, { autoAlpha: 0 });

      const fit = Flip.fit(plate, cell, { getVars: true, scale: true }) as {
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
      };
      const corner = { radius: config.radius as number };
      // Record the inline properties in the owning context before callbacks
      // update them. Teardown then restores the exact pre-animation state.
      gsap.set(plate, { clipPath: "inset(0 round 0px)" });
      const draw = () => {
        const sx = Number(gsap.getProperty(plate, "scaleX")) || 1;
        const sy = Number(gsap.getProperty(plate, "scaleY")) || 1;
        if (image) gsap.set(image, { scaleX: 1 / sx, scaleY: 1 / sy });
        plate.style.clipPath = `inset(0 round ${corner.radius / sx}px / ${corner.radius / sy}px)`;
      };

      // The source cell holds its measured box, including at the swap. A
      // separate lift here made the photograph jump back by 12px on release.
      if (neighbours.length) {
        tl.to(neighbours, { opacity: 0.45, duration: release, ease }, 0);
      }
      tl.to(cell, { autoAlpha: 0, duration: 0.001 }, release)
        .to(plate, { autoAlpha: 1, duration: 0.001 }, release)
        .fromTo(
          plate,
          fit,
          {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            duration,
            ease,
            immediateRender: false,
            onUpdate: draw,
          },
          release,
        )
        .to(corner, { radius: 0, duration, ease, onUpdate: draw }, release);
      if (scrim)
        tl.fromTo(
          scrim,
          { opacity: 0.8 },
          {
            opacity: 1,
            duration,
            ease,
            immediateRender: false,
          },
          release,
        );
      if (lane) tl.to(lane, { autoAlpha: 1, duration, ease }, release);
      if (copy.length)
        tl.to(
          copy,
          {
            opacity: 1,
            y: 0,
            duration: 0.42,
            stagger: 0.06,
            ease,
          },
          release + duration + 0.15,
        );
      return tl;
    },
  });

  /* Grammar: "the world opening", reflow cut, 2026-09-08. Stable content
     ids join the two layouts even when React has mounted a different row.
     No absolute positioning or reparenting of React's nodes. */
  gsap.registerEffect({
    name: "reflow",
    defaults: { duration: DUR.medium, ease: EASE.country },
    effect: (targets: object, config: Record<string, unknown>) => {
      return Flip.from(config.state as Flip.FlipState, {
        targets: gsap.utils.toArray<HTMLElement>(targets),
        scale: true,
        duration: config.duration as number,
        ease: config.ease as string,
        onEnter: (elements) =>
          gsap.fromTo(elements, { opacity: 0 }, { opacity: 1, duration: 0.4 }),
      });
    },
  });

  /* --- the handoff -------------------------------------------------------
     Grammar: "the world opening", continuity cut · sketch C2 · hi-fi §02.

     One element, measured in both states. Not two elements cross-fading — the
     reader must believe it is the same photograph arriving somewhere new,
     which is the whole reason the move is worth making.

     The caller supplies `to`: the container the element should end up in. The
     effect records the state, reparents, and animates the delta. Re-measure on
     resize; a handoff computed at one viewport width lands wrong at another. */
  gsap.registerEffect({
    name: "handoff",
    extendTimeline: true,
    defaults: { to: null, duration: DUR.large, ease: EASE.country },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("handoff", config.ease);
      const el = gsap.utils.toArray<HTMLElement>(targets)[0];
      const destination = config.to as HTMLElement | null;
      const tl = gsap.timeline();
      if (!el || !destination) return tl;

      const state = Flip.getState(el);
      destination.appendChild(el);
      const flip = Flip.from(state, {
        duration: config.duration as number,
        ease: config.ease as string,
        absolute: true,
      });
      tl.add(flip);
      return tl;
    },
  });

  /* --- mosaic collapse ---------------------------------------------------
     Grammar: "the world opening", grid cut · sketch M5.

     Tiles scattered across the screen collapse onto one hero target. Flip.fit
     computes each tile's transform to land on the target's box, so the tiles
     converge rather than merely fading — the last third of the move is where
     the non-hero tiles drop away.

     Cap the tile count. Past roughly 120 nodes this belongs on a canvas, and
     the same rule that governs point fields governs this. */
  gsap.registerEffect({
    name: "mosaic",
    extendTimeline: true,
    defaults: { target: null, duration: DUR.large, ease: EASE.country },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("mosaic", config.ease);
      const tiles = gsap.utils.toArray<HTMLElement>(targets);
      const target = config.target as HTMLElement | null;
      const duration = config.duration as number;
      const ease = config.ease as string;
      const tl = gsap.timeline();
      if (!target) return tl;

      tiles.forEach((tile, i) => {
        const fit = Flip.fit(tile, target, {
          duration,
          ease,
          scale: true,
        }) as gsap.core.Tween | null;
        if (fit) tl.add(fit, i * STAGGER.grid);
      });
      // The hero survives; everything else leaves in the last third.
      tl.to(
        tiles.filter((t) => t !== target),
        { opacity: 0, duration: duration * 0.33, ease },
        duration * 0.67,
      );
      return tl;
    },
  });

  /* --- the escape -------------------------------------------------------
     Grammar: "the world opening", grid cut · sketch M2 lineage · Record §03.

     A card leaves the grid, becomes the whole screen, and comes back.

     `handoff` above already does measure-move-animate, but it REPARENTS, and a
     scroll-reversible move cannot: scrolling back up has to return the card to
     exactly where it was, not near it. So this flies a CLONE to a full-bleed
     layer and leaves the real cell in place at opacity 0. The grid never
     reflows, because as far as layout is concerned nothing ever left — which is
     the whole reason the thirteen cards behind it stay put.

     NOT SCRUBBED. Flip measures at trigger time, so a scrubbed Flip computed at
     one viewport width lands wrong at another. The caller pins for a screen and
     runs this on enter, reversing on leave-back. Re-measure on resize. */
  gsap.registerEffect({
    name: "escape",
    extendTimeline: true,
    defaults: {
      to: null,
      duration: DUR.large,
      ease: EASE.country,
      holdPlane: null,
    },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("escape", config.ease);
      const cell = gsap.utils.toArray<HTMLElement>(targets)[0];
      const destination = config.to as HTMLElement | null;
      const tl = gsap.timeline();
      if (!cell || !destination) return tl;

      // The clone is decoration; the cell keeps the accessible copy.
      const flier = cell.cloneNode(true) as HTMLElement;
      flier.setAttribute("aria-hidden", "true");
      flier.dataset.escaped = "true";
      destination.appendChild(flier);

      // Sit the clone exactly on the cell, record that, then let it snap back
      // to its natural full-bleed box and animate the difference.
      Flip.fit(flier, cell, { absolute: true });
      const fromCell = Flip.getState(flier);
      gsap.set(flier, { clearProps: "transform,width,height,top,left" });

      tl.set(cell, { opacity: 0 }).add(
        Flip.from(fromCell, {
          duration: config.duration as number,
          ease: config.ease as string,
          absolute: true,
        }),
        0,
      );

      /* --- the held plane -------------------------------------------------
         Grammar: "Portraits of real people hold still. The world moves around
         them. No parallax drift on a face, no hover-scale on an archival
         photograph."

         A card that flies to full-bleed scales everything inside it, so a card
         carrying a portrait magnifies that portrait — a hover-scale on a face
         by another name, and the rule does not care that a Flip caused it.

         `holdPlane` names a selector inside the card whose rendered size must
         not change. It is counter-scaled against the flier's own live scale
         every frame, so the product stays 1: the frame opens to the screen and
         reveals more of the photograph while the face stays exactly the size it
         was. Which is `frameOpen`'s rule — revealed, not resized — and it makes
         `escape` legal on `frame`-grade media rather than forbidden on it.

         Read-and-set on transform only. No layout properties, per the ban. */
      const sel = config.holdPlane as string | null;
      const plane = sel ? flier.querySelector<HTMLElement>(sel) : null;
      if (plane) {
        const counter = () => {
          const s = Number(gsap.getProperty(flier, "scaleX")) || 1;
          gsap.set(plane, { scale: 1 / s });
        };
        counter();
        tl.eventCallback("onUpdate", counter);
      }

      tl.eventCallback("onReverseComplete", () => {
        gsap.set(cell, { opacity: 1 });
        flier.remove();
      });

      return tl;
    },
  });

  /* --- scatter and resolve -----------------------------------------------
     Grammar: "what radiates from a source", grid cut · sketch B2 · Lumen 2-5.

     Images arrive from off their final positions and settle into the grid.
     The homepage already does this behind its Invitation heading; this is the
     behaviour generalised so any section can use it.

     Offsets are seeded, not random — the same page must scatter identically on
     every load, or a screenshot test flaps and two reviewers see two different
     designs. */
  gsap.registerEffect({
    name: "scatterResolve",
    extendTimeline: true,
    defaults: {
      spread: 120,
      duration: DUR.large,
      ease: EASE.country,
      stagger: STAGGER.grid,
    },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("scatterResolve", config.ease);
      const spread = config.spread as number;
      return gsap.from(targets, {
        x: (i: number) => (noise(i) - 0.5) * 2 * spread,
        y: (i: number) => (noise(i + 97) - 0.5) * 2 * spread,
        rotation: (i: number) => (noise(i + 31) - 0.5) * 6,
        opacity: 0,
        duration: config.duration as number,
        ease: config.ease as string,
        stagger: config.stagger as number,
      });
    },
  });
}
