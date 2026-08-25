import type { Metadata } from "next";
import { HardStop } from "@/components/sections/HardStop";
import {
  Body,
  DraftNotice,
  HeldSlot,
  MediaSlot,
  Section,
} from "@/components/sections/primitives";
import { TruthRail } from "@/components/sections/TruthRail";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import {
  breaks,
  entriesAbove,
  entriesBelow,
  hardStop,
  partnerWithUs,
  tail,
  truthIntro,
  type TimelineEntry,
} from "@/content/truth";

export const metadata: Metadata = {
  title: "Truth — Research & Discovery",
  description: truthIntro.body,
};

/**
 * Truth — a descending timeline. Newest at the top, deep past at the bottom.
 *
 * ⚠⚠ Governance circle: HELD BY COMMUNITY. Cannot go to build or publish
 * without Elder Advisory Group endorsement. Suzanne's testimony is withheld —
 * see HardStop.
 *
 * MOTION — Tier 2 page carrying two Tier 1 behaviours as recorded exceptions:
 *   · the rail is C1-shaped, built as the cleared plain vertical rule;
 *   · the hard stop holds the viewport, which is pinning.
 * Both are flagged pending decision D9 (who signs off motion), which is itself
 * unresolved. The motion skill is explicit that truth-telling sections should
 * move LESS than the rest of the site, not more — so there is nothing else.
 */

/** One timeline entry. Module scope: a component built in render remounts. */
function Entry({
  entry,
  tone,
}: {
  entry: TimelineEntry;
  tone: string;
}) {
  return (
    <Section id={entry.id} tone={tone}>
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
        {/* Era marker column */}
        <div className="lg:w-56 lg:shrink-0">
          <Reveal>
            <p className="headline text-2xl leading-tight text-ochre">
              {entry.eraLabel}
            </p>
          </Reveal>
          {entry.descriptor ? (
            <Reveal index={1}>
              <p className="mt-2 text-sm text-canvas/60">{entry.descriptor}</p>
            </Reveal>
          ) : null}
          {entry.eraDetail ? (
            <Reveal index={2}>
              <p className="eyebrow mt-4 text-canvas/45">{entry.eraDetail}</p>
            </Reveal>
          ) : null}
        </div>

        <div className="flex-1">
          {entry.headline ? (
            <Reveal index={1}>
              <h2 className="headline max-w-2xl text-2xl text-canvas sm:text-3xl">
                {entry.headline}
              </h2>
            </Reveal>
          ) : null}

          <Body paragraphs={[entry.body]} startIndex={2} />

          {entry.media ? (
            <Reveal index={3}>
              <div className="mt-10 max-w-3xl">
                {entry.media.held ? (
                  <HeldSlot reason={entry.media.held} />
                ) : (
                  <MediaSlot note={entry.media.note} className="aspect-21/9" />
                )}
              </div>
            </Reveal>
          ) : null}

          {/* The consequence line — the sentence that hands this entry down to
              the next-older one. A distinct voice, not body copy. It has no
              dedicated type style yet; flagged for Marc. */}
          <Reveal index={4}>
            <p className="mt-10 max-w-2xl border-l-2 border-ochre/50 pl-5 text-base leading-relaxed text-canvas/55">
              {entry.consequence}
            </p>
          </Reveal>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            {entry.evidence ? (
              <Reveal index={5}>
                <Eyebrow className="text-canvas/45">{entry.evidence}</Eyebrow>
              </Reveal>
            ) : null}
            {entry.cta ? (
              <Reveal index={6}>
                <span className="eyebrow text-ochre">{entry.cta} →</span>
              </Reveal>
            ) : null}
          </div>
        </div>
      </div>
    </Section>
  );
}

