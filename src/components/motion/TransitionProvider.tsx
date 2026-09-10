"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  beginRoute,
  markRouteSettled,
  VT_DURATION_MS,
} from "@/lib/motion/route-entry";
import { scrollToTop } from "@/lib/motion/smooth-scroll";

/**
 * The client half of the X7 route-transition system. Renders nothing.
 *
 * On every pathname change it: opens the route-entry gate, resets scroll
 * (except on browser back/forward, where Next restores the position and a
 * forced top would break it — the one-shot popstate flag), then marks the
 * route settled after the blink so gated entrances may play, and refreshes
 * ScrollTrigger so pins measure the new page, not the old one.
 *
 * ⚠ THE SCROLL RESET AND THE REFRESH BOTH HAPPEN BEHIND THE DARK, and that is
 * the point of the blink rather than a wipe. Jumping a long page back to the
 * top and re-measuring every pin are visible operations; under a curtain that
 * reveals, the reader sees them. Under one that closes first, there is nothing
 * to see (11 September 2026).
 *
 * Mounted once in the ROOT layout, so every route gets it — it used to be
 * mounted in three segment layouts and six pages went without. Layouts persist
 * across navigations, which is exactly why this works and why it must not sit
 * in a page.
 */
export function TransitionProvider() {
  const pathname = usePathname();
  const firstRender = useRef(true);
  const popped = useRef(false);

  useEffect(() => {
    const onPop = () => {
      popped.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    beginRoute();
    if (!popped.current) scrollToTop();
    popped.current = false;

    const timer = window.setTimeout(() => {
      markRouteSettled();
      ScrollTrigger.refresh();
    }, VT_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
