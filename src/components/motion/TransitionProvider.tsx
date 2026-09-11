"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToTop } from "@/lib/motion/smooth-scroll";

/** X7 / SYS-02, August, 11 September 2026: route scroll restoration and
 * measurement happen beneath RouteLoader. Only the loader releases the
 * entrance gate; a fixed timer cannot stand in for media readiness.
 * Browser history and explicit hash links retain their intended position.
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

    if (!popped.current && !window.location.hash) scrollToTop();
    popped.current = false;

    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
