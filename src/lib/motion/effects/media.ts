"use client";

/**
 * Media effects — full-bleed depth.
 *
 * Grammar rows: "the world opening", "being drawn in", "time handing over".
 *
 * This family is the one the Living Work hi-fi leans on hardest. §01 is a
 * full-bleed hero; §03's BREAK is "the plain from the escarpment · silent, no
 * copy · M2 frame expand on entry"; §06's anchor-tier images "bleed to the
 * edge". A full-bleed photograph is the site's loudest media instrument, and
 * these are the ways it is allowed to move.
 *
 * THE GRADE MATTERS MOST HERE. `pushIn`, `plateParallax` and `breakOut` deform
 * an image plane, so they filter on `movable()`. `scrimRamp` and `bleed` move
 * the frame and the scrim rather than the picture, so they do not — that is the
 * whole point of the frame grade, and it is why a held photograph can still sit
 * inside a screen that is very much alive.
 */

import gsap from "gsap";
import { DUR, EASE, PARALLAX } from "../tokens";
import { assertEase, first, movable } from "./shared";

export function registerMedia(): void {
  /* --- the world opening -------------------------------------------------
     Grammar: "the world opening" · sketch M2 · plate P3.
     The most reusable behaviour on the site. The frame's clip-path opens while
     the image counter-scales, so the picture appears to be revealed rather than
     resized. Animating width/height here is what makes an "immersive" site
     stutter; the clip-path exception exists precisely to avoid that.

     `edge` picks where the opening starts. "center" (default) is the letterbox
     open. "left"/"right" wipe from that edge — a scroll unrolling from where
     the image already sits, so a frame anchored to the page's right unrolls
     right-to-left rather than appearing from thin air on the wrong side. */
  gsap.registerEffect({
    name: "frameOpen",
    extendTimeline: true,
    defaults: {
      inset: 16,
      scale: 1.28,
      edge: "center",
      duration: DUR.large,
      ease: EASE.machine,
    },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("frameOpen", config.ease);
      const frame = first(targets);
      const media = frame?.querySelector<HTMLElement>("[data-frame-media]");
      const inset = config.inset as number;
      const duration = config.duration as number;
      const ease = config.ease as string;
      const edge = config.edge as "center" | "left" | "right";
      // inset(top right bottom left) — collapsing the OPPOSITE side to 100%
      // pins the visible sliver at the named edge, so animating back to 0
      // unrolls the picture from where it already sits.
      const fromClip =
        edge === "left"
          ? "inset(0% 100% 0% 0%)"
          : edge === "right"
            ? "inset(0% 0% 0% 100%)"
            : `inset(${inset}% ${inset * 0.75}% ${inset}% ${inset * 0.75}%)`;
      const tl = gsap.timeline();
      tl.fromTo(
        frame,
        { clipPath: fromClip },
        { clipPath: "inset(0% 0% 0% 0%)", duration, ease },
        0,
      );
      if (media) {
        if (edge === "left" || edge === "right") {
          // Edge wipes must not read as a zoom — no scale at all. The media
          // drifts in from the reveal side instead, settling as the clip
          // finishes. The drift (6%) is always smaller than the remaining
          // inset (from 100%), both on the same ease, so the offset never
          // exposes the frame's far edge mid-wipe. scale:1 is the caller's
          // "plane holds still" pin (frame grade) — honour it here too and
          // move only the clip.
          if ((config.scale as number) !== 1) {
            tl.fromTo(
              media,
              { xPercent: edge === "right" ? 6 : -6 },
              { xPercent: 0, duration, ease },
              0,
            );
          }
        } else {
          tl.fromTo(media, { scale: config.scale as number }, { scale: 1, duration, ease }, 0);
        }
      }
      return tl;
    },
  });

  /* --- breaking out ------------------------------------------------------
     Grammar: "the world opening", loud cut · sketch M2 · plate P1.

     A framed image releases to full-bleed. §02 of the Living Work hi-fi:
     "BREAK-OUT · full bleed — M2 opens from the glyph, then closes into the O."

     Where frameOpen reveals a picture inside its frame, breakOut takes the
     frame away. It animates the clip out past the viewport rather than
     animating width, so it stays on the transform/clip path.

     Scale is clamped to 1 at the end — the image must land at its true size,
     because a full-bleed frame that is still scaling when the reader starts
     looking reads as drift rather than as arrival. */
  gsap.registerEffect({
    name: "breakOut",
    extendTimeline: true,
    defaults: { from: 12, duration: DUR.large, ease: EASE.country },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("breakOut", config.ease);
      const from = config.from as number;
      return gsap.fromTo(
        targets,
        { clipPath: `inset(${from}% ${from}% ${from}% ${from}%)` },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: config.duration as number,
          ease: config.ease as string,
        },
      );
    },
  });

  /* --- being drawn in ----------------------------------------------------
     Grammar: "being drawn in" · sketch M1 · plate P2.
     Transform-origin should point toward the subject, so it is a required
     thought rather than a default. Scrubbed and linear in use: the visitor sets
     the pace.

     GRADE: filters to movable targets. On a held photograph the plate moves and
     the picture does not. */
  gsap.registerEffect({
    name: "pushIn",
    extendTimeline: true,
    defaults: {
      scale: 1.14,
      y: "-4%",
      origin: "50% 50%",
      duration: DUR.large,
      ease: EASE.machine,
    },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("pushIn", config.ease);
      return gsap.fromTo(
        movable(targets),
        { scale: 1, y: "0%" },
        {
          scale: config.scale as number,
          y: config.y as string,
          transformOrigin: config.origin as string,
          duration: config.duration as number,
          ease: config.ease as string,
        },
      );
    },
  });

  /* --- depth inside one frame --------------------------------------------
     Grammar: "being drawn in", depth cut · sketch A3 / D1 lineage.

     Layers inside a single full-bleed frame move at different rates, so one
     photograph reads as a world rather than as a picture. Elements declare
     their plane with data-plane="far|mid|near"; the ratios are the token set's
     deliberately uneven 0.15 / 0.4 / 0.7, because evenly spaced ratios read as
     a slider and uneven ones read as landscape.

     `travel` caps total movement as a percentage of the viewport. The token
     rule is 15% — beyond that the page sloshes, and one janky parallax destroys
     more reverence than the effect buys.

     GRADE: filters to movable targets. */
  gsap.registerEffect({
    name: "plateParallax",
    extendTimeline: true,
    defaults: { travel: 15, duration: DUR.large, ease: EASE.machine },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("plateParallax", config.ease);
      const travel = Math.min(config.travel as number, 15);
      const [far, mid, near] = PARALLAX;
      const rate: Record<string, number> = { far, mid, near };
      const tl = gsap.timeline();
      movable(targets).forEach((el) => {
        const plane = el.dataset.plane ?? "mid";
        const ratio = rate[plane] ?? mid;
        tl.fromTo(
          el,
          { yPercent: 0 },
          {
            yPercent: -travel * ratio,
            duration: config.duration as number,
            ease: config.ease as string,
          },
          0,
        );
      });
      return tl;
    },
  });

  /* --- the scrim ---------------------------------------------------------
     Grammar: "the world opening", legibility cut · sketch X5.

     Not decoration. X5 is a readability requirement wherever copy sits on
     media, and the Living Work hi-fi marks it "non-negotiable where copy sits
     on media" on both §01 and §02. The scrim strengthens as the copy arrives
     and eases off once it has been read, so the photograph is only ever dimmed
     while it needs to be.

     Bottom-weighted by default, which is where the copy sits on both hero
     plates. Test the result against the BRIGHTEST frame of the media, not an
     average one — 4.5:1 against a bright sky is the case this exists for.

     Opacity only, so it costs nothing per frame. No grade filter: a scrim is
     not the image. */
  gsap.registerEffect({
    name: "scrimRamp",
    extendTimeline: true,
    defaults: { from: 0.25, to: 0.85, duration: DUR.large, ease: EASE.machine },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("scrimRamp", config.ease);
      return gsap.fromTo(
        targets,
        { opacity: config.from as number },
        {
          opacity: config.to as number,
          duration: config.duration as number,
          ease: config.ease as string,
        },
      );
    },
  });

  /* --- bleeding to the edge ----------------------------------------------
     Grammar: "the world opening", anchor cut · sketch L2 anchor tier.

     §06 of the hi-fi: anchor-tier images "bleed to the edge". The image starts
     inset within the column grid and grows past it as it arrives, so an anchor
     reads as bigger than the page rather than as a larger card.

     Implemented as a scale on the frame with the media counter-scaled, which is
     the same trick M2 uses and for the same reason — the alternative is
     animating width, and that is the thing that stutters. */
  gsap.registerEffect({
    name: "bleed",
    extendTimeline: true,
    defaults: { amount: 1.12, duration: DUR.large, ease: EASE.country },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("bleed", config.ease);
      const amount = config.amount as number;
      const duration = config.duration as number;
      const ease = config.ease as string;
      const tl = gsap.timeline();
      gsap.utils.toArray<HTMLElement>(targets).forEach((frame) => {
        const media = frame.querySelector<HTMLElement>("[data-frame-media]");
        tl.fromTo(frame, { scaleX: 1 }, { scaleX: amount, duration, ease }, 0);
        if (media) {
          // Counter-scale so the photograph itself is not stretched. Without
          // this the subject distorts, which on documentary photography of
          // people is not a stylistic problem but a factual one.
          tl.fromTo(media, { scaleX: 1 }, { scaleX: 1 / amount, duration, ease }, 0);
        }
      });
      return tl;
    },
  });

  /* --- time handing over -------------------------------------------------
     Grammar: "time handing over" · sketch A5 · plate P9, the dissolve pair.
     Two stacked plates cross-fade. Opacity only: the reference does this with a
     blur rack, but `filter` in the per-frame path is banned, so a soft plate is
     cross-faded against a sharp one instead. Looks the same, costs nothing.

     This is the one media effect that is CORRECT on `frame` material, and so it
     takes no grade filter. A dissolve does not deform or interrogate the image;
     it hands one whole frame to another, which is how film has always moved
     between two records. */
  gsap.registerEffect({
    name: "dissolve",
    extendTimeline: true,
    defaults: { duration: DUR.large, ease: EASE.country },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("dissolve", config.ease);
      const [from, to] = gsap.utils.toArray<HTMLElement>(targets);
      const duration = config.duration as number;
      const ease = config.ease as string;
      const tl = gsap.timeline();
      if (from) tl.to(from, { opacity: 0, duration, ease }, 0);
      if (to) tl.fromTo(to, { opacity: 0 }, { opacity: 1, duration, ease }, 0);
      return tl;
    },
  });
}
