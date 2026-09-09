import { Children } from "react";
import type { ReactNode } from "react";
import { SliderDots } from "./SliderDots";

/**
 * One row of cards: a swipe rail on a phone, the house grid from `sm` up.
 *
 * The card sets on /about, /partnerships and /our-people were drawn four
 * across at 1440. Stacked on a phone they became four full-width plates a
 * reader had to scroll past one at a time; Ivy asked for a swipe row instead
 * (2026-09-05). From 640 up nothing changes — the same grid, the same
 * columns, the same gaps as before.
 *
 * ⚠ NO JAVASCRIPT IN THE MECHANISM. The row itself is native touch scrolling
 * and CSS scroll-snap only: no drag handler, no arrows, no scroll listener on
 * the scroller's own behaviour. It renders and works identically with JS off,
 * which is why it is NOT built on `RangerCarousel` — that component's CSS
 * idioms are borrowed here (`living-work/…:333, 336`), its GSAP Draggable is
 * not. The three static-by-decision pages ship exactly this and nothing else.
 *
 * The one addition is `dots`, added 9 Sep 2026 for /wonder alone. It is
 * additive and opt-in: the dots indicate and shortcut, they are never the
 * mechanism, and with JS off the row still scrolls and snaps as before. See
 * the prop, and ui/SliderDots.
 *
 * ⚠ NOT `touch-pan-y`. RangerCarousel carries it because Draggable owns the
 * X axis there. Here it would forbid the native horizontal pan and the rail
 * would not scroll at all.
 *
 * ⚠ NO scrollbar-hiding classes — `globals.css:100-111` already hides every
 * scrollbar site-wide, on the document and on inner scrollers alike.
 *
 * THE BLEED. The pages' column is `w-full px-6 sm:px-10 lg:px-25` — padding
 * only, no max-width. `-mx-6` cancels the 24px phone gutter exactly and
 * `px-6` re-applies it as the scroller's own padding, so the track's margin
 * box is exactly the viewport and its overflow is its own. It can never pan
 * the page, which matters because nothing in this repo clamps `overflow-x`
 * on `html` or `body`. `sm:px-10` never coexists with the rail — the rail is
 * gone by 640.
 *
 * `-my-2 py-2` is a geometric no-op that exists for the focus ring:
 * `overflow-x: auto` computes `overflow-y` to `auto`, which clips at the
 * padding box, and the site draws focus at `outline-offset: 3px`. Without the
 * 8px of vertical padding the ring is sliced off every card.
 *
 * SCROLL SNAP IS NEW TO THIS CODEBASE and is a deliberate first use. Without
 * it a rail rests wherever the finger stops — and these cards are `rounded-3xl`
 * plates on a solid ground, so one resting 40% off-screen reads as broken
 * layout rather than as a row. `scroll-px-6` is not optional alongside it: the
 * snapport defaults to the padding box, so `snap-start` would otherwise align
 * card one flush to the viewport edge and eat the gutter. `overscroll-x-contain`
 * stops an over-swipe from triggering the browser's back gesture.
 *
 * THE PEEK IS THE AFFORDANCE, unless `dots` says otherwise. `w-[78vw]` leaves
 * 42px of the next card visible at 375 and 46px at 390 — against a 24px corner
 * radius, so what shows is plainly a second plate and not a rendering
 * artefact. Under `dots` the card takes the full width instead and the dots
 * carry the affordance, which is what the Wonder frames draw.
 *
 * NOT CONVERTED: `the-record/_components/Sections.tsx` has a fifth row with
 * the identical grid, but it is a `ul`/`li` carrying `data-record-arrive` and
 * The Record is not static by decision. Converting it needs a motion decision
 * first.
 */
