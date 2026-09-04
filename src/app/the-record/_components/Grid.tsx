"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import {
  browserCopy,
  recordSources,
  recordTypes,
  type RecordItem,
  type RecordSource,
} from "@/content/the-record";
import type { MediaSlot } from "@/content/lofi/media";
import { MOTION_GRADE } from "@/content/lofi/media";
import { MediaOrField } from "@/components/ui/MediaOrField";
import {
  ClusterArtwork,
  SeamGlyph,
  WaveDivider,
  type SeamGlyphMotif,
} from "@/components/ui/Furniture";
import {
  RECORD_BREAKOUT_FLIGHT,
  RECORD_STICKY_RAIL,
  RECORD_STICKY_ROWS,
} from "@/lib/motion/record-flags";

/**
 * 02 · The grid — the sticky rail IS the filter, and three entries break out
 * to take the whole screen as the grid runs past (Figma 2463:8495).
 *
 * WHAT THE HI-FI CHANGED
 * ----------------------
 * The lo-fi browser was a row of selects above a grid. The hi-fi makes the
 * left lane a permanent index: live counts per type, a marker that travels to
 * wherever the grid is, and the source axis rendered as a colour key rather
 * than a dropdown — because the card grounds ARE the source (D21), so the key
 * teaches the page's colour system while it filters.
 *
 * WHAT IT DID NOT CHANGE
 * ----------------------
 *   · Search. The rail in Figma has no search field, and on 2026-09-04 it
 *     came out of the rail: sitting under the count it pushed every facet
 *     ~61px down the frame and, with the deck unheld, ran the panel past the
 *     first card row and over the breakout beneath it. The control is NOT
 *     gone — the small-screen strip below still carries the input and `query`
 *     still filters — but there is no desktop text search. Thirteen items do
 *     not need one; a growing CMS collection will, and it needs a home that
 *     is not this column.
 *   · Sort. The frame lists "Newest first / Oldest first / A–Z". The items
 *     carry no published date — see the note in src/content/the-record.ts — so
 *     the two date sorts render as visible holds rather than as controls that
 *     silently sort by nothing.
 *
 * THE BREAKOUTS only appear in the record's own order, unfiltered. They are
 * three specific entries taking the screen; once the reader has filtered, the
 * grid is an answer to a question and a full-screen interruption by somebody
 * else's entry is noise.
 *
 * Client component: it holds the filter state. Media srcs are resolved on the
 * server (the library is gitignored) and handed down already checked.
 */

export type ResolvedSlot = Pick<MediaSlot, "bucket" | "expects" | "tone"> & {
  src: string | null;
};

export type Breakout = {
  slug: string;
  /** Where in the card stream it interrupts — after this many cards. */
  after: number;
  media: ResolvedSlot | null;
  glyph: SeamGlyphMotif;
  /** Card 12 takes the screen as a TYPE frame: the bore, drawn to scale. */
  diagram?: "bore";
};

/** The source axis is the page's colour system. One ground per epistemology. */
const SOURCE_GROUND: Record<RecordSource, string> = {
  "Iningai knowledge": "bg-evergreen",
  "Colonial record": "bg-roasted",
  "Published research": "bg-midnight",
};

/**
 * The key IS the ground. The frame's point: "the SOURCE keys are the legend the
 * card grounds read from and the control that filters them — one object doing
 * both jobs". So these must be the literal card ground colours, not a
 * decorative palette beside them; a legend in different colours from the thing
 * it explains is not a legend.
 */
/**
 * The TYPE facet's display labels. The frame (2508:14448 and its siblings)
 * sets these plural — "STORIES", "HISTORICAL ACCOUNTS" — because every row
 * carries a count and a plural reads correctly against one. The VALUES stay
 * singular: `recordTypes` is the filter vocabulary an item's `type` is matched
 * against, and D5 keeps the draft's words for the data. This map is display
 * only, and anything not listed falls back to its own label.
 */
const TYPE_PLURAL: Record<string, string> = {
  Story: "Stories",
  "Historical account": "Historical accounts",
  Research: "Research",
  Documentation: "Documentation",
  Recording: "Recordings",
  Event: "Events",
  Update: "Updates",
};

const SOURCE_KEY: Record<RecordSource, string> = {
  "Iningai knowledge": "bg-evergreen",
  "Colonial record": "bg-roasted",
  "Published research": "bg-midnight",
};

/** The scrim over a breakout's photograph carries the source's own ground. */
const SOURCE_SCRIM: Record<RecordSource, string> = {
  "Iningai knowledge":
    "linear-gradient(180deg, rgba(34,55,43,0.14) 0%, rgba(34,55,43,0.32) 16%, rgba(34,55,43,0.8) 34%, rgba(34,55,43,0.92) 58%, rgba(34,55,43,0.97) 100%)",
  "Colonial record":
    "linear-gradient(180deg, rgba(78,53,36,0.14) 0%, rgba(78,53,36,0.32) 16%, rgba(78,53,36,0.8) 34%, rgba(78,53,36,0.92) 58%, rgba(78,53,36,0.97) 100%)",
  "Published research":
    "linear-gradient(180deg, rgba(18,36,73,0.14) 0%, rgba(18,36,73,0.32) 16%, rgba(18,36,73,0.8) 34%, rgba(18,36,73,0.92) 58%, rgba(18,36,73,0.97) 100%)",
};

const FIELD_TONE: Record<MediaSlot["tone"], string> = {
  evergreen: "bg-evergreen",
  midnight: "bg-midnight",
  roasted: "bg-roasted",
  oxide: "bg-oxide",
  burnt: "bg-burnt",
  eucalyptus: "bg-eucalyptus",
  charcoal: "bg-charcoal",
};

/**
 * THE PIN, and the two viewports it is made of.
 *
 * A breakout section is 300svh around a frame one screen tall, so the frame
 * sticks for the middle 200. The first of those two is the ROW's own hold —
 * the same hold every other row gets, the reader meeting the grid and it
 * staying still (frame 01). The second is the breakout itself: the flight, and
 * the screen holding after it.
 *
 * THE FIRST VIEWPORT IS ALSO THE RUNWAY, and that is not a side effect. The
 * flight is time-based in both directions, so leaving takes as long as
 * arriving did. With the flight starting at the section's own top there was
 * nothing above it still pinned, and a reader scrolling back watched a landed
 * full-bleed plate slide down the page with the hero arriving over the top of
 * it. A viewport of pinned travel is where the reverse now happens, on a frame
 * that is still holding the screen.
 *
 * Withheld under reduced motion and on any viewport that cannot hold a slide,
 * by the `hold:` variant — see the note on it in globals.css. Without the
 * extra viewports the section is one card row in ordinary flow and nothing
 * flies, which is the strip's own reduced-motion instruction.
 */
