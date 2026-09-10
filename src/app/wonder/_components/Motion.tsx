"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  register,
  start,
  stop,
  watchVisibility,
} from "@/lib/motion-controller";
import {
  cardRail,
  conversion,
  factsCopy,
  gettingHereCopy,
  heroArrival,
  hostsCopy,
  itinerary,
  sleepCards,
} from "@/lib/motion/wonder";
import { wonderLandscape } from "@/lib/motion/wonder-landscape";

/**
 * /wonder — the page's motion script. Verb: ARRIVES.
 *
 * One composition per screen, each declaring its own loud channel and its
 * span in vh. Renders nothing. The plan it implements is
 * docs/motion/wonder-plan.md (9 September 2026, user direction).
 *
 * THE SCENE LEDGER, in order, so the pacing reads here as well as in the plan:
 *
 *   §01 hero          media       100vh   the film, and the title rising
 *   §02 facts         media       320vh   the Queensland map draws · copy in tiers
 *   §03 highlights    media       100vh   the card rail opens
 *   §04 getting here  media       300vh   the route map draws in stages
 *   §05 turraburra    media       180vh   landscape + copy hold, mouse tilt and drift
 *   §06 itinerary     transition  ~720vh  six viewport-aligned automatic stops
 *   §07 before        none        100vh   the hold, and one beat on the CTA
 *   §08 sleep         media       120vh   two frames open, shallow parallax
 *   §09 out here      media       180vh   same landscape + copy hold and mouse drift
 *   §10 hosts         none        100vh   the copy arrives, the faces hold
 *   §11 stories       media       100vh   the card rail again, quieter
 *   §12 close         none        100vh   the second CTA, quietest of all
 *
 * No channel runs three deep, and the two quiet screens (§07, §10) sit either
 * side of the page's loudest run rather than at the end where they would read
 * as the page giving up.
 *
 * THE TWO MAPS ARE NOT HERE. §02 and §04 draw themselves through
 * src/lib/motion/route-map.ts, mounted by their own components (FactsMap /
 * RouteMap) because they own inlined SVG. What this file adds on those two
 * screens is the copy beside them.
 *
 * Waits for fonts before building, for the same reason every other page does:
 * `settle` splits headings into lines and measures them, and the brand faces
 * arrive late.
 */
export function WonderMotion() {
  useEffect(() => {
    let disposed = false;
    const unregister: Array<() => void> = [];

    const build = () => {
      if (disposed) return;
      const find = (name: string) =>
        document.querySelector<HTMLElement>(`[data-wonder="${name}"]`);

      const wire = (
        name: string,
        make: (el: HTMLElement) => ReturnType<typeof heroArrival>,
      ) => {
        const el = find(name);
        if (el) unregister.push(register(make(el)));
      };

      wire("hero", (el) => heroArrival(el, 100));
      wire("facts", (el) => factsCopy(el, 320));
      wire("highlights", (el) => cardRail(el, 100));
      wire("getting-here", (el) => gettingHereCopy(el, 180));
      wire("country", wonderLandscape);
      wire("itinerary", (el) => itinerary(el));
      wire("before", (el) => conversion(el, 100));
      wire("sleep", (el) => sleepCards(el, 120));
      wire("out-here", wonderLandscape);
      wire("hosts", (el) => hostsCopy(el, 100));
      wire("stories", (el) => cardRail(el, 100));
      wire("close", (el) => conversion(el, 100));

      start();

      // MEASURE AGAIN EVERY TIME THE DOCUMENT CHANGES HEIGHT.
      // Triggers are built as soon as the fonts are in, which on this page is
      // long before the last photograph has decoded. Anything that grows
      // after that leaves every trigger below it measured against a layout
      // that no longer exists. The restored itinerary also changes height
      // whenever a disclosure opens. A `load` listener is not enough on its
      // own: images below the fold arrive later still.
      //
      // Debounced, and cheap: a refresh does not change the document's
      // height, so this cannot feed itself.
      heightWatch = new ResizeObserver(refreshSoon);
      heightWatch.observe(document.body);
      refreshSoon();
    };

    let refreshTimer = 0;
    let heightWatch: ResizeObserver | undefined;
    const refreshSoon = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 220);
    };

    if (document.fonts?.status === "loaded") build();
    else void document.fonts?.ready.then(build);

    const unwatch = watchVisibility();
    return () => {
      disposed = true;
      heightWatch?.disconnect();
      window.clearTimeout(refreshTimer);
      unwatch();
      unregister.forEach((fn) => fn());
      stop();
    };
  }, []);

  return null;
}
