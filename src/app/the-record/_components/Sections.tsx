import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  knowledgeGaps,
  onRequest,
  recordGrows,
  recordHero,
  recordItems,
  recordPortalCopy,
} from "@/content/the-record";
import {
  recordCardMedia,
  recordGrowsSlot,
  recordPortalMedia,
} from "@/content/record-media";
import { RecordPortalMotion } from "./PortalMotion";
import { RecordPatternMotion } from "./PatternMotion";
import { MediaOrField } from "@/components/ui/MediaOrField";
import { RecordSignup } from "./Signup";
import { DocumentsCarousel } from "./DocumentsCarousel";
import { BoomerangCTA } from "./BoomerangCTA";
import {
  BlobButton,
  RingArtwork,
  SeamGlyph,
  WaveDivider,
} from "@/components/ui/Furniture";
import type { SeamGlyphMotif } from "@/components/ui/Furniture";

/**
 * /the-record — "The Record", at hi-fi weight (Figma 2463:8492, 04 · The
 * Record — HI-FI · Desktop).
 *
 * Seven frames, and the seventh is the site footer, which is already built to
 * Marc's styling and is not rebuilt here — the page just declares the ground
 * it hands over on. The other six are:
 *
 *   01  Intro — full bleed, open Country, the wave into the grid
 *   02  The grid — sticky filter rail + static cards   (RecordGrid, client)
 *   03  What we do not know — four visible gaps, then the route out
 *   04  Documents and reports — the draft's own list, grouped by state
 *   05  Items marked "on request" — the dark run begins, nothing performs
 *   06  The record grows — the work, the ask, and the shape of what is missing
 *
 * The route is `/the-record` and the nav says The Record — renamed from
 * `/resources` on 2026-09-04 at August's direction, which amends D1's "one
 * page, labelled Resources". See docs/decisions-and-risks.md; the amendment is
 * recorded there and still wants Marc and Ivy's confirmation.
 *
 * F7 amendment, user direction 2026-09-08: the intro uses a Three.js
 * handprintPortal. The catalogue and later sections retain their static cut.
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
/**
 * ⚠ COLUMN. Every section body on this page sits at x=100 in the frame —
 * §03's eyebrow, §04's, §06's all measure there, and the hero already builds
 * it that way with a bare `lg:px-25`. These sections had `mx-auto max-w-7xl`
 * as well, which centres a 1280 box in 1440 and THEN insets it 100: content
 * landed at x=180 and every column was 160 narrower than drawn. That is what
 * wrapped §04's one-line descriptions onto two lines and ran the section
 * 325px long. Removed on 2026-09-04; the padding alone is the column.
 */
export function presentSrc(src: string | null): string | null {
  return src && existsSync(join(process.cwd(), "public", src)) ? src : null;
}

/* -------------------------------------------------------------------------
   01 · Intro — FULL BLEED · what is known about this Country
   ------------------------------------------------------------------------- */

/**
 * 01 · Intro — the wall opens onto the record.
 * User direction 2026-09-08 replaces the Figma intro with the supplied wall
 * and zoom-through references. D5 keeps the existing words; the new scroll
 * and skip labels are recorded in the draft. Heading scale and brand faces
 * remain the V2 tokens. The static server render survives failed enhancement.
 */
