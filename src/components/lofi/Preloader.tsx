"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { loaderSlot } from "@/content/lofi/media";
import { org } from "@/content/site";
import { trackAssets } from "@/lib/asset-progress";
import { markEntered } from "@/lib/site-entry";

/**
 * X1 — honest loader. Group X (core plumbing), so it spends no signature
 * budget: F4's cap of two counts pinned/scrubbed signature moments, and this
 * is neither.
 *
 * Spec: "Progress from real asset decode. Panel lifts, hero already laid out
 * beneath. Hard cap 2.5s, once per session. build — never fake the number."
 *
 * WHAT IS AND IS NOT HERE
 * -----------------------
 * ⚠ NO LOGO IS DRAWN. Build documentation §5 is explicit that the hand-lettered
 * YACHATDAC wordmark must not be recreated or approximated in code. The mark
 * below is the artist's own vector, exported whole from Marc's hi-fi navbar
 * (node 17:260) to public/brand/logo-wordmark.svg. Rendering the real asset is
 * not recreating it; redrawing or restyling it would be.
 *
 * ⚠ The background is a tonal field until footage lands. loaderSlot is fixed
 * to the `country` bucket: the panel holds and the footage loops, and neither
 * is permitted on cultural-site material.
 *
 * HANDOFF
 * -------
 * On lift this calls markEntered() (src/lib/site-entry.ts) and the hero runs
 * its entry then, so the two are sequenced rather than racing at load. Entry
 * is stored as state rather than fired as an event, because the hero can mount
 * *after* the lift — reduced motion, or a repeat visit in the same session —
 * and would miss an event that had already gone.
 *
 * REDUCED MOTION
 * --------------
 * Hidden by a CSS media query rather than by JavaScript, so there is no frame
 * where it exists. Absent, not slowed (X6).
 */

/** Real assets, tracked for real. These are the faces that move layout. */
const TRACKED_ASSETS = [
  "/fonts/BlockBerthold.woff2",
  "/fonts/BantayogSans-ExtraBold.woff2",
  "/fonts/WorkSans-Variable.woff2",
];

const SESSION_KEY = "yachatdac:seen-loader";

/** Runs during HTML parse, before first paint — no flash on a repeat visit. */
const SKIP_IF_SEEN = `try{if(sessionStorage.getItem('${SESSION_KEY}')){var n=document.currentScript.parentNode;n.setAttribute('data-seen','');}}catch(e){}`;

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [display, setDisplay] = useState(0);
  const [lifted, setLifted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const liftedRef = useRef(false);

  // Real progress.
  useEffect(() => {
    // Two paths where the panel is never seen: a repeat visit this session,
    // and reduced motion (where the CSS hides it outright). Both must still
    // hand off, or the hero waits for an entry that is never announced.
    const seen = rootRef.current?.hasAttribute("data-seen");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      liftedRef.current = true;
      setLifted(true);
      markEntered();
      return;
    }
    const watcher = trackAssets(TRACKED_ASSETS, setProgress);
    return () => watcher.cancel();
  }, []);

  // Display easing. Lags the measured value, never leads it — see
  // asset-progress.ts for why that is still an honest number.
  useEffect(() => {
    let frame = 0;
    const step = () => {
      setDisplay((current) => {
        const delta = progress - current;
        if (Math.abs(delta) < 0.001) return progress;
        frame = window.requestAnimationFrame(step);
        return current + delta * 0.12;
      });
    };
    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [progress]);

  const ready = display > 0.999;

  const lift = () => {
    if (liftedRef.current) return;
    liftedRef.current = true;
    setLifted(true);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Private mode. The loader simply shows again; nothing breaks.
    }
    markEntered();
  };

  // Scroll is held while the panel is up, and released the moment it lifts.
  // Escape always releases: a loading screen must never be a dead end.
  useEffect(() => {
    if (lifted) {
      document.documentElement.style.removeProperty("overflow");
      return;
    }
    document.documentElement.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") lift();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.removeProperty("overflow");
    };
  }, [lifted]);

  // Move focus to the one control as soon as there is one to move to.
  useEffect(() => {
    if (ready && !lifted) buttonRef.current?.focus();
  }, [ready, lifted]);

  const percent = Math.round(display * 100);

  return (
    <div
      ref={rootRef}
      data-loader
      data-lifted={lifted || undefined}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-charcoal transition-transform duration-(--dur-large) ease-country data-[lifted]:pointer-events-none data-[lifted]:-translate-y-full data-[seen]:hidden motion-reduce:hidden"
    >
      <script dangerouslySetInnerHTML={{ __html: SKIP_IF_SEEN }} />

      {/* Background field. Becomes the loader footage once it lands — see
          loaderSlot, which is pinned to the `country` bucket. */}
      <div
        aria-hidden
        data-placeholder="loader-media"
        data-bucket={loaderSlot.bucket}
        className="absolute inset-0 bg-charcoal"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-charcoal via-charcoal/60 to-charcoal"
      />

      <div className="relative flex flex-col items-center px-6">
        {/* The real wordmark, exported whole from Marc's hi-fi navbar
            (node 17:260). Never redrawn — see the file header. */}
        <Image
          src="/brand/logo-wordmark.svg"
          alt={org.name}
          width={216}
          height={64}
          priority
          className="h-12 w-auto sm:h-16"
        />
        <p className="eyebrow mt-5 max-w-md text-center text-[10px] leading-relaxed text-canvas/40">
          {org.legalName}
        </p>

        {/* Progress rule. scaleX, not width — transform only. */}
        <div className="mt-16 h-px w-[min(60vw,32rem)] bg-canvas/20">
          <div
            className="h-px origin-left bg-canvas"
            style={{ transform: `scaleX(${display})` }}
          />
        </div>

        <p
          aria-live="polite"
          className="mt-6 text-sm tabular-nums text-canvas/60"
        >
          {percent}%
        </p>

        <button
          ref={buttonRef}
          type="button"
          onClick={lift}
          /* Present in the DOM the whole time so focus order never shifts
             under a keyboard user mid-load; only its appearance changes. */
          disabled={!ready}
          className="eyebrow mt-10 border border-canvas/30 px-8 py-4 text-canvas transition-all duration-(--dur-medium) ease-quiet hover:border-ochre hover:text-ochre disabled:pointer-events-none disabled:opacity-0"
        >
          View site
        </button>
      </div>
    </div>
  );
}
