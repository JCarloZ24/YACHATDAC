"use client";

import gsap from "gsap";
import { DUR, EASE } from "../tokens";

/**
 * Grammar: "the world opening", disclose (D5/F7, 9 September 2026).
 * Wonder's restored accordion, requested by August. Layout is measured once
 * by the owning module. Only clip, opacity and transforms change per frame;
 * the picture has no tween. This builder owns no listeners or DOM state.
 */
export function registerDisclosure(): void {
  /** The effects-lab treatments, composed for one itinerary stop. Whole lines
      rise, and the copy blocks and the photograph arrive together.

      10 September 2026, August's direction: the picture no longer opens on
      its own clip (`frameOpen`, edge right, 0.08) but takes the copy's
      entrance — same row, same 16px rise and fade, same ease, started at the
      same 0.16 — so a stop reads as one thing arriving rather than two. The
      photograph is still held: `arrive` moves the frame, never the image
      plane, so the `frame` grade on the slot is intact. */
  gsap.registerEffect({
    name: "stageArrival",
    extendTimeline: true,
    defaults: {},
    effect: (targets: object) => {
      const stage = gsap.utils.toArray<HTMLElement>(targets)[0];
      const title = stage.querySelector<HTMLElement>("[data-stage-title]");
      const copy = stage.querySelector<HTMLElement>("[data-stage-copy]");
      const picture = stage.querySelector<HTMLElement>("[data-stage-picture]");
      const tl = gsap.timeline();
      if (title) tl.settle(title, { duration: DUR.medium }, 0);
      if (copy) tl.arrive(Array.from(copy.children), { stagger: 0.09 }, 0.16);
      if (picture) tl.arrive(picture, {}, 0.16);
      return tl;
    },
  });

  /** Grammar: "the world opening", viewport-aligned disclose variant.
      The module has already changed native open state and measured the rows.
      Only row transforms animate; the arrival effects treat the photo as held. */
  gsap.registerEffect({
    name: "itineraryStep",
    extendTimeline: true,
    defaults: { duration: DUR.large, ease: EASE.country },
    effect: (targets: object, config: Record<string, unknown>) => {
      const rows = config.rows as HTMLElement[];
      const offsets = config.offsets as number[];
      const tl = gsap.timeline();
      tl.fromTo(rows, { y: (i) => offsets[i] }, {
        y: 0, duration: config.duration as number,
        ease: config.ease as string, clearProps: "transform",
      }, 0);
      tl.stageArrival(targets, {}, 0.1);
      return tl;
    },
  });

  gsap.registerEffect({
    name: "disclose",
    extendTimeline: true,
    defaults: { duration: DUR.medium, ease: EASE.country, open: true },
    effect: (targets: object, config: Record<string, unknown>) => {
      const details = gsap.utils.toArray<HTMLElement>(targets)[0];
      const panel = details.querySelector<HTMLElement>("[data-stage-panel]");
      const chevron = details.querySelector<HTMLElement>("[data-stage-chevron]");
      const copy = details.querySelector<HTMLElement>("[data-stage-copy]");
      const following = config.following as HTMLElement[];
      const offsets = config.offsets as number[];
      const open = config.open as boolean;
      const duration = config.duration as number;
      const ease = config.ease as string;
      const tl = gsap.timeline();

      if (following.length) {
        tl.fromTo(following, { y: (i) => offsets[i] }, {
          y: 0, duration, ease, clearProps: "transform",
        }, 0);
      }
      if (panel) {
        tl.fromTo(panel,
          { clipPath: open ? "inset(0 0 100% 0)" : "inset(0 0 0% 0)" },
          { clipPath: open ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)", duration, ease },
          0,
        );
      }
      if (copy) {
        tl.fromTo(copy, { opacity: open ? 0 : 1 }, {
          opacity: open ? 1 : 0, duration: DUR.small, ease: EASE.quiet,
        }, open ? 0.12 : 0);
      }
      if (chevron) {
        // Tailwind uses the independent rotate property. Counter-rotate the
        // native open glyph with GSAP's transform, then clear at completion.
        tl.fromTo(chevron, { rotation: open ? 180 : 0 }, {
          rotation: open ? 0 : 180, duration: DUR.small, ease: EASE.quiet,
        }, 0);
      }
      return tl;
    },
  });
}