export function RecordHeroV2() {
  const maskSrc = presentSrc(recordPortalMedia.mask);
  const stoneSrc = presentSrc(recordPortalMedia.wall.src);
  const stencilSrc = presentSrc(recordPortalMedia.stencilSheet);
  const previews = recordPortalMedia.previewSlugs.flatMap((slug, portalSlot) => {
    const item = recordItems.find((entry) => entry.slug === slug);
    return item ? [{ ...item, portalSlot }] : [];
  });

  return (
    <>
    <header data-record-portal data-nav-hero data-portal-state="loading" data-portal-progress="0" className="record-portal">
      <div data-portal-stage className="record-portal-stage">
        {/* F8, 2026-09-08: hidden image sources and sizing guides for canvas-only
            fly-through pictures. Article links remain in the static catalogue. */}
        <div data-portal-gallery className="record-portal-gallery" aria-hidden="true" inert>
          {previews.map((item) => {
            const slot = recordCardMedia[item.slug];
            return (
              <div
                data-portal-card
                data-portal-slot={item.portalSlot}
                data-portal-position={(item.portalSlot % 5) + 1}
                key={item.slug}
                className="record-portal-card"
              >
                <div
                  className="record-portal-card-media"
                  data-motion-grade="frame"
                >
                  <MediaOrField
                    src={presentSrc(slot?.src ?? null)}
                    alt={slot?.expects ?? ""}
                    sizes="(min-width: 1024px) 25vw, 57vw"
                    fieldClass="bg-roasted"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div
          data-portal-wall
          className="record-portal-wall bg-roasted"
          aria-hidden="true"
        />
        <RecordPortalMotion
          maskSrc={maskSrc}
          stoneSrc={stoneSrc}
          stencilSrc={stencilSrc}
        />
        <div
          data-portal-copy
          className="record-portal-scrim"
          aria-hidden="true"
        />
        <div data-portal-copy className="record-portal-copy">
          <p className="eyebrow text-base leading-[1.5] tracking-[0.08em] text-gold lg:text-xl">
            {recordHero.eyebrow}
          </p>
          <h1 className="headline mt-3 text-h1">
            {recordHero.title}
          </h1>
          <p className="mt-4 text-base leading-[1.5] lg:text-lg">
            {recordHero.standfirst}
          </p>
        </div>
        <div className="record-portal-controls">
          <p
            data-portal-copy
            className="record-portal-hint eyebrow text-xs leading-[1.5] tracking-[0.08em]"
          >
            {recordPortalCopy.scroll}
          </p>
          <a
            data-portal-skip
            href="#research-and-discovery"
            className="record-portal-skip eyebrow text-xs leading-[1.5] tracking-[0.06em]"
          >
            {recordPortalCopy.skip}
          </a>
        </div>
      </div>
    </header>
    </>
  );
}

/* -------------------------------------------------------------------------
   03 · What we do not know — four gaps, then the route out
   ------------------------------------------------------------------------- */

/**
 * The four questions and their details are all visible in ordinary flow.
 * User direction 2026-09-08 replaces the frame's pinned, dimmed sequence.
 */
export function KnowledgeGapsV2() {
  return (
    <section data-record-knowledge className="record-ground record-knowledge relative">
      <WaveDivider ground="var(--record-knowledge-ground)" />
      {/* The bleeding artwork is what wants `overflow-hidden`, but the wave
          hangs ABOVE this section's top edge and a clipping section erased
          it. Clip the artwork here instead, so the section stays open and
          the wave survives. `inset-0` keeps the artwork's percentage
          anchoring resolving against the same box it did before. */}
      <RecordPatternMotion>
        {/* 13% / 15% are the Figma node opacities and the scene note's own
            figures. The assets already carry the artist's 8% inside the
            `rings` group, so these are the wrapper values, not the effective
            ones. */}
        <RingArtwork
          piece="a"
          className="top-[55%] -left-42 h-[577px] w-160 opacity-[0.13]"
        />
        <RingArtwork
          piece="b"
          className="top-[28%] left-[61%] h-[910px] w-225 opacity-[0.15]"
        />
      </RecordPatternMotion>

      <div className="relative mx-auto w-full max-w-[1440px] px-6 py-24 lg:px-25">
        <p className="eyebrow text-lg text-gold sm:text-eyebrow-hero">
          {knowledgeGaps.title}
        </p>
        {/* The lede is one paragraph in the content and two lines in the
            frame: the claim at display weight, the reason beneath it. Split on
            the sentence rather than retyped. */}
        <h2 className="headline mt-3 max-w-5xl text-4xl leading-[1.16] sm:text-6xl">
          {firstSentence(knowledgeGaps.lede)}
        </h2>
        <p className="mt-8 max-w-4xl text-lg leading-relaxed text-current/78 sm:text-xl">
          {restOfSentences(knowledgeGaps.lede)}
        </p>

        {/* User reference, 2026-09-09: adjoining, staggered question panels.
            SCR-14 attaches the panels on entry, then holds them for reading. */}
        <ol className="record-question-panels mt-16 grid grid-cols-1 lg:mt-20 lg:grid-cols-2">
          {knowledgeGaps.gaps.map((gap, index) => (
            <li key={gap.question} className="record-question-panel relative flex flex-col px-7 py-10 text-canvas lg:px-12 lg:py-12">
              <span className="eyebrow mb-8 text-sm tracking-[0.1em] text-gold tabular-nums lg:mb-12">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="headline max-w-xl text-h3 leading-[1.12]">
                  {gap.question}
                </h3>
                <p className="mt-5 max-w-lg text-base leading-[1.6] text-canvas/80 lg:text-lg">
                  {gap.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* The section ends on ONE thing — "nothing else competes with it;
            the four questions have already made the case". Button / Blob,
            tone=ochre, to /partnerships#research-opportunities: the same
            component Home uses, no new effect.

            The hi-fi frame once labelled this "WHAT IS RUNNING →" and the
            draft "Research with us"; D5 gave it to the draft, and the frame
            strip now draws the draft's words too, so the two agree. */}
        <div className="mt-12 lg:mt-16">
          <BlobButton still href={knowledgeGaps.cta.href} tone="ochre">
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
  return (
    <section id="documents" className="record-document-ground relative">
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <RingArtwork piece="a" tone="roasted" className="top-[16%] left-[62%] h-[686px] w-190 opacity-[0.3]" />
      </div>
      <DocumentsCarousel />
    </section>
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
    <section data-record-on-request className="record-document-ground relative">
      {/* The bleeding artwork is what wants `overflow-hidden`, but the wave
          hangs ABOVE this section's top edge and a clipping section erased
          it. Clip the artwork here instead, so the section stays open and
          the wave survives. `inset-0` keeps the artwork's percentage
          anchoring resolving against the same box it did before. */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        {/* RING A AND THE DOTS / WAVE ARE ONE COMPOSITION, which is the thing
            the frame is emphatic about and the thing this got wrong. In
            2463:8492 they are two layers of the SAME 707 x 638 box, in the
            same place, bleeding off the left edge — the ring standing behind
            and the wave crossing its lower third. So they share a box here
            too, rather than being positioned independently and drifting apart
            the next time either one is nudged.

            ⚠ AND THE WAVE IS DRAWN NEAR ITS OWN SIZE. It was `-left-40
            w-[130%]`, which put an 823 x 93 asset on screen at 1872 x 212 —
            two and a third times natural — and a stipple scaled past about
            1.2 stops being a stipple: the dots read as blobs, the density
            reads as sparse, and the band reads as a scatter across the whole
            section instead of a line crossing one corner of it. In the frame
            the band is ~666 wide inside the 707 box, which is 0.8 of the
            asset's own width. */}
        <div className="pointer-events-none absolute top-[8%] -left-48 h-[638px] w-177">
          <RingArtwork
            piece="a"
            className="inset-0 h-full w-full opacity-[0.07]"
          />
          {/* y = 364 of 639 in the frame's own export — the band crosses the
              lower third of the ring, not the foot of the section. */}
          <div
            data-artwork="dots-wave"
            className="pointer-events-none absolute inset-x-0 top-[57%] opacity-[0.09]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
            <img
              src="/artwork/dots-wave-gold.svg"
              alt=""
              className="w-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[1440px] px-6 py-20 lg:px-25">
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
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-current/82 sm:text-xl">
            {reason}
          </p>
          {onRequest.body.slice(1).map((paragraph) => (
            <p
              key={paragraph}
              className="mt-6 max-w-3xl text-lg leading-relaxed text-current/82 sm:text-xl"
            >
              {paragraph}
            </p>
          ))}
          <p
            data-placeholder="editorial-note"
            className="mt-10 max-w-2xl text-base text-current/58"
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

export function RecordGrowsV2() {
  return (
    <section className="relative overflow-hidden bg-charcoal text-canvas">
      {/* Ring B, held at 8% — the frame parks it at x=700 / y=430, so it rides
          the seam between the photograph and the ground rather than centring. */}
      <RingArtwork
        piece="b"
        className="top-[430px] left-[48.6%] h-[1011px] w-250 opacity-[0.08]"
      />

      {/* The photograph runs behind the opening only — new material arrives
          because someone was out there — and dissolves into the ground.
          440 tall; the X5 ramp turns at 55%, the second scrim starts at 280. */}
      <div className="absolute inset-x-0 top-0 h-110">
        <MediaOrField
          src={presentSrc(recordGrowsSlot.src)}
          alt={recordGrowsSlot.expects}
          sizes="100vw"
          fieldClass="bg-charcoal"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-charcoal/94 via-charcoal/80 via-55% to-charcoal/62"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-charcoal"
        />
      </div>
      {/* motif=circle at x=1283 / y=90 — 113px from the right edge of 1440. */}
      <SeamGlyph
        motif="a"
        className="top-[90px] right-[7.85%] hidden w-11 lg:block"
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-6 py-24 lg:px-25 lg:pt-24 lg:pb-[160px]">
        <p className="eyebrow text-lg leading-[1.5] tracking-[0.1em] text-gold sm:text-2xl">
          {recordGrows.eyebrow}
        </p>
        <h2 className="headline mt-2.5 max-w-[56.25rem] text-4xl leading-[1.2] sm:text-[3.5rem]">
          {recordGrows.title}
        </h2>
        <p className="mt-[35px] max-w-[53.75rem] text-lg text-canvas/88 sm:text-xl sm:leading-[1.875rem]">
          {recordGrows.body}
        </p>

        {/* 192px of ground between the lede and the ask — the frame lets the
            photograph finish before the page starts asking for anything. */}
        <RecordSignup />

        <div aria-hidden className="mt-12 h-px w-full bg-canvas/18" />

        {/* D25's destination. The id is load-bearing — the record's empty
            state links here rather than to a contact page with no form. */}
        <div id="do-you-hold-something" className="scroll-mt-28">
          <h3 className="headline mt-[49px] text-3xl leading-10 sm:text-[2rem]">
            {recordGrows.contribute.title}
          </h3>
          <p className="mt-[14px] max-w-[53.75rem] text-base leading-6 text-canvas/68">
            {recordGrows.contribute.body}
          </p>

          {/* plate · what people hold — 298x198 on a 16px gutter, the ground
              alternating evergreen / roasted, one artist glyph each. The
              fourth is the empty 44px slot: no new iconography is authored
              here, so it stays a dashed hold until the motif inventory lands
              (Glyph / Truth, 2051:2626). */}
          {/* User direction 2026-09-09: the boomerang sits between four cards;
              mobile reading order puts the interactive object first. */}
          <div className="relative mt-10 grid gap-8 lg:block">
          <div className="min-w-0 lg:absolute lg:inset-y-0 lg:left-1/2 lg:z-10 lg:flex lg:w-[38.5%] lg:-translate-x-1/2 lg:items-center [&>div]:w-full">
            <BoomerangCTA href={recordGrows.contribute.cta.href} label={recordGrows.contribute.cta.label} />
          </div>
          <ul className="record-contribution-cards grid gap-4 lg:grid-cols-[1fr_1.25fr_1fr] lg:gap-6">
            {recordGrows.contribute.items.map((item, i) => (
              <li
                key={item}
                /* The copy was absolutely positioned at a fixed 15.125rem —
                   exactly the 242px it gets inside the frame's 298px plate.
                   At 1024 the four-up row gives each plate 194px and that
                   fixed width overflowed it, so `overflow-hidden` cut the
                   item off mid-word; on a phone it could not use the width it
                   had. It is a flow child now, with `pt-23` holding the
                   frame's own 92px offset and `min-h` letting a plate grow
                   rather than swallow its last line. At 1440 the geometry is
                   identical to what it was. */
                className={`relative min-h-[198px] overflow-hidden rounded-3xl px-7 pt-23 pb-7 ${
                  i % 2 === 0 ? "bg-evergreen" : "bg-roasted"
                }`}
              >
                {HOLD_MOTIFS[i] ? (
                  <SeamGlyph
                    motif={HOLD_MOTIFS[i]!}
                    className="top-7 left-7 w-9"
                  />
                ) : (
                  <span
                    aria-hidden
                    data-placeholder="artwork-slot"
                    className="absolute top-7 left-7 size-9 border border-dashed border-burnt/50"
                  />
                )}
                <p className="text-[1.0625rem] leading-[1.625rem] font-medium">
                  {item}
                </p>
              </li>
            ))}
          </ul>

          </div>
        </div>
      </div>

      {/* Wave / Divider · OFF-WHITE (2537:17343) — hands the dark run off into
          the footer. The frame starts it at y=1427, so the ground above it is
          padded out to meet the crest; the canvas it introduces is then the
          footer's own band (<FooterGround color=canvas/> on this page), which
          the footer's burnt crest rides in turn. */}
      <div className="absolute inset-x-0 bottom-0">
        <WaveDivider ground="var(--color-canvas)" />
      </div>
    </section>
  );
}

/**
 * The three EXISTING artist motifs, in the frame's order, then the empty slot
 * — `undefined` is the slot, deliberately, rather than a fourth glyph invented
 * to fill it.
 */
const HOLD_MOTIFS: readonly (SeamGlyphMotif | undefined)[] = [
  "a",
  "b",
  "c",
  undefined,
];

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
