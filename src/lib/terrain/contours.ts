/**
 * Contour extraction — marching squares over the generic height field.
 *
 * The reference D4 pipeline runs `gdal_contour` over a real DEM and converts the
 * GeoJSON to an un-georeferenced SVG. That pipeline is blocked on the land-detail
 * permission (see generic-field.ts), so this does the same job over the synthetic
 * field: same output shape — `<path>` data in an arbitrary viewBox, no CRS, no
 * coordinates — produced from data that never referred to a real place.
 *
 * Output coordinates are viewBox units. They are not degrees, not metres, and
 * not convertible to either.
 */

import { buildHeightGrid } from "./generic-field";

/**
 * Arbitrary viewBox — units here are not degrees, metres, or anything else.
 *
 * A wide landscape format, because that is how a map of country gets shown on
 * a page and how it has to be judged: shown large, a 1.56 frame is taller than
 * the viewport and you never see the whole drawing at once.
 *
 * E1 frames a squarer patch of the same field. Same country, different crop —
 * not a different landform.
 */
export const VIEWBOX_WIDTH = 1600;
export const VIEWBOX_HEIGHT = 700;

/** Size of the field region sampled. Matches the frame, so nothing squashes. */
const SPAN_V = 1;
const SPAN_U = (VIEWBOX_WIDTH / VIEWBOX_HEIGHT) * SPAN_V;

/**
 * Grid resolution the field is sampled at before contouring.
 *
 * This is the fidelity of the *tracing*, not of the landform — the landform's
 * own detail is the octave count in the detail preset. Doubling this makes each
 * contour a smoother, truer line through the same terrain, which is what a map
 * needs when it is displayed large: at 160 columns the marching-squares
 * staircase starts to show once the SVG is over about 900px wide.
 */
const GRID_COLS = 320;
const GRID_ROWS = 208;

/**
 * Polylines shorter than this (in viewBox units) are dropped as speckle.
 *
 * A finer grid resolves more genuinely tiny closed loops, and a map peppered
 * with 3px rings reads as noise — and, worse, as dot work. Raised alongside the
 * grid rather than left where it was.
 */
const MIN_LENGTH = 34;

export type Contour = {
  /** 0 = lowest band. Drives both draw order and stroke colour. */
  level: number;
  /** SVG path data, already rounded. */
  d: string;
};

type Segment = [number, number, number, number];

/**
 * Contour the generic field into SVG path data.
 *
 * Low contours come first so the ridges finish last in the stroke stagger —
 * the drawing fills in from the flats upward, which is how you would read it.
 */
export function buildContours(levels: number, octaves: number): Contour[] {
  const grid = buildHeightGrid(GRID_COLS, GRID_ROWS, octaves, SPAN_U, SPAN_V);

  const contours: Contour[] = [];

  for (let level = 0; level < levels; level++) {
    // Bands sit inside the field's range rather than at its extremes, where a
    // threshold would produce either nothing or one edge-hugging blob.
    const threshold = 0.16 + ((level + 1) / (levels + 1)) * 0.68;

    for (const polyline of traceLevel(grid, threshold)) {
      const d = toPathData(polyline);
      if (d) contours.push({ level, d });
    }
  }

  return contours;
}

/* -------------------------------------------------------------------------
   Marching squares
   ------------------------------------------------------------------------- */

/** Where a contour crosses a cell edge, by linear interpolation. */
function crossing(a: number, b: number, threshold: number): number {
  const span = b - a;
  return span === 0 ? 0.5 : (threshold - a) / span;
}

