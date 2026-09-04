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
import { MediaOrField } from "@/components/v2/MediaOrField";
import {
  ClusterArtwork,
  SeamGlyph,
  WaveDivider,
  type SeamGlyphMotif,
} from "@/components/ui/Furniture";

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
 *   · Search. The rail in Figma has no search field. Thirteen items do not
 *     need one, but incoming links and a growing CMS collection do, and
 *     dropping a working control to match a static frame is a regression, not
 *     fidelity. It sits under the count, in the rail's own register.
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
 * How long a breakout holds the screen: one viewport to arrive plus the rest
 * as hold, so exiting one costs deliberate scrolling. 100svh would be no hold
 * at all — the entry would slide past like any other section.
 */
const BREAKOUT_HOLD = "h-[180svh]";

/**
 * THE DECK. Each row of cards takes the screen and holds it, the way a
 * breakout does, and the module snaps between them so moving on reads as a
 * glide to the next slide rather than a scroll through a list.
 *
 * ⚠ ONLY WHERE IT FITS. The treatment is gated on a viewport that is both wide
 * enough for three across and TALL enough for a 700px card to sit inside it
 * with air — below that the row goes back to ordinary flow and the page
 * scrolls normally. A slide that does not fit its screen is a trap: the reader
 * cannot see the bottom of it and cannot scroll to it either, because the
 * snapping keeps pulling them back to the top of the slide.
 */
/* The `deck:` variant is declared in globals.css — see the note there for why
   it is a named variant and not an inline arbitrary media query. */
