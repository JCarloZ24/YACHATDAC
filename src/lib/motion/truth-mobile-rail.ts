"use client";

/**
 * /truth's MOBILE timeline — the homepage's two-line rail at the viewport's
 * foot (user direction, 15 September 2026, superseding the same day's
 * per-era wave rules). Grammar row: "the guide leading the eye, Truth
 * mobile cut" (docs/motion/motion-grammar.md).
 *
 * TruthTrailBar (TrailRail.tsx) renders the bar and truth.css styles it as
 * home-hero.css styles the homepage pair; this module is everything that
 * MOVES. The marker's x is PAGE PROGRESS, linear through the chronology's
 * own extent — the to-scale chronological spacing stays the desktop's
 * (user ruling, 15 September 2026: the phone travels by webpage progress)
 * — under the desktop's own critically-damped follow, and the rosette
 * rides the dotted line's measured wander (the WAVE_* fit below). The era
 * anchors stay calibrated (truth-rail-map.ts — section document positions,
 * since no deck runs below `lg`) purely so `railMarkIndexAt` can decide
 * WHICH year the arrow points at, swapping on a short crossfade (the
 * homepage's own language for its year stack); the words clamp inside the
 * viewport at the line's ends. The ink steps to canvas over the measured
 * dark grounds, and the bar shows only while the chronology is on screen —
 * arriving with the first era, leaving at the Wattanuri floor. Per-frame
 * writes are transform and opacity only.
 *
 * Under reduced motion this branch never runs and the bar — which rests
 * `opacity-0` in markup — simply never shows: the same absence as the
 * desktop traveller.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "@/lib/motion-controller";
import {
  calibrateRailMapFromSections,
  railMarkIndexAt,
  RAIL_MARKS,
} from "@/lib/motion/truth-rail-map";
import { wattanuri } from "@/content/truth";

gsap.registerPlugin(ScrollTrigger);

/** The marker's travel box — the lines bleed past both edges (the
 *  homepage's 123.472%), the marker keeps its year readable inside them.
 *  Fractions of the viewport width. */
const TRAVEL_START = 0.09;
const TRAVEL_END = 0.91;
/** The desktop rail's own follow constant (gated-deck.ts) — one glide. */
const FOLLOW = 0.12;
/** The label's minimum clearance from the viewport edges (user direction,
 *  15 September 2026: "Older than the record" was cutting off). */
const LABEL_EDGE = 12;

/** truth-dotted-path.svg's own wander, measured off the committed file
 *  (112 dot centres, least squares, rms 2.1px in the 1778×45 art box).
 *  The marker samples this at its eased x so the rosette RIDES the line
 *  rather than skating a chord through it (user direction, 15 September
 *  2026) — the desktop's sample-at-the-smoothed-position rule, turned
 *  horizontal. LINE_LEFT / LINE_WIDTH are truth.css's own bleed numbers
 *  (the homepage's 123.472%), as viewport-width fractions. */
