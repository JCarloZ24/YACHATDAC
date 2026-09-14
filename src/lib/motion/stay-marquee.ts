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
 * It STOPS FOR THE READER. A pointer over the rail, a finger or mouse on it,
 * or keyboard focus in it holds the advance; it resumes when they leave. A
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
 * `--stay-fill`, 0 → 1, set on the section so the dots below the rail
 * inherit it; SliderDots draws the lit dot's gold as ink rising inside the
 * artist's shape to that height. A hold pauses the tween where it is, so the
 * ink stands. When the reader takes over — a dot pressed, a swipe, a drag —
 * the ink SPILLS: it drains in 0.35s, the rail moves to their card, and the
 * fill begins again from empty there. SliderDots hands a dot press over
 * through a cancelable `rail:go` event on the scroller, so a rail with no
 * marquee scrolls itself as before and its dot renders full (the variable's
 * fallback is 1).
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
        const cells = Array.from(scroller.children) as HTMLElement[];
        if (cells.length < 2) return;

        let held = 0;          // pointers / focus holding the rail
        let visible = false;
        let ours = false;      // a scroll we started, not the reader
        let settleTimer = 0;
        let spilling: gsap.core.Tween | undefined;

        const scrollToCell = (index: number) => {
          const cell = cells[Math.max(0, Math.min(index, cells.length - 1))];
          ours = true;
          scroller.scrollTo({ left: cell.offsetLeft - cells[0].offsetLeft, behavior: "smooth" });
          window.setTimeout(() => { ours = false; }, 800);
        };
        const advance = () => {
          const max = scroller.scrollWidth - scroller.clientWidth;
          const step = cells[1].offsetLeft - cells[0].offsetLeft;
          // The next card, or home from the end.
          const at = Math.round(scroller.scrollLeft / step);
          scrollToCell(scroller.scrollLeft >= max - 1 ? 0 : at + 1);
        };

        // The wait, drawn: the ink rises over `every` seconds and the card
        // moves on when it reaches the top.
        gsap.set(root, { "--stay-fill": 0 });
        const tick = gsap.fromTo(root, { "--stay-fill": 0 }, {
          "--stay-fill": 1, duration: every, ease: "none", paused: true,
          onComplete: () => { advance(); tick.restart(); },
        });
        const settle = () => {
          if (visible && held === 0) tick.play(); else tick.pause();
        };
        // Start the sequence over from an empty dot.
        const again = () => { spilling?.kill(); tick.restart(); settle(); };

        // THE SPILL (user direction, 14 September 2026: "if the user clicked
        // on other dots or skips, the animation will be reversed — the golden
        // dot will spill, then move to next image and repeats the original
        // sequence"). The ink drains, quicker than it rose, and only then
        // does the rail move; the fill begins again on the new card.
        const spill = (then?: () => void) => {
          tick.pause();
          spilling?.kill();
          spilling = gsap.to(root, {
            "--stay-fill": 0, duration: 0.35, ease: "power2.in", onComplete: then,
          });
        };

        // A dot was pressed: spill, go there, start over. SliderDots asks
        // through this event and only scrolls itself if nobody answers.
        const onGo = (event: Event) => {
          const index = (event as CustomEvent<{ index: number }>).detail?.index;
          if (typeof index !== "number") return;
          event.preventDefault();
          spill(() => { scrollToCell(index); again(); });
        };
        // The reader swiped or dragged: spill while it moves, start over
        // once the scroller has come to rest.
        const onScroll = () => {
          if (ours) return;
          if (!spilling?.isActive()) spill();
          window.clearTimeout(settleTimer);
          settleTimer = window.setTimeout(again, 200);
        };
        const hold = () => { held += 1; settle(); };
        const release = () => { held = Math.max(0, held - 1); settle(); };

        scroller.addEventListener("rail:go", onGo);
        scroller.addEventListener("pointerenter", hold);
        scroller.addEventListener("pointerleave", release);
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
          spilling?.kill();
          window.clearTimeout(settleTimer);
          gsap.set(root, { clearProps: "--stay-fill" });
          scroller.removeEventListener("rail:go", onGo);
          scroller.removeEventListener("pointerenter", hold);
          scroller.removeEventListener("pointerleave", release);
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
