"use client";

import { useEffect, useState } from "react";
import { loreMarker } from "@/content/truth";

/**
 * The record trail — the wireframe's full left-edge timeline (588×32768
 * asset + build notes, 2026-09-02). Three parts:
 *
 *   · the legend — "LORE — CONTINUOUS" — STATIC at the top of the trail; it
 *     scrolls away with the page and never follows the reader;
 *   · the LEFT dotted strand — the scroll indicator: faint dots the whole
 *     way down, with gold ink flowing through them to exactly where the
 *     reader stands ([data-v2-trail-fill], clipped open by the motion
 *     module with a short liquid lag);
 *   · the RIGHT gray dotted strand — footsteps: it does not exist ahead of
 *     the reader; the dots (and the dust scattered around them) are laid
 *     down as the reader travels ([data-v2-steps-fill], same clip, tighter
 *     lag so the dust trails the ink).
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

/** The strands surface below the wordmark rather than running over it: the
 *  dots fade in from nothing across this band (viewport-anchored — the header
 *  logo sits in the first ~100px of the page). */
const STRAND_FADE = "linear-gradient(to bottom, transparent 100px, black 230px)";
const strandFade = { maskImage: STRAND_FADE, WebkitMaskImage: STRAND_FADE };

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

  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-descent-root]");
    if (!root) return;

    let tops: Array<{ anchor: string; top: number }> = [];

    const measure = () => {
      const rootTop = root.getBoundingClientRect().top + window.scrollY;
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
        const rect = heading.getBoundingClientRect();
        return [
          {
            anchor,
            top: rect.top + rect.height / 2 + window.scrollY - rootTop,
          },
        ];
      });
      setMarks(tops);
      const breakEl = document.getElementById("break-escarpment");
      const resume = tops.find((mark) => mark.anchor === "mitchell");
      setGap(
        breakEl && resume
          ? [
              breakEl.getBoundingClientRect().top + window.scrollY - rootTop,
              resume.top,
            ]
          : null,
      );
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

  // The container (and both fill hooks) renders from the first paint even
  // though the strands wait on measurement — the motion module's init runs
  // before this component's measuring effect can re-render, and it must
  // find [data-v2-trail-fill] and [data-v2-steps-fill] then.
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

      {/* Left strand base — the path not yet travelled. */}
      {height > 0 ? (
        <svg
          width={RAIL_W}
          height={height}
          viewBox={`0 0 ${RAIL_W} ${height}`}
          fill="none"
          className="absolute left-0 top-0 text-canvas/15"
          style={strandFade}
        >
          <path
            d={strandPath(height, INK_X, 0)}
            stroke="currentColor"
            strokeWidth={4.5}
            strokeLinecap="round"
            strokeDasharray="0.1 9.9"
          />
        </svg>
      ) : null}

      {/* Both fill wrappers render from the first paint, empty until
          measured — the motion module wires their clips at init and must
          find them then. */}
      {/* Left strand ink — gold, flowing to where the reader stands. */}
      <div
        data-v2-trail-fill
        className="absolute left-0 top-0"
        style={{ clipPath: "inset(0% 0% 100% 0%)", ...strandFade }}
      >
        {height > 0 ? (
          <svg
            width={RAIL_W}
            height={height}
            viewBox={`0 0 ${RAIL_W} ${height}`}
            fill="none"
            className="text-gold/85"
          >
            <path
              d={strandPath(height, INK_X, 0)}
              stroke="currentColor"
              strokeWidth={4.5}
              strokeLinecap="round"
              strokeDasharray="0.1 9.9"
            />
          </svg>
        ) : null}
      </div>

      {/* Right strand — footsteps and dust, laid down behind the reader.
          No base layer: the steps don't exist ahead. */}
      <div
        data-v2-steps-fill
        className="absolute left-0 top-0"
        style={{ clipPath: "inset(0% 0% 100% 0%)", ...strandFade }}
      >
        {height > 0 ? (
          <svg
            width={RAIL_W}
            height={height}
            viewBox={`0 0 ${RAIL_W} ${height}`}
            fill="none"
            className="text-canvas/35"
          >
            {/* The strand goes under at the escarpment break and surfaces
                again at the 1840s — two runs, nothing drawn between. */}
            {(gap
              ? [
                  [0, gap[0]],
                  [gap[1], height],
                ]
              : [[0, height]]
            ).map(([from, to]) => (
              <path
                key={from}
                d={strandPath(to, STEP_X, 0.9, from)}
                stroke="currentColor"
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeDasharray="0.1 12"
              />
            ))}
          </svg>
        ) : null}
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
