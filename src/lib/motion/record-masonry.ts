"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "../motion-controller";
import { registerRecordMasonry } from "./effects/record-masonry";

/**
 * Which elements the pass measures and which it moves. The Record's
 * defaults are the catalogue's own hooks; /wonder passes its rail hooks
 * (14 September 2026, user direction: one card entrance across the pages,
 * The Record's). The TILE must be an element GSAP never transforms — the
 * trigger is measured against it on every refresh — and the CARD the whole
 * linked plate inside it.
 */
export type MasonryHooks = {
  tile?: string;
  card?: string;
  /**
   * Per-column y travel as a fraction of the viewport, cycled by column.
   * The Record's 6/14/9/18vh is a drift under a reading eye; /wonder's rail
   * asks for more because its plates are 500px tall and three across.
   */
  rates?: number[];
  /**
   * Where the fade-in runs, as fractions of the viewport height the card's
   * TOP crosses: `[start, end]`. Absent, the Record's own rule applies —
   * entry from 12vh inside the bottom edge over 17–32vh, capped at 65% of
   * the card. /wonder passes `[0.88, 0.42]` (14 Sep 2026, user report: "the
   * animation is done before I got to scroll there") so the card is still
   * arriving as it reaches the middle of the screen.
   */
  enter?: [number, number];
  /** Wonder's rails settle into their slots and remain readable on exit.
   * Transform and opacity share one clock, including rapid reversals. */
  entranceOnly?: boolean;
  /**
   * End every tile's pass no later than the moment the ROOT's foot meets
   * the viewport's foot. For a rail that then HOLDS there (Wonder's From
   * Country under `holdAtFoot`, 14 September 2026): the pass reads scroll,
   * not the screen, so through a pin it would go on drifting and fading
   * cards that are visibly standing still — the held row went blank. Ending
   * at the hold leaves each card where the reader last saw it.
   */
  endAtRootFoot?: boolean;
};

/**
 * SCR-12's opacity rule, on its own so a page that cannot host the module can
 * still run the card entrance.
 *
 * `createRecordMasonry` derives a card's screen position from its own
 * ScrollTrigger. /our-people cannot: it is one pinned stage whose HTML track is
 * translated by a reading clock, so a card's screen top is `box.top - travel`
 * and there is no per-card trigger to ask. The RULE is what the pages share —
 * Marc's review, 14 September 2026, asked for The Record's card entrance on
 * /our-people — so the numbers live here once and both callers read them.
 *
 * Takes a card's screen box and returns its opacity: it fades up once its top
 * is 12vh inside the bottom edge and fades out as its foot reaches 14vh from
 * the crown, smoothstepped, over a span that differs per card so a row does not
 * arrive as one block. `enter` overrides the entry window in viewport
 * fractions; /wonder passes its own.
 */
export function cardPassOpacity(
  { top, height, viewport, index, enter }:
  { top: number; height: number; viewport: number; index: number; enter?: [number, number] },
): number {
  const smooth = (value: number) => {
    const t = gsap.utils.clamp(0, 1, value);
    return t * t * (3 - 2 * t);
  };
  const enterSpan = [0.18, 0.27, 0.22, 0.32][index % 4];
  const leaveSpan = [0.25, 0.17, 0.30, 0.21][index % 4];
  const entering = enter
    ? smooth((viewport * enter[0] - top) / (viewport * (enter[0] - enter[1])))
    : smooth((viewport * 0.88 - top) / Math.min(height * 0.65, viewport * enterSpan));
  const leaving = smooth((top + height - viewport * 0.14) / Math.min(height * 0.65, viewport * leaveSpan));
  return Math.min(entering, leaving);
}

/** F7/F8, SCR-12. Stable wrappers measure scroll; whole linked cards move. */
export function createRecordMasonry(root: HTMLElement, hooks: MasonryHooks = {}): MotionModule {
  const {
    tile: tileHook = "[data-record-tile]", card: cardHook = "[data-record-card]",
    rates = [0.06, 0.14, 0.09, 0.18], enter, endAtRootFoot = false, entranceOnly = false,
  } = hooks;
  let cleanup: (() => void) | undefined;
  return {
    init() {
      cleanup?.();
      registerRecordMasonry();
      const media = gsap.matchMedia();
      media.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 1024px)" }, (context) => {
        if (!context.conditions?.motion) return;
        const tiles = Array.from(root.querySelectorAll<HTMLElement>(tileHook));
        // CSS columns can rebalance after fonts load; measure their actual
        // positions on refresh instead of assuming DOM index equals column.
        const travel = (tile: HTMLElement) => {
          if (!context.conditions?.desktop) return 0;
          const columns = [...new Set(tiles.map((entry) => Math.round(entry.offsetLeft)))].sort((a, b) => a - b);
          const column = columns.indexOf(Math.round(tile.offsetLeft));
          return window.innerHeight * rates[Math.max(0, column) % rates.length];
        };
        tiles.forEach((tile, index) => {
          const card = tile.querySelector<HTMLElement>(cardHook);
          if (!card) return;
          const animation = gsap.effects.recordMasonryPass(card, { travel: () => travel(tile), entranceOnly }) as gsap.core.Timeline;
          if (!entranceOnly) gsap.set(card, { opacity: 1 });
          const setOpacity = gsap.quickSetter(card, "opacity");
          let cardHeight = card.offsetHeight;
          // Different entrances/exits per card, measured in viewport height.
          // Cache layout on refresh; scroll frames only read scroll/transform.
          // The rule itself is `cardPassOpacity` above — /our-people runs the
          // same numbers off its reading clock (Marc, 14 September 2026).
          const update = (self: ScrollTrigger) => {
            if (entranceOnly) return;
            const viewport = window.innerHeight;
            const y = Number(gsap.getProperty(card, "y")) || 0;
            const scroll = endAtRootFoot ? Math.min(self.scroll(), self.end) : self.scroll();
            const top = self.start + viewport - scroll + y;
            setOpacity(cardPassOpacity({ top, height: cardHeight, viewport, index, enter }));
          };
          // End at the entrance's resting point or the full card passage,
          // clamped to the root's hold when asked.
          // Measured on refresh, when ScrollTrigger has reverted any pin.
          const end = () => {
            const top = tile.getBoundingClientRect().top + window.scrollY;
            const natural = entranceOnly
              ? top - window.innerHeight * (enter?.[1] ?? 0.42)
              : top + tile.offsetHeight;
            if (!endAtRootFoot) return natural;
            const hold = root.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
            return Math.min(natural, hold);
          };
          // ⚠ `pinnedContainer` WHEN THE ROOT IS HELD. A refresh that lands
          // mid-hold (the page reloads with its scroll restored; a photograph
          // decodes) would otherwise measure the tile while the section is
          // position:fixed and put the pass a screen late — the row arrived
          // blank and stayed so. Naming the container makes ScrollTrigger
          // revert that pin before it measures. It only looks at triggers
          // created EARLIER, so the hold must be registered before the pass.
          const trigger = ScrollTrigger.create({ trigger: tile, start: "top bottom", end,
            pinnedContainer: endAtRootFoot ? root : undefined,
            animation, scrub: 0.45, invalidateOnRefresh: true,
            onUpdate: update,
            onRefresh: (self) => { cardHeight = card.offsetHeight; update(self); },
          });
          animation.eventCallback("onUpdate", () => update(trigger));
          update(trigger);
        });
      }, root);
      cleanup = () => media.revert();
    },
    destroy() { cleanup?.(); cleanup = undefined; },
  };
}
