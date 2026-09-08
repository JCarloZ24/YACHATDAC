import Image from "next/image";
import Link from "next/link";
import { invitation } from "@/content/homepage";
import { homeInvitationMedia } from "@/content/homepage-media";
import { InvitationMotion } from "@/components/motion/InvitationMotion";
import "./invitation.css";

/**
 * Beat 6 — The Invitation.
 *
 * The first navigation on the page. Three cards, one per pillar, and nothing
 * else: no secondary links, no "learn more" chrome. The visitor has just been
 * through five beats of story; this is the moment they choose a direction.
 */
export function Invitation() {
  return (
    <section id="invitation" className="home-invitation relative isolate z-[4] text-canvas">
      <InvitationMotion />
      <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-20">
        <header data-invitation-heading className="mx-auto max-w-[768px] text-center">
          <p className="eyebrow text-base leading-[1.5] tracking-normal lg:text-xl">{invitation.eyebrow}</p>
          <h2 className="headline mt-4 text-h1 leading-none tracking-normal">{invitation.headline}</h2>
          {invitation.body ? <p className="mt-6 text-base leading-[1.5]">{invitation.body}</p> : null}
        </header>
        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-3 lg:gap-12">
          {invitation.cards.map((card, index) => {
            const media = homeInvitationMedia[index];
            return (
              <Link key={card.href} href={card.href} data-invitation-card
                className="home-invitation-card relative flex min-h-[400px] flex-col justify-between gap-8 overflow-hidden rounded-[20px] bg-charcoal p-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-canvas lg:p-10">
                <Image src={media.src} alt="" fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" style={{ objectPosition: media.position }} />
                <span aria-hidden="true" className="absolute inset-0 bg-black/25" />
                <div className="relative flex flex-col items-start gap-4">
                  <Image src={media.icon} alt="" width={45} height={42} className="h-[42px] w-[45px] object-contain object-left" />
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
    </section>
  );
}
