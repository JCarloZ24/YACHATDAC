"use client";

import { useMemo, useState } from "react";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import {
  browserCopy,
  recordSources,
  recordTypes,
  type RecordItem,
} from "@/content/resources";

/**
 * The record, filtered.
 *
 * The draft specifies a search field, a type select, a source select, a sort
 * select and a Clear button. Four of the five are built here against the
 * static array; the fifth is explained below.
 *
 * ⚠ SORT IS NOT WHAT THE DRAFT ASKS FOR. It specifies "Newest first / Oldest
 * first / A–Z". The record items have no published date — the draft's own
 * index does not give one — so a date sort would have to be invented, and an
 * invented date on a page called The Record is exactly the wrong thing to
 * fake. What is offered instead is the curated order (the draft's own
 * sequence, which groups by type and is not arbitrary) and A–Z. Add the date
 * sort when items carry a real `published` field, which is a CMS concern.
 *
 * ⚠ This filters an array today and should query a collection tomorrow. Build
 * documentation §8 makes Resources CMS-driven; keep the filter vocabulary in
 * src/content/resources.ts so both sides agree on the closed sets.
 *
 * Client component because it holds filter state. The cards it renders are the
 * same ArticleCard the server pages use, so an item looks identical wherever
 * it appears.
 */

type SortMode = "record" | "az";

export function RecordBrowser({
  items,
  initialType = "",
  initialSource = "",
  initialTag = "",
}: {
  items: readonly RecordItem[];
  initialType?: string;
  initialSource?: string;
  /** From `?tag=lore` — Wonder's "See all" link arrives with one. */
  initialTag?: string;
}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState(initialType);
  const [source, setSource] = useState(initialSource);
  const [tag, setTag] = useState(initialTag);
  const [sort, setSort] = useState<SortMode>("record");

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

  const isFiltered = Boolean(query || type || source || tag) || sort !== "record";

  function clear() {
    setQuery("");
    setType("");
    setSource("");
    setTag("");
    setSort("record");
  }

  const selectClass =
    "w-full rounded-sm border border-evergreen/25 bg-transparent px-4 py-3 text-sm text-evergreen focus:border-oxide focus:outline-none";

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <label className="lg:col-span-2">
          <span className="sr-only">{browserCopy.searchLabel}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={browserCopy.searchLabel}
            className={selectClass}
          />
        </label>

        <label>
          <span className="sr-only">Content type</span>
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className={selectClass}
          >
            <option value="">{browserCopy.typeLabel}</option>
            {recordTypes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="sr-only">Source</span>
          <select
            value={source}
            onChange={(event) => setSource(event.target.value)}
            className={selectClass}
          >
            <option value="">{browserCopy.sourceLabel}</option>
            {recordSources.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <label className="flex items-center gap-3">
          <span className="eyebrow text-evergreen/60">
            {browserCopy.sortLabel}
          </span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortMode)}
            className="rounded-sm border border-evergreen/25 bg-transparent px-3 py-2 text-sm text-evergreen focus:border-oxide focus:outline-none"
          >
            <option value="record">Record order</option>
            <option value="az">A–Z</option>
          </select>
        </label>

        {tag ? (
          <button
            type="button"
            onClick={() => setTag("")}
            className="eyebrow rounded-sm border border-oxide/40 px-3 py-2 text-oxide"
          >
            #{tag} &times;
          </button>
        ) : null}

        {isFiltered ? (
          <button
            type="button"
            onClick={clear}
            className="eyebrow text-oxide underline-offset-4 hover:underline"
          >
            {browserCopy.clearLabel}
          </button>
        ) : null}

        <p
          aria-live="polite"
          className="ml-auto text-sm text-evergreen/60"
        >
          {filtered.length} of {items.length}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <ArticleCard
              key={item.slug}
              title={item.title}
              summary={item.summary}
              href={`/resources/${item.slug}`}
              tag={item.type}
              meta={`${item.source} · ${item.subjects.join(" · ")}`}
              image={item.image}
              tone="canvas"
            />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-sm border border-dashed border-evergreen/30 p-10 text-center">
          <Eyebrow className="text-oxide">Nothing found</Eyebrow>
          <p className="mt-3 text-sm text-evergreen/70">{browserCopy.empty}</p>
        </div>
      )}
    </div>
  );
}
