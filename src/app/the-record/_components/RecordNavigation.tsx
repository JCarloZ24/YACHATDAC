"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { recordPortalCopy } from "@/content/the-record";

/** NAV-06, user direction 11 September 2026: fade through a readiness cover.
 * CSS owns opacity across the route commit, like RouteBlink. No snapshot,
 * coordinate mask or GSAP timeline survives the outgoing page's teardown.
 */
export function RecordNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<"idle" | "loading" | "leaving">("idle");
  const committed = useRef<{ href: string; resolve: () => void; cancel: () => void } | null>(null);

  useLayoutEffect(() => {
    const pending = committed.current;
    if (!pending) return;
    if (pathname === pending.href) pending.resolve();
    else pending.cancel();
  }, [pathname]);

  useEffect(() => {
    let active: AbortController | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let ceiling: ReturnType<typeof setTimeout> | undefined;
    const cancel = () => {
      active?.abort();
      active = null;
      clearTimeout(timer);
      clearTimeout(ceiling);
      committed.current = null;
      setPhase("idle");
    };
    const navigate = async (event: Event) => {
      if (active) return;
      const { href } = (event as CustomEvent<{ href: string }>).detail;
      const controller = new AbortController();
      active = controller;
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const aborted = new Promise<never>((_, reject) => {
        controller.signal.addEventListener("abort", () => reject(new Error("Navigation released")), { once: true });
      });
      setPhase("loading");
      // A route or image failure must never leave the document behind a cover.
      ceiling = setTimeout(() => controller.abort(), 8000);
      try {
        await Promise.race([
          new Promise<void>(resolve => { timer = setTimeout(resolve, reduced ? 0 : 200); }),
          aborted,
        ]);
        const destination = new Promise<void>(resolve => {
          committed.current = { href, resolve, cancel };
        });
        router.push(href);
        await Promise.race([destination, aborted]);
        // Decode the actual responsive Next image, not a second master request.
        const hero = document.querySelector<HTMLImageElement>("[data-record-hero-image]");
        if (hero) await Promise.race([hero.decode().catch(() => undefined), aborted]);
      } catch {
        // History navigation, unmount, or the readiness ceiling releases it.
      } finally {
        if (active === controller) {
          clearTimeout(ceiling);
          committed.current = null;
          setPhase("leaving");
          timer = setTimeout(() => {
            active = null;
            setPhase("idle");
          }, reduced ? 0 : 450);
        }
      }
    };
    window.addEventListener("record-navigate", navigate);
    window.addEventListener("popstate", cancel);
    return () => {
      window.removeEventListener("record-navigate", navigate);
      window.removeEventListener("popstate", cancel);
      active?.abort();
      active = null;
      clearTimeout(timer);
      clearTimeout(ceiling);
      committed.current = null;
    };
  }, [router]);

  return (
    <div data-record-navigation data-phase={phase} aria-hidden={phase !== "loading"}
      className="record-navigation fixed inset-0 z-[95] grid place-items-center bg-charcoal text-canvas">
      <p role="status" className="eyebrow text-sm leading-[1.5] tracking-[0.08em]">
        {phase === "loading" ? recordPortalCopy.loading : null}
      </p>
    </div>
  );
}
