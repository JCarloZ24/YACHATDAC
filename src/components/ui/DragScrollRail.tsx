"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Lets a MOUSE drag a native scroll-snap rail, without owning the rail.
 *
 * WHY THIS EXISTS. Every rail here is native touch scrolling and CSS
 * scroll-snap, and `CardRail` and `StayRail` both say in their own comments
 * that there is no JavaScript in the mechanism. That rule is kept: this adds
 * nothing to the markup and replaces nothing. A finger could always drag a
 * rail and a trackpad could always swipe one; a mouse had only the scrollbar,
 * and globals.css hides every scrollbar site-wide — so on a desktop mouse a
 * rail read as a static row (August, 10 September 2026). With JS off, all of
 * this is absent and the row scrolls and snaps exactly as before.
 *
 * ⚠ WHY A SCOPE AND NOT A COMPONENT THAT RENDERS THE RAIL. Two constraints
 * meet here and only this shape satisfies both:
 *
 *  · The rail must keep its place in the row's own layout — it is one child
 *    of a flex column with the dots — so this wrapper takes no box:
 *    `display: contents`. (It does NOT make the rail a DOM sibling of the
 *    dots; `SliderDots` looks through this wrapper for it. See `findRail`
 *    there — correcting that assumption on 11 September 2026 is what made the
 *    dots light and click on /wonder.)
 *  · `CardRail` is shipped by /about, /partnerships and /our-people, which
 *    are static by decision, and its contract is that they get the row and
 *    nothing else. Importing a client component INTO CardRail broke that:
 *    measured on the build, all three then loaded the drag chunk as an eager
 *    `<script>`, and `next/dynamic` did not prevent it. Wrapping at the call
 *    site keeps CardRail byte-for-byte what it was — the three pages import
 *    nothing new — and only /wonder pays for the handler.
 *
 * Direct manipulation rather than narrative motion: the reader's own hand
 * moves the row and nothing here is timed, so it cites no row of the motion
 * grammar, on the same footing as the hero's playback guard.
 *
 * THE THREE THINGS THAT MAKE A DRAG-SCROLLER FEEL BROKEN IF LEFT OUT:
 *
 *  1 · `scroll-snap-type` fights a script that writes `scrollLeft`. The
 *      browser keeps pulling the row back to the nearest snap edge while the
 *      hand is still moving, and the row judders. Snap is off for the length
 *      of the drag AND across the settle that follows it, and comes back only
 *      once the row has arrived — see `settleToCard`, which is what makes the
 *      landing an animation rather than a jump.
 *  2 · A drag ends in a `click`, so releasing over a card would activate it.
 *      Past a 3px threshold the next click is swallowed in the capture phase.
 *      Below it nothing is swallowed, so a plain click still works.
 *  3 · Native image and text dragging start on the same gesture. Both are
 *      suppressed while the button is down, and only while it is down.
 *
 * MOUSE ONLY. Touch and trackpad already own this gesture and carry momentum
 * a script cannot match; intercepting them would make them worse.
 */
/**
 * The scroller inside the scope, without the rail having to know about this.
 *
 * `data-drag-rail` is the explicit way in and is what `StayRail` marks itself
 * with. `CardRail` is deliberately NOT edited to carry it — it is shipped by
 * three pages that must not change — so it is found the way it presents
 * itself: the `role="group"` its `label` prop sets, and failing that the first
 * descendant the browser reports as horizontally scrollable. Read once on
 * mount; a rail does not move within its own scope.
 */
function findRail(scope: HTMLElement | null): HTMLElement | null {
  if (!scope) return null;
  const marked = scope.querySelector<HTMLElement>(
    "[data-drag-rail], [role='group']",
  );
  if (marked) return marked;
  return (
    [...scope.querySelectorAll<HTMLElement>("*")].find((el) =>
      /auto|scroll/.test(getComputedStyle(el).overflowX),
    ) ?? null
  );
}

/** Marks a loop clone, and carries the index of the card it copies —
    `SliderDots` and `stay-marquee` both read it. */
