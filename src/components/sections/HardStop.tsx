"use client";

import { useEffect, useRef, useState } from "react";
import { hardStop } from "@/content/truth";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * ⛔ The hard stop — 1902 / 1886.
 *
 * WHAT IS DELIBERATELY NOT HERE
 * -----------------------------
 * Suzanne Thompson's testimony. It sits under a written approval gate stated
 * on the draft itself and is not in this repository at all. This block shows
 * its structure, its scroll behaviour and its weight on the page, and nothing
 * else, until she has seen it and signed it off.
 *
 * THE SCROLL LOCK — Tier 1 on a Tier 2 page, PENDING DECISION D9
 * --------------------------------------------------------------
 * The design intent is that the descent genuinely stops: the viewport is held
 * rather than the reader simply passing through a tall empty band. Holding the
 * viewport is pinning, and F4 reserves pinning to the homepage — so this runs
 * in the prototype as an explicit exception request and must not ship until
 * D9 names an approver and that approver says yes.
 *
 * WHY IT IS BOUNDED
 * -----------------
 * A scroll block with no exit is a keyboard and screen-reader trap, and this
 * is the page least able to afford one. So the lock:
 *   · engages once per session, never on the way back up;
 *   · self-releases after DWELL_MS no matter what the reader does;
 *   · releases immediately on Escape, on any navigation keypress, and as soon
 *     as focus enters the document's tab order;
 *   · is never created at all under prefers-reduced-motion — not slowed, not
 *     gentled, absent, per the accessibility hard rule "Pinning is disabled
 *     entirely".
 *
 * The pause is carried by emptiness and the broken rail. The lock only makes
 * the reader sit in it for a beat; it is not what creates the moment.
 */

/** How long the viewport is held, at most. Bounded on purpose. */
const DWELL_MS = 1400;

/** Keys that should release the lock rather than be swallowed by it. */
const RELEASE_KEYS = new Set([
  "Escape",
  "Tab",
  "PageDown",
  "PageUp",
  "ArrowDown",
  "ArrowUp",
  "Home",
  "End",
  " ",
]);

export function HardStop() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const [locked, setLocked] = useState(false);
  const engagedRef = useRef(false);

  useEffect(() => {
    if (prefersReduced) return;
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;

    let timer: number | undefined;
    const release = () => {
      window.clearTimeout(timer);
      setLocked(false);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || engagedRef.current) return;
        engagedRef.current = true; // once per session, never on scroll-up
        setLocked(true);
        timer = window.setTimeout(release, DWELL_MS);
      },
      { threshold: 0.9 },
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      release();
    };
  }, [prefersReduced]);

  useEffect(() => {
    if (!locked) return;

    const block = (event: Event) => event.preventDefault();
    const onKeyDown = (event: KeyboardEvent) => {
      if (RELEASE_KEYS.has(event.key)) setLocked(false);
    };
    const releaseNow = () => setLocked(false);

    // Non-passive: preventDefault on a passive listener is a no-op.
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    // Anything reaching the tab order means somebody is navigating by
    // keyboard or AT. Get out of their way immediately.
    window.addEventListener("focusin", releaseNow);

    return () => {
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("focusin", releaseNow);
    };
  }, [locked]);

  return (
    <section
      ref={sectionRef}
      id={hardStop.id}
      data-motion="scroll-lock"
      data-locked={locked || undefined}
      className="relative flex min-h-svh flex-col items-center justify-center bg-charcoal px-6 py-32 text-center"
    >
      <p className="eyebrow text-canvas/40">{hardStop.years}</p>

      <p className="headline mt-10 max-w-3xl text-2xl text-canvas/25 sm:text-3xl">
        {hardStop.countSlot}
      </p>

      <div className="mt-20 max-w-2xl border border-dashed border-oxide/60 p-6 text-left">
        <p className="eyebrow text-oxide">{hardStop.holdTitle}</p>
        <p className="mt-3 text-sm leading-relaxed text-canvas/60">
          {hardStop.holdBody}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-canvas/40">
          {hardStop.attributionNote}
        </p>
      </div>

      <p className="mt-10 max-w-xl text-xs text-canvas/35">
        ⚠ Prototype: the viewport is held here for a moment. Tier 1 on a Tier 2
        page — exception pending decision D9. Press Escape to continue
        immediately; it releases on its own either way.
      </p>

      {/* Announced rather than shown, so AT users are told what happened
          instead of silently losing scroll for a beat. */}
      <span aria-live="polite" className="sr-only">
        {locked ? "The page pauses here." : ""}
      </span>
    </section>
  );
}
