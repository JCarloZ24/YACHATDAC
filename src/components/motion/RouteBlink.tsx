"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { BLINK_DIM_MS } from "@/lib/motion/route-entry";
import { isPublicRoute, PAGE_LOAD_START } from "@/lib/page-readiness";

/** X7 / SYS-02, August, 11 September 2026: the blink now opens the shared
 * named loading panel. It paints before router.push, covering route fetches
 * as well as media/animation setup after commit. RouteLoader owns the exit.
 * Keeping one cover also brings Record article links into the same system.
 */
export function RouteBlink() {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    let timer: number | undefined;
    let pending = false;
    const cancel = () => window.clearTimeout(timer);
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0
        || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || (anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname
        || !isPublicRoute(url.pathname)) return;
      event.preventDefault();
      cancel();
      pending = true;
      window.dispatchEvent(new CustomEvent(PAGE_LOAD_START, { detail: { pathname: url.pathname } }));
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      timer = window.setTimeout(() => router.push(`${url.pathname}${url.search}${url.hash}`), reduced ? 0 : BLINK_DIM_MS);
    };
    const onPop = () => {
      cancel();
      if (pending || window.location.pathname !== pathname) {
        window.dispatchEvent(new CustomEvent(PAGE_LOAD_START, {
          detail: { pathname: window.location.pathname, navigation: false },
        }));
      }
      pending = false;
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    return () => {
      cancel();
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
    };
  }, [router, pathname]);
  return null;
}
