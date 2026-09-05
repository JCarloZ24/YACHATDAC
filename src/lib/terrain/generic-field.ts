/**
 * Generic height field — the stand-in landform for D4 and E1.
 *
 * WHY THIS IS SYNTHETIC
 * ---------------------
 * Under decision F8 (31 Aug 2026, docs/decisions-and-risks.md) terrain detail
 * is a design choice reviewed at presentation — except one line that survived
 * F8 because git history cannot be walked back: no coordinates or georeferenced
 * heritage data in data or source. A synthetic field satisfies that by
 * construction.
 *
 * So this file generates a landform from seeded value noise. It is not anywhere.
 * There is no georeference to strip because there was never one to begin with,
 * which is a stronger guarantee than shipping a DEM and trusting a converter.
 *
 * WHEN PERMISSION LANDS
 * ---------------------
 * Both components take their heights through this module's grid, so swapping in
 * real data is one function, not a rebuild. Follow the GDAL pipeline in the
 * D4/E1 README: crop the DEM, export a greyscale PNG, and replace
 * `buildHeightGrid` with a sampler that reads that image. Keep the GeoTIFF and
 * the georeferenced GeoJSON out of the repo.
 *
 * The field is deliberately NOT radially falling off toward the frame edges.
 * A dome-shaped field produces neatly nested closed curves, and nested closed
 * curves read as iconography however honest the cartography is. An irregular
 * field clipped by the frame reads as a crop of a landscape instead. See the
 * note on the D4 lab page.
 */

/** Fixed seed. A different landform on every load would be a bug, not a feature. */
const SEED = 20260819;

/** Detail presets, shared by D4 and E1 so "detail" means one thing on both. */
export type DetailLevel = "generalised" | "balanced" | "survey";

export type DetailPreset = {
  id: DetailLevel;
  label: string;
  /** What the visitor reads it as — this is the thing Marc is actually choosing. */
  reads: string;
  /** Octaves of noise. The generalisation dial: fewer octaves, softer landform. */
  octaves: number;
  /** D4 — number of contour levels drawn. */
  contourLevels: number;
  /** E1 — mesh resolution per side. */
  segments: number;
  /** What to ask GDAL for once real elevation data is cleared. */
  gdalEquivalent: string;
};

export const DETAIL_PRESETS: Record<DetailLevel, DetailPreset> = {
  generalised: {
    id: "generalised",
    label: "Generalised",
    reads: "A landform. You can tell it is country, not a map of anywhere.",
    octaves: 3,
    contourLevels: 6,
    segments: 56,
    gdalEquivalent: "gdal_contour -i 40 · heightmap smoothing 4",
  },
  balanced: {
    id: "balanced",
    label: "Balanced",
    reads: "Ridges and drainage are legible. Still not a navigable map.",
    octaves: 4,
    contourLevels: 10,
    segments: 88,
    gdalEquivalent: "gdal_contour -i 20 · heightmap smoothing 2",
  },
  survey: {
    id: "survey",
    label: "Survey",
    reads: "A survey drawing. Detailed enough that the detail question matters.",
    octaves: 6,
    contourLevels: 16,
    segments: 132,
    gdalEquivalent: "gdal_contour -i 10 · heightmap smoothing 0",
  },
};

export const DETAIL_ORDER: DetailLevel[] = ["generalised", "balanced", "survey"];

/* -------------------------------------------------------------------------
   Seeded value noise
   ------------------------------------------------------------------------- */

/** Integer hash → 0..1. `Math.imul` keeps this in 32-bit territory. */
function hash(ix: number, iy: number, seed: number): number {
  let h = Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263) ^ Math.imul(seed, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

/** Smoothstep-interpolated value noise. */
function valueNoise(x: number, y: number, seed: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  const a = hash(ix, iy, seed);
  const b = hash(ix + 1, iy, seed);
  const c = hash(ix, iy + 1, seed);
  const d = hash(ix + 1, iy + 1, seed);

  return (a * (1 - ux) + b * ux) * (1 - uy) + (c * (1 - ux) + d * ux) * uy;
}

/**
 * Height at normalised (u, v), both 0..1, returned as 0..1.
 *
 * fBm for the general shape plus one ridged octave, which is what gives it
 * escarpment character rather than the rolling-hills look plain fBm produces.
 */
export function sampleGenericField(u: number, v: number, octaves: number): number {
  let sum = 0;
  let norm = 0;
  let amplitude = 1;
  let frequency = 2.6;

  for (let o = 0; o < octaves; o++) {
    sum += amplitude * valueNoise(u * frequency, v * frequency, SEED + o * 101);
    norm += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  const fbm = sum / norm;

  // Ridged noise: 1 - |2n - 1| folds the noise, so its peaks become creases.
  const folded = 1 - Math.abs(2 * valueNoise(u * 2.1 + 3.7, v * 1.7 - 1.3, SEED + 7) - 1);
  const ridge = Math.pow(folded, 1.6);

  return Math.min(1, Math.max(0, fbm * 0.62 + ridge * 0.38));
}

/**
 * Sample the field into a `cols x rows` grid of 0..1 values, row-major.
 *
 * `spanU` / `spanV` are the size of the region sampled, in field units. They
 * exist so a non-square output does not squash the landform: a wide map wants
 * a wide *crop* of the country, not the same crop stretched sideways. Pass a
 * span whose proportions match the output's, and features stay the shape they
 * are.
 *
 * This is the single swap point for real elevation data — see the file header.
 */
export function buildHeightGrid(
  cols: number,
  rows: number,
  octaves: number,
  spanU = 1,
  spanV = 1,
): Float32Array {
  const grid = new Float32Array(cols * rows);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid[y * cols + x] = sampleGenericField(
        (x / (cols - 1)) * spanU,
        (y / (rows - 1)) * spanV,
        octaves,
      );
    }
  }

  return grid;
}
