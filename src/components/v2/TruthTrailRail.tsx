"use client";

import { useEffect, useState } from "react";
import { loreMarker } from "@/content/truth";

/**
 * The record trail — the wireframe's full left-edge timeline (588×32768
 * asset + build notes, 2026-09-02). Three parts:
 *
 *   · the legend — "LORE — CONTINUOUS" — STATIC at the top of the trail; it
 *     scrolls away with the page and never follows the reader;
 *   · the LEFT dotted strand — LORE · continuous: the record itself, static
 *     ochre (#CB7722) the whole page, never breaks, not even at the count;
 *   · the RIGHT dotted strand — RECORD: the scroll indicator. Faint dots
 *     ahead (off-white, 0.45), the lore ochre (#CB7722) filling through them to the
 *     reading line as the reader travels ([data-v2-steps-fill], clipped
 *     open by the motion module, scroll-derived, both directions). It goes
 *     under at the escarpment break and resumes at the 1840s.
 *
 * Every timeline mark anchors beside its actual section — AHEAD sits next
 * to "What is being built", the years next to their entries — measured from
 * the live DOM and re-measured on resize. Active state is computed here
 * (the marks are finer-grained than the six descent bands, so the descent
 * module's band states no longer fit them).
 *
 * The fill is scroll position, both directions: jumping to "Start from the
 * beginning" smooth-scrolls down and the ink flows down with it; scrolling
 * back up drains it. The clip is derived from scroll each frame, so it
 * cannot run backwards or desync — the reversal bug the build note warns
 * about cannot occur with a scroll-derived clip.
 *
 * Decorative wayfinding: aria-hidden, pointer-events-none, lg and up only.
 */

/** Subs are the entries' own whens — the timeline description each mark
 *  carries now that the sections no longer repeat them. */
const MARKS: Array<{ anchor: string; label: string; sub?: string }> = [
  { anchor: "research", label: "Ahead", sub: "Within five years" },
  // Today carries no mark — its ENTRY plate (04) sets TODAY · NOW on the
  // frame itself, and the pointer doubled it right beside the headline.
  // 2026 carries no mark — like Today, its ENTRY plate (09) sets
  // 2026 · BOUGHT BACK on the frame itself. Ground records keep theirs:
  // pointers render textless now, aligned beside each record's era block.
  { anchor: "study-2022", label: "2022" },
  { anchor: "renamed", label: "2020", sub: "1 October 2020" },
  { anchor: "just-us", label: "2019", sub: "2:30pm, 30 April 2019" },
  { anchor: "father", label: "2003" },
  { anchor: "art-gallery", label: "1950s" },
  // 1902 carries no mark: the footsteps strand goes under from the
  // escarpment break and does not resume until the 1840s (the count band's
  // own note), so there is no strand for a pointer to sit on.
  { anchor: "mitchell", label: "1840s" },
  { anchor: "engraving", label: "Older than the record" },
  { anchor: "beginning", label: "100 million years ago" },
];

/** Strand geometry — dot size/spacing from the designed asset (~4.5px dots
 *  every ~10px); two strands share the wander, offset like the asset's pair. */
const RAIL_W = 160;
const INK_X = 40; // left strand centre
const STEP_X = 72; // right strand centre
const AMPLITUDE = 8;
const WAVELENGTH = 214;
const SAMPLE = 12;

/**
 * LORE · continuous — never breaks, not even at the count. The frame's own
 * CSS (2026-09-03): a full-page strand at #CB7722, surfacing at y147.75
 * (under the wordmark) and fading in over 0.94% of the height, holding to
 * 99.06%, fading out before the footer's crest rises over the page's
 * foot. Static: this is the record, not the reader.
 */
const LORE_COLOR = "#CB7722";
const LORE_TOP = 148;
function loreFade(height: number, end: number) {
  const ramp = Math.max(height * 0.0094, 120);
  /* `end` is the footer's crest: the line is gone before the wave rises. */
  const image = `linear-gradient(to bottom, transparent ${LORE_TOP}px, black ${
    LORE_TOP + ramp
  }px, black ${end - ramp * 2}px, transparent ${end}px)`;
  return { maskImage: image, WebkitMaskImage: image };
}

/**
 * RECORD · S1 · dots ahead (faint) — the frame's CSS (2026-09-03): the
 * footsteps strand DOES exist ahead of the reader, faintly — off-white at
 * 0.45, fading in over the first 2.98% of the run and out over the last
 * 2.98%. S1 runs from under the wordmark (y147.75) to the escarpment break;
 * the strand goes under through the count and S2 resumes at the 1840s.
 * The laid-down steps (data-v2-steps-fill) draw over this at full.
 */
const AHEAD_RAMP = 0.0298;
function aheadFade(from: number, to: number) {
  const ramp = Math.max((to - from) * AHEAD_RAMP, 60);
  const image = `linear-gradient(to bottom, transparent ${from}px, black ${
    from + ramp
  }px, black ${to - ramp}px, transparent ${to}px)`;
  return { maskImage: image, WebkitMaskImage: image };
}

