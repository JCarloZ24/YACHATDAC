"use client";

/**
 * 01 · Wonder — the page's compositions. Verb: ARRIVES.
 *
 * The plan is docs/motion/wonder-plan.md (9 September 2026, user direction).
 * The page closes a distance: a film shot from the air, then where it sits on
 * a map, then the road in, then the ground at Turraburra, then the days
 * themselves. Every screen below is one step nearer, and each one declares its
 * loud channel so compose.ts can assert F7's pacing law rather than trusting
 * anybody to remember it.
 *
 * The two drawn maps (§02, §04) are NOT here. They are their own module,
 * src/lib/motion/route-map.ts, because they are scrubbed SVG stroke work with
 * their own markup contract; these compositions animate the copy and the
 * plates around them.
 *
 * MARKUP CONTRACT. Sections stamp `data-wonder="<name>"` on the element a
 * composition is measured against, and the hooks each builder names in its own
 * doc comment. The server owns structure; nothing here creates or removes a
 * node.
 *
 * GRADE. Every photograph on this page of a person, of Country or of a
 * cultural site is `frame` grade and carries `data-motion="frame"` on its
 * image element, which is what `movable()` filters on. So `pushIn` and
 * `plateParallax` move the plate and leave the picture alone, and `bleed`
 * counter-scales the media by construction. No effect below deforms an image
 * plane. Exception, user direction 9 September 2026: Turraburra and Out here
 * now share the full-motion landscape in wonder-landscape.ts.
 */

import { clearAll, composition as createComposition, type CompositionSpec } from "@/lib/motion/compose";
import { DUR, EASE } from "@/lib/motion/tokens";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "@/lib/motion-controller";

const q = <T extends HTMLElement>(root: HTMLElement, sel: string) =>
  root.querySelector<T>(sel);
const qa = <T extends HTMLElement>(root: HTMLElement, sel: string) =>
  Array.from(root.querySelectorAll<T>(sel));

// User direction, 9 September 2026: X4 entrances follow scroll in both
// directions throughout Wonder. The shared composition keeps its opt-in API.
const composition = (name: string, root: HTMLElement, spec: CompositionSpec) =>
  createComposition(name, root, { ...spec, enterScrub: true });

/**
 * §01 — the hero. The film is the loud channel and it is already playing, so
 * this adds exactly two things: the H1 rises behind its own line, and the
 * scrim ramps as the hero is scrolled past so the title stays legible over
 * whatever frame the edit happens to be on.
 *
 * Hooks: `[data-wonder-title]` the H1, `[data-wonder-scrim]` the gradient.
 *
 * The hero is CSS-sticky (Sections.tsx, 8 Sep 2026) rather than pinned by
 * ScrollTrigger, so this composition must not pin — it would fight the sticky
 * and steal the scrollbar.
 */
export function heroArrival(root: HTMLElement, span: number): MotionModule {
  return composition("wonder/hero", root, {
    channel: "media",
    span,
    uses: ["settle", "scrimRamp"],
    build: (tl) => {
      const scrim = q(root, "[data-wonder-scrim]");
      if (scrim) tl.scrimRamp(scrim, { from: 0.85, to: 1 });
    },
    enter: (tl) => {
      const title = q(root, "[data-wonder-title]");
      if (title) tl.settle(title);
    },
    cut: clearAll,
  });
}

/**
 * §02 — the facts. The map draws itself (route-map.ts); this is the copy
 * beside it, arriving in three tiers while it does. Anchor is the standfirst,
 * mid is the row of chips, detail is the six fact pairs — so the sentence
 * lands, then what it is about, then the particulars.
 *
 * Hooks: `[data-tier]` on each arriving element.
 *
 * X4's Wonder cut follows scroll, alongside the map, in both directions.
 */
export function factsCopy(root: HTMLElement, span: number): MotionModule {
  return composition("wonder/facts", root, {
    channel: "media",
    span,
    uses: ["triad"],
    build: () => {},
    enter: (tl) => {
      const tiers = qa(root, "[data-tier]");
      if (tiers.length) tl.triad(tiers);
    },
    enterStart: "top 70%",
    cut: clearAll,
  });
}

/**
 * §03 — Highlights, and §11 — From Country. NOT HERE ANY MORE.
 *
 * Both rails took The Record's card entrance on 14 September 2026 (user
 * direction: one card entrance across the pages, "the record style") —
 * `createRecordMasonry` in lib/motion/record-masonry.ts, wired from
 * _components/Motion.tsx with the rail's own hooks. The `cardRail`
 * composition that lived here (`arrive`, whole card, no stagger — 10 Sep
 * 2026) is gone with it rather than left as a second entrance the hook could
 * silently re-attach to. Its lineage is in git and in
 * docs/motion/wonder-plan.md §03.
 *
 * `[data-frame-media]` and `[data-card-copy]` stay in the markup as the
 * frame-grade and layout hooks they also are. The grade holds: the pass moves
 * the whole plate on y and never the picture inside it.
 */

