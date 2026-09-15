/**
 * How Home Truth's line is scaled ACROSS its length — shared by the canvas
 * rails (home-truth-rails.ts) and the year marker's placement
 * (homeHeroDissolve), so the two cannot disagree about where the top rail is.
 *
 * Along the line everything scales with the canvas width (frame px × W/1440):
 * that is what keeps the seven years where the marker's `xPercent` puts them.
 *
 * Across it — wave height, the gap between the rails, dot size — desktop
 * scales the same way, and nothing below changes it (user direction,
 * 15 September 2026: "DO NOT change anything at all on desktop view").
 * Below 1024 the marker stops scaling: home-hero.css pins it at 32px, two
 * thirds of its 48px frame size, while W/1440 falls to 0.27 on a phone. The
 * rails were drawn at that 0.27 — dots a pixel wide, the pair narrower than
 * the ring, which sat across both lines. So below 1024 the across-scale
 * follows the MARKER (32/48) instead, which puts the pair back in the
 * proportion the frame draws them against the ring, phone and tablet alike.
 * At 1024 the two rules meet within 7% (0.711 vs 0.667), so crossing the
 * breakpoint does not jump.
 *
 * Measured against the hero's clientWidth, as markerY always has been.
 */
export const TRUTH_COMPACT_BELOW = 1024;
const MARKER_COMPACT = 32 / 48;

export function truthAcrossScale(width: number): number {
  return width < TRUTH_COMPACT_BELOW ? MARKER_COMPACT : width / 1440;
}
