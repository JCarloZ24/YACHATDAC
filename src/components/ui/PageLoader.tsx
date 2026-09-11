"use client";

import { useEffect, useRef, useState } from "react";
import { pageLoaderCopy } from "@/content/site";
import { BLINK_LIT_MS } from "@/lib/motion/route-entry";

/** X7 / SYS-02, August, 11 September 2026: one repeatable loading cycle.
 * Grammar: "the page is ready". RouteLoader keys each visit, including warm
 * navigation and refresh. Progress is readiness-paced, not byte progress.
 * CSS owns the cross-route fade; the supplied artwork is never redrawn.
 */
export function PageLoader({
  name,
  ready,
  hardCapMs = 12000,
  rampMs = 700,
  sweepMs = 650,
  dwellMs = 700,
  navigation = false,
  onReveal,
}: {
  name: string;
  ready?: () => boolean;
  hardCapMs?: number;
  rampMs?: number;
  sweepMs?: number;
  dwellMs?: number;
  navigation?: boolean;
  onReveal?: () => void;
}) {
  const HARD_CAP_MS = hardCapMs;
  const RAMP_MS = rampMs;
  const SWEEP_MS = sweepMs;
  const NAME_DWELL_MS = dwellMs;
  const [display, setDisplay] = useState(0);
  const [phase, setPhase] = useState<"loading" | "named" | "lifted">("loading");
  const panelRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<SVGGraphicsElement[]>([]);
  const displayRef = useRef(0);
  const reveal = useRef(onReveal);
  useEffect(() => { displayRef.current = display; }, [display]);
  useEffect(() => { reveal.current = onReveal; }, [onReveal]);

  useEffect(() => {
    // Hydration may arrive after the CSS backstop already uncovered the page.
    if (panelRef.current && getComputedStyle(panelRef.current).visibility === "hidden") {
      setPhase("lifted");
      return;
    }
    let frame = 0;
    let cancelled = false;
    let fontsReady = document.fonts.status === "loaded";
    void document.fonts.ready.then(() => { if (!cancelled) fontsReady = true; });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const start = performance.now();
    const step = () => {
      if (panelRef.current?.hasAttribute("data-lifted")) return;
      const t = performance.now() - start;
      const x = Math.min(t / RAMP_MS, 1);
      const ramp = 1 - (1 - x) * (1 - x);
      const extra = ready ? ready() : true;
      if (t >= HARD_CAP_MS && !extra) {
        // A failed route must not announce a destination that never arrived.
        setPhase("lifted");
        return;
      }
      const gate = t >= HARD_CAP_MS ? 1 : (fontsReady ? (extra ? 1 : 0.8) : 0.35);
      const value = Math.min(ramp, gate);
      setDisplay(value);
      if (reduced.matches && value >= 1) {
        setPhase(current => current === "loading" ? "named" : current);
      }
      if (value < 1) frame = window.requestAnimationFrame(step);
    };
    frame = window.requestAnimationFrame(step);
    return () => { cancelled = true; window.cancelAnimationFrame(frame); };
    // A keyed instance owns one immutable readiness cycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The artwork is inlined so each dot can be lit individually, in the order
  // the motif flows: dots are grouped into their clusters, the clusters run
  // left to right along the wave, and INSIDE each rosette the dots light in
  // CLOCKWISE order from 12 o'clock — a hand sweeping the circle — before the
  // flow moves on to the next cluster. Connector dots between rosettes simply
  // light along the way. (Reveal-by-mask of the supplied vector, per the
  // recorded artwork-motion permission; the geometry itself is untouched.)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    void fetch("/artwork/dots-wave-gold.svg")
      .then((r) => r.text())
      .then((text) => {
        const host = waveRef.current;
        if (cancelled || !host) return;
        host.innerHTML = text;
        const svg = host.querySelector("svg");
        if (!svg) return;
        svg.removeAttribute("width");
        svg.removeAttribute("height");
        svg.removeAttribute("style");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.style.width = "100%";
        svg.style.height = "auto";
        svg.style.display = "block";

        const els = Array.from(
          svg.querySelectorAll<SVGGraphicsElement>("path"),
        );
        // Hide BEFORE measuring. getBBox() below forces a style flush, and if
        // the dots are still visible at that flush, hiding them afterwards
        // with a transition attached fades the whole artwork out on screen —
        // the "everything flashed fully lit" artefact. Opacity doesn't affect
        // geometry, so measuring hidden dots is safe. The transition is only
        // attached later, once everything is already hidden.
        els.forEach((el) => {
          el.style.opacity = "0";
        });

        type Dot = { el: SVGGraphicsElement; x: number; y: number };
        const dots: Dot[] = els.map((el) => {
          const b = el.getBBox();
          return { el, x: b.x + b.width / 2, y: b.y + b.height / 2 };
        });
        if (!dots.length) return;

        // Greedy proximity clustering: rosettes come out as big clusters,
        // the connector dots between them as tiny ones.
        const unassigned = new Set(dots);
        const clusters: Dot[][] = [];
        for (const seed of dots) {
          if (!unassigned.has(seed)) continue;
          const cluster = [seed];
          unassigned.delete(seed);
          let cx = seed.x;
          let cy = seed.y;
          let grew = true;
          while (grew) {
            grew = false;
            for (const d of Array.from(unassigned)) {
              if (Math.hypot(d.x - cx, d.y - cy) < 42) {
                cluster.push(d);
                unassigned.delete(d);
                cx = cluster.reduce((s, c) => s + c.x, 0) / cluster.length;
                cy = cluster.reduce((s, c) => s + c.y, 0) / cluster.length;
                grew = true;
              }
            }
          }
          clusters.push(cluster);
        }

        // The flow: clusters left to right; a rosette's dots clockwise from
        // 12 o'clock (screen y points down, so atan2 already increases
        // clockwise; +PI/2 puts zero at the top); connectors by x.
        clusters.sort(
          (a, b) =>
            a.reduce((s, d) => s + d.x, 0) / a.length -
            b.reduce((s, d) => s + d.x, 0) / b.length,
        );
        const ordered: Dot[] = [];
        for (const cluster of clusters) {
          if (cluster.length >= 8) {
            const cx = cluster.reduce((s, d) => s + d.x, 0) / cluster.length;
            const cy = cluster.reduce((s, d) => s + d.y, 0) / cluster.length;
            cluster.sort(
              (a, b) =>
                ((Math.atan2(a.y - cy, a.x - cx) + Math.PI / 2 + Math.PI * 2) %
                  (Math.PI * 2)) -
                ((Math.atan2(b.y - cy, b.x - cx) + Math.PI / 2 + Math.PI * 2) %
                  (Math.PI * 2)),
            );
          } else {
            cluster.sort((a, b) => a.x - b.x);
          }
          ordered.push(...cluster);
        }

        ordered.forEach((d) => {
          d.el.style.transition = "opacity 0.25s ease-out";
        });
        dotsRef.current = ordered.map((d) => d.el);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  // THE CHASER. Dots are never set straight from the count — a late-arriving
  // SVG or a warm cache would then light a whole stretch in one frame, which
  // is the "half of it just appeared" artefact. Instead a pointer chases the
  // count's target at a capped rate, so every dot lights in sequence and the
  // sweep is always seen travelling, merely lagging the number when the
  // number is faster. The announcement waits for the sweep (sweepDone), with
  // a timeout escape in case the artwork never arrives — the panel must
  // never strand on a missing decoration.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let lit = 0;
    // Cursor for the per-dot cascade: each dot's fade-in begins strictly
    // after the previous dot's, however many light in one frame.
    let lightAt = 0;
    const started = performance.now();
    const step = () => {
      if (panelRef.current?.hasAttribute("data-lifted")) return;
      const dots = dotsRef.current;
      if (dots.length) {
        // Pace the full sweep to SWEEP_MS even when the vector is cached.
        const maxStep = Math.max(1, Math.ceil(dots.length / (SWEEP_MS / 16.7)));
        // Spacing between consecutive dots so the whole run of dots still
        // paces to the same ~1.5s sweep — the flow moves dot per dot, never
        // a frame's batch switching on together.
        const perDotMs = SWEEP_MS / dots.length;
        const target = Math.floor(displayRef.current * dots.length);
        if (lit < target) {
          const now = performance.now();
          if (lightAt < now) lightAt = now;
          const next = Math.min(target, lit + maxStep);
          for (let i = lit; i < next; i++) {
            dots[i].style.transitionDelay = `${Math.max(0, lightAt - now)}ms`;
            dots[i].style.opacity = "1";
            lightAt += perDotMs;
          }
          lit = next;
        }
        if (lit >= dots.length && displayRef.current >= 1) {
          setPhase((current) => current === "loading" ? "named" : current);
          return;
        }
      } else if (
        displayRef.current >= 1 &&
        performance.now() - started > SWEEP_MS + 500
      ) {
        setPhase((current) => current === "loading" ? "named" : current);
        return;
      }
      frame = window.requestAnimationFrame(step);
    };
    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [SWEEP_MS]);

  useEffect(() => {
    if (phase !== "named") return;
    const timer = window.setTimeout(() => setPhase("lifted"), NAME_DWELL_MS);
    return () => window.clearTimeout(timer);
  }, [phase, NAME_DWELL_MS]);

  // Timers remain a backstop when a saturated main thread starves rAF.
  useEffect(() => {
    const ceiling = window.setTimeout(() => setPhase("lifted"), HARD_CAP_MS + NAME_DWELL_MS + 1500);
    return () => window.clearTimeout(ceiling);
  }, [HARD_CAP_MS, NAME_DWELL_MS]);

  useEffect(() => {
    if (phase !== "lifted") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // The entrance gate opens after the cover's fade, not at the start of it.
    const timer = window.setTimeout(() => reveal.current?.(), reduced ? 0 : BLINK_LIT_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === "lifted") return;
    // Event interception avoids racing the homepage film's overflow lock,
    // and preserves browser-history scroll positions behind this cover.
    const preventScroll = (event: Event) => {
      if (event instanceof WheelEvent && event.ctrlKey) return;
      event.preventDefault();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "Escape" || event.key === "Tab") {
        setPhase("lifted");
      } else if ([" ", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(event.key)) {
        event.preventDefault();
      }
    };
    window.addEventListener("wheel", preventScroll, { passive: false, capture: true });
    window.addEventListener("touchmove", preventScroll, { passive: false, capture: true });
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("wheel", preventScroll, true);
      window.removeEventListener("touchmove", preventScroll, true);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [phase]);

  const percent = Math.round(display * 100);
  const named = phase !== "loading";

  return (
    <div
      ref={panelRef}
      data-page-loader
      data-page-name={name}
      data-phase={phase}
      data-navigation={navigation || undefined}
      data-lenis-prevent
      data-lifted={phase === "lifted" || undefined}
      onAnimationEnd={event => {
        if (event.animationName === "y-page-loader-bail") setPhase("lifted");
      }}
      role="status"
      aria-live="polite"
      aria-hidden={phase === "lifted" || undefined}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-charcoal transition-opacity ease-quiet data-[lifted]:pointer-events-none data-[lifted]:opacity-0 motion-reduce:transition-none"
      style={{ transitionDuration: `${BLINK_LIT_MS}ms` }}
    >
      <noscript>
        <style>{`[data-page-loader]{display:none}`}</style>
      </noscript>

      <div className="relative w-full px-6 text-center">
        {/* The count. Fades as the name takes over. */}
        <div
          aria-hidden={named || undefined}
          className={`transition-opacity duration-(--dur-medium) ease-quiet motion-reduce:transition-none ${
            named ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* The real wordmark, exported whole from the hi-fi navbar — never
              redrawn (see CLAUDE.md, Assets and brand). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-wordmark.svg"
            alt="YACHATDAC"
            width={216}
            height={64}
            className="mx-auto h-12 w-auto lg:h-16"
          />

          {/* Progress is the artist's dots-wave filling dot by dot along its
              own flow — out of the first rosette and along the wave (see the
              inlining effect above). dots-wave-gold.svg is a recoloured
              INSTANCE of the supplied file (recompose rules: recolouring is
              permitted) — half the original's dots are black and vanish on
              charcoal. The dim copy beneath is the track. */}
          <div
            aria-hidden
            className="relative mx-auto mt-14 w-[min(80vw,52rem)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/artwork/dots-wave-gold.svg"
              alt=""
              width={823}
              height={93}
              className="w-full opacity-15"
            />
            {/* The lit dots — the same vector inlined by the effect above so
                each dot can switch on when the wavefront reaches it. */}
            <div ref={waveRef} className="absolute inset-0 w-full" />
          </div>

          <p
            aria-hidden="true"
            className="mt-8 text-sm tabular-nums text-canvas/60"
          >
            {percent}%
          </p>
        </div>

        {/* The announcement — takes the count's place at 100%. */}
        <div
          aria-hidden={!named || undefined}
          className={`absolute inset-x-0 top-1/2 -translate-y-1/2 transition-opacity duration-(--dur-medium) ease-quiet motion-reduce:transition-none ${
            named ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="eyebrow text-xs text-gold">{pageLoaderCopy.viewing}</p>
          <p className="headline mt-4 text-h2 leading-[1.05] tracking-[-0.015em] text-canvas">
            {name}
          </p>
        </div>
      </div>
    </div>
  );
}
