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
 *     ahead (charcoal, 0.25 — they were off-white at 0.45 until the page went
 *     to one egg-white ground, where off-white on off-white drew nothing),
 *     the lore ochre (#CB7722) filling through them to the
 *     reading line as the reader travels ([data-v2-steps-fill], clipped
 *     open by the motion module, scroll-derived, both directions). It goes
 *     under at the escarpment break and resumes at the 1840s.
 *
 * One trail-point traveller is the current beat's progress marker. On the
 * hero it begins below "Start from the beginning"; later beats reset to the
 * top of the viewport. It samples the RECORD strand's actual SVG geometry,
 * holds at the foot while the seam charges, then travels with the cover to
 * the next beat's head. Its read ScrollTriggers fade it over the final fifth
 * of the 1950s, hold it absent through the escarpment and count, and restore
 * it over the opening fifth of the 1840s. It leaves for good at the end of
 * Before people.
 *
 * IT CARRIES THE ERA (user, 10 September 2026) — the label and its sub ride
 * at the arrow's tip, so the arrow points at something. Still no progress
 * gauge and no count: what was banned was a readout of how far through you
 * are, and the chronology is what the rail exists to carry. The pointer now
 * appears only on sections that HAVE an era, popping in and out with it, so
 * it is never an arrow indicating nothing.
 *
 * The fill is scroll position, both directions: jumping to "Start from the
 * beginning" smooth-scrolls down and the ink flows down with it; scrolling
 * back up drains it. The clip is derived from scroll each frame, so it
 * cannot run backwards or desync — the reversal bug the build note warns
 * about cannot occur with a scroll-derived clip.
 *
 * Decorative wayfinding: aria-hidden, pointer-events-none, lg and up only.
 */

/** Strand geometry — dot size/spacing from the designed asset (~4.5px dots
 *  every ~10px); two strands share the wander, offset like the asset's pair. */
const RAIL_W = 160;
const INK_X = 40; // left strand centre
const STEP_X = 72; // right strand centre
const AMPLITUDE = 8;
const WAVELENGTH = 214;
const SAMPLE = 12;
/** Where the artwork's chevron ends, from the traveller anchor. The image is
 *  96px drawn at left-[-22px] and its arrowhead sits at x 87–93, so the tip
 *  lands at +71; the label clears it by a space. */
const LABEL_X = 86;
const LABEL_W_MAX = 200;
/** Narrower than this and the label is not worth the collision. */
const LABEL_W_MIN = 120;

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

/** An element's layout top relative to the descent root, ignoring transforms.
 * The traveller samples document geometry, so layout coordinates remain the
 * stable source while other scroll-scrubbed transforms are active. */
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
  /**
   * How wide the pointer's era label may be before it runs into the reading
   * column, in px — 0 when there is no room and the arrow rides alone.
   *
   * The rail's left edge is pinned to the wordmark and so barely moves, while
   * the content container is centred and travels LEFT as the viewport narrows:
   * measured, the gap between the arrow's tip and the reading column is 452px
   * at 1794 and only 131px at 1024. A fixed width would be wrong at one end or
   * the other, so it is measured.
   */
  const [labelWidth, setLabelWidth] = useState(LABEL_W_MAX);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-descent-root]");
    if (!root) return;

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
      // The strand goes under from the top of the escarpment break and
      // surfaces again UNDER THE COUNT — at the navy wave that closes the
      // count band — running through the wave and down to the 1840s
      // pointer, so the line connects the count to the 1840s.
      const breakEl = document.getElementById("break-escarpment");
      // The restart is the FOOT of the count's hand-off wave — the strand
      // surfaces where the ground turns back to the page's own colour, and
      // runs from there down to the 1840s pointer.
      //
      // Measured through layoutTop (offsetTop), not getBoundingClientRect.
      // The wave lives on a slide the deck pins and a track the deck
      // translates, so a viewport rect reports wherever the section happens
      // to be sitting at the instant the observer fires — and this measure
      // re-runs on a ResizeObserver, which can fire mid-scroll. offsetTop is
      // immune to both, so the gap stops depending on when it was taken.
      //
      // The wave is an <svg> with no offsetParent chain of its own, so the
      // anchor is its parent section plus the wave's own height: the wave is
      // seated leading, overhanging the join by all but a pixel of itself.
      const wave = document.querySelector<SVGElement>("[data-count-wave]");
      const waveHost = wave?.parentElement ?? null;
      const resumeTop = waveHost
        ? layoutTop(waveHost, root) + (wave?.getBoundingClientRect().height ?? 0)
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
      // The NARROWEST reading column on the page, not the first one.
      //
      // Entries do not all sit in the same wrapper — measured, the first copy
      // column starts at 370px and another at 297px — so sizing the label
      // against whichever happened to be first put it 57px inside the copy on
      // every section that indents less. The label is one element for the
      // whole descent, so it has to clear the worst case.
      const columns = [
        ...document.querySelectorAll<HTMLElement>("[data-truth-entry-copy]"),
      ]
        .map((el) => el.getBoundingClientRect().left)
        .filter((x) => x > 0);
      if (!columns.length) {
        setLabelWidth(LABEL_W_MAX);
        return;
      }
      const column = Math.min(...columns);
      const railLeft = Math.max(
        Math.round(
          (logo
            ? logo.getBoundingClientRect().left +
              logo.getBoundingClientRect().width * (2.5 / 9)
            : 0) - (INK_X + STEP_X) / 2,
        ),
        0,
      );
      // The traveller sits at the strand's own x inside the rail box, and the
      // label hangs off THAT — so the budget starts at the strand's rightmost
      // wander, not at the rail box's left edge. Omitting it overstated the
      // room by ~80px and put the label inside the copy.
      const room =
        column - (railLeft + STEP_X + AMPLITUDE + LABEL_X) - 16;
      setLabelWidth(room < LABEL_W_MIN ? 0 : Math.min(room, LABEL_W_MAX));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => {
      ro.disconnect();
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

      {/* Geometry-only twin of the RECORD strand. It is always mounted so
          the controller can retain the node before the first measurement;
          React updates its d attribute when the full rail height is known. */}
      <svg
        width={RAIL_W}
        height={Math.max(height, 1)}
        viewBox={`0 0 ${RAIL_W} ${Math.max(height, 1)}`}
        fill="none"
        className="absolute left-0 top-0 overflow-visible opacity-0"
      >
        <path
          data-truth-trail-guide
          d={strandPath(height, STEP_X, 0.9)}
          stroke="transparent"
        />
      </svg>

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
              className="absolute left-0 top-0 text-charcoal opacity-25"
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

      {/* G1 / "the guide leading the eye": the sticky viewport is stable;
          the gated-deck controller writes only transforms and opacity to the
          traveller. The full-height guide remains the source of its lateral
          position and tangent. */}
      <div className="sticky top-0 h-svh w-full overflow-visible">
        <div
          data-truth-trail-traveller
          data-trail-end={ends?.steps}
          className="absolute left-0 top-0 h-0 w-0 opacity-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
          <img
            data-truth-trail-pointer
            src="/artwork/trail-point.svg"
            alt=""
            className="absolute left-[-22px] top-0 w-24 max-w-none -translate-y-1/2"
            loading="eager"
          />
          {/* The era the arrow is pointing at, riding with it. Empty here and
              filled by the deck on each slide change: the strings live in the
              section's own gutter block, which goes sr-only at lg so the era
              still reaches a screen reader that cannot see this rail.

              NEVER GOLD. The artwork beside it is baked gold at 1.72:1 on this
              ground (open-questions.md) and is already flagged for a
              light-ground cut; type must not inherit that. burnt-deep is
              6.31:1 and is the page's compliant warm. */}
          {labelWidth > 0 ? (
            <div
              data-truth-trail-label-box
              className="absolute top-0 -translate-y-1/2"
              style={{ left: LABEL_X, width: labelWidth }}
            >
              <p data-truth-trail-label className="eyebrow text-xl text-burnt-deep" />
              <p
                data-truth-trail-sub
                className="mt-1 text-sm font-normal uppercase leading-relaxed text-charcoal"
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
