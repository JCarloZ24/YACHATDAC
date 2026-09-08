"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  browserCopy,
  recordSources,
  recordTypes,
  type RecordItem,
  type RecordSource,
} from "@/content/the-record";
import type { MediaSlot } from "@/content/lofi/media";
import { MediaOrField } from "@/components/ui/MediaOrField";
import {
  SeamGlyph,
  WaveDivider,
  type SeamGlyphMotif,
} from "@/components/ui/Furniture";

/**
 * The Record's catalogue. D21: card grounds identify the source; the rail
 * filters by type and source. Media srcs are resolved on the server.
 *
 * F7 exception, user direction 2026-09-08: all page animations are removed.
 * Cards stay in normal flow and follow their native article links. Filtering,
 * sorting and counts update immediately; the desktop filter remains sticky
 * so the full catalogue can be browsed without returning to the first row.
 *
 * Search remains in the mobile strip, as decided on 2026-09-04. Date sorts
 * remain visible holds because the draft supplies no publication dates.
 */

export type ResolvedSlot = Pick<MediaSlot, "bucket" | "expects" | "tone"> & {
  src: string | null;
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

const FIELD_TONE: Record<MediaSlot["tone"], string> = {
  evergreen: "bg-evergreen",
  midnight: "bg-midnight",
  roasted: "bg-roasted",
  oxide: "bg-oxide",
  burnt: "bg-burnt",
  eucalyptus: "bg-eucalyptus",
  charcoal: "bg-charcoal",
};

/** The card motifs rotate across the set — the frame's own instruction. */
const CARD_GLYPHS: SeamGlyphMotif[] = ["a", "b", "c"];

type SortMode = "record" | "az";

export function RecordGrid({
  items,
  media,
  initialType = "",
  initialSource = "",
  initialTag = "",
}: {
  items: readonly RecordItem[];
  media: Record<string, ResolvedSlot>;
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

      {/* Native sticky positioning keeps the filters in reach. The rail's
          opaque canvas ground stays constant throughout the catalogue. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 hidden w-60 lg:block">
        <div
          data-record-rail
          className="pointer-events-auto sticky top-0 h-svh overflow-y-auto bg-canvas px-10 pt-20 text-charcoal"
        >
          {/* rail · eyebrow (2508:14442) — Yellow Ochre #d69828, which IS
              --color-ochre. It was set in `oxide` (rust red #c23d31), a
              different colour entirely. */}
          <p className="eyebrow text-[11px] leading-[15px] tracking-[0.1em] text-ochre">
            {browserCopy.title}
          </p>
          {/* rail · count (2508:14443) — 28px, 10px under the eyebrow. */}
          <p
            aria-live="polite"
            className="headline mt-2.5 text-[28px] leading-none"
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
          <ul className="relative mt-3">
            {/* rail · spine — the type list's own hairline. */}
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-px bg-current/[0.22]"
            />
            <RailType
              label="All types"
              count={items.length}
              selected={!type}
              onSelect={() => {
                setType("");
              }}
            />
            {liveTypes.map((option) => (
              <RailType
                key={option}
                label={TYPE_PLURAL[option] ?? option}
                count={typeCounts.get(option) ?? 0}
                selected={type === option}
                onSelect={() => {
                  setType(type === option ? "" : option);
                }}
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
              onSelect={() => {
                setSource("");
              }}
            />
            {recordSources.map((option) => (
              <RailSource
                key={option}
                label={option}
                keyClass={SOURCE_KEY[option]}
                active={source === option}
                onSelect={() => {
                  setSource(source === option ? "" : option);
                }}
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
            <p
              data-placeholder="held-control"
              className="font-normal text-current/45"
            >
              Newest first
            </p>
            <p
              data-placeholder="held-control"
              className="font-normal text-current/45"
            >
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
              className="eyebrow mt-5 rounded-sm border border-current/40 px-3 py-1.5 text-[10px]"
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
        <div className="pb-20 sm:pb-32 lg:pt-20 lg:pr-[50px] lg:pb-[168px] lg:pl-60">
          {/* Ordinary rows retain the hi-fi card sizes and 48px row gap;
              bottom padding clears the next section's overhanging wave. */}
          <div className="grid gap-x-8 gap-y-12 px-6 py-14 sm:grid-cols-2 lg:grid-cols-3 lg:p-0">
            {filtered.map((item, index) => (
              <RecordCard
                key={item.slug}
                item={item}
                slot={media[item.slug]}
                glyph={CARD_GLYPHS[index % CARD_GLYPHS.length]}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Same column as the cards — this used to sit on pl-70/pr-10, a
           different left edge from the grid it replaces. */
        <div className="px-6 py-24 lg:pr-[50px] lg:pl-60">
          <div className="max-w-xl rounded-3xl border border-dashed border-evergreen/30 p-6 lg:p-10">
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

/** One TYPE row. Selection is carried by weight and ink. */
function RailType({
  label,
  count,
  selected,
  onSelect,
}: {
  label: string;
  count: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      {/* 34px pitch — the frame's rows run 206, 240, 274 … — from a 13px line
          and 10px of padding either side. `items-start`, not baseline: the
          two-line row ("Historical accounts") must keep its count on the FIRST
          line, which is where 2508:14451 sits. */}
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className="flex w-full items-start gap-2 py-[10px] pl-5 text-left"
      >
        {/* Selection is carried by weight and ink.
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
        className={`flex w-full items-center gap-[9px] text-left text-[12px] tracking-[0.02em] ${
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
      /* 700 tall at lg, FIXED — the frame's card is 362 x 700 and every row
         is built on it. Auto height left rows short; a floor let the ones
         with a long summary grow to 717, and that drift compounded down the
         deck (breakouts B and C landed 17px late). The summary is clamped
         below so nothing has to overflow to fit. */
      className={`relative flex flex-col overflow-hidden rounded-3xl lg:h-[700px] ${SOURCE_GROUND[item.source]} text-canvas`}
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
              /* NOT the band's width. The band is 362x320 but the library's
                 photographs are ~1.9:1, so object-cover scales them by HEIGHT
                 and the rendered image runs ~608 wide behind a 362 crop. Sizes
                 must describe that covered width or the browser picks the 750w
                 rendition for a 2x screen that needs ~1216 and upscales it —
                 which is what made the cards soft. */
              sizes="(min-width: 1024px) 640px, (min-width: 640px) 90vw, 180vw"
              quality={85}
              fieldClass={FIELD_TONE[slot.tone]}
              className="object-cover"
            />
            <span aria-hidden className="absolute inset-0 bg-black/35" />
          </>
        )}
        <SeamGlyph motif={glyph} className="top-8 left-9 w-11" />
      </div>

      <div className="flex flex-1 flex-col px-9 pt-5 pb-9">
        <p className="eyebrow text-[11px] text-gold">
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
