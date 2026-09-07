import Link from "next/link";
import type { Beat } from "@/content/lofi/homepage";
import { heroNightSlot, heroSlot } from "@/content/lofi/media";
import { MediaOrField } from "@/components/ui/MediaOrField";
import { SplitReveal } from "@/components/motion/text/SplitReveal";
import { SharedMorph } from "@/components/transitions/SharedMorph";
import { TransitionLink } from "@/components/transitions/TransitionLink";

/**
 * /v2/home — the four narrative beats after the hero.
 *
 * Each screen declares ONE loud channel (F7's Loud Channel rule) and the
 * other two stay quiet:
 *
 *   Wonder      — MEDIA loud: M2 frame expand on the photograph
 *   Truth       — TYPE loud: the headline takes the screen, scrub-revealed;
 *                 the C4 morph tile is the door down into /v2/truth
 *   Belonging   — TRANSITION loud: the roasted ground sweeps in over the page
 *   Living Work — TYPE loud: the Y7 river of the work itself
 *
 * Media notes from content are honoured: Truth's beat is typographic by rule
 * (story-wall permission unresolved — F3), so its loud channel was never a
 * choice. The two photographs in the repo carry Wonder and the morph tile;
 * everything else waits on the media library, not on more design.
 */

export function WonderBeat({ beat }: { beat: Beat }) {
  return (
    <section className="bg-midnight py-28 text-canvas sm:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-16">
        <p data-v2-arrive className="eyebrow text-ochre">
          {beat.eyebrow}
        </p>
        <SplitReveal
          as="h2"
          mode="lines"
          className="headline mt-6 max-w-3xl text-h2"
        >
          {beat.headline}
        </SplitReveal>
        <p data-v2-arrive className="mt-8 max-w-xl leading-relaxed text-canvas/75">
          {beat.body[0]}
        </p>
      </div>

      {/* M2 — the frame opens while the image counter-scales. */}
      <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-16">
        <div
          data-v2-frame
          className="relative aspect-16/9 overflow-hidden rounded-sm"
        >
          <div data-v2-frame-media className="absolute inset-0">
            <MediaOrField
              src={heroSlot.src}
              alt="Country at first light on Turraburra."
              sizes="(min-width: 1280px) 1152px, 100vw"
            />
          </div>
        </div>
        <p data-v2-arrive className="mt-4 text-sm text-canvas/55">
          Country at first light. The escarpment holds the oldest sunrise you
          will ever stand under.
        </p>
      </div>
    </section>
  );
}

export function TruthBeat({ beat }: { beat: Beat }) {
  return (
    <section className="bg-oxide py-32 text-canvas sm:py-48">
      <div className="mx-auto max-w-7xl px-6 lg:px-16">
        <p data-v2-arrive className="eyebrow">
          {beat.eyebrow}
        </p>
        {/* TYPE loud — the claim takes the screen, revealed against scroll. */}
        <SplitReveal
          as="h2"
          mode="words"
          scrub
          className="headline mt-8 max-w-5xl text-5xl leading-[1.05] sm:text-7xl lg:text-8xl"
        >
          {beat.headline}
        </SplitReveal>
        <p data-v2-arrive className="mt-10 max-w-2xl leading-relaxed text-canvas/80">
          {beat.body[0]}
        </p>

        {/* C4 — the door down. This tile IS the /v2/truth hero, morphed. */}
        <TransitionLink
          href="/truth"
          className="group mt-14 inline-block"
          aria-label="Descend into Truth"
        >
          <SharedMorph name="v2-truth-media">
            <span className="relative block h-44 w-72 overflow-hidden rounded-sm">
              <MediaOrField
                src={heroNightSlot.src}
                alt="The same Country under stars."
                sizes="288px"
                fieldClass="bg-midnight"
              />
            </span>
          </SharedMorph>
          <span className="eyebrow mt-4 inline-block text-canvas transition-transform duration-300 group-hover:translate-x-1">
            Descend into Truth &rarr;
          </span>
        </TransitionLink>
      </div>
    </section>
  );
}

export function BelongingBeat({ beat }: { beat: Beat }) {
  return (
    <section className="relative overflow-hidden py-32 text-canvas sm:py-44">
      {/* TRANSITION loud — the ground itself arrives. */}
      <div
        aria-hidden
        data-v2-sweep
        className="absolute inset-0 bg-roasted"
      />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-16">
        <p data-v2-arrive className="eyebrow text-ochre">
          {beat.eyebrow}
        </p>
        <SplitReveal
          as="h2"
          mode="lines"
          className="headline mt-6 max-w-3xl text-h2"
        >
          {beat.headline}
        </SplitReveal>
        <p data-v2-arrive className="mt-8 max-w-xl leading-relaxed text-canvas/75">
          {beat.body[0]}
        </p>
      </div>
    </section>
  );
}

const RIVER_TERMS =
  "Fire-stick farming · Carbon farming · Spring restoration · Seed collection · Two flux towers · Right-way fire · ";

export function LivingWorkBeat({ beat }: { beat: Beat }) {
  return (
    <section className="overflow-hidden bg-evergreen py-28 text-canvas sm:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-16">
        <p data-v2-arrive className="eyebrow text-ochre">
          {beat.eyebrow}
        </p>
        <SplitReveal
          as="h2"
          mode="lines"
          className="headline mt-6 max-w-3xl text-h2"
        >
          {beat.headline}
        </SplitReveal>
        <p data-v2-arrive className="mt-8 max-w-xl leading-relaxed text-canvas/75">
          {beat.body[0]}
        </p>
      </div>

      {/* Y7 — the work itself runs past. TYPE loud; the copy above is quiet. */}
      <div data-v2-river className="mt-20 select-none" aria-hidden>
        <div data-v2-river-track className="inline-flex whitespace-nowrap will-change-transform">
          <span className="headline pr-4 text-6xl text-canvas/15 sm:text-8xl">
            {RIVER_TERMS}
          </span>
          <span className="headline pr-4 text-6xl text-canvas/15 sm:text-8xl">
            {RIVER_TERMS}
          </span>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-16">
        <Link
          href="/living-work"
          className="eyebrow inline-block text-ochre transition-transform duration-300 hover:translate-x-1"
        >
          See the work &rarr;
        </Link>
      </div>
    </section>
  );
}
