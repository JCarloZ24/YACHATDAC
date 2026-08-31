import type { Metadata } from "next";
import { EnterNow } from "@/components/v2/EnterNow";
import { PageTransition } from "@/components/transitions/PageTransition";
import { TransitionLink } from "@/components/transitions/TransitionLink";

export const metadata: Metadata = { title: "Index" };

/**
 * /v2 — reviewer's index. Three pages now: Home and Truth from the first pass,
 * and Living Work built to its own hi-fi with the composition layer. The
 * homepage hero ships as two proposals to pick between.
 */
export default function V2IndexPage() {
  return (
    <PageTransition ground="#090E12">
      <EnterNow />
      <main className="mx-auto flex min-h-svh max-w-4xl flex-col justify-center px-6 py-32">
        <p className="eyebrow text-ochre">The immersive build — F7</p>
        <h1 className="headline mt-6 text-4xl text-canvas sm:text-6xl">
          Three pages, built loud.
        </h1>
        <p className="mt-6 max-w-xl leading-relaxed text-canvas/70">
          The current site is untouched at its own routes — this segment is the
          proposal, running beside it. Cinematic by default, paced by the Loud
          Channel rule, tone of Iningai throughout.
        </p>

        <nav className="mt-16 space-y-6">
          <TransitionLink
            href="/v2/home"
            className="group block border-t border-canvas/15 py-6"
          >
            <span className="eyebrow text-canvas/50">01 · verb: opens</span>
            <span className="headline mt-2 block text-3xl text-canvas transition-colors group-hover:text-ochre">
              Home — Proposal 1, The Recall &rarr;
            </span>
            <span className="mt-2 block text-sm text-canvas/60">
              Ivy&rsquo;s opening: blur racking into focus while the era colours
              run back to today.
            </span>
          </TransitionLink>

          <TransitionLink
            href="/v2/home?hero=orbit"
            className="group block border-t border-canvas/15 py-6"
          >
            <span className="eyebrow text-canvas/50">01b · same page</span>
            <span className="headline mt-2 block text-3xl text-canvas transition-colors group-hover:text-ochre">
              Home — Proposal 2, The Orbit &rarr;
            </span>
            <span className="mt-2 block text-sm text-canvas/60">
              The Danu-style wheel on dark ground. Artwork cards await
              Leonard&rsquo;s sign-off; photography and type stand in.
            </span>
          </TransitionLink>

          <TransitionLink
            href="/v2/truth"
            className="group block border-t border-canvas/15 py-6"
          >
            <span className="eyebrow text-canvas/50">02 · verb: descends</span>
            <span className="headline mt-2 block text-3xl text-canvas transition-colors group-hover:text-ochre">
              Truth — the descent, at full weight &rarr;
            </span>
            <span className="mt-2 block text-sm text-canvas/60">
              Era grounds dissolve as the page travels back; the count stands
              alone; the testimony is read in stillness.
            </span>
          </TransitionLink>

          {/* Promoted to the real route on 31 Aug — the first page to move. */}
          <TransitionLink
            href="/living-work"
            className="group block border-y border-canvas/15 py-6"
          >
            <span className="eyebrow text-canvas/50">
              03 · verb: accumulates · now live at /living-work
            </span>
            <span className="headline mt-2 block text-3xl text-canvas transition-colors group-hover:text-ochre">
              Living Work — the field notebook &rarr;
            </span>
            <span className="mt-2 block text-sm text-canvas/60">
              Built to the hi-fi, screen by screen. The aperture opens through
              the counter of a 0; eight days are counted at the spring; five
              vessels fill and the fifth stays honestly empty.
            </span>
          </TransitionLink>
        </nav>
      </main>
    </PageTransition>
  );
}