/** An element's layout top relative to the descent root, ignoring transforms:
 *  entries arrive translated 24px down ([data-descent-arrive], L4) and the
 *  rail measures them before they arrive — a bounding rect would put every
 *  pointer 24px below its year line. offsetTop is layout, not transform. */
function layoutTop(el: HTMLElement, root: HTMLElement): number {
  let top = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

function strandX(y: number, center: number, phase: number): number {
  return center + AMPLITUDE * Math.sin((y / WAVELENGTH) * Math.PI * 2 + phase);
}

function strandPath(
  height: number,
  center: number,
  phase: number,
  from = 0,
): string {
  const pts: string[] = [`M ${strandX(from, center, phase)} ${from}`];
  for (let y = from + SAMPLE; y <= height; y += SAMPLE) {
    pts.push(`L ${strandX(y, center, phase).toFixed(1)} ${y}`);
  }
  return pts.join(" ");
}

export function TruthTrailRail() {
  const [height, setHeight] = useState(0);
  const [left, setLeft] = useState(0);
  const [marks, setMarks] = useState<
    Array<{ anchor: string; top: number }>
  >([]);
  const [active, setActive] = useState(0);
  /** Where the footsteps strand goes under: from the top of the escarpment
   *  break, through the count, back at the 1840s mark. [start, end] in rail
   *  coordinates; null until measured (or if either anchor is absent). */
  const [gap, setGap] = useState<[number, number] | null>(null);
  /** Where the two strands end (the 20 frame). The footsteps strand stops
   *  under the "Underneath all of it" heading — the reader has arrived; the
   *  ink strand runs on and fades out above the footer's crest, which rides
   *  the foot of the page. Rail coordinates; null until measured. */
  const [ends, setEnds] = useState<{ steps: number; ink: number } | null>(
    null,
  );

  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-descent-root]");
    if (!root) return;

    let tops: Array<{ anchor: string; top: number }> = [];

    const measure = () => {
      setHeight(root.offsetHeight);
      // The strand pair centres on the "C" of the YACHATDAC wordmark (its
      // third letter): the descent drops out of the logo's own letterform.
      // More than one wordmark is in the DOM (the mobile bar's is first but
      // display:none at lg, measuring a zero rect), so take the visible one.
      // Falls back to the content container's margin if the logo is absent.
      const logo = [
        ...document.querySelectorAll<HTMLElement>('img[src*="logo-wordmark"]'),
      ].find((el) => el.getBoundingClientRect().width > 0);
      if (logo) {
        const rect = logo.getBoundingClientRect();
        const aCenter = rect.left + rect.width * (2.5 / 9); // "C", 3rd of 9 letters
        const pairCenter = (INK_X + STEP_X) / 2;
        setLeft(Math.max(Math.round(aCenter - pairCenter), 0));
      } else {
        const section = document.getElementById("research");
        setLeft(
          section ? Math.max(section.getBoundingClientRect().left, 0) : 0,
        );
      }
      tops = MARKS.flatMap(({ anchor }) => {
        const el = document.getElementById(anchor);
        if (!el) return [];
        // Align the mark with the record's gutter era block (era + sub, the
        // 06 frame) where one renders; otherwise the section's own heading —
        // never the section box, whose top includes its padding.
        const heading =
          el.querySelector<HTMLElement>("[data-era-label]") ??
          el.querySelector<HTMLElement>("h1, h2, h3") ??
          el;
        return [
          {
            anchor,
            top: layoutTop(heading, root) + heading.offsetHeight / 2,
          },
        ];
      });
      setMarks(tops);
      // The strand goes under from the top of the escarpment break and
      // surfaces again UNDER THE COUNT — at the navy wave that closes the
      // count band — running through the wave and down to the 1840s
      // pointer, so the line connects the count to the 1840s.
      const breakEl = document.getElementById("break-escarpment");
      // The wave is an <svg>: no offset geometry, so measure it by rect. Its
      // box is charcoal above the crest, and at the rail's x the crest sits
      // near the box's foot — so the run starts at the foot, where the navy
      // is solid, and nothing strays onto the charcoal above.
      const wave = document.querySelector<SVGElement>("[data-count-wave]");
      const rootRectTop = root.getBoundingClientRect().top;
      const resumeTop = wave
        ? wave.getBoundingClientRect().bottom - rootRectTop
        : (() => {
            const band = document.querySelector<HTMLElement>(
              '[data-descent-band="before-record"]',
            );
            return band ? layoutTop(band, root) : null;
          })();
      setGap(
        breakEl && resumeTop !== null
          ? [layoutTop(breakEl, root), resumeTop]
          : null,
      );
      // The footer's wave block (13.9vw) is pulled up over the page's foot:
      // the ink must be gone before it.
      const crest = root.offsetHeight - window.innerWidth * 0.139;
      // The record strand fades out and is gone before UNDERNEATH ALL OF
      // IT begins: the reader has arrived. The lore line runs on alone.
      const floor = document.getElementById("underneath-all-of-it");
      setEnds({
        steps: floor ? layoutTop(floor, root) : crest,
        ink: crest,
      });
    };

    // The reading line: a mark lights when its section crosses mid-viewport.
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const line = window.scrollY + window.innerHeight * 0.6;
        let index = 0;
        tops.forEach((mark, i) => {
          if (mark.top <= line) index = i;
        });
        setActive(index);
      });
    };

    measure();
    onScroll();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // The container (and the fill hook) renders from the first paint even
  // though the strands wait on measurement — the motion module's init runs
  // before this component's measuring effect can re-render, and it must
  // find [data-v2-steps-fill] then.
  /* The record strand's runs — from under the wordmark to the escarpment
     break, and from the 1840s to the strand's end. The faint base and the
     colour fill both draw exactly these, so their dots coincide. */
  const recordRuns: Array<[number, number]> = gap
    ? [
        [LORE_TOP, gap[0]],
        [gap[1], ends?.steps ?? height],
      ]
    : [[LORE_TOP, ends?.steps ?? height]];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 z-20 hidden lg:block"
      style={{ width: RAIL_W + 220, left }}
    >
      {/* The legend never breaks — and never moves: it sits at the top of
          the trail and scrolls away with the page. Marc's hand-set
          LORE · CONTINUOUS cut (2026-09-02) replaces the typeset version. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
      <img
        src="/artwork/lore-legend.svg"
        alt={loreMarker}
        className="absolute left-4 top-36 w-7"
        loading="lazy"
      />

      {/* Left strand — LORE · continuous. The full record at #CB7722, edge
          to edge of the page; it never breaks, not even at the count. */}
      {height > 0 ? (
        <svg
          width={RAIL_W}
          height={height}
          viewBox={`0 0 ${RAIL_W} ${height}`}
          fill="none"
          className="absolute left-0 top-0"
          style={loreFade(height, ends?.ink ?? height)}
        >
          <path
            d={strandPath(height, INK_X, 0)}
            stroke={LORE_COLOR}
            strokeWidth={4.5}
            strokeLinecap="round"
            strokeDasharray="0.1 9.9"
          />
        </svg>
      ) : null}

      {/* The lore strand carries no fill: it is the record, static. The
          scroll indicator is the RECORD strand beside it. */}

      {/* Right strand base — RECORD · S1/S2 · dots ahead (faint): the run
          from the wordmark to the escarpment break, and the run from the
          1840s to the strand's end. Nothing between — the count. */}
      {height > 0
        ? recordRuns.map(([from, to]) => (
            <svg
              key={`ahead-${from}`}
              width={RAIL_W}
              height={height}
              viewBox={`0 0 ${RAIL_W} ${height}`}
              fill="none"
              className="absolute left-0 top-0 text-canvas opacity-45"
              style={aheadFade(from, to)}
            >
              <path
                d={strandPath(to, STEP_X, 0.9, from)}
                stroke="currentColor"
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeDasharray="0.1 12"
              />
            </svg>
          ))
        : null}

      {/* RECORD strand fill — the scroll indicator: the lore ochre flowing
          through the faint dots to the reading line, in both directions
          ([data-v2-steps-fill], clipped open by the motion module and
          derived from scroll each frame). Renders from the first paint,
          empty until measured — the module wires the clip at init. */}
      <div
        data-v2-steps-fill
        className="absolute left-0 top-0"
        /* Sized explicitly: the runs inside are absolutely positioned, and a
           clip-path in percentages needs a box to clip. */
        style={{ width: RAIL_W, height, clipPath: "inset(0% 0% 100% 0%)" }}
      >
        {/* The SAME runs and the SAME fades as the faint base — so the
            colour lands on the dots, not between them, and fades out before
            the count, back in at the 1840s, and away under "Underneath all
            of it" exactly where the base does. */}
        {height > 0
          ? recordRuns.map(([from, to]) => (
              <svg
                key={`fill-${from}`}
                width={RAIL_W}
                height={height}
                viewBox={`0 0 ${RAIL_W} ${height}`}
                fill="none"
                className="absolute left-0 top-0"
                style={{ color: LORE_COLOR, ...aheadFade(from, to) }}
              >
                <path
                  d={strandPath(to, STEP_X, 0.9, from)}
                  stroke="currentColor"
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  strokeDasharray="0.1 12"
                />
              </svg>
            ))
          : null}
      </div>

      {/* Timeline marks — each aligned with its record's gutter era block.
          The pointer carries NO text (2026-09-02): the record's own era and
          sub sit right beside it, and the labels read twice. Its trailing
          dots lead the eye to the record's gutter instead. */}
      {marks.map((mark, i) => {
        const state = i < active ? "passed" : i === active ? "active" : "ahead";
        return (
          <div
            key={mark.anchor}
            data-state={state}
            className="group absolute flex -translate-y-1/2 items-center"
            style={{ top: mark.top, left: strandX(mark.top, STEP_X, 0.9) - 22 }}
          >
            {/* The pointer artwork — static (2026-09-02): no burst-in, no
                state fade; it simply sits on the footsteps strand beside
                its record's era block. */}
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
            <img
              src="/artwork/trail-point.svg"
              alt=""
              className="w-24 max-w-none"
              loading="lazy"
            />
          </div>
        );
      })}
    </div>
  );
}
