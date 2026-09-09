"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "../motion-controller";
import { registerRecordMasonry } from "./effects/record-masonry";

/** F7/F8, SCR-12. Stable wrappers measure scroll; whole linked cards move. */
export function createRecordMasonry(root: HTMLElement): MotionModule {
  let cleanup: (() => void) | undefined;
  return {
    init() {
      cleanup?.();
      registerRecordMasonry();
      const media = gsap.matchMedia();
      media.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 1024px)" }, (context) => {
        if (!context.conditions?.motion) return;
        const tiles = Array.from(root.querySelectorAll<HTMLElement>("[data-record-tile]"));
        const rates = [0.06, 0.14, 0.09, 0.18];
        // CSS columns can rebalance after fonts load; measure their actual
        // positions on refresh instead of assuming DOM index equals column.
        const travel = (tile: HTMLElement) => {
          if (!context.conditions?.desktop) return 0;
          const columns = [...new Set(tiles.map((entry) => Math.round(entry.offsetLeft)))].sort((a, b) => a - b);
          const column = columns.indexOf(Math.round(tile.offsetLeft));
          return window.innerHeight * rates[Math.max(0, column) % rates.length];
        };
        tiles.forEach((tile, index) => {
          const card = tile.querySelector<HTMLElement>("[data-record-card]");
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
            const entering = smooth((viewport * 0.88 - top) / Math.min(cardHeight * 0.65, viewport * enterSpan));
            const leaving = smooth((bottom - viewport * 0.14) / Math.min(cardHeight * 0.65, viewport * leaveSpan));
            setOpacity(Math.min(entering, leaving));
          };
          const trigger = ScrollTrigger.create({ trigger: tile, start: "top bottom", end: "bottom top",
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
