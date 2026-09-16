"use client";

/**
 * The finite rail's shared map — /truth's chronology rail became FINITE and
 * STICKY on 15 September 2026 (user direction). Grammar: "the guide leading
 * the eye, Truth cut" (docs/motion/motion-grammar.md, Variants).
 *
 * One object owns three things every rail consumer must agree on:
 *
 *   · the ANCHORS — which slide each year mark belongs to and where the mark
 *     sits down the finite rail (a designed fraction, 0 at the head);
 *   · the MAP — document scroll → rail fraction, piecewise-linear through
 *     those anchors, so the pointer sits ON an era's mark while that era is
 *     read. The traveller (gated-deck's `paintRail`) and the record fill's
 *     clip (truth-descent-v2's `wireFill`) both go through THIS function,
 *     which is what makes it impossible for tip and pointer to disagree;
 *   · the TRAVEL BOX — where inside the sticky screen the pointer may stand,
 *     shared with TrailRail so the marks render on the same line the pointer
 *     travels.
 *
 * The map is calibrated from the deck's own measured read spans
 * (`calibrateRailMap`, wired in truth/_components/Motion.tsx through
 * `onSlideSpans`). Uncalibrated — touch at lg, no Lenis, before the deck
 * boots — it degrades to the plain document fraction, which is the honest
 * reading of "page progress" when no read clocks exist.
 *
 * THE FRACTIONS ARE CHRONOLOGICALLY PROPORTIONAL (user direction,
 * 15 September 2026 — superseding the same day's hand-spaced table and its
 * "2020 near three quarters" fixed point, ruled out by its own author).
 * The dated marks 2026 → 1840s sit linearly by elapsed years across the
 * rail's middle band [F_TODAY, F_1840], so 2003 → 1950s is a long reach
 * and 2026 → 2019 a tight cluster — a timeline drawn to scale. The two
 * undatable deep-time marks sit past a declared SCALE BREAK at the foot:
 * "Older than the record" (5,000+ years) and "Before people" (about 100
 * million) cannot share a linear axis with 186 years, and pretending they
 * could would pin every dated mark to the top pixel. The Figma pull from
 * frame `05 · TODAY montage` (2048:11158, file 7XBvi0Mdbtmym10nkF9IGp)
 * holds one rosette moment and no mark ladder, so nothing designed is
 * overridden. Every label string is DERIVED from src/content/truth.ts (D5)
 * — the same `\d{4}s?` derivation EntryBlock uses for its gutter years,
 * and era markers cut at their own `·`/`,` separator — never retyped; a
 * dated mark's YEAR is parsed back out of that same derived label, so
 * there is no second copy of a year to drift.
 *
 * ⚠ FRACTIONS MUST STAY MONOTONE IN PAGE ORDER — `buildPairs` sorts the
 * anchors by scroll position and the pointer interpolates between
 * neighbours, so a fraction out of story order would run it backwards.
 * This is why the deed slide (#deed, signed June 2026) carries NO anchor:
 * the page tells that beat between 2022 and 2020, and a 2026 fraction
 * there would fold the map. The pointer simply interpolates across it —
 * and since 16 September 2026 it does so BARE: the deed is the one section
 * that dates itself, so the arrow and its era withdraw there
 * (`SELF_DATED_SLIDE`, below).
 */

import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { DeckSlideSpan } from "@/lib/motion/gated-deck";
import { erasAfter, erasBefore, suzanne } from "@/content/truth";
import type { TruthEntry } from "@/content/truth";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * An era marker cut down to the mark the timeline shows: the text before its
 * own separator. "Before people · about 100 million years ago" marks as
 * "Before people"; "1902, and then further back" as "1902". The section
 * carries the full line — the timeline only ever shows this.
 */
export function shortMark(marker: string): string {
  return marker.split("·")[0].split(",")[0].trim();
}

/** The gutter-year derivation EntryBlock uses, applied to an entry's when. */
const yearOf = (entry: TruthEntry | undefined): string =>
  entry?.when?.match(/\d{4}s?/g)?.pop() ?? "";

export type RailMark = {
  /** Selector matched against the deck's slide elements. */
  slide: string;
  /** Where inside that slide's read the reader is "at" the mark, 0–1. */
  at: number;
  /** The mark's position down the finite rail, 0–1 — the direction's fixed
   *  points, spaced by content order (see the header: the frame holds no
   *  fraction table to supersede them). */
  fraction: number;
  /** The short mark the rail prints, derived from the content module. */
  label: string;
};

const [ahead, today, boughtBack, namedWrong] = erasBefore;
const [mitchell, olderThanRecord, beginning] = erasAfter;

/** The dated band's ends: Today (2026, the launch year the page reads from)
 *  at its head, the 1840s at its foot. Between them a year's fraction is
 *  linear in elapsed time; past F_1840 the scale breaks (header note). */
const F_TODAY = 0.1;
const F_1840 = 0.86;
const Y_TOP = 2026;
const Y_BOTTOM = 1840;
const datedFraction = (year: number) =>
  F_TODAY + ((Y_TOP - year) * (F_1840 - F_TODAY)) / (Y_TOP - Y_BOTTOM);

/** A dated mark: its year is parsed back out of the derived label ("1950s"
 *  counts as 1950), so the label string is the only source of the date. */
const dated = (slide: string, at: number, label: string): RailMark => ({
  slide,
  at,
  fraction: datedFraction(Number.parseInt(label, 10)),
  label,
});

