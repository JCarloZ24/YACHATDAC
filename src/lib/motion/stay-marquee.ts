"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "../motion-controller";

/**
 * Where you stay — the carousel advances on its own, and the lit dot fills
 * with ink while it waits.
 *
 * Grammar row: "what drifts", Where you stay rail (user direction,
 * 14 September 2026: "auto-scrolling image carousel, no left/right buttons",
 * then "you didn't retain the previous code, you just need to make it
 * move"). So the rail is EXACTLY what it was — StayRail's native scroll-snap
 * scroller, its mouse drag and its dots are untouched and nothing here adds
 * or removes markup. This module only drives the scroller's own
 * `scrollLeft`: every few seconds it moves on by one card, the same way a
 * swipe would, and from the last card it returns to the first.
 *
 * It STOPS FOR THE READER — but NOT under a hovering pointer (August,
 * 15 September 2026: "do not stop the carousel on hover"; the first cut
 * paused on `pointerenter`, and a reader resting a mouse on the rail saw the
 * clock stand still). Keyboard focus in the rail holds the advance, since
 * the rail moving under a focused reader is a different thing from a mouse
 * resting on it; it resumes when focus leaves. A
 * dot press or a swipe SPILLS the ink first (below), then the sequence
 * starts over on the card they chose. It runs only while the rail is on
 * screen. Reduced motion never advances — the rail is then the plain swipe
 * carousel it was.
 *
 * Because the mechanism is the scroller, everything the rail already had
 * still works: the dots follow the scroll position, snap keeps every stop on
 * a card, and JavaScript-off readers keep a rail they can swipe.
 *
 * THE DOT IS THE CLOCK (user direction, 14 September 2026: "use the
 * sliderdots as indicator when the images move, put animation on the dots
 * like ink filling in the dots"). The wait between cards is a tween on
 * `--stay-fill`, set on the section so the dots below the rail inherit it;
 * SliderDots draws the lit dot's gold as ink standing inside the artist's
 * shape to that height. A hold pauses the tween where it is, so the ink
 * stands.
 *
 * ⚠ IT RUNS FULL → EMPTY, reversed on 15 September 2026 (August: "slider
 * dots should be highlighted when user moves through the images … reverse
 * the animation, it starts full then the colour reduces before it moves to
 * the next dot, so even when the user moves the images the sequence is
 * continuous"). The first cut rose 0 → 1 and spilled to 0 whenever the
 * reader took over, which meant the dot under a finger or a hovering
 * pointer was EMPTY — the one moment the reader looks at the dots, the lit
 * one was not lit. Now every card's dot starts full, drains over the wait,
 * and the rail moves on when it is empty. When the reader takes over — a dot
 * pressed, a swipe, a drag — the clock simply starts over: the dot on their
 * card is full at once and drains from there, so a manual move joins the
 * same sequence rather than interrupting it. The drain IS the spill; there
 * is no separate one.
 *
 * THE REFILL WAITS FOR THE ARRIVAL (August, 15 September 2026: "I'm seeing
 * a full coloured dot before it moves to the next dot"). The rail's smooth
 * scroll takes a few hundred milliseconds, and the dots follow the scroll
 * position — so refilling the instant the clock ran out lit the OLD card's
 * dot full for that beat, before the highlight had moved on. The dot now
 * stays empty while the rail travels and refills only once the scroller
 * has come to rest on the next card, so the next thing to be full is the
 * next card's dot. SliderDots hands a dot press over through a
 * cancelable `rail:go` event on the scroller, so a rail with no marquee
 * scrolls itself as before and its dot renders full (the variable's fallback
 * is 1, which is also this clock's resting state).
 */
