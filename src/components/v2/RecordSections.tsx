import { existsSync } from "node:fs";
import { join } from "node:path";
import type { ReactNode } from "react";
import {
  documents,
  knowledgeGaps,
  onRequest,
  recordGrows,
  recordHero,
} from "@/content/the-record";
import { recordGrowsSlot, recordHeroSlot } from "@/content/record-media";
import { MediaOrField } from "@/components/v2/MediaOrField";
import { RecordSignup } from "@/components/v2/RecordSignup";
import { SplitReveal } from "@/components/motion/text/SplitReveal";
import { EditorialNote } from "@/components/ui/EditorialNote";
import {
  BlobButton,
  BlobHold,
  ClusterArtwork,
  DottedRule,
  RingArtwork,
  SeamGlyph,
  WaveDivider,
} from "@/components/ui/Furniture";

/**
 * /the-record — "The Record", at hi-fi weight (Figma 2463:8492, 04 · The
 * Record — HI-FI · Desktop).
 *
 * Seven frames, and the seventh is the site footer, which is already built to
 * Marc's styling and is not rebuilt here — the page just declares the ground
 * it hands over on. The other six are:
 *
 *   01  Intro — full bleed, open Country, the wave into the grid
 *   02  The grid — sticky rail + three breakouts   (RecordGrid, client)
 *   03  What we do not know — pinned, four gaps, then the route out
 *   04  Documents and reports — the draft's own list, grouped by state
 *   05  Items marked "on request" — the dark run begins, nothing performs
 *   06  The record grows — the work, the ask, and the shape of what is missing
 *
 * The route is `/the-record` and the nav says The Record — renamed from
 * `/resources` on 2026-09-04 at August's direction, which amends D1's "one
 * page, labelled Resources". See docs/decisions-and-risks.md; the amendment is
 * recorded there and still wants Marc and Ivy's confirmation.
 *
 * Copy is src/content/the-record.ts verbatim. Where the frame's label differs
 * from the draft's — the gaps CTA reads "WHAT IS RUNNING →" in Figma and
 * "Research with us" in the content — the content wins and the divergence is
 * noted at the call site. D5 makes the drafts the source of truth for words.
 */

/**
 * The photo library is gitignored (client media lives in Drive), so a slot's
 * src may be absent on this machine even when it is set. Resolve at render —
 * these are server components — so a missing file falls back to the honest
 * tonal field instead of a broken image.
 */
export function presentSrc(src: string | null): string | null {
  return src && existsSync(join(process.cwd(), "public", src)) ? src : null;
}

/* -------------------------------------------------------------------------
   01 · Intro — FULL BLEED · what is known about this Country
   ------------------------------------------------------------------------- */

/**
 * 01 · Intro — one photograph, and what the page is for.
 *
 * "The page opens the way Living Work does. A photograph takes the screen, the
 * scrim ramps under the copy, the heading settles, and a wave hands it into the
 * catalogue. Nothing is asked of the reader yet." — hence no scroll cue and no
 * call to action: the only thing below the lead is the wave.
 *
 * Laid out to the frame's own coordinates (1440x900):
 *   type column   x=100, so the copy sits against the VIEWPORT edge rather than
 *                 inside the body container — `lg:px-25` and no max-width on
 *                 the wrapper. Headline runs to 1100, the lead to 900.
 *   eyebrow       y=340, Eyebrow/Section-24 in Yellow Gold, tracked 0.08em
 *   headline      y=388, Display/96 at 1.2
 *   lead          y=644, Body/Lead-24 at 1.5
 *   block foot    716 of 900 — 20.4% up from the join, which is what puts the
 *                 lead clear of the wave crest. `items-end` + that padding
 *                 holds the relationship at any viewport height.
 *   cluster       x=1221 y=170, gold at 90%
 *   seam glyph    x=1283 y=700, motif=starburst (glyph-b, the blue one)
 *
 * ⚠ TYPE. Figma sets the headline in Baloo 2 ExtraBold; the built page uses
 * Block Berthold, which is the repo-wide `.headline` decision (fonts.css) and
 * not this section's to change. The frame will not match the screenshot on
 * letterforms, only on size, colour and position.
 */
