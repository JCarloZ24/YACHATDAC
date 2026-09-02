import Image from "next/image";
import { SplitReveal } from "@/components/motion/text/SplitReveal";
import { TruthHeroMotion } from "@/components/sections/TruthHeroMotion";
import { truthHero } from "@/content/truth";
import { truthHeroSlot } from "@/content/truth-media";

/**
 * The Truth hero, to the hi-fi frame (1440×1052 SVG spec, 2026-09-02) —
 * shared treatment with /v2/truth's TruthHeroV2, minus the v2 morph/split
 * machinery: dusk photograph full-bleed under a dark linear wash, gold TRUTH
 * eyebrow, Display/96 headline on two lines, plain lead standfirst, the
 * GoodDog cue in gold, and the first era's evergreen ground rising into the
 * frame as a wave.
 *
 * Deliberately NOT PageHero. That component is the compact interior band;
 * the spec makes Truth's opening a full viewport of immersion, which is a
 * different job. The spec's hero carries only the scroll cue — "Research &
 * partnerships" stays reachable through the Ahead era's own entries.
 */
export function TruthHero() {
  return (
    <header className="relative flex min-h-svh items-center overflow-hidden bg-charcoal text-canvas">
      <TruthHeroMotion />
      {/* The photograph is there before anything animates — it settles from
          ~4% over frame to rest as the reader scrolls (TruthHeroMotion). */}
      <div data-truth-hero-media className="absolute inset-0 will-change-transform">
        <Image
          src={truthHeroSlot.src!}
          alt="Country at dusk — bare trees against the last light over Turraburra."
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      {/* The spec's linear wash: heavier at the foot, never opaque. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-charcoal/80 via-charcoal/30 to-charcoal/10"
      />

      {/* Spec column: block ~225px in from the frame edge, lines to ~1035px. */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-24 lg:px-12">
        <p className="eyebrow text-gold">{truthHero.eyebrow}</p>
        {/* The headline is the only thing that moves on entry — uncovered
            line by line from behind a hidden edge, two lines a beat apart. */}
        <SplitReveal
          as="h1"
          mode="lines"
          gate="entry"
          className="headline mt-8 max-w-4xl text-4xl sm:text-6xl lg:max-w-none lg:text-display"
        >
          {truthHero.title}
        </SplitReveal>
        <p className="mt-10 max-w-2xl text-xl leading-relaxed">
          {truthHero.standfirst}
        </p>
        <a
          href={truthHero.actions[0].href}
          data-hero-cue
          className="callout scroll-cue-glow mt-14 block w-fit text-scroll text-gold"
        >
          {truthHero.actions[0].label} &darr;
        </a>
      </div>

      {/* The first era's ground rises into the hero — the footer's wave path,
          filled with the era band's evergreen so crest and ground read as one. */}
      <svg
        aria-hidden
        viewBox="0 0 1442 151"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-20 w-full sm:h-36"
      >
        <path
          d="M1470.04 7.9544C1427.51 -2.1372 1377.18 -2.66008 1333.96 6.57748C1270.32 20.155 1224.29 42.5343 1157.49 50.8132C1113.11 56.3209 1072.13 52.2598 1028.08 50.5343C969.069 48.2162 917.126 51.1444 860.791 61.48C807.923 71.1707 756.575 83.7895 700.999 88.7046C633.371 94.6829 564.487 84.9573 499.434 73.4888C434.382 62.0203 369.263 48.5648 300.776 46.7696C195.602 44.0157 95.7447 68.87 1.00558 93.1491L1.00123 151H1470.04V7.9544Z"
          className="fill-evergreen"
        />
      </svg>
    </header>
  );
}
