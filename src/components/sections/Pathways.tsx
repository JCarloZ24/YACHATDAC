import Image from "next/image";
import Link from "next/link";
import { wayForward } from "@/content/homepage";
import { homePathwayMedia } from "@/content/homepage-media";
import "./pathways.css";

/**
 * The pathways — the page's second and last navigation.
 *
 * Prototype deck slide 24, user direction 9 September 2026. The last panel on
 * the pinned hero canvas, and the page's final screen before the footer: the
 * offer clears and this comes up in its place, the same way The Invitation
 * arrives. It was briefly an ordinary scrolling section below the canvas;
 * moving it up here is what keeps the whole homepage on one surface.
 *
 * Everything is sized against the viewport rather than the document, because
 * a panel gets exactly one screen. The card images were plain `svh` heights
 * for that reason; they are a declared 5:4 with an `svh` cap as a guard (10
 * September 2026, user direction). The cap only bites on a short viewport,
 * where the picture shortens rather than pushing the CTAs off the bottom —
 * the original guarantee, kept.
 *
 * ⚠ 5:4 is DECLARED here, briefly having been `aspect-square`. That was the
 * bug it looks like it is not: square plus the cap meant the card's shape was
 * decided by viewport HEIGHT, so the same page drew 1:1 on a tall screen and
 * 1.23 on a short one. What shipped was the accident, not the square.
 *
 * Track geometry is read off the hi-fi rather than chosen: card 327px and gap
 * 67px at a 1563px viewport, which is 21vw and 4.3vw. 28vw shipped before and
 * showed three cards; 21vw shows just under four, which is what the frame
 * does. Budget at the 760px min-height: 141 heading + 56 gap + 242 image +
 * 246 of card copy = 685.
 *
 * ⚠ This restores the four pathways that went unrendered when the statement
 * panel replaced the old Way Forward section — including `/partnerships`,
 * which the primary nav does not carry and which therefore had no homepage
 * entry point at all in between. The newsletter signup did NOT come back with
 * them; the homepage still has no email capture. See WayForwardStatement.tsx.
 *
 * D5: `wayForward.tagline` and the four `wayForward.paths` verbatim. The
 * card eyebrows are hi-fi, held in the content module with the reasoning —
 * they are on the deck and in no draft.
 *
 * The row runs off the right edge as the deck has it, so the fourth card is
 * visibly cut and the set reads as more than a screen holds — and the page's
 * own scroll then carries the track right to bring it in. One scroll, one
 * direction of input: there is no separate swipe to discover, which is the
 * point of it being on the canvas at all.
 */