const BREAKOUT_PIN = RECORD_BREAKOUT_FLIGHT ? "hold:h-[300svh]" : "";

/** The thing that sticks: one screen, holding the row and the screens over it. */
const FRAME = RECORD_STICKY_ROWS
  ? "hold:sticky hold:top-0 hold:flex hold:h-svh hold:items-center hold:overflow-hidden"
  : "";

/**
 * The screen the card becomes — and why it renders invisible rather than
 * rendering finished.
 *
 * Everything else on this page follows "rest state is the finished state", so
 * that the page is simply THERE with JS off. The breakout cannot: its rest
 * state is a card in the grid, and the full-bleed plate is what that card
 * turns into. Painted at rest it would cover the row it grows out of. So the
 * plate, the lane scrim and the copy are display:none wherever the flight is
 * not available, and merely transparent where it is — never a flash, and never
 * a screen the reader has to scroll past to reach the grid again.
 *
 * The entry is not lost either way: it is the card, and the card is a link to
 * the same page the breakout's own link points at, which is why this whole
 * overlay is aria-hidden.
 */
const SCREEN_GATE = RECORD_BREAKOUT_FLIGHT ? "hidden hold:block" : "hidden";

/**
 * ⚠ AND THE INVISIBILITY GOES ON THE PARTS, NOT THE WRAPPER. The module
 * animates the plate, the lane and the copy — three separate elements with
 * three separate clocks — so an `opacity-0` on the container above them is one
 * the module never touches and never clears: the flight runs perfectly inside
 * a wrapper that is still transparent, and the screen simply never appears.
 * Measured, after exactly that. Each part carries its own rest state, and each
 * part is one the module overrides when its turn comes.
 */
const SCREEN_PART = "opacity-0";

/**
 * EVERY ROW HOLDS. A row of cards takes the screen and keeps it for a viewport
 * the way a breakout does — 200svh of section around a frame one screen tall —
 * so travelling the grid is moving between screens rather than scrolling
 * through a list, and a breakout is no longer the only thing on the page that
 * behaves that way.
 *
 * ⚠ ONLY WHERE IT FITS, and only where motion is wanted: the `hold:` variant
 * needs a viewport wide enough for three across and TALL enough for a 700px
 * card to sit inside it with air. A slide that does not fit its screen is a
 * trap — the reader cannot see the bottom of it, and on the deck could not
 * scroll to it either.
 *
 * ⚠ NOT A DECK. The snap BETWEEN slides is a separate thing and stays off:
 * this is the layout holding still, not the site taking the wheel. The snap is
 * still gated on RECORD_STICKY_SECTIONS in the motion module.
 */
const SLIDE = RECORD_STICKY_ROWS ? "relative hold:h-[200svh]" : "relative";

/* THE GRID'S RHYTHM, when nothing holds.
   Held, every slide is viewport-sized and the spacing comes from the hold, so
   the margins collapse. Unheld — reduced motion, or a viewport too small for a
   slide — the frame's own numbers have to be laid out: card rows at y=80,
   1728, 2476, 4124, 5772 and breakouts flush at 780, 3176, 4824. That is 48px
   between blocks, EXCEPT that a breakout butts the row it interrupts, which it
   now literally contains. */
const BLOCK_GAP = RECORD_STICKY_ROWS ? "lg:mt-12 hold:mt-0" : "lg:mt-12";
/* The frame opens the grid 80px below the section top — which is also where
   the rail's eyebrow sits — and closes it 168 below the last row: the section
   is 6640 and the last card row ends at 6472. Held, the first frame IS the
   screen and there is nothing to inset it by. */
const DECK_TOP = RECORD_STICKY_ROWS
  ? "lg:pt-20 lg:pb-[168px] hold:pt-0 hold:pb-0"
  : "lg:pt-20 lg:pb-[168px]";

/** The card motifs rotate across the set — the frame's own instruction. */
const CARD_GLYPHS: SeamGlyphMotif[] = ["a", "b", "c"];

gsap.registerPlugin(Flip, ScrollTrigger);

type SortMode = "record" | "az";

