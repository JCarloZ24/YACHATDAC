"use client";

/**
 * When may a page's entrance choreography start?
 *
 * Two different gates, one answer:
 *  - first document load — the X1 loader owns the moment (src/lib/site-entry.ts);
 *  - any later client navigation — the X7 route blink owns it, and GSAP
 *    entrances that fire while the screen is still dark play unseen.
 *
 * awaitEntry() is the one call a section makes; it does not need to know which
 * situation it mounted into. Same design as site-entry: entry is state, not an
 * event, so late subscribers are told immediately.
 *
 * The blink's two halves live here because three files need them and they
 * must not drift: RouteBlink animates them, this gates entrances on them.
 *
 * ⚠ THE GATE IS THE BRIGHTEN ONLY. `beginRoute()` is called when the new route
 * renders, which is already behind an opaque panel — the dim is spent by then.
 * What an entrance must wait for is the light, not the whole blink.
 */

import { onEnter } from "@/lib/site-entry";

/** Lights down. The navigation is held for exactly this long. */
export const BLINK_DIM_MS = 200;
/** Lights up, once the new route has painted. */
export const BLINK_LIT_MS = 260;

/**
 * How long after a route lands before its entrances may play. The brighten
 * plus a settle frame.
 *
 * Kept under the old name because every caller and comment in the motion
 * modules refers to it; "VT" is now a historical spelling — the route
 * animation has not used the View Transition API since 11 September 2026.
 */
export const VT_DURATION_MS = BLINK_LIT_MS + 20;

let navigated = false;
let settled = true;
const listeners = new Set<() => void>();

/** Called by TransitionProvider the moment the pathname changes. */
export function beginRoute(): void {
  navigated = true;
  settled = false;
  listeners.clear();
}

/** Called by TransitionProvider once the blink has finished. Idempotent. */
export function markRouteSettled(): void {
  if (settled) return;
  settled = true;
  listeners.forEach((listener) => listener());
  listeners.clear();
}

/**
 * Runs `callback` when this page is actually visible — after the loader on a
 * first visit, after the blink on a navigation, immediately if both are past.
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
