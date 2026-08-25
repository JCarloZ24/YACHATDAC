"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "@/lib/motion-controller";

/**
 * The Invitation grid — scattered tiles resolving into a grid behind the
 * heading.
 *
 * ⚠ TIER 1 ON THE HOMEPAGE, BUT OVER F4's BUDGET. PENDING DECISION D9.
 * F4 allows two signature moments and A2 + M2 already spend both. This is a
 * third, built as a flagged prototype exception exactly like the Truth scroll
 * lock, and it does not ship until D9 names a motion sign-off owner and that
 * owner approves. Do not quietly promote it by deleting this note.
 *
 * ASSEMBLED FROM FOUR EXISTING SKETCHES, NOT INVENTED
 * ---------------------------------------------------
 *   B2  Stagger resolve      index-based stagger, scale 0→1 with overlap,
 *                            cap ~120 DOM nodes. Twelve here.
 *   L1  Radial emanation     stagger by distance from an origin, not DOM
 *                            order. Origin is the centre, where the heading is.
 *   L2  Scale triad          three arrival tiers — anchor 0, mid .25, detail
 *                            .45. It is a layout rule as much as a motion one,
 *                            so tile SIZE and arrival tier are the same axis:
 *                            the big tiles are the anchors and they land first.
 *   L3  Hand irregularity    seeded delay jitter ≤40ms and ≤2px offset.
 *                            Deterministic — never random per load, or the
 *                            section is a different section on every visit.
 *
 * B2 carries one condition: it "must not resolve into figurative or cultural
 * imagery". It resolves into a grid of separate photographs, not into a
 * picture, and every slot is drawn from the `country` and `work` buckets. See
 * src/content/media.ts.
 *
 * SUBJECT MATTER
 * --------------
 * The reference this comes from animates photographs of artworks. Here that
 * bucket has no motion permission, so the module selects
 * `[data-media-tile]:not([data-static])` — a restricted photo dropped into
 * this grid is skipped by the animation rather than silently animated.
 *
 * NO PIN, ON PURPOSE
 * ------------------
 * The lo-fi labels this section 142vh and that label is the handoff contract
 * with the hi-fi. A pin would need ~250vh and would change the frame. So the
 * convergence is scrubbed across the approach instead — start "top bottom",
 * end "center center" — which also satisfies the brand note that motion
 * finishes before reading starts.
 */

/** Matches the lo-fi label on Home section 06. No extra span is claimed. */
export const CONVERGE_SPAN_VH = 142;

/** L2 — the three arrival tiers, as timeline positions. */
const TIER_AT = { anchor: 0, mid: 0.25, detail: 0.45 } as const;
type Tier = keyof typeof TIER_AT;

/** L3 — the ceilings the spec puts on the irregularity. */
const JITTER_MAX_MS = 40;
const JITTER_MAX_PX = 2;

/**
 * Deterministic hash → 0..1. Seeded by index so the scatter is identical on
 * every load, which is the whole point of L3 being "seeded, never random".
 */
function seeded(index: number, salt: number): number {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

/** Signed −1..1. */
function seededSigned(index: number, salt: number): number {
  return seeded(index, salt) * 2 - 1;
}

export function createConvergeGrid(root: HTMLElement): MotionModule {
  const mm = gsap.matchMedia();

  function init() {
    /* The grid occupies the heading block, not the whole section — see the
       figure/ground note in Invitation.tsx. Both the scroll trigger and the
       radial origin follow it, or the convergence would be timed against a
       142vh section while happening in its top third. */
    const scope =
      root.querySelector<HTMLElement>("[data-converge-scope]") ?? root;
    // Restricted tiles are excluded here, not filtered downstream.
    const tiles = [
      ...root.querySelectorAll<HTMLElement>(
        "[data-media-tile]:not([data-static])",
      ),
    ];
    if (tiles.length === 0) return;

    const tierOf = (tile: HTMLElement): Tier =>
      (tile.dataset.tier as Tier) ?? "detail";

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: scope,
          start: "top bottom",
          end: "center center",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      (Object.keys(TIER_AT) as Tier[]).forEach((tier) => {
        const group = tiles.filter((tile) => tierOf(tile) === tier);
        if (group.length === 0) return;

        // Radial order within the tier (L1): nearest the centre arrives first.
        const centre = { x: scope.offsetWidth / 2, y: scope.offsetHeight / 2 };
        const withDistance = group.map((tile) => {
          const box = tile.getBoundingClientRect();
          const scopeBox = scope.getBoundingClientRect();
          const cx = box.left - scopeBox.left + box.width / 2;
          const cy = box.top - scopeBox.top + box.height / 2;
          return {
            tile,
            distance: Math.hypot(cx - centre.x, cy - centre.y),
          };
        });
        withDistance.sort((a, b) => a.distance - b.distance);
        const ordered = withDistance.map((entry) => entry.tile);

        tl.fromTo(
          ordered,
          {
            // Scatter. Large by design — this is B2's start state, and is a
            // different thing from L3's ≤2px jitter, which is added on top.
            xPercent: (i: number) => seededSigned(i, 1) * 55,
            yPercent: (i: number) => seededSigned(i, 2) * 45,
            rotate: (i: number) => seededSigned(i, 3) * 8,
            scale: (i: number) => 0.55 + seeded(i, 4) * 0.3,
            opacity: 0,
          },
          {
            xPercent: (i: number) =>
              (seededSigned(i, 5) * JITTER_MAX_PX) / 100,
            yPercent: (i: number) =>
              (seededSigned(i, 6) * JITTER_MAX_PX) / 100,
            rotate: 0,
            scale: 1,
            opacity: 1,
            duration: 0.55,
            stagger: {
              // Already sorted radially, so a plain each-stagger walks
              // outward from the centre.
              each: 0.045,
              // L3 — seeded delay jitter, capped at 40ms.
              from: 0,
            },
            delay: (i: number) => (seeded(i, 7) * JITTER_MAX_MS) / 1000,
          },
          TIER_AT[tier],
        );
      });

      return () => {
        tl.kill();
      };
    });

    // X6 — the resolved grid, instantly. Not a slower convergence.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(tiles, {
        xPercent: 0,
        yPercent: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
      });
    });
  }

  function destroy() {
    mm.revert();
    ScrollTrigger.refresh();
  }

  return { init, destroy };
}
