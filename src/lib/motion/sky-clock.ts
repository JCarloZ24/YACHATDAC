"use client";

/**
 * A2 — Sky coupled to content. Built from Marc's homepage mockup.
 *
 * Time of day and narrative beat advance on the same clock: a fixed atmosphere
 * layer behind the whole page, whose sky colour, sun position and star field
 * are driven by where the visitor is in the story. Tier 1, homepage only, and
 * one of the two signature moments the homepage is budgeted.
 *
 * WHAT THIS CHANGES FROM THE MOCKUP, AND WHY
 * ------------------------------------------
 * The mockup transitions `top`, `width`, `height`, `margin-left` and
 * `box-shadow` on the sun, and `background-color` on a full-screen layer. Those
 * lay out and repaint the whole viewport on every frame of a 1.6s transition,
 * which the performance rule rules out.
 *
 * So the whole atmosphere is rebuilt on transform and opacity only:
 *
 *   - The sky is a stack of opaque solid-colour layers that cross-fade. No
 *     colour is ever interpolated at paint time; only opacity changes.
 *   - The sun is one transformed element (translate + scale) carrying a stack
 *     of cross-fading colour discs, so its colour changes the same cheap way.
 *     Its glow is part of each disc's gradient rather than an animated shadow.
 *   - Stars are opacity alone.
 *
 * Everything above is driven by ONE scalar — `pos`, a position in keyframe
 * space, where 2.4 means "40% of the way from keyframe 2 to keyframe 3". Both
 * modes below are just different ways of moving that number.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "@/lib/motion-controller";

gsap.registerPlugin(ScrollTrigger);

export type SkyPhase = {
  id: string;
  /** Sun centre as a fraction of the viewport. y grows downward. */
  sunX: number;
  sunY: number;
  sunScale: number;
  /** 0..1 */
  stars: number;
  /**
   * Hold the atmosphere still across this beat instead of ramping through it.
   *
   * Used for Truth. The sketch library is explicit that Truth is the one
   * section where time stops, and the house style note says truth-telling
   * sections move less than the rest of the site, not more.
   */
  hold?: boolean;
};

export type SkyClockMode = "scrubbed" | "phased";

export type SkyClockOptions = {
  reduced: boolean;
  mode: SkyClockMode;
  phases: SkyPhase[];
  /** Told which phase is current, so the page can label it. */
  onPhase?: (index: number) => void;
};

/**
 * A hold phase contributes two identical keyframes, so the ramp between them is
 * flat and the atmosphere genuinely stops rather than merely slowing.
 *
 * Exported because the markup has to render one sky layer and one sun disc per
 * keyframe: if the component derived that list separately the two would drift
 * apart and the cross-fade would address the wrong element.
 */
export function toKeyframes<T extends { hold?: boolean }>(phases: T[]): T[] {
  return phases.flatMap((phase) => (phase.hold ? [phase, phase] : [phase]));
}

