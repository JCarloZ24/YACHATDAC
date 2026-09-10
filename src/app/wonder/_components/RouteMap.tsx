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
    // BUILT LATE, ON PURPOSE. Registering here runs `init()` at once, and
    // init() samples every route path — the single most expensive thing on
    // the page. Measured 9 Sep 2026 on a production build, with both maps
    // building on mount it held the main thread for 6.5s (desktop) and 13s
    // (phone) from ~400ms in, so nothing else could run: the hero film's
    // first byte was not even requested until 6.6s / 12.5s.
    //
    // Nothing here is needed until the map is approaching the screen, so the
    // build waits for that (a viewport and a half out, which at Wonder's
    // scroll rate is many seconds of warning) and then for an idle moment.
    // `start()` still runs immediately — it is cheap, other modules want it,
    // and once started `register()` inits the moment it is finally called.
    start();
    const box =
      span ?? host.closest("section") ?? mobileBox ?? (host as Element);
    let unregister: (() => void) | null = null;
    let cancelPending: (() => void) | null = null;
    const build = () => {
      cancelPending = null;
      if (!unregister) unregister = register(routeModule);
    };
    // Safari has no requestIdleCallback; a timeout carries the same intent.
    const idle = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        const ric = idle.requestIdleCallback;
        const cic = idle.cancelIdleCallback;
        if (ric && cic) {
          const id = ric(build, { timeout: 1200 });
          cancelPending = () => cic(id);
        } else {
          const id = window.setTimeout(build, 0);
          cancelPending = () => window.clearTimeout(id);
        }
      },
      { rootMargin: "150% 0px" },
    );
    observer.observe(box);
    return () => {
      observer.disconnect();
      cancelPending?.();
      unregister?.();
    };
  }, [hostRef, reduced, wide]);
}