export function createStayMarquee(
  root: HTMLElement,
  { rail = "[data-drag-rail]", every = 4 } = {},
): MotionModule {
  let cleanup: (() => void) | undefined;
  return {
    init() {
      cleanup?.();
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const scroller = root.querySelector<HTMLElement>(rail);
        if (!scroller) return;
        // READ LIVE, NOT ONCE (18 Sep 2026). Since the rail loops
        // (`DragScrollRail loop`) it carries inert clones of its end cards,
        // added and rebuilt by that component on its own clock — so the
        // scroller's children are not the cards, and child 0 is a clone.
        const laidOut = () => (Array.from(scroller.children) as HTMLElement[])
          .filter((cell) => !cell.hidden);
        const realCells = () => laidOut().filter((cell) => !cell.dataset.railClone);
        if (realCells().length < 2) return;

        let held = 0;          // focus holding the rail
        let visible = false;
        let ours = false;      // a scroll we started, not the reader
        let settleTimer = 0;
        let arrival = 0;       // rAF watching a scroll we started

        // Move the scroller to a card and call back once it has ARRIVED
        // there — the scroll position within a pixel of the target, or a
        // 900ms ceiling in case smooth scrolling is cut short. Watched on
        // rAF rather than `scrollend`, which Safari did not have when this
        // was written.
        const scrollToCell = (cell: HTMLElement, then?: () => void) => {
          // Offsets from whatever is laid out first — a clone, on a loop.
          const target = Math.min(
            cell.offsetLeft - laidOut()[0].offsetLeft,
            scroller.scrollWidth - scroller.clientWidth,
          );
          ours = true;
          window.cancelAnimationFrame(arrival);
          scroller.scrollTo({ left: target, behavior: "smooth" });
          const started = performance.now();
          const watch = () => {
            if (Math.abs(scroller.scrollLeft - target) < 1 || performance.now() - started > 900) {
              ours = false;
              then?.();
              return;
            }
            arrival = window.requestAnimationFrame(watch);
          };
          arrival = window.requestAnimationFrame(watch);
        };
        const advance = () => {
          const cells = realCells();
          const origin = laidOut()[0].offsetLeft;
          // Whichever card stands on the leading edge now.
          let at = 0;
          let best = Infinity;
          cells.forEach((cell, i) => {
            const distance = Math.abs(cell.offsetLeft - origin - scroller.scrollLeft);
            if (distance < best) { best = distance; at = i; }
          });
          // The next card. From the last one, ON to the first's clone where
          // the rail loops — the row keeps travelling forward and the loop
          // stands it on the real first card once it rests — or home to the
          // first where it does not.
          const onward = cells[cells.length - 1].nextElementSibling;
          const next = at + 1 < cells.length
            ? cells[at + 1]
            : onward instanceof HTMLElement && onward.dataset.railClone === "0"
              ? onward
              : cells[0];
          scrollToCell(next, again);
        };

        // The wait, drawn: the ink stands full and drains over `every`
        // seconds; the card moves on when the dot is empty, and the next
        // card's dot starts full. `restart` on the tween is the whole reset:
        // it re-renders the from value, so the dot is full the instant it
        // is called, whether or not the clock is then allowed to run.
        gsap.set(root, { "--stay-fill": 1 });
        // Empty → travel → arrive → full, in that order; see the refill
        // note in the module comment.
        const tick = gsap.fromTo(root, { "--stay-fill": 1 }, {
          "--stay-fill": 0, duration: every, ease: "none", paused: true,
          onComplete: () => advance(),
        });
        const settle = () => {
          if (visible && held === 0) tick.play(); else tick.pause();
        };
        // Start the sequence over from a full dot. `function`, not `const`:
        // `advance` above calls it before this line runs.
        function again() { tick.restart(); settle(); }

        // A dot was pressed: go there, start over. SliderDots asks through
        // this event and only scrolls itself if nobody answers.
        const onGo = (event: Event) => {
          const index = (event as CustomEvent<{ index: number }>).detail?.index;
          if (typeof index !== "number") return;
          event.preventDefault();
          // Full at once — the reader chose this dot — and the clock waits
          // for the rail to get there before it starts draining.
          tick.restart().pause();
          const cells = realCells();
          scrollToCell(cells[Math.max(0, Math.min(index, cells.length - 1))], again);
        };
        // The reader swiped or dragged: the dot they land on is full while
        // it moves, and the drain starts over once the scroller has come to
        // rest. (`ours` covers a scroll this module started.)
        const onScroll = () => {
          if (ours) return;
          tick.restart().pause();
          window.clearTimeout(settleTimer);
          settleTimer = window.setTimeout(again, 200);
        };
        const hold = () => { held += 1; settle(); };
        const release = () => { held = Math.max(0, held - 1); settle(); };

        scroller.addEventListener("rail:go", onGo);
        scroller.addEventListener("focusin", hold);
        scroller.addEventListener("focusout", release);
        scroller.addEventListener("scroll", onScroll, { passive: true });
        const trigger = ScrollTrigger.create({
          trigger: scroller, start: "top bottom", end: "bottom top",
          onToggle: (self) => { visible = self.isActive; settle(); },
        });
        visible = trigger.isActive; settle();

        return () => {
          trigger.kill();
          tick.kill();
          window.clearTimeout(settleTimer);
          window.cancelAnimationFrame(arrival);
          gsap.set(root, { clearProps: "--stay-fill" });
          scroller.removeEventListener("rail:go", onGo);
          scroller.removeEventListener("focusin", hold);
          scroller.removeEventListener("focusout", release);
          scroller.removeEventListener("scroll", onScroll);
        };
      }, root);
      cleanup = () => media.revert();
    },
    destroy() { cleanup?.(); cleanup = undefined; },
  };
}
