import Link from "next/link";
import { Band } from "@/components/layout/Band";
import { CtaLink } from "@/components/ui/CtaLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Reveal } from "@/components/ui/Reveal";
import { loreMarker, type TruthEntry, type TruthEra } from "@/content/truth";
import { toneInk } from "@/lib/tone";

/**
 * One era of the descent, and the entries inside it.
 *
 * The layout is a rail and a column: the "when" sits in the left rail, the
 * entry sits beside it. That is what makes the page legible as a chronology
 * without a timeline graphic — the dates line up down the page and the reading
 * column never moves.
 *
 * Below `lg` the rail collapses above the entry rather than beside it. A
 * two-column timeline on a phone is a column of orphaned dates.
 *
 * ⚠ No scroll-driven motion here. The prototype implies a scrubbed descent and
 * that is a Tier 1 decision belonging to the motion skill and the wireframes,
 * not something to add on the way past. Entries use the shared Reveal — the
 * same X4 entry stagger as everything else — and nothing more.
 */
export function TruthEraSection({ era }: { era: TruthEra }) {
  const ink = toneInk[era.tone];

  return (
    <Band id={era.id} tone={era.tone}>
      {era.lore ? (
        <Reveal>
          <p className={`eyebrow mb-10 ${ink.muted}`}>{loreMarker}</p>
        </Reveal>
      ) : null}

      <header className="border-t pt-8 lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
        <Reveal>
          <Eyebrow className={ink.accent}>{era.marker}</Eyebrow>
        </Reveal>
        <Reveal index={1}>
          <h2 className={`headline mt-3 text-3xl sm:text-4xl lg:mt-0 ${ink.heading}`}>
            {era.title}
          </h2>
        </Reveal>
      </header>

      <div className="mt-16 space-y-16">
        {era.entries.map((entry) => (
          <TruthEntryBlock key={entry.title} entry={entry} era={era} />
        ))}
      </div>
    </Band>
  );
}

function TruthEntryBlock({
  entry,
  era,
}: {
  entry: TruthEntry;
  era: TruthEra;
}) {
  const ink = toneInk[era.tone];

  return (
    <article
      id={entry.id}
      className={`scroll-mt-24 border-t pt-8 lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12 ${ink.border}`}
    >
      {/* The rail. Date, and where the claim comes from. */}
      <div className="lg:pt-1">
        <Reveal>
          <p className={`eyebrow ${ink.accent}`}>{entry.when}</p>
        </Reveal>
        {entry.source ? (
          <Reveal index={1}>
            <p className={`mt-3 text-xs ${ink.muted}`}>{entry.source}</p>
          </Reveal>
        ) : null}
      </div>

      <div className="mt-6 lg:mt-0">
        <Reveal>
          <h3 className={`headline text-2xl leading-snug ${ink.heading}`}>
            {entry.href ? (
              <Link
                href={entry.href}
                className="underline-offset-4 hover:underline"
              >
                {entry.title}
              </Link>
            ) : (
              entry.title
            )}
          </h3>
        </Reveal>

        <div className="mt-5 max-w-2xl space-y-5">
          {entry.body.map((paragraph, index) => (
            <Reveal key={paragraph} index={1 + index}>
              <p className={`text-base leading-relaxed ${ink.body}`}>
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>

        {entry.claim ? (
          <Reveal index={2}>
            <p
              className={`headline mt-8 max-w-2xl text-xl leading-snug ${ink.heading}`}
            >
              {entry.claim}
            </p>
          </Reveal>
        ) : null}

        {entry.image ? (
          <Reveal index={3}>
            <ImageSlot
              note={entry.image}
              caption={entry.caption}
              tone={era.tone}
              aspect="wide"
              className="mt-10 max-w-2xl"
            />
          </Reveal>
        ) : null}

        {/*
          The connective line. Every one of these explains why the thing below
          it in the page had to happen first — it is the mechanism that makes a
          reverse chronology readable, so it is set apart rather than run in.
        */}
        {entry.coda ? (
          <Reveal index={4}>
            <p
              className={`mt-8 max-w-xl border-l-2 pl-5 text-base leading-relaxed italic ${ink.border} ${ink.body}`}
            >
              {entry.coda}
            </p>
          </Reveal>
        ) : null}

        {entry.footnotes?.length ? (
          <Reveal index={5}>
            <div className="mt-8 max-w-2xl space-y-2">
              {entry.footnotes.map((note) => (
                <p key={note} className={`text-xs leading-relaxed ${ink.muted}`}>
                  {note}
                </p>
              ))}
            </div>
          </Reveal>
        ) : null}

        {entry.cta ? (
          <Reveal index={6}>
            <div className="mt-8">
              <CtaLink href={entry.cta.href} tone={era.tone}>
                {entry.cta.label}
              </CtaLink>
            </div>
          </Reveal>
        ) : null}
      </div>
    </article>
  );
}
