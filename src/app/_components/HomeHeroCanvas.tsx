"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { register, start } from "@/lib/motion-controller";
import { createHomeHero } from "@/lib/motion/home-hero";

gsap.registerPlugin(useGSAP);

/** F7 / user direction 8 September 2026: canvas host, controller-owned lifecycle.
 * The photo frames it used to hand down went with the collage, 10 September
 * 2026: the canvas now draws one photograph, named in kit.ts. */
export function HomeHeroCanvas() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useGSAP(() => {
    const element = canvas.current;
    const root = element?.closest<HTMLElement>("[data-home-hero]");
    if (!element || !root) return;
    const unregister = register(createHomeHero(root, element));
    start();
    return unregister;
  }, { scope: canvas });
  return <canvas ref={canvas} aria-hidden="true" className="home-hero-canvas absolute inset-0 h-full w-full" />;
}
