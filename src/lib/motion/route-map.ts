"use client";

/**
 * Wonder — the illustrated maps ink themselves in.
 *
 * Cites `the guide leading the eye` in docs/motion/motion-grammar.md, quiet
 * variant `routeDraw`: the trail draws along its own length, but there is no
 * traveller — the road is the guide. Built on the D4 contour-map mechanism in
 * contour-map.ts (stroke-dashoffset along a normalised pathLength, scrubbed),
 * applied to Marc's illustrated maps rather than a synthetic field. Used by
 * §02 The facts (the Queensland map) and §04 Getting here (the route map).
 *
 * Markup this expects (see RouteMap.tsx / FactsMap.tsx): a host holding one
 * or more inlined SVGs from public/wonder/*-map*.svg, whose paths are tagged
 *
 *   <path data-route d="…">        a band drawn as a compound path. Optional:
 *     data-ink="8"                 ink stroke width, in viewBox units
 *     data-stroke="#090E12"        ink colour (default the ochre token)
 *     data-from="0" data-to="0.6"  its share of the scroll (default 0 → 0.62)
 *     data-split="tip"             the outer loop is cut at its topmost point
 *                                  and drawn as two lines that run down either
 *                                  side and meet at the bottom, before the
 *                                  inner loops draw inward
 *   <path data-feature>            anything that simply arrives, by opacity.
 *     data-at="0.7"                when (default: staged after the routes)
 *     data-float                   once arrived, it floats — a slow bob on
 *                                  transform, time-based, the one thing here
 *                                  that is not scrubbed
 *     data-paint="brush"           it is painted in rather than faded: an SVG
 *                                  mask holding one stroke that goes down,
 *                                  then up, then down, sweeping from the left
 *                                  side to the bottom right until the shape
 *                                  is filled.
 *
 * plus any number of `<img data-pin data-at="0.7">` stop markers around it.
 *
 * How a route draws, within its own [from, to] window of scroll progress:
 *
 *   Each subpath is copied out as an "ink" stroke that draws itself, in
 *   order, each given scroll in proportion to its real length — the outer
 *   loop is many times longer than the holes, and an equal share made it
 *   flash across in a few scroll pixels. The band's own body then comes up
 *   under the ink and the ink lets go. Nothing here writes a layout
 *   property: stroke-dashoffset on the ink, opacity on the rest, transform on
 *   the floating pin.
 *
 * Reduced motion cuts: the finished map is simply there, no ink is made and
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
/** The next loop begins this much before the last one lands. */
const LOOP_OVERLAP = 0.05;
/** The body comes up under the ink, then the ink lets go — relative to
    the route's own `to`. */
const BODY_IN: [number, number] = [-0.12, 0.06];
const INK_OUT: [number, number] = [0.04, 0.2];
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
const BRUSH_COUNT = 14;
/** The float: a slow bob, in viewBox units. */
const FLOAT_RISE = 6;
const FLOAT_PERIOD = 1.8;
/** Sample spacing, in viewBox units, when a loop is cut at its tip. */
const SPLIT_STEP = 3;

const SVG_NS = "http://www.w3.org/2000/svg";

const window01 = (p: number, [a, b]: [number, number]) =>
  Math.min(1, Math.max(0, (p - a) / (b - a)));

