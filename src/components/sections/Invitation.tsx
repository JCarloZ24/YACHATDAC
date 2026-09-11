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
                className="home-invitation-card relative flex flex-col overflow-hidden rounded-[20px] bg-charcoal p-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-canvas lg:p-10">
                {/* 45vw, not 30 (11 September 2026). Same correction as the
                    pathway cards and the offer plates: `object-cover` paints
                    the box's HEIGHT times the source's aspect whenever the
                    source is the wider shape, so the measured 395x400 crop
                    below is painted 604px wide for `verandah-table-people`
                    (1.511:1) and 464 for the fire — not the 395 that 30vw was
                    sizing for. 45vw covers the widest of the three at 1440.

                    ⚠ THE GAIN HERE IS SMALL, and honestly so: unlike the other
                    two sets these are Figma fill exports capped at 1000px with
                    no master in the repo, so the source is the binding limit
                    either way. `person-beside-smoking-fire` is 802px and is
                    already at its ceiling. See homepage-media.ts for what
                    fixing them properly would take. */}
                <Image src={media.src} alt="" fill sizes="(min-width: 1024px) 45vw, 90vw" quality={85} className="object-cover" style={{ objectPosition: media.position }} />
                {/* X5 media scrim — the palette's one sanctioned gradient, and
                    it has to be a gradient here because the copy moved up.

                    All three photographs are bright at the top and dark at the
                    bottom (sandstone, a lit window, sky), which is why the copy
                    used to sit low: measured on the real 395x400 cover crops,
                    the flat black/25 this replaces left the TOP of the card at
                    2.53 : 1 on Wonder, 1.69 on Truth and 1.41 on Living Work.
                    Canvas text there would have been unreadable.

                    Stops are solved against those crops rather than picked:
                    0.84 down to 0.60 puts the worst band on the worst card at
                    4.36 : 1, so every tier clears AA — Wonder 6.11 / 4.36,
                    Truth 5.09 / 6.51, Living Work 4.66 / 12.81 (copy / CTA).
                    It is heavy, and deliberately so: the top of each frame is
                    rock, ceiling and sky, and the subjects sit low where the
                    scrim has eased off. Lighten it and the eyebrows go first. */}
                <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(9,14,18,0.84)_0%,rgba(9,14,18,0.60)_100%)]" />
                {/* Two children now, not three (10 September 2026, user
                    direction: "put the other texts above. with only cta link
                    below"). The mark, eyebrow, title and description are one
                    block at the top; the CTA is alone at the floor on mt-auto.

                    That split is the point. The eyebrow and the CTA were both
                    `.eyebrow` in canvas — same family, weight, case and colour,
                    14px against 16px, stacked four lines apart — so the card
                    had four tiers and no way to tell a label from an action.
                    They are now opposed on position (ceiling against floor),
                    size (13 against 16) and tracking, and only one of them
                    carries the chevron.

                    Both stay canvas, which was tried the other way first: gold
                    on the eyebrow measures 4.20 / 2.76 / 3.38 : 1 over these
                    three crops and canvas measures 7.19 / 4.73 / 5.79, because
                    gold is a mid-tone and a scrimmed photograph is a mid-tone
                    ground. Gold clears AA on a SOLID dark ground and does not
                    clear it over a picture — it would need the scrim near 90%.
                    So the colour axis is unavailable here; position carries the
                    distinction instead, which is the frame's own answer too. */}
                <div className="relative flex flex-col items-start">
                  <Image src={media.icon} alt="" width={45} height={42} className="h-[42px] w-[45px] shrink-0 object-contain object-left" />
                  <p className="eyebrow mt-8 leading-[1.4]">{card.eyebrow}</p>
                  <h3 className="headline mt-2 text-h3 leading-none tracking-normal">{card.title}</h3>
                  <p className="mt-4 text-base font-medium leading-[1.5] text-canvas/90">{card.description}</p>
                </div>
                <span className="relative mt-auto flex items-center gap-2 pt-8">
                  <span className="eyebrow text-base leading-[1.5] tracking-[0.2em]">{card.cta}</span>
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
