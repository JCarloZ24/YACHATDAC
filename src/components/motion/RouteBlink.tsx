"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BLINK_DIM_MS, BLINK_LIT_MS } from "@/lib/motion/route-entry";

/**
 * X7 — the route blink. The lights go down, the page changes, the lights come
 * back up (August, 11 September 2026: "the transition between pages must be
 * seamless, continuous, no flickers, no visual bugs… I like the dim lights
 * transition effect, like a blink of an eye").
 *
 * ⚠ THIS REPLACES THE <ViewTransition> ROUTE ANIMATION, AND THE REASON IS
 * MEASURED, NOT STYLISTIC. The previous system asked React's `<ViewTransition>`
 * to animate the browser's own snapshots. On this app it fired inconsistently:
 * /wonder → /truth produced `::view-transition-old(root)` and a matching
 * `new(...)` and animated correctly, while /truth → /about produced NO
 * view-transition pseudo-elements at all — checked by polling
 * `document.getAnimations()` every frame for sixteen seconds with the
 * durations stretched to 30s. Two pages transitioning and two pages cutting is
 * exactly the "flicker" this was asked to fix, and no amount of CSS on the
 * pseudo-elements can fix a transition that never starts.
 *
 * So the curtain is ours. One fixed panel, one opacity transition, no
 * snapshots: it cannot be skipped, it costs nothing to capture on a 12,000px
 * page, and it behaves identically on every route and in every browser —
 * including those with no View Transition API at all.
 *
 * HOW IT HIDES THE JANK. The navigation is held until the panel is opaque, so
 * everything expensive and visible — the scroll reset to top, ScrollTrigger
 * re-measuring every pin, the header re-rendering, images that have not
 * decoded — happens behind the dark. That is the whole trick: a transition
 * that CLOSES first has nothing to reveal.
 *
 * ⚠ BROWSER BACK AND FORWARD CUT, AND THAT IS NOT AN OVERSIGHT. By the time a
 * `popstate` reaches us the browser has already navigated, so dimming then
 * would mean showing the new page, covering it, and showing it again — a real
 * flash, in place of a clean cut. A back button that responds instantly is
 * also what people expect. Forward navigation through links is the blink.
 *
 * REDUCED MOTION gets no blink and no delay: the click navigates immediately.
 */

/** Above the header (z-30) and the page, below the hard-load RouteLoader. */
const LAYER = "z-[90]";

export function RouteBlink() {
  const router = useRouter();
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  /** The href we dimmed for, cleared the moment the new route lands. */
  const pending = useRef<string | null>(null);
  const timer = useRef<number | null>(null);
  /**
   * ⚠ THE BRIGHTEN READS THIS, NOT THE `dark` STATE. That effect keys on the
   * pathname alone — it must not re-run when our own state settles — so the
   * `dark` it closes over is whatever it was on the render that installed it.
   * Measured with a stale one: a route landing while the panel was mid-dim
   * brightened it early, and the swap happened at opacity 0 with the page
   * plainly visible. A ref is read at the moment the effect runs, which is the
   * only moment that tells the truth.
   */
  const darkRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  }, []);

  useEffect(() => {
    const reduced = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onClick = (event: MouseEvent) => {
      // Everything the browser is entitled to do itself: a new tab, a
      // download, a right or middle click, a handler that already ran.
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

      const anchor = (event.target as Element | null)?.closest?.("a[href]") as
        | HTMLAnchorElement
        | null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download"))
        return;

      // ⚠ LINKS THAT OWN THEIR OWN TRANSITION ARE LEFT ALONE. The Record's
      // catalogue cards run NAV-02 — the article opening as a 420ms circle
      // expanding from the click (the-record/_components/RecordNavigation).
      // That is a native View Transition driven from the card's `onNavigate`,
      // and this listener runs in the CAPTURE phase: preventing the click here
      // would stop `onNavigate` ever firing, silently replacing a deliberate
      // effect with the blink. The reader would still arrive; the circle would
      // simply be gone, and nothing would say why.
      if (anchor.closest("[data-own-transition]")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page: an in-page anchor or the link to where we already are. A
      // blink for a jump down the page you are on would be a lie.
      if (url.pathname === window.location.pathname) return;
      if (reduced()) return;

      event.preventDefault();
      pending.current = `${url.pathname}${url.search}${url.hash}`;
      darkRef.current = true;
      setDark(true);
      clearTimer();
      // Navigate once the panel is opaque — never before it.
      timer.current = window.setTimeout(() => {
        timer.current = null;
        if (pending.current) router.push(pending.current);
      }, BLINK_DIM_MS);
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimer();
    };
  }, [router, clearTimer]);

  // The new route has rendered: bring the lights up. Two frames of delay so
  // the new page's first paint lands while the panel is still opaque —
  // without them the brighten races the render and the top of the page pops.
  useEffect(() => {
    pending.current = null;
    if (!darkRef.current) return;
    const id = window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => {
        darkRef.current = false;
        setDark(false);
      }),
    );
    return () => window.cancelAnimationFrame(id);
    // The pathname alone: this must run when the ROUTE changes, never when
    // our own state settles. `darkRef` is why that is safe — and why the
    // linter is content, since a ref is not a reactive dependency.
  }, [pathname]);

  /**
   * The failsafe. If a navigation never arrives — a push that fails, a route
   * that throws — the panel would otherwise stay down and the site would look
   * dead. Nothing about the blink is worth a black screen.
   */
  useEffect(() => {
    if (!dark) return;
    const id = window.setTimeout(() => {
      darkRef.current = false;
      setDark(false);
    }, 3000);
    return () => window.clearTimeout(id);
  }, [dark]);

  return (
    <div
      aria-hidden
      data-route-blink={dark ? "dark" : "lit"}
      className={`pointer-events-none fixed inset-0 ${LAYER} bg-charcoal`}
      style={{
        opacity: dark ? 1 : 0,
        transitionProperty: "opacity",
        transitionDuration: `${dark ? BLINK_DIM_MS : BLINK_LIT_MS}ms`,
        // Down fast and linear, up on the house ease: a light being switched
        // off has no curve, a light coming up does.
        transitionTimingFunction: dark ? "linear" : "var(--ease-quiet)",
      }}
    />
  );
}
