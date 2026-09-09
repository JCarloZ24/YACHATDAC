"use client";

/**
 * Wonder — the illustrated maps draw themselves in.
 *
 * Cites `the guide leading the eye` in docs/motion/motion-grammar.md, quiet
 * variant `routeDraw`: the line draws along its own length, but there is no
 * traveller — the road is the guide. Built on the D4 contour-map mechanism in
 * contour-map.ts (stroke-dashoffset along a normalised pathLength, scrubbed),
 * applied to Marc's illustrated maps rather than a synthetic field. Used by
 * §02 The facts (the Queensland map) and §04 Getting here (the route map).
 *
 * NOTHING SYNTHETIC IS EVER DRAWN (rewritten 9 Sep 2026, user report: "the
 * lines are thick and become less thick, absorbing or dissolving the
 * thickness — make it more natural without dissolving or distorting the
 * lines").
 *
 * The reason it did that: these maps are not stroked lines. Every band in
 * them is a FILLED shape — a ribbon whose path traces both of its edges — so
 * stroking a copy of that path drew an 8-unit round-capped line along BOTH
 * sides of a line that was already there. The result was a doubled, bloated
 * version of the artwork that then had to fade out and hand over to the real
 * shape underneath, and the hand-over is the thinning the user saw.
 *
 * So the drawing is done by REVEAL. Each band gets a mask; the segments are
 * white strokes inside that mask; and what appears as they draw is the
 * artist's own shape at the weight the artist drew it. No ink layer, no
 * cross-fade, no flare, and nothing on screen that is not the artwork.
 *
 * Markup this expects (see RouteMap.tsx / FactsMap.tsx): a host holding one
 * or more inlined SVGs from public/wonder/*-map*.svg, whose paths are tagged
 *
 *   <path data-route d="…">        a band, as a compound path. Optional:
 *     data-ink="8"                 THE BAND'S OWN THICKNESS, in viewBox
 *                                  units. The reveal stroke is a multiple of
 *                                  it (REVEAL_SCALE) and is never drawn. Get
 *                                  it wrong and it shows: §04's roads are
 *                                  ~26 units thick and were tagged 8, left
 *                                  from when this was an ink width, so the
 *                                  reveal reached only part way across them
 *                                  and they frayed as they drew.
 *     data-from="0" data-to="0.6"  its share of the scroll (default 0 → 0.62)
 *     data-seg="70"                segment length, in viewBox units
 *   <path data-feature>            anything that simply arrives, by opacity.
 *     data-at="0.7"                when (default: staged after the routes)
 *     data-float                   once arrived, it floats — a slow bob on
 *                                  transform, time-based, the one thing here
 *                                  that is not scrubbed
 *     data-paint="brush"           it is coloured in rather than faded: one
 *                                  continuous stroke from the shape's top
 *                                  left, down and up across it, wandering as
 *                                  a hand does. See makeBrush.
 *
 * `data-stroke` is no longer read. It named the colour of an ink layer that
 * no longer exists; the colour is the artwork's own.
 *
 * plus any number of `<img data-pin data-at="0.7">` stop markers around it.
 *
 * How a band draws, within its own [from, to] window of scroll progress:
 *
 *   Its outline is cut into short segments of roughly equal length. Each one
 *   starts at a seeded-random point in the window and runs in a seeded-random
 *   direction, so the shape opens all over at once and joins up until the
 *   whole thing stands — the D4 contour-map read (/lab/contour-map), where
 *   the terrain surfaces rather than being traced.
 *
 * Nothing here writes a layout property: stroke-dashoffset inside the masks,
 * opacity on the features, transform on the floating pin.
 *
 * Reduced motion cuts: the finished map is simply there, no mask is made and
 * nothing floats.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "@/lib/motion-controller";

gsap.registerPlugin(ScrollTrigger);

export type RouteMapOptions = {
  reduced: boolean;
  /**
   * What the scroll is measured against. Defaults to the host, but the hosts
   * in RouteMap.tsx are `display: contents` and have no box, so they pass
   * the section instead — a trigger with no box reads as finished at once.
   */
  trigger?: Element;
  /** ScrollTrigger start/end, on the trigger. */
  start?: string;
  end?: string;
  scrub?: number;
};

