"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  ARTWORK,
  GLYPHS,
  PHOTOS,
  PLATES,
  DESCENT_LADDER,
  WAVE_DIVIDER,
} from "@/content/kit";
import { Frame, GRADE_LABEL, type Demo } from "./demoKit";
import { MORE_DEMOS } from "./moreDemos";
import { registerYachatdacEffects, revertSplits } from "@/lib/motion/effects";
import { DUR } from "@/lib/motion/tokens";
import { SegmentedControl } from "@/components/lab/LabChrome";
import { motionOptions } from "@/components/lab/labOptions";
import { useMotionPreview } from "@/components/lab/useMotionPreview";

/**
 * /lab/effects — the motion vocabulary, running.
 *
 * The gallery exists because a table of effect names is not something Ivy can
 * design against and not something August can judge. Each panel below runs one
 * row of docs/motion/motion-grammar.md on the real artwork and photography, and
 * says which row it is.
 *
 * The preview toggle is the point as much as the effects are: switching to
 * Reduced must CUT every panel to its final state instantly. This page is the
 * reduced-motion audit for the whole vocabulary, in one scroll.
 *
 * Effects run on a replay button rather than on scroll. A gallery is for
 * comparing behaviours side by side, which means being able to fire one twice
 * without hunting for the scroll position that triggers it. The scroll-linked
 * versions live in the section modules.
 */

/**
 * The one line every panel obeys: reduced motion CUTS.
 *
 * Splits are reverted as well as styles cleared — an element that was split
 * under full motion has to go back to plain text, not to split-but-visible
 * markup, or the accessible name keeps the wrapper structure for no reason.
 */
function cut(root: HTMLElement) {
  revertSplits(root);
  gsap.set(root.querySelectorAll("[data-demo] *"), { clearProps: "all" });
}

