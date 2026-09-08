import type { Metadata } from "next";
import { FooterGround } from "@/components/layout/FooterGround";
import {
  DocumentsLedger,
  KnowledgeGapsV2,
  OnRequestHold,
  RecordGrowsV2,
  RecordHeroV2,
  presentSrc,
} from "./_components/Sections";
import { RecordGrid, type ResolvedSlot } from "./_components/Grid";
import { recordCardMedia } from "@/content/record-media";
import { recordItems, recordSources, recordTypes } from "@/content/the-record";

export const metadata: Metadata = {
  title: "The Record",
  description:
    "Stories, historical accounts, research and recordings from Turraburra.",
};

/**
 * Resources — "The Record". The hi-fi build (Figma 2463:8492, 04 · The Record
 * — HI-FI · Desktop), promoted straight onto the real route the way /truth
 * was on 2026-09-02.
 *
 * Route and nav label stay `Resources` per D1; the page titles itself "The
 * Record", which is what every v3 page calls it when it links here.
 *
 * Incoming links arrive with filters already set — `/the-record?type=story`
 * from the site nav, `/the-record?tag=lore` from Wonder — so the query is read
 * here and handed to the grid as its initial state.
 *
 * The three ids other pages target are load-bearing and unchanged:
 * #research-and-discovery (the grid), #documents (Wonder's Downloads child)
 * and #do-you-hold-something (the record's own empty state, D25).
 *
 * F7 exception, user direction 2026-09-08: The Record is static. No route
 * transition, motion module, held rows or breakout overlays. Entries remain
 * native links and filters update immediately. See docs/motion/scenes.md.
 */

/**
 * Query values arrive lowercase from the nav (`?type=story`) while the filter
 * vocabulary is title-case ("Story"). Matched case-insensitively rather than
 * by lowering the vocabulary, so the rail still shows the label the draft
 * wrote. Anything unrecognised falls through to no filter — a bad query string
 * should show the whole record, not an empty page.
 */
function match(value: string | undefined, options: readonly string[]): string {
  if (!value) return "";
  return options.find((o) => o.toLowerCase() === value.toLowerCase()) ?? "";
}

/**
 * The card thumbnails, with every src checked against the filesystem here so
 * the client component never has to. See src/content/record-media.ts for what
 * is wired and what is honestly still a field.
 */
function resolveSlots(): Record<string, ResolvedSlot> {
  return Object.fromEntries(
    Object.entries(recordCardMedia).map(([slug, slot]) => [
      slug,
      {
        bucket: slot.bucket,
        expects: slot.expects,
        tone: slot.tone,
        src: presentSrc(slot.src),
      },
    ]),
  );
}

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const first = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return (
    <div data-page-root className="min-h-svh bg-charcoal">
      <RecordHeroV2 />

      <RecordGrid
        items={recordItems}
        media={resolveSlots()}
        initialType={match(first("type"), recordTypes)}
        initialSource={match(first("source"), recordSources)}
        initialTag={first("tag") ?? ""}
      />

      <KnowledgeGapsV2 />
      <DocumentsLedger />
      <OnRequestHold />
      <RecordGrowsV2 />

      {/* §06 ends on the off-white wave, not on charcoal — the footer's
          band above its burnt crest is canvas here. */}
      <FooterGround color="var(--color-canvas)" />
    </div>
  );
}