export function createSkyClock(
  host: HTMLElement,
  { reduced, mode, phases, onPhase }: SkyClockOptions,
): MotionModule {
  const beats = [...host.querySelectorAll<HTMLElement>("[data-beat]")];
  const skyLayers = [...host.querySelectorAll<HTMLElement>("[data-sky-layer]")];
  const sunDiscs = [...host.querySelectorAll<HTMLElement>("[data-sun-disc]")];
  const sunTrack = host.querySelector<HTMLElement>("[data-sun-track]");
  const stars = host.querySelector<HTMLElement>("[data-stars]");

  const keyframes = toKeyframes(phases);

  /** keyframe index -> phase index, for reporting and for phased targets. */
  const phaseOfKeyframe: number[] = [];
  phases.forEach((phase, index) => {
    phaseOfKeyframe.push(index);
    if (phase.hold) phaseOfKeyframe.push(index);
  });

  /** Normalised scroll position of each keyframe. Filled in on refresh. */
  let stops: number[] = [];

  const state = { pos: 0 };
  let lastPhase = -1;

  let trigger: ScrollTrigger | null = null;
  const beatTriggers: ScrollTrigger[] = [];
  let tween: gsap.core.Tween | null = null;

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  /** The single write path. Everything the atmosphere does happens here. */
  function apply(pos: number) {
    const last = keyframes.length - 1;
    const clamped = Math.min(Math.max(pos, 0), last);
    const i = Math.min(Math.floor(clamped), last - 1);
    const t = clamped - i;

    // Opaque layers stacked in order: everything below the current pair is
    // already covered, so it only has to be on.
    skyLayers.forEach((layer, index) => {
      layer.style.opacity =
        index <= i ? "1" : index === i + 1 ? String(t) : "0";
    });
    sunDiscs.forEach((disc, index) => {
      disc.style.opacity =
        index <= i ? "1" : index === i + 1 ? String(t) : "0";
    });

    const from = keyframes[i];
    const to = keyframes[i + 1] ?? from;

    // Under reduced motion the sun does not travel at all. Cutting its position
    // per beat would teleport it across the viewport on every entry, which is a
    // worse thing to do to someone who asked for less movement than simply
    // leaving it where CSS parked it. The sky colour and the stars still cut,
    // so the beat keeps its time of day and no story is lost.
    if (sunTrack && !reduced) {
      const x = lerp(from.sunX, to.sunX, t);
      const y = lerp(from.sunY, to.sunY, t);
      const scale = lerp(from.sunScale, to.sunScale, t);
      // vw/vh in the translate keeps this correct on resize with no listener.
      sunTrack.style.transform = `translate3d(calc(${x * 100}vw - 50%), calc(${y * 100}vh - 50%), 0) scale(${scale})`;
    }

    if (stars) stars.style.opacity = String(lerp(from.stars, to.stars, t));

    // Ink colour is a per-phase step, not a per-frame interpolation — it is a
    // readability decision, and half-way between two text colours is a contrast
    // failure by construction. CSS transitions it.
    const phase = phaseOfKeyframe[t < 0.5 ? i : Math.min(i + 1, last)];
    if (phase !== lastPhase) {
      lastPhase = phase;
      host.dataset.phase = phases[phase].id;
      onPhase?.(phase);
    }
  }

  /**
   * Where each keyframe sits in the scrubbed timeline.
   *
   * A beat owns the moment its centre reaches the centre of the viewport. A
   * held beat instead owns a span — the middle 60% of itself — which is what
   * makes the atmosphere stand still while it is being read.
   */
  function measure() {
    const hostTop = host.getBoundingClientRect().top + window.scrollY;
    const travel = host.offsetHeight - window.innerHeight;
    if (travel <= 0) return;

    const at = (scrollY: number) =>
      Math.min(Math.max((scrollY - hostTop) / travel, 0), 1);

    stops = [];
    beats.forEach((beat, index) => {
      const top = beat.getBoundingClientRect().top + window.scrollY;
      const height = beat.offsetHeight;
      const centre = top + height / 2 - window.innerHeight / 2;

      if (phases[index]?.hold) {
        stops.push(at(centre - height * 0.3), at(centre + height * 0.3));
      } else {
        stops.push(at(centre));
      }
    });
  }

  /** Scroll progress -> position in keyframe space. */
  function posFromProgress(progress: number) {
    if (stops.length < 2) return 0;
    if (progress <= stops[0]) return 0;
    for (let i = 0; i < stops.length - 1; i++) {
      if (progress <= stops[i + 1]) {
        const span = stops[i + 1] - stops[i];
        return i + (span > 0 ? (progress - stops[i]) / span : 0);
      }
    }
    return stops.length - 1;
  }

  function init() {
    if (!beats.length) return;

    if (reduced) {
      // Cut, not slow. The atmosphere still tells the time of day — that is the
      // beat's meaning, and losing it would lose story — but it changes
      // instantly on entry, and `apply` leaves the sun's transform alone.
      host.dataset.reduced = "true";

      // Hand the sun back to CSS. A previous instance of this module may have
      // left an inline transform on it — the module is rebuilt when the motion
      // preference changes mid-session — and without this the sun would freeze
      // at whatever position the animated branch happened to reach, rather than
      // at the one position that was designed for standing still.
      if (sunTrack) sunTrack.style.transform = "";

      beats.forEach((beat, index) => {
        beatTriggers.push(
          ScrollTrigger.create({
            trigger: beat,
            start: "top 60%",
            end: "bottom 40%",
            onToggle: (self) => {
              if (!self.isActive) return;
              const keyframe = phaseOfKeyframe.indexOf(index);
              apply(keyframe < 0 ? index : keyframe);
            },
          }),
        );
      });
      apply(0);
      return;
    }

    delete host.dataset.reduced;

    if (mode === "scrubbed") {
      // The visitor sets the pace. No duration anywhere in this branch, which
      // is why it needs no timing token and never disagrees with one.
      trigger = ScrollTrigger.create({
        trigger: host,
        start: "top top",
        end: "bottom bottom",
        onRefresh: measure,
        onUpdate: (self) => apply(posFromProgress(self.progress)),
      });
      trigger.refresh();
      apply(posFromProgress(trigger.progress));
      return;
    }

    // Phased — the mockup's own model. Each beat snaps the clock to its own
    // time and the atmosphere eases there.
    beats.forEach((beat, index) => {
      beatTriggers.push(
        ScrollTrigger.create({
          trigger: beat,
          start: "top 55%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (!self.isActive) return;
            const keyframe = phaseOfKeyframe.indexOf(index);
            tween?.kill();
            tween = gsap.to(state, {
              pos: keyframe < 0 ? index : keyframe,
              duration: 0.82, // --dur-large
              ease: "expo.out", // country
              overwrite: true,
              onUpdate: () => apply(state.pos),
            });
          },
        }),
      );
    });
    apply(0);
  }

  function destroy() {
    tween?.kill();
    tween = null;
    trigger?.kill();
    trigger = null;
    beatTriggers.forEach((t) => t.kill());
    beatTriggers.length = 0;
    lastPhase = -1;
  }

  return { init, destroy };
}
