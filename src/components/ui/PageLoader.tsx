"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The page loading screen — hard loads and refreshes only. Built for Living
 * Work (its file header below is the original reasoning) and lifted here on
 * 8 Sep 2026 when Wonder needed the same panel over an 11 MB hero film:
 * `name` is what the panel announces, `ready` an extra readiness gate the
 * count cannot pass without (Wonder: the hero video can play), `hardCapMs`
 * the ceiling a heavy page may raise.
 *
 * Why it exists: on a refresh the server document paints in its rest state,
 * then fonts resolve, the motion pass builds, pin spacers change the page's
 * height and the browser's restored scroll position lands somewhere
 * meaningless — the reader sees sections flash past and ends up at the hero.
 * This panel covers that whole settling window, counts up to 100, announces
 * the page, and lifts onto a page that is already composed.
 *
 * HOW THE NUMBER IS DRIVEN. A single rAF loop paces a time ramp against real
 * readiness gates: the count cannot pass 35% before fonts have resolved
 * (`document.fonts.ready` — the assets that actually move layout) or 70%
 * before the window `load` event, and a hard cap forces completion at 2.8s so
 * the panel can never hang (a loading screen that can strand the reader is
 * worse than none — same rule as the lofi Preloader's). Everything lives in
 * one closure with no cancelable external stream, which is what makes it
 * safe under dev StrictMode's double-mount: any live mount drives itself to
 * 100 or is unmounted outright.
 *
 * When it does NOT run:
 * - Client-side navigations — the X7 route wipe already covers those. A
 *   module-scope flag survives SPA navigations, resets on a real page load.
 * - Reduced motion — hidden by CSS, absent not slowed (X6).
 * - JavaScript off — hidden by <noscript>; the document is simply readable.
 *
 * Deliberately NOT once-per-session: the flash this covers happens on every
 * refresh, so the panel does too.
 */

/** Module scope: reset by a real page load, kept across SPA navigations. */
let shownThisPageLoad = false;

/** Minimum time the count takes to read as a count, ms. */
const RAMP_MS = 1600;
/** How long the dot sweep takes to cross the wave, ms. */
const SWEEP_MS = 1500;
/** Past this the panel completes regardless of readiness state. */
const DEFAULT_HARD_CAP_MS = 2800;
/** How long the "You're viewing" line stands before the panel lifts. */
const NAME_DWELL_MS = 1400;

export function PageLoader({
  name,
  ready,
  hardCapMs = DEFAULT_HARD_CAP_MS,
  rampMs = RAMP_MS,
  sweepMs = SWEEP_MS,
  dwellMs = NAME_DWELL_MS,
}: {
  /** What the panel announces at 100% — "You're viewing {name}". */
  name: string;
  /** Polled each frame; the count cannot pass 80% until it returns true. */
  ready?: () => boolean;
  hardCapMs?: number;
  /** How long the count takes to reach 100 at the earliest. */
  rampMs?: number;
  /** How long the dot sweep takes to cross the wave. */
  sweepMs?: number;
  /** How long "You're viewing …" stands before the panel lifts. */
  dwellMs?: number;
}) {
  // Shadowed so every use below reads the caller's timing. Together these
  // set the panel's FLOOR: it cannot lift before ramp + dwell, however fast
  // the page is. Living Work keeps the original 1600/1500/1400; a page that
  // wants to feel instant passes shorter ones.
  const HARD_CAP_MS = hardCapMs;
  const RAMP_MS = rampMs;
  const SWEEP_MS = sweepMs;
  const NAME_DWELL_MS = dwellMs;
  const [display, setDisplay] = useState(0);
  const [phase, setPhase] = useState<"loading" | "named" | "lifted">("loading");
  const panelRef = useRef<HTMLDivElement>(null);
  // Per-INSTANCE claim on the module flag. StrictMode runs the effect twice
  // for one mount; deciding inside the effect body would make the second run
  // read the flag its own first run had set, and skip. The ref survives the
  // double-run, so one mount gets one answer.
  const shouldShow = useRef<boolean | null>(null);
  // The inlined artwork's dots, in the order the flow lights them (see below).
  const waveRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<SVGGraphicsElement[]>([]);
  const displayRef = useRef(0);
  // Synchronise the animation reader after React commits (9 September 2026).
  useEffect(() => { displayRef.current = display; }, [display]);

  useEffect(() => {
    if (shouldShow.current === null) {
      shouldShow.current = !shownThisPageLoad;
      shownThisPageLoad = true;
    }
    if (!shouldShow.current) {
      panelRef.current?.setAttribute("data-instant", "");
      const frame = window.requestAnimationFrame(() => setPhase("lifted"));
      return () => window.cancelAnimationFrame(frame);
    }

    // The settling window ends at the top of the page by design: presenting
    // the page from its hero is the point of announcing it.
    window.scrollTo(0, 0);

    let fontsReady = false;
    let windowLoaded = document.readyState === "complete";
    void document.fonts?.ready.then(() => {
      fontsReady = true;
    });
    const onLoad = () => {
      windowLoaded = true;
    };
    window.addEventListener("load", onLoad, { once: true });

    let frame = 0;
    const start = performance.now();
    const step = () => {
      const t = performance.now() - start;
      // Ease-out ramp: quick early movement, settling toward the top —
      // reads as loading rather than as a metronome.
      const x = Math.min(t / RAMP_MS, 1);
      const ramp = 1 - (1 - x) * (1 - x);
      const extra = ready ? ready() : true;
      const gate =
        t > HARD_CAP_MS
          ? 1
          : 0.35 +
            (fontsReady ? 0.25 : 0) +
            (windowLoaded ? 0.2 : 0) +
            (extra ? 0.2 : 0);
      const value = Math.min(ramp, gate);
      // Monotonic by construction: ramp and gate only ever rise.
      setDisplay(value);
      if (value < 1) frame = window.requestAnimationFrame(step);
    };
    frame = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("load", onLoad);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one run per mount by design
  }, []);

  // The artwork is inlined so each dot can be lit individually, in the order
  // the motif flows: dots are grouped into their clusters, the clusters run
  // left to right along the wave, and INSIDE each rosette the dots light in
  // CLOCKWISE order from 12 o'clock — a hand sweeping the circle — before the
  // flow moves on to the next cluster. Connector dots between rosettes simply
  // light along the way. (Reveal-by-mask of the supplied vector, per the
  // recorded artwork-motion permission; the geometry itself is untouched.)
  useEffect(() => {
    if (!shouldShow.current) return;
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
    if (!shouldShow.current) return;
    let frame = 0;
    let lit = 0;
    // Cursor for the per-dot cascade: each dot's fade-in begins strictly
    // after the previous dot's, however many light in one frame.
    let lightAt = 0;
    const started = performance.now();
    const step = () => {
      const dots = dotsRef.current;
      if (dots.length) {
        // Full sweep takes at least ~1.5s (90 frames) whatever the cache.
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
        performance.now() - started > HARD_CAP_MS + 1500
      ) {
        setPhase((current) => current === "loading" ? "named" : current);
        return;
      }
      frame = window.requestAnimationFrame(step);
    };
    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [HARD_CAP_MS, SWEEP_MS]);

  // The animation callback announces completion; Escape remains terminal.

  // …dwells, and the panel lifts. Two effects on purpose: a single effect
  // that both sets the phase and starts the timer re-runs on its own phase
  // change and its cleanup cancels the very timer it just set. The dwell
  // doubles as settling time for the motion build behind the panel.
  useEffect(() => {
    if (phase !== "named") return;
    const timer = window.setTimeout(() => setPhase("lifted"), NAME_DWELL_MS);
    return () => window.clearTimeout(timer);
  }, [phase, NAME_DWELL_MS]);

  // Scroll is held while the panel is up; Escape always releases — a loading
  // screen must never be a dead end.
  useEffect(() => {
    if (phase === "lifted") {
      document.documentElement.style.removeProperty("overflow");
      return;
    }
    document.documentElement.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPhase("lifted");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.removeProperty("overflow");
    };
  }, [phase]);

  const percent = Math.round(display * 100);
  const named = phase !== "loading";

  return (
    <div
      ref={panelRef}
      data-page-loader
      data-lifted={phase === "lifted" || undefined}
      role="status"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal ease-country data-[lifted]:pointer-events-none data-[lifted]:-translate-y-full motion-reduce:hidden transition-transform duration-(--dur-large) data-[instant]:transition-none"
    >
      <noscript>
        <style>{`[data-page-loader]{display:none}`}</style>
      </noscript>

      <div className="relative w-full px-6 text-center">
        {/* The count. Fades as the name takes over. */}
        <div
          aria-hidden={named || undefined}
          className={`transition-opacity duration-(--dur-medium) ease-quiet ${
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
            className="mx-auto h-12 w-auto sm:h-16"
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
            aria-live="polite"
            className="mt-8 text-sm tabular-nums text-canvas/60"
          >
            {percent}%
          </p>
        </div>

        {/* The announcement — takes the count's place at 100%. */}
        <div
          aria-hidden={!named || undefined}
          className={`absolute inset-x-0 top-1/2 -translate-y-1/2 transition-opacity duration-(--dur-medium) ease-quiet ${
            named ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="eyebrow text-xs text-gold">You&rsquo;re viewing</p>
          <p className="headline mt-4 text-4xl text-canvas sm:text-5xl">
            {name}
          </p>
        </div>
      </div>
    </div>
  );
}
