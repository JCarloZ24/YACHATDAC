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

/** F7/F8, SCR-12. Stable wrappers measure scroll; whole linked cards move. */
export function createRecordMasonry(root: HTMLElement, hooks: MasonryHooks = {}): MotionModule {
  const {
    tile: tileHook = "[data-record-tile]", card: cardHook = "[data-record-card]",
    rates = [0.06, 0.14, 0.09, 0.18], enter, endAtRootFoot = false,
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
          const animation = gsap.effects.recordMasonryPass(card, { travel: () => travel(tile) }) as gsap.core.Timeline;
          gsap.set(card, { opacity: 1 });
          const setOpacity = gsap.quickSetter(card, "opacity");
          let cardHeight = card.offsetHeight;
          // Different entrances/exits per card, measured in viewport height.
          // Cache layout on refresh; scroll frames only read scroll/transform.
          const enterSpan = [0.18, 0.27, 0.22, 0.32][index % 4];
          const leaveSpan = [0.25, 0.17, 0.30, 0.21][index % 4];
          const smooth = (value: number) => {
            const t = gsap.utils.clamp(0, 1, value);
            return t * t * (3 - 2 * t);
          };
          const update = (self: ScrollTrigger) => {
            const viewport = window.innerHeight;
            const y = Number(gsap.getProperty(card, "y")) || 0;
            const top = self.start + viewport - self.scroll() + y;
            const bottom = top + cardHeight;
            // User timing correction: delay entry until the card is 12vh
            // inside the bottom edge; finish exit 14vh before the top edge.
            const entering = enter
              ? smooth((viewport * enter[0] - top) / (viewport * (enter[0] - enter[1])))
              : smooth((viewport * 0.88 - top) / Math.min(cardHeight * 0.65, viewport * enterSpan));
            const leaving = smooth((bottom - viewport * 0.14) / Math.min(cardHeight * 0.65, viewport * leaveSpan));
            setOpacity(Math.min(entering, leaving));
          };
          // "bottom top" in scroll units, clamped to the root's hold when asked.
          // Measured on refresh, when ScrollTrigger has reverted any pin.
          const end = () => {
            const natural = tile.getBoundingClientRect().top + window.scrollY + tile.offsetHeight;
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
