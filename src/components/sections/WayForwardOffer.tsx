import Image from "next/image";
import { wayForward } from "@/content/homepage";
import { homeOfferMedia } from "@/content/homepage-media";

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
 */
export function WayForwardOffer() {
  return (
    <div
      data-home-offer
      /* Nothing in here is interactive, and the panel covers the whole
         canvas -- including the cards on The Invitation, which are links. */
      className="home-offer pointer-events-none absolute inset-0 z-[3] flex items-center text-canvas"
    >
      {/* Percentages of the panel, from the deck (see homeOfferMedia). They
          are composition, not a grid — there is no Figma node for this slide,
          so nothing here is a token being ignored. Below lg the four would
          collide with the copy at any size worth showing, so they are held
          for the wide viewport and the paragraph carries the beat alone. */}
      {homeOfferMedia.map((slot) => (
        <div
          key={slot.src}
          data-offer-plate
          aria-hidden="true"
          className="pointer-events-none absolute hidden overflow-hidden rounded-[20px] lg:block"
          style={{ left: `${slot.left}%`, top: `${slot.top}%`, width: `${slot.w}%`, aspectRatio: slot.aspect }}
        >
          <Image src={slot.src} alt="" fill sizes="32vw" className="object-cover" />
        </div>
      ))}
      <p
        data-offer-body
        className="relative mx-auto max-w-[900px] px-6 text-center text-base leading-[1.6] lg:px-16 lg:text-xl"
      >
        {wayForward.body}
      </p>
    </div>
  );
}
