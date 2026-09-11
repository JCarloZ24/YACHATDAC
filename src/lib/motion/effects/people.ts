"use client";

/** Our People, user direction 11 September 2026 (F7, SCR-02 / SCR-09).
 * Grammar: peopleJourney, peopleGather, peopleKnockout and peopleGround.
 * One reading clock drives the camera, HTML track and all interior effects.
 * A unit is 100vh; the module supplies measurements, never content strings.
 */
import gsap from "gsap";

export type PeopleState = { travel: number; knockout: number };
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

  // P4 / L3. Only the frame translates. The canvas counter-registers the
  // photograph to its final location; a face never scales, tilts or warps.
  gsap.registerEffect({
    name: "peopleGather",
    extendTimeline: true,
    defaults: { duration: 0.65, distance: 80, stagger: 0.08 },
    effect: (targets: object, config: Record<string, unknown>) =>
      gsap.fromTo(targets, {
        x: (index: number) => (index % 2 ? 1 : -1) * (config.distance as number),
      }, {
        x: 0, duration: config.duration as number, stagger: config.stagger as number,
        ease: "country", immediateRender: true,
      }),
  });

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
  gsap.registerEffect({
    name: "peopleGround",
    extendTimeline: true,
    defaults: { duration: 0.5, crest: false },
    effect: (targets: object, config: Record<string, unknown>) =>
      config.crest ? gsap.fromTo(targets, { scaleY: 0.25, transformOrigin: "50% 100%" }, {
        scaleY: 1, duration: config.duration as number, ease: "none",
      }) : gsap.fromTo(targets, { clipPath: "inset(0 100% 0 0)" }, {
        clipPath: "inset(0 0% 0 0)", duration: config.duration as number, ease: "none",
      }),
  });
}