export function RecordHeroV2() {
  return (
    <header
      data-record-hero
      className="relative flex min-h-svh items-end overflow-hidden bg-charcoal text-canvas"
    >
      <div data-record-hero-media className="absolute inset-0">
        <MediaOrField
          src={presentSrc(recordHeroSlot.src)}
          alt={recordHeroSlot.expects}
          sizes="100vw"
          priority
          fieldClass="bg-charcoal"
        />
      </div>

      {/* scrim · X5 — bottom-weighted, measured against the brightest frame.
          The motion pass ramps this up under the copy as the heading settles;
          it renders at full strength so the rest state is the finished one. */}
      <div
        data-record-hero-scrim
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(9,14,18,0) 0%, rgba(9,14,18,0.1) 18%, rgba(9,14,18,0.62) 36%, rgba(9,14,18,0.86) 62%, rgba(9,14,18,0.94) 100%)",
        }}
      />

      {/* The artwork sits ON the photograph, top corner. Static — the frames
          do not ask for artwork motion and the default is stillness. */}
      <ClusterArtwork
        tone="gold"
        className="top-[18.9%] right-[7.4%] hidden w-28 lg:block"
      />
      <SeamGlyph
        motif="b"
        className="top-[77.8%] right-[7.85%] hidden w-11 lg:block"
      />

      {/* pb is in svh, NOT %. A percentage padding — even a vertical one —
          resolves against the containing block's WIDTH, which on a 1440x900
          frame put the block 110px too high. svh matches min-h-svh above, so
          the block's foot lands on the frame's 716 at any viewport. */}
      <div className="relative w-full px-6 pt-32 pb-[20.4svh] lg:px-25">
        <p
          data-record-hero-arrive
          className="eyebrow text-xl tracking-[0.08em] text-gold sm:text-2xl"
        >
          {recordHero.eyebrow}
        </p>
        <SplitReveal
          as="h1"
          mode="lines"
          gate="entry"
          className="headline mt-3 max-w-[1100px] text-5xl leading-[1.2] sm:text-7xl lg:text-display"
        >
          {recordHero.title}
        </SplitReveal>
        <p
          data-record-hero-arrive
          className="mt-6 max-w-[900px] text-lg leading-relaxed sm:text-lead"
        >
          {recordHero.standfirst}
        </p>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------
   03 · What we do not know — ⚑ PINNED 300vh · four gaps, then the route out
   ------------------------------------------------------------------------- */

/**
 * The most useful section on the page for a researcher, and the reason the
 * record is kept at all — so the frame gives it the page's only pin. Four
 * gaps, one lit at a time as the reader travels through, snapped to thirds.
 *
 * The frame shows only the questions. Their details are real content and are
 * rendered with the question they belong to, revealed as each becomes the
 * live one: that is what the extra 300vh of pin is FOR. Without JS, or under
 * reduced motion, every gap is simply lit and the section is a plain list.
 */