export function EffectsGallery() {
  const { preview, setPreview, systemReduced, reduced } = useMotionPreview();

  useEffect(() => {
    registerYachatdacEffects();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 pb-32 lg:px-16">
      <div className="sticky top-0 z-20 -mx-6 mb-12 border-b border-canvas/15 bg-charcoal/95 px-6 py-4 backdrop-blur lg:-mx-16 lg:px-16">
        <SegmentedControl
          legend="Motion preview"
          options={motionOptions(systemReduced)}
          value={preview}
          onChange={setPreview}
        />
      </div>

      <Section title="The grammar, running">
        <p>
          One panel per row of{" "}
          <code className="text-ochre">docs/motion/motion-grammar.md</code>. Every
          effect is registered with{" "}
          <code className="text-ochre">gsap.registerEffect()</code>, so the name on
          the panel is the name in the code and in the table — one vocabulary, not
          three.
        </p>
      </Section>

      <div className="mt-10 space-y-8">
        {[...DEMOS, ...MORE_DEMOS].map((demo) => (
          <Panel key={demo.effect} demo={demo} reduced={reduced} />
        ))}
      </div>

      <Section title="The kit, as it now lives in the repo">
        <p>
          Everything below came out of{" "}
          <strong className="text-canvas">YACHATDAC-V2</strong> on 30 August 2026
          and had, until then, no home outside Figma. The manifest is{" "}
          <code className="text-ochre">src/content/kit.ts</code>; every entry
          carries its Figma node id so the two files can be checked against each
          other.
        </p>
      </Section>

      <KitInventory />
    </div>
  );
}

/* -------------------------------------------------------------------------
   The demos
   ------------------------------------------------------------------------- */

const heading = "Lore is not a date";
const testimony =
  "It is the floor everything above has been resting on the whole way down.";

const DEMOS: Demo[] = [
  {
    effect: "settle",
    role: "what endures",
    sketch: "B5",
    blurb:
      "A line rising from behind an edge reads as inscription. Masked at the line — never per character, which reads as technology and play.",
    render: () => (
      <p data-demo className="headline max-w-2xl text-4xl text-canvas sm:text-5xl">
        {heading}. {testimony}
      </p>
    ),
    run: (root) => {
      const el = root.querySelector<HTMLElement>("[data-demo]");
      if (el) gsap.effects.settle(el);
    },
  },
  {
    effect: "arrive",
    role: "arriving quietly",
    sketch: "X4",
    plate: "P5",
    blurb:
      "The baseline for a quiet screen, and what CMS surfaces inherit. 16px and a fade, once — re-triggering on scroll-up is the single most irritating thing a site can do.",
    render: () => (
      <div data-demo className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {PHOTOS.slice(0, 6).map((p) => (
          <Frame key={p.id} photo={p.id} className="aspect-3/2" />
        ))}
      </div>
    ),
    run: (root) => {
      const els = root.querySelectorAll<HTMLElement>("[data-demo] > *");
      gsap.effects.arrive(els);
    },
  },
  {
    effect: "emanate",
    role: "what radiates from a source",
    sketch: "L1 + L3",
    plate: "P4",
    blurb:
      "Stagger by distance from a chosen origin, not DOM order, with seeded hand jitter on top. The origin here is the centre tile — pick it deliberately per section; a default centre wastes the idea.",
    render: () => (
      <div data-demo className="grid grid-cols-4 gap-2">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="aspect-square bg-ochre/80" />
        ))}
      </div>
    ),
    run: (root) => {
      const els = root.querySelectorAll<HTMLElement>("[data-demo] > *");
      gsap.effects.emanate(els, { grid: [3, 4], from: 5 });
    },
  },
  {
    effect: "frameOpen",
    role: "the world opening",
    sketch: "M2",
    plate: "P3",
    blurb:
      "The most reusable behaviour on the site. The clip opens while the image counter-scales, so the picture is revealed rather than resized — animating width or height here is what makes an immersive site stutter.",
    render: () => (
      <div data-demo>
        <Frame photo="country-sunset-grass" className="aspect-21/9" framed />
      </div>
    ),
    run: (root) => {
      const el = root.querySelector<HTMLElement>("[data-frame]");
      if (el) gsap.effects.frameOpen(el);
    },
  },
  {
    effect: "pushIn",
    role: "being drawn in",
    sketch: "M1",
    plate: "P2",
    blurb:
      "A slow push toward the subject, scrubbed against scroll in use. Transform-origin points at what matters. Full-grade material only — on held material the plate moves and this does not.",
    render: () => (
      <div data-demo className="overflow-hidden">
        <Frame photo="work-seed" className="aspect-21/9" />
      </div>
    ),
    run: (root) => {
      const el = root.querySelector<HTMLElement>("[data-demo] img");
      if (el) gsap.effects.pushIn(el, { duration: DUR.large * 2 });
    },
  },
  {
    effect: "ground",
    role: "a change of ground",
    sketch: "X7 lineage",
    plate: "P7",
    blurb:
      "The new ground sweeps over the old. Transform only, so it is free per frame even full-bleed. This is also how the wave divider hands one era's colour to the next.",
    render: () => (
      <div data-demo className="relative h-40 overflow-hidden bg-evergreen">
        <div className="absolute inset-0 bg-oxide" />
      </div>
    ),
    run: (root) => {
      const el = root.querySelector<HTMLElement>("[data-demo] > div");
      if (el) gsap.effects.ground(el);
    },
  },
  {
    effect: "dissolve",
    role: "time handing over",
    sketch: "A5",
    plate: "P9",
    blurb:
      "Two stacked plates cross-fade. The one effect that is correct on held material: a dissolve does not deform or interrogate an image, it hands one whole frame to another — which is how film has always moved between two records.",
    render: () => (
      <div data-demo className="relative aspect-21/9">
        <Frame photo="teaching-wall-visit" className="absolute inset-0" />
        <Frame photo="escarpment-approach" className="absolute inset-0 opacity-0" />
      </div>
    ),
    run: (root) => {
      const els = root.querySelectorAll<HTMLElement>("[data-demo] > *");
      gsap.set(els[0], { opacity: 1 });
      gsap.effects.dissolve(els, { duration: DUR.large * 1.6 });
    },
  },
  {
    effect: "dim",
    role: "a person speaking",
    sketch: "Y2",
    plate: "P6",
    blurb:
      "Words undim as they are spoken. No movement at all — the world holds still while a person talks. The dim state is 0.28, not near-invisible: the unread words are still there, just not the one being said.",
    render: () => (
      <p data-demo className="max-w-2xl text-2xl leading-relaxed text-canvas">
        {testimony}
      </p>
    ),
    run: (root) => {
      const el = root.querySelector<HTMLElement>("[data-demo]");
      if (el) gsap.effects.dim(el, { duration: DUR.large });
    },
  },
  {
    effect: "hold",
    role: "the rest",
    sketch: "brief §3",
    plate: "P1 · P8",
    blurb:
      "Stillness, with a name and a duration. This looks like a no-op and is not one — an unnamed pause is indistinguishable from a section somebody forgot to animate. It is also how held material gets its weight: the plate holds, the ground and type around it move.",
    render: () => (
      <div data-demo className="relative">
        <Frame photo="engravings-hand" className="aspect-21/9" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-charcoal/80 to-transparent" />
        <p className="headline absolute bottom-6 left-6 max-w-md text-3xl text-canvas">
          Older than the record
        </p>
      </div>
    ),
    run: (root) => {
      // The record holds. The ground and the type are what move.
      const type = root.querySelector<HTMLElement>("[data-demo] p");
      const scrim = root.querySelector<HTMLElement>("[data-demo] div");
      if (scrim) gsap.effects.ground(scrim, { duration: DUR.large });
      if (type) gsap.effects.settle(type);
    },
  },
];

