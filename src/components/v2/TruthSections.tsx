import { existsSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import {
  loreMarker,
  publication,
  suzanne,
  truthHero,
  type TruthEntry,
  type TruthEra,
} from "@/content/truth";
import { MOTION_GRADE, type MediaSlot } from "@/content/lofi/media";
import { truthBreaks, wattanuri } from "@/content/truth";
import {
  truthBreakMedia,
  truthEntryMedia,
  truthDeedPlateSlot,
  truthHeroSlot,
  truthTodayPlateSlot,
} from "@/content/truth-media";
import { MediaOrField } from "@/components/v2/MediaOrField";
import { EditorialNote } from "@/components/ui/EditorialNote";
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

/**
 * The gitignored library means a slot's file may be absent on this machine
 * even when its src is set. Resolve at render (server component) so an absent
 * photograph falls back to the honest field instead of a broken image.
 */
function presentSrc(src: string | null): string | null {
  return src && existsSync(join(process.cwd(), "public", src)) ? src : null;
}

/**
 * The hero — the C4 morph target from /v2/home's Truth beat, now set to the
 * hi-fi frame (1440×1052 SVG spec, 2026-09-02): dusk photograph full-bleed
 * under a dark linear wash, gold TRUTH eyebrow, Display/96 headline, plain
 * lead standfirst, and the GoodDog cue — the block sits mid-frame, not on the
 * baseline. The spec's hero carries only the cue; "Research & partnerships"
 * is reachable through the Ahead era's own entries.
 */
export function TruthHeroV2() {
  return (
    <header className="relative flex min-h-svh items-center overflow-hidden">
      <SharedMorph name="v2-truth-media">
        <div className="absolute inset-0">
          <div data-v2-hero-media className="absolute inset-0">
            <MediaOrField
              src={presentSrc(truthHeroSlot.src)}
              alt="Country at dusk — bare trees against the last light over Turraburra."
              sizes="100vw"
              priority
              className="object-cover"
              fieldClass="bg-midnight"
            />
          </div>
        </div>
      </SharedMorph>
      {/* X5 — the spec's linear wash: heavier at the foot, never opaque. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-charcoal/80 via-charcoal/30 to-charcoal/10"
      />

      {/* Spec column: text block ~225px in from the frame edge, lines running
          to ~1035px — wider than the body container, so the hero opens up. */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-24 lg:px-12">
        {/* Gold here is the spec's hero accent — eyebrow and cue only. */}
        <p data-v2-arrive className="eyebrow text-gold">
          {truthHero.eyebrow}
        </p>
        <SplitReveal
          as="h1"
          mode="lines"
          gate="entry"
          className="headline mt-8 max-w-4xl text-4xl text-canvas sm:text-6xl lg:max-w-none lg:text-display"
        >
          {truthHero.title}
        </SplitReveal>
        <p className="mt-10 max-w-2xl text-xl leading-relaxed text-canvas">
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

      {/* The first era's ground rises into the hero — the spec's organic
          hand-off. Same wave as the footer divider, filled with the present
          band's evergreen so the crest and the ground below read as one. */}
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

/**
 * One entry's photo strip. Real photograph where the library has one, honest
 * tonal field where it does not (the photo-batch rule: do not fake the gap).
 *
 * Depth drift (data-v2-depth) is withheld from any strip carrying a
 * frame-graded bucket — the tile of a cultural record does not get moved to
 * decorate the scroll. The grade travels with the slot, not the call site.
 */
/** Tailwind cannot see a computed class — the tone map has to be literal. */
const FIELD_CLASS: Record<MediaSlot["tone"], string> = {
  evergreen: "bg-evergreen/50",
  midnight: "bg-midnight/50",
  roasted: "bg-roasted/50",
  oxide: "bg-oxide/50",
  burnt: "bg-burnt/50",
  eucalyptus: "bg-eucalyptus/50",
  charcoal: "bg-charcoal/50",
};

/**
 * The precinct's photo pair, per the hi-fi frame (1440×1078 SVG, 2026-09-02):
 * a large rounded photograph left, a smaller one seated lower right, the
 * boomerang glyph over the big photo's top-left and the blue spiral in the
 * small photo's corner. Artwork stays static (the GoldTrail rule) and the
 * glyphs are decorative — empty alt, hidden from readers.
 */
function FeatureMedia({ slots, caption }: { slots: MediaSlot[]; caption?: string }) {
  const [lead, side] = slots;
  return (
    <figure className="mt-10 max-w-4xl">
      <div className="grid items-end gap-6 sm:grid-cols-[3fr_2fr] sm:gap-10">
        <div className="relative aspect-3/2 overflow-hidden rounded-2xl">
          <MediaOrField
            src={presentSrc(lead.src)}
            alt={lead.expects}
            sizes="(min-width: 640px) 45vw, 100vw"
            fieldClass={FIELD_CLASS[lead.tone]}
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
          <img
            src="/artwork/glyph-c.svg"
            alt=""
            aria-hidden
            className="absolute left-5 top-5 w-11 opacity-90"
            loading="lazy"
          />
          {/* The wireframe's dot-wave trail running under the lead photo. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
          <img
            src="/artwork/dots-wave-gold.svg"
            alt=""
            aria-hidden
            className="pointer-events-none absolute -bottom-1 left-0 w-full opacity-70"
            loading="lazy"
          />
        </div>
        <div className="relative aspect-3/2 overflow-hidden rounded-2xl sm:mb-10">
          <MediaOrField
            src={presentSrc(side.src)}
            alt={side.expects}
            sizes="(min-width: 640px) 30vw, 100vw"
            fieldClass={FIELD_CLASS[side.tone]}
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
          <img
            src="/artwork/glyph-b.svg"
            alt=""
            aria-hidden
            className="absolute bottom-4 right-4 w-10"
            loading="lazy"
          />
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-3 text-xs leading-relaxed text-canvas/50">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/**
 * The Today montage (05 · TODAY montage — GROUND, 2026-09-02): four
 * photographs in the frame's staggered grid — the lead large on the left
 * with the boomerang glyph seated bottom-right, the seedling tunnel top
 * right carrying the spiral mark, the close seed-hand small under the lead,
 * the picking photograph closing lower right. Rounded like the precinct
 * pair; artwork static (the GoldTrail rule), decorative, hidden.
 *
 */
function TodayMontage({ slots }: { slots: MediaSlot[] }) {
  const [lead, tunnel, hand, picker] = slots;
  const anyFrameGraded = slots.some((slot) => MOTION_GRADE[slot.bucket] === "frame");
  return (
    <figure className="mt-10 max-w-4xl">
      <div
        {...(anyFrameGraded ? {} : { "data-v2-depth": true })}
        className="grid items-start gap-6 sm:grid-cols-[13fr_9fr]"
      >
        <div className="space-y-6">
          <div className="relative aspect-3/2 overflow-hidden rounded-2xl">
            <MediaOrField
              src={presentSrc(lead.src)}
              alt={lead.expects}
              sizes="(min-width: 640px) 50vw, 100vw"
              fieldClass={FIELD_CLASS[lead.tone]}
            />
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
            <img
              src="/artwork/glyph-c.svg"
              alt=""
              aria-hidden
              className="absolute bottom-4 right-4 w-11 opacity-90"
              loading="lazy"
            />
          </div>
          <div className="relative aspect-3/2 w-3/5 overflow-hidden rounded-2xl">
            <MediaOrField
              src={presentSrc(hand.src)}
              alt={hand.expects}
              sizes="(min-width: 640px) 25vw, 60vw"
              fieldClass={FIELD_CLASS[hand.tone]}
            />
          </div>
        </div>
        <div className="space-y-6">
          <div className="relative aspect-8/5 overflow-hidden rounded-2xl">
            <MediaOrField
              src={presentSrc(tunnel.src)}
              alt={tunnel.expects}
              sizes="(min-width: 640px) 35vw, 100vw"
              fieldClass={FIELD_CLASS[tunnel.tone]}
            />
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
            <img
              src="/artwork/glyph-spiral-blue.svg"
              alt=""
              aria-hidden
              className="absolute right-4 top-4 w-10 opacity-90"
              loading="lazy"
            />
          </div>
          <div className="relative aspect-3/2 overflow-hidden rounded-2xl">
            <MediaOrField
              src={presentSrc(picker.src)}
              alt={picker.expects}
              sizes="(min-width: 640px) 35vw, 100vw"
              fieldClass={FIELD_CLASS[picker.tone]}
            />
          </div>
        </div>
      </div>
    </figure>
  );
}

function EntryMedia({ slots, caption }: { slots: MediaSlot[]; caption?: string }) {
  const anyFrameGraded = slots.some((slot) => MOTION_GRADE[slot.bucket] === "frame");
  /* Six or more slots render as the hi-fi's square filmstrip (the 2022
     frame's Research & discovery strip), not the stacked grid. */
  const strip = slots.length >= 6;
  const cols = strip
    ? "grid-cols-3 sm:grid-cols-6"
    : slots.length >= 3
      ? "sm:grid-cols-3"
      : slots.length === 2
        ? "sm:grid-cols-2"
        : "";
  return (
    <figure className={strip ? "mt-8 max-w-4xl" : "mt-8 max-w-3xl"}>
      <div
        {...(anyFrameGraded || strip ? {} : { "data-v2-depth": true })}
        className={`grid gap-3 ${cols}`}
      >
        {slots.map((slot) => (
          <div
            key={slot.id}
            data-motion={MOTION_GRADE[slot.bucket]}
            className={`relative overflow-hidden ${
              strip
                ? "aspect-square rounded-lg"
                : slots.length === 1
                  ? "aspect-video max-w-xl"
                  : "aspect-4/3"
            }`}
          >
            <MediaOrField
              src={presentSrc(slot.src)}
              alt={slot.expects}
              sizes={strip ? "(min-width: 640px) 15vw, 33vw" : "(min-width: 640px) 33vw, 100vw"}
              fieldClass={FIELD_CLASS[slot.tone]}
            />
          </div>
        ))}
      </div>
      {caption ? (
        <figcaption className="mt-3 text-xs leading-relaxed text-canvas/50">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function EntryBlock({
  entry,
  kicker,
  titleOnPlate,
  gutterLabel,
}: {
  entry: TruthEntry;
  /**
   * The hi-fi precinct frame (1440×1078 SVG, 2026-09-02) folds the era title
   * into the entry column as an ochre eyebrow over a display-scale entry
   * title — passed down by EraSection where a frame calls for it.
   */
  kicker?: string;
  /**
   * The Today entry's title lives on its full-bleed plate (04 · ENTRY TODAY),
   * so the block below the plate opens straight on the body — repeating the
   * headline would read the same line twice in one viewport.
   */
  titleOnPlate?: boolean;
  /**
   * Overrides the gutter's gold era label (Eyebrow/Section-24 per the 06
   * frame) — the Ahead era passes its marker here so the gutter reads
   * AHEAD / WITHIN FIVE YEARS. Dated entries derive the year themselves.
   */
  gutterLabel?: string;
}) {
  const isPartner = entry.id === "partner";
  const isToday = entry.id === "today-fire";
  /* The 2022 record frame (2026-09-02) sets the pattern for ground records:
     the year alone in the left gutter at gold, the title at display scale,
     the coda as a large statement, and the record label + CTA on one row.
     A when with no date ("More of this") renders as a burnt kicker instead. */
  const year = isPartner ? undefined : entry.when?.match(/\d{4}s?/g)?.pop();
  /* The gutter block (06 frame): gold era label at Eyebrow/Section-24, the
     full when beneath as a Work Sans Link/14 sub — the sub is dropped when
     it would just repeat the label. */
  const label = gutterLabel ?? year;
  const sub =
    entry.when && entry.when !== label ? entry.when : undefined;
  const whenKicker =
    !isPartner && !label && !isToday ? entry.when : undefined;
  return (
    <article
      id={entry.id}
      data-descent-arrive
      className={`relative grid gap-6 border-t border-canvas/10 md:grid-cols-[180px_1fr] md:gap-12 ${
        isPartner ? "py-16 md:py-24" : "py-10"
      }`}
    >
      {/* The left gutter carries the era label and its sub (the 06 frame). */}
      {label ? (
        /* self-start: as a grid child this would stretch to the row height,
           and the rail centers its pointer on this box. */
        <div className="hidden self-start pt-2 md:block">
          {/* data-era-label sits on the year line itself — the rail centers
              its pointer on this element exactly. */}
          <p data-era-label className="eyebrow text-xl text-gold">
            {label}
          </p>
          {sub ? (
            <p className="mt-1 text-sm font-normal uppercase leading-relaxed text-canvas">
              {sub}
            </p>
          ) : null}
        </div>
      ) : (
        <span aria-hidden className="hidden md:block" />
      )}
      <div className="max-w-2xl">
        {isPartner ? (
          <p className="eyebrow mb-6 font-normal text-burnt">{entry.when}</p>
        ) : null}
        {kicker || whenKicker ? (
          /* Undated whens ("More of this") are Link-weight, not ExtraBold —
             only the era kicker keeps the eyebrow's full weight. */
          <p
            className={`eyebrow mb-6 text-burnt ${whenKicker && !kicker ? "font-normal" : ""}`}
          >
            {kicker ?? whenKicker}
          </p>
        ) : null}
        {label ? (
          <div className="mb-6 md:hidden">
            <p className="eyebrow text-gold">{label}</p>
            {sub ? (
              <p className="mt-1 text-xs font-normal uppercase text-canvas">
                {sub}
              </p>
            ) : null}
          </div>
        ) : null}
        {titleOnPlate ? null : (
          <h3
            className={`headline text-canvas ${
              kicker || isPartner || label || whenKicker
                ? "text-3xl sm:text-5xl"
                : "text-2xl"
            }`}
          >
            {entry.href ? (
              <Link href={entry.href} className="transition-colors hover:text-ochre">
                {entry.title}
              </Link>
            ) : (
              entry.title
            )}
          </h3>
        )}
        {kicker ? (
          /* The wireframe's dotted-trail rule under the display title — its
             own gold cut (360×24), delivered 2026-09-02. Static, decorative. */
          /* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */
          <img
            src="/artwork/dots-rule-gold.svg"
            alt=""
            aria-hidden
            className="mt-8 w-72"
            loading="lazy"
          />
        ) : null}
        {entry.body.map((paragraph) => (
          <p
            key={paragraph.slice(0, 32)}
            className={`leading-relaxed ${
              isPartner
                ? "mt-8 text-lg text-canvas sm:text-xl"
                : "mt-4 text-canvas/75"
            }`}
          >
            {paragraph}
          </p>
        ))}
        {entry.claim ? (
          <p className="headline mt-8 max-w-xl text-3xl leading-snug text-canvas">
            {entry.claim}
          </p>
        ) : null}
        {/* The coda is the record's large statement (the 05 and 2022
            frames) — it reads before the photographs. */}
        {entry.coda ? (
          <p className="mt-8 max-w-2xl text-xl leading-snug text-canvas sm:text-2xl">
            {entry.coda}
          </p>
        ) : null}
        {entry.id && truthEntryMedia[entry.id] ? (
          entry.id === "precinct" ? (
            <FeatureMedia
              slots={truthEntryMedia[entry.id]}
              caption={entry.caption}
            />
          ) : isToday ? (
            <TodayMontage slots={truthEntryMedia[entry.id]} />
          ) : (
            <EntryMedia slots={truthEntryMedia[entry.id]} caption={entry.caption} />
          )
        ) : null}
        {entry.footnotes?.map((footnote) => (
          <p key={footnote.slice(0, 32)} className="mt-4 text-xs leading-relaxed text-canvas/45">
            {footnote}
          </p>
        ))}
        {entry.source && entry.cta ? (
          /* The wireframe sets the record label and the CTA on one row. */
          <div className="mt-8 flex flex-wrap items-baseline justify-between gap-4">
            <p className="eyebrow text-[0.6rem] font-normal text-burnt">
              {entry.source}
            </p>
            <Link
              href={entry.cta.href}
              className="eyebrow text-xs text-ochre transition-transform duration-300 hover:translate-x-1"
            >
              {entry.cta.label} &rarr;
            </Link>
          </div>
        ) : (
          <>
            {entry.source ? (
              <p className="eyebrow mt-5 text-[0.6rem] font-normal text-canvas/40">
                {entry.source}
              </p>
            ) : null}
            {entry.cta ? (
              <Link
                href={entry.cta.href}
                className="eyebrow mt-6 inline-block text-xs text-ochre transition-transform duration-300 hover:translate-x-1"
              >
                {entry.cta.label} &rarr;
              </Link>
            ) : null}
          </>
        )}
      </div>
    </article>
  );
}

/**
 * An era's full-viewport ENTRY plate — beats 04 (TODAY, 1440×900) and
 * 09 (2026, 1440×1044) of the hi-fi (2026-09-02): a photograph full-bleed
 * under a bottom-weighted scrim, gold eyebrow, optional burnt kicker, and
 * the entry title at Heading/64. The image pushes in 1.06→1.00 on entry
 * ([data-v2-plate], scrubbed — same family as the hero settle). `deep`
 * deepens the scrim where the plate carries copy (the 09 spec); children
 * render below the title for plates that hold the whole entry.
 */
function EntryPlate({
  id,
  slot,
  eyebrow,
  kicker,
  title,
  deep,
  children,
}: {
  id?: string;
  slot: MediaSlot;
  eyebrow: React.ReactNode;
  kicker?: string;
  title: string;
  deep?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className="relative flex min-h-svh items-end overflow-hidden">
      <div
        data-v2-plate
        data-motion={MOTION_GRADE[slot.bucket]}
        className="absolute inset-0"
      >
        <MediaOrField
          src={presentSrc(slot.src)}
          alt={slot.expects}
          sizes="100vw"
          className="object-cover"
          fieldClass={FIELD_CLASS[slot.tone]}
        />
      </div>
      {/* The spec's scrim — bottom-weighted, never opaque at the crown. */}
      <div
        aria-hidden
        className={`absolute inset-0 bg-linear-to-b ${
          deep
            ? "from-black/0 via-black/40 to-black/85"
            : "from-black/0 via-black/35 to-black/80"
        }`}
      />
      <div
        data-descent-arrive
        className={`relative z-10 mx-auto w-full max-w-6xl px-6 lg:px-24 ${
          deep ? "pb-[24svh]" : "pb-[16svh]"
        }`}
      >
        <p className="eyebrow text-lg text-gold sm:text-2xl">{eyebrow}</p>
        {kicker ? <p className="eyebrow mt-1 text-burnt sm:text-base">{kicker}</p> : null}
        <SplitReveal
          as="h2"
          mode="lines"
          className="headline mt-6 max-w-4xl text-4xl leading-[1.2] text-canvas sm:text-6xl"
        >
          {title}
        </SplitReveal>
        {children}
      </div>
    </section>
  );
}

export function EraSection({
  era,
  prependEntries,
}: {
  era: TruthEra;
  /**
   * Records slotted in ahead of this era's own ground entries — the descent
   * is chronological, and the Today era's 2022 study reads AFTER the 2026
   * deed plate (Now → 2026 → 2022 → 2020), so the page hands those entries
   * down here rather than reordering the committed content structure.
   */
  prependEntries?: TruthEntry[];
}) {
  /**
   * The precinct wireframe (1440×1078 SVG, 2026-09-02) sets this era's
   * hierarchy differently: AHEAD in gold on the rail column, the era title
   * demoted to an ochre eyebrow inside the first entry, and the entry's own
   * title at display scale. Every other era keeps the big era headline.
   */
  const foldsTitleIntoEntry = era.id === "research";
  /**
   * The Today era opens on its ENTRY plate (04, 1440×900 spec): the era
   * marker, title and lead-entry headline all live on the plate, so the
   * ground section below starts straight on the lead entry's body.
   */
  if (era.id === "researched") {
    /* Only the lead (Now) renders here — the era's dated records (2022, and
       Research & discovery with them) follow the 2026 plate, passed to the
       Bought back section as prependEntries so the descent stays in order. */
    const [lead] = era.entries;
    return (
      <>
        <EntryPlate
          id={era.id}
          slot={truthTodayPlateSlot}
          eyebrow={
            <>
              {era.marker} &middot; {lead.when}
            </>
          }
          kicker={era.title}
          title={lead.title}
        />
        <section className="mx-auto max-w-6xl px-6 py-20 lg:px-24">
          <div>
            <EntryBlock entry={lead} titleOnPlate />
          </div>
        </section>
      </>
    );
  }

  /**
   * Bought back opens on the 09 · ENTRY 2026 plate: the deed entry lives
   * entirely ON the plate — body (with the timestamp), the coda at Lead/24,
   * and the record label + CTA on one row — so the ground section below
   * starts straight at 2020. The plate carries the deed anchor for the rail.
   */
  if (era.entries[0]?.id === "deed") {
    const [deed, ...rest] = era.entries;
    return (
      <>
        <EntryPlate
          id="deed"
          slot={truthDeedPlateSlot}
          eyebrow={<>2026 &middot; {era.title}</>}
          title={deed.title}
          deep
        >
          <p className="mt-8 max-w-3xl leading-relaxed text-canvas">
            {deed.when}. {deed.body[0]}
          </p>
          {deed.coda ? (
            <p className="mt-6 max-w-3xl text-xl font-medium leading-relaxed text-canvas sm:text-2xl">
              {deed.coda}
            </p>
          ) : null}
          {deed.source && deed.cta ? (
            <div className="mt-10 flex flex-wrap items-baseline gap-x-16 gap-y-4">
              <p className="eyebrow text-[0.6rem] font-normal text-burnt">
                {deed.source}
              </p>
              <Link
                href={deed.cta.href}
                className="eyebrow text-xs text-gold transition-transform duration-300 hover:translate-x-1"
              >
                {deed.cta.label} &rarr;
              </Link>
            </div>
          ) : null}
        </EntryPlate>
        <section className="relative overflow-hidden">
          {/* The 06 frame's PENDING-MOTIF — Artwork Ring A (Marc's Wonder
              footer spiral, 349:3461), static behind the copy. Its 0.14 ×
              0.08 opacity is baked into the delivered cut. Spec position:
              x900 y60 of the 1440 frame, 416px wide. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
          <img
            src="/artwork/ring-spiral-a.svg"
            alt=""
            aria-hidden
            className="pointer-events-none absolute right-[8.6%] top-14 w-104"
            loading="lazy"
          />
          <div className="relative mx-auto max-w-6xl px-6 py-20 lg:px-24">
            {[...(prependEntries ?? []), ...rest].map((entry) => (
              <EntryBlock key={entry.title} entry={entry} />
            ))}
          </div>
        </section>
      </>
    );
  }
  return (
    <section id={era.id} className="mx-auto max-w-6xl px-6 py-20 lg:px-24">
      {/* The era marker, the lore line, and the entry whens all live on the
          trail rail now (2026-09-02) — repeating them here doubled the
          timeline and crowded the gutter the rail moved into. */}
      {foldsTitleIntoEntry ? null : (
        <SplitReveal
          as="h2"
          mode="lines"
          className="headline mt-4 max-w-3xl text-3xl text-canvas sm:text-5xl"
        >
          {era.title}
        </SplitReveal>
      )}
      <div className="mt-12">
        {era.entries.map((entry, index) => (
          <EntryBlock
            key={entry.title}
            entry={entry}
            kicker={foldsTitleIntoEntry && index === 0 ? era.title : undefined}
            gutterLabel={
              foldsTitleIntoEntry && index === 0 ? era.marker : undefined
            }
          />
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
    <div id="the-count" className="mx-auto max-w-6xl px-6 lg:px-24">
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

/**
 * Full-bleed photographic break — the hi-fi's breathing screens between eras.
 * No caption by design; the alt text still names the subject. Country bucket
 * only (R10 — a break must never be cultural-site material).
 */
/** Marc's colour-handoff wave — fill is the ground of the section it
 *  INTRODUCES (the 08 spec). Literal map: Tailwind cannot see computed
 *  classes. */
const WAVE_FILL: Record<string, string> = {
  roasted: "fill-roasted",
  evergreen: "fill-evergreen",
  charcoal: "fill-charcoal",
  midnight: "fill-midnight",
};

export function FullBleedBreak({
  which,
  waveTo,
}: {
  which: keyof typeof truthBreaks;
  /** Renders the hand-off wave over the break's foot, filled with the
   *  incoming section's ground. */
  waveTo?: keyof typeof WAVE_FILL;
}) {
  const slot = truthBreakMedia[which];
  return (
    <section
      id={truthBreaks[which].id}
      className="relative min-h-[80svh] overflow-hidden"
    >
      <MediaOrField
        src={slot.src}
        alt={truthBreaks[which].alt}
        sizes="100vw"
        fieldClass={FIELD_CLASS[slot.tone]}
      />
      {/* The 08 spec's light scrim — nothing to read here. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-b from-charcoal/40 via-transparent to-charcoal/40"
      />
      {waveTo ? (
        <svg
          aria-hidden
          viewBox="0 0 1442 151"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-16 w-full sm:h-28"
        >
          <path
            d="M1470.04 7.9544C1427.51 -2.1372 1377.18 -2.66008 1333.96 6.57748C1270.32 20.155 1224.29 42.5343 1157.49 50.8132C1113.11 56.3209 1072.13 52.2598 1028.08 50.5343C969.069 48.2162 917.126 51.1444 860.791 61.48C807.923 71.1707 756.575 83.7895 700.999 88.7046C633.371 94.6829 564.487 84.9573 499.434 73.4888C434.382 62.0203 369.263 48.5648 300.776 46.7696C195.602 44.0157 95.7447 68.87 1.00558 93.1491L1.00123 151H1470.04V7.9544Z"
            className={WAVE_FILL[waveTo]}
          />
        </svg>
      ) : null}
    </section>
  );
}

/**
 * Leonard Mickelo's dotted trail, in the gold cut — the wayfinding thread the
 * hi-fi runs down the page between eras.
 *
 * ⚠ STATIC. Motion on artwork is permitted as of 2026-08-30 (media.ts), but
 * the artist's own sign-off is still noted outstanding there, so this stays a
 * plain <img> until it isn't. Decorative: empty alt, hidden from readers.
 */
export function GoldTrail({ variant = "wave" }: { variant?: "wave" | "trail" }) {
  return (
    <div aria-hidden className="pointer-events-none overflow-hidden py-10 opacity-70">
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork, no optimization pass wanted */}
      <img
        src={variant === "wave" ? "/artwork/dots-wave-gold.svg" : "/artwork/dots-trail-gold.svg"}
        alt=""
        className="mx-auto w-full max-w-5xl"
        loading="lazy"
      />
    </div>
  );
}

/**
 * The floor. Below the seabed, closing the descent — see the wattanuri note
 * in src/content/truth.ts. Still, like the testimony: the band that has run
 * beside the reader the whole way down does not need an entrance.
 */
export function WattanuriBand() {
  return (
    <section
      id={wattanuri.id}
      className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-6 py-24 lg:px-24"
    >
      <p className="eyebrow text-ochre/70">{wattanuri.marker}</p>
      <h2 className="headline mt-6 max-w-3xl text-3xl text-canvas sm:text-5xl">
        {wattanuri.title}
      </h2>
      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-canvas/80">
        {wattanuri.body}
      </p>
      <p className="mt-10 max-w-2xl border-l border-ochre/40 pl-5 leading-relaxed text-canvas/60">
        {wattanuri.floor}
      </p>
      <Link
        href={wattanuri.cta.href}
        className="eyebrow mt-10 inline-block text-xs text-ochre transition-transform duration-300 hover:translate-x-1"
      >
        {wattanuri.cta.label} &rarr;
      </Link>
    </section>
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
