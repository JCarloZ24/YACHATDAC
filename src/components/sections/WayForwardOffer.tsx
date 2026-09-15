import type { CSSProperties } from "react";
import Image from "next/image";
import { wayForward } from "@/content/homepage";
import { homeOfferMedia, type HomeOfferSlot } from "@/content/homepage-media";

/**
 * The Way Forward, second panel — the offer itself.
 *
 * Prototype deck slides 22 and 23, user direction 9 September 2026. The
 * closing line holds, then it clears and this takes the same canvas: the body
 * alone first, then four photographs arriving around it. It is the last thing
 * the pinned hero does before the footer.
 *
 * D5: `wayForward.body` verbatim, and it is the draft's own paragraph — the
 * one the content module has carried unrendered since the pathways left. ⚠ It
 * carries both "Indigenous traditions" and "First Nations" in three
 * sentences, which FNAN flagged for checking (24 August); D16 settles that,
 * not an edit here. Rendering it does not resolve the flag, it surfaces it.
 *
 * The photographs are `frame` grade and stay still inside their own corners;
 * only their arrival moves. The set deliberately does not touch the copy —
 * two above, two below, the middle band left to the words.
 *
 * ⚑ COMPACT, 15 September 2026, user direction: below lg the four used to be
 * `hidden` ("would collide with the copy at any size worth showing"). They now
 * show, as a staggered row of two above the paragraph and two below, IN FLOW
 * — the panel becomes a centred column — so the copy can never be overlapped
 * whatever its length. The rows are `lg:contents`, so from lg up they vanish
 * as boxes and each plate is absolutely placed against the panel exactly as
 * before: the desktop numbers are the same, only carried in custom
 * properties that the `lg:` classes read.
 */
export function WayForwardOffer() {
  const row = (name: HomeOfferSlot["compact"]["row"]) =>
    homeOfferMedia.filter((slot) => slot.compact.row === name).map((slot) => <OfferPlate key={slot.src} slot={slot} />);
  return (
    <div
      data-home-offer
      /* Nothing in here is interactive, and the panel covers the whole
         canvas -- including the cards on The Invitation, which are links.
         Below lg it is a column: row, paragraph, row; pt clears the header. */
      className="home-offer pointer-events-none absolute inset-0 z-[3] flex items-center text-canvas max-lg:flex-col max-lg:justify-center max-lg:gap-7 max-lg:pt-22 max-lg:pb-7"
    >
      {/* Percentages of the panel, from the deck (see homeOfferMedia). They
          are composition, not a grid — there is no Figma node for this slide,
          so nothing here is a token being ignored. */}
      <div className="flex w-full max-w-[600px] items-start justify-between px-5 lg:contents">
        {row("above")}
      </div>
      <p
        data-offer-body
        /* z-[1]: from lg the lower plates now follow this in the DOM, and it
           must still paint over them, as it did when they came first. */
        className="relative z-[1] mx-auto max-w-[900px] px-6 text-center text-base leading-[1.6] lg:px-16 lg:text-xl"
      >
        {wayForward.body}
      </p>
      <div className="flex w-full max-w-[600px] items-end justify-between px-5 lg:contents">
        {row("below")}
      </div>
    </div>
  );
}

function OfferPlate({ slot }: { slot: HomeOfferSlot }) {
  /* ⚠ `sizes` IS DERIVED, NOT DECLARED — 11 September 2026. Every plate
     carried a flat `32vw`, which was right for none of them and badly
     wrong for the portrait.

     `object-cover` scales a photograph until its SHORT axis fills the
     box and crops the long one, so the width the browser actually paints
     is not the box's width whenever the source is proportionally wider
     than the box. The plate is `slot.w` percent of a panel that is
     `inset-0` on the canvas, i.e. `slot.w` vw, and its box ratio is
     `slot.aspect`; the source's own ratio is its recorded pixels. Where
     the source is the wider of the two, height drives and the painted
     width is boxH x sourceRatio.

     Which lands at 32 / 26 / 29 / 33vw on desktop. The portrait plate is the
     one that mattered: a 1.897:1 photograph in a 0.79 box is cropped to a
     sliver, so its 13.75vw box paints 33vw of picture — two and a half
     times the number that used to be declared for it. The compact width is
     the same sum over the row's share of the viewport (rows are near full
     width below lg). */
  const painted = (w: number) => Math.ceil(Math.max(w, (w / slot.aspect) * (slot.width / slot.height)));
  const { compact } = slot;
  return (
    <div
      data-offer-plate
      data-left={slot.left}
      data-top={slot.top}
      aria-hidden="true"
      className="pointer-events-none relative shrink-0 overflow-hidden rounded-[16px] w-(--offer-cw) mt-(--offer-mt) mb-(--offer-mb) mr-(--offer-mr) lg:absolute lg:m-0 lg:rounded-[20px] lg:left-(--offer-l) lg:top-(--offer-t) lg:w-(--offer-w)"
      style={{
        aspectRatio: slot.aspect,
        "--offer-l": `${slot.left}%`,
        "--offer-t": `${slot.top}%`,
        "--offer-w": `${slot.w}%`,
        "--offer-cw": `${compact.w}%`,
        "--offer-mt": `${compact.mt ?? 0}%`,
        "--offer-mb": `${compact.mb ?? 0}%`,
        "--offer-mr": `${compact.mr ?? 0}%`,
      } as CSSProperties}
    >
      {/* quality 85 for the crop, as on the pathway cards. */}
      <Image src={slot.src} alt="" fill sizes={`(min-width: 1024px) ${painted(slot.w)}vw, ${painted(compact.w)}vw`}
        quality={85} className="object-cover" />
    </div>
  );
}
