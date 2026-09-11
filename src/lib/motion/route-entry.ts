"use client";

/** X7 / SYS-02, August, 11 September 2026: entrances wait for the shared
 * readiness cover to finish fading. RouteLoader opens and releases this gate
 * for direct loads as well as navigation; readiness replaces a fixed delay.
 * Late subscribers are called immediately after the page becomes visible.
 */

import { onEnter } from "@/lib/site-entry";

/** Lights down. The navigation is held for exactly this long. */
export const BLINK_DIM_MS = 200;
/** Lights up, once the new route has painted. */
export const BLINK_LIT_MS = 260;

let navigated = false;
let settled = true;
const listeners = new Set<() => void>();

/** Called before navigation and before the incoming page subscribes. */
export function beginRoute(): void {
  navigated = true;
  settled = false;
  listeners.clear();
}

/** Called by RouteLoader after its readiness cover fades. Idempotent. */
export function markRouteSettled(): void {
  if (settled) return;
  settled = true;
  listeners.forEach((listener) => listener());
  listeners.clear();
}

/** Also used by the homepage's film/hero handoff to hold its entrance. */
export function routeEntryPending(): boolean {
  return navigated && !settled;
}

/** Runs the entrance once the shared cover has cleared. Returns an unsubscribe. */
export function awaitEntry(callback: () => void): () => void {
  if (!navigated) return onEnter(callback);
  if (settled) {
    callback();
    return () => undefined;
  }
  listeners.add(callback);
  return () => listeners.delete(callback);
}