export type RoutePin = {
  src: string;
  w: number;
  h: number;
  /**
   * Position as a PERCENTAGE OF THE MAP BOX — the 1973 × 1580 artwork, not
   * the 1440 frame and not the viewport. A layout position inside one
   * drawing, never a geographic coordinate.
   *
   * They were the frame's own pixel offsets until 9 Sep 2026. That worked at
   * exactly 1440 and nowhere else: the pins are children of the map layer, so
   * the moment that layer stopped being a fixed 1440-wide box they would have
   * drifted off the roads they mark. Percentages of the artwork hold at every
   * width, which is how the D4 lab positions its waypoints too.
   */
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
  mobilePins,
}: {
  desktop: string;
  mobile: string;
  pins: readonly RoutePin[];
  /**
   * The same four stops again, at their percentages of the PHONE crop, which
   * is a different window on the same drawing and so a different set of
   * numbers. Sized as a percentage too — the frame draws them at 12–14px in a
   * 343 box, and a fixed pixel size would shrink against the map on a wider
   * phone.
   */
  mobilePins: readonly RoutePin[];
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
      {/* THE 1920 CROP, fixed 9 Sep 2026 on user report.
          The layer was a fixed 1440-wide box holding the artwork inside a
          1973 × 1580 window with `overflow-hidden`. At exactly 1440 that
          window's right edge landed on the viewport edge, so the crop was
          invisible and the map read as full-bleed. At any wider width the
          same edge moved inside the screen and the map ended mid-road with
          bare charcoal beyond it.
          The window is gone. The artwork now sits at its own 2278 × 1580 and
          the VIEWPORT does the cropping, which is what the frame's edge was
          standing in for all along. At 1440 the render is unchanged — the
          extra 305px of drawing falls outside the screen exactly where the
          old window cut it — and at 1920 the roads simply carry on. */}
      <div className="pointer-events-none absolute top-0 left-0 hidden h-full w-full overflow-hidden lg:block">
        {/* THE FRAME'S OWN GEOMETRY, re-verified against the node on
            10 Sep 2026 and restored after a 75% scale was tried and was
            wrong (August: "the map's position is off compared to wireframe").
            Read off 2033:5572, a 1440 × 900 frame: Frame 15406 (3238:34160)
            sits at (−533, −283) and holds the 2277.93 × 1580 artwork at its
            origin, so these two calc()s ARE those two numbers —
            720 − 1252.5 = −532.5 and 450 − 790 + 57 = −283. Change either and
            the roads leave the legend icons behind, because those are laid on
            the frame (3238:34149 / 34151 / 34154 / 34158) and not on the map.

            The scrolling complaint that prompted the scale is answered where
            it actually lived: the span is 180vh, not 300, and the pins light
            at 0.50–0.68 rather than 0.76–0.91. */}
        <div className="absolute top-[calc(50%+57px)] left-[calc(50%-1252.5px)] h-[1580px] w-[2278px] -translate-y-1/2">
          <div
            className="absolute inset-0"
            dangerouslySetInnerHTML={{ __html: desktop }}
          />
          {/* Inside the map box, so a pin holds its place on the road it
              marks at every width. */}
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
              className="absolute -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-[320ms] data-[on=true]:opacity-100"
              style={{
                left: `${pin.left}%`,
                top: `${pin.top}%`,
                width: pin.w,
                height: pin.h,
              }}
            />
          ))}
        </div>
      </div>
      {/* The phone's cut, re-cropped 9 Sep 2026 (August). It was a separate
          518 × 368 export stretched by `preserveAspectRatio="none"`; the
          supplied replacement is THE SAME ARTWORK as the desktop file at
          44.47% with the window moved — verified on three paths, the scale
          agreeing on both axes to five decimals and the third predicting to
          0.002 — so getting-here-map-mobile.svg is now that file under the
          supplied viewBox (1284.02 425.01 762.30 771.31) rather than a second
          drawing. Same roads, same stop icons, same `routeDraw` tags.

          Sized by ASPECT, not by a fixed box, so the crop can never be
          squashed again; the id prefix (`ghm-`) keeps it off the desktop
          copy's ids. */}
      <div
        data-map="mobile"
        className="pointer-events-none absolute inset-x-5 bottom-0 aspect-square lg:hidden"
      >
        <div
          className="absolute inset-0"
          dangerouslySetInnerHTML={{ __html: mobile }}
        />
        {/* THE FOUR STOPS, which the phone map did not have. They are not in
            the drawing — neither cut of the artwork contains them (checked:
            no icon colours in either file's fills) — they are laid on the
            frame, exactly as at 1440. Frame 15423 carries them as vectors
            3439:30185/30186/30190/30192; their centres are converted to
            percentages of the 343 box so they hold their place on the roads
            at any width.

            WHICH ICON IS WHICH is cross-checked three ways and agrees on all
            four: the frame's relative positions, August's reference render,
            and the desktop map's own coordinates — lake highest, sculpture
            leftmost, gorge lowest, gray rock rightmost. */}
        {mobilePins.map((pin) => (
          /* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */
          <img
            key={pin.src}
            src={pin.src}
            alt=""
            width={pin.w}
            height={pin.h}
            data-pin=""
            data-at={pin.at}
            className="absolute h-auto -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-[320ms] data-[on=true]:opacity-100"
            style={{
              left: `${pin.left}%`,
              top: `${pin.top}%`,
              width: `${pin.w}%`,
              height: "auto",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * §02 The facts — the Queensland map. The outline surfaces out of short
 * segments starting all over it, the property is painted in, the faint
 * Australia behind draws in as a lighter ink, and the pin arrives and
 * floats.
 */
export function FactsMap({ markup }: { markup: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  useDrawnMap(hostRef);

  return (
    <div ref={hostRef} aria-hidden className="pointer-events-none contents">
      {/* ONE MAP, BOTH BREAKPOINTS (9 Sep 2026, August). The phone used to get
          its own cut, facts-map-mobile.svg, and it was the wrong shape and the
          wrong colours — `preserveAspectRatio="none"` in a 506 × 359 box
          squashed the state narrow, and it painted the property #AF231C with a
          #FBAE3D pin against the desktop cut's #C23D31 and #D97804. Two maps of
          one place that did not match each other.

          facts-map.svg now carries the crop August supplied (the same artwork
          at 50.83% with the window moved, verified against five paths, applied
          as a viewBox) and it is correct at any size, so a single instance is
          rendered here and only its BOX changes at the breakpoint. One inlined
          SVG, one set of draw tags, one id prefix — rendering it twice would
          double both the markup and the path sampling that `routeDraw` does.

          The layout mirrors the section's own — the wrapper's `px-5 lg:px-16`,
          the 1280 container, the row's `lg:gap-20`, two equal columns — so the
          map tracks the copy at every width rather than being pinned at 1440
          offsets. `wonder-plan.md` §04 calls the fixed-offset version a bug
          rather than a taste question. */}
      {/* WHERE THE MAP SITS (corrected 9 Sep 2026, user report: "fix the map").
          It was laid out as the right-hand column's 600 × 640 image slot, and
          the artwork does not fit that box: the drawing is 1128.88 × 783 —
          Queensland on its right, a pale Australia stretching away to its left
          — and the hi-fi places that whole group at (205.33, 83) in the 1440
          frame, running along BEHIND the copy. Cropped into the column, all
          that survived was the state and a stub of coastline.

          So at 1440 the map is a layer across the whole screen at the frame's
          own proportions: 205.33/1440 from the left, 83/900 down, 1128.88 wide.
          It is `aria-hidden` and `pointer-events-none`, and it is painted
          before the copy, so the ghost outline passes behind the words exactly
          as the frame draws it.

          The phone keeps August's crop — the same file, windowed to
          `446.59 0 682.66 637.42` — but in CSS rather than in the file's own
          viewBox, so one SVG serves both. The numbers below are that window
          expressed against its own box: 1128.88/682.66 wide, 783/637.42 tall,
          pulled left by 446.59/682.66. */}
      <div className="pointer-events-none absolute inset-0">
        <div
          data-map="mobile"
          className="absolute bottom-0 left-5 aspect-[347/324] w-[calc(100%-2.5rem)] overflow-hidden lg:inset-auto lg:top-[9.22%] lg:left-[14.26%] lg:aspect-[1128.88/783] lg:w-[78.39%] lg:overflow-visible"
        >
          <div
            className="absolute top-0 left-[-65.42%] h-[122.84%] w-[165.36%] lg:left-0 lg:h-full lg:w-full"
            dangerouslySetInnerHTML={{ __html: markup }}
          />
        </div>
      </div>
    </div>
  );
}
