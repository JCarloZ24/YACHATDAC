"use client";

/**
 * The handshake between the loader and the hero.
 *
 * X1's spec is "panel lifts, hero already laid out beneath" — the hero exists
 * the whole time, it just has not performed its entry yet. Something has to
 * tell it when to, and a plain DOM event is not enough: the hero can mount
 * after the loader has already lifted (reduced motion, a repeat visit in the
 * same session), and it would miss an event that had already fired.
 *
 * So entry is state, not just a signal. Late subscribers are told immediately.
 */

let entered = false;
const listeners = new Set<() => void>();

export function hasEntered(): boolean {
  return entered;
}

/** Called by the loader when the panel lifts. Idempotent. */
export function markEntered(): void {
  if (entered) return;
  entered = true;
  listeners.forEach((listener) => listener());
  listeners.clear();
}

/**
 * Runs `callback` once the site has been entered — immediately if that has
 * already happened. Returns an unsubscribe.
 */
export function onEnter(callback: () => void): () => void {
  if (entered) {
    callback();
    return () => undefined;
  }
  listeners.add(callback);
  return () => listeners.delete(callback);
}
