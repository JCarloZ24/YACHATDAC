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
  conversion,
  factsCopy,
  gettingHereCopy,
  heroArrival,
  hostsCopy,
  itinerary,
  holdAtFoot,
  outHereTrack,
  sleepCards,
} from "@/lib/motion/wonder";
import { wonderLandscape } from "@/lib/motion/wonder-landscape";
import { createWaveRoll } from "@/lib/motion/wave-roll";
import { createRecordMasonry } from "@/lib/motion/record-masonry";
import { createCardPop } from "@/lib/motion/card-pop";
import { createStayMarquee } from "@/lib/motion/stay-marquee";

/**
 * §03 and §11 take The Record's card entrance (14 September 2026, user
 * direction: one card entrance across the pages, "the record style"). It is
 * the same module the catalogue runs — `recordMasonryPass`, grammar row
 * "being drawn in" / SCR-12 — pointed at the rail's own hooks: the tile
 * wrapper is measured, the whole `[data-card]` drifts and fades. Not a
 * composition: the pass is scrubbed, per card, and has no timeline of its
 * own to declare a channel on; the section's loud channel stays media.
 */
const RAIL_HOOKS = {
  tile: "[data-card-tile]",
  card: "[data-card]",
  // Louder than the catalogue's, on purpose (14 Sep 2026, user report: the
  // entrance had played before the section was reached). The Record's 6–18vh
  // drift and a fade that finishes in the bottom third suit a column of
  // small cards under a reading eye; three 500px plates in a row need the
  // fade to run up to mid-screen and a drift you can see.
  //
  // ⚠ ONE RATE, NOT ONE PER COLUMN (same day, user direction: "the cards
  // should align perfectly"). The catalogue's opposing column rates are the
  // point of a masonry; on a rail of three equal plates they put the row out
  // of line for the whole passage, which reads as broken layout, not motion.
  // Every column travels 16vh together, so the row is level at every scroll.
  rates: [0.16],
  enter: [0.88, 0.42] as [number, number],
};

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
 *                                            · the canvas crest rolls up over the film
 *   §03 highlights    media       —       the cards pass, The Record's way (scrubbed)
 *   §04 getting here  media       300vh   the route map draws in stages
 *   §05 turraburra    media       180vh   landscape + copy hold, mouse tilt and drift
 *   §06 itinerary     transition  —       the manual accordion, day 1 open; entrances only; holds at its foot under §07 (14 Sep 2026)
 *   §07 before        none        100vh   the hold, and one beat on the CTA
 *   §08 sleep         media       120vh   the copy enters; the carousel advances itself
 *   §09 out here      type        450vh   the landscape seats, then five conditions
 *                                         step one per 70vh of scroll
 *   §10 hosts         none        100vh   the copy arrives, the faces hold
 *   §11 stories       media       —       the same pass again; holds at its foot under §12
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
      // The canvas crest rising over the film — About's wave motion on this
      // one seam, scrubbed across §02's approach. Registered SEPARATELY from
      // factsCopy rather than folded into it: the wave is the join between
      // §01 and §02 and belongs to neither section's composition, and §02's
      // loud channel is already the map. Grammar: "a change of ground",
      // Record wave / SCR-11.
      wire("facts", (el) => createWaveRoll(el, "wonder-wave"));
      // EVERY OTHER SEAM ROLLS TOO (14 September 2026, user direction: the
      // waves that were still static on the flat sections move). Same cut,
      // same grammar row, one module per seam, scrubbed across each
      // section's own approach — the join still belongs to neither
      // section's composition and claims no channel. The mirrored waves
      // (getting-here, close) roll the other way, which the WaveDivider note
      // records; on a seam the reader crosses once that reads as water
      // coming from the thick end, not as a defect. Stories' wave is
      // `hidden sm:block`; on the phone the query finds no ink and the
      // module does nothing, which is the intended static join there.
      wire("getting-here", (el) => createWaveRoll(el, "wonder-wave-getting-here"));
      wire("before", (el) => createWaveRoll(el, "wonder-wave-before"));
      wire("hosts", (el) => createWaveRoll(el, "wonder-wave-hosts"));
      wire("stories", (el) => createWaveRoll(el, "wonder-wave-stories"));
      wire("close", (el) => createWaveRoll(el, "wonder-wave-close"));
      // Where you stay opens with a DRIP, not a divider; it rolls the same way
      // (14 Sep 2026, user report: "where you stay wave is not moving").
      wire("sleep", (el) => createWaveRoll(el, "wonder-wave-sleep"));
      wire("highlights", (el) => createRecordMasonry(el, RAIL_HOOKS));
      // The cards pop 3% under a fine pointer — on the inner wrapper, so
      // the masonry keeps the card's own transform. Grammar: "pops", Wonder
      // rail card (14 Sep 2026).
      wire("highlights", (el) => createCardPop(el));
      wire("getting-here", (el) => gettingHereCopy(el, 180));
      wire("country", wonderLandscape);
      wire("itinerary", (el) => itinerary(el));
      // The itinerary holds at its foot while §07 rides up over it, wave
      // first — the hero → facts read, at the page's far end (14 Sep 2026).
      wire("itinerary", (el) => holdAtFoot(el));
      // From Country holds under Take it with you — the same hold, same day
      // (user direction: "use the same motion on Take it with you section").
      // NOT on Take it with you itself: the footer does not ride over it
      // (user direction, same day, "do not make the footer overlap").
      wire("stories", (el) => holdAtFoot(el)); // BEFORE the stories pass — see record-masonry.ts
      wire("before", (el) => conversion(el, 100));
      wire("sleep", (el) => sleepCards(el, 120));
      // The accommodation carousel advances on its own, one card every few
      // seconds, and pauses for the reader. It drives the rail's own
      // scroller, so nothing about the rail changed. Grammar: "what drifts",
      // Where you stay rail (14 Sep 2026).
      wire("sleep", (el) => createStayMarquee(el));
      // Two modules on one scene, and the ORDER matters for the first frame:
      // the track stacks the list, and wonderLandscape then measures a screen
      // that fits the viewport and engages its sticky hold. Wired the other
      // way round the first measurement sees five points in flow, decides the
      // content is too tall to hold, and waits for the ResizeObserver to
      // correct it.
      wire("out-here-track", (el) => outHereTrack(el));
      wire("out-here", wonderLandscape);
      wire("hosts", (el) => hostsCopy(el, 100));
      // `endAtRootFoot`: From Country holds under §12, and the pass must not
      // keep fading the held row (see record-masonry.ts).
      wire("stories", (el) => createRecordMasonry(el, { ...RAIL_HOOKS, endAtRootFoot: true }));
      wire("stories", (el) => createCardPop(el));
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
