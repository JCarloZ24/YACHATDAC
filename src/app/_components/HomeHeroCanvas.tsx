"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { register, start } from "@/lib/motion-controller";
import { createHomeHero } from "@/lib/motion/home-hero";
import type { HomeHeroFrame } from "@/content/homepage-media";

gsap.registerPlugin(useGSAP);

/** F7 / user direction 8 September 2026: canvas host, controller-owned lifecycle. */
export function HomeHeroCanvas({ frames }: { frames: HomeHeroFrame[] }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useGSAP(() => {
    const element = canvas.current;
    const root = element?.closest<HTMLElement>("[data-home-hero]");
    if (!element || !root) return;
    const unregister = register(createHomeHero(root, element, frames));
    start();
    return unregister;
  }, { scope: canvas, dependencies: [frames], revertOnUpdate: true });
  return <canvas ref={canvas} aria-hidden="true" className="home-hero-canvas absolute inset-0 h-full w-full" />;
}
