"use client";

/** Our People, user direction 11 September 2026 (F7, SCR-02 / SCR-09).
 * Grammar: peopleJourney, peopleKnockout and peopleGround. The team cards
 * take The Record's card entrance instead of an effect of their own — see
 * `cardPassOpacity` in ../record-masonry.ts and the pass in ../our-people.ts.
 * One reading clock drives the camera, HTML track and all interior effects.
 * A unit is 100vh; the module supplies measurements, never content strings.
 */
import gsap from "gsap";
import { WAVE_ROLL } from "@/components/ui/Furniture";

/** `reveal`: 0 = advisory on black, 1 = hero photograph fully in (14 Sep 2026). */
export type PeopleState = {
  travel: number; knockout: number; reveal: number;
  /** Hero held under Suzanne (14 Sep 2026): px the hero is counter-moved,
   * and the screen y of Suzanne's top edge, below which the hero is hidden. */
  heroOffset?: number; heroFloor?: number;
};
export type PeopleStop = { y: number; hold: number; key: string; travelVh?: number };
export type PeopleLeg = { from: number; to: number; start: number; end: number };
export const PEOPLE_HANDOFF_VH = 220;
export const PEOPLE_PHOTO_HOLD = 0.35;

/** First arrival at a document distance, including every preceding hold. */
export function peopleTimeAt(legs: PeopleLeg[], y: number): number {
  for (const leg of legs) {
    if (y <= leg.to && leg.to > leg.from) {
      const progress = gsap.utils.clamp(0, 1, (y - leg.from) / (leg.to - leg.from));
      return leg.start + (leg.end - leg.start) * progress;
    }
  }
  return legs.at(-1)?.end ?? 0;
}

let registered = false;
export function registerPeople(): void {
  if (registered) return;
  registered = true;
  gsap.registerEffect({
    name: "peopleJourney",
    extendTimeline: true,
    defaults: {},
    effect: (_targets: object, config: Record<string, unknown>) => {
      const state = config.state as PeopleState;
      const stops = config.stops as PeopleStop[];
      const legs = config.legs as PeopleLeg[];
      const viewport = config.viewport as number;
      const timeline = gsap.timeline({ paused: true });
      let from = 0;
      for (const stop of stops) {
        const duration = stop.y > from ? (stop.travelVh === undefined
          ? (stop.y - from) / viewport : stop.travelVh / 100) : 0;
        const start = timeline.duration();
        if (duration > 0) timeline.to(state, { travel: stop.y, duration, ease: "none" });
        legs.push({ from, to: stop.y, start, end: start + duration });
        timeline.addLabel(stop.key);
        if (stop.hold) timeline.to(state, { travel: stop.y, duration: stop.hold, ease: "none" });
        from = stop.y;
      }
      return timeline;
    },
  });

  // `peopleGather` — the alternating left/right card arrival — was DELETED on
  // 14 September 2026 (Marc's review: "some cards go to the left and right").
  // It had already been superseded by a fade in the 14 September build but was
  // still registered, and the canvas was still reading the `x` it wrote on
  // every frame. The cards now take The Record's entrance; see the header.

  // Y1 / P4, user reference to Living Work's Our challenges (11 Sep 2026).
  // One large initial gathers the held photograph into the complete title.
  // The renderer moves the aperture; HTML supplies the quiet supporting copy.
  gsap.registerEffect({
    name: "peopleKnockout",
    extendTimeline: true,
    defaults: { duration: PEOPLE_HANDOFF_VH / 100 },
    effect: (_targets: object, config: Record<string, unknown>) => {
      const duration = config.duration as number;
      const timeline = gsap.timeline();
      timeline.fromTo(config.state as PeopleState, { knockout: 0 }, {
        knockout: 1, duration, ease: "none",
      }, 0);
      if (config.frame) timeline.fromTo(config.frame, { opacity: 1 }, {
        opacity: 0, duration: duration * 0.22, ease: "none",
      }, 0);
      if (config.copy) timeline.fromTo(config.copy, { opacity: 0 }, {
        opacity: 1, duration: duration * 0.24, ease: "country",
      }, duration * 0.72);
      return timeline;
    },
  });

  // X7: a held wave crest rises, or the existing ratio opens without
  // changing its final proportions. Both carry the next solid ground.
  //
  // User direction, 14 September 2026 ("for each wave add animations"): the
  // crest also ROLLS as it rises, and consecutive waves roll from opposite
  // sides so the page's grounds come in towards each other — GATHERS, not
  // About's deck. The roll reuses WaveDivider's three-tile strip exactly as
  // The Record's does: `direction` 1 slides the ink rightwards into its rest
  // at x=0; -1 slides it leftwards into x=-WAVE_ROLL, where the third tile (an
  // untransformed copy of the first) sits in frame, so both directions settle
  // on the drawn shape and neither walks an empty edge in.
  gsap.registerEffect({
    name: "peopleGround",
    extendTimeline: true,
    defaults: { duration: 0.5, crest: false, direction: 1 },
    effect: (targets: object, config: Record<string, unknown>) => {
      const duration = config.duration as number;
      if (!config.crest) return gsap.fromTo(targets, { clipPath: "inset(0 100% 0 0)" }, {
        clipPath: "inset(0 0% 0 0)", duration, ease: "none",
      });
      const rightwards = (config.direction as number) >= 0;
      return gsap.fromTo(targets, {
        x: rightwards ? -WAVE_ROLL * 0.15 : -WAVE_ROLL * 0.85,
        scaleY: 0.25, transformOrigin: "50% 100%",
      }, {
        x: rightwards ? 0 : -WAVE_ROLL, scaleY: 1, duration, ease: "power2.inOut",
      });
    },
  });
}
