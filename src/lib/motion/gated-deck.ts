"use client";

/**
 * Gated section deck — motion grammar row "the page holding its ground".
 *
 * ScrollTrigger owns geometry: each slide reports its own 0–100% reading
 * span and stays under one uninterrupted viewport pin until the following
 * slide has covered it. The runway length is hidden behind that surface. The
 * establishing hero uses a deliberately short runway that clears site chrome
 * without moving its image or copy. Input is intercepted solely while a gate
 * is held. A partial wheel gesture drains; a committed hand-off always lands
 * at an endpoint. No snap tween writes against Lenis and no wave root receives
 * a transform.
 *
 * The deck owns geometry, not content. What a section does with the span it is
 * given is authored elsewhere — `onSlideSpans` hands every read clock out so
 * interior choreography can ride it (SCR-02), and `[data-deck-active]` on the
 * root tells the flow-path modules to stand down for whatever it takes over.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WAVE_ROLL } from "@/components/ui/Furniture";
import type { MotionModule } from "@/lib/motion-controller";
import { registerYachatdacEffects } from "@/lib/motion/effects";
import { scene } from "@/lib/motion/scene";
import {
  clampScrollTo,
  lockScroll,
  smoothScrollActive,
  smoothScrollTo,
  unlockScroll,
} from "@/lib/motion/smooth-scroll";
import { DUR, SCRUB } from "@/lib/motion/tokens";

gsap.registerPlugin(ScrollTrigger);

export type GatedDeckOptions = {
  root: string;
  slides: string;
  runways?: string;
  railTraveller?: string;
  railGuide?: string;
  firstRailAnchor?: string;
  wave?: string;
  railHiddenSlides?: string;
  railFadeOutSlide?: string;
  railFadeInSlide?: string;
  railTerminalSlide?: string;
  /**
   * Where a slide states the era the traveller is pointing at, and its sub.
   * A slide with no match gets NO traveller: the pointer and the label are one
   * object, and an arrow indicating nothing is what this replaced.
   */
  railLabel?: string;
  railLabelSub?: string;
  siteHeader?: string;
  bufferVh?: number;
  openingReadVh?: number;
  readVh?: number;
  /**
   * How far the outgoing slide travels up while the next one arrives, as a
   * percentage of the viewport.
   *
   * 100 is lockstep: the outgoing's foot stays against the incoming's head and
   * the hand-off plays as ordinary scrolling. Below that it becomes a
   * parallax, and at 0 the outgoing sits still and is simply covered — which
   * is what a deck used to do when every section arrived in a different
   * colour to announce itself. Above 100 the two separate and show bare page.
   */
  exitVh?: number;
  transitionDuration?: number;
  eventPrefix?: string;
  /**
   * Hands each slide's own reading clock to whoever authors its interior
   * motion. SCR-02 — "section locks to viewport while an internal timeline
   * scrubs" (MOTION-SYSTEM §SCR-02).
   *
   * Interior motion cannot use viewport-relative triggers on a deck. A slide
   * pinned at `top top` with `pinSpacing: false` consumes a `top 88%` span
   * while it is still travelling up BEHIND the slide covering it, so the
   * animation finishes before the reader ever sees the section — and then
   * nothing moves at all across the 125vh they spend reading it. Binding to
   * `read.start`/`read.end` instead puts the choreography where the reading is.
   *
   * Called once, inside the deck's own matchMedia branch, after every read
   * clock exists. Any teardown returned is run on revert, so interior motion
   * inherits both the deck's lifecycle and its gating: no callback fires on
   * touch, under 1024px, without Lenis, or under reduced motion.
   */
  onSlideSpans?: (spans: readonly DeckSlideSpan[]) => (() => void) | void;
};

/** One slide's geometry, as the deck measured it. */
export type DeckSlideSpan = {
  index: number;
  slide: HTMLElement;
  runway: HTMLElement;
  /** The 0–100% reading clock. Read `.start`/`.end` lazily — both move on refresh. */
  read: ScrollTrigger;
  /** The cover travel into the next slide. Null on the last slide. */
  cover: ScrollTrigger | null;
};

type Phase = "reading" | "holding" | "playing";

