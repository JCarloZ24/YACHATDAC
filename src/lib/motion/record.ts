"use client";

/**
 * /the-record — "The Record". The hi-fi's motion (Figma 2463:8492).
 *
 * The page's loud channel is the GRID: entries break out of it to take the
 * whole screen and hand back. Everything else is quiet — arrivals, a slow
 * push on the hero, and questions lighting at their reading position.
 * F7/F8 refinement, 2026-09-08: page and grid have separate lifecycles so
 * filtering cannot leave animations attached to removed rows.
 *
 * MARKUP CONTRACT
 * ---------------
 *   [data-record-hero]           the intro section
 *   [data-record-hero-media]       its photograph — M1 scroll push
 *   [data-record-hero-entry]         entry settle, independent of scroll
 *   [data-record-hero-scrim]       the X5 wash the copy lands on — scrimRamp
 *   [data-record-hero-arrive]      eyebrow and lead; gated on ENTRY, not on view
 *   [data-record-arrive]         anything below the fold that fades up on view
 *   [data-record-frame]          a row of cards and a screen for each of them
 *   data-record-breakout           …and one of them takes the screen unprompted
 *   data-breakout-auto             which one, by slug
 *   [data-breakout-frame]          the one screen they all share; what sticks
 *   [data-breakout-cell]="slug"      a card — measured, never moved. The one
 *                                    that flies is whichever was asked; the
 *                                    others are the neighbours, to 45%
 *   [data-breakout-screen]="slug"  the screen that card becomes
 *   [data-breakout-plate]          the full bleed, fitted onto the cell and grown
 *   [data-breakout-image]            its counter-scale — keeps the plane unwarped
 *   [data-breakout-push]               M1, and ONLY at full grade
 *   [data-breakout-scrim]            the source wash; tied to plate progress
 *   [data-breakout-lane]           the fade behind the index; ramps with the plate
 *   [data-breakout-copy]           the screen's words — arrive AFTER it lands
 *   [data-breakout-arrive]           one line of them
 *   [data-bore-fill]               breakout C's 480m descent, scrubbed
 *   data-motion-grade              full | frame, from the page's media manifest
 *   [data-record-grid]           the grid section (the rail's own scope)
 *   [data-record-rail]             the sticky index; gets data-on-dark
 *   [data-record-breakout]       a full-screen entry passing under the rail
 *   [data-record-gaps]           "What we do not know" — unpinned reading steps
 *   [data-record-gaps-stage]       its content; the optional pin remains disabled
 *   [data-record-gap]              one gap; data-state active | idle
 *   [data-record-gap-marker]       the current question's 3px marker
 *
 * ▲ ARTWORK — the rings, the dotted rules and the dot wave are all static
 * here. Artwork motion is permitted (Ivy, 2026-08-30) but these frames do not
 * ask for it and the frames' own note on section 05 is "nothing performs".
 *
 * REST STATE IS THE FINISHED STATE. Every gap renders lit and every arrival
 * renders in place in the server HTML; this module dims and offsets them on
 * init. With JS off, or under reduced motion, the page is simply there.
 */

import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  RECORD_BREAKOUT_FLIGHT,
  RECORD_STICKY_RAIL,
  RECORD_STICKY_SECTIONS,
} from "./record-flags";
import type { MotionModule } from "@/lib/motion-controller";
import { awaitEntry } from "@/lib/motion/route-entry";
import { registerYachatdacEffects } from "./effects";
import { EASE } from "./tokens";

gsap.registerPlugin(Flip, ScrollTrigger);

const EASE_COUNTRY = EASE.country;