const ART_W = 1778;
const WAVE_A = 16.64;
const WAVE_L = 354;
const WAVE_PHI = 1.65;
const LINE_LEFT = -0.117;
const LINE_WIDTH = 1.23472;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function createTruthMobileRail(): MotionModule {
  let ctx: gsap.Context | null = null;

  const init = () => {
    ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          const bar = document.querySelector<HTMLElement>(
            "[data-truth-trail-bar]",
          );
          const marker = bar?.querySelector<HTMLElement>(
            "[data-truth-bar-marker]",
          );
          const year = bar?.querySelector<HTMLElement>(
            "[data-truth-bar-year]",
          );
          if (!bar || !marker || !year) return;

          const release = calibrateRailMapFromSections();

          /* THE INK FOLLOWS THE GROUND UNDER THE BAR, not the active
             mark's home section: the bar sits at the viewport's FOOT,
             which incoming sections reach before their marks go active —
             and on mobile the 1950s record doesn't ramp, it RESTS on
             charcoal (truth.css's off-deck note), so a hardcoded band
             list would miss it. Measured instead: every ground candidate
             whose computed background is dark contributes a scroll range,
             and the tick tests the bar's own document position against
             them. Re-measured on refresh; static markup otherwise. */
          const DARK_CANDIDATES =
            '[data-descent-band], #break-escarpment, [data-truth-ground="count"], [data-truth-deteriorates]';
          let darkRanges: Array<{ start: number; end: number }> = [];
          let showFrom = 0;
          let showTo = Infinity;
          const measure = () => {
            darkRanges = [];
            document
              .querySelectorAll<HTMLElement>(DARK_CANDIDATES)
              .forEach((el) => {
                const bg = getComputedStyle(el).backgroundColor;
                const m = bg.match(
                  /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/,
                );
                if (!m) return;
                if (m[4] !== undefined && parseFloat(m[4]) === 0) return;
                const lum =
                  (0.2126 * +m[1] + 0.7152 * +m[2] + 0.0722 * +m[3]) / 255;
                if (lum > 0.5) return;
                const rect = el.getBoundingClientRect();
                darkRanges.push({
                  start: rect.top + window.scrollY,
                  end: rect.bottom + window.scrollY,
                });
              });
            const first = document.querySelector<HTMLElement>(
              RAIL_MARKS[0].slide,
            );
            const floor = document.getElementById(wattanuri.id);
            showFrom = first
              ? first.getBoundingClientRect().top +
                window.scrollY -
                window.innerHeight * 0.5
              : 0;
            showTo = floor
              ? floor.getBoundingClientRect().top +
                window.scrollY -
                window.innerHeight
              : Infinity;
          };
          measure();
          ScrollTrigger.addEventListener("refresh", measure);

          let followX: number | null = null;
          let activeMark = -2; // -2: never stamped · -1: above the first era
          let shown = false;
          let swap: gsap.core.Timeline | null = null;
          /* Measured at each stamp, for the edge clamp — never per frame. */
          let yearHalf = 0;

          const stampYear = (index: number) => {
            const label = index >= 0 ? RAIL_MARKS[index].label : "";
            swap?.kill();
            swap = gsap
              .timeline()
              .to(year, { autoAlpha: 0, duration: 0.12, ease: "power1.in" })
              .add(() => {
                year.textContent = label;
                // A word-mark ("Before people") takes the smaller face; a
                // year ("1902", "1950s") the larger — truth.css sizes both.
                if (label && /^\D/.test(label))
                  year.setAttribute("data-word", "");
                else year.removeAttribute("data-word");
                yearHalf = year.offsetWidth / 2;
              })
              .to(year, { autoAlpha: 1, duration: 0.2, ease: "power1.out" });
          };

          let lastDark = false;
          const tick = () => {
            const y = window.scrollY;
            /* The lines sit ~40px above the viewport's foot. */
            const foot = y + window.innerHeight - 40;
            const dark = darkRanges.some(
              (range) => foot >= range.start && foot <= range.end,
            );
            if (dark !== lastDark) {
              lastDark = dark;
              if (dark) bar.setAttribute("data-rail-dark", "true");
              else bar.removeAttribute("data-rail-dark");
            }
            const within = y >= showFrom && y <= showTo;
            if (within !== shown) {
              shown = within;
              gsap.to(bar, {
                autoAlpha: within ? 1 : 0,
                duration: 0.3,
                overwrite: "auto",
              });
            }
            const vw = window.innerWidth;
            const start = vw * TRAVEL_START;
            const span = vw * (TRAVEL_END - TRAVEL_START);
            // PAGE PROGRESS, linear through the chronology's own extent
            // (user ruling, 15 September 2026: the to-scale chronological
            // spacing stays the desktop's; the phone travels by webpage
            // progress). The era anchors below still decide WHICH year the
            // arrow points at.
            const extent = showTo - showFrom;
            const progress =
              extent > 0 ? clamp01((y - showFrom) / extent) : 0;
            const target = start + span * progress;
            const blend =
              1 - Math.pow(1 - FOLLOW, gsap.ticker.deltaRatio());
            followX =
              followX === null ? target : followX + (target - followX) * blend;
            if (Math.abs(target - followX) < 0.05) followX = target;
            // The rosette rides the line's own wander, sampled at the
            // eased x — see the WAVE_* fit above.
            const scale = (vw * LINE_WIDTH) / ART_W;
            const xArt = (followX - vw * LINE_LEFT) / scale;
            const yWave =
              WAVE_A *
              Math.sin((xArt / WAVE_L) * Math.PI * 2 + WAVE_PHI) *
              scale;
            gsap.set(marker, { x: followX, y: yWave });
            // The words never leave the screen: the arrow keeps pointing
            // from the marker, the label slides inward only as far as the
            // viewport edge demands. The year is LEFT-ANCHORED (truth.css
            // explains why gsap must own the centring too), so the write
            // is the centred-and-clamped left edge relative to the marker.
            const centre = Math.min(
              Math.max(followX, LABEL_EDGE + yearHalf),
              vw - LABEL_EDGE - yearHalf,
            );
            gsap.set(year, { x: centre - yearHalf - followX });
            const mark = railMarkIndexAt(y);
            if (mark !== activeMark) {
              activeMark = mark;
              stampYear(mark);
            }
          };
          gsap.ticker.add(tick);

          return () => {
            gsap.ticker.remove(tick);
            ScrollTrigger.removeEventListener("refresh", measure);
            swap?.kill();
            release();
            gsap.set(bar, { autoAlpha: 0 });
            bar.removeAttribute("data-rail-dark");
          };
        },
      );
    });
  };

  const destroy = () => {
    ctx?.revert();
    ctx = null;
  };

  return { init, destroy };
}
