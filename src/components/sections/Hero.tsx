import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Beat } from "@/content/homepage";

/**
 * Beat 1 — Welcome to Country.
 *
 * Full-bleed, no button, scroll cue only. The first half of the homepage is
 * immersion, not navigation: the visitor gets no choice to make until beat 6.
 *
 * Motion status (Tier 1 — homepage only):
 *   X1  honest loader — not built. Progress must come from real asset decode,
 *       hard-capped at 2.5s, once per session. Never fake the number.
 *   X2  scroll cue — the label below is static. Spec is a 2.4s yoyo killed
 *       permanently on first scroll; it is the only ambient loop allowed above
 *       the fold. Build it with the rest of the Tier 1 pass.
 *   X5  legibility scrim — present below. Non-negotiable wherever copy sits on
 *       media, and it must be re-tested against the brightest frame of the
 *       real footage, not against this placeholder.
 *
 * ⚠ Media: solid placeholder, not the final treatment. The real hero is client
 * footage of Country at first light. Solid colours over gradients is a briefing
 * decision — the flat field below is a stand-in for imagery, not a design.
 */
export function Hero({ beat }: { beat: Beat }) {
  return (
    <section
      id={beat.id}
      className="relative flex min-h-svh items-end overflow-hidden bg-charcoal"
    >
      <div
        aria-hidden
        data-placeholder="hero-media"
        className="absolute inset-0 bg-charcoal"
      />

      {/* X5 — directional scrim between media and copy. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-charcoal/90 via-charcoal/40 to-charcoal/70"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-28 lg:px-16">
        <Eyebrow className="text-ochre">{beat.eyebrow}</Eyebrow>
        <h1 className="headline mt-6 max-w-4xl text-h1 text-canvas">
          {beat.headline}
        </h1>
        {beat.body.map((paragraph) => (
          <p
            key={paragraph}
            className="mt-8 max-w-xl text-base leading-relaxed text-canvas/75"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-8 flex justify-center"
        data-motion="X2"
      >
        <span className="eyebrow text-canvas/50">Scroll</span>
      </div>
    </section>
  );
}