export function Pathways() {
  return (
    <div
      id="pathways"
      data-home-pathways
      /* lg:pt-28 keeps the panel clear of the header, which is 130px
         tall and `fixed` — it overlays this panel rather than pushing
         it down, so a `justify-center` block with no top padding centres
         itself straight under the nav. It did: the heading was reading
         through WONDER / TRUTH / LIVING WORK. 112px rather than the full
         130 because the logo is h-14 centred in that band, so its visible
         foot is at about 93px and the rest is air. Mobile clearance and
         the remaining card height are handled in pathways.css (user
         screenshot, 12 September 2026), including the 80px mobile bar. */
      className="home-pathways-panel absolute inset-0 z-[3] flex flex-col justify-center text-canvas lg:pt-28"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 lg:px-16">
        <h2 data-pathways-heading className="headline mx-auto max-w-[36ch] text-center text-h1 leading-[1.1] tracking-normal">
          {wayForward.tagline}
        </h2>
      </div>
      {/* The row is a track, not a scroller (9 September 2026, user
          direction): the page's own scroll carries it right during the beat,
          so the fourth card arrives by scrolling down rather than by swiping
          across. The mask keeps the viewport margin on the left and lets the
          track run off the right, which is what says there is more here than
          fits.

          ⚠ Because the mask is `overflow-hidden`, a card scrolled out of the
          mask is still focusable and the browser will scroll the mask to
          reach it, silently desynchronising the track from the timeline. If
          that shows up in keyboard testing, the fix is a scroll handler that
          resets `scrollLeft`, not switching the mask off. */}
      <div className="home-pathways-mask mt-8 overflow-hidden pl-5 lg:mt-14 lg:pl-16">
        {/* The track carries its own trailing margin as padding, so the row
            comes to rest with the last card clear of the right edge rather
            than run into it. It is part of the measured width, which is why
            the travel stops there without a second number to keep in sync. */}
        <div data-pathways-track className="flex gap-4 pr-5 lg:gap-16 lg:pr-16">
          {wayForward.paths.map((path, index) => {
            const media = homePathwayMedia[index];
            return (
              <div key={path.href} data-pathway-card className="shrink-0 basis-[calc(100vw-3.5rem)] sm:basis-[46vw] lg:basis-[21vw]">
                <Link
                  href={path.href}
                  className="flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-canvas"
                >
                  {/* Frame grade: the photograph is held, and the mark sits
                      over its top corner exactly as the Invitation's does. */}
                  <div className="home-pathway-image relative aspect-[5/4] max-h-[34svh] overflow-hidden rounded-[20px] lg:max-h-[40svh]">
                    {/* ⚠ `sizes` IS NOT THE CARD WIDTH, and reading it as one
                        is what under-served these for two days (fixed 11
                        September 2026). `object-cover` scales a photograph
                        until its SHORT axis fills the box and crops the long
                        one, so the width actually PAINTED is the box's
                        HEIGHT times the source's aspect — not the box's own
                        width. All four sources are 1.897:1 in a 5:4 box, so:
                        boxW x 0.8 x 1.897 = boxW x 1.518. At `lg` the card is
                        21vw, so the browser paints 32vw of photograph; at
                        `sm` 46vw becomes 70vw. Below `sm` the `max-h-[34svh]`
                        cap bites first — 238px of height on a 375x700 phone,
                        so 451 CSS px, i.e. 120vw. Over 100vw is legal and
                        correct: the crop really is wider than the screen.

                        The old value was 28vw at every width, which was the
                        card's OLD basis (the comment above records the move to
                        21vw) rather than any painted width. Two errors that
                        happened to partly cancel. */}
                    <Image src={media.src} alt="" fill
                      sizes="(min-width: 1024px) 32vw, (min-width: 640px) 70vw, 120vw"
                      /* 85, not the default 75: the same call The Record's
                         cards made (next.config.ts allowlists it) and for the
                         same reason — a heavy cover crop magnifies whatever
                         softening the encoder does. */
                      quality={85}
                      className="object-cover" style={{ objectPosition: media.position }} />
                    <Image src={media.icon} alt="" width={45} height={42}
                      className="absolute left-6 top-6 h-[42px] w-[45px] object-contain" />
                  </div>
                  {/* Sized against The Invitation, not invented (10 September
                      2026, type sweep). These two card sets are one scroll
                      apart on the same canvas and were drifting: the card
                      title resolved to 40 here against 32 there, because
                      invitation.css declares `--text-h3: 2rem` and this panel
                      never did; the card eyebrow was 14 against 13; the CTA 14
                      against 16. Same leak as the heading below — a panel
                      inheriting the hero's scale because nobody scoped it.

                      Eyebrow AND CTA are both ochre (10 September 2026, user
                      direction — "the cta links ... should be the same color
                      yellow like eyebrow"). The CTA was briefly canvas, to buy
                      a colour difference between the two; the direction is
                      that the pair should read as one accent, and the layout
                      already separates them — 13 against 16, 0.12em against
                      0.2em, glued to the title against pinned to the floor,
                      and only one of them carries a chevron.

                      Ochre is safe HERE and nowhere near it: these words sit
                      below the image on the panel's own dark ground, where
                      ochre on charcoal is 7.7 : 1. The Invitation's copy sits
                      ON the photograph, where the same ochre measures 2.76 : 1
                      and has to stay canvas. Same accent, two grounds — do not
                      "make them consistent" without measuring the second. */}
                  <p className="eyebrow mt-5 leading-[1.4] text-ochre">{path.eyebrow}</p>
                  <h3 className="headline mt-2 text-h3 leading-none tracking-normal">{path.title}</h3>
                  <p className="mt-4 text-base leading-[1.5] text-canvas/90">{path.description}</p>
                  <span className="mt-auto flex items-center gap-2 pt-8">
                    <span className="eyebrow text-base leading-[1.5] tracking-[0.2em] text-ochre">{path.cta}</span>
                    {/* Inline rather than the shared invitation-chevron.svg,
                        which is a hardcoded fill="white" stroke="white" and
                        would sit white beside ochre text. currentColor keeps
                        the mark on whatever the label is, so the pair cannot
                        drift apart again. Same path, same 24 viewBox. */}
                    <svg aria-hidden="true" viewBox="0 0 24 24" width={20} height={20} className="shrink-0" fill="currentColor" stroke="currentColor">
                      <path d="M9.38708 6.67285C9.48791 6.67285 9.56488 6.70326 9.64294 6.78125L14.5873 11.7256C14.6412 11.7795 14.6663 11.8215 14.6781 11.8496V11.8506C14.6929 11.8861 14.7015 11.9259 14.7015 11.9746C14.7015 12.0233 14.6929 12.0631 14.6781 12.0986V12.0996C14.6663 12.1277 14.6412 12.1697 14.5873 12.2236L9.61853 17.1924C9.54076 17.2702 9.47362 17.292 9.39294 17.2891C9.29892 17.2856 9.21805 17.2537 9.1322 17.168C9.05408 17.0898 9.02283 17.013 9.02283 16.9121C9.02283 16.8112 9.05408 16.7344 9.1322 16.6562L13.8138 11.9746L9.10681 7.26758C9.02915 7.18988 9.0072 7.12357 9.01013 7.04297C9.01358 6.9487 9.04615 6.86731 9.1322 6.78125C9.21013 6.70344 9.28649 6.67293 9.38708 6.67285Z" />
                    </svg>
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
