"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { register, start } from "@/lib/motion-controller";
import { createHomeLoader } from "@/lib/motion/home-loader";
import { homeLoader } from "@/content/homepage";
import { HOME_LOADER_ARTWORK } from "@/content/kit";

gsap.registerPlugin(useGSAP);

/**
 * One-second homepage intro, user reference / direction 8 September 2026.
 * F7: transition is the loud channel. Reuses supplied vectors (F8 artwork
 * motion permission); no Three.js scene is needed for this flat masked band.
 */
export function HomeLoader() {
  const cover = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cover.current) return;
    const unregister = register(createHomeLoader(cover.current));
    start();
    return unregister;
  }, { scope: cover });

  return (
    <div
      ref={cover}
      data-home-loader
      data-lenis-prevent
      role="progressbar"
      aria-label={homeLoader.label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      className="fixed inset-0 z-[100] overflow-hidden bg-night-black text-gold motion-reduce:hidden"
    >
      <noscript><style>{"[data-home-loader]{display:none!important}"}</style></noscript>
      <div data-loader-art className="absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-0">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-64 top-1/2 h-[32rem] w-[32rem] -translate-y-1/2 bg-canvas lg:-left-80 lg:h-[40rem] lg:w-[40rem]"
          style={{ maskImage: `url(${HOME_LOADER_ARTWORK.ring})`, maskSize: "contain", maskRepeat: "no-repeat" }}
        />
        <div aria-hidden="true" className="relative mx-6 lg:mx-20">
          <Image
            src={HOME_LOADER_ARTWORK.wave}
            alt=""
            width={823.37}
            height={93.25}
            className="block h-auto w-full opacity-10"
          />
          <div data-loader-wave className="absolute inset-0 [clip-path:inset(0_100%_0_0)]">
            <Image
              src={HOME_LOADER_ARTWORK.wave}
              alt=""
              width={823.37}
              height={93.25}
              className="block h-auto w-full"
            />
          </div>
        </div>
        <p aria-hidden="true" className="absolute inset-x-0 top-full mt-10 text-center text-sm tabular-nums leading-none tracking-[0.08em] lg:mt-14 lg:text-base">
          <span data-loader-count>0</span><span className="ml-1">%</span>
        </p>
      </div>
    </div>
  );
}
