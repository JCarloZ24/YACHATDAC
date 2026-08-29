"use client";

/**
 * Truth — the descent.
 *
 * The page travels backwards through time, and the motion's only job is to make
 * that legible. Nothing here is ornament: the ground darkens because the years
 * get older, the rail fills because you have come further down, and the
 * headings settle because settling is what this brand does instead of arriving.
 *
 * The house style note is the constraint that shaped all of it — "truth-telling
 * sections should move less than the rest of the site, not more." So there is
 * no pinning, no parallax and no scrubbed media. Four behaviours, and three of
 * them are state changes rather than animation.
 *
 * WHAT MOVES, AND WHY IT IS CHEAP
 * -------------------------------
 * The obvious way to change the page's ground colour on scroll is to tween
 * `background-color`. That repaints the full viewport on every frame, which the
 * performance rule rules out. So the ground is a fixed stack of opaque
 * solid-colour layers that cross-fade — no colour is ever interpolated at paint
 * time, only opacity changes. This is the same trick `sky-clock.ts` uses for
 * the sky, and it is deliberate that the two files solve it the same way.
 *
 * The rail fill is `scaleY` on a pre-coloured bar, not a height change.
 *
 * That leaves transform and opacity as the only per-frame properties.
 *
 * MARKUP CONTRACT
 * ---------------
 * The module reads the page rather than building it, so the server-rendered
 * markup stays complete and readable with JavaScript off:
 *
 *   [data-descent-root]            the scroll container for the whole descent
 *   [data-descent-ground]          empty element; colour layers are built into it
 *   [data-descent-band="<id>"]     one per section, id matching TRUTH_BANDS
 *   [data-descent-rail-fill]       the bar that grows; transform-origin is set here
 *   [data-descent-mark="<id>"]     a rail marker; gets data-state passed|active|ahead
 *   [data-descent-heading]         a heading to settle (B5)
 *   [data-descent-arrive]          content that arrives by gaining brightness (L4)
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type { MotionModule } from "@/lib/motion-controller";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * The era ladder. Ground darkens monotonically travelling back; the accent runs
 * warm, then red, then cold.
 *
 * Rust red appears exactly once, on the count. That is the whole reason the
 * rest of the page is disciplined about colour — if red were used anywhere else
 * it would not land here. Do not add a second entry using `#C23D31`.
 */
export const TRUTH_BANDS = [
  { id: "present", label: "TODAY", ground: "#22372B", accent: "#FBAE3D" },
  { id: "return", label: "BOUGHT BACK", ground: "#4E3524", accent: "#D97804" },
  { id: "named-wrong", label: "1950s", ground: "#3E2A1D", accent: "#D97804" },
  { id: "count", label: "1902 / 1886", ground: "#090E12", accent: "#C23D31" },
  { id: "before-record", label: "BEFORE THE RECORD", ground: "#122449", accent: "#F6F6EC" },
  { id: "deep-time", label: "DEEP TIME", ground: "#090E12", accent: "#13A7E1" },
] as const;

export type TruthBandId = (typeof TRUTH_BANDS)[number]["id"];

/** tokens.md. Not re-derived per section — that is the point of the token set. */
const EASE_COUNTRY = "expo.out";
const DUR_LARGE = 0.82;
const DUR_MEDIUM = 0.55;
const STAGGER_HEADLINE = 0.09;
const L4_DIM = 0.4;

export type TruthDescentOptions = {
  /** Told which band is current, so the page can label the rail. */
  onBand?: (id: TruthBandId) => void;
};