function traceLevel(grid: Float32Array, threshold: number): number[][] {
  const segments: Segment[] = [];

  for (let y = 0; y < GRID_ROWS - 1; y++) {
    for (let x = 0; x < GRID_COLS - 1; x++) {
      const tl = grid[y * GRID_COLS + x];
      const tr = grid[y * GRID_COLS + x + 1];
      const br = grid[(y + 1) * GRID_COLS + x + 1];
      const bl = grid[(y + 1) * GRID_COLS + x];

      let code = 0;
      if (tl > threshold) code |= 8;
      if (tr > threshold) code |= 4;
      if (br > threshold) code |= 2;
      if (bl > threshold) code |= 1;

      if (code === 0 || code === 15) continue;

      const top: [number, number] = [x + crossing(tl, tr, threshold), y];
      const right: [number, number] = [x + 1, y + crossing(tr, br, threshold)];
      const bottom: [number, number] = [x + crossing(bl, br, threshold), y + 1];
      const left: [number, number] = [x, y + crossing(tl, bl, threshold)];

      const push = (a: [number, number], b: [number, number]) =>
        segments.push([a[0], a[1], b[0], b[1]]);

      switch (code) {
        case 1: case 14: push(left, bottom); break;
        case 2: case 13: push(bottom, right); break;
        case 3: case 12: push(left, right); break;
        case 4: case 11: push(top, right); break;
        case 6: case 9:  push(top, bottom); break;
        case 7: case 8:  push(left, top); break;
        // Saddles: the cell centre decides which way the two lines run.
        case 5: {
          const centre = (tl + tr + br + bl) / 4;
          if (centre > threshold) { push(left, top); push(bottom, right); }
          else { push(left, bottom); push(top, right); }
          break;
        }
        case 10: {
          const centre = (tl + tr + br + bl) / 4;
          if (centre > threshold) { push(top, right); push(left, bottom); }
          else { push(left, top); push(bottom, right); }
          break;
        }
      }
    }
  }

  return chain(segments);
}

/**
 * Join loose segments into polylines.
 *
 * Marching squares emits one segment per cell with no ordering. Drawing them
 * individually would mean thousands of two-point paths, and the stroke reveal
 * needs whole contours to draw along their own length.
 */
function chain(segments: Segment[]): number[][] {
  const key = (x: number, y: number) => `${Math.round(x * 1000)}:${Math.round(y * 1000)}`;

  const byPoint = new Map<string, number[]>();
  segments.forEach((s, i) => {
    for (const k of [key(s[0], s[1]), key(s[2], s[3])]) {
      const bucket = byPoint.get(k);
      if (bucket) bucket.push(i);
      else byPoint.set(k, [i]);
    }
  });

  const used = new Array<boolean>(segments.length).fill(false);
  const polylines: number[][] = [];

  /** Walk from `point`, consuming unused segments, appending to `into`. */
  const walk = (point: [number, number], into: number[]) => {
    let current = point;

    for (;;) {
      const candidates = byPoint.get(key(current[0], current[1]));
      if (!candidates) return;

      const next = candidates.find((i) => !used[i]);
      if (next === undefined) return;

      used[next] = true;
      const s = segments[next];
      // Step to whichever end of the segment we did not arrive at.
      const arrivedAtStart = key(s[0], s[1]) === key(current[0], current[1]);
      current = arrivedAtStart ? [s[2], s[3]] : [s[0], s[1]];
      into.push(current[0], current[1]);
    }
  };

  for (let i = 0; i < segments.length; i++) {
    if (used[i]) continue;
    used[i] = true;

    const s = segments[i];
    const forward: number[] = [s[0], s[1], s[2], s[3]];
    walk([s[2], s[3]], forward);

    // Then extend backwards from the original start, and reverse that half on.
    const backward: number[] = [];
    walk([s[0], s[1]], backward);

    const points: number[] = [];
    for (let p = backward.length - 2; p >= 0; p -= 2) {
      points.push(backward[p], backward[p + 1]);
    }
    points.push(...forward);

    polylines.push(points);
  }

  return polylines;
}

/* -------------------------------------------------------------------------
   Path data
   ------------------------------------------------------------------------- */

function toPathData(points: number[]): string | null {
  if (points.length < 6) return null;

  const sx = VIEWBOX_WIDTH / (GRID_COLS - 1);
  const sy = VIEWBOX_HEIGHT / (GRID_ROWS - 1);

  let length = 0;
  let d = "";
  let px = 0;
  let py = 0;

  for (let i = 0; i < points.length; i += 2) {
    const x = points[i] * sx;
    const y = points[i + 1] * sy;

    if (i === 0) {
      d = `M${x.toFixed(1)},${y.toFixed(1)}`;
    } else {
      length += Math.hypot(x - px, y - py);
      d += `L${x.toFixed(1)},${y.toFixed(1)}`;
    }

    px = x;
    py = y;
  }

  return length < MIN_LENGTH ? null : d;
}
