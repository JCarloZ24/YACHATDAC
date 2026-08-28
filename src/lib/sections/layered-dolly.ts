"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "@/lib/motion-controller";

/**
 * D1 — Layered dolly. "3–5 planes at fixed z inside `perspective`, one camera
 * transform on the parent." Status: build.
 *
 * ⚠ TIER 1, AND OVER F4's BUDGET. PENDING DECISION D9.
 * A2 and M2 already spend the two allowed signature moments; the Invitation
 * grid is a third and this is a fourth. All the over-budget ones are flagged
 * on their section element with `data-tier1-exception="D9"` so they can be
 * found and switched off in one grep. They do not ship unapproved.
 *
 * Applied behind the Living Work beat's M2 frame, so the frame opens onto a
 * scene with depth rather than onto a flat field.
 *
 * ONE CAMERA, NOT THREE ANIMATIONS
 * --------------------------------
 * The planes never animate. They are placed once at fixed z and then the
 * parent — the camera — is the only thing that moves. That is what makes it
 * read as a dolly rather than as three layers sliding at different speeds, and
 * it is also why the per-frame cost is a single transform on one element.
 *
 * Plane depths come from the parallax ratio token (0.15 / 0.4 / 0.7 / 1.0),
 * mapped onto z. Uneven on purpose: "evenly spaced ratios read as a slider;
 * uneven ones read as landscape."
 *
 * SUBJECT MATTER — WHY THIS ONE FAILS CLOSED INSTEAD OF FILTERING
 * ---------------------------------------------------------------
 * Every other module on this site excludes restricted photographs by
 * selecting `[data-media-tile]:not([data-static])`. That does not work here,
 * and the difference matters.
 *
 * A dolly moves the CAMERA. Every plane under it is moved by the parent
 * transform whether or not the module selected it, so skipping a restricted
 * tile would skip nothing at all — it would still be dollied, just without
 * anyone having decided to. `data-static` is unenforceable inside a 3D scene.
 *
 * So this module fails closed: if it finds any restricted tile under the
 * camera it does not run at all. A cultural-site or artwork photograph
 * dropped into livingWorkPlanes turns the dolly OFF rather than quietly
 * inheriting it. The section degrades to a still scene, which is exactly what
 * permissions.md asks for ("artwork is static imagery only"), and the reason
 * is left on the DOM as `data-dolly-blocked` so it is findable rather than
 * mysterious.
 */

/** Matches the lo-fi label on Home section 05. No extra span is claimed. */
export const DOLLY_SPAN_VH = 100;

/** Parallax ratios from the token set, mapped to z depth in px. */
export const PLANE_RATIOS = [0.15, 0.4, 0.7] as const;
const Z_RANGE_PX = 600;

/** Camera travel across the section, in px of z. */
const CAMERA_Z_FROM = -220;
const CAMERA_Z_TO = 40;

export function planeDepthPx(index: number): number {
  const ratio = PLANE_RATIOS[index] ?? 1;
  // Nearest ratio = nearest plane. Negative z pushes away from the viewer.
  return -(1 - ratio) * Z_RANGE_PX;
}

export function createLayeredDolly(root: HTMLElement): MotionModule {
  const mm = gsap.matchMedia();

  function init() {
    const camera = root.querySelector<HTMLElement>("[data-dolly-camera]");
    if (!camera) return;

    // Fail closed. See the subject-matter note above for why a filter would
    // be theatre here rather than enforcement.
    const restricted = camera.querySelector<HTMLElement>(
      "[data-media-tile][data-static]",
    );
    if (restricted) {
      root.setAttribute(
        "data-dolly-blocked",
        restricted.dataset.bucket ?? "restricted",
      );
      return;
    }
    root.removeAttribute("data-dolly-blocked");

    const ghost = root.querySelector<HTMLElement>("[data-ghost]");

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        camera,
        { z: CAMERA_Z_FROM },
        { z: CAMERA_Z_TO, duration: 1 },
        0,
      );

      // The ghost word drifts at the slowest parallax ratio. yPercent, so it
      // stays a transform.
      if (ghost) {
        tl.fromTo(
          ghost,
          { yPercent: PLANE_RATIOS[0] * 100 },
          { yPercent: -PLANE_RATIOS[0] * 100, duration: 1 },
          0,
        );
      }

      return () => {
        tl.kill();
      };
    });

    // X6 — resting state, instantly. The scene is simply not in motion.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(camera, { z: 0 });
      if (ghost) gsap.set(ghost, { yPercent: 0 });
    });
  }

  function destroy() {
    mm.revert();
    ScrollTrigger.refresh();
  }

  return { init, destroy };
}