export const RAIL_MARKS: readonly RailMark[] = [
  { slide: "#research", at: 0.5, fraction: 0.03, label: shortMark(ahead.marker) },
  /* "Today" carries no digits, so its year is the one explicit date here. */
  { slide: "#researched", at: 0.5, fraction: datedFraction(Y_TOP), label: shortMark(today.marker) },
  dated("#study-2022", 0.5, yearOf(today.entries[1])),
  /* #deed (June 2026) is deliberately unanchored — see the header note. */
  dated("#renamed", 0.5, yearOf(boughtBack.entries[1])),
  dated("#just-us", 0.5, yearOf(boughtBack.entries[2])),
  dated("#father", 0.5, yearOf(boughtBack.entries[3])),
  dated("#art-gallery", 0.5, yearOf(namedWrong.entries[0])),
  /* The count's two figures share one slide, so each year anchors to its own
     stretch of that slide's read — the marks match their content
     (user direction, 15 September 2026). */
  dated("#the-count-figures", 0.25, suzanne.figures[0].year),
  dated("#the-count-figures", 0.7, suzanne.figures[1].year),
  dated("#mitchell", 0.5, yearOf(mitchell.entries[0])),
  /* Past the scale break: undatable, spaced by design not by years. */
  { slide: "#engraving", at: 0.5, fraction: 0.93, label: shortMark(olderThanRecord.marker) },
  { slide: "#seabed", at: 0.5, fraction: 1, label: shortMark(beginning.marker) },
];

/**
 * THE SECTION THAT DATES ITSELF (user direction, 16 September 2026). The
 * deed plate prints its own year on the section ("2026 · Bought back"), so
 * on the desktop the pointer's era there is a redundant second copy — it
 * was carrying the retained "Today", the rail's 2026 anchor — and the deck
 * withdraws the arrow and its label across this slide (gated-deck's
 * `railSilentSlides`). The phone has no pointer beside the plate, only the
 * bottom bar, and the deed names no era in its markup for the bar to read;
 * the bar's mark there is this year, derived from the deed's own `when`
 * with the same `\d{4}s?` cut as every dated mark (D5 — never retyped).
 */
export const SELF_DATED_SLIDE = "#deed";
export const SELF_DATED_MARK = yearOf(
  boughtBack.entries.find((entry) => entry.id === "deed"),
);

/**
 * The pointer's travel box inside the sticky screen, px from its head and
 * foot. The head clears the wordmark and the legend; both ends stay inside
 * the strand mask's fully-opaque zone so the pointer never rides a fading
 * strand. The mask stops are the hi-fi frame's measured end scrims — 175px
 * deep, opaque strand beyond (truth.css cites the measurement) — so the
 * travel box brackets them at 176 each end; change them together.
 */
export const RAIL_TRAVEL_TOP = 176;
export const RAIL_TRAVEL_BOTTOM_INSET = 176;

/** One anchor pair: absolute document scroll → designed rail fraction. */
type AnchorPair = { scroll: number; fraction: number };

let buildAnchors: (() => AnchorPair[]) | null = null;
let pairs: AnchorPair[] | null = null;

/** Positions move on every ScrollTrigger refresh; the pairs follow lazily. */
const invalidate = () => {
  pairs = null;
};

/** One calibrator at a time. Only the deck calibrates now: below `lg` the
 *  bottom bar follows the section on screen instead of this map
 *  (truth-mobile-rail.ts, user direction, 16 September 2026). */
const engage = (builder: () => AnchorPair[]) => {
  buildAnchors = builder;
  pairs = null;
  ScrollTrigger.addEventListener("refresh", invalidate);
  return () => {
    ScrollTrigger.removeEventListener("refresh", invalidate);
    if (buildAnchors === builder) {
      buildAnchors = null;
      pairs = null;
    }
  };
};

/**
 * Hand the deck's measured read clocks to the map. Returns the release the
 * composed `onSlideSpans` teardown calls on revert.
 */
export function calibrateRailMap(
  deckSpans: readonly DeckSlideSpan[],
): () => void {
  return engage(() => {
    const built: AnchorPair[] = [];
    RAIL_MARKS.forEach((mark) => {
      for (const span of deckSpans) {
        if (!span.slide.matches(mark.slide)) continue;
        const start = span.read.start;
        const end = span.read.end;
        built.push({
          scroll: start + (end - start) * mark.at,
          fraction: mark.fraction,
        });
        break;
      }
    });
    built.sort((a, b) => a.scroll - b.scroll);
    return built;
  });
}

/**
 * Document scroll position → rail fraction, 0–1.
 *
 * Calibrated: piecewise-linear from (0, 0) through every anchor pair to
 * (maxScroll, 1). Uncalibrated: the plain document fraction.
 */
export function railProgressAt(scrollY: number): number {
  const max = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  const doc = clamp01(scrollY / max);
  if (!buildAnchors) return doc;
  if (!pairs) pairs = buildAnchors();
  if (!pairs.length) return doc;

  let previous: AnchorPair = { scroll: 0, fraction: 0 };
  for (const pair of pairs) {
    if (scrollY <= pair.scroll) {
      const span = pair.scroll - previous.scroll;
      if (span <= 0) return pair.fraction;
      return (
        previous.fraction +
        (pair.fraction - previous.fraction) *
          clamp01((scrollY - previous.scroll) / span)
      );
    }
    previous = pair;
  }
  const tail = max - previous.scroll;
  if (tail <= 0) return 1;
  return (
    previous.fraction +
    (1 - previous.fraction) * clamp01((scrollY - previous.scroll) / tail)
  );
}
