"use client";
import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

/** NAV-02: hold the old snapshot until the actual article commits. */
export function RecordNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const committed = useRef<(() => void) | undefined>(undefined);
  useLayoutEffect(() => { committed.current?.(); committed.current = undefined; }, [pathname]);
  useEffect(() => {
    let active: ViewTransition | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const navigate = (event: Event) => {
      const { href, x, y } = (event as CustomEvent<{ href: string; x: number; y: number }>).detail;
      if (active) return;
      const html = document.documentElement;
      // Capture viewport coordinates as literal keyframes before navigation
      // changes scroll/layout; pseudo-elements need no inherited CSS variables.
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      html.dataset.recordReveal = "true";
      active = document.startViewTransition(() => new Promise<void>(resolve => {
        committed.current = () => { clearTimeout(timeout); resolve(); };
        router.push(href);
        // Don't hold a frozen catalogue during a cold article request.
        // Prefetched routes reveal normally; slow loads use ordinary navigation.
        timeout = setTimeout(() => { active?.skipTransition(); resolve(); }, 650);
      }));
      void active.ready.then(() => {
        html.animate([
          { clipPath: `circle(0px at ${x}px ${y}px)` },
          { clipPath: `circle(${radius}px at ${x}px ${y}px)` },
        ], { duration: 420, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
          fill: "both", pseudoElement: "::view-transition-new(root)" });
      }).catch(() => { /* Cold navigations may skip the snapshot. */ });
      void active.finished.catch(() => {}).finally(() => {
        clearTimeout(timeout); active = undefined; committed.current = undefined;
        delete html.dataset.recordReveal;
      });
    };
    window.addEventListener("record-navigate", navigate);
    return () => {
      window.removeEventListener("record-navigate", navigate);
      active?.skipTransition(); committed.current?.(); clearTimeout(timeout);
      delete document.documentElement.dataset.recordReveal;
    };
  }, [router]);
  return null;
}