/* -------------------------------------------------------------------------
   Panel
   ------------------------------------------------------------------------- */

function Panel({ demo, reduced }: { demo: Demo; reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (reduced) {
      // The cut: final state, instantly. Never a slowed variant.
      cut(root);
      return;
    }
    if (count === 0) return;
    demo.run(root, reduced);
  }, [count, reduced, demo]);

  return (
    <section className="rounded-sm border border-canvas/15 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h3 className="headline text-2xl text-canvas">
            <code>{demo.effect}</code>
          </h3>
          <p className="eyebrow mt-1 text-ochre">{demo.role}</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] tracking-[0.12em] text-canvas/45 uppercase">
          <span>sketch {demo.sketch}</span>
          {demo.plate ? <span>plate {demo.plate}</span> : null}
          <button
            type="button"
            onClick={() => setCount((c) => c + 1)}
            disabled={reduced}
            className="rounded-sm border border-ochre/50 px-3 py-1.5 text-ochre normal-case transition-colors duration-(--dur-small) ease-quiet hover:bg-ochre hover:text-charcoal disabled:cursor-not-allowed disabled:border-canvas/20 disabled:text-canvas/30"
          >
            {reduced ? "cut — nothing to play" : "Replay"}
          </button>
        </div>
      </div>

      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-canvas/65">
        {demo.blurb}
      </p>

      <div ref={ref} className="mt-6">
        {demo.render(reduced)}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   Bits
   ------------------------------------------------------------------------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-20">
      <h2 className="headline text-3xl text-canvas">{title}</h2>
      <div className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-canvas/70">
        {children}
      </div>
    </div>
  );
}

function KitInventory() {
  return (
    <div className="mt-10 space-y-10">
      <Group title={`Artwork — ${ARTWORK.length} pieces`}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {[...ARTWORK, ...GLYPHS, WAVE_DIVIDER].map((a) => (
            <figure key={a.id + a.node} className="rounded-sm border border-canvas/15 p-3">
              <div className="flex h-24 items-center justify-center bg-canvas/5 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.src} alt="" className="max-h-full max-w-full object-contain" />
              </div>
              <figcaption className="mt-2 text-[10px] leading-snug text-canvas/55">
                <code className="text-ochre">{a.id}</code>
                <br />
                {a.paths} path{a.paths === 1 ? "" : "s"} · {a.node}
              </figcaption>
            </figure>
          ))}
        </div>
      </Group>

      <Group title="Plates — the image presentation patterns">
        <table className="w-full text-left text-xs text-canvas/70">
          <thead className="text-[10px] tracking-[0.12em] text-canvas/40 uppercase">
            <tr>
              <th className="py-2">Plate</th>
              <th>Title</th>
              <th>Size</th>
              <th>Effect</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {PLATES.map((p) => (
              <tr key={p.id} className="border-t border-canvas/10">
                <td className="py-2 text-ochre">{p.id}</td>
                <td>{p.title}</td>
                <td className="tabular-nums">
                  {p.width}×{p.height}
                </td>
                <td>
                  <code>{p.effect}</code>
                </td>
                <td className={p.grade === "frame" ? "text-ochre" : ""}>{p.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Group>

      <Group title="Photography — batch 1, with its grade">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {PHOTOS.map((p) => (
            <figure key={p.id}>
              <Frame photo={p.id} className="aspect-3/2" />
              <figcaption className="mt-2 text-[10px] leading-snug text-canvas/55">
                {p.subject}
                <br />
                <span className={p.grade === "frame" ? "text-ochre" : "text-eucalyptus"}>
                  {GRADE_LABEL[p.grade]}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Group>

      <Group title="The descent ladder — red is spent once">
        <div className="flex flex-wrap gap-2">
          {DESCENT_LADDER.map((c) => (
            <div key={c.id} className="w-28">
              <div className="h-14 rounded-xs" style={{ background: c.hex }} />
              <p className="mt-1 text-[10px] leading-snug text-canvas/55">
                {c.label}
                <br />
                <code>{c.hex}</code>
              </p>
            </div>
          ))}
        </div>
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="eyebrow text-canvas/45">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

