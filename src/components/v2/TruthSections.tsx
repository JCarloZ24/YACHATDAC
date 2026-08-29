import Link from "next/link";
import {
  loreMarker,
  publication,
  suzanne,
  truthHero,
  type TruthEntry,
  type TruthEra,
} from "@/content/truth";
import { heroNightSlot } from "@/content/lofi/media";
import { MediaOrField } from "@/components/v2/MediaOrField";
import { EditorialNote } from "@/components/ui/EditorialNote";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { PullQuote } from "@/components/ui/PullQuote";
import { SplitReveal } from "@/components/motion/text/SplitReveal";
import { SharedMorph } from "@/components/transitions/SharedMorph";

/**
 * /v2/truth — the descent, at full cinematic weight (F7).
 *
 * Structure and copy are the committed src/content/truth.ts, unchanged. The
 * grounds come from the descent module's six-band ladder: sections carry
 * data-descent-band and the module cross-fades the fixed ground beneath them,
 * so the whole page darkens as it travels back. The rail on the left is the
 * record; its fill is scroll position (machine easing — a progress indicator
 * that eases is lying).
 *
 * The 1902 band is the page's hard moment: the count stands alone at
 * viewport scale with nothing else on screen (the copy draft's own build
 * note), and Suzanne's testimony below it carries NO motion attributes —
 * stillness as the doctrine's stated exception, because these are her words
 * being read.
 *
 * Era → band mapping (content eras are finer-grained than the six grounds):
 * Ahead + Today → present · Bought back → return · 1950s → named-wrong ·
 * 1902 + 1840s → count · Older than the record → before-record ·
 * 100M years → deep-time.
 */

export type BandId =
  | "present"
  | "return"
  | "named-wrong"
  | "count"
  | "before-record"
  | "deep-time";

const RAIL_MARKS: Array<{ id: BandId; label: string }> = [
  { id: "present", label: "Today" },
  { id: "return", label: "Bought back" },
  { id: "named-wrong", label: "1950s" },
  { id: "count", label: "1902" },
  { id: "before-record", label: "Older" },
  { id: "deep-time", label: "Deep time" },
];

