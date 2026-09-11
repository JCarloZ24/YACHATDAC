"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { register, start } from "@/lib/motion-controller";

gsap.registerPlugin(useGSAP);

/** F7 / user direction, 11 September 2026: the homepage's single-stage pattern.
 * D5: this host owns no words. The existing Sections remain server-rendered.
 * Three.js loads separately; a failed chunk leaves the complete document.
 */
export function OurPeopleCanvas() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useGSAP(() => {
    const element = canvas.current;
    const root = element?.closest<HTMLElement>("[data-people-stage]");
    if (!element || !root) return;
    let cancelled = false;
    let unregister: (() => void) | undefined;
    void import("@/lib/motion/our-people").then(({ createOurPeople }) => {
      if (cancelled) return;
      unregister = register(createOurPeople(root, element));
      start();
    }).catch(() => {
      // X7 / SYS-02: a failed enhancement also settles the shared loader.
      if (!cancelled) root.dataset.pageReady = "fallback";
    });
    return () => { cancelled = true; unregister?.(); };
  }, { scope: canvas });
  return <canvas ref={canvas} aria-hidden="true" className="people-canvas pointer-events-none absolute inset-0 h-full w-full" />;
}
