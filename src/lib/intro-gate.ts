"use client";

/**
 * Has this reader already been through the homepage's opening film?
 *
 * The film runs 39 seconds and the cover waits for a press, so replaying it on
 * every mount is not a small cost — and until 10 September 2026 that is exactly
 * what happened, on a refresh AND on a client-side navigation back to `/`
 * (HomeLoader carried no flag of any kind). User direction: play it on a
 * genuine first arrival and not again for the rest of the browser session.
 *
 * SESSION, not forever. Close the tab and come back and the film plays again,
 * which is the point — it is the front door, and it should still open for
 * someone arriving fresh. It just stops charging the same person twice.
 *
 * ⚠ THE ONLY LOADING SCREEN ON THE SITE as of 11 September 2026. User
 * direction: the opening film is it. The Record's cover and Living Work's
 * panel were removed outright and Wonder's was unmounted but kept
 * (wonder/_components/Loader.tsx), so `<html data-record-loaded>` — the
 * per-document flag this note used to contrast against — no longer exists.
 *
 * The contrast is still worth keeping, because the remaining flags are all
 * per-document: `route-entry`'s `navigated`, `site-entry`'s `entered` and
 * PageLoader's `shownThisPageLoad` all die on reload. `sessionStorage` in
 * lofi/Preloader.tsx is the only other thing here with real session lifetime,
 * and this follows it, key namespace included.
 */

export const INTRO_SEEN_KEY = "yachatdac:seen-intro";

/**
 * The reviewer's way back in. August and Marc are about to watch this film
 * repeatedly and must not have to clear browser storage between viewings.
 *
 * Read off `location.search` rather than `useSearchParams` (which needs a
 * Suspense boundary the repo does not have anywhere, and would de-opt the
 * route) or the server `searchParams` prop (which would make `/` dynamic; it
 * is static today). Matched exactly, not parsed loosely — the same "validate
 * against a known value" the-record/page.tsx and v2/home/page.tsx already use.
 */
export function introForced(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("intro") === "1";
}

/**
 * Every access is wrapped: `sessionStorage` does not merely return null in a
 * private window or with site data blocked — reading it THROWS. An unguarded
 * read would take the homepage down for exactly the people most likely to have
 * hardened their browser.
 *
 * Failure means "not seen", so the degraded state is the film playing. That is
 * the designed experience; a reader who cannot be remembered should get the
 * front door, not be locked out of it.
 */
export function hasSeenIntro(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(INTRO_SEEN_KEY) !== null;
  } catch {
    return false;
  }
}

/** Idempotent, and silent when storage refuses. The film simply shows again. */
export function markIntroSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    // Private mode, or site data blocked. Nothing breaks; the cover returns.
  }
}