const SLIDE = "relative deck:h-svh";
const SLIDE_FRAME = "deck:sticky deck:top-0 deck:flex deck:h-svh deck:items-center";

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

  const bySlug = useMemo(
    () => new Map(items.map((item) => [item.slug, item])),
    [items],
  );

  const blocks = useMemo(
    () => chunk(filtered, breakoutsByPosition),
    [filtered, breakoutsByPosition],
  );

  /* Which entry is at the reader's eye line. A thin band across the middle of
     the viewport, so exactly one entry is "current" at a time and the tick
     does not jitter between two rows on a boundary. */
  useEffect(() => {
    const entries = document.querySelectorAll<HTMLElement>("[data-entry-type]");
    /* Nothing to observe (the empty state). The tick hides on its own: the
       measure below finds no row for a stale type and returns null. */
    if (!entries.length) return;
    const seen = new Map<Element, boolean>();
    const observer = new IntersectionObserver(
      (records) => {
        for (const r of records) seen.set(r.target, r.isIntersecting);
        /* Document order wins, so scrolling down moves the tick down. */
        for (const el of entries) {
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

  const facetLabel = "eyebrow text-[0.625rem] tracking-[0.14em] text-current/60";

  return (
    <section
      id="research-and-discovery"
      data-record-grid
      className="relative bg-canvas"
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
          className="pointer-events-auto sticky top-0 h-svh overflow-y-auto bg-canvas px-10 py-20 text-evergreen transition-colors duration-(--dur-medium) ease-quiet data-[on-dark]:bg-charcoal data-[on-dark]:text-canvas"
        >
          <p className="eyebrow text-[0.625rem] tracking-[0.14em] text-oxide [[data-on-dark]_&]:text-gold">
            {browserCopy.title}
          </p>
          <p
            aria-live="polite"
            className="headline mt-3 text-[1.75rem] leading-none"
          >
            {filtered.length} {filtered.length === 1 ? "item" : "items"}
          </p>

          <RailRule />

          {/* Retained from the lo-fi browser — see the file note. */}
          <label className="mt-5 block">
            <span className="sr-only">{browserCopy.searchLabel}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={browserCopy.searchLabel}
              className="w-full border-b border-current/25 bg-transparent pb-2 text-xs focus:border-ochre focus:outline-none"
            />
          </label>

          <RailRule />

          <p className={facetLabel}>Type</p>
          <ul ref={typeListRef} className="relative mt-3">
            {/* rail · spine — the type list's own hairline. */}
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-px bg-current/20"
            />
            {/* rail · tick — POSITION. Scroll-driven and read-only. */}
            <span
              aria-hidden
              data-rail-tick
              className="absolute left-0 h-[18px] w-[3px] bg-gold transition-[top,opacity] duration-(--dur-small) ease-quiet"
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
                label={option}
                type={option}
                count={typeCounts.get(option) ?? 0}
                selected={type === option}
                onSelect={() => { capture(); setType(type === option ? "" : option); }}
              />
            ))}
          </ul>

          <RailRule />

          <p className={`${facetLabel} mt-5`}>Source</p>
          <ul className="mt-3 space-y-2">
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
          <div className="mt-3 space-y-1.5 text-[0.6875rem]">
            {/* ⚠ The frame asks for Newest / Oldest first. The items carry no
                published date, so those two render as visible holds — an
                invented date on a page called The Record is exactly the wrong
                thing to fake (src/content/the-record.ts). */}
            <p data-placeholder="held-control" className="text-current/35">
              Newest first&ensp;&middot;&ensp;no published date yet
            </p>
            <p data-placeholder="held-control" className="text-current/35">
              Oldest first&ensp;&middot;&ensp;no published date yet
            </p>
            <button
              type="button"
              onClick={() => setSort("record")}
              className={`block text-left ${
                sort === "record" ? "" : "text-current/60 hover:text-current"
              }`}
            >
              Record order
            </button>
            <div className="flex gap-5 pt-1">
              <button
                type="button"
                onClick={() => setSort("az")}
                className={
                  sort === "az" ? "" : "text-current/60 hover:text-current"
                }
              >
                A&ndash;Z
              </button>
              {isFiltered ? (
                <button
                  type="button"
                  onClick={clear}
                  className="text-gold underline-offset-4 hover:underline"
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
        <div ref={gridRef} className="lg:pl-60">
          {blocks.map((block, index) =>
            block.kind === "cards" ? (
              <div key={`cards-${index}`} data-record-slide className={SLIDE}>
                <div className={SLIDE_FRAME}>
                  <div className="grid w-full gap-8 px-6 py-14 sm:grid-cols-2 lg:grid-cols-3 lg:px-10 lg:py-0">
                    {block.items.map((item, i) => (
                      <RecordCard
                        key={item.slug}
                        item={item}
                        slot={media[item.slug]}
                        glyph={CARD_GLYPHS[(block.offset + i) % CARD_GLYPHS.length]}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <RecordBreakout
                key={`breakout-${block.breakout.slug}`}
                breakout={block.breakout}
                item={bySlug.get(block.breakout.slug)}
              />
            ),
          )}
        </div>
      ) : (
        <div className="px-6 py-24 lg:pr-10 lg:pl-70">
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
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={`flex w-full items-baseline gap-2 py-2 pl-5 text-left transition-[color,font-weight] duration-(--dur-small) ${
          selected
            ? "font-extrabold text-current"
            : "font-medium text-current/55 hover:text-current/85"
        }`}
      >
        <span className="eyebrow flex-1 text-[0.6875rem] leading-tight">
          {label}
        </span>
        <span className="text-[0.625rem] tabular-nums">{count}</span>
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
        className={`flex w-full items-center gap-3 text-left text-xs transition-colors duration-(--dur-small) ${
          active ? "font-semibold" : "text-current/70 hover:text-current"
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
      className={`group relative flex flex-col overflow-hidden rounded-3xl ${SOURCE_GROUND[item.source]} text-canvas transition-transform duration-(--dur-medium) ease-country hover:-translate-y-1`}
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
        <p className="mt-3 text-base leading-relaxed text-canvas/85">
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
 * A breakout — one entry taking the whole screen as the grid runs past. The
 * left lane keeps its own solid scrim plus a fade, so the index over the top
 * of it clears 4.5:1 against any frame.
 */
function RecordBreakout({
  breakout,
  item,
}: {
  breakout: Breakout;
  item: RecordItem | undefined;
}) {
  if (!item) return null;
  const media = breakout.media;
  return (
    /* THE HOLD — and why it is CSS sticky rather than ScrollTrigger's pin.
       The entry takes the screen and KEEPS it: the section is taller than the
       viewport and the frame inside sticks to the top, so leaving an entry
       costs real scrolling rather than happening in passing. BREAKOUT_HOLD is
       the whole of that dial — one number, tune it there.

       ⚠ BUDGET. The frame states 738vh for this section, which is what three
       breakouts at exactly one viewport come to. Every extra viewport of hold
       is three viewports on the page. At the current setting the section
       measures roughly 990vh. That is a deliberate trade — asked for on
       4 Sep — not drift, but it is the number to look at first if the page
       starts feeling long.

       The pin could not be ScrollTrigger's in any case: its `pin` wraps the
       node in a spacer div, and this section unmounts whenever a filter is
       applied, so React then tries to remove a node whose parent is now GSAP's
       spacer and the page dies with "removeChild: the node to be removed is
       not a child of this node". Sticky buys the same hold and never touches
       the tree. */
    <section
      data-record-breakout
      data-record-slide
      data-entry-type={item.type}
      data-source={item.source}
      className={`relative lg:-ml-60 ${BREAKOUT_HOLD}`}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden bg-charcoal text-canvas">
      {breakout.diagram === "bore" ? (
        <BoreDiagram />
      ) : (
        <div data-breakout-plate className="absolute inset-0">
          <div className="absolute inset-0">
            <MediaOrField
              src={media?.src ?? null}
              alt={media?.expects ?? item.title}
              sizes="100vw"
              fieldClass={FIELD_TONE[media?.tone ?? "charcoal"]}
            />
          </div>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ backgroundImage: SOURCE_SCRIM[item.source] }}
          />
        </div>
      )}

      {/* scrim · left lane — the fade beside the rail. The solid part of the
          lane is the rail's own ground now (see the note on it), so painting
          it again here only produced a seam where the two darks disagreed. */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-60 hidden w-75 bg-linear-to-r from-charcoal/85 via-charcoal/40 to-transparent lg:block"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 lg:pr-16 lg:pl-[21rem]">
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
        <p data-breakout-arrive className="mt-8">
          <Link
            href={`/the-record/${item.slug}`}
            className="eyebrow text-canvas underline-offset-8 hover:underline"
          >
            Read the entry &rarr;
          </Link>
        </p>
      </div>

        {media?.src ? (
          <>
            <ClusterArtwork
              tone="gold"
              className="top-24 right-[6%] hidden w-28 lg:block"
            />
            <SeamGlyph
              motif={breakout.glyph}
              className="right-[10%] bottom-24 hidden w-11 lg:block"
            />
          </>
        ) : null}
      </div>
    </section>
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
  | { kind: "breakout"; breakout: Breakout };

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
    if (breakout) blocks.push({ kind: "breakout", breakout });
  });
  flush();
  return blocks;
}