/** Where a route with no `data-to` finishes; the rest shows it whole. */
const TRACE_END = 0.62;
/** Segment length in viewBox units when a route sets no `data-seg`. */
const SEGMENT_LENGTH = 70;
/** How much of the route's window one segment takes to draw. */
const SEGMENT_SPAN = 0.45;
/**
 * Sample spacing along a segment, in viewBox units.
 *
 * Was 3, which is where Wonder's load went: `getPointAtLength` is the most
 * expensive call in the SVG API, and at 3 units these maps (about 2,000
 * units across, several long routes, both the §02 and §04 cuts) cost 6.5s of
 * blocked main thread on desktop and 13s on a phone — profiled 9 Sep 2026 on
 * a production build.
 *
 * 12 is still finer than the ink it feeds: the stroke is ~8 units wide with
 * round caps and joins, so a step inside the stroke's own width cannot show
 * a corner. Four times fewer samples, same drawn line.
 */
const SAMPLE_STEP = 12;
/** Features with no `data-at` arrive across this window, in file order. */
const FEATURES_IN: [number, number] = [0.58, 0.92];
const FEATURE_SPAN = 0.14;
/** The brush: how long the paint takes, in scroll progress. */
const BRUSH_SPAN = 0.18;
/**
 * The sweep runs from the shape's left side toward its bottom right, this
 * many degrees below horizontal; each stroke goes up and down across it.
 */
const BRUSH_SWEEP = 20;
/** Roughly how many times the stroke goes down and up. Not exact: the gap
    to the next stripe is jittered, so the count comes out near this. */
const BRUSH_COUNT = 11;
/**
 * Stroke width, as a multiple of the average gap between stripes.
 *
 * ONE pass has to cover the shape on its own, so this is comfortably over 1:
 * the stripes overlap, the way a child's colouring-in does, rather than
 * leaving the paper showing between them.
 */
const BRUSH_WIDTH = 1.9;
/** How far a stripe's spacing, its ends and its middle may wander, each as a
    fraction of the average gap. The hand is not a ruler. */
const BRUSH_WOBBLE = { gap: 0.45, end: 0.9, bow: 0.5 };
/**
 * How wide a reveal stroke is, as a multiple of the band's own `data-ink`.
 *
 * The stroke runs along the band's OUTLINE and has to reach across the band
 * to uncover it, so it is wider than the band is thick. Too wide and it
 * uncovers the neighbouring band early; 2.2 covers the state's own line and
 * the faint continent behind it without either bleeding into the other.
 */
const REVEAL_SCALE = 2.2;
/** The float: a slow bob, in viewBox units. */
const FLOAT_RISE = 6;
const FLOAT_PERIOD = 1.8;
const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * Ids for the masks this module makes, unique across the whole document.
 *
 * They used to be built from the SVG's own id — which these inlined exports
 * do not have — so both maps on /wonder minted `map-route-0`. `url(#…)`
 * resolves to the FIRST match in the document, so §04's roads were being
 * masked by §02's Queensland mask, whose region is nowhere near them: the
 * roads simply never appeared (9 Sep 2026). A counter at module scope cannot
 * collide, whatever the file is called or how many maps a page carries.
 */
let uid = 0;
const nextId = (kind: string) => `wonder-${kind}-${uid++}`;

const window01 = (p: number, [a, b]: [number, number]) =>
  Math.min(1, Math.max(0, (p - a) / (b - a)));