const CLONE = "data-rail-clone";

/** Motion hooks a clone must not carry: the page's modules would otherwise
    find it on a later init and stage an entrance for a copy. */
const HOOKS = [
  "data-card",
  "data-card-tile",
  "data-card-hover",
  "data-card-copy",
  "data-frame-media",
  "data-motion",
];

/**
 * An inert, static copy of a card for the loop's ends.
 *
 * Hidden from the accessibility tree and from focus (`inert`), so a screen
 * reader and a keyboard meet every card exactly once. Inline styles are
 * dropped because GSAP writes its entrance state there and a clone taken
 * mid-entrance would be stuck at it — except on `img`, where the inline style
 * is next/image's own fill layout and the slot's `object-position`.
 */
function cloneCell(cell: HTMLElement, index: number): HTMLElement {
  const clone = cell.cloneNode(true) as HTMLElement;
  [clone, ...clone.querySelectorAll<HTMLElement>("*")].forEach((el) => {
    if (el.tagName !== "IMG") el.removeAttribute("style");
    el.removeAttribute("id");
    HOOKS.forEach((hook) => el.removeAttribute(hook));
  });
  clone.setAttribute(CLONE, String(index));
  clone.setAttribute("aria-hidden", "true");
  clone.setAttribute("inert", "");
  return clone;
}

