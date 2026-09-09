import Image from "next/image";
import Link from "next/link";
import { invitation } from "@/content/homepage";
import { homeInvitationMedia } from "@/content/homepage-media";
import "./invitation.css";

/**
 * Beat 6 — The Invitation.
 *
 * Figma 3371:41740, user direction 9 September 2026. D5 retains draft wording
 * and destinations, which differ from the prototype.
 *
 * ⚠ 9 September 2026, user direction: this is no longer a section of its own
 * below the hero. It is an overlay inside the pinned hero — a sibling of the
 * Wonder, Truth and Belonging panels — so the land it arrives over is the
 * live Three.js plate rather than a photograph handed off to a charcoal
 * gradient. The whole block travels up one viewport at the end of
 * `homeHeroDissolve`, which is what makes the pinned canvas read as though
 * the page kept scrolling. The old standalone section carried an
 * `--invitation-overlap` negative margin to fake exactly that; both it and
 * `InvitationMotion` went with the move (SCR-09 / ENT-05).
 *
 * Because it now has to fit one viewport, the frame's 394.67x400 card holds
 * on desktop only. Below `lg` the three cards become a snap scroller rather
 * than a stack — the copy is all still here, it is read across instead of
 * down. See invitation.css.
 */
export function Invitation() {
  return (
    <div
      id="invitation"
      data-home-invitation
      className="home-invitation absolute inset-0 z-[3] flex flex-col justify-center text-canvas"
    >
      {/* Viewport margins stay the frame's 1440 content box: px-6 / lg:px-20. */}
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-20">
        <header data-invitation-heading className="mx-auto max-w-[768px] text-center">
          <p className="eyebrow text-base leading-[1.5] tracking-normal lg:text-xl">{invitation.eyebrow}</p>
          <h2 className="headline mt-4 text-h1 leading-none tracking-normal">{invitation.headline}</h2>
          {invitation.body ? <p className="mt-6 text-base leading-[1.5]">{invitation.body}</p> : null}
        </header>
        {/* Column gap stays at the frame's 48px on desktop. */}
        <div className="home-invitation-cards mt-8 lg:mt-16 lg:grid lg:grid-cols-3 lg:gap-12">
          {invitation.cards.map((card, index) => {
            const media = homeInvitationMedia[index];
            return (
              <Link key={card.href} href={card.href} data-invitation-card
                className="home-invitation-card relative flex flex-col justify-between gap-8 overflow-hidden rounded-[20px] bg-charcoal p-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-canvas lg:p-10">
                <Image src={media.src} alt="" fill sizes="(min-width: 1024px) 30vw, 80vw" className="object-cover" style={{ objectPosition: media.position }} />
                <span aria-hidden="true" className="absolute inset-0 bg-black/25" />
                {/* Three children, not two (9 September 2026, user direction).
                    The mark was bundled with the words, so the whole block
                    pinned to the top and left the card's middle empty. It now
                    holds the top corner alone, and mt-auto on the words takes
                    the free space above them — auto margin beats
                    justify-between for it — so they sit low over the picture,
                    reading against the CTA. */}
                <Image src={media.icon} alt="" width={45} height={42} className="relative h-[42px] w-[45px] shrink-0 object-contain object-left" />
                <div className="relative mt-auto flex flex-col items-start gap-4">
                  <div>
                    <p className="eyebrow mb-2 text-sm leading-[1.4]">{card.eyebrow}</p>
                    <h3 className="headline text-h3 leading-none tracking-normal">{card.title}</h3>
                  </div>
                  <p className="text-base font-medium leading-[1.5]">{card.description}</p>
                </div>
                <span className="relative flex items-center gap-2">
                  <span className="eyebrow text-base leading-[1.5]">{card.cta}</span>
                  <Image src="/media/home/derivatives/invitation-chevron.svg" alt="" width={24} height={24} className="shrink-0" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
