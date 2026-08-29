"use client";

/**
 * T7 — the artwork orbit. Home hero, proposal 2 (the Danu Ventures wheel,
 * rebuilt in this brand's terms).
 *
 * A ring of card slats on a 3D wheel, seen at a slight angle on dark ground,
 * turning slowly on its own and picking up speed from the visitor's scroll.
 * The slats sit radially — paddles on a waterwheel — which is exactly how the
 * reference's dominoes read, and means no per-card counter-rotation.
 *
 * CSS 3D only: one rotationX on the wheel per frame, everything else is
 * static transforms laid out once. No WebGL, no depth-of-field. If DoF is
 * ever wanted this moves onto the scene manager (E group).
 *
 * MARKUP CONTRACT
 * ---------------
 *   [data-orbit-root]    the hero section (drives scrub + visibility pause)
 *   [data-orbit-stage]   the perspective container (gets pointer tilt, T3 ≤2°)
 *   [data-orbit-wheel]   preserve-3d wheel, rotationX driven per frame
 *   [data-orbit-card]    the slats; laid out rotateX(i·step) translateZ(r)
 *
 * ▲ ARTWORK — cards carrying Leonard Mickelo's artwork are queued for
 * sign-off (permissions.md). Until recorded, cards are photography, colour
 * fields and type — all cleared.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "@/lib/motion-controller";

gsap.registerPlugin(ScrollTrigger);

const DRIFT_DEG_PER_SEC = 5;
const SCRUB_DEG = 160;
const TILT_DEG = 2; // T3's cap.

export function createOrbit(): MotionModule {
  let ctx: gsap.Context | null = null;
  let tick: ((time: number, delta: number) => void) | null = null;

  const init = () => {
    const root = document.querySelector<HTMLElement>("[data-orbit-root]");
    const stage = root?.querySelector<HTMLElement>("[data-orbit-stage]");
    const wheel = root?.querySelector<HTMLElement>("[data-orbit-wheel]");
    if (!root || !stage || !wheel) return;

    // Slat placement is server-rendered inline style (rotate-then-translate);
    // this module only ever turns the wheel. GSAP must not touch the slats —
    // its translate-before-rotate ordering would collapse the ring.
    ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        // The wheel as a still composition — angled, present, unmoving.
        gsap.set(wheel, { rotationX: 14 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const state = { drift: 0, scroll: 0, boost: 0 };
        const setRotation = gsap.quickSetter(wheel, "rotationX", "deg") as (
          v: number,
        ) => void;

        tick = (_time, delta) => {
          state.drift += (delta / 1000) * DRIFT_DEG_PER_SEC;
          state.boost *= 0.92;
          setRotation(state.drift + state.scroll + state.boost);
        };

        // Scroll turns the wheel; velocity gives it a push that decays.
        ScrollTrigger.create({
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            state.scroll = self.progress * SCRUB_DEG;
            state.boost = gsap.utils.clamp(
              -14,
              14,
              state.boost + self.getVelocity() / 2400,
            );
          },
          // Ambient work stops the moment it is off-screen.
          onToggle: (self) => {
            if (!tick) return;
            if (self.isActive) gsap.ticker.add(tick);
            else gsap.ticker.remove(tick);
          },
        });

        // T3 — pointer influence, capped at 2°, fine pointers only.
        if (window.matchMedia("(pointer: fine)").matches) {
          const tiltY = gsap.quickTo(stage, "rotationY", {
            duration: 0.55,
            ease: "power2.out",
          });
          const onMove = (event: PointerEvent) => {
            const rect = root.getBoundingClientRect();
            const ratio = (event.clientX - rect.left) / rect.width - 0.5;
            tiltY(-18 + ratio * TILT_DEG * 2);
          };
          const onLeave = () => tiltY(-18);
          root.addEventListener("pointermove", onMove);
          root.addEventListener("pointerleave", onLeave);
          return () => {
            root.removeEventListener("pointermove", onMove);
            root.removeEventListener("pointerleave", onLeave);
            if (tick) gsap.ticker.remove(tick);
          };
        }

        return () => {
          if (tick) gsap.ticker.remove(tick);
        };
      });

    }, root);
  };

  const destroy = () => {
    if (tick) gsap.ticker.remove(tick);
    tick = null;
    ctx?.revert();
    ctx = null;
  };

  return { init, destroy };
}