export function RecordGrid({
  items,
  media,
  breakouts,
  initialType = "",
  initialSource = "",
  initialTag = "",
}: {
  items: readonly RecordItem[];
  media: Record<string, ResolvedSlot>;
  breakouts: readonly Breakout[];
  initialType?: string;
  initialSource?: string;
  initialTag?: string;
}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState(initialType);
  const [source, setSource] = useState(initialSource);
  const [tag, setTag] = useState(initialTag);
  const [sort, setSort] = useState<SortMode>("record");

  /** Live counts, per the rail's "count — responds to the filter" note. */
  const typeCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
    }
    return counts;
  }, [items]);

  /* The frame lists six types because six have entries. Event and Update are
     in the vocabulary so the first one has a home (D21) — they are not drawn
     until something is filed under them. */
  const liveTypes = useMemo(
    () => recordTypes.filter((t) => (typeCounts.get(t) ?? 0) > 0),
    [typeCounts],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matched = items.filter((item) => {
      if (type && item.type !== type) return false;
      if (source && item.source !== source) return false;
      if (tag && !item.tags?.includes(tag)) return false;
      if (!needle) return true;
      // Subjects are searched alongside title and summary: someone looking for
      // "springs" should find the spring story even though the word is not in
      // its title.
      return [item.title, item.summary, ...item.subjects]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
    if (sort === "az") {
      return [...matched].sort((a, b) => a.title.localeCompare(b.title));
    }
    return matched;
  }, [items, query, type, source, tag, sort]);

  const isFiltered =
    Boolean(query || type || source || tag) || sort !== "record";

  function clear() {
    setQuery("");
    setType("");
    setSource("");
    setTag("");
    setSort("record");
  }

  /* TWO SIGNALS, ONE COLUMN — and the frame is emphatic that they must not be
     confused.

       WEIGHT is SELECTION. It changes only when a row is pressed, and it is
       rendered as font weight and full ink, never as the tick.

       The ochre TICK is POSITION. Scroll-driven, read-only: it reports which
       kind of thing the reader is currently among. It is never a button and
       pressing a row does not move it — scrolling does.

     That is D21 built rather than explained. The record is ordered by type, so
     travelling down the grid walks the tick down the list on its own: position
     is what kind of thing it is, colour is who says so. */
  const typeListRef = useRef<HTMLUListElement>(null);
  const [tickTop, setTickTop] = useState<number | null>(null);
  const [positionType, setPositionType] = useState<string | null>(null);

  /* Measured, not laid out on a fixed row height — "Historical account" wraps
     to two lines and the rest do not. Null while the reader is above or below
     the grid, which hides the tick rather than parking it on a lie. */
  useLayoutEffect(() => {
    const list = typeListRef.current;
    if (!list || !positionType) {
      setTickTop(null);
      return;
    }
    const row = list.querySelector<HTMLElement>(
      `[data-rail-type="${CSS.escape(positionType)}"]`,
    );
    setTickTop(row ? row.offsetTop + 6 : null);
  }, [positionType, liveTypes]);

  /* Where the breakouts land in the unfiltered stream, keyed by how many
     cards precede them. Only in record order — see the file note. */
  const breakoutsByPosition = useMemo(() => {
    if (isFiltered) return new Map<number, Breakout>();
    return new Map(breakouts.map((b) => [b.after, b]));
  }, [breakouts, isFiltered]);

  const blocks = useMemo(
    () => chunk(filtered, breakoutsByPosition),
    [filtered, breakoutsByPosition],
  );

  /* Which entry is at the reader's eye line. A thin band across the middle of
     the viewport, so exactly one entry is "current" at a time and the tick
     does not jitter between two rows on a boundary. */
  useEffect(() => {
    /* REDUCED MOTION — "the rail renders in place, fully lit, with no tick
       travel. It is still a working filter; it simply stops reporting
       position." So the observer is never attached: `positionType` stays null,
       the tick measures to null and hides, and every control still works. The
       motion module is gated on this query too, but the tick is driven from
       here, not from there, so it needed its own gate — without it the one
       thing the frame says to cut was the one thing still moving. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const entries = document.querySelectorAll<HTMLElement>("[data-entry-type]");
    /* Nothing to observe (the empty state). The tick hides on its own: the
       measure below finds no row for a stale type and returns null. */
    if (!entries.length) return;
    const seen = new Map<Element, boolean>();
    const observer = new IntersectionObserver(
      (records) => {
        for (const r of records) seen.set(r.target, r.isIntersecting);
        /* The LAST entry in document order that is in the band, not the
           first. A row is three cards and they enter the band together, so
           "first" reported column one and the rail sat a type behind the
           reader for most of the grid: at the row of seabed / Rangers /
           Mitchell the strip has the tick on HISTORICAL ACCOUNTS — Mitchell,
           the row's furthest type — while "first" still said STORIES. Same at
           the next two rows. Read backwards, the tick reports the furthest
           kind of thing the reader has reached, which is what "where in the
           grid you are" means. */
        for (let i = entries.length - 1; i >= 0; i--) {
          const el = entries[i];
          if (seen.get(el)) {
            setPositionType(el.dataset.entryType ?? null);
            return;
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    entries.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [blocks]);

  /* HANDOFF — the grid reflow on filter change.
     Cards that survive a filter change travel to their new positions instead
     of the grid cutting to a different arrangement; ones that leave fade out
     where they stood and new ones fade in where they land. Flip is the right
     tool here and only here: same elements, two measured layouts, no guessing
     about rects that are off-screen.

     The state is captured in the click handler — BEFORE React re-renders —
     and replayed in the layout effect that follows it. */
  const flipState = useRef<Flip.FlipState | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const capture = () => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const cards = gridRef.current?.querySelectorAll("[data-record-card]");
    flipState.current = cards?.length ? Flip.getState(cards) : null;
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    flipState.current = null;
    if (!state) return;
    /* ⚠ REACT OWNS THE DOM, FLIP ONLY MOVES WHAT SURVIVES.
       `onLeave` (and `absolute`) make Flip hold on to nodes React has already
       unmounted so it can fade them out. React then tries to remove a node
       Flip has re-parented and the whole tree dies with "removeChild: the node
       to be removed is not a child of this node" — which is exactly what
       happened the first time this shipped. So: no onLeave, no absolute.
       Cards that leave are simply gone, cards that arrive fade in, and the
       ones that persist travel. */
    Flip.from(state, {
      duration: 0.55,
      ease: "expo.out",
      onEnter: (els) =>
        gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.4 }),
      /* Filtering changes how many slides there are, so the deck's snap points
         are stale the moment the reflow lands. */
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [blocks]);

  /* rail · facet — Archivo ExtraBold 10 / 1.4px, ink at 45% (2508:14445). */
  const facetLabel = "eyebrow text-[10px] tracking-[0.14em] text-current/45";

  return (
    <section
      id="research-and-discovery"
      data-record-grid
      /* `isolate` confines the rail's z-20 to this section. Without a stacking
         context here it escapes into the root one, where it outranks the LATER
         sibling sections and painted the rail over the navy wave that
         introduces "What we do not know". */
      className="relative isolate bg-canvas"
    >
      {/* Marc's colour handoff: the wave carries the canvas up over the foot
          of the hero photograph, which is what introduces the grid. */}
      <WaveDivider ground="var(--color-canvas)" />

      {/* The rail. A lane down the left of the whole section, sticky inside
          it, sitting above the breakouts that pass beneath — which is why the
          breakouts carry their own left-lane scrim: the index has to clear
          4.5:1 over any frame. data-on-dark is set by the motion module while
          a breakout is behind it. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 hidden w-60 lg:block">
        {/* THE RAIL CARRIES ITS OWN GROUND.
            The index has to clear 4.5:1 over whatever is behind it, and what
            is behind it changes twice per breakout. Leaving the contrast to
            the breakout's own left-lane scrim only works once the breakout
            fills the viewport — while it is still rising, the rail is half
            over canvas and half over charcoal, and the dark ink on the lower
            half was unreadable. So the lane is opaque and flips ground and
            ink together, on the one frame where the breakout covers
            everything (`top top` — see the module). */}
        <div
          data-record-rail
          /* h-svh, not max-h-svh. On content height the lane stopped wherever
             the SORT list ended and left a strip of the breakout showing under
             it, so the panel and the frame it sits on disagreed about where the
             screen ends. The content stays top-aligned — the frame puts the
             eyebrow at y=78 in the grid and the breakouts alike — and the lane
             now runs the full viewport behind it. */
          /* Ink is CHARCOAL, not evergreen. Every colour the frame gives the
             rail is an alpha of rgba(9,14,18,·) — 22% spine, 45% facet and
             count, 55% type, 75% source — so `text-current/xx` only lands on
             the specified value if `current` is #090e12. It was evergreen
             (#22372b), which tinted the whole lane green. */
          className={`pointer-events-auto bg-canvas px-10 pt-20 text-charcoal transition-colors duration-(--dur-medium) ease-quiet data-[on-dark]:bg-charcoal data-[on-dark]:text-canvas ${
            RECORD_STICKY_RAIL
              ? /* Sticks for the whole section, so the filter stays in reach
                   past the first row. h-svh, not content height: the lane has
                   to reach the foot of the screen or a strip of the breakout
                   shows under the panel. */
                "sticky top-0 h-svh overflow-y-auto"
              : /* In flow, the rail must not run past the first card row
                   (80 + 700 = 780) or it paints canvas over the breakout that
                   follows. */
                "relative overflow-y-auto lg:max-h-[780px]"
          }`}
        >
          {/* rail · eyebrow (2508:14442) — Yellow Ochre #d69828, which IS
              --color-ochre. It was set in `oxide` (rust red #c23d31), a
              different colour entirely. Gold on the dark flip, where ochre
              does not carry. */}
          <p className="eyebrow text-[11px] leading-[15px] tracking-[0.1em] text-ochre [[data-on-dark]_&]:text-gold">
            {browserCopy.title}
          </p>
          {/* rail · count (2508:14443) — 28px, 10px under the eyebrow. */}
          {/* `key` on the count so React remounts this node whenever the
              figure changes and the 160ms quiet fade replays. A plain swap —
              never an odometer. */}
          <p
            key={filtered.length}
            aria-live="polite"
            className="count-swap headline mt-2.5 text-[28px] leading-none"
          >
            {filtered.length} {filtered.length === 1 ? "item" : "items"}
          </p>

          {/* ⚠ NO SEARCH FIELD HERE. The 34 rail nodes the hi-fi specifies
              (2508:14442 … 2531:17311) run eyebrow → count → rule → TYPE →
              SOURCE → SORT with nothing between the count's rule and TYPE.
              The lo-fi browser's search input used to sit there; it pushed
              every facet ~61px down the frame and, unheld, ran the panel past
              the first card row and over the breakout beneath it.
              The input is NOT lost — the small-screen control strip below
              still carries it, and `query` still filters. */}
          <RailRule />

          <p className={facetLabel}>Type</p>
          <ul ref={typeListRef} className="relative mt-3">
            {/* rail · spine — the type list's own hairline. */}
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-px bg-current/[0.22]"
            />
            {/* rail · tick — POSITION. Scroll-driven and read-only. */}
            <span
              aria-hidden
              data-rail-tick
              /* 3 x 18, Yellow Ochre — the same #d69828 as the eyebrow
                 (2508:14459), not gold. */
              className="absolute left-0 h-[18px] w-[3px] bg-ochre transition-[top,opacity] duration-(--dur-small) ease-quiet"
              style={{ top: tickTop ?? 0, opacity: tickTop === null ? 0 : 1 }}
            />
            <RailType
              label="All types"
              count={items.length}
              selected={!type}
              onSelect={() => { capture(); setType(""); }}
            />
            {liveTypes.map((option) => (
              <RailType
                key={option}
                label={TYPE_PLURAL[option] ?? option}
                type={option}
                count={typeCounts.get(option) ?? 0}
                selected={type === option}
                onSelect={() => { capture(); setType(type === option ? "" : option); }}
              />
            ))}
          </ul>

          <RailRule />

          <p className={`${facetLabel} mt-5`}>Source</p>
          {/* 26px pitch — the frame's source rows run 480, 506, 532, 558. The
              12px row measures 18, so the gap is 8. */}
          <ul className="mt-3 space-y-[8px]">
            <RailSource
              label="All sources"
              keyClass="bg-transparent"
              active={!source}
              onSelect={() => { capture(); setSource(""); }}
            />
            {recordSources.map((option) => (
              <RailSource
                key={option}
                label={option}
                keyClass={SOURCE_KEY[option]}
                active={source === option}
                onSelect={() => { capture(); setSource(source === option ? "" : option); }}
              />
            ))}
          </ul>

          <RailRule />

          <p className={`${facetLabel} mt-5`}>{browserCopy.sortLabel}</p>
          {/* 22px pitch — the frame's sort rows run 636, 658, 680. Work Sans
              11 / 0.3px throughout: SemiBold at full ink for the live one
              (2531:17308), Regular at 45% for everything else (2531:17311). */}
          <div className="mt-3 space-y-[11px] text-[11px] tracking-[0.03em]">
            {/* ⚠ The frame asks for Newest / Oldest first. The items carry no
                published date, so those two render as visible holds — an
                invented date on a page called The Record is exactly the wrong
                thing to fake (src/content/the-record.ts). They take the
                frame's OFF styling rather than a fainter one of their own, so
                the rail reads as designed until the dates arrive. */}
            <p data-placeholder="held-control" className="font-normal text-current/45">
              Newest first
            </p>
            <p data-placeholder="held-control" className="font-normal text-current/45">
              Oldest first
            </p>
            {/* ⚠ NOT IN THE FRAME. "Record order" is the actual default sort —
                the order the draft lists the items in — and the frame's own
                default ("Newest first") is the one that cannot run yet. Kept
                so the live default is nameable and reversible from A–Z. */}
            <button
              type="button"
              onClick={() => setSort("record")}
              className={`block text-left ${
                sort === "record"
                  ? "font-semibold text-current"
                  : "font-normal text-current/45 hover:text-current"
              }`}
            >
              Record order
            </button>
            {/* A–Z and Clear share a row (x=40 and x=112 at y=680). */}
            <div className="flex gap-[32px]">
              <button
                type="button"
                onClick={() => setSort("az")}
                className={
                  sort === "az"
                    ? "font-semibold text-current"
                    : "font-normal text-current/45 hover:text-current"
                }
              >
                A&ndash;Z
              </button>
              {isFiltered ? (
                <button
                  type="button"
                  onClick={clear}
                  className="font-normal text-current/45 underline-offset-4 hover:text-current hover:underline"
                >
                  {browserCopy.clearLabel}
                </button>
              ) : null}
            </div>
          </div>

          {tag ? (
            <button
              type="button"
              onClick={() => setTag("")}
              className="eyebrow mt-5 rounded-sm border border-current/40 px-3 py-1.5 text-[0.625rem]"
            >
              #{tag} &times;
            </button>
          ) : null}
        </div>
      </div>

      {/* The rail's small-screen twin — a plain horizontal control strip. The
          sticky lane needs a lane; below lg there isn't one. */}
      <div className="border-b border-evergreen/15 px-6 py-8 lg:hidden">
        <p className="eyebrow text-oxide">{browserCopy.title}</p>
        <p aria-live="polite" className="headline mt-2 text-2xl text-evergreen">
          {filtered.length} of {items.length}
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={browserCopy.searchLabel}
            aria-label={browserCopy.searchLabel}
            className="rounded-sm border border-evergreen/25 bg-transparent px-4 py-3 text-sm text-evergreen focus:border-oxide focus:outline-none"
          />
          <select
            value={type}
            aria-label="Content type"
            onChange={(event) => setType(event.target.value)}
            className="rounded-sm border border-evergreen/25 bg-transparent px-4 py-3 text-sm text-evergreen focus:border-oxide focus:outline-none"
          >
            <option value="">{browserCopy.typeLabel}</option>
            {liveTypes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={source}
            aria-label="Source"
            onChange={(event) => setSource(event.target.value)}
            className="rounded-sm border border-evergreen/25 bg-transparent px-4 py-3 text-sm text-evergreen focus:border-oxide focus:outline-none"
          >
            <option value="">{browserCopy.sourceLabel}</option>
            {recordSources.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        {isFiltered ? (
          <button
            type="button"
            onClick={clear}
            className="eyebrow mt-4 text-oxide underline-offset-4 hover:underline"
          >
            {browserCopy.clearLabel}
          </button>
        ) : null}
      </div>

      {filtered.length > 0 ? (
        <div ref={gridRef} className={`lg:pl-60 ${DECK_TOP}`}>
          {blocks.map((block, index) => (
            <RecordFrame
              key={
                block.kind === "cards"
                  ? `cards-${index}`
                  : `breakout-${block.breakout.slug}`
              }
              items={block.items}
              offset={block.offset}
              media={media}
              breakout={block.kind === "breakout" ? block.breakout : undefined}
              /* No gap above the first block — the container's own top
                 padding places it. */
              gap={index === 0 ? "" : BLOCK_GAP}
            />
          ))}
        </div>
      ) : (
        /* Same column as the cards — this used to sit on pl-70/pr-10, a
           different left edge from the grid it replaces. */
        <div className="px-6 py-24 lg:pr-[50px] lg:pl-60">
          <div className="max-w-xl rounded-3xl border border-dashed border-evergreen/30 p-10">
            <p className="eyebrow text-oxide">Nothing found</p>
            <p className="mt-3 text-sm leading-relaxed text-evergreen/70">
              {browserCopy.empty}
            </p>
            {/* D25 — the only empty state on the site that offers a
                conversation goes to the contribute block on this page. */}
            <p className="mt-5">
              <a
                href={browserCopy.emptyCta.href}
                className="eyebrow text-xs text-oxide underline underline-offset-4 hover:text-evergreen"
              >
                {browserCopy.emptyCta.label} &rarr;
              </a>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

function RailRule() {
  return <span aria-hidden className="mt-5 block h-px w-full bg-current/20" />;
}

/**
 * One TYPE row. Selection is carried by WEIGHT and ink — never by the tick,
 * which belongs to position. `data-rail-type` is how the tick finds its row.
 */
function RailType({
  label,
  type,
  count,
  selected,
  onSelect,
}: {
  label: string;
  /** The RecordType this row filters on; absent on "All types". */
  type?: string;
  count: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <li data-rail-type={type ?? "__all"}>
      {/* 34px pitch — the frame's rows run 206, 240, 274 … — from a 13px line
          and 10px of padding either side. `items-start`, not baseline: the
          two-line row ("Historical accounts") must keep its count on the FIRST
          line, which is where 2508:14451 sits. */}
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className="flex w-full items-start gap-2 py-[10px] pl-5 text-left transition-colors duration-(--dur-small)"
      >
        {/* WEIGHT IS SELECTION, and it is the only thing that is.
            Two signals share this column and must not be confused: weight
            changes ONLY when a row is pressed, while the ochre tick is
            position — scroll-driven and read-only. Ink dims with the row too,
            but weight is the signal that says "you chose this".

            The weight has to sit on THIS span, not on the button: `.eyebrow`
            hard-sets font-weight 800, so a weight class on the parent was
            silently overridden and every row rendered ExtraBold whatever its
            state. (The frame's text nodes show both states ExtraBold for the
            same reason — they record that bug, not the intent.) */}
        <span
          className={`eyebrow flex-1 text-[12px] leading-[13px] tracking-[0.1em] ${
            selected
              ? "font-extrabold text-current"
              : "font-medium text-current/55 hover:text-current/85"
          }`}
        >
          {label}
        </span>
        {/* rail · count — Work Sans Medium 10 / 0.6px. Dims with the row:
            full ink on the live one (2508:14447), 45% otherwise
            (2508:14449). */}
        <span
          className={`shrink-0 text-[10px] leading-[13px] tracking-[0.06em] tabular-nums ${
            selected ? "text-current" : "text-current/45"
          }`}
        >
          {count}
        </span>
      </button>
    </li>
  );
}

function RailSource({
  label,
  keyClass,
  active,
  onSelect,
}: {
  label: string;
  keyClass: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={active}
        /* 9px between the 11px key and the label — the frame puts the key at
           x=40 and the label at x=60 (2508:14462 / 2508:14463). */
        className={`flex w-full items-center gap-[9px] text-left text-[12px] tracking-[0.02em] transition-colors duration-(--dur-small) ${
          active
            ? "font-semibold text-current"
            : "font-medium text-current/75 hover:text-current"
        }`}
      >
        <span
          aria-hidden
          className={`size-[11px] shrink-0 rounded-full border border-current/45 ${keyClass}`}
        />
        {label}
      </button>
    </li>
  );
}

/**
 * ONE ROW OF THREE. The frame puts the columns at x=240, 634 and 1028, each
 * 362 wide — so card 1 is FLUSH with the rail lane (which ends at 240) and the
 * run stops 50px short of the right edge. It was `lg:px-10`, which inset the
 * left by 40 and squeezed every card to 352. The 32px gap is gap-8 and was
 * already right.
 *
 * EVERY CARD IS A CELL. Each one is marked with its own slug, and each one
 * has a screen of the same slug waiting in the same frame — so any card can be
 * the one that leaves. Which of them does so on its own, as the reader scrolls,
 * is a separate question the breakout data answers; the rest wait to be asked.
 */
function CardRow({
  items,
  offset,
  media,
}: {
  items: readonly RecordItem[];
  offset: number;
  media: Record<string, ResolvedSlot>;
}) {
  return (
    <div className="grid w-full gap-8 px-6 py-14 sm:grid-cols-2 lg:grid-cols-3 lg:py-0 lg:pr-[50px] lg:pl-0">
      {items.map((item, i) => (
        <RecordCard
          key={item.slug}
          item={item}
          slot={media[item.slug]}
          glyph={CARD_GLYPHS[(offset + i) % CARD_GLYPHS.length]}
        />
      ))}
    </div>
  );
}

/**
 * Card / Record (Figma 2468:8553). Ground is SOURCE-coded. The title box is
 * bottom-aligned and fixed-height so one- and two-line titles share a
 * baseline, which is what puts the body and subject line on the same y across
 * a row — the reason the frame specifies it that way.
 */
function RecordCard({
  item,
  slot,
  glyph,
}: {
  item: RecordItem;
  slot: ResolvedSlot | undefined;
  glyph: SeamGlyphMotif;
}) {
  const noImage = !slot?.src;
  return (
    <Link
      href={`/the-record/${item.slug}`}
      data-record-card
      data-entry-type={item.type}
      /* THE CELL KEEPS ITS BOX. This element is never moved out of the grid
         and never absolutely positioned — the plate is a separate full-bleed
         element that is measured ONTO it and then grows. So the card simply
         goes invisible at the swap and the row it was in does not reflow,
         which is the whole reason frames 03–05 can show the grid holding
         still behind the flight.

         The slug is how the module pairs this card with its own screen, and
         how it works out which cards are the neighbours that step back. */
      data-breakout-cell={item.slug}
      /* 700 tall at lg, FIXED — the frame's card is 362 x 700 and every row
         is built on it. Auto height left rows short; a floor let the ones
         with a long summary grow to 717, and that drift compounded down the
         deck (breakouts B and C landed 17px late). The summary is clamped
         below so nothing has to overflow to fit. */
      className={`group relative flex flex-col overflow-hidden rounded-3xl lg:h-[700px] ${SOURCE_GROUND[item.source]} text-canvas transition-transform duration-(--dur-medium) ease-country hover:-translate-y-1`}
    >
      <div className="relative aspect-[362/320] w-full overflow-hidden">
        {noImage ? (
          /* The frame's own instruction for an entry with no photograph:
             flatten the band to canvas at 6%, hide the scrim, and carry the
             draft's own marker in the band itself — the note says what is
             missing and why, rather than a corner glyph that reads as damage. */
          <>
            <span aria-hidden className="absolute inset-0 bg-canvas/6" />
            <span
              data-placeholder="no-image"
              className="absolute inset-0 flex items-center px-9 text-[0.8125rem] leading-relaxed text-canvas/45"
            >
              [ no image supplied in the draft &mdash; this card carries type
              only ]
            </span>
          </>
        ) : (
          <>
            <MediaOrField
              src={slot.src}
              alt={slot.expects}
              sizes="(min-width: 1024px) 362px, (min-width: 640px) 50vw, 100vw"
              fieldClass={FIELD_TONE[slot.tone]}
              className={
                /* frame grade: the world moves and the record holds, so a
                   graded frame does not scale on hover. */
                MOTION_GRADE[slot.bucket] === "frame"
                  ? "object-cover"
                  : "object-cover transition-transform duration-(--dur-large) ease-country group-hover:scale-105"
              }
            />
            <span aria-hidden className="absolute inset-0 bg-black/35" />
          </>
        )}
        <SeamGlyph motif={glyph} className="top-8 left-9 w-11" />
      </div>

      <div className="flex flex-1 flex-col px-9 pt-5 pb-9">
        <p className="eyebrow text-[0.6875rem] text-gold">
          {item.type}&ensp;&middot;&ensp;{item.source}
        </p>
        <h3 className="headline mt-3 flex min-h-[5.25rem] items-end text-[2rem] leading-tight">
          {item.title}
        </h3>
        {/* Clamped so a long summary cannot push the card past 700. The
            content box is 380 tall and the eyebrow, title and subject line
            claim ~222 of it. */}
        <p className="mt-3 line-clamp-5 text-base leading-relaxed text-canvas/85">
          {item.summary}
        </p>
        <p className="eyebrow mt-auto pt-6 text-gold">
          {item.subjects.join(" · ")}
        </p>
      </div>
    </Link>
  );
}

/**
 * ONE FRAME — a row of cards, and a screen for every one of them.
 *
 * THE SECTION IS THE ROW AND THE SCREEN AT ONCE, which is the change the
 * transition strip forces. The breakout used to be its own section a viewport
 * below its card, and that geometry made the strip's central claim impossible:
 * by the time the screen arrived, the card it claims to be was off the top of
 * the page, so nothing could fly from it. Here the row and its screens share
 * one pinned frame, the card is on screen when the flight starts, and Flip has
 * two real rects to measure.
 *
 * EVERY CARD HAS A SCREEN, not just the three the record breaks out on its
 * own. A card is a preview of an entry and the screen is that entry taking the
 * frame — clicking one and being sent off the page, past a full-bleed version
 * of the very thing you clicked, is the page arguing with itself. So the
 * screens are all here, all inert, waiting to be asked.
 *
 * WHAT MAKES A BREAKOUT DIFFERENT is only that it asks itself. `breakout` says
 * which entry in this row takes the screen unprompted as the reader scrolls,
 * and buys the section a third viewport for the runway that arrival and
 * departure need. Everything else is the same object.
 *
 * WHAT MOVES IS OWNED BY src/lib/motion/record.ts. This file lays out the room
 * and marks the parts; it sets no opacities and no transforms beyond the
 * resting `opacity-0` that keeps the screens off the page until the module has
 * something to say.
 */
function RecordFrame({
  items,
  offset,
  media,
  breakout,
  gap,
}: {
  items: readonly RecordItem[];
  offset: number;
  media: Record<string, ResolvedSlot>;
  /** Present when one entry in this row breaks out on its own. */
  breakout?: Breakout;
  gap: string;
}) {
  return (
    /* THE PIN — and why it is CSS sticky rather than ScrollTrigger's.
       ScrollTrigger's `pin` wraps the node in a spacer div, and this section
       unmounts whenever a filter is applied; React then tries to remove a node
       whose parent is now GSAP's spacer and the page dies with "removeChild:
       the node to be removed is not a child of this node". Sticky buys the
       same hold and never touches the tree. */
    <section
      data-record-slide
      data-record-frame
      {...(breakout
        ? { "data-record-breakout": "", "data-breakout-auto": breakout.slug }
        : null)}
      className={`relative lg:-ml-60 ${gap} ${
        breakout ? BREAKOUT_PIN : SLIDE
      }`}
    >
      <div data-breakout-frame className={`relative bg-canvas ${FRAME}`}>
        {/* The row, in the grid's own lane. Unpinned this is simply the row —
            the same three cards in the same column as every other row, which
            is what the reader gets under reduced motion. */}
        <div className="relative w-full lg:pl-60">
          <CardRow items={items} offset={offset} media={media} />
        </div>

        {items.map((item, i) => (
          <RecordScreen
            key={item.slug}
            item={item}
            slot={media[item.slug]}
            glyph={CARD_GLYPHS[(offset + i) % CARD_GLYPHS.length]}
            diagram={breakout?.slug === item.slug ? breakout.diagram : undefined}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * One entry as the whole screen — the thing a card becomes.
 *
 * Stacked over the row, one per card, and all of them transparent until the
 * module flies one. They are `pointer-events-none` so a reader clicking a card
 * clicks the CARD and not the invisible screen lying over it, and the one
 * thing inside that takes clicks — the link out to the entry — is `inert`
 * until its flight has landed.
 *
 * The left lane keeps its own fade, so the index over the top of the plate
 * clears 4.5:1 against any frame — but it ramps WITH the plate rather than
 * being painted at rest, because at rest there is nothing behind the rail but
 * the grid's own canvas.
 */
function RecordScreen({
  item,
  slot,
  glyph,
  diagram,
}: {
  item: RecordItem;
  slot: ResolvedSlot | undefined;
  glyph: SeamGlyphMotif;
  /** Card 12 takes the screen as a TYPE frame: the bore, drawn to scale. */
  diagram?: Breakout["diagram"];
}) {
  return (
    <div
      data-breakout-screen={item.slug}
      /* The permission travels with the frame. `frame` grade means the world
         moves and the record holds — the module reads this rather than
         deciding for itself what may be pushed. The strip calls breakout B
         FRAME grade: the plate, the ground, the scrim, the type and the index
         all animate at full weight, and the image plane itself does not. */
      data-motion-grade={slot ? MOTION_GRADE[slot.bucket] : "frame"}
      className={`pointer-events-none absolute inset-0 ${SCREEN_GATE}`}
    >
      {/* THE PLATE — the full bleed, measured onto the card and grown out of
          it. Rendered at its FINAL size and transformed DOWN to the card's box
          by the module, never laid out small and grown: a plate that changed
          size would re-rasterise its photograph at every step, and the strip is
          explicit that this is transforms only. */}
      <div
        aria-hidden
        data-breakout-plate
        className={`absolute inset-0 overflow-hidden bg-charcoal text-canvas ${SCREEN_PART}`}
      >
        {/* THREE NESTED PLANES, and they are not the same job.

            [data-breakout-image] carries the COUNTER-SCALE: while the plate is
            squeezed to the card's 362x700, this is stretched by the inverse, so
            what is inside it is never warped — the crop tightens, the plane
            does not distort, which is what FRAME grade forbids. The bore
            diagram is inside it for the same reason: a 480-metre depth line
            squashed to a quarter of its width for the length of the flight is a
            diagram that is briefly lying.

            [data-breakout-push] carries M1, the 1.00 → 1.04 push through the
            hold, and only at full grade. One element doing both would have the
            two multiplying.

            [data-breakout-scrim] is OUTSIDE the counter-scale, deliberately:
            fitted to the plate it always paints its full gradient over whatever
            the plate currently is — light at the top, dense at the foot — which
            at card size is the card's own photo band over its own ground. That
            is what makes the swap survive. */}
        <div data-breakout-image className="absolute inset-0">
          {diagram === "bore" ? (
            <BoreDiagram />
          ) : (
            <div data-breakout-push className="absolute inset-0">
              <MediaOrField
                src={slot?.src ?? null}
                alt={slot?.expects ?? item.title}
                sizes="100vw"
                fieldClass={FIELD_TONE[slot?.tone ?? "charcoal"]}
              />
            </div>
          )}
        </div>
        {diagram === "bore" ? null : (
          <div
            data-breakout-scrim
            className="absolute inset-0"
            style={{ backgroundImage: SOURCE_SCRIM[item.source] }}
          />
        )}
      </div>

      {/* scrim · left lane — the fade beside the rail, ramped with the plate
          (X5, tied to plate progress). The solid part of the lane is the rail's
          own ground, so painting it again here only produced a seam where the
          two darks disagreed. */}
      <div
        aria-hidden
        data-breakout-lane
        className={`absolute inset-y-0 left-60 w-75 bg-linear-to-r from-charcoal/85 via-charcoal/40 to-transparent ${SCREEN_PART}`}
      />

      {/* THE COPY, which arrives after the plate has landed and not with it.
          Frame 05 is the proof frame — "the plate has arrived and the copy has
          not" — because a headline riding the flight is a headline the reader
          cannot read for the whole 0.9s.

          INERT UNTIL IT LANDS, and the module owns that. Clicking the card no
          longer follows its link — it opens this screen — so the screen has to
          carry the way on to the entry, and a link nobody can see is a link
          nobody should be able to tab to either. `inert` is what takes it out
          of both the tab order and the accessibility tree at once; the module
          drops it the moment the flight completes and puts it back the moment
          the flight leaves. Below the `hold:` threshold the whole block is
          display:none and the card is an ordinary link again, so there is
          nothing to gate. */}
      <div
        data-breakout-copy
        inert
        className={`absolute inset-x-0 top-1/2 -translate-y-1/2 ${SCREEN_PART}`}
      >
        <div className="mx-auto w-full max-w-7xl px-6 text-canvas lg:pr-16 lg:pl-[21rem]">
          <p
            data-breakout-arrive
            className="eyebrow text-lg text-gold sm:text-eyebrow-hero"
          >
            {item.type}&ensp;&middot;&ensp;{item.source}
          </p>
          <h2
            data-breakout-arrive
            className="headline mt-4 max-w-4xl text-5xl leading-[1.2] sm:text-6xl lg:text-7xl"
          >
            {item.title}
          </h2>
          <p
            data-breakout-arrive
            className="mt-10 max-w-3xl text-lg leading-relaxed text-canvas/90 sm:text-xl"
          >
            {item.summary}
          </p>
          <p data-breakout-arrive className="eyebrow mt-8 text-gold">
            {item.subjects.join(" · ")}
          </p>
          {/* THE WAY ON. The card that flew here is behind the plate and
              hidden, so this is the entry's only route out of the screen. */}
          <p data-breakout-arrive className="mt-8">
            <Link
              href={`/the-record/${item.slug}`}
              className="eyebrow pointer-events-auto text-canvas underline-offset-8 hover:underline"
            >
              Read the entry &rarr;
            </Link>
          </p>
        </div>
      </div>

      {/* The screen's own corner marks. ⚠ These carry SCREEN_PART and
          [data-breakout-arrive] like every other part of the screen: without
          them the pair sat at full opacity inside a hidden-but-laid-out
          screen and painted over the grid — a gold cluster and a glyph
          floating beside cards that had nothing to do with them. They arrive
          last in the copy's stagger. The wrapper is inset-0 so the stagger's
          y-offset cannot become a containing block that moves them. */}
      {slot?.src ? (
        <div
          aria-hidden
          data-breakout-arrive
          className={`absolute inset-0 ${SCREEN_PART}`}
        >
          <ClusterArtwork tone="gold" className="top-24 right-[6%] w-28" />
          <SeamGlyph motif={glyph} className="right-[10%] bottom-24 w-11" />
        </div>
      ) : null}
    </div>
  );
}

/**
 * BREAKOUT C · the bore, 480 metres to scale — card 12 takes the screen as a
 * TYPE frame with no photograph, because there is no photograph of a pollen
 * grain sixty metres down and the depth IS the story. One tick per sample,
 * every six metres, exactly as the draft describes the drilling log.
 */
const BORE_DEPTH = 480;
const BORE_STEP = 6;
const POLLEN_DEPTH = 60;

function BoreDiagram() {
  const samples = Array.from(
    { length: BORE_DEPTH / BORE_STEP + 1 },
    (_, i) => i * BORE_STEP,
  );
  return (
    <div aria-hidden className="absolute inset-0 bg-midnight">
      <div className="absolute top-[12%] bottom-[12%] left-[12%] w-px bg-canvas/30 lg:left-[21%]">
        {/* The descent itself. 480 metres is the story, so the hold spends its
            scroll going down the hole rather than sitting still: the module
            scrubs this from the surface to the floor. */}
        <span
          data-bore-fill
          className="absolute inset-x-0 top-0 h-full origin-top bg-gold/70"
        />
        {samples.map((depth) => (
          <span
            key={depth}
            className={`absolute right-0 ${
              depth === POLLEN_DEPTH
                ? "h-[3px] w-10 bg-gold"
                : depth % 60 === 0
                  ? "h-px w-[18px] bg-canvas/45"
                  : "h-px w-2 bg-canvas/25"
            }`}
            style={{ top: `${(depth / BORE_DEPTH) * 100}%` }}
          />
        ))}
        <span
          className="eyebrow absolute left-12 text-[0.625rem] whitespace-nowrap text-gold"
          style={{ top: `${(POLLEN_DEPTH / BORE_DEPTH) * 100}%` }}
        >
          60 m &mdash; the pollen
        </span>
        <span className="eyebrow absolute -bottom-6 -left-8 text-[0.625rem] text-canvas/50">
          480 m
        </span>
      </div>
    </div>
  );
}

/**
 * Split the card stream into blocks, dropping a breakout in after the card
 * count it belongs behind. Returns card blocks and breakout blocks in order.
 */
type Block =
  | { kind: "cards"; items: RecordItem[]; offset: number }
  /* A breakout block IS a card row — the one containing the entry that leaves
     it. The row is not a separate block that happens to sit above; it is
     inside the breakout's own pinned frame, because the flight has to start
     from a card the reader can still see. */
  | { kind: "breakout"; breakout: Breakout; items: RecordItem[]; offset: number };

/**
 * One row of three is one SLIDE, and a breakout is one slide. The run used to
 * be "every card between two breakouts", which produced blocks of six — two
 * rows — and a slide has to be a single screen or the deck cannot hold it.
 */
const ROW = 3;

function chunk(
  items: readonly RecordItem[],
  breakouts: Map<number, Breakout>,
): Block[] {
  const blocks: Block[] = [];
  const run: RecordItem[] = [];
  let seen = 0;

  const flush = () => {
    while (run.length) {
      const row = run.splice(0, ROW);
      blocks.push({ kind: "cards", items: row, offset: seen - run.length - row.length });
    }
  };

  items.forEach((item, index) => {
    run.push(item);
    seen = index + 1;
    if (run.length === ROW || breakouts.has(seen)) flush();
    const breakout = breakouts.get(seen);
    if (!breakout) return;

    /* THE HOST ROW IS CLAIMED, not duplicated. Each breakout sits after the
       row that contains its own entry — after 3, 9 and 12, which are the ends
       of the rows holding cards 1, 7 and 12 — so the row that was just
       flushed is the one the flight starts from, and it moves inside the
       breakout rather than staying a block of its own.

       The `some` is the check that this is true rather than assumed. If the
       record is reordered so a breakout's entry is no longer in the row above
       it, the flight has no card to measure; the breakout then renders with
       an empty row, which reads as the old full-bleed block and is visibly
       wrong rather than silently flying from the wrong card. */
    const previous = blocks[blocks.length - 1];
    if (
      previous?.kind === "cards" &&
      previous.items.some((entry) => entry.slug === breakout.slug)
    ) {
      blocks.pop();
      blocks.push({
        kind: "breakout",
        breakout,
        items: previous.items,
        offset: previous.offset,
      });
      return;
    }
    blocks.push({ kind: "breakout", breakout, items: [], offset: seen });
  });
  flush();
  return blocks;
}