/** Split compound path data at every absolute moveto. */
function subpaths(d: string): string[] {
  return d
    .split(/(?=M)/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Cut a closed loop at its topmost point into two open paths of equal
 * length, both starting at the tip, so drawn together they run down either
 * side and meet at the bottom. Sampled off the live path, so it works for
 * any curve commands the export used.
 */
function splitAtTip(loop: SVGPathElement): [string, string] {
  const length = loop.getTotalLength();
  const count = Math.max(8, Math.ceil(length / SPLIT_STEP));
  const points: [number, number][] = [];
  let tip = 0;
  for (let i = 0; i < count; i++) {
    const p = loop.getPointAtLength((i / count) * length);
    points.push([p.x, p.y]);
    if (p.y < points[tip][1]) tip = i;
  }
  const at = (i: number) => points[(tip + i + count) % count];
  const half = Math.floor(count / 2);
  const toPath = (pts: [number, number][]) =>
    pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("");
  const down = [];
  const up = [];
  for (let i = 0; i <= half; i++) down.push(at(i));
  for (let i = 0; i <= count - half; i++) up.push(at(-i));
  return [toPath(down), toPath(up)];
}

type Ink = { path: SVGPathElement; from: number; to: number };
type Route = { path: SVGPathElement; to: number; inks: Ink[] };
type Feature = {
  el: SVGElement;
  at: number;
  float: boolean;
  /** The brush stroke in the reveal mask, with its window. */
  brush: Ink[] | null;
  mask: SVGMaskElement | null;
};

/**
 * Build the reveal mask for a painted shape: one continuous stroke that
 * zigzags down and up across the bounding box, from the left side toward
 * the bottom right, the way a loaded brush fills an area without lifting.
 * Returned is the ink to draw.
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
  const spacing = (n1 - n0) / BRUSH_COUNT;

  const mask = document.createElementNS(SVG_NS, "mask");
  mask.setAttribute("id", id);
  mask.setAttribute("maskUnits", "userSpaceOnUse");
  mask.setAttribute("x", String(box.x - spacing));
  mask.setAttribute("y", String(box.y - spacing));
  mask.setAttribute("width", String(box.width + spacing * 2));
  mask.setAttribute("height", String(box.height + spacing * 2));

  // Down the first pass, up the next, and so on: one path, no lifts.
  let d = "";
  for (let k = 0; k < BRUSH_COUNT; k++) {
    const c = n0 + (k + 0.5) * spacing;
    const top = [c * n[0] + d0 * dir[0], c * n[1] + d0 * dir[1]];
    const bottom = [c * n[0] + d1 * dir[0], c * n[1] + d1 * dir[1]];
    const [from, to] = k % 2 ? [bottom, top] : [top, bottom];
    d += `${k ? "L" : "M"}${from[0].toFixed(1)},${from[1].toFixed(1)}`;
    d += `L${to[0].toFixed(1)},${to[1].toFixed(1)}`;
  }
  const stroke = document.createElementNS(SVG_NS, "path");
  stroke.setAttribute("d", d);
  stroke.setAttribute("stroke", "white");
  // A little wider than the gap so nothing is left unpainted.
  stroke.setAttribute("stroke-width", (spacing * 1.1).toFixed(2));
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

  function makeInk(d: string, width: string, stroke: string): SVGPathElement {
    const ink = document.createElementNS(SVG_NS, "path");
    ink.setAttribute("d", d);
    ink.setAttribute("fill", "none");
    ink.setAttribute("stroke", stroke);
    ink.setAttribute("stroke-width", width);
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
      const width = path.dataset.ink ?? "8";
      const stroke = path.dataset.stroke ?? "var(--color-ochre)";
      const from = Number(path.dataset.from ?? 0);
      const to = Number(path.dataset.to ?? TRACE_END);
      const pieces = subpaths(path.getAttribute("d") ?? "");

      // Each entry is one or more strokes that share a window. A split loop
      // is two strokes drawn together; everything else is one.
      const groups: SVGPathElement[][] = [];
      pieces.forEach((d, i) => {
        if (i === 0 && path.dataset.split === "tip") {
          const loop = makeInk(d, width, stroke);
          // Measured, then swapped for its two halves — never inserted.
          path.parentNode?.insertBefore(loop, path.nextSibling);
          const halves = splitAtTip(loop);
          loop.remove();
          groups.push(halves.map((h) => makeInk(h, width, stroke)));
        } else {
          groups.push([makeInk(d, width, stroke)]);
        }
      });

      // Later groups go in first so DOM order matches draw order.
      for (const group of [...groups].reverse()) {
        for (const ink of [...group].reverse()) {
          path.parentNode?.insertBefore(ink, path.nextSibling);
        }
      }

      // Geometry, not layout: getTotalLength works inside display:none.
      const lengths = groups.map((g) =>
        Math.max(1, ...g.map((ink) => ink.getTotalLength())),
      );
      const total = lengths.reduce((sum, l) => sum + l, 0);
      const span = to - from;
      const inks: Ink[] = [];
      let before = 0;
      groups.forEach((group, i) => {
        const a = from + (before / total) * span;
        before += lengths[i];
        const b = from + (before / total) * span;
        for (const ink of group) {
          inks.push({
            path: ink,
            from: Math.max(from, a - LOOP_OVERLAP * span),
            to: Math.min(to, b + LOOP_OVERLAP * span),
          });
        }
      });

      path.style.opacity = "0";
      routes.push({ path, to, inks });
    }

    const unstaged = featureEls.filter((el) => el.dataset.at === undefined);
    const step =
      unstaged.length > 1
        ? (FEATURES_IN[1] - FEATURE_SPAN - FEATURES_IN[0]) /
          (unstaged.length - 1)
        : 0;
    let brushes = 0;
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
        const id = `${svg.id || "map"}-brush-${brushes++}`;
        const { mask, stroke } = makeBrush(el as SVGGraphicsElement, id);
        svg.insertBefore(mask, svg.firstChild);
        el.setAttribute("mask", `url(#${id})`);
        feature.brush = [{ path: stroke, from: at, to: at + BRUSH_SPAN }];
        feature.mask = mask;
      }
      features.push(feature);
    }
    pins.forEach((_, i) => setLit(i, false));

    const paint = (progress: number) => {
      for (const { path, to, inks } of routes) {
        for (const ink of inks) {
          const t = window01(progress, [ink.from, ink.to]);
          ink.path.style.strokeDashoffset = String(1 - t);
          ink.path.style.opacity = String(
            1 - window01(progress, [to + INK_OUT[0], to + INK_OUT[1]]),
          );
        }
        path.style.opacity = String(
          window01(progress, [to + BODY_IN[0], to + BODY_IN[1]]),
        );
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
      for (const ink of route.inks) ink.path.remove();
      route.path.style.opacity = "";
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
