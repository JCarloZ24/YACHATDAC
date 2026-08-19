import { Eyebrow } from "@/components/ui/Eyebrow";
import { PathCard } from "@/components/ui/PathCard";
import { Reveal } from "@/components/ui/Reveal";
import { invitation } from "@/content/homepage";

/**
 * Beat 6 — The Invitation.
 *
 * The first navigation on the page. Three cards, one per pillar, and nothing
 * else: no secondary links, no "learn more" chrome. The visitor has just been
 * through five beats of story; this is the moment they choose a direction.
 */
export function Invitation() {
  return (
    <section id="invitation" className="bg-roasted">
      <div className="mx-auto max-w-7xl px-6 py-28 lg:px-16">
        <Reveal>
          <Eyebrow className="text-ochre">{invitation.eyebrow}</Eyebrow>
        </Reveal>

        <Reveal index={1}>
          <h2 className="headline mt-6 max-w-3xl text-4xl text-canvas sm:text-5xl">
            {invitation.headline}
          </h2>
        </Reveal>

        <Reveal index={2}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-canvas/75">
            {invitation.body}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {invitation.cards.map((card, index) => (
            <Reveal key={card.title} index={3 + index}>
              <PathCard {...card} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
