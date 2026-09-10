"use client";

import gsap from "gsap";

/**
 * Grammar: the waterline, click cut / user direction 10 September 2026.
 *
 * A click lands like a drop. One gold ring blooms from the point of contact
 * and fades — the same water the CONNECT blob and the nav links fill with, so
 * a click reads as the same substance arriving rather than a new idea.
 *
 * ⚠ WHY THE PAGE ANSWERS AND NOT THE POINTER. The obvious build is a pressed
 * state on the cursor itself, `:active { cursor: … }`. It does not work:
 * browsers latch the cursor image for the duration of a press and never
 * repaint it between mousedown and mouseup. Measured on 10 September 2026 —
 * the computed cursor is byte-identical held and released. So the feedback has
 * to come from the page, and a mark at the click point is also the honest
 * place for it: it says where the click landed, which a cursor change cannot.
 *
 * It does NOT follow the pointer. A follower has to chase the mouse every
 * frame and always trails it; this is one shot at fixed coordinates, so it
 * cannot lag by construction.
 */
export function registerPointer() {
  gsap.registerEffect({
    name: "clickBloom",
    extendTimeline: true,
    defaults: { size: 84 },
    effect: (targets: gsap.TweenTarget, config: { size: number }) =>
      gsap.timeline().fromTo(
        targets,
        { width: 0, height: 0, opacity: 0.55, borderWidth: 2 },
        {
          width: config.size,
          height: config.size,
          opacity: 0,
          // The ring thins as it grows, the way a ripple loses its edge.
          borderWidth: 0.5,
          duration: 0.5,
          ease: "power2.out",
        },
      ),
  });
}