/** Split compound path data at every absolute moveto. */
function subpaths(d: string): string[] {
  return d
    .split(/(?=M)/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** A seeded hand: deterministic, so every load draws the same map. */
function jitter(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Cut a loop into segments of about `segLen`, each a sampled polyline.
 * Segments abut exactly; round caps hide the seams once both are drawn.
 */
function segments(
  loop: SVGPathElement,
  segLen: number,
  seed: number,
): string[] {
  const length = loop.getTotalLength();
  const count = Math.max(1, Math.round(length / segLen));
  const out: string[] = [];
  for (let k = 0; k < count; k++) {
    const s0 = (k / count) * length;
    const s1 = ((k + 1) / count) * length;
    const steps = Math.max(1, Math.ceil((s1 - s0) / SAMPLE_STEP));
    const pts: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const p = loop.getPointAtLength(s0 + ((s1 - s0) * i) / steps);
      pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
    }
    // Half the segments draw backwards, so the joins meet from both sides.
    if (jitter(seed + k * 3 + 1) > 0.5) pts.reverse();
    out.push("M" + pts.join("L"));
  }
  return out;
}

type Ink = { path: SVGPathElement; from: number; to: number };
type Route = {
  path: SVGPathElement;
  to: number;
  /** The reveal strokes, inside this route's mask. */
  inks: Ink[];
  /** The mask that uncovers the band. Removed with the module. */
  mask: SVGMaskElement;
  /** The group the mask hangs on, so the band keeps its own. */
  wrap: SVGGElement;
};
type Feature = {
  el: SVGElement;
  at: number;
  float: boolean;
  /** The brush stroke in the reveal mask, with its window. */
  brush: Ink[] | null;
  mask: SVGMaskElement | null;
};

/**
 * Build the reveal mask for a painted shape.
 *
 * ONE STROKE, TOP LEFT, DOWN AND UP ACROSS THE SHAPE (9 Sep 2026, latest user
 * direction: "the stroke should start on top-left and only 1 stroke up-down
 * movement... it shouldn't be linear, it should be imperfect like a child
 * colouring the area").
 *
 * It began as a single even zigzag, which read as a wipe; then as three
 * interleaved passes, which read as stripes — visibly separate diagonal bands
 * with the ground showing between them, which is what the user is looking at
 * in the screenshot. Both were too tidy in opposite directions.
 *
 * So: one continuous stroke that never lifts, entering at the shape's top
 * left and working across it, and everything about it wanders. The gap to the
 * next stripe is jittered, so the rhythm is uneven; each stripe over- or
 * under-runs its end, so the edges are ragged; and each stripe bows sideways
 * at its middle, so no line in it is straight. The stroke is nearly twice the
 * average gap wide, so the stripes overlap and the shape fills in solid —
 * a gap inside a painted area does not read as brushwork, it reads as a hole.
 *
 * Every wander is seeded, so this is the same hand on every load and in every
 * screenshot.
 */
function makeBrush(
  el: SVGGraphicsElement,
  id: string,
): { mask: SVGMaskElement; stroke: SVGPathElement } {
  const box = el.getBBox();
  const a = (BRUSH_SWEEP * Math.PI) / 180;
  // Across the strokes — the sweep, left to bottom right — and along them,
  // pointing down the page so the first stroke starts at the top.
  const n = [Math.cos(a), Math.sin(a)];
  const dir = [-Math.sin(a), Math.cos(a)];
  const corners = [
    [box.x, box.y],
    [box.x + box.width, box.y],
    [box.x, box.y + box.height],
    [box.x + box.width, box.y + box.height],
  ];
  const dot = (p: number[], v: number[]) => p[0] * v[0] + p[1] * v[1];
  const along = corners.map((c) => dot(c, dir));
  const across = corners.map((c) => dot(c, n));
  const [d0, d1] = [Math.min(...along), Math.max(...along)];
  const [n0, n1] = [Math.min(...across), Math.max(...across)];
  // The AVERAGE gap between stripes; every actual gap is jittered off it.
  const spacing = (n1 - n0) / BRUSH_COUNT;

  const mask = document.createElementNS(SVG_NS, "mask");
  mask.setAttribute("id", id);
  mask.setAttribute("maskUnits", "userSpaceOnUse");
  mask.setAttribute("x", String(box.x - spacing));
  mask.setAttribute("y", String(box.y - spacing));
  mask.setAttribute("width", String(box.width + spacing * 2));
  mask.setAttribute("height", String(box.height + spacing * 2));

  // One path, no lifts: down a stripe, across, up the next. The hand's
  // wandering is all in here — where the next stripe sits, where it stops,
  // and how it bows on the way.
  let d = "";
  let drawn = 0;
  // Start hard against the first edge the stroke meets, which with this sweep
  // is the shape's top left, and walk across from there.
  let c = n0 + spacing * 0.4;
  for (let k = 0; k < BRUSH_COUNT * 2 && c < n1 + spacing * 0.5; k++) {
    const overshootA = (jitter(k * 7 + 11) - 0.35) * spacing * BRUSH_WOBBLE.end;
    const overshootB = (jitter(k * 11 + 23) - 0.35) * spacing * BRUSH_WOBBLE.end;
    const bow = (jitter(k * 13 + 31) - 0.5) * spacing * BRUSH_WOBBLE.bow;
    const a = d0 - overshootA;
    const b = d1 + overshootB;
    const point = (across: number, along: number) => [
      across * n[0] + along * dir[0],
      across * n[1] + along * dir[1],
    ];
    const head = point(c, a);
    const foot = point(c, b);
    // The middle of the stripe, pushed sideways: the line bends rather than
    // ruling straight down the shape.
    const mid = point(c + bow, (a + b) / 2);
    const [from, to] = drawn % 2 ? [foot, head] : [head, foot];
    d += `${drawn ? "L" : "M"}${from[0].toFixed(1)},${from[1].toFixed(1)}`;
    d += `L${mid[0].toFixed(1)},${mid[1].toFixed(1)}`;
    d += `L${to[0].toFixed(1)},${to[1].toFixed(1)}`;
    drawn++;
    // The gap to the next stripe is never the same twice.
    c += spacing * (1 + (jitter(k * 17 + 41) - 0.5) * BRUSH_WOBBLE.gap);
  }

  const stroke = document.createElementNS(SVG_NS, "path");
  stroke.setAttribute("d", d);
  stroke.setAttribute("stroke", "white");
  stroke.setAttribute("stroke-width", (spacing * BRUSH_WIDTH).toFixed(2));
  stroke.setAttribute("stroke-linecap", "round");
  stroke.setAttribute("stroke-linejoin", "round");
  stroke.setAttribute("fill", "none");
  stroke.setAttribute("pathLength", "1");
  stroke.style.strokeDasharray = "1";
  stroke.style.strokeDashoffset = "1";
  mask.appendChild(stroke);

  return { mask, stroke };
}

export function createRouteMap(
  host: HTMLElement,
  {
    reduced,
    trigger: triggerEl = host,
    start = "top 85%",
    end = "top 5%",
    scrub = 1.2,
  }: RouteMapOptions,
): MotionModule {
  const routePaths = [...host.querySelectorAll<SVGPathElement>("[data-route]")];
  const featureEls = [...host.querySelectorAll<SVGElement>("[data-feature]")];
  const pins = [...host.querySelectorAll<HTMLElement>("[data-pin]")];

  let trigger: ScrollTrigger | null = null;
  const routes: Route[] = [];
  const features: Feature[] = [];
  const floats = new Map<SVGElement, gsap.core.Tween>();

  // See contour-map.ts for why this starts at null rather than false.
  const lit = new Array<boolean | null>(pins.length).fill(null);
  const setLit = (index: number, on: boolean) => {
    if (lit[index] === on) return;
    lit[index] = on;
    pins[index].dataset.on = on ? "true" : "false";
  };

  const setFloat = (el: SVGElement, on: boolean) => {
    const running = floats.get(el);
    if (on && !running) {
      floats.set(
        el,
        gsap.to(el, {
          y: -FLOAT_RISE,
          duration: FLOAT_PERIOD,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        }),
      );
    } else if (!on && running) {
      running.kill();
      gsap.set(el, { y: 0 });
      floats.delete(el);
    }
  };

  /**
   * A reveal stroke: white, inside a mask, drawing itself along the band.
   *
   * It is never seen. What the reader sees is the artwork underneath it, at
   * the weight the artist drew — which is the whole point of doing it this
   * way rather than stroking a copy on top.
   */
  function makeInk(d: string, width: number): SVGPathElement {
    const ink = document.createElementNS(SVG_NS, "path");
    ink.setAttribute("d", d);
    ink.setAttribute("fill", "none");
    ink.setAttribute("stroke", "white");
    ink.setAttribute("stroke-width", width.toFixed(2));
    ink.setAttribute("stroke-linecap", "round");
    ink.setAttribute("stroke-linejoin", "round");
    // pathLength="1" so the dash offset is a plain 0–1; the loop's real
    // length still decides how much scroll it is given.
    ink.setAttribute("pathLength", "1");
    ink.setAttribute("data-route-ink", "");
    ink.style.strokeDasharray = "1";
    ink.style.strokeDashoffset = "1";
    return ink;
  }

  function init() {
    if (!routePaths.length && !featureEls.length) return;

    if (reduced) {
      pins.forEach((_, i) => setLit(i, true));
      return;
    }

    for (const path of routePaths) {
      const svg = path.ownerSVGElement;
      if (!svg) continue;
      const width = Number(path.dataset.ink ?? 8) * REVEAL_SCALE;
      const from = Number(path.dataset.from ?? 0);
      const to = Number(path.dataset.to ?? TRACE_END);
      const pieces = subpaths(path.getAttribute("d") ?? "");

      const segLen = Number(path.dataset.seg ?? SEGMENT_LENGTH);
      const span = to - from;
      const inks: Ink[] = [];

      // The band is uncovered through its OWN mask. Sized to the band's box
      // plus a stroke either side, so a round cap at the edge is not clipped.
      const box = (path as SVGGraphicsElement).getBBox();
      const mask = document.createElementNS(SVG_NS, "mask");
      const id = nextId("route");
      mask.setAttribute("id", id);
      mask.setAttribute("maskUnits", "userSpaceOnUse");
      mask.setAttribute("x", String(box.x - width));
      mask.setAttribute("y", String(box.y - width));
      mask.setAttribute("width", String(box.width + width * 2));
      mask.setAttribute("height", String(box.height + width * 2));
      svg.insertBefore(mask, svg.firstChild);

      let seed = routes.length * 1000;
      for (const d of pieces) {
        // Measured, then swapped for its segments — never left in.
        const loop = makeInk(d, width);
        mask.appendChild(loop);
        // Geometry, not layout: this works inside display:none.
        const parts = segments(loop, segLen, seed);
        loop.remove();
        for (const part of parts) {
          const ink = makeInk(part, width);
          mask.appendChild(ink);
          const start = from + jitter(seed) * span * (1 - SEGMENT_SPAN);
          inks.push({
            path: ink,
            from: start,
            to: start + span * SEGMENT_SPAN,
          });
          seed += 7;
        }
      }

      // THE MASK GOES ON A WRAPPER, NOT ON THE PATH.
      // §04's road band is exported from Figma with a mask of its own
      // (`path-8-inside-…`, the inside stroke that draws its black edge), and
      // setting ours on the same element would throw that away — the roads
      // would lose their outline the moment the draw started. A `<g>` around
      // the band carries the reveal and leaves whatever the artwork already
      // does to itself alone.
      const wrap = document.createElementNS(SVG_NS, "g");
      wrap.setAttribute("data-route-reveal", "");
      wrap.setAttribute("mask", `url(#${id})`);
      path.parentNode?.insertBefore(wrap, path);
      wrap.appendChild(path);
      routes.push({ path, to, inks, mask, wrap });
    }

    const unstaged = featureEls.filter((el) => el.dataset.at === undefined);
    const step =
      unstaged.length > 1
        ? (FEATURES_IN[1] - FEATURE_SPAN - FEATURES_IN[0]) /
          (unstaged.length - 1)
        : 0;
    for (const el of featureEls) {
      const at =
        el.dataset.at !== undefined
          ? Number(el.dataset.at)
          : FEATURES_IN[0] + unstaged.indexOf(el) * step;
      el.style.opacity = "0";
      const feature: Feature = {
        el,
        at,
        float: el.dataset.float !== undefined,
        brush: null,
        mask: null,
      };
      const svg = el.ownerSVGElement;
      if (el.dataset.paint === "brush" && svg) {
        const id = nextId("brush");
        const { mask, stroke } = makeBrush(el as SVGGraphicsElement, id);
        svg.insertBefore(mask, svg.firstChild);
        el.setAttribute("mask", `url(#${id})`);
        // One stroke, one window: the hand crosses the shape once.
        feature.brush = [{ path: stroke, from: at, to: at + BRUSH_SPAN }];
        feature.mask = mask;
      }
      features.push(feature);
    }
    pins.forEach((_, i) => setLit(i, false));

    const paint = (progress: number) => {
      for (const { inks } of routes) {
        // One write per stroke, and it is the only thing that moves: the
        // mask opens along the band and the artwork stands where it opens.
        for (const ink of inks) {
          ink.path.style.strokeDashoffset = String(
            1 - window01(progress, [ink.from, ink.to]),
          );
        }
      }

      for (const { el, at, float, brush } of features) {
        let t: number;
        if (brush) {
          // The mask does the revealing; the shape itself is simply on.
          for (const stroke of brush) {
            stroke.path.style.strokeDashoffset = String(
              1 - window01(progress, [stroke.from, stroke.to]),
            );
          }
          t = progress >= at ? 1 : 0;
        } else {
          t = window01(progress, [at, at + FEATURE_SPAN]);
        }
        el.style.opacity = String(t);
        if (float) setFloat(el, t >= 1);
      }

      pins.forEach((pin, i) =>
        setLit(i, progress >= Number(pin.dataset.at ?? 0.8)),
      );
    };

    trigger = ScrollTrigger.create({
      trigger: triggerEl,
      start,
      end,
      scrub,
      onUpdate: (self) => paint(self.progress),
    });

    // Measure, then paint once — see contour-map.ts for why.
    trigger.refresh();
    paint(trigger.progress);
  }

  function destroy() {
    trigger?.kill();
    trigger = null;
    for (const route of routes) {
      // Put the band back where it was and take the wrapper with us.
      route.wrap.parentNode?.insertBefore(route.path, route.wrap);
      route.wrap.remove();
      route.mask.remove();
    }
    routes.length = 0;
    for (const { el, mask } of features) {
      setFloat(el, false);
      el.style.opacity = "";
      if (mask) {
        el.removeAttribute("mask");
        mask.remove();
      }
    }
    features.length = 0;
  }

  return { init, destroy };
}