export function DragScrollRail({
  children,
  loop = false,
}: {
  children: ReactNode;
  /**
   * The row comes round again: past the last card is the first, and before
   * the first is the last (August, 18 September 2026: "loop the cards").
   *
   * STILL NO JAVASCRIPT IN THE MECHANISM. The scroller stays native touch
   * scrolling and scroll-snap. On mount this adds inert clones of the end
   * cards (`cloneCell`) — one before the first, a screenful after the last —
   * and when the row comes to REST on a clone it is moved, in one frame and
   * with nothing visibly changing, to the card the clone copies. With JS off
   * there are no clones and the row is the plain rail it was.
   *
   * Only while the row is actually a rail: CardRail is the house grid from
   * 640 up, where a clone would be a stray fourth grid item, so the clones
   * are taken out again whenever the scroller stops being one (`measure`).
   */
  loop?: boolean;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = findRail(scope.current);
    if (!rail) return;

    /** Cells the row lays out — CardRail's `RailDrag` span is `hidden` and is
        not one (it was being measured as a card at 0,0 until 18 Sep 2026). */
    const cellsOf = () =>
      [...rail.children].filter(
        (cell): cell is HTMLElement =>
          cell instanceof HTMLElement && !cell.hidden,
      );
    const realOf = () => cellsOf().filter((cell) => !cell.hasAttribute(CLONE));
    /** The snapport's leading edge — see `settleToCard` for why not the box. */
    const edgeOf = () => {
      const style = getComputedStyle(rail);
      const inset =
        parseFloat(style.scrollPaddingLeft) ||
        parseFloat(style.paddingLeft) ||
        0;
      return rail.getBoundingClientRect().left + inset;
    };
    const nearestOf = (cells: HTMLElement[]) => {
      const edge = edgeOf();
      let nearest = cells[0];
      let best = Infinity;
      cells.forEach((cell) => {
        const distance = Math.abs(cell.getBoundingClientRect().left - edge);
        if (distance < best) {
          best = distance;
          nearest = cell;
        }
      });
      return { nearest, distance: best };
    };
    /** Put a cell on the snap edge in one frame, no animation. */
    const alignTo = (cell: HTMLElement) => {
      rail.scrollLeft += cell.getBoundingClientRect().left - edgeOf();
    };

    let active = false;
    let startX = 0;
    let startLeft = 0;
    let travelled = 0;
    /** The rAF handle of the settle watcher — see `whenStill`. */
    let settle: number | null = null;
    /** Last sample, for the release velocity. */
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;

    /**
     * ⚠ THE CURSOR MUST NOT PROMISE WHAT THE ROW CANNOT DO. `CardRail` is the
     * house grid from 640 up, where the row does not overflow and there is
     * nothing to drag — a grab hand over it is a lie. It is re-measured on
     * resize, because a window dragged across 640 changes the answer. The
     * classes are set here rather than in React state so that this component
     * renders no attributes of its own and the server markup is untouched.
     */
    /** What the clones were last built for, so a resize rebuilds only when
        the answer changed (crossing 640 or 1024, not every pixel). */
    let built = "";
    let touching = false;
    let wrapTimer = 0;
    /** See the note at the foot of `buildLoop`. */
    let homeWatch = 0;
    let touched = false;
    const onTouched = () => { touched = true; };

    const buildLoop = () => {
      if (!loop) return;
      const real = realOf();
      const style = getComputedStyle(rail);
      const isRail =
        real.length > 1 &&
        style.display === "flex" &&
        /auto|scroll/.test(style.overflowX);
      // Cards per screen: one on a phone, two on StayRail from 1024. That
      // many clones follow the last card, so a row resting on the first
      // clone is a FULL screen and looks exactly like the row at card one.
      const step = isRail
        ? real[1].getBoundingClientRect().left - real[0].getBoundingClientRect().left
        : 0;
      const perView = step > 0 ? Math.max(1, Math.round(rail.clientWidth / step)) : 0;
      const want = isRail ? `loop:${perView}` : "";
      if (want === built) return;

      // Hold the reader's place across the rebuild.
      const { nearest } = nearestOf(cellsOf());
      const at = nearest.hasAttribute(CLONE)
        ? Number(nearest.getAttribute(CLONE))
        : Math.max(0, real.indexOf(nearest));
      rail.querySelectorAll(`:scope > [${CLONE}]`).forEach((el) => el.remove());
      built = want;
      if (isRail) {
        real[0].before(cloneCell(real[real.length - 1], real.length - 1));
        const tail = Array.from({ length: perView }, (_, i) =>
          cloneCell(real[i % real.length], i % real.length),
        );
        real[real.length - 1].after(...tail);
      }
      const home = real[at] ?? real[0];
      alignTo(home);
      // ⚠ THE WRITE ABOVE DOES NOT ALWAYS SURVIVE PAGE LOAD (measured 18 Sep
      // 2026: §08 and §11 were left at scrollLeft 0, standing on the leading
      // clone with the LAST dot lit; §03 was fine). Those two sections are
      // pinned by `holdAtFoot`, and ScrollTrigger wraps a pinned element in
      // a pin-spacer when it is created — moving a node in the DOM resets
      // every scroller inside it to 0, silently, with no scroll event. That
      // happens once, a beat after mount (the page's motion waits on fonts),
      // so the row is watched for its first few seconds and put back. A
      // reader cannot REST at 0 themselves — that is the leading clone, and
      // `wrap` moves them off it — so until they touch the row, 0 is only
      // ever the reset.
      window.clearInterval(homeWatch);
      if (!isRail) return;
      let checks = 0;
      homeWatch = window.setInterval(() => {
        if (touched || (checks += 1) > 16) return window.clearInterval(homeWatch);
        if (rail.scrollLeft < 1) alignTo(home);
      }, 250);
    };

    /** The row has stopped on a clone: stand it on the real card instead. */
    const wrap = () => {
      if (!built || active || touching) return;
      const { nearest, distance } = nearestOf(cellsOf());
      const index = nearest?.getAttribute(CLONE);
      // Not at rest on it yet — a later scroll event will ask again.
      if (index == null || distance > 2) return;
      // Untouched and on the LEADING clone is the pin-spacer reset, not a
      // reader going backwards (nothing automatic travels that way): home.
      const leading = nearest === cellsOf()[0];
      const real = realOf()[leading && !touched ? 0 : Number(index)];
      if (real) alignTo(real);
    };
    const wrapSoon = () => {
      window.clearTimeout(wrapTimer);
      wrapTimer = window.setTimeout(wrap, 120);
    };
    // A finger still down owns the row; moving it under the finger drops the
    // gesture on iOS. The wrap waits for the lift.
    const onTouchStart = () => { touching = true; touched = true; };
    const onTouchEnd = () => { touching = false; wrapSoon(); };

    const measure = () => {
      buildLoop();
      rail.classList.toggle("cursor-grab", rail.scrollWidth > rail.clientWidth);
    };

    const restoreSnap = () => {
      if (settle !== null) cancelAnimationFrame(settle);
      settle = null;
      rail.style.scrollSnapType = "";
    };

    /**
     * Run `done` once the row has actually stopped moving.
     *
     * ⚠ NOT `scrollend`, WHICH LIES HERE (August, 10 September 2026). The
     * drag writes `scrollLeft` on every pointermove, so a `scrollend` for the
     * DRAG is already queued when the button comes up. Listening for one then
     * catches that stale event a few milliseconds later and restores snap in
     * the middle of the settle — measured: the property was back at 7ms into
     * a 240ms animation, and the row was left at 96px, which is not a snap
     * position at all. There is no way to tell that event from the one we
     * want, so the position itself is watched instead: three identical frames
     * is a stopped row, whatever caused it, in every browser.
     */
    const whenStill = (done: () => void) => {
      if (settle !== null) cancelAnimationFrame(settle);
      let last = Number.NaN;
      let stillFor = 0;
      let frames = 0;
      const tick = () => {
        const now = rail.scrollLeft;
        stillFor = now === last ? stillFor + 1 : 0;
        last = now;
        // The frame cap is a backstop, not the mechanism: about a second at
        // 60fps, long past any settle, so snap can never be left off.
        if (stillFor >= 3 || (frames += 1) > 60) {
          settle = null;
          done();
          return;
        }
        settle = requestAnimationFrame(tick);
      };
      settle = requestAnimationFrame(tick);
    };

    /**
     * Where the row should come to rest, and how it gets there.
     *
     * ⚠ LETTING CSS SNAP DO IT IS A JUMP, NOT A SETTLE (August, 10 September
     * 2026: "add smooth animation on switching images"). Restoring
     * `scroll-snap-type` re-snaps in a single frame — measured on this rail,
     * `scrollLeft` went 2662 → 2562 between one frame and the next with no
     * value in between. So the row is animated to the card itself, with snap
     * still off, and snap is restored only once it has arrived — by then the
     * position is already a snap point, so restoring it moves nothing.
     *
     * A FLICK ADVANCES A CARD. Snapping to whichever card is nearest ignores
     * a fast short throw, which is the most natural way to say "next" with a
     * mouse: past 0.5px/ms the card in the direction of travel wins instead.
     *
     * The snapport, not the box: `CardRail` bleeds through the page gutter
     * and restores it as its own padding, so a card's rest position is offset
     * by that — the same correction `SliderDots` makes to light the right dot.
     */
    const settleToCard = () => {
      // Clones included: a pull past the last card settles on the first's
      // clone, and `wrap` then stands the row on the real one.
      const cells = cellsOf();
      if (!cells.length) return;
      const edge = edgeOf();
      let index = cells.indexOf(nearestOf(cells).nearest);

      if (Math.abs(velocity) > 0.5) {
        // `velocity` is the pointer's; the row travels the other way.
        const next = index + (velocity < 0 ? 1 : -1);
        if (next >= 0 && next < cells.length) index = next;
      }

      const target =
        rail.scrollLeft + (cells[index].getBoundingClientRect().left - edge);
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      rail.scrollTo({ left: target, behavior: reduced ? "auto" : "smooth" });
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      if (rail.scrollWidth <= rail.clientWidth) return;
      active = true;
      travelled = 0;
      startX = event.clientX;
      startLeft = rail.scrollLeft;
      lastX = event.clientX;
      lastT = event.timeStamp;
      velocity = 0;
      restoreSnap();
      rail.style.scrollSnapType = "none";
      rail.classList.add("cursor-grabbing", "select-none");
    };

    const onMove = (event: PointerEvent) => {
      if (!active) return;
      const dx = event.clientX - startX;
      travelled = Math.max(travelled, Math.abs(dx));
      // Captured only once it is actually a drag, so a click that never moves
      // is still delivered to whatever sits under it.
      if (travelled > 3 && !rail.hasPointerCapture(event.pointerId)) {
        rail.setPointerCapture(event.pointerId);
      }
      rail.scrollLeft = startLeft - dx;
      // Sampled per event rather than averaged: the last move before release
      // is what the hand meant, and a mean over the whole drag would read a
      // slow reposition ending in a flick as slow.
      const elapsed = event.timeStamp - lastT;
      if (elapsed > 0) velocity = (event.clientX - lastX) / elapsed;
      lastX = event.clientX;
      lastT = event.timeStamp;
    };

    const onUp = (event: PointerEvent) => {
      if (!active) return;
      active = false;
      rail.classList.remove("cursor-grabbing", "select-none");
      if (rail.hasPointerCapture(event.pointerId)) {
        rail.releasePointerCapture(event.pointerId);
      }
      if (travelled > 3) {
        const swallow = (click: MouseEvent) => {
          click.preventDefault();
          click.stopPropagation();
        };
        rail.addEventListener("click", swallow, { capture: true, once: true });
        // If no click follows — the pointer left the rail, say — this must not
        // sit there waiting to eat an unrelated one later.
        window.setTimeout(
          () => rail.removeEventListener("click", swallow, { capture: true }),
          0,
        );
      }
      // Snap stays OFF across the settle — restoring it mid-flight is what
      // turns the animation back into a jump — and comes back once the row
      // has actually stopped. See `whenStill`.
      settleToCard();
      whenStill(restoreSnap);
    };

    const onDragStart = (event: Event) => {
      if (active) event.preventDefault();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    rail.addEventListener("pointerdown", onDown);
    rail.addEventListener("pointermove", onMove);
    rail.addEventListener("pointerup", onUp);
    rail.addEventListener("pointercancel", onUp);
    rail.addEventListener("dragstart", onDragStart);
    if (loop) {
      rail.addEventListener("scroll", wrapSoon, { passive: true });
      rail.addEventListener("touchstart", onTouchStart, { passive: true });
      rail.addEventListener("touchend", onTouchEnd);
      rail.addEventListener("touchcancel", onTouchEnd);
      for (const type of ["pointerdown", "wheel", "keydown", "rail:go"]) {
        rail.addEventListener(type, onTouched, { passive: true });
      }
    }
    return () => {
      window.clearTimeout(wrapTimer);
      window.clearInterval(homeWatch);
      for (const type of ["pointerdown", "wheel", "keydown", "rail:go"]) {
        rail.removeEventListener(type, onTouched);
      }
      rail.removeEventListener("scroll", wrapSoon);
      rail.removeEventListener("touchstart", onTouchStart);
      rail.removeEventListener("touchend", onTouchEnd);
      rail.removeEventListener("touchcancel", onTouchEnd);
      rail.querySelectorAll(`:scope > [${CLONE}]`).forEach((el) => el.remove());
      observer.disconnect();
      rail.removeEventListener("pointerdown", onDown);
      rail.removeEventListener("pointermove", onMove);
      rail.removeEventListener("pointerup", onUp);
      rail.removeEventListener("pointercancel", onUp);
      rail.removeEventListener("dragstart", onDragStart);
      rail.classList.remove("cursor-grab", "cursor-grabbing", "select-none");
      if (settle !== null) cancelAnimationFrame(settle);
    };
  }, [loop]);

  /* `contents` so this has no box and the rail keeps its own place in the
     row's flex column. SliderDots looks through it for the scroller.
     `data-drag-scope` tells CardRail's own `RailDrag` to stand down: since
     17 Sep 2026 both were attached to the Wonder rails, and RailDrag's
     next-frame snap restore turned this one's animated settle into a jump. */
  return (
    <div ref={scope} data-drag-scope className="contents">
      {children}
    </div>
  );
}
