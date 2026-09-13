"use client";

/**
 * Type at scale.
 *
 * Grammar row: "what endures", display cuts — type as the loud channel.
 *
 * The Living Work hi-fi's §02 is the reason this family exists. THE APERTURE:
 * a figure set at 480px, its `0` a portal onto the plain, opening in three
 * stages — "the counter of the 0, then the whole glyph, then the whole screen."
 * Type is not labelling the photograph there; it is the window onto it.
 *
 * EVERYTHING HERE IS TRANSFORM, OPACITY OR CLIP-PATH. Y1's spec says
 * "background-position scrubbed" and Y6's says variable font axes, and both of
 * those repaint or reflow every frame. The per-frame rule wins over the letter
 * of a sketch, so `knockout` translates a media layer behind masked type
 * instead, and `velocityDrift` moves type rather than re-weighting it. Same
 * intent, same look, none of the cost. See the note on velocityDrift.
 */

import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { DUR, EASE } from "../tokens";
import { assertEase, first, movable, noise } from "./shared";

gsap.registerPlugin(ScrambleTextPlugin);

/**
 * Counter and glyph proportions of a heavy grotesque zero, as fractions of the
 * glyph's own box. Tuned to Block Berthold, which is the display face.
 *
 * Tuned against the rendered face at /lab/compose?screen=aperture rather than
 * derived: a counter is not a fixed fraction of an em, it is whatever the
 * punchcutter drew, and the only honest way to seat an ellipse inside one is to
 * look at it.
 *
 * These are ratios rather than the design's fixed `x=833` on purpose. Block
 * Berthold is gitignored (decision F5), so on a machine without it the glyph
 * falls back to a different face at a different width — and a hardcoded pixel
 * centre would put the aperture somewhere in the middle of the "8". Measuring
 * the rendered glyph means the portal lands in the counter whatever face wins.
 *
 * The caller must still wait for document.fonts.ready before building, or the
 * measurement is taken against the fallback and then the real face swaps in
 * underneath it.
 */
const ZERO = {
  counterRx: 0.17,
  counterRy: 0.22,
  glyphRx: 0.56,
  glyphRy: 0.6,
} as const;

/**
 * The three clip states of the aperture, measured from the rendered glyph.
 *
 * Exported so a recipe can stage the opening against its own choreography —
 * the hi-fi's §02 ties each stage to a specific figure (keyhole while 120
 * stands, glyph while 480 stands, screen while 2019 runs past the margin),
 * and the effect's fixed 0.45/0.55 split cannot express a hold between them.
 */
export function apertureClips(
  container: HTMLElement,
  glyph: HTMLElement | null,
): { counter: string; whole: string; screen: string } {
  const box = container.getBoundingClientRect();
  const g = glyph?.getBoundingClientRect();

  // Centre of the counter, in the container's own percentage space.
  const cx = g ? ((g.left - box.left + g.width / 2) / box.width) * 100 : 50;
  const cy = g ? ((g.top - box.top + g.height / 2) / box.height) * 100 : 50;

  const pct = (v: number, of: number) => (v / of) * 100;
  const counter = g
    ? `ellipse(${pct(g.width * ZERO.counterRx, box.width)}% ${pct(g.height * ZERO.counterRy, box.height)}% at ${cx}% ${cy}%)`
    : `ellipse(6% 10% at ${cx}% ${cy}%)`;
  const whole = g
    ? `ellipse(${pct(g.width * ZERO.glyphRx, box.width)}% ${pct(g.height * ZERO.glyphRy, box.height)}% at ${cx}% ${cy}%)`
    : `ellipse(16% 26% at ${cx}% ${cy}%)`;
  // Big enough to clear the corners from an off-centre origin.
  const screen = `ellipse(150% 150% at ${cx}% ${cy}%)`;

  return { counter, whole, screen };
}