export function createTruthDescent(
  options: TruthDescentOptions = {},
): MotionModule {
  let ctx: gsap.Context | null = null;
  let splits: SplitText[] = [];
  let groundLayers: HTMLElement[] = [];

  /**
   * One opaque layer per band, stacked and cross-faded.
   *
   * Built here rather than rendered server-side because they are pure paint
   * surfaces with no content — six empty divs in the markup would be six things
   * for a future editor to wonder about.
   */
  const buildGround = (root: HTMLElement) => {
    const host = root.querySelector<HTMLElement>("[data-descent-ground]");
    if (!host) return;

    groundLayers = TRUTH_BANDS.map((band, i) => {
      const layer = document.createElement("div");
      layer.dataset.descentGroundLayer = band.id;
      layer.setAttribute("aria-hidden", "true");
      layer.style.position = "absolute";
      layer.style.inset = "0";
      layer.style.backgroundColor = band.ground;
      layer.style.opacity = i === 0 ? "1" : "0";
      layer.style.willChange = "opacity";
      host.appendChild(layer);
      return layer;
    });
  };

  /** Cross-fade to a band's ground and tell the page which band is current. */
  const showBand = (index: number, instant: boolean) => {
    groundLayers.forEach((layer, i) => {
      const target = i === index ? 1 : 0;
      if (instant) {
        gsap.set(layer, { opacity: target });
      } else {
        gsap.to(layer, {
          opacity: target,
          duration: DUR_LARGE,
          ease: EASE_COUNTRY,
          overwrite: true,
        });
      }
    });

    const band = TRUTH_BANDS[index];
    if (!band) return;

    document
      .querySelectorAll<HTMLElement>("[data-descent-mark]")
      .forEach((mark) => {
        const at = TRUTH_BANDS.findIndex(
          (b) => b.id === mark.dataset.descentMark,
        );
        mark.dataset.state =
          at < index ? "passed" : at === index ? "active" : "ahead";
      });

    options.onBand?.(band.id);
  };

  const wireBands = (root: HTMLElement, instant: boolean) => {
    TRUTH_BANDS.forEach((band, index) => {
      const section = root.querySelector<HTMLElement>(
        `[data-descent-band="${band.id}"]`,
      );
      if (!section) return;

      ScrollTrigger.create({
        trigger: section,
        start: "top 60%",
        end: "bottom 40%",
        // Both directions, because the descent is reversible.
        onEnter: () => showBand(index, instant),
        onEnterBack: () => showBand(index, instant),
        refreshPriority: index,
      });
    });
  };

  /**
   * The rail is a core sample: the deeper you go, the more strata behind you.
   *
   * `machine` easing — linear — because it reports position rather than
   * performing. A progress indicator that eases is lying about where you are.
   */
  const wireRail = (root: HTMLElement, instant: boolean) => {
    const fill = root.querySelector<HTMLElement>("[data-descent-rail-fill]");
    if (!fill) return;

    gsap.set(fill, {
      transformOrigin: "top center",
      scaleY: 0,
      willChange: "transform",
    });
    const setScale = gsap.quickSetter(fill, "scaleY") as (v: number) => void;

    ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      scrub: instant ? false : true,
      onUpdate: (self) => setScale(self.progress),
    });
  };

  /**
   * B5 — type that settles. Line-level mask, yPercent 110 to 0.
   *
   * Split by line, never by character: character splitting breaks screen
   * readers and reads as a gimmick against this brand. SplitText's
   * `mask: "lines"` supplies the overflow-hidden wrapper without extra markup.
   */
  const wireHeadings = () => {
    document
      .querySelectorAll<HTMLElement>("[data-descent-heading]")
      .forEach((heading) => {
        const split = new SplitText(heading, { type: "lines", mask: "lines" });
        splits.push(split);

        gsap.from(split.lines, {
          yPercent: 110,
          duration: DUR_LARGE,
          ease: EASE_COUNTRY,
          stagger: STAGGER_HEADLINE,
          scrollTrigger: { trigger: heading, start: "top 85%", once: true },
        });
      });
  };

  /**
   * L4 — dark ground, warm figure. Content arrives by gaining brightness rather
   * than fading in from light, which is what a fade from white would imply.
   *
   * Implemented as opacity from a dim resting state, not a `filter` ramp:
   * filter is banned from the per-frame path.
   */
  const wireArrivals = () => {
    gsap.utils.toArray<HTMLElement>("[data-descent-arrive]").forEach((el) => {
      gsap.from(el, {
        opacity: L4_DIM,
        y: 24,
        duration: DUR_MEDIUM,
        ease: EASE_COUNTRY,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });
  };

  const init = () => {
    const root = document.querySelector<HTMLElement>("[data-descent-root]");
    if (!root) return;

    ctx = gsap.context(() => {
      buildGround(root);

      const mm = gsap.matchMedia();

      // Reduced motion cuts to the final state — never a slowed-down variant.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-descent-arrive]", { opacity: 1, y: 0 });
        gsap.set("[data-descent-heading]", { opacity: 1 });
        // Ground and rail still track the reader — they carry meaning, not
        // decoration — but they snap rather than tween.
        wireBands(root, true);
        wireRail(root, true);
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        wireHeadings();
        wireArrivals();
        wireBands(root, false);
        wireRail(root, false);
      });
    }, root);
  };

  const destroy = () => {
    splits.forEach((s) => s.revert());
    splits = [];
    groundLayers.forEach((l) => l.remove());
    groundLayers = [];
    ctx?.revert();
    ctx = null;
  };

  return { init, destroy };
}
