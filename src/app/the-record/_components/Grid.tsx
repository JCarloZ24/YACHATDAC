"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { register, start } from "@/lib/motion-controller";
import { createWaveRoll } from "@/lib/motion/wave-roll";
import { createRecordMasonry } from "@/lib/motion/record-masonry";
import { createRecordCardHover } from "@/lib/motion/record-card-hover";
import { browserCopy, type RecordItem, type RecordSource } from "@/content/the-record";
import type { MediaSlot } from "@/content/lofi/media";
import { MediaOrField } from "@/components/ui/MediaOrField";
import { SeamGlyph, WaveDivider, type SeamGlyphMotif } from "@/components/ui/Furniture";

/**
 * User direction 2026-09-09 supersedes D21's filter rail: the catalogue is a
 * full-width masonry on the original cream ground, with no facets. Existing
 * incoming type/source/tag links still resolve.
 * Native columns preserve DOM, keyboard and reading order down each column.
 *
 * Same day, second pass (user-supplied frames): the bare masonry photo returns
 * to D21's boxed card — one rounded block per entry, ground SOURCE-coded, the
 * photo band on top and the type block on the colour below. Column flow and
 * the scroll pass are unchanged; only the card inside each tile is redrawn.
 */
export type ResolvedSlot = Pick<MediaSlot, "bucket" | "expects" | "tone"> & {
  src: string | null;
};

const FIELD_TONE: Record<MediaSlot["tone"], string> = {
  evergreen: "bg-evergreen", midnight: "bg-midnight", roasted: "bg-roasted",
  oxide: "bg-oxide", burnt: "bg-burnt", eucalyptus: "bg-eucalyptus", charcoal: "bg-charcoal",
};

/** D21 stands: the source axis is the page's colour system, one ground per
 * epistemology. */
const SOURCE_GROUND: Record<RecordSource, string> = {
  "Iningai knowledge": "bg-evergreen",
  "Colonial record": "bg-roasted",
  "Published research": "bg-midnight",
};

// One band proportion across the set — the supplied frames show a constant
// photo height; card heights vary from the type, which is what the masonry
// columns read.
const PHOTO_BAND = "aspect-[8/7]";
const PHOTO_GLYPHS: SeamGlyphMotif[] = ["a", "b", "c"];

export function RecordGrid({ items, media, initialType = "", initialSource = "", initialTag = "" }: {
  items: readonly RecordItem[];
  media: Record<string, ResolvedSlot>;
  initialType?: string;
  initialSource?: string;
  initialTag?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const router = useRouter();
  useEffect(() => {
    if (!root.current) return;
    const unregister = register(createWaveRoll(root.current, "record-wave"));
    const unregisterMasonry = register(createRecordMasonry(root.current));
    const unregisterHover = register(createRecordCardHover(root.current));
    start();
    return () => { unregisterHover(); unregisterMasonry(); unregister(); };
  }, [items, initialType, initialSource, initialTag]);
  const visible = items.filter((item) =>
    (!initialType || item.type === initialType) &&
    (!initialSource || item.source === initialSource) &&
    (!initialTag || item.tags?.includes(initialTag)),
  );
  return (
    <section ref={root} id="research-and-discovery" tabIndex={-1} data-record-grid
      aria-label={browserCopy.title} className="record-ground relative isolate px-6 pt-16 pb-32 lg:px-8 lg:pt-24 lg:pb-44">
      <WaveDivider ground="var(--record-knowledge-ground)" hook="record-wave" />
      <h2 className="sr-only">{browserCopy.title}</h2>
      {initialType || initialSource || initialTag ? (
        <Link href="/the-record#research-and-discovery" className="eyebrow mb-10 inline-block text-sm underline underline-offset-4">
          {browserCopy.clearLabel}
        </Link>
      ) : null}
      <div className="columns-1 gap-8 lg:columns-3">
        {visible.map((item, index) => {
          const slot = media[item.slug];
          return (
            <div key={item.slug} data-record-tile className="mb-8 break-inside-avoid lg:mb-12">
            <Link href={`/the-record/${item.slug}`} prefetch={true} data-record-card
              /* X7 / SYS-02, 11 September 2026: the shared loader covers
                 navigation and the actual responsive article image decode. */
              onPointerEnter={() => router.prefetch(`/the-record/${item.slug}`)}
              onFocus={() => router.prefetch(`/the-record/${item.slug}`)}
              className="block rounded-3xl focus-visible:opacity-100! focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-gold">
              <div data-card-hover className={`relative flex flex-col overflow-hidden rounded-3xl text-canvas ${SOURCE_GROUND[item.source]}`}>
              <div className={`relative w-full overflow-hidden ${PHOTO_BAND}`}>
                {slot?.src ? (
                  <>
                    <MediaOrField src={slot.src} alt={slot.expects}
                      sizes="(min-width: 1024px) 40vw, 100vw" quality={85}
                      fieldClass={FIELD_TONE[slot.tone]} className="object-cover" />
                    <span aria-hidden className="absolute inset-0 bg-black/25" />
                  </>
                ) : (
                  /* The frame's own instruction for an entry with no photograph:
                     the band flattens to canvas at 6% and carries the draft's
                     marker, rather than a field that reads as a broken image. */
                  <>
                    <span aria-hidden className="absolute inset-0 bg-canvas/6" />
                    <span data-placeholder="no-image"
                      className="absolute inset-0 px-9 pt-24 text-[0.8125rem] leading-relaxed text-canvas/45">
                      [ no image supplied in the draft &mdash; this card carries type only ]
                    </span>
                  </>
                )}
                <SeamGlyph motif={PHOTO_GLYPHS[index % PHOTO_GLYPHS.length]} className="top-8 left-9 w-11" />
              </div>
              {/* User direction 2026-09-09: the full editorial caption sits on
                  the card's own ground, not on the page's cream. */}
              <div className="flex flex-1 flex-col px-9 pt-6 pb-9">
                <p className="eyebrow text-[11px] leading-[1.5] tracking-[0.06em] text-gold">
                  {item.type}&ensp;&middot;&ensp;{item.source}
                </p>
                <h3 className="headline mt-4 text-h3 leading-[1.12]">{item.title}</h3>
                {/* Clamped at five lines so one long summary cannot run a
                    column away from the ones beside it. */}
                <p className="mt-5 line-clamp-5 text-base leading-[1.6] text-canvas/85">{item.summary}</p>
                {item.subjects.length > 0 ? (
                  <p className="eyebrow mt-auto pt-10 text-[11px] leading-[1.6] tracking-[0.06em] text-gold">
                    {item.subjects.join(" · ")}
                  </p>
                ) : null}
              </div>
              </div>
            </Link>
            </div>
          );
        })}
      </div>
      {!visible.length ? <p className="max-w-xl py-20 text-base text-current/75">{browserCopy.empty}</p> : null}
    </section>
  );
}
