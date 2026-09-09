"use client";

/**
 * Truth — the descent.
 *
 * Scroll is the clock and the document always remains in normal flow. The
 * page grounds belong to the sections and Marc's supplied Wave / Divider
 * carries each incoming colour over the join; this module never repaints or
 * cross-fades the viewport behind them.
 *
 * MARKUP CONTRACT
 * ---------------
 *   [data-descent-root]            scroll container for the whole descent
 *   [data-descent-band="<id>"]     one section per chronology band
 *   [data-descent-rail-fill]       chronology progress fill
 *   [data-descent-mark="<id>"]     optional band marker state
 *   [data-descent-heading]         B5 line reveal, scrubbed and reversible
 *   [data-descent-arrive]          Truth-local M1 brightness, no movement
 *   [data-descent-wave]            supplied Wave / Divider root, structural
 *   [data-wave-ink]                optional inner pull owned by gated-deck
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type { MotionModule } from "@/lib/motion-controller";
import { registerYachatdacEffects } from "@/lib/motion/effects";
import { SCRUB } from "@/lib/motion/tokens";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const TRUTH_BANDS = [
  { id: "present", label: "TODAY" },
  { id: "return", label: "BOUGHT BACK" },
  { id: "named-wrong", label: "1950s" },
  { id: "count", label: "1902 / 1886" },
  { id: "before-record", label: "BEFORE THE RECORD" },
  { id: "deep-time", label: "DEEP TIME" },
] as const;

export type TruthBandId = (typeof TRUTH_BANDS)[number]["id"];

export type TruthDescentOptions = {
  /** Told which band is current, so the page can label the rail. */
  onBand?: (id: TruthBandId) => void;
};

export function createTruthDescent(
  options: TruthDescentOptions = {},
): MotionModule {
  let ctx: gsap.Context | null = null;
  let splits: SplitText[] = [];

  /** Band callbacks report chronology only; section markup owns the ground. */
  const wireBands = (root: HTMLElement) => {
    TRUTH_BANDS.forEach((band, index) => {
      const section = root.querySelector<HTMLElement>(
        `[data-descent-band="${band.id}"]`,
      );
      if (!section) return;

      const showBand = () => {
        root
          .querySelectorAll<HTMLElement>("[data-descent-mark]")
          .forEach((mark) => {
            const at = TRUTH_BANDS.findIndex(
              (candidate) => candidate.id === mark.dataset.descentMark,
            );
            mark.dataset.state =
              at < index ? "passed" : at === index ? "active" : "ahead";
          });
        options.onBand?.(band.id);
      };

      ScrollTrigger.create({
        trigger: section,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: showBand,
        onEnterBack: showBand,
        refreshPriority: index,
      });
    });
  };

  /** G1 — progress reports position linearly; it never eases or pins. */
  const wireRail = (root: HTMLElement, instant: boolean) => {
    const fill = root.querySelector<HTMLElement>("[data-descent-rail-fill]");
    if (!fill) return;

    gsap.set(fill, {
      transformOrigin: "top center",
      scaleY: 0,
      willChange: "transform",
    });
    const setScale = gsap.quickSetter(fill, "scaleY") as (value: number) => void;

    ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      scrub: instant ? false : true,
      onUpdate: (self) => setScale(self.progress),
    });
  };

  /** B5 / what endures — line masks are scrubbed in both directions. */
  const wireHeadings = (root: HTMLElement) => {
    root
      .querySelectorAll<HTMLElement>("[data-descent-heading]")
      .forEach((heading) => {
        const split = SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          aria: "auto",
        });
        splits.push(split);

        gsap.fromTo(
          split.lines,
          { yPercent: 110 },
          {
            yPercent: 0,
            stagger: 0.09,
            ease: "none",
            immediateRender: true,
            scrollTrigger: {
              trigger: heading,
              start: "top 88%",
              end: "top 38%",
              scrub: SCRUB.normal,
            },
          },
        );
      });
  };

  /** Truth M1 / emerging from the ground — brightness only, never travel. */
  const wireArrivals = (root: HTMLElement) => {
    gsap.utils
      .toArray<HTMLElement>(root.querySelectorAll("[data-descent-arrive]"))
      .forEach((el) => {
        const timeline = gsap.timeline({ paused: true });
        timeline.brighten(el, { dim: 0.4, duration: 1, ease: "none" });
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          end: "top 48%",
          scrub: SCRUB.normal,
          animation: timeline,
        });
      });
  };

  const init = () => {
    const root = document.querySelector<HTMLElement>("[data-descent-root]");
    if (!root) return;

    registerYachatdacEffects();
    ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(root.querySelectorAll("[data-descent-arrive]"), { opacity: 1 });
        gsap.set(root.querySelectorAll("[data-descent-heading]"), { yPercent: 0 });
        wireBands(root);
        wireRail(root, true);
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        wireHeadings(root);
        wireArrivals(root);
        wireBands(root);
        wireRail(root, false);
      });
    }, root);
  };

  const destroy = () => {
    splits.forEach((split) => split.revert());
    splits = [];
    ctx?.revert();
    ctx = null;
  };

  return { init, destroy };
}
