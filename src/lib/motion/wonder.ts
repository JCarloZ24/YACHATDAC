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
  const copy = composition("wonder/facts", root, {
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
  let sizing: ResizeObserver | undefined;
  // F7 / the guide leading the eye, 15 Sep 2026: read the whole facts panel
  // before holding. A fixed viewport clipped its last answers on short
  // desktops. Only layout/viewport changes measure this; scroll stays CSS.
  const fit = () => {
    const screen = q(root, "[data-facts-screen]");
    if (screen) root.style.setProperty("--facts-top", `${Math.min(0, window.innerHeight - screen.offsetHeight)}px`);
  };
  return {
    init() {
      copy.init?.();
      fit();
      const screen = q(root, "[data-facts-screen]");
      if (screen) {
        sizing = new ResizeObserver(fit);
        sizing.observe(screen);
      }
      window.addEventListener("resize", fit);
    },
    destroy() {
      sizing?.disconnect();
      sizing = undefined;
      window.removeEventListener("resize", fit);
      root.style.removeProperty("--facts-top");
      copy.destroy?.();
    },
  };
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
export function holdAtFoot(
  root: HTMLElement,
  /**
   * `still`: extra viewports of NOTHING HAPPENING before the next section
   * starts to ride over (16 Sep 2026, user direction on §07: "add more
   * scroll effort before Where you stay"). The pin runs `still` + 1
   * viewports; the first `still` are bought by a top margin on the next
   * element, which scrolls up unseen behind the held section, so the
   * reader turns the wheel and the screen holds — then the cover begins.
   * Applied and cleared here so the markup carries no number.
   *
   * ONE NUMBER PER BREAKPOINT since 17 Sep 2026 (user direction, the phone
   * pass: "reduce scroll effort on Before you come, add scroll effort on
   * Where you stay"). A viewport of stillness is a different length of thumb
   * on a phone than of wheel on a desktop, so `still` may be `{ wide, phone }`
   * — `wide` above Tailwind's `lg` (64rem), `phone` below it — and a plain
   * number is both. The two branches are separate matchMedia contexts, so a
   * window crossing the breakpoint re-seats the hold at the other length.
   */
  { still = 0 }: { still?: number | { wide: number; phone: number } } = {},
): MotionModule {
  let cleanup: (() => void) | undefined;
  const stillness = typeof still === "number" ? { wide: still, phone: still } : still;
  return {
    init() {
      cleanup?.();
      const media = gsap.matchMedia();
      const hold = (query: string, still: number) => media.add(query, () => {
        // The next thing in flow — the sibling of the pin-spacer once the
        // pin has wrapped this section, which is why it is read lazily.
        const next = () => (root.parentElement?.classList.contains("pin-spacer")
          ? root.parentElement : root)?.nextElementSibling as HTMLElement | null;
        const gap = () => {
          const el = next();
          if (el && still > 0) gsap.set(el, { marginTop: still * window.innerHeight });
        };
        // A HELD SECTION IS NEVER SHORTER THAN THE SCREEN (18 Sep 2026, user
        // report with a 534 × 1096 capture: "bugs in those 3 overlapping
        // sections, the hero section got out"). Pinned at its foot, a section
        // shorter than the viewport leaves a band above itself that nothing
        // owns; once the section before it un-pins and scrolls away, that
        // band showed the sticky hero film behind the page. §08 on a tall
        // phone is ~750px. `lvh` for the reason the hero's film is (Android's
        // retracting bar); `vh` first for a browser without it. Set here, not
        // in markup, so ordinary flow (reduced motion) keeps natural heights.
        root.style.minHeight = "100vh";
        root.style.minHeight = "100lvh";
        ScrollTrigger.create({
          trigger: root,
          start: "bottom bottom",
          end: () => `+=${window.innerHeight * (1 + still)}`,
          pin: true,
          pinSpacing: false,
          onRefreshInit: gap,
          // 15 Sep 2026, reported downward jump at the evergreen seam:
          // engage just ahead of a fast scroll crossing so the browser
          // cannot paint the section past its seat and then snap it back.
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });
        gap();
        return () => {
          root.style.minHeight = "";
          const el = next(); if (el) gsap.set(el, { clearProps: "marginTop" });
        };
      }, root);
      // 1023.98px is the complement of `lg` (64rem = 1024px), the one
      // breakpoint the V2 file has; the two queries never both match.
      hold("(prefers-reduced-motion: no-preference) and (min-width: 64rem)", stillness.wide);
      hold("(prefers-reduced-motion: no-preference) and (max-width: 1023.98px)", stillness.phone);
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
 * §07 IS EMPHASISED, 16 September 2026 (user direction: "emphasize Before you
 * come — make it sticky, animate the numbers and texts on reveal, and pop the
 * cta button once when user views this section, then overlap the next section
 * on scroll like the hero"). With `emphasis` on:
 *   - the figures in the fact cells COUNT UP as their cell arrives (`tally`,
 *     grammar "arriving quietly", Wonder §07 figures) — 120km and 8,870
 *     hectares, figures of distance and of land HELD, so the count-up ban on
 *     figures of loss does not reach them; the year 2020 is left alone;
 *   - the body paragraphs arrive after the cells, which they did not before;
 *   - the call to action's beat leaves this scrubbed entrance and becomes
 *     `ctaPop` below, a one-shot that plays when the button is first seen;
 *   - the section holds at its foot while §08 rides over it — that is
 *     `holdAtFoot`, wired in Motion.tsx before this module.
 * §12 keeps the original quiet cut: nothing rides over it, and the footer is
 * not allowed to (user direction, 14 September 2026).
 *
 * Hooks: `[data-cell]` the fact cells, `[data-cell] dd` the values counted,
 * `[data-body] p` the paragraphs, `[data-cta]` the button row.
 */
export function conversion(
  root: HTMLElement,
  span: number,
  { emphasis = false }: { emphasis?: boolean } = {},
): MotionModule {
  return composition("wonder/conversion", root, {
    channel: "none",
    span,
    uses: emphasis ? ["settle", "arrive", "hold", "tally"] : ["settle", "arrive", "hold"],
    build: (tl) => {
      tl.hold(root, { duration: DUR.large });
    },
    enter: (tl) => {
      const eyebrow = q(root, "[data-eyebrow]");
      const heading = q(root, "h2");
      const cells = qa(root, "[data-cell]");
      if (eyebrow) tl.arrive(eyebrow);
      if (heading) tl.settle(heading, {}, 0.1);
      if (cells.length) tl.arrive(cells, { stagger: 0.06 }, 0.3);
      if (emphasis) {
        const values = qa(root, "[data-cell] dd");
        const paras = qa(root, "[data-body] p");
        // The figures count as their cells land: same start, same stagger,
        // so a number is never seen counting in a cell that is not there.
        if (values.length) tl.tally(values, { stagger: 0.06 }, 0.36);
        if (paras.length) tl.arrive(paras, { stagger: 0.08 }, 0.5);
        return;
      }
      const cta = q(root, "[data-cta]");
      if (cta) {
        // The single beat. `back` is permitted since F8 lifted the overshoot
        // ban; one seat, not a pulse, and it plays after everything else has
        // stopped so it reads as an offer rather than an alarm. §12 only —
        // §07's button pops on its own clock (`ctaPop`) and returned above.
        // (A same-day extension of the pop to §12 was reverted on user
        // direction, 16 September 2026.)
        tl.from(cta, { y: 12, opacity: 0, duration: DUR.medium, ease: "back.out(1.4)" }, 0.5);
      }
    },
    enterStart: "top 78%",
    cut: clearAll,
  });
}

/**
 * §07's call to action POPS ONCE when the reader first sees it (user
 * direction, 16 September 2026). Grammar: "pops", Wonder §07 call to action.
 * Pops every child of the row, a beat apart, should a row ever hold two.
 *
 * Not part of `conversion`'s entrance because every Wonder entrance is
 * scrubbed and reversible (9 September 2026), and a pop that scrubs is a
 * button growing under the wheel. This plays on its own clock the first time
 * the button crosses 88% of the viewport and does not reverse; a later
 * crossing asks a finished tween to play, which costs nothing. Restored
 * scroll positions past the button land on its final state (`onRefresh`),
 * so a hash link or a reload cannot leave it hidden.
 *
 * `pinnedContainer`: §07 is held at its foot by `holdAtFoot`, registered
 * before this in Motion.tsx, so a refresh mid-hold measures the button
 * unpinned. Reduced motion: the button simply stands.
 *
 * Hook: `[data-cta]`.
 *
 * `pinned: false` (Partnerships, 16 September 2026) omits `pinnedContainer`:
 * on a host nothing pins, naming it as one left the trigger's start unset and
 * the pop never played. Wonder's callers keep the default.
 */
export function ctaPop(root: HTMLElement, { pinned = true } = {}): MotionModule {
  let cleanup: (() => void) | undefined;
  return {
    init() {
      cleanup?.();
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const cta = q(root, "[data-cta]");
        if (!cta) return;
        // Each button on its own, a short stagger between them; a row that
        // has one child pops as one.
        const buttons = Array.from(cta.children) as HTMLElement[];
        // ⚠ CLEARED ON COMPLETION (16 September 2026, Partnerships: "get in
        // touch blob buttons don't have hover effects"). GSAP leaves inline
        // `translate: none; scale: none; transform: …` on the button once the
        // pop has landed, and Tailwind v4's hover lift is the `translate` and
        // `scale` properties — so the inline rest state overrode the hover
        // for good. At rest the button's own styles are the finished state;
        // clearing hands it back. `progress(1)` in onRefresh completes too.
        const targets = buttons.length ? buttons : cta;
        // ⚠ NO CSS TRANSITION WHILE IT POPS (Wonder, 16 September 2026:
        // "the cta button in before you come is not popping"). BlobButton
        // carries `transition-transform` for its hover, and a CSS
        // transition on the property GSAP writes every frame smears the
        // overshoot into a plain fade — the button eased in, it never
        // popped. Switched off for the beat only; the `clearProps` in
        // onComplete hands the hover transition back once it has landed.
        //
        // ⚠ INSIDE THE BEAT, NOT IN onEnter (Partnerships, 17 September
        // 2026: "the hover effect on these 2 buttons is not the same as see
        // the ways in"). onEnter fires on EVERY downward crossing of 88%, and
        // `play()` on a finished timeline does nothing — so a reader who
        // scrolled past the button, back up and down again got `transition:
        // none` written a second time with no completion to clear it, and
        // the hover lift snapped instead of easing. As a step at 0 the
        // switch-off exists only while the beat runs, and a replay that goes
        // nowhere writes nothing.
        const beat = gsap
          .timeline({ paused: true, onComplete: () => gsap.set(targets, { clearProps: "all" }) })
          .set(targets, { transition: "none" }, 0)
          .pop(targets, { stagger: 0.12 }, 0);
        ScrollTrigger.create({
          trigger: cta,
          start: "top 88%",
          ...(pinned ? { pinnedContainer: root } : {}),
          onEnter: () => beat.play(),
          onRefresh: (self) => { if (self.scroll() >= self.start) beat.progress(1); },
        });
      }, root);
      cleanup = () => media.revert();
    },
    destroy() { cleanup?.(); cleanup = undefined; },
  };
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

/**
 * §09 — WHAT IT IS LIKE OUT HERE. The stepped read.
 *
 * Grammar: "accumulating", Wonder Out here (user direction 14 September 2026).
 * SUPERSEDES the 80vh still hold for this section only — Turraburra keeps it.
 *
 * The landscape is not this composition's business. `wonderLandscape` seats it
 * over the 100vh approach and holds it with CSS stickiness, and it is finished
 * before a single step turns. That is what lets this screen be loud in TYPE
 * without breaking F7: the media channel was spent, in full, first.
 *
 * NOT PINNED. docs/design/README.md — "the page's one pin belongs to §05 The
 * Spring and is not spent twice". The hold here is the CSS module's sticky
 * screen; this composition only buys the scroll span the sticky holds through,
 * and would fight the sticky for the scrollbar if it pinned.
 *
 * THE TIMELINE IS FIVE UNITS, ONE PER STEP. `stepArrive` and `stepCounter`
 * place their transitions on integer positions, so adding them at 1 lands the
 * turns on units 1, 2, 3 and 4 — each step holds for most of its own unit and
 * turns over at the boundary. One unit is 70vh of scroll: ~21vh of that is the
 * turn, the remaining ~49vh is reading. The empty tween at the end is what
 * gives the LAST step a hold: without it the timeline would end at 4.3 and the
 * fifth point would get two thirds of the scroll the other four got.
 *
 * NO SNAP, deliberately. The Spring's snap was removed because `1/(steps - 1)`
 * landed mid-flap once `[data-release]` had stretched its timeline, and the
 * same trap is here — rest positions sit at progress 0.1/0.3/0.5/0.7/0.9, not
 * on quarters. Being stranded mid-turn is also far less wrong for a sentence
 * than for a numeral, where a half-transitioned "3.5" is a lie about what is
 * being counted. If it ever needs snapping, the fix is `snapTo` as an ARRAY of
 * those five positions, which needs CompositionSpec.snap widened.
 *
 * Hooks, all of them inside the section:
 *   [data-step-index]  the quiet "02 / 05", one per point
 *   [data-step-word]   the display word, one per point
 *   [data-step-point]  the statement itself, one per point
 *   [data-step-rule]   the single gold bar that fills across the whole track
 *   [data-ground]      the stacked photographic plates, one per point
 */
export function outHereTrack(root: HTMLElement, stepVh = 70): MotionModule {
  const indices = qa(root, "[data-step-index]");
  const words = qa(root, "[data-step-word]");
  const points = qa(root, "[data-step-point]");
  const rule = q(root, "[data-step-rule]");
  // The plates are NOT inside the trigger. `LandscapeBackdrop` is a SIBLING of
  // this section inside the scene wrapper — it has to be, because the backdrop
  // spans both grid rows and sticks while the section scrolls past it. So the
  // grounds are reached through the parent, not through `root`.
  const grounds = qa(root.parentElement ?? root, "[data-ground]");
  const steps = points.length;

  return composition("wonder/out-here", root, {
    channel: "type",
    span: steps * stepVh,
    pin: false,
    uses: ["stepCounter", "stepArrive", "dissolve"],
    build: (tl) => {
      if (steps < 2) return;

      // Stack the steps. Until this lands, the served markup is an ordinary
      // flowing list — the no-JS state, and what a screen reader reads. Doing
      // it here rather than in the markup is the whole reason this section
      // degrades to a readable document. Removed again by `cut`, which is the
      // branch a reader flipping on reduced motion arrives in.
      root.setAttribute("data-steps", "");

      // 0.3 of a unit ≈ 21vh at a 70vh step: long enough to read as a turn,
      // short enough that the reader is never parked in one. `stepArrive`
      // splits it in half — out, then in — so the two never overlap.
      const turn = 0.3;

      tl.stepArrive(words, { duration: turn, ease: EASE.country }, 1);
      tl.stepArrive(points, { duration: turn, ease: EASE.country }, 1);
      // The index is a single numeral pair and the crossfade is invisible on
      // it, so it takes the plain sibling rather than the sequenced one.
      tl.stepCounter(indices, { duration: turn, ease: EASE.machine }, 1);

      // The ground hands over with the step. `dissolve` and nothing else:
      // it is the one media effect the grammar permits on held material —
      // it never scrubs, masks, pushes or warps a plane, it hands one whole
      // frame to another, which is how film has always moved between two
      // records. That is what keeps this screen loud in TYPE rather than
      // turning five full-bleed changes into a media moment.
      //
      // Pairwise, because `dissolve` takes exactly [from, to]. Same position
      // and duration as the text turn, so the whole screen changes together —
      // and because the cross-fade overlaps where the text does not, the
      // photograph is what carries continuity across the cut.
      for (let i = 0; i + 1 < grounds.length; i += 1) {
        tl.dissolve([grounds[i], grounds[i + 1]], { duration: turn, ease: EASE.country }, i + 1);
      }

      // The mark fills — "accumulating", and the answer to "how much is left"
      // on a section this long. scaleX from a left origin: a transform, never
      // a width. Linear, because it is reporting scroll position, not
      // performing; an eased progress bar lies about where the reader is.
      if (rule) {
        tl.fromTo(
          rule,
          { scaleX: 1 / steps },
          { scaleX: 1, duration: steps, ease: EASE.machine },
          0,
        );
      }

      // Pads the timeline to a whole number of steps so the last one holds for
      // its full unit. An empty tween is the GSAP idiom for this; it animates
      // nothing and exists only to set the duration.
      tl.to({}, { duration: steps }, 0);
    },
    cut: (el) => {
      // Back to the document: unstack, and let every point stand in flow.
      el.removeAttribute("data-steps");
      clearAll(el);
    },
  });
}
