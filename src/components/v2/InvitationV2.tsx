import Link from "next/link";
import { invitation } from "@/content/lofi/homepage";
import { SplitReveal } from "@/components/motion/text/SplitReveal";
import { TransitionLink } from "@/components/transitions/TransitionLink";

/**
 * The Invitation — the first navigation on the page (D24's argument holds in
 * v2: beats 1–5 above offer no links except Truth's own door).
 *
 * Card grounds are the Card/Story kit set — evergreen · roasted · charcoal —
 * decorative here, era-coded only on Truth (recorded distinction). CTAs are
 * X8 magnets; the whole screen is otherwise quiet, because three cards
 * arriving IS the moment.
 */

const CARD_GROUNDS = ["bg-evergreen", "bg-roasted", "bg-charcoal"] as const;

export function InvitationV2() {
  return (
    <section className="bg-canvas py-28 text-evergreen sm:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-16">
        <p data-v2-arrive className="eyebrow text-oxide">
          {invitation.eyebrow}
        </p>
        <SplitReveal
          as="h2"
          mode="lines"
          className="headline mt-6 max-w-3xl text-h2"
        >
          {invitation.headline}
        </SplitReveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {invitation.cards.map((card, index) => {
            const toV2 = card.href === "/truth";
            const href = toV2 ? "/truth" : card.href;
            const CardLink = toV2 ? TransitionLink : Link;
            return (
              <div
                key={card.title}
                data-v2-arrive
                className={`flex min-h-96 flex-col justify-between rounded-3xl p-9 text-canvas ${CARD_GROUNDS[index % CARD_GROUNDS.length]}`}
              >
                <div>
                  <p className="eyebrow text-ochre">{card.eyebrow}</p>
                  <h3 className="headline mt-4 flex min-h-21 items-end text-3xl">
                    {card.title}
                  </h3>
                  <p className="mt-5 text-sm leading-relaxed text-canvas/70">
                    {card.description}
                  </p>
                </div>
                <CardLink
                  href={href}
                  data-v2-magnet
                  className="eyebrow mt-8 inline-flex w-fit items-center rounded-full border border-canvas/30 px-6 py-3 text-xs text-canvas transition-colors duration-300 hover:border-ochre hover:text-ochre"
                >
                  {card.cta} &rarr;
                </CardLink>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