type Gate = {
  index: number;
  slide: HTMLElement;
  over: HTMLElement | null;
  read: ScrollTrigger;
  cover: ScrollTrigger | null;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

function readableLabel(slide: HTMLElement, index: number): string {
  const raw = slide.dataset.truthSlideLabel || slide.id || `Section ${index + 1}`;
  return raw
    .replace(/^break-/, "")
    .replaceAll("-", " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

/**
 * How much of the strand's tangent the pointer actually shows.
 *
 * The guide is `72 + 8·sin(2πy/214)` sampled ±8 units either side, so its
 * tangent spans about ±13.2° — and at 96px long the arrow turned that into a
 * visible wobble rather than into tracking. Showing a seventh of it keeps the
 * arrow following the strand at roughly ±2° (user, 10 September 2026).
 *
 * Scaled, not clamped: a sine spends most of its length near the peaks, so a
 * clamp would flatten the movement into two constants and lose the tracking
 * altogether.
 */
const POINTER_TILT_DEG = 2;
const TANGENT_SPAN_DEG = 13.2;
const TILT_RATIO = POINTER_TILT_DEG / TANGENT_SPAN_DEG;

/** Binary-searches the full-height rail guide at a document-space y. */
function pointAtY(path: SVGPathElement, targetY: number) {
  const length = path.getTotalLength();
  if (!length) return null;
  let low = 0;
  let high = length;
  for (let i = 0; i < 14; i += 1) {
    const middle = (low + high) / 2;
    if (path.getPointAtLength(middle).y < targetY) low = middle;
    else high = middle;
  }
  const at = (low + high) / 2;
  const point = path.getPointAtLength(at);
  const before = path.getPointAtLength(Math.max(0, at - 8));
  const after = path.getPointAtLength(Math.min(length, at + 8));
  return {
    point,
    rotation:
      (-Math.atan2(after.x - before.x, after.y - before.y) * 180) /
      Math.PI,
  };
}

export function createGatedDeck({
  root: rootSelector,
  slides: slideSelector,
  runways: runwaySelector = "[data-truth-slide-runway]",
  railTraveller = "[data-truth-trail-traveller]",
  railGuide = "[data-truth-trail-guide]",
  firstRailAnchor = "[data-hero-cue]",
  wave: waveSelector = '[data-seam="truth-wave"]',
  railHiddenSlides = '#break-escarpment, [data-truth-ground="count"]',
  railFadeOutSlide = "#art-gallery",
  railFadeInSlide = "#mitchell",
  railTerminalSlide = "#seabed",
  railLabel = "[data-era-label]",
  railLabelSub = "[data-era-sub]",
  siteHeader = "[data-site-header]",
  bufferVh = 20,
  openingReadVh = 20,
  readVh = 125,
  exitVh = 100,
  transitionDuration = 0.9,
  eventPrefix = "deck",
  onSlideSpans,
}: GatedDeckOptions): MotionModule {
  let ctx: gsap.Context | null = null;
  let revertScene: (() => void) | null = null;

  const init = () => {
    const root = document.querySelector<HTMLElement>(rootSelector);
    if (!root) return;
    registerYachatdacEffects();

    ctx = gsap.context(() => {
      revertScene = scene(
        () => {
          const pointerMedia = gsap.matchMedia();
          pointerMedia.add(
            "(pointer: fine) and (min-width: 1024px)",
            () => {
              const slides = Array.from(
                root.querySelectorAll<HTMLElement>(slideSelector),
              );
              if (slides.length < 2 || !smoothScrollActive()) return;

              const runways = slides.map(
                (slide) =>
                  slide.closest<HTMLElement>(runwaySelector) ?? slide,
              );
              const tracks = slides.map((slide) =>
                slide.querySelector<HTMLElement>("[data-truth-deck-track]"),
              );
              const trackViewports = slides.map((slide) =>
                slide.querySelector<HTMLElement>(
                  "[data-truth-deck-viewport]",
                ),
              );

              // How far the reader scrolls to read a slide. A slide may set
              // its own `data-truth-read-vh` when it holds more than the
              // normalised span comfortably carries.
              const readDistance = (index: number) => {
                const own = Number(slides[index].dataset.truthReadVh);
                const vh =
                  own > 0 ? own : index === 0 ? openingReadVh : readVh;
                return Math.max(1, window.innerHeight * (vh / 100));
              };

              // The runway is a clock, not content spacing. Its extra block
              // size sits behind a continuously pinned viewport surface, so
              // it can never appear as an empty tail. The first portion is
              // the equal read span; the final viewport is the cover travel.
              const prepareRunways = () => {
                slides.forEach((slide, index) => {
                  const runway = runways[index];
                  const track = tracks[index];
                  const trackViewport = trackViewports[index];
                  gsap.set(runway, {
                    paddingBottom: readDistance(index),
                  });
                  gsap.set(slide, {
                    height: "100svh",
                    minHeight: "100svh",
                    position: "relative",
                    top: "auto",
                  });
                  if (track) {
                    // Clip only the moving content viewport. The incoming
                    // Wave / Divider is a sibling that must overhang above
                    // the slide onto the outgoing hero.
                    gsap.set(slide, { overflow: "visible" });
                    if (trackViewport) {
                      gsap.set(trackViewport, {
                        position: "absolute",
                        inset: 0,
                        overflow: "hidden",
                      });
                    }
                  }
                });
              };
              prepareRunways();

              const traveller = root.querySelector<HTMLElement>(railTraveller);
              const guide = root.querySelector<SVGPathElement>(railGuide);
              const pointer = traveller?.querySelector<HTMLElement>(
                "[data-truth-trail-pointer]",
              );
              const labelNode = traveller?.querySelector<HTMLElement>(
                "[data-truth-trail-label]",
              );
              const subNode = traveller?.querySelector<HTMLElement>(
                "[data-truth-trail-sub]",
              );
              const firstAnchor = root.querySelector<HTMLElement>(firstRailAnchor);

              let phase: Phase = "reading";
              let disposed = false;
              let activeIndex = 0;
              let holding: Gate | null = null;
              let playingGate: Gate | null = null;
              let lastY = window.scrollY;
              let drain: gsap.core.Tween | null = null;
              const charge = { progress: 0 };
              const gates: Gate[] = [];
              const crestReady = 0.6;
              const rollReach = WAVE_ROLL * 0.15;
              const hiddenRailIndexes = new Set(
                slides.flatMap((slide, index) =>
                  slide.matches(railHiddenSlides) ? [index] : [],
                ),
              );
              // Which slides name an era. The traveller shows on these and
              // nowhere else — the hero included, which is how it stops
              // appearing before the chronology has started.
              const labelledIndexes = new Set(
                slides.flatMap((slide, index) =>
                  slide.querySelector(railLabel) ? [index] : [],
                ),
              );
              /**
               * The pop, as a multiplier rather than a tween on the traveller.
               *
               * `paintRail` re-sets autoAlpha and scale every frame, so a tween
               * competing for those properties is simply overwritten on the
               * next scroll event. Tweening a number and folding it into that
               * same set is the only form that survives.
               */
              const pop = { value: 1 };
              let popTween: gsap.core.Tween | null = null;
              let labelledNow = false;
              let labelIndex = -1;
              const fadeOutRailIndex = slides.findIndex((slide) =>
                slide.matches(railFadeOutSlide),
              );
              const fadeInRailIndex = slides.findIndex((slide) =>
                slide.matches(railFadeInSlide),
              );
              const terminalRailIndex = slides.findIndex((slide) =>
                slide.matches(railTerminalSlide),
              );

              /** Opacity is derived only from a slide's read ScrollTrigger.
               * The rail silence begins before the 1950s cover, spans the
               * escarpment/count, and reverses during the 1840s opening. */
              const railOpacityAt = (index: number, progress: number) => {
                const p = clamp01(progress);
                // No era, no traveller. Checked first: a slide that names
                // nothing is silent whatever the fades below would say.
                if (!labelledIndexes.has(index)) return 0;
                if (hiddenRailIndexes.has(index)) return 0;
                if (index === fadeOutRailIndex) {
                  // Over the final HALF, not the final fifth. This slide ramps
                  // its ground from egg white down to charcoal as it is read,
                  // and the rail floats above it: the label is burnt-deep,
                  // 6.31:1 on the opening ground and unreadable on the closing
                  // one. The ink crosses at 0.53, so the guide has to be gone
                  // by then. The band is the light going out; the guide
                  // leaving early reads as part of that.
                  return clamp01((1 - p) / 0.5);
                }
                if (index === fadeInRailIndex) return clamp01(p / 0.2);
                if (index === terminalRailIndex) {
                  return clamp01((1 - p) / 0.2);
                }
                if (terminalRailIndex >= 0 && index > terminalRailIndex) {
                  return 0;
                }
                return 1;
              };

              const rootDocumentTop = () =>
                root.getBoundingClientRect().top + window.scrollY;

              const railBounds = (index: number) => {
                const defaultTop = window.innerHeight * 0.1;
                const bottom = window.innerHeight - 28;
                const anchoredTop = firstAnchor
                  ? firstAnchor.getBoundingClientRect().bottom + 16
                  : defaultTop;
                return {
                  top:
                    index === 0
                      ? Math.min(Math.max(anchoredTop, defaultTop), bottom)
                      : defaultTop,
                  bottom,
                };
              };

              const announce = (
                kind: "progress" | "buffer" | "gate",
                detail: Record<string, unknown>,
              ) => {
                window.dispatchEvent(
                  new CustomEvent(`${eventPrefix}:${kind}`, { detail }),
                );
              };

              /**
               * Put the active slide's era on the pointer, and pop the pair in
               * when one arrives.
               *
               * Called on slide change only — never per frame. The strings are
               * read straight out of the section's own gutter block, so there
               * is one source for what the era is and no second copy to drift.
               */
              const setRailLabel = (index: number) => {
                const slide = slides[index];
                const source = slide?.querySelector<HTMLElement>(railLabel);
                const sub = slide?.querySelector<HTMLElement>(railLabelSub);
                const text = source?.textContent?.trim() ?? "";
                if (labelNode) {
                  labelNode.textContent = text;
                  // A decade reads "1950s", not "1950S" — the eyebrow
                  // uppercases, so a label opening on a digit opts out.
                  labelNode.classList.toggle("normal-case", /^\d/.test(text));
                }
                if (subNode) subNode.textContent = sub?.textContent?.trim() ?? "";

                const labelled = labelledIndexes.has(index);
                if (labelled && !labelledNow) {
                  popTween?.kill();
                  pop.value = 0;
                  popTween = gsap.to(pop, {
                    value: 1,
                    duration: DUR.medium,
                    ease: "country",
                    // A reader who has stopped gets no scroll paint, so the
                    // tween has to drive the repaint itself.
                    onUpdate: () => syncRail(),
                  });
                } else if (!labelled) {
                  popTween?.kill();
                  pop.value = 1;
                }
                labelledNow = labelled;
              };

              const paintRail = (
                index: number,
                progress: number,
                bufferProgress = 0,
                mode: "reading" | "buffer" = "reading",
                opacityOverride?: number,
                screenYOverride?: number,
              ) => {
                if (!traveller || !guide || !pointer) return;
                const p = clamp01(progress);
                const buffer = clamp01(bufferProgress);
                // Keep the artwork inside the viewport: its exported rosette
                // is wider than its anchor and would clip at literal 0/100.
                // Truth opens near the foot of the hero copy; later beats
                // use the regular viewport-safe top. A cover can supply an
                // explicit y so its destination is the INCOMING beat's top.
                if (index !== labelIndex) {
                  labelIndex = index;
                  setRailLabel(index);
                }
                const { top, bottom } = railBounds(index);
                const screenY =
                  screenYOverride ?? top + (bottom - top) * p;
                const guideY = clamp01(
                  (window.scrollY - rootDocumentTop() + screenY) /
                    Math.max(root.offsetHeight, 1),
                ) * root.offsetHeight;
                const sampled = pointAtY(guide, guideY);
                if (!sampled) return;

                const opacity = opacityOverride ?? railOpacityAt(index, p);

                gsap.set(traveller, {
                  x: sampled.point.x,
                  y: screenY,
                  autoAlpha: opacity * pop.value,
                });
                gsap.set(pointer, {
                  rotation: sampled.rotation * TILT_RATIO,
                  scale:
                    (mode === "buffer" ? 1 + buffer * 0.12 : 1) * pop.value,
                  transformOrigin: "22px 50%",
                });
                announce(mode === "buffer" ? "buffer" : "progress", {
                  index,
                  label: readableLabel(slides[index], index),
                  progress: mode === "buffer" ? buffer : p,
                });
              };

              const transitionRailOpacity = (
                index: number,
                progress: number,
              ) =>
                gsap.utils.interpolate(
                  railOpacityAt(index, 1),
                  railOpacityAt(index + 1, 0),
                  progress,
                );

              const paintTransitionRail = (gate: Gate) => {
                const progress = clamp01(gate.cover?.progress ?? 0);
                const outgoing = railBounds(gate.index);
                const incoming = railBounds(gate.index + 1);
                paintRail(
                  gate.index,
                  1 - progress,
                  0,
                  "reading",
                  transitionRailOpacity(gate.index, progress),
                  outgoing.bottom +
                    (incoming.top - outgoing.bottom) * progress,
                );
              };

              const live = document.createElement("div");
              live.className = "sr-only";
              live.setAttribute("aria-live", "polite");
              root.appendChild(live);

              const removeWheel = () =>
                window.removeEventListener("wheel", onWheel, true);

              const releaseHold = () => {
                drain?.kill();
                drain = null;
                removeWheel();
                holding = null;
                live.textContent = "";
                unlockScroll();
                if (phase !== "playing") phase = "reading";
              };

              const completePlay = (gate: Gate, reverse: boolean) => {
                if (disposed) return;
                playingGate = null;
                phase = "reading";
                charge.progress = 0;
                activeIndex = reverse ? gate.index : gate.index + 1;
                paintRail(activeIndex, reverse ? 1 : 0);
                announce("gate", {
                  action: reverse ? "rewound" : "played",
                  index: gate.index,
                });
              };

              const play = (gate: Gate, reverse: boolean) => {
                if (!gate.cover || phase === "playing") return;
                phase = "playing";
                playingGate = gate;
                releaseHold();
                // Transfer with the cover instead of teleporting after it.
                // As scroll advances, screen y travels from the outgoing
                // foot to the incoming head while x and rotation continue
                // sampling the same full-height SVG guide.
                paintTransitionRail(gate);
                announce("gate", {
                  action: reverse ? "rewind" : "play",
                  index: gate.index,
                });
                smoothScrollTo(
                  reverse ? gate.cover.start : gate.cover.end,
                  transitionDuration,
                  true,
                  false,
                  () => completePlay(gate, reverse),
                );
              };

              const renderCharge = () => {
                if (!holding) return;
                paintRail(holding.index, 1, charge.progress, "buffer");
              };

              const fire = () => {
                if (!holding || phase !== "holding") return;
                const gate = holding;
                charge.progress = 1;
                renderCharge();
                play(gate, false);
              };

              function onWheel(event: WheelEvent) {
                if (!holding || phase !== "holding") return;
                event.preventDefault();
                const delta =
                  event.deltaY *
                  (event.deltaMode === 1
                    ? 40
                    : event.deltaMode === 2
                      ? window.innerHeight
                      : 1);
                if (delta < 0) {
                  const gate = holding;
                  charge.progress = 0;
                  paintRail(gate.index, 1, 0, "buffer");
                  releaseHold();
                  smoothScrollTo(
                    Math.max(0, gate.read.end - Math.abs(delta)),
                    0.2,
                  );
                  return;
                }
                if (delta === 0) return;
                drain?.kill();
                charge.progress = Math.min(
                  1,
                  charge.progress +
                    delta / (window.innerHeight * (bufferVh / 100)),
                );
                renderCharge();
                if (charge.progress >= 1) {
                  fire();
                  return;
                }
                drain = gsap.to(charge, {
                  progress: 0,
                  delay: 0.4,
                  duration: 0.5,
                  ease: "power2.out",
                  onUpdate: renderCharge,
                });
              }

              const engage = (gate: Gate) => {
                if (
                  phase !== "reading" ||
                  !gate.cover ||
                  !smoothScrollActive()
                ) {
                  return;
                }
                phase = "holding";
                holding = gate;
                activeIndex = gate.index;
                charge.progress = 0;
                lockScroll();
                clampScrollTo(gate.read.end);
                paintRail(gate.index, 1, 0, "buffer");
                live.textContent =
                  "Section complete. Keep scrolling, or press Page Down, to open the next section.";
                window.addEventListener("wheel", onWheel, {
                  passive: false,
                  capture: true,
                });
              };

              slides.forEach((slide, index) => {
                // Upstream runways must measure before downstream triggers so
                // their virtual reading spans are included in every later start.
                // Refreshing in the opposite order lets a later slide pin
                // inside the current slide's read span and exposes the
                // hidden runway as apparently empty ground.
                const refreshPriority = index * 10;
                const gate: Gate = {
                  index,
                  slide,
                  over: slides[index + 1] ?? null,
                  read: null as unknown as ScrollTrigger,
                  cover: null,
                };
                gates.push(gate);
                const read = ScrollTrigger.create({
                  id: `${eventPrefix}-read-${index}`,
                  trigger: runways[index],
                  start: "top top",
                  end: () => `+=${readDistance(index)}`,
                  // Grammar: "the page holding its ground". This trigger is
                  // only the 0–100% reading clock. The single surface pin
                  // below owns both this span and the following cover.
                  invalidateOnRefresh: true,
                  refreshPriority,
                  onEnter: (self) => {
                    if (phase !== "reading") return;
                    activeIndex = index;
                    paintRail(index, self.progress);
                  },
                  onEnterBack: (self) => {
                    if (phase !== "reading") return;
                    activeIndex = index;
                    paintRail(index, self.progress);
                  },
                  onUpdate: (self) => {
                    if (phase !== "reading" || activeIndex !== index) return;
                    paintRail(index, self.progress);
                    if (self.progress >= 0.999 && index < slides.length - 1) {
                      engage(gate);
                    }
                  },
                  onLeave: () => {
                    if (index < slides.length - 1) engage(gate);
                  },
                });

                gate.read = read;
                const track = tracks[index];
                if (track) {
                  const trackTrigger = {
                    id: `${eventPrefix}-track-${index}`,
                    trigger: runways[index],
                    start: () => read.start,
                    end: () => read.end,
                    scrub: SCRUB.normal,
                    invalidateOnRefresh: true,
                    refreshPriority: refreshPriority + 1,
                  };
                  // Grammar: "the page holding its ground". The complete
                  // inner panel rises as one cover; its leading wave, ground
                  // and authored contents therefore cannot detach.
                  const trackTimeline = gsap
                    .timeline({ scrollTrigger: trackTrigger })
                    .fromTo(
                      track,
                      { y: 0 },
                      {
                        y: () =>
                          -Math.max(
                            0,
                            track.scrollHeight - slides[index].clientHeight,
                          ),
                        duration: 1,
                        ease: "none",
                        immediateRender: true,
                      },
                      0,
                    );
                  const waveHeading = slides[index].querySelector<HTMLElement>(
                    "[data-truth-wave-heading]",
                  );
                  if (waveHeading) {
                    trackTimeline.waveClamp(
                      waveHeading,
                      { track, viewport: slides[index] },
                      0,
                    );
                  }
                }
                const over = gate.over;
                const wave = over?.querySelector<SVGElement>(waveSelector);
                const ink = wave?.querySelector<SVGGElement>(
                  "[data-wave-ink]",
                );
                if (wave && ink) {
                  // About pulls this same ink with buffer charge. Truth's
                  // pull is earned by the last 20vh of ordinary reading:
                  // ScrollTrigger brings the crest to full at 100%, then it
                  // stands unchanged while the magnetic buffer charges.
                  gsap.set(wave, { autoAlpha: 1 });
                  gsap.fromTo(
                    ink,
                    {
                      scaleY: crestReady,
                      x: -rollReach,
                      transformOrigin: "50% 100%",
                    },
                    {
                      scaleY: 1,
                      x: 0,
                      ease: "none",
                      immediateRender: true,
                      scrollTrigger: {
                        id: `${eventPrefix}-wave-${index}`,
                        trigger: runways[index],
                        start: () =>
                          Math.max(
                            read.start,
                            read.end -
                              window.innerHeight * (bufferVh / 100),
                          ),
                        end: () => read.end,
                        scrub: SCRUB.light,
                        invalidateOnRefresh: true,
                        refreshPriority: refreshPriority + 2,
                      },
                    },
                  );
                }
                if (over) {
                  ScrollTrigger.create({
                    id: `${eventPrefix}-pin-${index}`,
                    trigger: runways[index],
                    // One uninterrupted pin prevents a frame, background or
                    // rail handoff between the read and cover phases.
                    start: "top top",
                    endTrigger: runways[index + 1],
                    end: "top top",
                    pin: slide,
                    pinSpacing: false,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    refreshPriority: refreshPriority + 3,
                  });
                } else {
                  ScrollTrigger.create({
                    id: `${eventPrefix}-pin-${index}`,
                    trigger: runways[index],
                    start: "top top",
                    end: () => read.end,
                    pin: slide,
                    pinSpacing: false,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    refreshPriority: refreshPriority + 3,
                  });
                }
                // THE HAND-OFF SCROLLS. It does not overlay.
                //
                // A deck's cover was legible on colour alone: a section was
                // replaced by one arriving in a DIFFERENT colour, so "covered"
                // announced itself. Since the page went to one egg-white
                // ground it does not — an identically-coloured slide sliding
                // over a stationary one reads as text swapping on a static
                // page, with the old section's half-covered lines still
                // sitting behind the new heading.
                //
                // So the outgoing travels the full viewport too, and the pair
                // move together: the outgoing's foot stays against the
                // incoming's head for the whole hand-off, which is exactly
                // what ordinary scrolling looks like. The deck keeps its hold
                // and its gate — the page still stops at the end of a section
                // and waits to be committed — but the transition itself is a
                // scroll, not a presentation overlay (user direction,
                // 9 September 2026).
                if (over) {
                  const departing = over;
                  gsap.fromTo(
                    slide,
                    { y: 0 },
                    {
                      y: () => -window.innerHeight * (exitVh / 100),
                      ease: "none",
                      immediateRender: false,
                      // CAPPED AT THE INCOMING'S OWN PENETRATION, every frame.
                      //
                      // The tween says how far this section would like to
                      // drift; the modifier refuses to let it rise faster than
                      // the next one is actually arriving. Without the cap the
                      // two spans disagree — the cover span is whatever the
                      // layout between two runways happens to be, while the
                      // incoming always arrives over exactly one viewport of
                      // scroll — and wherever the layout adds padding between
                      // sections the exit outran the arrival and opened a
                      // strip of bare page along the foot. Measured, that was
                      // 46px at the seabed seam and a 7px hairline at three
                      // others, including one dark-to-light join where it
                      // would have shown.
                      //
                      // Reading the incoming's rect per frame is the honest
                      // fix: it is the real geometry rather than an assumption
                      // about it, so no seam can regress by gaining padding.
                      modifiers: {
                        y: (value: string) => {
                          const wanted = Math.abs(parseFloat(value) || 0);
                          const arrived = Math.max(
                            0,
                            window.innerHeight -
                              departing.getBoundingClientRect().top,
                          );
                          return `${-Math.min(wanted, arrived)}px`;
                        },
                      },
                      scrollTrigger: {
                        id: `${eventPrefix}-exit-${index}`,
                        trigger: runways[index],
                        start: () => read.end,
                        endTrigger: runways[index + 1],
                        end: "top top",
                        scrub: SCRUB.light,
                        invalidateOnRefresh: true,
                        refreshPriority: refreshPriority + 5,
                      },
                    },
                  );
                }
                const cover = over
                  ? ScrollTrigger.create({
                      id: `${eventPrefix}-cover-${index}`,
                      trigger: runways[index],
                      start: () => read.end,
                      endTrigger: runways[index + 1],
                      end: "top top",
                      invalidateOnRefresh: true,
                      refreshPriority: refreshPriority + 4,
                      onEnter: () => engage(gate),
                      onUpdate: () => {
                        if (phase === "playing" && playingGate === gate) {
                          paintTransitionRail(gate);
                        }
                      },
                    })
                  : null;
                gate.cover = cover;
              });

              // About selected the first semantic <header>; Truth has two.
              // The stable site hook avoids moving the hero's own header.
              const header = document.querySelector<HTMLElement>(siteHeader);
              const openingCover = gates[0]?.cover;
              if (header && openingCover) {
                gsap.fromTo(
                  header,
                  { y: 0 },
                  {
                    y: () => -header.offsetHeight,
                    ease: "none",
                    immediateRender: true,
                    scrollTrigger: {
                      trigger: runways[0],
                      start: () => gates[0].read.start,
                      end: () => gates[0].read.end,
                      scrub: SCRUB.light,
                      invalidateOnRefresh: true,
                    },
                  },
                );
              }

              const onKey = (event: KeyboardEvent) => {
                if (!holding || phase !== "holding") return;
                const target = event.target as HTMLElement | null;
                if (
                  target?.closest(
                    "input, textarea, select, [contenteditable=true]",
                  )
                ) {
                  return;
                }
                const space = event.key === " " || event.key === "Spacebar";
                if (
                  event.key === "PageDown" ||
                  event.key === "ArrowDown" ||
                  (space && !event.shiftKey)
                ) {
                  event.preventDefault();
                  fire();
                } else if (
                  event.key === "PageUp" ||
                  event.key === "ArrowUp" ||
                  event.key === "Home" ||
                  (space && event.shiftKey)
                ) {
                  charge.progress = 0;
                  paintRail(holding.index, 1, 0, "buffer");
                  releaseHold();
                }
              };

              const onScroll = () => {
                const y = window.scrollY;
                const direction = y >= lastY ? 1 : -1;
                lastY = y;
                if (phase !== "reading") return;

                const inCover = gates.find(
                  (gate) =>
                    gate.cover &&
                    y > gate.cover.start + 2 &&
                    y < gate.cover.end - 2,
                );
                if (!inCover) return;
                if (direction < 0) play(inCover, true);
                else {
                  clampScrollTo(inCover.read.end);
                  engage(inCover);
                }
              };

              window.addEventListener("keydown", onKey);
              window.addEventListener("scroll", onScroll, { passive: true });

              const syncRail = () => {
                if (phase === "holding" && holding) renderCharge();
                else if (phase === "playing" && playingGate) {
                  paintTransitionRail(playingGate);
                } else {
                  const gate = gates[activeIndex];
                  paintRail(activeIndex, gate?.read.progress ?? 0);
                }
              };
              const guideObserver = guide
                ? new MutationObserver(syncRail)
                : null;
              if (guide && guideObserver) {
                guideObserver.observe(guide, {
                  attributes: true,
                  attributeFilter: ["d"],
                });
              }
              const refreshRail = () => syncRail();
              ScrollTrigger.addEventListener("refreshInit", prepareRunways);
              ScrollTrigger.addEventListener("refresh", refreshRail);

              // SCR-02. Every read clock now exists, so interior choreography
              // can bind to the span the reader actually spends in a section
              // rather than to a viewport the pinned slide never crosses. The
              // flag lets the flow-path modules stand down for the elements
              // this hands over; it is set before they init, because modules
              // run in registration order and matchMedia.add is synchronous.
              root.dataset.deckActive = "true";
              const releaseSpans = onSlideSpans?.(
                gates.map((gate) => ({
                  index: gate.index,
                  slide: gate.slide,
                  runway: runways[gate.index],
                  read: gate.read,
                  cover: gate.cover,
                })),
              );

              // Resolve restored positions only after every pin has measured.
              const boot = window.setTimeout(() => {
                const y = window.scrollY;
                const inCover = gates.find(
                  (gate) =>
                    gate.cover &&
                    y > gate.cover.start + 2 &&
                    y < gate.cover.end - 2,
                );
                if (inCover) {
                  const midpoint =
                    (inCover.cover!.start + inCover.cover!.end) / 2;
                  play(inCover, y < midpoint);
                  return;
                }
                const active = gates.findIndex(
                  (gate) => y >= gate.read.start && y <= gate.read.end,
                );
                activeIndex =
                  active >= 0 ? active : Math.max(0, slides.length - 1);
                syncRail();
              }, 80);

              return () => {
                disposed = true;
                releaseSpans?.();
                delete root.dataset.deckActive;
                window.clearTimeout(boot);
                drain?.kill();
                removeWheel();
                if (holding) unlockScroll();
                live.remove();
                guideObserver?.disconnect();
                ScrollTrigger.removeEventListener(
                  "refreshInit",
                  prepareRunways,
                );
                ScrollTrigger.removeEventListener("refresh", refreshRail);
                window.removeEventListener("keydown", onKey);
                window.removeEventListener("scroll", onScroll);
              };
            },
          );
          return () => pointerMedia.revert();
        },
        () => {
          const traveller = root.querySelector<HTMLElement>(railTraveller);
          if (traveller) gsap.set(traveller, { autoAlpha: 0 });
        },
      );
    }, root);
  };

  const destroy = () => {
    revertScene?.();
    revertScene = null;
    ctx?.revert();
    ctx = null;
  };

  return { init, destroy };
}
