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
function inlineSvg(file: string, className: string, idPrefix: string): string {
  return readFileSync(join(process.cwd(), "public", "wonder", file), "utf8")
    .replace(/^\s*<\?xml[^>]*>\s*/, "")
    .replace(/ style="display: block;"/, "")
    .replace("<svg ", `<svg class="${className}" `)
    .replace(/ id="/g, ` id="${idPrefix}`)
    .replace(/url\(#/g, `url(#${idPrefix}`);
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

/** §02 The facts — 3238:34073 and 2576:22115. */
export function factsMapMarkup() {
  return {
    desktop: inlineSvg("facts-map.svg", "block h-full w-full", "f-"),
    mobile: inlineSvg("facts-map-mobile.svg", "block h-full w-full", "fm-"),
  };
}
