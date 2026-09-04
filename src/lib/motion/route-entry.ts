"use client";

/**
 * When may a page's entrance choreography start?
 *
 * Two different gates, one answer:
 *  - first document load — the X1 loader owns the moment (src/lib/site-entry.ts);
 *  - any later client navigation — the X7 route wipe owns it, and GSAP
 *    entrances that fire while the old page's snapshot still covers the screen
 *    play unseen.
 *
 * awaitEntry() is the one call a section makes; it does not need to know which
 * situation it mounted into. Same design as site-entry: entry is state, not an
 * event, so late subscribers are told immediately.
 *
 * VT_DURATION_MS is the single source of truth for the wipe's length — the CSS
 * in src/components/motion/transitions.css states 600ms and this adds one settle frame.
 * Change them together or entrances race the snapshot.
 */

import { onEnter } from "@/lib/site-entry";

export const VT_DURATION_MS = 620;

let navigated = false;
let settled = true;
const listeners = new Set<() => void>();

/** Called by TransitionProvider the moment the pathname changes. */
export function beginRoute(): void {
  navigated = true;
  settled = false;
  listeners.clear();
}

/** Called by TransitionProvider once the wipe has finished. Idempotent. */
export function markRouteSettled(): void {
  if (settled) return;
  settled = true;
  listeners.forEach((listener) => listener());
  listeners.clear();
}

/**
 * Runs `callback` when this page is actually visible — after the loader on a
 * first visit, after the wipe on a navigation, immediately if both are past.
 * Returns an unsubscribe.
 */
export function awaitEntry(callback: () => void): () => void {
  if (!navigated) return onEnter(callback);
  if (settled) {
    callback();
    return () => undefined;
  }
  listeners.add(callback);
  return () => listeners.delete(callback);
}
