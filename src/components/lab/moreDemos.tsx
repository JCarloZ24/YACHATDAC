"use client";

import gsap from "gsap";
import { DUR } from "@/lib/motion/tokens";
import { Frame, type Demo } from "./demoKit";

/**
 * The second pass of the vocabulary — the effects added for density.
 *
 * Every one is drawn from a section of the Living Work hi-fi rather than
 * invented, so the panel blurbs double as an explanation of that page.
 */
export const MORE_DEMOS: Demo[] = [
  {
    effect: "aperture",
    role: "the world opening, type cut",
    sketch: "Y1",
    plate: "hi-fi §02",
    blurb:
      "The signature. Three stages of one growing ellipse: the counter of the 0, then the whole glyph, then the whole screen. The figure stays ordinary selectable text — the photograph only exists where the letterform lets it through.",
    render: () => (
      <div data-demo className="relative aspect-21/9 overflow-hidden bg-canvas">
        <div data-aperture className="absolute inset-0">
          <Frame photo="country-wide" className="absolute inset-0" />
        </div>
        <p className="headline absolute inset-0 flex items-center justify-end pr-8 text-[14vw] leading-none text-evergreen">
          48<span data-glyph>0</span>
        </p>
      </div>
    ),
    run: (root) => {
      const el = root.querySelector<HTMLElement>("[data-aperture]");
      const glyph = root.querySelector<HTMLElement>("[data-glyph]");
      if (el) gsap.effects.aperture(el, { glyph, duration: 2.4 });
    },
  },
  {
    effect: "breakOut",
    role: "the world opening, loud cut",
    sketch: "M2",
    plate: "P1",
    blurb:
      "Where frameOpen reveals a picture inside its frame, breakOut takes the frame away. The clip runs out past the edge rather than the box resizing, so it stays off the layout path.",
    render: () => (
      <div data-demo>
        <Frame photo="escarpment-approach" className="aspect-21/9" />
      </div>
    ),
    run: (root) => {
      const el = root.querySelector<HTMLElement>("[data-demo] > *");
      if (el) gsap.effects.breakOut(el, { duration: DUR.large * 1.5 });
    },
  },
  {
    effect: "plateParallax",
    role: "being drawn in, depth cut",
    sketch: "A3 · D1",
    blurb:
      "Layers inside one full-bleed frame move at the token ratios 0.15 / 0.4 / 0.7 — deliberately uneven, because evenly spaced ratios read as a slider and uneven ones read as landscape. Total travel is capped at 15% of the viewport, past which the page sloshes.",
    render: () => (
      <div data-demo className="relative aspect-21/9 overflow-hidden">
        <Frame photo="country-wide" className="absolute inset-0" />
        <div
          data-plane="near"
          className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-charcoal to-transparent"
        />
      </div>
    ),
    run: (root) => {
      const planes = root.querySelectorAll<HTMLElement>("[data-plane]");
      gsap.effects.plateParallax(planes, { duration: DUR.large * 2 });
    },
  },
  {
    effect: "groundRamp",
    role: "a change of ground, scrubbed",
    sketch: "hi-fi §03",
    blurb:
      "Bone to dust to dry earth, walked across four screens. The colour is the argument — that section is about drought and erosion, and the page dries out while you read it. Animates a CSS custom property, so the value can feed a background or a gradient without this effect knowing which.",
    render: () => (
      <div
        data-demo
        className="flex h-40 items-end p-6"
        style={{ background: "var(--ground, #f6f6ec)" }}
      >
        <p className="text-xs tracking-widest text-evergreen uppercase">
          the ground thins
        </p>
      </div>
    ),
    run: (root) => {
      const el = root.querySelector<HTMLElement>("[data-demo]");
      if (el)
        gsap.effects.groundRamp(el, {
          stops: ["#f6f6ec", "#e3dcc9", "#c9b79a", "#8a7455"],
          duration: DUR.large * 3,
        });
    },
  },
  {
    effect: "stickyIndex",
    role: "a change of ground, index cut",
    sketch: "hi-fi §07",
    blurb:
      "An index that stays on screen while its sections pass, lighting the current one. The reader always knows where they are, which is what makes a 360vh stretch feel navigable rather than endless.",
    render: () => (
      <ol data-demo className="space-y-2">
        {["01 Water", "02 Roads", "03 Power", "04 Communications"].map((s) => (
          <li
            key={s}
            data-index-item
            className="text-xs tracking-widest text-canvas uppercase"
          >
            {s}
          </li>
        ))}
      </ol>
    ),
    run: (root) => {
      const items = root.querySelectorAll<HTMLElement>("[data-index-item]");
      gsap.effects.stickyIndex(items, { duration: DUR.medium });
    },
  },
  {
    effect: "stepCounter",
    role: "accumulating",
    sketch: "X3",
    plate: "hi-fi §05",
    blurb:
      "Eight days a spring ran, one per step. The numeral is swapped, never tweened — a day is a discrete thing and a half-transitioned 3.5 is a lie about what is being counted. Snapped in use, so the reader is never stranded on a day that does not exist.",
    render: () => (
      <div data-demo className="relative h-28">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((d) => (
          <p
            key={d}
            data-step
            className="headline absolute inset-0 text-6xl text-canvas"
          >
            Day {d}
          </p>
        ))}
      </div>
    ),
    run: (root) => {
      const steps = root.querySelectorAll<HTMLElement>("[data-step]");
      gsap.effects.stepCounter(steps, { duration: DUR.medium });
    },
  },
  {
    effect: "vesselFill",
    role: "accumulating",
    sketch: "hi-fi §08",
    blurb:
      "Five vessels, four filling — 78, 58, 42, 26, and one at 0 that has not started. The fifth staying empty is the honest part of that section. A mark moves to a position and no text counts upward, which is what keeps this clear of the ban on odometers over figures of loss.",
    render: () => (
      <div data-demo className="space-y-4">
        {(
          [
            ["Biological Sequestration", 78],
            ["Biodiversity credits", 58],
            ["IPA designation", 42],
            ["Fee-for-service", 26],
            ["Rainbow Credits", 0],
          ] as const
        ).map(([label, fill]) => (
          <div key={label}>
            <p
              data-vessel-label
              className="text-xs tracking-widest text-canvas/70 uppercase"
            >
              {label}
            </p>
            <div className="mt-2 h-px w-full bg-canvas/20">
              <div
                data-vessel
                data-fill={fill}
                className="h-px w-full origin-left bg-ochre"
              />
            </div>
          </div>
        ))}
      </div>
    ),
    run: (root) => {
      const marks = root.querySelectorAll<HTMLElement>("[data-vessel]");
      const labels = root.querySelectorAll<HTMLElement>("[data-vessel-label]");
      gsap.effects.arrive(labels, { duration: DUR.medium });
      gsap.effects.vesselFill(marks, { duration: DUR.large });
    },
  },
  {
    effect: "scatterResolve",
    role: "what radiates, grid cut",
    sketch: "B2",
    blurb:
      "Images arrive off their final positions and settle into the grid. Offsets are seeded rather than random, so the page scatters identically on every load — random per load makes a screenshot test flap and shows two reviewers two different designs.",
    render: () => (
      <div data-demo className="grid grid-cols-4 gap-2">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="aspect-square bg-eucalyptus/70" />
        ))}
      </div>
    ),
    run: (root) => {
      const els = root.querySelectorAll<HTMLElement>("[data-demo] > *");
      gsap.effects.scatterResolve(els, { duration: DUR.large });
    },
  },
];
