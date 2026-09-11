"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The frame's slider dots under a phone card row (Highlights 2576:24656,
 * Where you sleep 2576:22542), supplied as artwork 9 Sep 2026 (August).
 *
 * ⚠ THIS REOPENS A DECISION. CardRail's peek rail was chosen over the frame's
 * one-card-plus-dots slider on 2026-09-05 (Ivy) precisely because the peek
 * needs no JavaScript and dots do. That reasoning still holds for /about,
 * /partnerships and /our-people, which are static by decision — so nothing
 * there changes: `dots` is opt-in and only /wonder passes it. Wonder already
 * ships client motion (the hero film, the drawn maps), so an indicator that
 * needs a scroll listener is not a new cost on this page.
 *
 * WITHOUT JAVASCRIPT the row still works exactly as before: it is native
 * scroll-snap, and the dots simply render inert at rest on the first card.
 * They are additive, never the mechanism.
 *
 * THE COUNT IS THE REAL CARD COUNT. Both frames draw five dots over rows of
 * three cards and two — a Relume placeholder nobody wired up — so the frames
 * are followed on shape, position and colour, and not on that number.
 *
 * THE SHAPE IS THE ARTIST'S. The five dots in the export are one hand-drawn
 * blob translated 15.51 apart (verified: every control point differs by
 * exactly that), so one path is carried here and repeated.
 */

/** The dot, at its own bounding box in the export's coordinates. */
const DOT_BOX = "132.72 0 7.51 7.42";
const DOT_PATH =
  "M137.507 7.29029C136.889 7.43693 136.06 7.46952 135.425 7.29029C133.637 6.7852 132.417 4.8463 132.791 3.08663C133.181 1.31066 134.645 0.104955 136.255 0.00719573C138.076 -0.106857 139.588 1.14773 140.108 2.85852C140.677 4.71595 139.23 6.89925 137.523 7.29029H137.507Z";

/**
 * The scroller these dots belong to.
 *
 * ⚠ `display: contents` DOES NOT MAKE A NODE A DOM SIBLING (August, 11
 * September 2026 — "sliderdots state not moving and not clickable"). The
 * original idiom here was `previousElementSibling` alone, and `DragScrollRail`
 * was written to be `contents` so that it would still work. It does not:
 * `contents` removes the box from LAYOUT, not the element from the TREE, so
 * on /wonder §08 the previous sibling is the drag scope's wrapper and the
 * rail is a level below it. The dots then listened to nothing, lit nothing
 * and scrolled nothing.
 *
 * So the previous sibling is taken when it IS the scroller, and otherwise the
 * rail is looked up inside it — the same two markers `DragScrollRail`
 * matches on, `data-drag-rail` and the `role="group"` that `label` sets.
 * CardRail's rows, which have no wrapper, resolve on the first branch exactly
 * as before.
 */
function findRail(dots: HTMLElement | null): HTMLElement | null {
  const previous = dots?.previousElementSibling;
  if (!(previous instanceof HTMLElement)) return null;
  if (/auto|scroll/.test(getComputedStyle(previous).overflowX)) return previous;
  return previous.querySelector<HTMLElement>("[data-drag-rail], [role='group']");
}

export function SliderDots({
  count,
  label,
  everyWidth = false,
}: {
  /** How many cards the rail holds. */
  count: number;
  /** Names the row for a screen reader, e.g. "Highlights". */
  label: string;
  /**
   * Keep the dots from `sm` up as well as on the phone.
   *
   * OFF BY DEFAULT, because a CardRail row stops being a rail at 640 — it is
   * the house grid from there and there is nothing to page through, so an
   * indicator would be pointing at a static row. StayRail (/wonder §08, Where
   * you stay) is a rail at EVERY width, ten frames two-up on desktop, so it
   * passes this and the dots stay under the row on laptop and desktop where
   * they are the only sign there is more than what is shown (August, 10
   * September 2026).
   */
  everyWidth?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    // The scroller is found from the node directly above this one — reached
    // this way so CardRail can stay a server component and the static pages
    // never cross a client boundary. See `findRail` for why it is not simply
    // that node.
    const rail = findRail(ref.current);
    if (!rail) return;

    // Whichever card's leading edge sits nearest the rail's own snap edge
    // wins. Measured off live rects rather than a card width, so a rail whose
    // cards are not all the same width still lands on the right dot, and the
    // scroller's padding (the gutter it bleeds back in) is accounted for.
    const sync = () => {
      const cells = [...rail.children].filter(
        (cell): cell is HTMLElement => cell instanceof HTMLElement,
      );
      if (!cells.length) return;
      const edge =
        rail.getBoundingClientRect().left +
        parseFloat(getComputedStyle(rail).paddingLeft);
      let nearest = 0;
      let best = Infinity;
      cells.forEach((cell, i) => {
        const distance = Math.abs(cell.getBoundingClientRect().left - edge);
        if (distance < best) {
          best = distance;
          nearest = i;
        }
      });
      setActive(nearest);
    };

    sync();
    rail.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      rail.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  const go = (i: number) => {
    const rail = findRail(ref.current);
    if (!rail) return;
    const cell = rail.children[i];
    if (!(cell instanceof HTMLElement)) return;
    cell.scrollIntoView({
      inline: "start",
      block: "nearest",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    /* The frame seats the dots 24 under the card and centres them on the
       container (2576:24656 — five dots spanning 132.72 → 202.28, centre
       167.5, which is 335/2). Gone from `sm` up, where the row is the house
       grid and there is nothing to page through — unless `everyWidth` says the
       row is still a rail up there. */
    <div
      ref={ref}
      className={`flex justify-center gap-2 ${everyWidth ? "" : "sm:hidden"}`}
    >
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => go(i)}
          aria-label={`${label} — card ${i + 1} of ${count}`}
          aria-current={i === active}
          className="flex size-6 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
        >
          <svg
            aria-hidden
            viewBox={DOT_BOX}
            className="h-[7.42px] w-[7.51px] shrink-0"
            /* The export's own two values. Neither is a palette token: the
               lit dot is #EFB35C, which is not --color-gold (#fbae3d), and
               the rest are charcoal at 10%. Raised with the other V2/brand-kit
               colour drifts rather than invented as a token here. */
            fill={i === active ? "#EFB35C" : "#090E12"}
            fillOpacity={i === active ? 1 : 0.1}
          >
            <path d={DOT_PATH} />
          </svg>
        </button>
      ))}
    </div>
  );
}
