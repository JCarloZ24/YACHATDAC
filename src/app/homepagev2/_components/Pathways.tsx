import Image from "next/image";
import Link from "next/link";
import { wayForward } from "../_content/homepage";
import { homePathwayMedia } from "../_content/homepage-media";
import "./pathways.css";

/**
 * /homepagev2 copy, 10 September 2026, user direction.
 *
 * A duplicate of the live homepage component of the same name, so the two
 * can be worked on apart. What is COPIED is the markup; what is SHARED is
 * everything the markup reaches for -- the content modules, the stylesheets,
 * the motion library and the effects registry. A change to a hook name, an
 * effect, a CSS class or a content string still lands on both pages, and an
 * edit here that renames a data attribute breaks the live page silently
 * unless the effect is forked too. Diverge deliberately, and say so here
 * when you do.
 */

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
 * a panel gets exactly one screen: the card images are `svh` heights, not an
 * aspect ratio, so a short viewport shortens the photographs instead of
 * pushing the CTAs off the bottom.
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
      className="v2-home-pathways-panel absolute inset-0 z-[3] flex flex-col justify-center text-canvas"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 lg:px-16">
        <h2 data-pathways-heading className="headline mx-auto max-w-[24ch] text-center text-h1 leading-[1.1] tracking-normal">
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
      <div className="v2-home-pathways-mask mt-8 overflow-hidden pl-5 lg:mt-14 lg:pl-16">
        {/* The track carries its own trailing margin as padding, so the row
            comes to rest with the last card clear of the right edge rather
            than run into it. It is part of the measured width, which is why
            the travel stops there without a second number to keep in sync. */}
        <div data-pathways-track className="flex gap-4 pr-5 lg:gap-8 lg:pr-16">
          {wayForward.paths.map((path, index) => {
            const media = homePathwayMedia[index];
            return (
              <div key={path.href} data-pathway-card className="shrink-0 basis-[calc(100vw-3.5rem)] sm:basis-[46vw] lg:basis-[28vw]">
                <Link
                  href={path.href}
                  className="flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-canvas"
                >
                  {/* Frame grade: the photograph is held, and the mark sits
                      over its top corner exactly as the Invitation's does. */}
                  <div className="relative h-[22svh] overflow-hidden rounded-[20px] lg:h-[28svh]">
                    <Image src={media.src} alt="" fill sizes="(min-width: 1024px) 28vw, 90vw"
                      className="object-cover" style={{ objectPosition: media.position }} />
                    <Image src={media.icon} alt="" width={45} height={42}
                      className="absolute left-6 top-6 h-[42px] w-[45px] object-contain" />
                  </div>
                  <p className="eyebrow mt-5 text-sm leading-[1.4] text-ochre">{path.eyebrow}</p>
                  <h3 className="headline mt-2 text-h3 leading-none tracking-normal">{path.title}</h3>
                  <p className="mt-3 text-base leading-[1.5]">{path.description}</p>
                  <span className="mt-auto flex items-center gap-2 pt-5">
                    <span className="eyebrow text-sm leading-[1.4] text-ochre">{path.cta}</span>
                    <Image src="/media/home/derivatives/invitation-chevron.svg" alt="" width={20} height={20} className="shrink-0" />
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