export function createRecord(): MotionModule {
  let ctx: gsap.Context | null = null;

  const init = () => {
    const hero = document.querySelector<HTMLElement>("[data-record-hero]");
    const gaps = document.querySelector<HTMLElement>("[data-record-gaps]");
    if (!hero && !gaps) return;
    if (ctx) return;
    registerYachatdacEffects();

    ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* X6 — reduced motion gets no module at all. The markup already renders
         the finished state, so there is nothing to set. */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let ungate: (() => void) | undefined;
        const restore: Array<() => void> = [];
        /* X4 — arrivals. */
        gsap.utils
          .toArray<HTMLElement>("[data-record-arrive]")
          .forEach((el) => {
            gsap.from(el, {
              opacity: 0,
              y: 18,
              duration: 0.82,
              ease: EASE_COUNTRY,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            });
          });

        /* 01 · the intro — bleed, scrimRamp, settle.
           The photograph is the loud channel, and it is the `country` bucket,
           so the image plane itself may move. M1: it opens pushed in and
           settles; the X5 scrim ramps up beneath the copy while it does, so
           the heading lands on a ground that has already darkened for it.
           The heading's own settle is SplitReveal gate="entry" in the markup —
           both wait on the same gate, so they arrive together. */
        if (hero) {
          const heroMedia = hero.querySelector<HTMLElement>(
            "[data-record-hero-media]",
          );
          const heroEntry = hero.querySelector<HTMLElement>(
            "[data-record-hero-entry]",
          );
          const heroScrim = hero.querySelector<HTMLElement>(
            "[data-record-hero-scrim]",
          );
          const arrivals = gsap.utils.toArray<HTMLElement>(
            "[data-record-hero-arrive]",
            hero,
          );
          gsap.set(heroEntry, { scale: 1.06 });
          gsap.set(heroScrim, { opacity: 0.55 });
          gsap.set(arrivals, { opacity: 0, y: 18 });

          const intro = gsap.timeline({ paused: true });
          intro
            .to(heroEntry, { scale: 1, duration: 1.6, ease: EASE_COUNTRY }, 0)
            .to(
              heroScrim,
              { opacity: 1, duration: 0.9, ease: "power2.inOut" },
              0.1,
            )
            .to(
              arrivals,
              {
                opacity: 1,
                y: 0,
                duration: 0.82,
                ease: EASE_COUNTRY,
                stagger: 0.09,
              },
              0.35,
            );

          ungate = awaitEntry(() => intro.play());

          /* Leaving the hero: the push continues rather than restarting, so
             the scrub picks up from where the entry left the plane. */
          gsap.fromTo(
            heroMedia,
            { scale: 1 },
            {
              scale: 1.08,
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 0.6,
              },
            },
          );
        }

        /* Grammar: accumulating, X3. Questions surface and stay readable. */
        if (gaps) {
          const stage = gaps.querySelector<HTMLElement>(
            "[data-record-gaps-stage]",
          );
          const items = gsap.utils.toArray<HTMLElement>(
            "[data-record-gap]",
            gaps,
          );
          if (items.length) {
            const setActive = (index: number) => {
              items.forEach((item, i) => {
                const state = i <= index ? "active" : "idle";
                item.dataset.state = state;
                const marker = item.querySelector<HTMLElement>(
                  "[data-record-gap-marker]",
                );
                if (marker)
                  marker.dataset.state = i === index ? "active" : "idle";
              });
            };
            setActive(-1);
            restore.push(() => {
              items.forEach((item) => {
                item.dataset.state = "active";
                const marker = item.querySelector<HTMLElement>(
                  "[data-record-gap-marker]",
                );
                if (marker) marker.dataset.state = "idle";
              });
            });

            /* The frame asks for a 300vh pin. Pinning a section only works
               while it fits the viewport, so the pin is taken on large, tall
               screens and everything else gets the same stepping driven by
               the section's own scroll — the reader sees the gaps light in
               order either way, which is the point of the pin. */
            const step = (progress: number) =>
              setActive(
                Math.min(items.length - 1, Math.floor(progress * items.length)),
              );

            const pinnable = "(min-width: 1024px) and (min-height: 900px)";
            const gapMedia = gsap.matchMedia();
            restore.push(() => gapMedia.revert());

            /* The pin is a sticky-section behaviour. With those off the pinned
               branch is simply never registered and EVERY viewport takes the
               scroll-driven one below — the same stepping, without the 300vh.
               The reader still sees the four gaps light in order, which the
               note above calls the point of the pin. */
            if (RECORD_STICKY_SECTIONS)
              gapMedia.add(pinnable, () => {
                const trigger = ScrollTrigger.create({
                  trigger: gaps,
                  pin: stage ?? gaps,
                  start: "top top",
                  end: "+=300%",
                  scrub: true,
                  /* snapped 1/3 — the frame's own note: four stops, three gaps
                   between them. */
                  snap: {
                    snapTo: 1 / Math.max(1, items.length - 1),
                    duration: 0.3,
                  },
                  onUpdate: (self) => step(self.progress),
                });
                return () => trigger.kill();
              });

            gapMedia.add(
              RECORD_STICKY_SECTIONS ? `not all and ${pinnable}` : "all",
              () => {
                // Grammar: accumulating, X3. Unpinned questions light at their
                // own reading position, independent of heading or copy length.
                const triggers = items.map((item, index) =>
                  ScrollTrigger.create({
                    trigger: item,
                    start: "top 70%",
                    onEnter: () => setActive(index),
                    onLeaveBack: () => setActive(index - 1),
                  }),
                );
                return () => triggers.forEach((trigger) => trigger.kill());
              },
            );
          }
        }
        return () => {
          ungate?.();
          restore.reverse().forEach((reset) => reset());
        };
      });
    });
  };

  const destroy = () => {
    ctx?.revert();
    ctx = null;
  };

  return { init, destroy };
}