/**
 * A section HOLDS AT ITS FOOT while the next one rides up over it.
 *
 * Three seams take it (14 September 2026, user direction, in two asks the
 * same day): §06 → §07, "the itinerary section will not move on the end";
 * then §11 From Country → §12 Take it with you, "use the same motion". Not
 * §12 → the footer: "do not make the footer overlap" (same day). One module,
 * two registrations in Motion.tsx.
 *
 * The first ask, for the record: the itinerary HOLDS AT ITS FOOT while Before you come rides up
 * over it (14 September 2026, user direction: "the itinerary section will not
 * move on the end, the Before you come section will overlap the itinerary
 * section, just like the hero and second section movement").
 *
 * The hero does this with `sticky top-0`: it is one screen tall, so its top
 * can pin at the viewport's top and the facts wave scrolls over it. The
 * itinerary is several screens tall and an accordion that changes height, so
 * a sticky top would trap its lower stops out of reach. Instead the section
 * is pinned by ScrollTrigger at the moment its FOOT meets the viewport's
 * foot, with no pin spacing, for as long as it takes §07 to travel one
 * viewport up over it. §07 is positioned and later in the document, so it
 * paints above the pinned section, wave first — the same read as §01 → §02.
 *
 * Grammar: "a change of ground", the incoming ground covering the held one
 * (the hero's own row). Transition channel; the section's entrances are
 * unchanged. Reduced motion keeps ordinary flow.
 *
 * The end is measured on refresh, so an accordion stop opening or closing
 * (which Motion.tsx already answers with a debounced refresh) re-seats it.
 */
export function holdAtFoot(root: HTMLElement): MotionModule {
  let cleanup: (() => void) | undefined;
  return {
    init() {
      cleanup?.();
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.create({
          trigger: root,
          start: "bottom bottom",
          end: () => `+=${window.innerHeight}`,
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
      }, root);
      cleanup = () => media.revert();
    },
    destroy() { cleanup?.(); cleanup = undefined; },
  };
}

/**
 * Former §09 composition, superseded by wonder-landscape.ts on 9 Sep 2026.
 *
 * WAS the page's one change of ground, and is not any more (9 Sep 2026, user
 * report). The `ground` sweep was drawn as a translucent evergreen band
 * rising up the foot of the plate, and on a sunset photograph it read as a
 * green film over the picture rather than as one ground handing to another.
 * A wipe needs two grounds to be between. Removed rather than tuned: there is
 * no join here for it to happen at.
 *
 * What is left is the landscape treatment — the plate bleeds past its edge,
 * the scrim ramps, the copy arrives. Turraburra's newer sticky landscape is
 * shared with this section in wonder-landscape.ts (9 September 2026).
 */
export function groundChange(root: HTMLElement, span: number): MotionModule {
  return composition("wonder/out-here", root, {
    channel: "media",
    span,
    uses: ["bleed", "scrimRamp", "settle", "arrive"],
    build: (tl) => {
      const plate = q(root, "[data-plate]");
      const scrim = q(root, "[data-wonder-scrim]");
      if (plate) tl.bleed(plate, { amount: 1.08, ease: EASE.machine }, 0);
      if (scrim) tl.scrimRamp(scrim, { from: 0.6, to: 1 }, 0);
    },
    enter: (tl) => {
      const heading = q(root, "[data-plate-copy] h2");
      const rest = qa(root, "[data-plate-copy] li");
      if (heading) tl.settle(heading);
      if (rest.length) tl.arrive(rest, { stagger: 0.05 }, 0.2);
    },
    cut: clearAll,
  });
}

// Stateful native disclosures, restored on user direction, 9 September 2026.
export { itinerary } from "./wonder-itinerary";

/**
 * §07 — Before you come, and §12 — Come and see it. The two conversion points,
 * and deliberately the quietest screens on the page.
 *
 * `hold` with `arrive` on the cells. The call to action gets ONE attention
 * beat once the section has settled, and never a loop: a pulsing button on a
 * coloured band is the fastest way to make a page look like an advertisement,
 * and both of these screens are asking somebody to get in touch.
 *
 * Hooks: `[data-cell]` the fact cells, `[data-cta]` the button row.
 */