export function CardRail({
  columns,
  gap = "",
  className = "",
  label,
  bleed = "-mx-6 px-6 scroll-px-6",
  dots = false,
  children,
}: {
  /**
   * The grid template from `sm` up, as a LITERAL class string. Tailwind
   * cannot see `grid-cols-${n}` (`src/lib/tone.ts` documents the same trap),
   * so the literal has to appear at the call site — e.g.
   * `"sm:grid-cols-2 lg:grid-cols-4"`, or `"lg:grid-cols-2"` for a row that
   * stays one column until 1024.
   */
  columns: string;
  /**
   * A prefixed gap override, literal. The rail's own gap is always `gap-4`;
   * 32px between phone cards eats the peek. Pass `"sm:gap-8"` where the grid
   * wants more room from 640 up.
   */
  gap?: string;
  /** Spacing that used to sit on the grid div — e.g. `"mt-12 lg:mt-20"`. */
  className?: string;
  /**
   * Set ONLY where no child is focusable. It adds a real tab stop at every
   * width, so it is wrong wherever the cards are already links: `tabIndex`
   * cannot be withdrawn at a breakpoint without JavaScript, and on desktop
   * the element is a plain grid with nothing to scroll. The one place it is
   * right is a rail of `article` cards, which a keyboard cannot otherwise
   * reach past the first screen.
   */
  label?: string;
  /**
   * The gutter the rail bleeds through, as a LITERAL class triple — the
   * negative margin that cancels the page gutter, the padding that restores
   * it inside the scroller, and the matching snap padding. The default is
   * the `px-6` gutter the static pages use; /wonder's frame sets its phone
   * gutter at 20 (`px-5`), and a 24px bleed inside a 20px column would
   * overhang by 4px a side and pan the page.
   */
  bleed?: string;
  /**
   * Show the frame's slider dots under the row on a phone, and give each card
   * the full container width instead of the 78vw peek.
   *
   * OPT-IN, AND ONLY /wonder PASSES IT. The peek was chosen over dots on
   * 2026-09-05 (Ivy) because it needs no JavaScript; that is still right for
   * the pages that are static by decision, and they are unchanged. The Wonder
   * frames draw a one-card slider with dots (2576:24656, 2576:22542) and
   * August asked for it on 9 Sep 2026. Requires `label`, which names the row
   * for a screen reader.
   */
  dots?: boolean;
  /**
   * ONE element per card. A fragment counts as a single child and would put
   * two cards in one rail cell.
   */
  children: ReactNode;
}) {
  const rail = (
    <div
      {...(label
        ? { tabIndex: 0, role: "group", "aria-label": label }
        : null)}
      className={`${bleed} -my-2 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain py-2 sm:mx-0 sm:my-0 sm:grid sm:snap-none sm:overflow-visible sm:px-0 sm:py-0 ${gap} ${columns} ${className}`}
    >
      {/* The cell exists for equal heights and nothing else. A flex item
          stretches but its block child does not, so `[&>*]:h-full` squares the
          rail; `sm:contents` then removes the cell's box entirely so the card
          is the grid item again from 640 up and the desktop computed styles
          are identical to what they were, not merely equivalent.

          Deliberately a bare `div`, not `ul`/`li`: a list would add "list, 4
          items" to the accessibility tree at every width — a change to the
          desktop rendering — and `display: contents` on an `li` is the one
          case with lingering list-semantics bugs. */}
      {Children.map(children, (card) => (
        /* Literal both ways — Tailwind cannot see a computed class. `w-full`
           is the frame's one-card slider (100% of the scroller's content box,
           which the bleed makes exactly the container); `w-[78vw]` is the
           peek. */
        <div
          className={`${dots ? "w-full" : "w-[78vw]"} shrink-0 snap-start sm:contents [&>*]:h-full sm:[&>*]:h-auto`}
        >
          {card}
        </div>
      ))}
    </div>
  );

  if (!dots) return rail;

  // The frame seats the dots 24 under the card row (Column bottom 471 → Dots
  // 495 on Highlights, 407 → 431 on Where you sleep), which is the `gap-6`
  // the sections already use between their own blocks.
  return (
    <div className="flex flex-col gap-6">
      {rail}
      <SliderDots count={Children.count(children)} label={label ?? "Cards"} />
    </div>
  );
}