export function KnowledgeGapsV2() {
  return (
    <section
      data-record-gaps
      className="relative overflow-hidden bg-midnight text-canvas"
    >
      <WaveDivider ground="var(--color-midnight)" />
      <RingArtwork piece="a" className="top-[55%] -left-42 h-[577px] w-160 opacity-[0.07]" />
      <RingArtwork piece="b" className="top-[28%] left-[61%] h-[910px] w-225 opacity-[0.07]" />

      <div data-record-gaps-stage className="relative mx-auto w-full max-w-7xl px-6 py-32 lg:px-25">
        <p data-record-arrive className="eyebrow text-lg text-gold sm:text-eyebrow-hero">
          {knowledgeGaps.title}
        </p>
        {/* The lede is one paragraph in the content and two lines in the
            frame: the claim at display weight, the reason beneath it. Split on
            the sentence rather than retyped. */}
        <SplitReveal
          as="h2"
          mode="lines"
          className="headline mt-3 max-w-5xl text-4xl leading-[1.16] sm:text-6xl"
        >
          {firstSentence(knowledgeGaps.lede)}
        </SplitReveal>
        <p
          data-record-arrive
          className="mt-8 max-w-4xl text-lg leading-relaxed text-canvas/78 sm:text-xl"
        >
          {restOfSentences(knowledgeGaps.lede)}
        </p>

        <div className="mt-14 opacity-55">
          <DottedRule />
        </div>

        <ol className="mt-14">
          {knowledgeGaps.gaps.map((gap, index) => (
            <li
              key={gap.question}
              data-record-gap
              data-state="active"
              className="relative py-8 transition-opacity duration-(--dur-medium) ease-quiet data-[state=idle]:opacity-35"
            >
              {/* step marker — scrubbed, snapped to quarters. */}
              <span
                aria-hidden
                className="absolute top-10 left-0 h-6 w-[3px] bg-gold opacity-0 transition-opacity duration-(--dur-medium) data-[state=active]:opacity-100"
                data-state="idle"
                data-record-gap-marker
              />
              <span className="absolute top-9 left-6 text-xs font-semibold tracking-[0.1em] text-gold/80 tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="pl-15">
                <h3 className="headline max-w-4xl text-3xl leading-tight sm:text-5xl">
                  {gap.question}
                </h3>
                <p
                  data-record-gap-detail
                  className="mt-4 max-w-2xl text-base leading-relaxed text-canvas/70"
                >
                  {gap.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* ⚠ The frame labels this button "WHAT IS RUNNING →". The draft calls
            it "Research with us" and D5 makes the draft the source of truth
            for copy, so the draft's words ship and the frame's do not. Same
            destination either way. */}
        <div data-record-arrive className="mt-16 pl-15">
          <BlobButton href={knowledgeGaps.cta.href} tone="ochre">
            {knowledgeGaps.cta.label}
          </BlobButton>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   04 · Documents and reports — the draft's own list, grouped by state
   ------------------------------------------------------------------------- */

export function DocumentsLedger() {
  const available = documents.filter((d) => d.state === "available");
  const inPreparation = documents.filter((d) => d.state === "in-preparation");

  return (
    <section
      id="documents"
      className="relative overflow-hidden bg-canvas text-charcoal"
    >
      <WaveDivider ground="var(--color-canvas)" />
      <RingArtwork
        piece="a"
        invert
        className="top-[16%] left-[62%] h-[686px] w-190 opacity-[0.06]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-28 lg:px-25">
        <p data-record-arrive className="eyebrow text-lg text-ochre sm:text-eyebrow-hero">
          Documents and reports
        </p>
        <p data-record-arrive className="headline mt-3 text-4xl text-charcoal">
          {documents.length} items
        </p>

        <LedgerGroup label="Available now" count={available.length}>
          {available.map((document) => (
            <LedgerRow
              key={document.title}
              title={document.title}
              summary={document.summary}
              meta={document.meta}
            >
              {/* No PDF for any of these is in the repo. The frame draws a
                  Download button; a link to nothing is worse than a marked
                  hold, and dropping the affordance hides the gap (R14). */}
              <BlobHold>File not supplied</BlobHold>
            </LedgerRow>
          ))}
        </LedgerGroup>

        <LedgerGroup label="In preparation" count={inPreparation.length} muted>
          {inPreparation.map((document) => (
            <LedgerRow
              key={document.title}
              title={document.title}
              summary={document.summary}
              meta={document.meta}
            >
              <p className="eyebrow text-xs text-charcoal/42">In preparation</p>
            </LedgerRow>
          ))}
        </LedgerGroup>

        <div className="mt-16 max-w-2xl">
          <EditorialNote label="No assets — download links cannot be built yet">
            <p>
              Four documents are marked published in the draft — the Ten Year
              Strategic Plan, Governance, the research bibliography and the
              financial statements. None of the files are in the repo, so each
              renders the frame&rsquo;s button shape as a hold rather than as a
              download.
            </p>
          </EditorialNote>
        </div>
      </div>
    </section>
  );
}

function LedgerGroup({
  label,
  count,
  muted = false,
  children,
}: {
  label: string;
  count: number;
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="mt-16">
      <p
        className={`eyebrow text-xs ${muted ? "text-charcoal/50" : "text-ochre"}`}
      >
        {label}&ensp;&middot;&ensp;{count}
      </p>
      <div className="mt-3 opacity-50">
        <DottedRule tone="plain" />
      </div>
      <ul>{children}</ul>
    </div>
  );
}

function LedgerRow({
  title,
  summary,
  meta,
  children,
}: {
  title: string;
  summary: string;
  meta: string;
  children: ReactNode;
}) {
  return (
    <li
      data-record-arrive
      className="grid gap-6 border-b border-charcoal/12 py-8 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-16"
    >
      <div className="max-w-3xl">
        <h3 className="headline text-2xl text-charcoal sm:text-[1.75rem]">
          {title}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-charcoal/68">
          {summary}
        </p>
      </div>
      <div className="lg:w-[17.25rem]">
        <p className="eyebrow text-[0.6875rem] text-charcoal/45">{meta}</p>
        <div className="mt-3">{children}</div>
      </div>
    </li>
  );
}

/* -------------------------------------------------------------------------
   05 · Items marked "on request" — held, nothing performs · dark run begins
   ------------------------------------------------------------------------- */

/**
 * The page stops offering and starts asking. The frame gives this section a
 * single gold rule and nothing else moving — "held, nothing performs" is the
 * frame's own note, so there is no artwork drift and no reveal on the body.
 */
export function OnRequestHold() {
  /* The frame breaks the draft's first paragraph at its em dash: the claim as
     the headline, the reason as the first body line. Split, not retyped. */
  const [claim, reason] = splitAtDash(onRequest.body[0]);

  return (
    <section className="relative overflow-hidden bg-charcoal text-canvas">
      <WaveDivider ground="var(--color-charcoal)" />
      <RingArtwork piece="a" className="top-[8%] -left-48 h-[638px] w-177 opacity-[0.07]" />
      {/* Dots / Wave — the flowing band, very low, behind the type. */}
      <div
        aria-hidden
        data-artwork="dots-wave"
        className="pointer-events-none absolute -left-40 bottom-[6%] w-[130%] opacity-[0.09]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
        <img src="/artwork/dots-wave-gold.svg" alt="" className="w-full" loading="lazy" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 py-28 lg:px-25">
        <div className="relative pl-8 lg:pl-15">
          {/* rule — the page stops offering and starts asking. */}
          <span
            aria-hidden
            className="absolute top-1 left-0 h-[calc(100%-2rem)] w-[3px] bg-gold"
          />
          <p className="eyebrow text-lg text-gold sm:text-eyebrow-hero">
            {onRequest.title}
          </p>
          <h2 className="headline mt-3 max-w-4xl text-4xl leading-[1.2] sm:text-6xl">
            {claim}
          </h2>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-canvas/82 sm:text-xl">
            {reason}
          </p>
          {onRequest.body.slice(1).map((paragraph) => (
            <p
              key={paragraph}
              className="mt-6 max-w-3xl text-lg leading-relaxed text-canvas/82 sm:text-xl"
            >
              {paragraph}
            </p>
          ))}
          <p
            data-placeholder="editorial-note"
            className="mt-10 max-w-2xl text-base text-canvas/58"
          >
            [ {onRequest.pending} ]
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   06 · The record grows — the work, the ask, and the shape of what is missing
   ------------------------------------------------------------------------- */

/** The four plates alternate grounds across the row, as the frame does. */
const PLATE_GROUND = ["bg-evergreen", "bg-roasted"] as const;
const PLATE_GLYPH = ["a", "b", "c", "a"] as const;

export function RecordGrowsV2() {
  return (
    <section className="relative overflow-hidden bg-charcoal text-canvas">
      <RingArtwork piece="b" className="top-[28%] left-[49%] h-[1011px] w-250 opacity-[0.06]" />

      {/* The photograph runs behind the opening only — new material arrives
          because someone was out there — and dissolves into the ground. */}
      <div className="absolute inset-x-0 top-0 h-110">
        <MediaOrField
          src={presentSrc(recordGrowsSlot.src)}
          alt={recordGrowsSlot.expects}
          sizes="100vw"
          fieldClass="bg-charcoal"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-charcoal/94 via-charcoal/80 to-charcoal/62"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-charcoal"
        />
      </div>
      <SeamGlyph motif="c" className="top-24 right-[11%] hidden w-11 lg:block" />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-28 lg:px-25">
        <p data-record-arrive className="eyebrow text-lg text-gold sm:text-eyebrow-hero">
          {recordGrows.eyebrow}
        </p>
        <SplitReveal
          as="h2"
          mode="lines"
          className="headline mt-3 max-w-4xl text-4xl leading-[1.2] sm:text-6xl"
        >
          {recordGrows.title}
        </SplitReveal>
        <p
          data-record-arrive
          className="mt-6 max-w-4xl text-lg leading-relaxed text-canvas/88 sm:text-xl"
        >
          {recordGrows.body}
        </p>

        <div className="mt-24">
          <RecordSignup />
        </div>

        <hr className="mt-20 border-canvas/18" />

        {/* D25's destination. The id is load-bearing — the record's empty
            state links here rather than to a contact page with no form. */}
        <div id="do-you-hold-something" className="scroll-mt-28 pt-14">
          <h3 data-record-arrive className="headline text-3xl sm:text-4xl">
            {recordGrows.contribute.title}
          </h3>
          <p
            data-record-arrive
            className="mt-5 max-w-4xl text-base leading-relaxed text-canvas/68"
          >
            {recordGrows.contribute.body}
          </p>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recordGrows.contribute.items.map((item, index) => (
              <li
                key={item}
                data-record-arrive
                className={`relative min-h-50 overflow-hidden rounded-3xl p-7 ${PLATE_GROUND[index % PLATE_GROUND.length]}`}
              >
                <SeamGlyph motif={PLATE_GLYPH[index]} className="top-7 left-7 w-9" />
                <p className="mt-16 text-[1.0625rem] leading-relaxed text-canvas">
                  {item}
                </p>
              </li>
            ))}
          </ul>

          <div data-record-arrive className="mt-14">
            <BlobButton href={recordGrows.contribute.cta.href} tone="ochre">
              {recordGrows.contribute.cta.label}
            </BlobButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   Copy helpers — the frames re-break the draft's paragraphs; these derive the
   breaks rather than duplicating the words.
   ------------------------------------------------------------------------- */

function firstSentence(text: string): string {
  const match = text.match(/^[^.]+\./);
  return match ? match[0] : text;
}

function restOfSentences(text: string): string {
  return text.slice(firstSentence(text).length).trim();
}

/** "Claim — reason" → ["Claim.", "Reason"], with the reason recapitalised. */
function splitAtDash(text: string): [string, string] {
  const index = text.indexOf(" — ");
  if (index < 0) return [text, ""];
  const claim = `${text.slice(0, index)}.`;
  const reason = text.slice(index + 3);
  return [claim, reason.charAt(0).toUpperCase() + reason.slice(1)];
}
