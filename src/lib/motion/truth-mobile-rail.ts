"use client";

/**
 * /truth's MOBILE timeline — the homepage's two-line rail at the viewport's
 * foot (user direction, 15 September 2026, superseding the same day's
 * per-era wave rules). Grammar row: "the guide leading the eye, Truth
 * mobile cut" (docs/motion/motion-grammar.md).
 *
 * TruthTrailBar (TrailRail.tsx) renders the bar and truth.css styles it as
 * home-hero.css styles the homepage pair; this module is everything that
 * MOVES.
 *
 * THE BAR FOLLOWS THE SECTION ON SCREEN (user direction, 16 September
 * 2026 — superseding the 15 September page-progress marker, whose era
 * anchors swapped the year only as each section's MIDDLE passed, so the
 * year and the section being read disagreed for half of every section).
 * The chronology is cut into ERA STRETCHES measured off the live layout
 * (`measureStretches`): one opens at the head of every slide naming an era
 * — its own `[data-era-label]`, the string the desktop deck reads — or at
 * the row of a later era inside one, and runs to the next. The stretch
 * MOST VISIBLE ON SCREEN owns the bar (user direction, same day, replacing
 * a reading-line owner that disagreed on short sections): its mark is the
 * year, and the marker crosses that stretch's equal share of the line while
 * the reading line crosses it. Re-measured on every ScrollTrigger refresh
 * and never a page fraction, because the sections' heights are not fixed
 * (the image carousels shorten several). The to-scale chronological spacing stays
 * the desktop's. The marker glides under the desktop's own
 * critically-damped follow and rides the dotted line's measured wander
 * (the WAVE_* fit below); the year swaps on a short crossfade (the
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
  SELF_DATED_MARK,
  SELF_DATED_SLIDE,
  shortMark,
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
/** The READING LINE, as a fraction of the viewport's height down from its
 *  head. It no longer decides the YEAR (that is the most visible stretch —
 *  see the tick); it times the bar's arrival against the first era and
 *  paces the marker across the owning stretch's share of the line. */
const READING_LINE = 0.5;

/** One era stretch in document px: where it opens, where the next opens
 *  (or the Wattanuri floor, for the last), and the short mark the bar wears
 *  while it is the most visible stretch on screen. */
type Stretch = { start: number; end: number; label: string };

/**
 * The chronology's era stretches, in page order, measured off the live
 * layout. Every slide contributes the eras its own markup names — the
 * `[data-era-label]` blocks the desktop deck reads the pointer's strings
 * from, cut to the short mark — so there is one string source for both
 * rails. The first era a slide names owns it from the slide's head; a later
 * one (the count's 1886) from its own row, since its label is `sr-only`
 * below `lg` and measures nothing. A slide naming none adds no stretch and
 * keeps the standing era — the desktop's retention rule. The deed plate
 * names none in markup, yet dates itself, so it opens on its own year
 * (`SELF_DATED_MARK`). Consecutive repeats of one mark fold together.
 */
const measureStretches = (floorTop: number): Stretch[] => {
  const stretches: Stretch[] = [];
  const top = (el: Element) => el.getBoundingClientRect().top + window.scrollY;
  const push = (start: number, label: string) => {
    if (!label || stretches.at(-1)?.label === label) return;
    stretches.push({ start, end: start, label });
  };
  document
    .querySelectorAll<HTMLElement>("[data-truth-slide]")
    .forEach((slide) => {
      const sources = Array.from(
        slide.querySelectorAll<HTMLElement>("[data-era-label]"),
      ).filter((el) => el.closest("[data-truth-slide]") === slide);
      if (!sources.length && slide.matches(SELF_DATED_SLIDE)) {
        push(top(slide), SELF_DATED_MARK);
        return;
      }
      sources.forEach((source, index) => {
        push(
          index === 0 ? top(slide) : top(source.parentElement ?? source),
          shortMark(source.textContent?.trim() ?? ""),
        );
      });
    });
  stretches.sort((a, b) => a.start - b.start);
  // Each stretch runs to the next one's head; the last to the floor.
  stretches.forEach((stretch, index) => {
    stretch.end = Math.max(
      stretch.start,
      stretches[index + 1]?.start ?? floorTop,
    );
  });
  return stretches;
};

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
          let stretches: Stretch[] = [];
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
            const floor = document.getElementById(wattanuri.id);
            const floorTop = floor
              ? floor.getBoundingClientRect().top + window.scrollY
              : document.documentElement.scrollHeight;
            stretches = measureStretches(floorTop);
            /* The bar arrives as the first era reaches the reading line and
               leaves as the floor reaches the viewport's foot. */
            showFrom = stretches.length
              ? stretches[0].start - window.innerHeight * READING_LINE
              : 0;
            showTo = floor ? floorTop - window.innerHeight : Infinity;
          };
          measure();
          ScrollTrigger.addEventListener("refresh", measure);

          let followX: number | null = null;
          let owner = -1; // the stretch holding the bar; -1: none on screen
          let activeLabel: string | null = null; // null: never stamped
          let shown = false;
          let swap: gsap.core.Timeline | null = null;
          /* Measured at each stamp, for the edge clamp — never per frame. */
          let yearHalf = 0;

          const stampYear = (label: string) => {
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
            // THE MOST VISIBLE SECTION OWNS THE BAR (user direction, 16
            // September 2026: "make [it] match whichever section is the
            // most visible on screen"). This supersedes the same day's
            // reading-line owner, which agreed for sections taller than the
            // screen but not for short ones — the dated plates, and every
            // section the mobile carousels shortened — where a section
            // filling most of the screen could still wear its neighbour's
            // year while the neighbour held the middle line. Visible = the
            // stretch's pixels inside [y, y + viewport]. A tie keeps the
            // current owner, so a boundary cannot flicker the year; and
            // because the stretches tile the page, the winner only ever
            // advances as the page scrolls down.
            const viewEnd = y + window.innerHeight;
            const visibleOf = (stretch: Stretch) =>
              Math.max(
                0,
                Math.min(stretch.end, viewEnd) - Math.max(stretch.start, y),
              );
            let best = owner >= 0 && owner < stretches.length ? owner : -1;
            let bestVisible = best >= 0 ? visibleOf(stretches[best]) : 0;
            for (let i = 0; i < stretches.length; i += 1) {
              const visible = visibleOf(stretches[i]);
              if (visible > bestVisible) {
                best = i;
                bestVisible = visible;
              }
            }
            owner = bestVisible > 0 ? best : -1;
            // The marker crosses the owner's equal share of the line as the
            // reading line crosses the stretch — clamped, so the step to the
            // next owner is forward-only and the follow turns it to a glide.
            const line = y + window.innerHeight * READING_LINE;
            let progress = 0;
            if (owner >= 0) {
              const { start: from, end: to } = stretches[owner];
              const within = to > from ? clamp01((line - from) / (to - from)) : 1;
              progress = clamp01((owner + within) / stretches.length);
            }
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
            const label = owner >= 0 ? stretches[owner].label : "";
            if (label !== activeLabel) {
              activeLabel = label;
              stampYear(label);
            }
          };
          gsap.ticker.add(tick);

          return () => {
            gsap.ticker.remove(tick);
            ScrollTrigger.removeEventListener("refresh", measure);
            swap?.kill();
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
