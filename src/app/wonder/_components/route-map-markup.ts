import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Reads the Wonder map files out of public/wonder at render time so the
 * client map components can inline them. Server only — Sections.tsx already
 * reads the filesystem for photo slots, and the files are ours (Marc's
 * exports, tagged by hand for src/lib/motion/route-map.ts: `data-route` on
 * a band that draws itself, `data-feature` on what simply arrives, and the
 * timing attributes that module documents).
 *
 * The root `<svg>` keeps its viewBox and gets the sizing class the `<img>`
 * used to carry. Element ids are prefixed per file so the maps — every one
 * in the DOM, hidden per breakpoint — never share an id, and the export's
 * own mask and clipPath references are rewritten to match.
 */
function inlineSvg(
  file: string,
  className: string,
  idPrefix: string,
  /**
   * Re-frames the export without touching a path. The supplied file may carry
   * a crop in its own viewBox; a caller that wants the whole drawing says so
   * here rather than editing artwork that is not ours to edit.
   */
  viewBox?: string,
): string {
  const svg = readFileSync(join(process.cwd(), "public", "wonder", file), "utf8")
    .replace(/^\s*<\?xml[^>]*>\s*/, "")
    .replace(/ style="display: block;"/, "")
    .replace("<svg ", `<svg class="${className}" `)
    .replace(/ id="/g, ` id="${idPrefix}`)
    .replace(/url\(#/g, `url(#${idPrefix}`);
  return viewBox
    ? svg.replace(/viewBox="[^"]*"/, `viewBox="${viewBox}"`)
    : svg;
}

/** §04 Getting here — 3238:34130 at 1440, 2576:22808 on the phone. */
export function routeMapMarkup() {
  return {
    desktop: inlineSvg(
      "getting-here-map.svg",
      "absolute top-0 left-0 block h-[1580px] w-[2278px] max-w-none",
      "gh-",
    ),
    mobile: inlineSvg("getting-here-map-mobile.svg", "block h-full w-full", "ghm-"),
  };
}

/**
 * §02 The facts — 3238:34073 / 2576:22115.
 *
 * ONE FILE FOR BOTH BREAKPOINTS (9 Sep 2026, August: "use this map on 2nd
 * section on mobile"). There used to be a second cut, facts-map-mobile.svg,
 * and it was the wrong shape and the wrong colours: `preserveAspectRatio
 * ="none"` in a 506 × 359 box squashed the state narrow on a phone, and it
 * painted the property #AF231C with a #FBAE3D pin where the desktop cut uses
 * #C23D31 and #D97804 — two maps of the same place that did not match.
 *
 * facts-map.svg now carries the crop August supplied and it is correct at any
 * size, so the phone renders the same artwork, the same draw tags and the same
 * colours as 1440. facts-map-mobile.svg is left on disk unreferenced rather
 * than deleted — it is supplied artwork, not mine to bin.
 */
/**
 * THE WHOLE DRAWING, NOT THE PHONE'S WINDOW (9 Sep 2026, user report: "fix
 * the map").
 *
 * The supplied file carries a crop in its viewBox — `446.59 0 682.66 637.42`,
 * the right-hand window that suits a phone. Rendered at 1440 that window threw
 * away most of the pale Australia the artwork is drawn around, so the state
 * stood on its own with a stub of coastline beside it.
 *
 * The artwork's own frame is its clip rect: 1128.88 × 783, which is exactly
 * the group the hi-fi places at (205.33, 83) in the 1440 frame — the ghost
 * continent running along behind the copy column, which is what the frame
 * draws and what the phone's crop cannot show. So the file is re-framed to its
 * full extent here and the PHONE's crop is applied in CSS instead (see
 * FactsMap): one inlined SVG, one set of draw tags, both breakpoints, and not
 * one path altered.
 */
export function factsMapMarkup() {
  return {
    markup: inlineSvg(
      "facts-map.svg",
      "block h-full w-full",
      "f-",
      "0 0 1128.88 783",
    ),
  };
}
