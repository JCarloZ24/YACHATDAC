"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { prefersReduced, register, start } from "@/lib/motion-controller";
import { createRouteMap } from "@/lib/motion/route-map";

/**
 * Wonder — the inlined maps that draw themselves.
 *
 * The map files (§02 3238:34073 / 2576:22115, §04 3238:34130 / 2576:22808)
 * used to be `<img>`s. They are read on the server (route-map-markup.ts)
 * and injected here as markup so the route-map module can reach the paths;
 * the placement classes are unchanged from the image version. Motion cites
 * `the guide leading the eye` · `routeDraw` (docs/motion/motion-grammar.md).
 *
 * Reduced motion and the breakpoint are read at mount and again whenever
 * either flips, so a visitor who changes them mid-session gets the cut.
 */

/**
 * Registers the module on a host. The host is `display: contents` and has
 * no box, so at 1440 the section's sticky span is the scroll box; on the
 * phone the map is a short cut at the section's foot, so it is measured on
 * its own — otherwise the whole draw would happen before it reached the
 * screen.
 */
function useDrawnMap(hostRef: RefObject<HTMLDivElement | null>) {
  const [reduced, setReduced] = useState(false);
  const [wide, setWide] = useState(true);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Tailwind's `lg:` — the one breakpoint the V2 file has.
    const wideQuery = window.matchMedia("(min-width: 64rem)");
    const sync = () => {
      setReduced(prefersReduced());
      setWide(wideQuery.matches);
    };
    sync();
    motion.addEventListener("change", sync);
    wideQuery.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      wideQuery.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const mobileBox = host.querySelector<HTMLElement>("[data-map='mobile']");
    // At 1440 the section is a sticky span, the shape of the D4 lab: a tall
    // container with the screen stuck inside it, so the map draws over the
    // whole time it is held rather than while it scrolls past.
    const span = host.closest<HTMLElement>("[data-sticky-span]");
    const routeModule = wide
      ? createRouteMap(host, {
          reduced,
          trigger: span ?? host.closest("section") ?? host,
          ...(span ? { start: "top top", end: "bottom bottom" } : {}),
        })
      : createRouteMap(host, {
          reduced,
          trigger: mobileBox ?? host,
          start: "top 95%",
          end: "bottom 70%",
        });
    const unregister = register(routeModule);
    start();
    return unregister;
  }, [hostRef, reduced, wide]);
}

export type RoutePin = {
  src: string;
  w: number;
  h: number;
  /** Position in the 1440 frame, in px — the frame's own layout, not a
      geographic coordinate. */
  left: number;
  top: number;
  /** Scroll progress at which the pin lights. */
  at: number;
};

/** §04 Getting here — the route map, with the stop icons as pins. */
export function RouteMap({
  desktop,
  mobile,
  pins,
}: {
  desktop: string;
  mobile: string;
  pins: readonly RoutePin[];
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  useDrawnMap(hostRef);

  return (
    <div ref={hostRef} aria-hidden className="pointer-events-none contents">
      {/* The route map (3238:34130) — 2278 × 1580, clipped to 1973 wide and
          centred at (50% − 266px, 50% + 57px) in the 1440 frame, with the
          location pin drawn in (3238:34141 / 34142). The legend icons sit
          at the frame's own coordinates (3238:34149 / 34151 / 34154 /
          34158), on the frame, not the map. */}
      <div className="pointer-events-none absolute top-0 left-1/2 hidden h-full w-[1440px] -translate-x-1/2 lg:block">
        <div
          className="absolute top-[calc(50%+57px)] left-[calc(50%-266px)] h-[1580px] w-[1973px] -translate-x-1/2 -translate-y-1/2 overflow-hidden"
          dangerouslySetInnerHTML={{ __html: desktop }}
        />
        {pins.map((pin) => (
          /* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */
          <img
            key={pin.src}
            src={pin.src}
            alt=""
            width={pin.w}
            height={pin.h}
            data-pin=""
            data-at={pin.at}
            className="absolute opacity-0 transition-opacity duration-[320ms] data-[on=true]:opacity-100"
            style={{
              left: pin.left,
              top: pin.top,
              width: pin.w,
              height: pin.h,
            }}
          />
        ))}
      </div>
      {/* The phone's cut (2576:22630 › 2576:22808) — 518 × 368 with the pin
          drawn in, centred and seated 28px past the section's foot. */}
      <div
        data-map="mobile"
        className="pointer-events-none absolute bottom-[-28px] left-1/2 h-[368px] w-[518px] max-w-none -translate-x-1/2 lg:hidden"
        dangerouslySetInnerHTML={{ __html: mobile }}
      />
    </div>
  );
}

/**
 * §02 The facts — the Queensland map. The outline surfaces out of short
 * segments starting all over it, the property is painted in, the faint
 * Australia behind draws in as a lighter ink, and the pin arrives and
 * floats.
 */
export function FactsMap({
  desktop,
  mobile,
}: {
  desktop: string;
  mobile: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  useDrawnMap(hostRef);

  return (
    <div ref={hostRef} aria-hidden className="pointer-events-none contents">
      {/* The illustrated map (2033:5376 › 3238:34073) — 1129 × 783, seated
          at x=205 y=83 in the 1440 frame, running behind the right column. */}
      <div className="pointer-events-none absolute top-0 left-1/2 hidden h-full w-[1440px] -translate-x-1/2 lg:block">
        <div
          className="absolute top-[83px] left-[205px] h-[783px] w-[1129px] max-w-none"
          dangerouslySetInnerHTML={{ __html: desktop }}
        />
      </div>
      {/* The phone's cut (2576:22001 › 2576:22115) — 506 × 359, seated over
          the frame's 240px image slot and bleeding 65px past either edge and
          27px past the foot, exactly as the frame draws it. */}
      <div
        data-map="mobile"
        className="pointer-events-none absolute bottom-[-27px] left-1/2 h-[359px] w-[506px] max-w-none -translate-x-1/2 lg:hidden"
        dangerouslySetInnerHTML={{ __html: mobile }}
      />
    </div>
  );
}