/** The live grid owns its motion (F7/F8, 2026-09-08). Re-register after each
 * filter commit so no flight targets a row React has already removed. */
export function createRecordGridMotion(
  grid: HTMLElement,
  reflowState: Flip.FlipState | null = null,
): MotionModule {
  let ctx: gsap.Context | null = null;
  return {
    init() {
      if (ctx) return;
      registerYachatdacEffects();
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        if (reflowState)
          mm.add("(prefers-reduced-motion: no-preference)", () => {
            const cards = grid.querySelectorAll("[data-record-card]");
            if (!cards.length) return;
            gsap.effects
              .reflow(cards, { state: reflowState })
              .eventCallback("onComplete", () => ScrollTrigger.refresh());
          });
        /* THE DECK — snap between slides.
         Each row of cards and each breakout is one slide, and leaving one
         glides to the next instead of scrolling through it. The snap points
         are read live off the slides rather than assumed to be evenly spaced,
         because they are not: a breakout is 180svh and a card row is one.

         That spacing is also what keeps the hold honest. A breakout's only
         snap point is its start, so its midpoint — about 90vh in — is the
         threshold the reader has to push past before the deck will carry them
         on. Scroll less than that and it settles back onto the entry.

         ⚠ THIS IS THE SITE SETTING THE PACE, which globals.css argues against
         at some length ("the visitor sets the pace") in the note on why there
         is no global smooth-scroll. Asked for on 4 Sep. It is fenced in
         accordingly: never under reduced motion, and never on a viewport too
         small to hold a slide — see DECK in RecordGrid, which gates the layout
         on the same query this does. */
        mm.add(
          "(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (min-height: 820px)",
          () => {
            /* No deck when the sections do not hold: with the slides in ordinary
             flow there is nothing to snap BETWEEN, and snapping anyway would
             drag the reader to arbitrary offsets mid-page. */
            if (!RECORD_STICKY_SECTIONS) return;
            if (!grid) return;
            const slides = gsap.utils.toArray<HTMLElement>(
              "[data-record-slide]",
              grid,
            );
            if (slides.length < 2) return;

            const deck = ScrollTrigger.create({
              trigger: grid,
              start: "top top",
              end: "bottom bottom",
              snap: {
                snapTo: (value, self) => {
                  if (!self) return value;
                  const span = self.end - self.start;
                  if (span <= 0) return value;
                  const points = slides.map((el) =>
                    gsap.utils.clamp(
                      0,
                      1,
                      (el.getBoundingClientRect().top +
                        window.scrollY -
                        self.start) /
                        span,
                    ),
                  );
                  return gsap.utils.snap(points, value);
                },
                /* TWO DIFFERENT THINGS, AND ONLY ONE OF THEM SHOULD BE QUICK.
                 The CONTENT is instant — the escape finishes on the approach,
                 so a slide is fully there before it takes the screen. The
                 TRAVEL between slides stays smooth: this is the glide, and
                 cutting it short to chase immediacy just turns the deck into a
                 series of jumps. Eased in and out, so it leaves and arrives
                 without a hard edge at either end.

                 The small delay is what lets a flick finish before the glide
                 takes over; at zero it fights the wheel mid-gesture. */
                duration: { min: 0.35, max: 0.65 },
                delay: 0.05,
                ease: "power2.inOut",
              },
            });
            return () => deck.kill();
          },
        );

        /* 02 · THE BREAKOUT — the measured surface, inside a held frame.

         An entry stops being a card and becomes the screen. Flip measures the
         card where it sits in the grid, measures the full bleed, and animates
         the difference with transforms only — so the reader believes it is the
         same photograph arriving somewhere new.

         WHAT CHANGED, AND WHY THE OLD OBJECTION NO LONGER HOLDS. This used to
         be an "escape": a clip-path aperture on a separate full-bleed section,
         written around the argument that Flip could not be used because "by
         the time a breakout pins, its card is a viewport or more up the page".
         That was true of the old geometry and is the reason the geometry
         changed. RecordFrame now puts the row and its screens in ONE pinned
         frame, so the card is on screen, still in its cell, at the instant the
         flight starts — and Flip has two real rects to measure instead of one
         real and one imagined.

         EVERY CARD CAN DO IT. Each card has a screen of its own slug in the
         same frame, and clicking a card opens that screen rather than
         following the card's href. Three entries also do it unprompted as the
         reader scrolls past — that is all `data-breakout-auto` means, plus the
         extra viewport of runway those need to arrive and leave in.

         THE CELL KEEPS ITS BOX. Nothing is re-parented and nothing is removed
         from the grid: the card goes invisible, and the plate — a separate
         element — is transformed onto where the card is and grown out of it.
         That is why the grid does not reflow underneath, which is what lets
         frames 03–05 hold the rest of the row still behind the flight. It is
         also what keeps React's tree intact, the lesson the filter reflow in
         RecordGrid documents at some length.

         ONE ELEMENT, NOT TWO CROSS-FADING. The card and the plate swap in a
         single frame rather than dissolving through each other. A dissolve is
         the tell that these are two photographs; the swap is what makes the
         claim of one survive.

         Clicking plays the flight in time; scrolling drives it through the
         held runway in either direction (the 5 September request). Measure
         at first use and after resize, preserving the selected screen.

         ▲ ITS OWN GATE, not the deck's. The deck is off; this is not. See
         RECORD_BREAKOUT_FLIGHT for why the two are held apart. */
        mm.add(
          /* The same query the `hold:` variant carries in globals.css, written
           out because the two have to agree: the variant supplies the pin as
           layout, this supplies the flight, and a frame with a pin and no
           flight — or a flight and no pin — is worse than neither. Under
           reduced motion there is neither, and every card is an ordinary link
           to an ordinary page, which is the strip's own instruction. */
          "(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (min-height: 820px)",
          () => {
            if (!RECORD_BREAKOUT_FLIGHT || !grid) return;
            const rail = grid.querySelector<HTMLElement>("[data-record-rail]");

            /* WHO IS DARKENING THE RAIL. One flag, five sections, and their
             ranges MEET: a section's end is the next one's start, so at that
             one scroll position both fire in the same tick and the order is
             ScrollTrigger's to choose, not ours. Unowned, the section letting
             go cleared the flag the section taking over had just set — the
             index went canvas over a full-bleed photograph, but only when
             approached from one direction, which is the worst kind of bug to
             be handed. So a section may only put the rail back if it is the
             one that took it. */
            let railOwner: HTMLElement | null = null;

            /* The beats, in seconds. RELEASE is frame 02 — the cell letting go —
             and FLIGHT is the strip's own 0.9. */
            const RELEASE = 0.35;
            const FLIGHT = 0.9;

            /* One card and the screen it becomes. */
            type Screen = {
              slug: string;
              cell: HTMLElement;
              root: HTMLElement;
              plate: HTMLElement;
              image: HTMLElement | null;
              push: HTMLElement | null;
              scrim: HTMLElement | null;
              lane: HTMLElement | null;
              copyBox: HTMLElement | null;
              copy: HTMLElement[];
              bore: HTMLElement | null;
              flight: gsap.core.Timeline | null;
              context?: gsap.Context;
              scrub?: gsap.QuickToFunc;
            };

            const teardown = gsap.utils
              .toArray<HTMLElement>("[data-record-frame]", grid)
              .map((section) => {
                const cells = gsap.utils.toArray<HTMLElement>(
                  "[data-breakout-cell]",
                  section,
                );
                if (!cells.length) return () => {};

                const screens: Screen[] = [];
                for (const cell of cells) {
                  const slug = cell.dataset.breakoutCell;
                  if (!slug) continue;
                  const root = section.querySelector<HTMLElement>(
                    `[data-breakout-screen="${CSS.escape(slug)}"]`,
                  );
                  const plate = root?.querySelector<HTMLElement>(
                    "[data-breakout-plate]",
                  );
                  if (!root || !plate) continue;
                  screens.push({
                    slug,
                    cell,
                    root,
                    plate,
                    image: root.querySelector("[data-breakout-image]"),
                    push: root.querySelector("[data-breakout-push]"),
                    scrim: root.querySelector("[data-breakout-scrim]"),
                    lane: root.querySelector("[data-breakout-lane]"),
                    copyBox: root.querySelector("[data-breakout-copy]"),
                    copy: gsap.utils.toArray<HTMLElement>(
                      "[data-breakout-arrive]",
                      root,
                    ),
                    bore: root.querySelector("[data-bore-fill]"),
                    flight: null,
                  });
                }
                if (!screens.length) return () => {};

                gsap.set(
                  screens.map((s) => s.plate),
                  { autoAlpha: 0 },
                );

                /* ONE SCREEN AT A TIME. The frame holds one row, and a row that
                 had two entries mid-flight would be two photographs claiming
                 to be the same card. `open` is which of them currently has the
                 frame, and every callback below reads it rather than assuming
                 the one it was wired to. */
                let open: Screen | null = null;
                /* Whether this section is the one holding the screen. The
                 painters below are about what the reader is looking at, and a
                 timeline parked at its end is not evidence of that — the
                 section's own edges are. */
                let inRange = false;
                /* A CLICK PLAYS THE FLIGHT IN TIME; THE SCROLL DRIVES IT
                 OTHERWISE. While a clicked flight is running, the scrub below
                 stands aside — the reader asked for the 0.9s and a scroll
                 event landing mid-flight must not yank it to wherever the
                 wheel happens to be. Cleared when the flight completes, or is
                 put anywhere by hand. */
                let manual = false;
                let disposed = false;
                let cancelTravel: (() => void) | undefined;
                /* THE READER'S CHOICE OUTRANKS THE PAGE'S.
                 A breakout row also carries an automatic screen — the entry
                 that takes the frame unprompted as the reader scrolls past.
                 Once the reader has clicked a card in this row, that entry is
                 no longer the answer: playing it would fly a screen nobody
                 asked for over the one they did, so the scroll triggers below
                 read this first and fall back to the automatic one only while
                 it is null. Per section, and it outlives a return to the grid
                 — a reader who chose card 2 and scrolled back up meets card 2
                 again on the way down, not the row's default. */
                let chosen: Screen | null = null;

                /* THE RAIL'S REGISTER, read from the open flight rather than
                 pushed to it. The index travels OVER the plate, so it flips
                 once the plate is most of the way out and the lane behind it
                 has gone dark. Asking where the flight is — instead of having
                 it announce itself — means the same one line is correct from
                 the timeline's own tick, from a re-entry that finds it already
                 parked at the end, and on the way back. */
                const paintRail = () => {
                  if (!RECORD_STICKY_RAIL || !rail) return;
                  const dark =
                    inRange &&
                    !!open?.flight &&
                    open.flight.time() > RELEASE + FLIGHT * 0.5;
                  if (dark) {
                    railOwner = section;
                    rail.dataset.onDark = "true";
                    return;
                  }
                  if (railOwner !== section) return;
                  railOwner = null;
                  delete rail.dataset.onDark;
                };

                /* A SCREEN'S LINK IS ONLY REAL WHEN THE SCREEN IS. It is the
                 entry's only route out of here now that the card opens this
                 instead of following its own href, and until the flight has
                 landed it is a transparent link lying over a grid —
                 untabbable and unannounced, or it is a trap. `inert` does
                 both. */
                const paintCopy = () => {
                  for (const screen of screens) {
                    if (!screen.copyBox) continue;
                    const landed =
                      inRange &&
                      screen === open &&
                      screen.flight?.progress() === 1;
                    screen.copyBox.toggleAttribute("inert", !landed);
                  }
                };
                /* ASSERTED, NOT ASSUMED. The markup renders `inert` and the
                 server sends it, but React drops the attribute on hydration —
                 measured: every copy block's link focusable at the top of the
                 page. The no-JS reader still needs it in the HTML, so it stays
                 there; here is where it becomes true again for everyone
                 else. */
                paintCopy();

                const paint = () => {
                  paintRail();
                  paintCopy();
                };

                /* MEASURED AT TRIGGER TIME, which is the whole reason this is
                 not scrubbed. A scrubbed Flip computes its rects when the
                 trigger is created — at the top of the page, before the row
                 has been laid out into the frame that will hold it — and lands
                 wrong at any other viewport. Building here means the card is
                 measured where it actually is. */
                const build = (screen: Screen) => {
                  screen.scrub?.tween.kill();
                  screen.context?.revert();
                  // Finish a filter reflow before measuring either endpoint.
                  Flip.killFlipsOf(cells, true);
                  screen.context = gsap.context(() => {
                    if (screen.copyBox)
                      gsap.set(screen.copyBox, { autoAlpha: 1 });
                    const t = gsap.effects.surface(screen.plate, {
                      cell: screen.cell,
                      image: screen.image,
                      scrim: screen.scrim,
                      lane: screen.lane,
                      copy: screen.copy,
                      neighbours: screens
                        .filter((other) => other !== screen)
                        .map((other) => other.cell),
                      release: RELEASE,
                      duration: FLIGHT,
                    }) as gsap.core.Timeline;
                    t.eventCallback("onUpdate", paint);
                    t.eventCallback("onComplete", () => {
                      manual = false;
                    });
                    screen.flight = t;
                    screen.scrub = gsap.quickTo(t, "progress", {
                      duration: 0.35,
                      ease: "none",
                      onUpdate: paint,
                    });
                  }, section);
                };

                /* Put a screen back where it started, now, with no animation —
                 for when the reader has left, or has asked for a different
                 card while this one was still out. */
                const settle = (screen: Screen | null, at: number) => {
                  if (!screen?.flight) return;
                  screen.scrub?.tween.pause();
                  manual = false;
                  screen.flight.pause(at);
                };

                /* Make a screen the row's open one, built if it has to be. */
                const take = (screen: Screen) => {
                  if (open && open !== screen) settle(open, 0);
                  open = screen;
                  if (!screen.flight) build(screen);
                  inRange = true;
                };

                /* THE CLICKED FLIGHT — 0.9s, `country`, from wherever the plate
                 is now to the screen. */
                const fly = (screen: Screen) => {
                  if (open === screen && manual && screen.flight?.isActive()) {
                    return;
                  }
                  take(screen);
                  if (!screen.flight) return;
                  screen.scrub?.tween.pause();
                  manual = true;
                  screen.flight.play();
                  paint();
                };

                /* THE SCRUB — the flight put where the scroll is.
                 Not set outright: a wheel tick is a step, and a plate that
                 stepped with it would judder. The progress CHASES the scroll
                 over a third of a second instead, so the flight moves at the
                 speed the reader scrolls — and a rapid scroll carries it to
                 rest rather than cutting it, because the tween finishes at
                 the value the last event asked for whether or not the reader
                 is still moving. */
                const scrub = (screen: Screen, to: number) => {
                  if (manual || !screen.flight) return;
                  screen.scrub?.(to, screen.flight.progress());
                };

                const lighten = () => {
                  if (!rail || railOwner !== section) return;
                  railOwner = null;
                  delete rail.dataset.onDark;
                };

                /* WHERE THE FLIGHT LIVES INSIDE THE PIN. A breakout's screen
                 starts one viewport in — the row holds first (frame 01: the
                 grid as the reader meets it, still), and the flight follows a
                 screen later. That viewport is what the reverse gets to happen
                 in: leaving is as long as arriving, and it has to finish on a
                 frame that is still pinned or the reader watches a full-bleed
                 plate slide down the page.

                 A PLAIN ROW HOLDS FOR ONE VIEWPORT, NOT TWO, so its runway is
                 half of that: the screen a reader clicks open lives in the
                 back half of the hold, and the front half is where its reverse
                 plays when they scroll up. It used to be nothing — the return
                 trigger was never made for these rows — so a clicked screen
                 did not fly home, it was cut to the grid at the hard edge
                 below. Half a viewport is short for a 0.9s reverse, but the
                 same hard edge still catches a flick, exactly as it does on a
                 breakout. */
                const runway = () =>
                  section.hasAttribute("data-record-breakout")
                    ? window.innerHeight
                    : window.innerHeight * 0.5;
                const pinTop = () =>
                  section.getBoundingClientRect().top + window.scrollY;

                /* THE AUTOMATIC ONE. Three entries take the screen unprompted;
                 the rest wait to be clicked. */
                const autoSlug = section.dataset.breakoutAuto;
                const auto = screens.find((s) => s.slug === autoSlug);
                /* Which screen this row arrives at by scroll alone: the one the
                 reader chose, else the automatic one, else nothing — a plain
                 row nobody has clicked is just a row. */
                const arrival = () => chosen ?? auto ?? null;
                /* SCROLL-DRIVEN THROUGH THE RUNWAY, in both directions, on
                 every row.

                 ⚠ THIS REVISES "NEVER SCRUBBED" ABOVE, and only half of it.
                 The objection there was to a Flip measured at trigger CREATION
                 — at the top of the page, before the row was laid out into its
                 frame. The flight is still built at first need, inside the
                 pin, off real rects; what changed is what drives it. Asked for
                 on 5 Sep: the time-based reverse lost to a fast scroll — the
                 reader cleared the runway in a third of a second, the hard
                 edge below caught the plate mid-air and cut it to the grid.
                 Tied to the scroll it cannot be outrun: wherever the reader
                 is in the runway is where the flight is, its speed is the
                 reader's, and the top edge is progress 0 by construction.

                 A clicked screen is the exception — see `manual`. It plays
                 its 0.9s, and the scroll takes over once it has landed. */
                ScrollTrigger.create({
                  trigger: section,
                  start: "top top",
                  /* A function, so it re-reads the viewport on every refresh
                   rather than baking in whatever the window was at init. */
                  end: () => `top+=${runway()} top`,
                  onUpdate: (self) => {
                    if (manual || disposed) return;
                    const next = arrival();
                    if (!next) return;
                    if (open !== next) take(next);
                    scrub(next, self.progress);
                  },
                  /* Coming back UP from below the pin the reader is returning to
                   the screen, not the grid — it is already at its end, the
                   hard edge below settled it there. */
                  onEnterBack: () => {
                    const next = arrival();
                    if (!next) return;
                    if (open !== next) take(next);
                    inRange = true;
                    paint();
                  },
                });

                /* THE GUARANTEE, and it is the mirror of the one the old escape
                 carried on arrival.

                 The reverse is time-based, so a hard flick can outrun it: the
                 reader clears the runway in a third of a second and the
                 section stops holding the screen while the plate is still most
                 of the way out. That is the overshoot — a landed photograph
                 sliding down the page with the hero coming in over it.

                 So the section's own edges are hard. Cross the top going up
                 and the flight is put back to rest outright: the grid is
                 simply there, which is what the reader was scrolling towards.
                 Cross the bottom going down and it is settled on its end and
                 stopped, rather than left running to a screen that is no
                 longer on screen. Neither fights the scroll — the reader is
                 never held anywhere, the animation just stops pretending it
                 still has room. On any normal exit it has already finished
                 inside the pin and this changes nothing. */
                ScrollTrigger.create({
                  trigger: section,
                  start: "top top",
                  end: "bottom bottom",
                  onEnter: () => {
                    inRange = true;
                    paint();
                  },
                  onEnterBack: () => {
                    inRange = true;
                    paint();
                  },
                  onLeave: () => {
                    inRange = false;
                    if (open?.flight) settle(open, open.flight.duration());
                    lighten();
                    paint();
                  },
                  onLeaveBack: () => {
                    inRange = false;
                    settle(open, 0);
                    open = null;
                    lighten();
                    paint();
                  },
                });

                /* CLICKING A CARD OPENS ITS SCREEN rather than following its own
                 href. The card and the screen are the same entry, and the
                 screen is what this frame was built to deliver — sending the
                 reader off the page to read it, past a full-bleed frame of the
                 very thing they clicked, is the page arguing with itself.

                 IT STAYS A LINK. The href is untouched, so middle-click, a
                 modified click and the context menu all still open the entry,
                 and with JS off — or under reduced motion, where none of this
                 module exists and there is no screen to open — every card is
                 an ordinary link to an ordinary page. Only the plain left
                 click is intercepted, and only where there is somewhere to go.

                 IF THE FRAME IS ALREADY PINNED, NOTHING SCROLLS. Dragging the
                 reader back to the top of a hold they are already standing in
                 is a worse answer than opening in place. It only travels when
                 the frame has not taken the screen yet, and then it waits for
                 the scroll to finish before flying — a flight animating while
                 the page is still moving under it is two motions fighting. */
                const openers = screens.map((screen) => {
                  const openScreen = (event: MouseEvent) => {
                    // Keyboard activation keeps the native article link.
                    if (
                      event.defaultPrevented ||
                      event.button !== 0 ||
                      event.detail === 0
                    )
                      return;
                    if (
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey
                    ) {
                      return;
                    }
                    event.preventDefault();

                    /* Recorded BEFORE anything moves. The travelling branch
                     below scrolls the frame into its pin, and that crossing
                     fires the automatic trigger on the way — with the choice
                     already set, that trigger flies THIS screen rather than
                     the row's default, and the fly() on arrival is then the
                     no-op it should be instead of a second flight. */
                    cancelTravel?.();
                    chosen = screen;
                    /* And the scrub stands aside NOW, before any scroll below
                     fires it — otherwise the travel into the pin would drag
                     the plate out by scroll and the flight on arrival would
                     have nothing left to do. */
                    manual = true;

                    const top = pinTop();
                    const pinned =
                      window.scrollY >= top &&
                      window.scrollY <=
                        top + section.offsetHeight - window.innerHeight;
                    if (pinned) {
                      /* PAST THE RUNWAY FIRST. The landed screen is the far end
                       of the scrub; opened in front of it there is no scroll
                       for the return to travel through, and the first wheel
                       tick would pull it half-way home. The frame is stuck, so
                       stepping the scroll forward moves nothing they can see,
                       and `manual` keeps the crossing from scrubbing it. */
                      const start = top + runway() + 24;
                      if (window.scrollY < start) {
                        window.scrollTo({ top: start, behavior: "instant" });
                      }
                      fly(screen);
                      return;
                    }

                    /* Land a little past the trigger point, never on it —
                     arriving exactly on a trigger is how you arrive somewhere
                     that has not fired yet. */
                    const target = top + runway() + 24;
                    let done = false;
                    const arrive = () => {
                      if (done || disposed) return;
                      done = true;
                      window.removeEventListener("scrollend", arrive);
                      clearTimeout(timer);
                      cancelTravel = undefined;
                      fly(screen);
                    };
                    /* `scrollend` is the honest signal and a timer is the
                     fallback for the browsers that do not send it. */
                    const timer = window.setTimeout(arrive, 900);
                    cancelTravel = () => {
                      done = true;
                      clearTimeout(timer);
                      window.removeEventListener("scrollend", arrive);
                      manual = false;
                    };
                    window.addEventListener("scrollend", arrive, {
                      once: true,
                    });
                    window.scrollTo({ top: target, behavior: "smooth" });
                  };
                  screen.cell.addEventListener("click", openScreen);
                  return () =>
                    screen.cell.removeEventListener("click", openScreen);
                });

                /* THE HOLD, once the screen has landed — scroll-linked, and the
                 only part of this that is. Holding the screen is not the same
                 as freezing it: a reader who scrolls through the pin and sees
                 nothing respond assumes the page has hung.

                 Bound to the automatic screen, which is the only one the
                 reader can arrive at by scrolling alone and therefore the only
                 one with a hold to travel through.

                 ▲ MOTION GRADE IS ENFORCED HERE. `frame` grade means the world
                 moves and the record holds, so on those frames the
                 photograph's own plane never moves and the scrim and the type
                 carry the travel instead. The grade comes off the element,
                 derived from the asset's bucket; it is not a judgement made at
                 this call site. */
                const hold = gsap.timeline({
                  defaults: { ease: "none" },
                  scrollTrigger: {
                    trigger: section,
                    /* The SCREEN's part of the sticky window — from where the
                     flight starts to where the frame lets go. */
                    start: () => `top+=${runway()} top`,
                    end: "bottom bottom",
                    scrub: 0.6,
                  },
                });
                if (auto?.push && auto.root.dataset.motionGrade === "full") {
                  /* M1 · 1.00 → 1.04, on its own plane so it never multiplies
                   with the flight's counter-scale. */
                  hold.fromTo(auto.push, { scale: 1 }, { scale: 1.04 }, 0);
                }
                if (auto?.bore) {
                  /* Nothing is being animated INTO existence here — the line is
                   the bore, and the scrub is the descent down it. */
                  hold.fromTo(auto.bore, { scaleY: 0 }, { scaleY: 1 }, 0);
                }

                /* F7/F8, 2026-09-08: resize invalidates both endpoints even
                 after landing. Preserve progress and measure after refresh. */
                const restack = () => {
                  if (!open?.flight || disposed) return;
                  const progress = open.flight.progress();
                  const playing = manual;
                  build(open);
                  open.flight?.progress(progress).pause();
                  manual = playing;
                  if (playing) open.flight?.play();
                  paint();
                };
                ScrollTrigger.addEventListener("refresh", restack);

                return () => {
                  disposed = true;
                  cancelTravel?.();
                  lighten();
                  openers.forEach((off) => off());
                  ScrollTrigger.removeEventListener("refresh", restack);
                  for (const screen of screens) {
                    screen.copyBox?.setAttribute("inert", "");
                    screen.scrub?.tween.kill();
                    screen.context?.revert();
                  }
                  hold.scrollTrigger?.kill();
                  hold.kill();
                };
              });

            return () => teardown.forEach((kill) => kill());
          },
        );
      }, grid);
      ScrollTrigger.refresh();
    },
    destroy() {
      ctx?.revert();
      ctx = null;
    },
  };
}