export function conversion(root: HTMLElement, span: number): MotionModule {
  return composition("wonder/conversion", root, {
    channel: "none",
    span,
    uses: ["settle", "arrive", "hold"],
    build: (tl) => {
      tl.hold(root, { duration: DUR.large });
    },
    enter: (tl) => {
      const eyebrow = q(root, "[data-eyebrow]");
      const heading = q(root, "h2");
      const cells = qa(root, "[data-cell]");
      const cta = q(root, "[data-cta]");
      if (eyebrow) tl.arrive(eyebrow);
      if (heading) tl.settle(heading, {}, 0.1);
      if (cells.length) tl.arrive(cells, { stagger: 0.06 }, 0.3);
      if (cta) {
        // The single beat. `back` is permitted since F8 lifted the overshoot
        // ban; one seat, not a pulse, and it plays after everything else has
        // stopped so it reads as an offer rather than an alarm.
        tl.from(cta, { y: 12, opacity: 0, duration: DUR.medium, ease: "back.out(1.4)" }, 0.5);
      }
    },
    enterStart: "top 78%",
    cut: clearAll,
  });
}

/**
 * §08 — Where you stay. The heading and the copy enter; the pictures do not.
 *
 * 9 Sep 2026, image-quality pass: the supplied photos contain people and have
 * limited resolution. Remove the parallax and overscale so their framing and
 * detail hold.
 *
 * 10 Sep 2026, August's direction: the two cards became a ten-frame carousel
 * and their `frameOpen` entrance is gone with them. A rail cannot stage an
 * arrival per card — eight of the ten are off-screen at rest, so they would
 * either play unseen or pop as the reader swipes them in, and neither is an
 * entrance. `[data-card]` is no longer in the markup, so the hook cannot
 * silently re-attach either. Grammar: "what endures" / settle; "arriving
 * quietly" / arrive; "the rest" / hold. `frameOpen` no longer used here.
 *
 * Hooks: `[data-card-copy]`. The rail itself carries no motion hook; its
 * pictures keep `[data-frame-media][data-motion="frame"]` so the grade is
 * still declared and still enforced by MediaTile.
 */
export function sleepCards(root: HTMLElement, span: number): MotionModule {
  return composition("wonder/sleep", root, {
    channel: "media",
    span,
    uses: ["hold", "settle", "arrive"],
    build: (tl) => {
      tl.hold(root, { duration: DUR.large });
    },
    enter: (tl) => {
      const heading = q(root, "h2");
      const body = q(root, "[data-card-copy]");
      if (heading) tl.settle(heading);
      if (body) tl.arrive(body, {}, 0.15);
    },
    cut: clearAll,
  });
}

/**
 * §10 — Your hosts. The copy arrives; the photograph does not move at all.
 *
 * The pointer interaction that names three of the eight people in the frame is
 * NOT here — it is stateful (pointer and focus listeners), and stateful things
 * are modules, not effects. See _components/HostNames.tsx.
 */
export function hostsCopy(root: HTMLElement, span: number): MotionModule {
  return composition("wonder/hosts", root, {
    channel: "none",
    span,
    uses: ["settle", "arrive", "hold"],
    build: (tl) => {
      tl.hold(root, { duration: DUR.large });
    },
    enter: (tl) => {
      const eyebrow = q(root, "[data-eyebrow]");
      const heading = q(root, "h2");
      // `:not([data-eyebrow])` is load-bearing. The eyebrow is a <p> inside
      // the same block, so without it the eyebrow gets TWO `from` tweens —
      // and `from` animates to the element's CURRENT value, which the first
      // tween has already set to opacity 0. The second tween then dutifully
      // animates from 0 to 0 and the eyebrow never appears. That is exactly
      // how "Your hosts" went missing (reported 9 Sep 2026).
      const body = qa(root, "[data-plate-copy] p:not([data-eyebrow])");
      const plate = q(root, "[data-card]");
      if (eyebrow) tl.arrive(eyebrow);
      if (heading) tl.settle(heading, {}, 0.1);
      if (body.length) tl.arrive(body, { stagger: 0.05 }, 0.25);
      // The frame opens; the faces inside it hold. `scale: 1` is the grade
      // pin — the corollary that governs every portrait on this site.
      if (plate) tl.frameOpen(plate, { edge: "right", scale: 1 }, 0.2);
    },
    cut: clearAll,
  });
}

/**
 * §04 — Getting here. The route map draws itself (route-map.ts); this is the
 * charcoal screen's copy arriving under it, in stop order, so the list reads
 * as an itinerary being written rather than a block appearing.
 *
 * Hooks: `[data-eyebrow]`, the h2, `[data-cell]` per stop.
 */
export function gettingHereCopy(root: HTMLElement, span: number): MotionModule {
  return composition("wonder/getting-here", root, {
    channel: "media",
    span,
    uses: ["settle", "arrive"],
    build: () => {},
    enter: (tl) => {
      const eyebrow = q(root, "[data-eyebrow]");
      const heading = q(root, "h2");
      const cells = qa(root, "[data-cell]");
      if (eyebrow) tl.arrive(eyebrow);
      if (heading) tl.settle(heading, {}, 0.1);
      if (cells.length) tl.arrive(cells, { stagger: 0.08 }, 0.25);
    },
    enterStart: "top 70%",
    cut: clearAll,
  });
}
