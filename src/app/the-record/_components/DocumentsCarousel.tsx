"use client";

import { useEffect, useRef, useState } from "react";
import { register, start } from "@/lib/motion-controller";
import { createRecordDocuments } from "@/lib/motion/record-documents";
import { documents } from "@/content/the-record";
import { SeamGlyph, type SeamGlyphMotif } from "@/components/ui/Furniture";

const tones = ["bg-evergreen", "bg-roasted", "bg-midnight"];
const motifs: SeamGlyphMotif[] = ["a", "b", "c"];

/** User direction 2026-09-09: native horizontal document shelf.
 * R14: typographic covers represent the catalogue, not supplied PDF artwork.
 * No download action is implied while the actual files are absent.
 */
export function DocumentsCarousel() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [position, setPosition] = useState({ first: true, last: false });
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const progress = (event: Event) => {
      const value = (event as CustomEvent<number>).detail;
      setPosition({ first: value <= 0, last: value >= 1 });
    };
    el.addEventListener("documents-progress", progress);
    const unregister = register(createRecordDocuments(el));
    start();
    return () => { unregister(); el.removeEventListener("documents-progress", progress); };
  }, []);
  function move(direction: number) {
    const el = track.current;
    if (!el) return;
    if (root.current?.dataset.documentsPinned) {
      root.current.dispatchEvent(new CustomEvent("documents-seek", { detail: direction }));
      return;
    }
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "instant" });
  }
  return (
    <div ref={root} className="record-documents-shelf relative py-8">
      <div className="mb-10 flex items-end justify-between gap-6 px-6 lg:px-8">
        <div>
          <h2 className="eyebrow text-xl text-ochre">Documents and reports</h2>
          <p className="mt-2 text-sm">{documents.length} items</p>
        </div>
      </div>

      {/* ⚠ THE CONTROLS SIT AT THE FOOT, AND THEY ARE ABSOLUTE FOR A REASON.
          They used to ride in the heading row above. This shelf pins at
          `top top`, so that row lands in the top ~130px of the viewport —
          which is exactly the strip the header watches, and exactly the space
          the band fills when it is called back. Hovering up there to reach the
          navigation dropped a white bar straight onto the two buttons
          (August, 11 September 2026).

          `absolute` rather than a third row in the flow because the pin is
          decided by `root.offsetHeight > window.innerHeight` — the shelf only
          pins if it already fits the viewport, and it clears that test by
          about 130px at 1440x900. Another ~70px row would have silently
          stopped the scene pinning on any laptop shorter than roughly 850px,
          turning a button-placement fix into a lost scene. Out of flow, the
          shelf's measured height does not change at all. */}
      <div className="absolute right-6 bottom-8 z-10 flex gap-3 lg:right-8">
        <button type="button" aria-label="Previous documents" aria-controls="record-documents-track" disabled={position.first} onClick={() => move(-1)} className="flex size-12 items-center justify-center rounded-full border border-midnight/30 text-2xl text-midnight disabled:opacity-30">←</button>
        <button type="button" aria-label="Next documents" aria-controls="record-documents-track" disabled={position.last} onClick={() => move(1)} className="flex size-12 items-center justify-center rounded-full border border-midnight/30 text-2xl text-midnight disabled:opacity-30">→</button>
      </div>
      <div data-documents-window className="ml-6 overflow-hidden lg:ml-8">
      <ul ref={track} id="record-documents-track" tabIndex={0} aria-label="Documents and reports"
        onScroll={() => { const el = track.current; if (el) setPosition({ first: el.scrollLeft < 2, last: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 }); }}
        className="flex snap-x snap-proximity gap-5 overflow-x-auto overscroll-x-contain pr-6 pb-8 lg:gap-6 lg:pr-8">
        {documents.map((document, index) => (
          <li key={document.title} className={`relative flex min-h-[480px] w-[82vw] shrink-0 snap-start flex-col overflow-hidden p-8 text-canvas lg:min-h-[560px] lg:w-[28vw] lg:p-10 ${tones[index % tones.length]}`}>
            <div className="relative mb-20 flex h-14 items-start justify-end">
              <SeamGlyph motif={motifs[index % motifs.length]} className="top-0 left-0 w-12" />
              <span className="eyebrow text-sm text-gold">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <p className="eyebrow mb-4 text-xs text-gold">{document.meta}</p>
            <h3 className="headline text-h3 leading-[1.12]">{document.title}</h3>
            <p className="mt-5 text-base leading-[1.6] text-canvas/80">{document.summary}</p>
            <p className="eyebrow mt-auto border-t border-canvas/20 pt-5 text-xs text-gold"><span className="block pt-6">{document.state === "available" ? "File not supplied" : "In preparation"}</span></p>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}