/** The record rail. The lore legend never breaks; the marks track the reader. */
export function TruthRailV2() {
  return (
    <div
      aria-hidden
      className="fixed left-6 top-1/2 z-20 hidden -translate-y-1/2 lg:block"
    >
      <p className="eyebrow mb-6 origin-top-left text-[0.55rem] tracking-[0.2em] text-ochre/70">
        {loreMarker}
      </p>
      <div className="relative h-[46svh] w-px bg-canvas/15">
        <div
          data-descent-rail-fill
          className="absolute inset-0 bg-ochre will-change-transform"
        />
      </div>
      <ul className="mt-6 space-y-3">
        {RAIL_MARKS.map((mark) => (
          <li
            key={mark.id}
            data-descent-mark={mark.id}
            className="eyebrow text-[0.55rem] text-canvas/30 transition-colors duration-300 data-[state=active]:text-ochre data-[state=passed]:text-canvas/60"
          >
            {mark.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The hero — the C4 morph target from /v2/home's Truth beat. */
export function TruthHeroV2() {
  return (
    <header className="relative flex min-h-svh items-end overflow-hidden">
      <SharedMorph name="v2-truth-media">
        <div className="absolute inset-0">
          <div data-v2-hero-media className="absolute inset-0">
            <MediaOrField
              src={heroNightSlot.src}
              alt="Turraburra under stars."
              sizes="100vw"
              priority
              className="object-cover opacity-60"
              fieldClass="bg-midnight"
            />
          </div>
        </div>
      </SharedMorph>
      {/* X5 — scrim under the copy, tested against the brightest frame. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-charcoal via-charcoal/40 to-transparent"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24 lg:px-24">
        <p data-v2-arrive className="eyebrow text-ochre">
          {truthHero.eyebrow}
        </p>
        <SplitReveal
          as="h1"
          mode="lines"
          gate="entry"
          className="headline mt-6 max-w-4xl text-4xl text-canvas sm:text-6xl"
        >
          {truthHero.title}
        </SplitReveal>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-canvas/80">
          {truthHero.standfirst}
        </p>
        <div className="mt-10 flex flex-wrap gap-6">
          {truthHero.actions.map((action) => (
            <a
              key={action.href}
              href={action.href}
              className="eyebrow rounded-full border border-canvas/30 px-6 py-3 text-xs text-canvas transition-colors duration-300 hover:border-ochre hover:text-ochre"
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}

function EntryBlock({ entry }: { entry: TruthEntry }) {
  return (
    <article
      id={entry.id}
      data-descent-arrive
      className="grid gap-6 border-t border-canvas/10 py-10 md:grid-cols-[180px_1fr] md:gap-12"
    >
      <p className="eyebrow pt-1 text-ochre/80">{entry.when}</p>
      <div className="max-w-2xl">
        <h3 className="headline text-2xl text-canvas">
          {entry.href ? (
            <Link href={entry.href} className="transition-colors hover:text-ochre">
              {entry.title}
            </Link>
          ) : (
            entry.title
          )}
        </h3>
        {entry.body.map((paragraph) => (
          <p key={paragraph.slice(0, 32)} className="mt-4 leading-relaxed text-canvas/75">
            {paragraph}
          </p>
        ))}
        {entry.claim ? (
          <p className="headline mt-8 max-w-xl text-3xl leading-snug text-canvas">
            {entry.claim}
          </p>
        ) : null}
        {entry.image ? (
          <div data-v2-depth className="mt-8 max-w-md">
            <ImageSlot note={entry.image} caption={entry.caption} tone="charcoal" />
          </div>
        ) : null}
        {entry.coda ? (
          <p className="mt-6 border-l border-ochre/40 pl-5 text-sm italic leading-relaxed text-canvas/60">
            {entry.coda}
          </p>
        ) : null}
        {entry.footnotes?.map((footnote) => (
          <p key={footnote.slice(0, 32)} className="mt-4 text-xs leading-relaxed text-canvas/45">
            {footnote}
          </p>
        ))}
        {entry.source ? (
          <p className="eyebrow mt-5 text-[0.6rem] text-canvas/40">{entry.source}</p>
        ) : null}
        {entry.cta ? (
          <Link
            href={entry.cta.href}
            className="eyebrow mt-6 inline-block text-xs text-ochre transition-transform duration-300 hover:translate-x-1"
          >
            {entry.cta.label} &rarr;
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export function EraSection({ era }: { era: TruthEra }) {
  return (
    <section id={era.id} className="mx-auto max-w-6xl px-6 py-20 lg:px-24">
      {era.lore ? (
        <p className="eyebrow mb-10 text-[0.6rem] text-ochre/50">{loreMarker}</p>
      ) : null}
      <p className="eyebrow text-canvas/50">{era.marker}</p>
      <SplitReveal
        as="h2"
        mode="lines"
        className="headline mt-4 max-w-3xl text-3xl text-canvas sm:text-5xl"
      >
        {era.title}
      </SplitReveal>
      <div className="mt-12">
        {era.entries.map((entry) => (
          <EntryBlock key={entry.title} entry={entry} />
        ))}
      </div>
    </section>
  );
}

/**
 * 1902 — the count, then Suzanne's words.
 *
 * The numerals take the viewport alone (the draft's build note: "nothing else
 * on screen"). Everything from the testimony down is still: no arrive, no
 * depth, no split — the stated exception.
 */
export function SuzanneBand() {
  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-24">
      <div className="flex min-h-[140svh] flex-col justify-center py-24">
        <p className="eyebrow text-oxide">{suzanne.marker}</p>
        <SplitReveal
          as="h2"
          mode="lines"
          className="headline mt-6 max-w-3xl text-4xl text-canvas sm:text-6xl"
        >
          {suzanne.title}
        </SplitReveal>
        <dl className="mt-20 space-y-16">
          {suzanne.figures.map((figure) => (
            <div key={figure.year} data-v2-count className="max-w-3xl">
              <dt className="headline text-7xl text-oxide sm:text-9xl">
                {figure.year}
              </dt>
              <dd className="mt-4 text-lg leading-relaxed text-canvas/80">
                {figure.detail}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-16 max-w-2xl text-sm leading-relaxed text-canvas/50">
          <a
            href={suzanne.citation.href}
            className="underline decoration-canvas/30 underline-offset-4 transition-colors hover:text-canvas/80"
          >
            {suzanne.citation.text}
          </a>
        </p>
      </div>

      {/* Testimony. Still, by rule — these are her words being read. */}
      <div className="max-w-3xl pb-24">
        <EditorialNote>{suzanne.draftWarning}</EditorialNote>

        <PullQuote
          tone="charcoal"
          attribution={suzanne.attribution}
          role={suzanne.role}
          className="mt-14"
        >
          {suzanne.openingQuote}
        </PullQuote>
        <p className="mt-10 leading-relaxed text-canvas/80">{suzanne.lede}</p>
        {suzanne.quotes.map((quote) => (
          <PullQuote key={quote.slice(0, 32)} tone="charcoal" className="mt-10">
            {quote}
          </PullQuote>
        ))}
        <p className="mt-10 leading-relaxed text-canvas/80">
          {suzanne.afterQuotes}
        </p>
        <p className="headline mt-14 text-4xl text-canvas sm:text-5xl">
          {suzanne.standingQuote}
        </p>
        {suzanne.closing.map((paragraph) => (
          <p key={paragraph.slice(0, 32)} className="mt-8 leading-relaxed text-canvas/80">
            {paragraph}
          </p>
        ))}
        <div className="mt-14">
          <EditorialNote label="For Suzanne to check — not for publication">
            {suzanne.checkNote}
          </EditorialNote>
        </div>
      </div>
    </div>
  );
}

export function PublicationBand() {
  return (
    <footer className="mx-auto max-w-6xl px-6 pb-32 pt-12 lg:px-24">
      <p className="eyebrow text-canvas/50">Published record</p>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-canvas/70">
        <a
          href={publication.href}
          className="underline decoration-canvas/30 underline-offset-4 transition-colors hover:text-canvas"
        >
          {publication.title}
        </a>{" "}
        — {publication.journal}.
      </p>
    </footer>
  );
}
