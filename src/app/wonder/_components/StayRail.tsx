import type { ReactNode } from "react";
import { Children } from "react";
import { SliderDots } from "@/components/ui/SliderDots";

/**
 * Where you stay — the carousel, /wonder §08 only.
 *
 * WHY NOT `CardRail`. That component is a phone rail that becomes the house
 * grid from `sm` up, and its own doc comment is emphatic that its desktop
 * rendering must not change: /about, /partnerships and /our-people are static
 * by decision and ship exactly it. This row is a different thing — ten frames
 * that stay a swipeable rail at every width (August, 10 September 2026,
 * "make it a carousel"). Adding an "always a rail" mode to CardRail would put
 * a branch through three pages that did not ask for one, so this is its own
 * component and CardRail is untouched.
 *
 * ⚠ NO JAVASCRIPT IN THE MECHANISM, which is CardRail's rule and is kept
 * here. Native touch scrolling and CSS scroll-snap; no drag handler, no
 * arrows, no scroll listener on the scroller's own behaviour. With JS off it
 * scrolls and snaps exactly the same and the dots render inert on the first
 * card. On a desktop pointer the row is scrolled with a trackpad swipe, the
 * scrollbar, or by tabbing to it — the same affordances the phone rail has
 * always had, plus the peek of the next card.
 *
 * ⚠ NO ENTRANCE ANIMATION on the cards, by direction (August, 10 September
 * 2026). The old two-card row opened each card with `frameOpen`; ten cards
 * that a reader is going to swipe through cannot each stage an arrival — the
 * ones off-screen would either animate unseen or pop as they scroll in. The
 * heading and copy still enter (`wonder/sleep` in lib/motion/wonder.ts); the
 * rail does not. Nothing here carries a motion hook.
 *
 * ⚠ NOT bled through the gutter. CardRail's `-mx-5 px-5` trick exists so a
 * phone rail's overflow is its own and can never pan the page; it works
 * because that rail is gone by 640. This one is not, and a negative margin
 * that matched the 20px phone gutter would overhang the 64px desktop one.
 * The rail sits inside the container at every width instead, so its cards
 * line up with the heading above them.
 *
 * ⚠ NO scrollbar-hiding classes — globals.css:100-111 already hides every
 * scrollbar site-wide, on inner scrollers as well as the document.
 *
 * `-my-2 py-2` is a geometric no-op for the focus ring, the same as
 * CardRail's: `overflow-x: auto` computes `overflow-y` to `auto`, which clips
 * at the padding box, and focus is drawn at `outline-offset: 3px`.
 *
 * ONE CARD on the phone and TWO at 1024, which is the width the two-card
 * frame (2033:6782) drew — so the desktop row still reads as that frame, and
 * the extra eight are behind a swipe rather than a redesign of the section.
 */
export function StayRail({
  label,
  children,
}: {
  /** Names the row for a screen reader, e.g. "Where you stay". */
  label: string;
  /** ONE element per card. A fragment would put two cards in one cell. */
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* A real tab stop at every width: the cards hold no focusable child,
          so without it a keyboard cannot reach anything past card two. */}
      <div
        tabIndex={0}
        role="group"
        aria-label={label}
        className="-my-2 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain py-2 lg:gap-12"
      >
        {Children.map(children, (card) => (
          /* Literal both ways — Tailwind cannot see a computed class. The
             desktop width is half the row less one `lg:gap-12`, so two cards
             sit exactly where the frame's two cards did. */
          <div
            className="w-full shrink-0 snap-start lg:w-[calc((100%-3rem)/2)] [&>*]:h-full"
          >
            {card}
          </div>
        ))}
      </div>
      <SliderDots count={Children.count(children)} label={label} />
    </div>
  );
}