/** Full-bleed break. No caption by design; alt text still required. */
function Break({
  label,
  note,
  hold,
  id,
}: {
  id: string;
  label: string;
  note: string;
  hold?: string;
}) {
  return (
    <section
      id={id}
      className="relative flex min-h-[80svh] items-end overflow-hidden bg-roasted"
    >
      <div aria-hidden data-placeholder="full-bleed" className="absolute inset-0" />
      <div className="relative w-full p-6 lg:p-10">
        <p className="text-[11px] text-canvas/40">
          [ FULL-BLEED BREAK — {label} · {note} ]
        </p>
        {hold ? (
          <p className="mt-2 max-w-3xl text-[11px] leading-snug text-oxide">
            ⛔ {hold}
          </p>
        ) : null}
      </div>
    </section>
  );
}

const TONES = ["bg-evergreen", "bg-midnight"];

export default function TruthPage() {
  return (
    <>
      <TruthRail hardStopId={hardStop.id} />

      {/* 00 — Intro */}
      <section className="relative flex min-h-svh items-center overflow-hidden bg-charcoal">
        <div className="relative mx-auto w-full max-w-7xl px-6 pt-32 pb-24 lg:px-16">
          <h1 className="headline max-w-4xl text-4xl text-canvas sm:text-5xl lg:text-display">
            {truthIntro.lead}
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-canvas/75">
            {truthIntro.body}
          </p>
          <a
            href={truthIntro.jumpTarget}
            className="eyebrow mt-12 inline-block border-b border-ochre pb-1 text-ochre transition-colors hover:text-canvas"
          >
            {truthIntro.jump} ↓
          </a>
          <div className="mt-12 max-w-xl">
            <DraftNotice
              circle="held by community"
              blockedOn="Elder Advisory Group endorsement, and Suzanne Thompson's approval of the 1902 / 1886 testimony"
            />
          </div>
        </div>
      </section>

      {entriesAbove.slice(0, 3).map((entry, index) => (
        <Entry key={entry.id} entry={entry} tone={TONES[index % 2]} />
      ))}

      <Break {...breaks.countryNow} />

      {entriesAbove.slice(3).map((entry, index) => (
        <Entry key={entry.id} entry={entry} tone={TONES[(index + 1) % 2]} />
      ))}

      <Break {...breaks.escarpment} />

      <HardStop />

      {entriesBelow.map((entry, index) => (
        <Entry key={entry.id} entry={entry} tone={TONES[index % 2]} />
      ))}

      {/* The structured tail. No source copy exists below the timeline. */}
      {tail.map((block) => (
        <Section key={block.id} id={block.id} tone="bg-canvas">
          <Reveal>
            <h2 className="headline max-w-3xl text-2xl text-evergreen sm:text-3xl">
              {block.heading}
            </h2>
          </Reveal>
          <Reveal index={1}>
            <p className="mt-4 max-w-2xl text-sm text-evergreen/50 italic">
              SPEC — {block.spec}
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Reveal key={i} index={2 + i}>
                <article className="flex h-full flex-col gap-3 border border-evergreen/15 p-5">
                  <p className="eyebrow text-oxide">[ {block.facet} ]</p>
                  <p className="headline text-lg text-evergreen">
                    [ item title ]
                  </p>
                  <p className="text-sm text-evergreen/60">
                    [ one-line excerpt ]
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </Section>
      ))}

      <Section id={partnerWithUs.id} tone="bg-evergreen">
        <Reveal>
          <h2 className="headline max-w-3xl text-2xl text-canvas sm:text-3xl">
            {partnerWithUs.heading}
          </h2>
        </Reveal>
        <Reveal index={1}>
          <p className="mt-4 max-w-2xl text-sm text-canvas/45 italic">
            SPEC — {partnerWithUs.spec}
          </p>
        </Reveal>
        <Reveal index={2}>
          <span className="eyebrow mt-10 inline-block border border-canvas/30 px-8 py-4 text-canvas">
            {partnerWithUs.cta} →
          </span>
        </Reveal>
      </Section>
    </>
  );
}