export function registerType(): void {
  /* --- the aperture ------------------------------------------------------
     Grammar: "the world opening", type cut · sketch Y1 · hi-fi §02.

     Three stages, one growing ellipse:
       1. the counter of the 0   — a portal the size of the hole in the glyph
       2. the whole glyph        — the 0 becomes the window
       3. the whole screen       — the photograph takes everything

     One shape function throughout, because clip-path cannot tween between
     ellipse() and inset() — they are different functions and GSAP would swap
     rather than interpolate. An ellipse that grows does all three stages
     continuously, which is also what the design describes: it opens, it does
     not cut between sizes.

     The caller passes the container to clip; `glyph` is the element whose box
     is measured for stages 1 and 2. Reduced motion never builds this — the cut
     shows the photograph already open, which is stage 3 and reads correctly on
     its own. */
  gsap.registerEffect({
    name: "aperture",
    extendTimeline: true,
    defaults: { glyph: null, duration: DUR.large * 2, ease: EASE.machine },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("aperture", config.ease);
      const container = first(targets);
      const glyph = config.glyph as HTMLElement | null;
      const tl = gsap.timeline();
      if (!container) return tl;

      const { counter, whole, screen } = apertureClips(container, glyph);

      const duration = config.duration as number;
      const ease = config.ease as string;
      tl.fromTo(container, { clipPath: counter }, { clipPath: whole, duration: duration * 0.45, ease })
        .to(container, { clipPath: screen, duration: duration * 0.55, ease });
      return tl;
    },
  });

  /* --- knockout ----------------------------------------------------------
     Grammar: "what endures", knockout cut · sketch Y1.

     Image seen through type. The markup does the masking — SVG <mask> with the
     text in it, or background-clip:text with a solid-colour fallback declared —
     and this effect moves the media layer *inside* that mask so the picture
     drifts behind the letterforms.

     Y1's spec says to scrub background-position. This translates a child
     instead: same appearance, transform path, and it works identically whether
     the mask is SVG or CSS. A solid-colour fallback is still required in the
     stylesheet — if the mask fails, unreadable white-on-white is the failure
     mode, and that is not acceptable on a headline. */
  gsap.registerEffect({
    name: "knockout",
    extendTimeline: true,
    defaults: { travel: 8, duration: DUR.large, ease: EASE.machine },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("knockout", config.ease);
      const media = gsap.utils
        .toArray<HTMLElement>(targets)
        .flatMap((el) =>
          Array.from(el.querySelectorAll<HTMLElement>("[data-knockout-media]")),
        );
      return gsap.fromTo(
        movable(media.length ? media : targets),
        { yPercent: config.travel as number },
        {
          yPercent: -(config.travel as number),
          duration: config.duration as number,
          ease: config.ease as string,
        },
      );
    },
  });

  /* --- ghost type --------------------------------------------------------
     Grammar: "what endures", ground cut · sketch Y1 lineage, Lumen 6-9.

     Oversized letterforms sitting behind content and drifting at a different
     rate, so the page has a layer under the layer. Loud in scale, quiet in
     movement — the drift is slow and small, because the job is depth, not
     attention. A ghost word that races the content is competing with it.

     Decorative by definition, so callers mark it aria-hidden: the word is
     already in the heading it sits behind, and a screen reader hearing it twice
     is being told the design, not the content. */
  gsap.registerEffect({
    name: "ghostType",
    extendTimeline: true,
    defaults: { travel: 12, opacity: 0.06, duration: DUR.large, ease: EASE.machine },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("ghostType", config.ease);
      const duration = config.duration as number;
      const ease = config.ease as string;
      const tl = gsap.timeline();
      tl.fromTo(
        targets,
        { yPercent: config.travel as number },
        { yPercent: -(config.travel as number), duration, ease },
        0,
      );
      tl.fromTo(
        targets,
        { opacity: 0 },
        { opacity: config.opacity as number, duration: duration * 0.3, ease: EASE.country },
        0,
      );
      return tl;
    },
  });

  /* --- velocity drift ----------------------------------------------------
     Grammar: "what endures", velocity cut · sketch Y6, reinterpreted.

     Y6 asks for scroll velocity to nudge the tracking and weight of display
     lines through Work Sans's variable axes. Its own status row says
     "variation-settings can trigger layout; perf-gate it, hero lines only" —
     and animating a variable axis reflows the line every frame it changes,
     which is exactly the per-frame rule this project does not bend.

     So this delivers the intent on the transform path: display lines drift
     horizontally with scroll velocity and settle when the reader stops. Type
     that responds to how fast you are reading, without re-laying-out the line
     to do it. It is the same mechanic the type river already uses.

     Caller passes the current velocity; the section module owns the
     ScrollTrigger that supplies it. */
  gsap.registerEffect({
    name: "velocityDrift",
    extendTimeline: true,
    defaults: { velocity: 0, max: 14, duration: DUR.small, ease: EASE.quiet },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("velocityDrift", config.ease);
      const max = config.max as number;
      const x = gsap.utils.clamp(-max, max, (config.velocity as number) / 180);
      return gsap.to(targets, {
        x,
        duration: config.duration as number,
        ease: config.ease as string,
        stagger: { each: 0.02, from: "start" },
      });
    },
  });

  /* --- the name resolves ---------------------------------------------------
     Grammar: "what endures", the name resolves · sketch ENT-07, released by F9.

     A name arrives as noise and resolves into itself. Spent ONCE on the site —
     About §02's legal name — because there the copy is already the joke: the
     draft sets the full name and then says "Most people say YACHATDAC", so the
     resolve is the sentence's own argument rather than an effect laid over it.

     ⚠ THIS SPLITS NOTHING, and that is the whole reason it can carry a line
     this long. `display`'s six-word cap exists because a CHARACTER SPLIT of a
     long line reads as a gimmick and wrecks the measure; ScrambleText rewrites
     the text in place, so the guard neither applies nor may be borrowed. It
     also means `freshSplit`'s one-split-per-element rule is not in play here.

     ⚠ NEVER ON A PERSON'S NAME (ART-DIRECTION §6) and never on testimony. F9
     licenses this for names of organisations, headings and interface text.

     THE TARGET STRING IS READ FROM THE DOM, never passed in — the copy is
     CMS-editable (D12) and the markup is the only place it may live. The
     caller is responsible for the accessible name: put the real string on a
     parent's `aria-label` and `aria-hidden` the run this animates, which is
     the same contract SplitText's `aria: "auto"` gives the rest of this file.
     Rewriting text without that lets assistive tech read noise.

     Mixed case, and spaces are left alone, so word lengths survive the
     scramble and the reader can see it is a name before they can read it. */
  gsap.registerEffect({
    name: "decode",
    extendTimeline: true,
    defaults: { duration: DUR.large, ease: EASE.machine, revealDelay: 0 },
    effect: (targets: object, config: Record<string, unknown>) => {
      assertEase("decode", config.ease);
      const el = first(targets);
      if (!el) return gsap.timeline();
      // Captured once, at build. Re-reading mid-tween would read the scramble
      // back as the target and the line would never resolve.
      const text = el.dataset.decodeText ?? el.textContent ?? "";
      el.dataset.decodeText = text;

      // ⚠ THE FIRST FRAME HAS TO BE NOISE, and neither the tween nor
      // `immediateRender` delivers it. A timeline renders a tween sitting at
      // position 0 as not-yet-active while its own time is exactly 0, so a
      // scrubbed decode showed the fully RESOLVED name at progress 0 and only
      // scrambled once the reader moved — the exact inverse of the board's
      // frame 01, "THE NAME, UNRESOLVED" (measured, 12 September 2026). So the
      // opening scramble is written here, at build, and ScrambleText takes
      // over the instant time moves off zero. Both are noise, so the handover
      // is invisible.
      //
      // Seeded from the index rather than Math.random: a reload, a screenshot
      // test and a reviewer's machine should agree, which is the same reason
      // `noise()` exists in shared.ts. Spaces are left alone so word lengths
      // survive and the reader can see it is a name before they can read it.
      const CHARS =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      el.textContent = Array.from(text)
        .map((ch, i) =>
          ch === " " ? ch : CHARS[Math.floor(noise(i + 1) * CHARS.length)],
        )
        .join("");
      return gsap.to(el, {
        duration: config.duration as number,
        ease: config.ease as string,
        // ⚠ WITHOUT THIS THE FIRST FRAME IS THE ANSWER. A `to` tween does not
        // record or apply its start state until time moves off zero, so a
        // scrubbed decode sitting at position 0 showed the fully RESOLVED name
        // at progress 0 and only scrambled once the reader had moved — the
        // exact inverse of the board's frame 01, "THE NAME, UNRESOLVED"
        // (measured, 12 September 2026). Rendering immediately puts the noise
        // on screen before the reader arrives at the section.
        immediateRender: true,
        scrambleText: {
          text,
          chars: "upperAndLowerCase",
          speed: 0.45,
          revealDelay: config.revealDelay as number,
        },
      });
    },
  });
}
