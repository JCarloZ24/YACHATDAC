"use client";

/**
 * /the-record — "The Record". The hi-fi's motion (Figma 2463:8492).
 *
 * The page's loud channel is the GRID: entries break out of it to take the
 * whole screen and hand back. Everything else is quiet — arrivals, a slow
 * push on the hero, and the one pin the frame asks for.
 *
 * MARKUP CONTRACT
 * ---------------
 *   [data-record-hero]           the intro section
 *   [data-record-hero-media]       its photograph — M1 push-in, then the exit push
 *   [data-record-hero-scrim]       the X5 wash the copy lands on — scrimRamp
 *   [data-record-hero-arrive]      eyebrow and lead; gated on ENTRY, not on view
 *   [data-record-arrive]         anything below the fold that fades up on view
 *   [data-breakout-plate]          the breakout photograph — the escape aperture
 *   [data-breakout-arrive]         breakout copy; owned by the escape, not the
 *                                  page-wide arrivals sweep
 *   [data-record-grid]           the grid section (the rail's own scope)
 *   [data-record-rail]             the sticky index; gets data-on-dark
 *   [data-record-breakout]       a full-screen entry passing under the rail
 *   [data-record-gaps]           "What we do not know" — the pinned section
 *   [data-record-gaps-stage]       its content, the thing that is pinned
 *   [data-record-gap]              one gap; data-state active | idle
 *   [data-record-gap-marker]       the 3px step marker; same data-state
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
import type { MotionModule } from "@/lib/motion-controller";
import { awaitEntry } from "@/lib/motion/route-entry";

gsap.registerPlugin(Flip, ScrollTrigger);

const EASE_COUNTRY = "expo.out";

export function createRecord(): MotionModule {
  let ctx: gsap.Context | null = null;
  let ungate: (() => void) | undefined;
  const cleanups: Array<() => void> = [];

  const init = () => {
    const hero = document.querySelector<HTMLElement>("[data-record-hero]");
    const grid = document.querySelector<HTMLElement>("[data-record-grid]");
    const gaps = document.querySelector<HTMLElement>("[data-record-gaps]");
    if (!hero && !grid && !gaps) return;

    ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

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

      /* X6 — reduced motion gets no module at all. The markup already renders
         the finished state, so there is nothing to set. */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
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
          const heroScrim = hero.querySelector<HTMLElement>(
            "[data-record-hero-scrim]",
          );
          const arrivals = gsap.utils.toArray<HTMLElement>(
            "[data-record-hero-arrive]",
            hero,
          );
          gsap.set(heroMedia, { scale: 1.06 });
          gsap.set(heroScrim, { opacity: 0.55 });
          gsap.set(arrivals, { opacity: 0, y: 18 });

          const intro = gsap.timeline({ paused: true });
          intro
            .to(heroMedia, { scale: 1, duration: 1.6, ease: EASE_COUNTRY }, 0)
            .to(heroScrim, { opacity: 1, duration: 0.9, ease: "power2.inOut" }, 0.1)
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
          gsap.to(heroMedia, {
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
            },
          });

          cleanups.push(() => intro.kill());
        }

        /* 02 · the breakouts — ESCAPE, pinned, never scrubbed.
           "Pinned 100vh each and reversed on leave-back, never scrubbed": the
           entry takes the screen and HOLDS it for a viewport before the grid
           resumes, and the escape plays at its own pace rather than being
           dragged by the wheel. Scrubbing it would make the reader operate the
           transition instead of watching it.

           THE ESCAPE is the card's window opening to the full frame: the plate
           starts clipped to a card-proportioned aperture and the clip opens
           out. The design calls this Flip, and GSAP Flip is what the grid
           reflow below uses — but not here. Flip animates one element between
           two measured rects, and by the time a breakout pins, its card is a
           viewport or more up the page; fitting to that rect would fly the
           plate in from off-screen, which is not what escaping the grid looks
           like. The aperture reads as the card opening without lying about
           where the card is.

           `autoRound: false` and a clip on an already-composited plate keep
           this off the layout path. */
        const rail = grid?.querySelector<HTMLElement>("[data-record-rail]");
        if (grid) {
          gsap.utils
            .toArray<HTMLElement>("[data-record-breakout]", grid)
            .forEach((breakout) => {
              const plate = breakout.querySelector<HTMLElement>(
                "[data-breakout-plate]",
              );
              const copy = gsap.utils.toArray<HTMLElement>(
                "[data-breakout-arrive]",
                breakout,
              );

              /* The card's own proportions, 362 x 700 of a 1440 x 900 frame,
                 as the aperture the plate opens out of. */
              /* THE ESCAPE RUNS ON THE APPROACH, NOT ON ARRIVAL.
                 The section is held, so by the time it has the screen its
                 content has to be THERE — a reader who has landed should not
                 then wait to be shown the thing they scrolled to. This used to
                 fire at `top 70%`, which with the deck's glide meant it started
                 mid-transition and was still staggering in half a second after
                 the slide had settled. It now starts the moment the section
                 appears and is over well inside the viewport of travel before
                 the frame sticks. */
              const escape = gsap.timeline({ paused: true });
              if (plate) {
                escape.fromTo(
                  plate,
                  { clipPath: "inset(11% 37% 11% 37% round 24px)" },
                  {
                    clipPath: "inset(0% 0% 0% 0% round 0px)",
                    duration: 0.55,
                    ease: EASE_COUNTRY,
                  },
                  0,
                );
              }
              escape.from(
                copy,
                {
                  opacity: 0,
                  y: 20,
                  duration: 0.4,
                  ease: EASE_COUNTRY,
                  stagger: 0.04,
                },
                0.12,
              );

              /* The hold is CSS sticky on the section itself (see
                 RecordGrid) — ScrollTrigger's own `pin` wraps the node in a
                 spacer, and these sections unmount on every filter change,
                 which tore the React tree apart. This trigger only WATCHES. */
              ScrollTrigger.create({
                trigger: breakout,
                /* The moment any of it appears. One viewport of travel
                   separates this from the frame sticking, which is far longer
                   than the timeline, so the entry is finished and still by the
                   time it takes the screen. */
                start: "top bottom",
                end: "bottom top",
                /* No scrub, by instruction. Forward plays it; scrolling back
                   past the start reverses it, so the entry retreats into the
                   grid the same way it left. */
                onEnter: () => escape.play(),
                onEnterBack: () => escape.play(),
                onLeaveBack: () => escape.reverse(),
              });

              /* THE GUARANTEE. The escape is time-based, so a fast glide can
                 outrun it and the reader lands on a slide that is still
                 assembling itself — which is the one thing a HELD section must
                 never do. This fires the instant the frame sticks and finishes
                 the timeline outright.

                 It is not a scrub: nothing here is dragged by the wheel. On a
                 normal approach the escape has long since played out on its own
                 and this changes nothing. It only bites when the reader arrives
                 faster than the animation, and then it resolves in favour of
                 the content being there. */
              ScrollTrigger.create({
                trigger: breakout,
                /* `top top+=40` fires forty pixels BEFORE the frame sticks,
                   not at the instant it does. The deck snaps to exactly the
                   slide top, so a guarantee sitting on `top top` lands on the
                   same pixel as the rest position and had not fired yet when
                   the reader arrived — measurably: complete from +60px, still
                   assembling at +0, which is the only place the snap ever
                   leaves them. */
                start: "top top+=40",
                end: "bottom bottom",
                onEnter: () => escape.progress(1),
                onEnterBack: () => escape.progress(1),
              });

              /* The rail sits over the breakout, so its ink flips while one is
                 behind it. The scrim under the lane does the contrast work;
                 this only swaps evergreen for canvas. */
              if (rail) {
                ScrollTrigger.create({
                  trigger: breakout,
                  /* The breakout is exactly one viewport tall, so "top top"
                     and "bottom bottom" are the SAME scroll position and the
                     window had zero length — the flip never fired at all.
                     These two land it instead: dark from the moment the
                     breakout covers three quarters of the screen until it
                     stops doing so. The lane is opaque either way, so this is
                     the register changing, not legibility being rescued. */
                  start: "top 30%",
                  end: "bottom 70%",
                  onToggle: ({ isActive }) => {
                    if (isActive) rail.dataset.onDark = "true";
                    else delete rail.dataset.onDark;
                  },
                });
              }

              cleanups.push(() => escape.kill());
            });
        }

        /* The four gaps, one lit at a time. */
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
                const state = i === index ? "active" : "idle";
                item.dataset.state = state;
                const marker = item.querySelector<HTMLElement>(
                  "[data-record-gap-marker]",
                );
                if (marker) marker.dataset.state = state;
              });
            };
            setActive(0);

            /* The frame asks for a 300vh pin. Pinning a section only works
               while it fits the viewport, so the pin is taken on large, tall
               screens and everything else gets the same stepping driven by
               the section's own scroll — the reader sees the gaps light in
               order either way, which is the point of the pin. */
            const step = (progress: number) =>
              setActive(
                Math.min(
                  items.length - 1,
                  Math.floor(progress * items.length),
                ),
              );

            const pinnable = "(min-width: 1024px) and (min-height: 900px)";
            mm.add(pinnable, () => {
              const trigger = ScrollTrigger.create({
                trigger: gaps,
                pin: stage ?? gaps,
                start: "top top",
                end: "+=300%",
                scrub: true,
                /* snapped 1/3 — the frame's own note: four stops, three gaps
                   between them. */
                snap: { snapTo: 1 / (items.length - 1), duration: 0.3 },
                onUpdate: (self) => step(self.progress),
              });
              return () => trigger.kill();
            });

            mm.add(`not all and ${pinnable}`, () => {
              const trigger = ScrollTrigger.create({
                trigger: gaps,
                start: "top 60%",
                end: "bottom 80%",
                scrub: true,
                onUpdate: (self) => step(self.progress),
              });
              return () => trigger.kill();
            });
          }
        }
      });
    });
  };

  const destroy = () => {
    ungate?.();
    ungate = undefined;
    cleanups.splice(0).forEach((fn) => fn());
    ctx?.revert();
    ctx = null;
  };

  return { init, destroy };
}
