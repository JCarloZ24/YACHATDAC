import { homeTruthArtwork } from "@/content/home-truth-scenes";

/**
 * The Truth year marker, inlined so its arrow can move — user direction,
 * 15 September 2026.
 *
 * The marker (Figma 3371:45367) is an exact export: two rings of dots around a
 * red centre, and above them a dotted stem ending in an arrowhead that points
 * at the date. As an <img> it could only move as one piece. The user asked for
 * the stem and arrow to exist only while a date is showing — gone while the
 * marker travels, and growing out of the ring upward when the date lands. The
 * ring itself moves as a whole: it slides in along the top rail from the
 * line's left end (homeHeroDissolve).
 *
 * So the canvas build swaps the <img> for the same SVG, inline, and tags the
 * stem. Nothing in the drawing changes: same paths, same fills, same box.
 *   [data-marker-stem]  the stem's dots and the arrowhead (6 paths),
 *                       `data-order` = bottom-to-top rank, arrowhead last
 *
 * Figma's artboard clip-paths are dropped: they clip to the 48×94 box the
 * drawing already sits inside, and would otherwise shave a growing dot's
 * overshoot. Their ids would also collide with any other inline export.
 *
 * Runs only on the canvas path (home-hero.ts). If the fetch fails the <img>
 * stays and homeHeroDissolve keeps the arrow on the marker throughout.
 */
export async function inlineTruthMarker(root: HTMLElement) {
  const img = root.querySelector<HTMLImageElement>("[data-truth-marker] img");
  if (!img) return;
  const text = await (await fetch(homeTruthArtwork.marker)).text();
  const svg = new DOMParser().parseFromString(text, "image/svg+xml").querySelector("svg");
  if (!svg) return;
  svg.querySelectorAll("[clip-path]").forEach((node) => node.removeAttribute("clip-path"));
  svg.querySelector("defs")?.remove();
  // Sized by its class like the <img> was: width from CSS, height from the viewBox.
  svg.removeAttribute("width");
  svg.removeAttribute("height");
  svg.removeAttribute("style");
  svg.setAttribute("class", img.className);
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  const adopted = document.importNode(svg, true);
  img.replaceWith(adopted);

  // Measured once, now it is in the document (hidden, not display:none).
  // The stem is the group exported as "Vector_46"; everything else is ring.
  Array.from(adopted.querySelectorAll<SVGPathElement>('[id="Vector_46"] path'))
    .map((path) => ({ path, box: path.getBBox() }))
    .sort((a, b) => (b.box.y + b.box.height / 2) - (a.box.y + a.box.height / 2))
    .forEach(({ path }, order) => {
      path.setAttribute("data-marker-stem", "");
      path.dataset.order = String(order);
    });
}

/** The stem's paths bottom to top, for homeHeroDissolve. Empty if not inlined. */
export function truthMarkerStem(marker: Element | null) {
  return Array.from(marker?.querySelectorAll<SVGPathElement>("[data-marker-stem]") ?? [])
    .sort((a, b) => Number(a.dataset.order) - Number(b.dataset.order));
}
