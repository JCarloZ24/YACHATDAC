import { photoById } from "@/content/kit";
import { howWeWork, partners } from "@/content/about";
import { contactDetails } from "@/content/contact";
import { getInvolved } from "@/content/living-work";
import { documents, knowledgeGaps, onRequest } from "@/content/the-record";
import { CardRail } from "@/components/ui/CardRail";
import { EditorialNote } from "@/components/ui/EditorialNote";
import { MediaOrField } from "@/components/ui/MediaOrField";
import {
  BlobButton,
  RingArtwork,
  SeamGlyph,
  WaveDivider,
} from "@/components/ui/Furniture";
import type { SeamGlyphMotif } from "@/components/ui/Furniture";

/**
 * /partnerships — "Partnerships", at hi-fi weight.
 * Figma 2944:25988 (07 · Partnerships — HI-FI · Desktop · the page hosts),
 * 1440 x 10,710px = 1,190vh across ten frames. The verb is HOSTS.
 *
 *   01  Hero — the aerial, the wave, then the copy on evergreen
 *   02  THE OBLIGATION — the page's thesis, alone on a screen
 *   03  Open research — the three disciplines
 *   04  FOUR OPEN QUESTIONS — the inversion: the gaps as an offer
 *   04b BREATH — one photograph, no words
 *   05  Who we already work with — nine names, three groups
 *   06  Ways in — four cards, the section the site never had
 *   07  How work is agreed — and what is still unwritten
 *   08  The ending — one action
 *   09  Footer — already built to Marc's styling; the page declares its ground
 *
 * ⚠ §01 MOVES; §02 DOWN ARE STATIC BY DECISION, like /our-people and /about.
 * The hero carries an arrival overture and the only `data-pt-*` hooks in this
 * file (user direction, 9 September 2026) — its score, and the reason the
 * photograph holds still under it, are at src/lib/motion/partnerships.ts.
 * Every other section has no motion module, no scroll animation, no hover and
 * no data-* motion hooks, and the whole page still renders the same with
 * JavaScript off: the overture only ever animates *to* the server markup.
 *
 * ⚠⚠ THIS PAGE HAS NO DRAFT, and that is its defining constraint. /about and
 * /our-people were built from client drafts; this route exists because four
 * live links already pointed at it (D22), and every word here is therefore
 * BORROWED from a page that does have a draft. Nothing is written for it. The
 * source of each block is named at its section, and if you add copy here it
 * must come from somewhere with a provenance, not from this file.
 *
 * WHY THE PAGE EXISTS AT ALL — it is a HUB. The audit that shaped it found
 * /about#partners carrying more partnership content than /partnerships did:
 * the commercial offer was on Living Work, the research protocol on The
 * Record, the roster and the obligation sentence on About, and the guest
 * principle was hand-copied three times byte-identical. The spokes keep their
 * excerpt and their link; this is the only place the whole set sits together.
 *
 * ⚠ §04 IS AN INVERSION, NOT A REPEAT. The Record §03 states the same four
 * questions as ABSENCE — typographic, no answers under them. Here they are an
 * OFFER: each question discloses what is already measuring it, so a researcher
 * sees where they would be joining rather than starting. Same imported object,
 * opposite argument. IF THOSE TWO SECTIONS EVER READ THE SAME, THIS PAGE HAS
 * NO REASON TO EXIST.
 *
 * ⚠ NO CONTACT BLOCK. §08 is one action and one address. About and Our People
 * carry the six-field block because both their drafts do, word for word (D5);
 * this page never had a draft to carry it, and an assembled contact block was
 * removed on 2 September. Partnerships persuades, Connect transacts.
 *
 * WHAT IS HELD: R12 names, never logos · R9/R15 no form and no live contact
 * field · R22 the obligation is framed as Ngapartji-Ngapartji, Western Desert
 * language and not Iningai · R24 §03's frame shows an identifiable face and
 * consent to identify was never sought · the research protocol is in
 * preparation and its container never fills · gap 1 has no cleared photograph
 * and stays typographic.
 */

/**
 * THE MOBILE RAMP, read off the one mobile design that exists.
 *
 * Figma `01 · Wonder — HI-FI · Mobilep` (node 2576:21896, 375 wide) carries
 * the file's `Typography/Mobile/*` styles, and its numbers are:
 *
 *   H1 56 · H2 36 · H3 32 · H4 (lead) 24 · H5 (eyebrow) 16 · H6 14
 *
 * against the desktop 96 / 56 / 40 / 36 / 20 / 14. These bases follow it for
 * the roles it settles cleanly — the page title at 56, section headings at 36,
 * the section eyebrow at 16.
 *
 * ⚠ WHAT IS NOT TAKEN FROM IT. The frame's mobile gutter is 20px; the code
 * keeps `px-6` (24), because the header, the footer and every other page in
 * this repo are built on 24 and a 4px disagreement inside the chrome is worse
 * than a 4px disagreement with one frame. Card headings stay at 24 rather than
 * the frame's 32: Wonder's card is 335 wide with 20px padding, ours is a rail
 * card with about 244px across the copy, and 32 wraps a short title to three
 * lines there. Body copy stays at `text-lg`, which is the ramp the rest of the
 * codebase already uses (`the-record/…:168`).
 */

/**
 * The column — padding alone, no max-width. See the-record Sections.tsx:59.
 *
 * ⚠ `sm:px-10` IS A DELIBERATE ADDITION, and the one place this page departs
 * from the house convention. Every other page steps `px-6` straight to its
 * `lg:` value with nothing in between, which leaves a 768px viewport holding
 * `sm:text-2xl` body copy across a 720px measure inside 24px gutters — the
 * worst-served width in the codebase. Raise it with Juan Carlos before
 * spreading it; his pages have the same gap and are not touched here.
 *
 * ⚠ `max-w-[1440px]` CAPS THE COLUMN BOX, NOT THE CONTENT BOX, and it is not
 * a reversal of the note above. `mx-auto max-w-7xl` was rejected because 1280
 * centred in 1440 lands the content at x=180 when the frame draws it at x=100.
 * This caps the box the gutters live in, so at 1440 the content still lands at
 * exactly x=100 — the number that objection is defending — and above 1440 it
 * stops growing instead of stretching to 1400 at 1600 and 1720 at 1920.
 */
const COLUMN = "mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-25";

/**
 * THE SCREEN BUDGET — restored 10 September 2026, measured against the 1440
 * frame. The vh figures are the ones already written at the head of each
 * section below, and they were documentation only: nothing in the markup
 * enforced them. Built at 1440 x 900 the page came out 8,752px against the
 * frame's 10,710, and the per-section shortfalls summed to that 1,958px gap
 * almost exactly — every section was reaching its content height and then
 * stopping, because `pt-24 pb-24` is all that ever set a section's height.
 *
 * ⚠ MIN-HEIGHT AND NOT MORE PADDING, deliberately. Padding tuned to close the
 * gap at 900px would have wanted 27vh on §08 and 13vh on §05 — numbers with no
 * source, matching the frame on total length while still disagreeing with it
 * about where anything sits. A min-height reproduces what the budget actually
 * describes, which is the share of the scroll each section owns, and it holds
 * at viewport heights the frame never drew. It also keeps the house rule that
 * spans are specified in vh rather than px.
 *
 * `justify-center` sets the column in the middle of the budget rather than
 * letting the surplus fall out of the bottom. Below `lg` none of this applies:
 * the one mobile frame in the file is a different ramp and does not carry
 * these budgets.
 *
 * ⚠ LITERAL STRINGS, NOT A TEMPLATE. Tailwind scans source text, so a
 * `min-h-[${n}vh]` helper would compile to nothing. Same reason the tone maps
 * elsewhere in this repo are literal `Record`s.
 *
 * §01 (120vh) and §04b (55vh) are absent because both already measure their
 * budget — the hero from its own overture, the breath band from `h-[55svh]`.
 * The footer is short of its ~165vh too and is NOT touched here: it is shared
 * furniture at Marc's styling and every route would move with it.
 */
const SCREEN = {
  obligation: "lg:flex lg:min-h-[100vh] lg:flex-col lg:justify-center",
  openResearch: "lg:flex lg:min-h-[120vh] lg:flex-col lg:justify-center",
  openQuestions: "lg:flex lg:min-h-[190vh] lg:flex-col lg:justify-center",
  partners: "lg:flex lg:min-h-[130vh] lg:flex-col lg:justify-center",
  waysIn: "lg:flex lg:min-h-[140vh] lg:flex-col lg:justify-center",
  /* ⚠ NO CENTRING ON THE HERO. Every other budget here centres its column in
     the surplus; this one stacks a full-screen photograph on a copy block
     that measures the remaining 450 exactly, so there is no surplus to
     centre and `justify-center` would only fight the media. A floor, not a
     frame. */
  hero: "lg:min-h-[150vh]",
  protocol: "lg:flex lg:min-h-[100vh] lg:flex-col lg:justify-center",
  ending: "lg:flex lg:min-h-[70vh] lg:flex-col lg:justify-center",
} as const;

/**
 * The eyebrow tracking on THIS page is the frame's own, and it is not the
 * value About uses. Every gold eyebrow on a dark ground here is drawn at 8px
 * on 24px type — 0.333em, much wider than About's 0.08em — and §08's burnt
 * eyebrow on canvas drops back to 0.08em. Checked on §01, §02, §06 and §08
 * rather than assumed, because the two pages share a Figma style name and
 * disagree on its value.
 */
const EYEBROW_DARK =
  "eyebrow text-base leading-[1.3] tracking-[0.16em] text-gold sm:text-2xl sm:tracking-[0.333em]";

/** boomerang, circle, starburst — the frame's rotation, in repo glyph names. */
const CARD_GLYPHS: SeamGlyphMotif[] = ["c", "a", "b"];

/** Naive sentence split; no abbreviation or decimal appears in these strings. */
const sentences = (para: string): string[] =>
  para.match(/[^.]+\./g)?.map((s) => s.trim()) ?? [para];

/**
 * The page's first sentence.
 *
 * ⚠ VERBATIM FROM THE TRUTH v3 DRAFT, and quoted here rather than imported.
 * It lives at src/content/truth.ts:134, inside a card inside an era inside
 * `erasBefore` — reaching through that shape to pull one string would couple
 * this page to Truth's era model, and a partnerships thesis is not a Truth
 * era. The previous build of this page quoted it the same way for the same
 * reason. If the draft changes, change it in both places.
 */
const PRINCIPLE =
  "A researcher on Country is a guest on Country. Partnerships here are expected to give something back to the land and the people.";

/**
 * The obligation, from About's Reciprocity value (about.ts). The whole page
 * hangs off this sentence, and it is not written for this page either — it is
 * the client's own words about how partnerships work here, borrowed from the
 * page whose draft carries them.
 */
const RECIPROCITY_BODY = howWeWork.values[2].body;

const HERO = photoById("pt-hero");
const RESEARCH = photoById("pt-research");
const BREATH = photoById("pt-breath");

/* -------------------------------------------------------------------------
   01 · Hero — a researcher on Country is a guest on Country · 150vh
   ------------------------------------------------------------------------- */

/**
 * The aerial across the top, the wave, then the page's first sentence and its
 * first action on the page's own evergreen beneath.
 *
 * ⚠ THE COPY IS BACK ON THE GROUND, WHICH REVERSES THE 5 SEPTEMBER CALL
 * (user direction, 9 September 2026, against the wireframe). The history is
 * worth keeping because it has now gone both ways: Figma draws the photograph
 * across the top two-thirds with the copy on evergreen beneath it, 1350px in
 * all; Ivy moved the copy ONTO the picture on 2026-09-05 because that left a
 * whole screen of image carrying no words; and the frame's arrangement is now
 * restored on the user's own reading of the wireframe. THE OBLIGATION NEVER
 * MOVED through any of it: §02 still states it alone on evergreen, which is
 * the page's argument.
 *
 * ⚠ THE X5 SCRIM IS BACK, AND THE COMPRESSION IS GONE — user direction with
 * the frame's own readout, 10 September 2026. Both of the notes that stood
 * here are superseded and are summarised rather than kept, because each had
 * been argued at length and a reader should know they were overturned on
 * evidence and not by oversight:
 *
 *   — The two X5 scrims had been removed on the reading that "no type sits on
 *     this photograph any more, so a gradient over it is just a darkened
 *     picture, and the wireframe draws the aerial bright". The frame readout
 *     says otherwise: it carries a single full-height X5 over the media,
 *     bottom-weighted, labelled non-negotiable. It is restored to the
 *     gradient the frame states, exactly.
 *
 *   — The photograph had been held to `58svh` against the frame's 900 so that
 *     the eyebrow and headline cleared the fold at 1440 x 900, described in
 *     its own note as "a deliberate compression of the frame, not a match to
 *     it". The frame is now the instruction, so the compression is dropped:
 *     the picture is a full screen and the section is 150vh.
 *
 * ⚠ THE HEADER BAND LOSES ITS OWN SCRIM WITH THIS CHANGE, and it is worth
 * knowing rather than discovering. `SiteHeader` is transparent and absolutely
 * positioned over whatever the page opens on (SiteHeader.tsx:37), and a short
 * top-only gradient used to darken the strip behind the white wordmark and
 * nav. The frame has no such scrim — its X5 is transparent at 0% precisely
 * where the header sits — so following the frame means the chrome now lands
 * on open sky and lit canopy unaided. It reads at 1440 on this photograph.
 * A different hero frame, or a paler sky, and it will not.
 *
 * ⚠ THE FRAME'S ⟡ STAND-IN CHIP IS NOT BUILT. The readout draws a badge and a
 * dark chip over the top-left of the picture; user direction on 10 September
 * was to disregard it, and the four partnerships photographs are no longer
 * stand-ins in `kit.ts`. The chip would be captioning a condition that has
 * been lifted.
 *
 * THE MEASURE, straight off the readout and section-relative: media 0-900 ·
 * wave ink 795-900 · eyebrow 912 · headline 962 (1240 wide, two lines at 84 /
 * 108%) · standfirst 1170 · action row 1246-1302 · section foot 1350. The
 * margins below are those gaps and nothing rounder.
 *
 * ⚠ THE WAVE IS INSIDE THIS SECTION, not at the top of the next one. §02 is
 * evergreen too, so there is no seam between them — the only handover is from
 * the photograph to the ground, and the wave has to be seated on the picture
 * to make it. It is a sibling of the photo box, never a child: `WaveDivider`
 * is pulled entirely above its own box, so a parent `overflow-hidden` deletes
 * it outright.
 *
 * THE PAGE'S FIRST ACTION IS HERE. The 2 September pass found this page
 * offering nothing to press until roughly 8,900px down, when someone arriving
 * at /partnerships has already decided to partner. The blob goes to the ways
 * in; the quiet link goes to the open questions.
 *
 * THE ONE SECTION ON THIS PAGE THAT MOVES (user direction, 9 September 2026),
 * built at 1440 x 900 first. The score is at src/lib/motion/partnerships.ts;
 * this file owns only the hooks — `data-pt-eyebrow`, `data-pt-heading`,
 * `data-pt-arrive` on the standfirst and the action row, `data-pt-wave` on
 * the divider's wrapper box. ⚠ THE PHOTOGRAPH HAS NO HOOK AND MUST NOT GET
 * ONE: the crew on the burn edge is publishable because nobody is
 * identifiable from height, and `pt-hero` is graded `frame` — the world
 * arrives around this picture, the picture never moves.
 */
export function PartnershipsHero() {
  const [claim, obligation] = sentences(PRINCIPLE);

  return (
    <section
      data-pt="hero"
      data-nav-hero
      className={`relative bg-evergreen text-canvas ${SCREEN.hero}`}
    >
      {/* THE PHOTOGRAPH, alone. No copy, no scrim, no badge — the wireframe
          draws the aerial bright and full width, and the wave below it is the
          only thing that happens on it.

          58svh, not the frame's 792px: see the header. The picture is graded
          `frame` (kit.ts, `pt-hero`) and carries no motion hook, so this box
          holds still under everything the overture does around it.

          ⚠ THE VISIBLE ⟡ STAND-IN BADGE WAS REMOVED on user request,
          9 September 2026. What it said is still true and still held:
          `aerial-crew-burnedge` is a placeholder — THERE IS NO PHOTOGRAPH OF
          RESEARCH, A SURVEY OR A SCIENTIST ANYWHERE IN THE COLLECTION, and
          this frame stands in because nobody is identifiable from height,
          which is the safe way to show a crew. It must be replaced with a
          cleared frame of research being done on Country before launch. The
          claim now lives only here, in `kit.ts` and in
          docs/motion/scenes.md — a reviewer looking at the page will no
          longer be told. */}
      <div className="relative h-[58svh] w-full overflow-hidden lg:h-screen">
        <div data-motion={HERO?.grade ?? "frame"} className="absolute inset-0">
          <MediaOrField
            src={HERO?.src ?? null}
            alt="A drone view along an escarpment burn edge, a crew walking it on foot"
            sizes="100vw"
            priority
            fieldClass="bg-evergreen"
          />
        </div>

        {/* SCRIM · X5 — the frame's own stops, transcribed and not tuned.
            Full height of the media, transparent at the top and gathering to
            rgba(9,14,18,0.72) at the foot, which is the ground the wave hands
            off into. It carries no type — the copy sits below the picture —
            so what it buys here is the seam: the aerial's lower third is lit
            scrub, and against evergreen an unscrimmed edge reads as a photo
            stopping rather than a page continuing. Stated in the frame as
            non-negotiable where copy sits on media; kept verbatim so a later
            reader compares stops with the readout instead of guessing. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.18) 62%, rgba(9,14,18,0.72) 100%)",
          }}
        />
      </div>

      {/* The wave hands the photograph off into the evergreen below — §02's
          ground, since this section now ends with the picture.

          ⚠ THE INNER BOX IS A MOTION HOOK WITH A JOB, not a wrapper for its
          own sake. `waveHandoff` translates its target by `yPercent`, and the
          wave SVG itself is untouchable — it seats on a Tailwind
          `-translate-y-[calc(100%-1px)]` that any inline GSAP transform
          clobbers (About's disappearing-wave defect). So the effect moves this
          box instead, and the box is given the divider's own height (h-10 /
          sm:h-26) so `yPercent: 100` is exactly one wave-height of travel:
          parked, the wave sits in the evergreen below the seam, invisible
          against it; played, it rises onto the photograph.

          The box is absolute inside a zero-height `relative` parent, at the
          same top-0 origin the divider had as a direct child, so the seated
          position is unchanged and the section still contributes no height
          here. It stays a SIBLING of the photo box, never a child: a parent
          `overflow-hidden` would delete a divider that lives entirely above
          its own box. */}
      <div className="relative">
        <div
          data-pt-wave
          className="pointer-events-none absolute inset-x-0 top-0 h-10 sm:h-26"
        >
          <WaveDivider ground="var(--color-evergreen)" />
        </div>
      </div>

      {/* THE COPY, on the page's own evergreen — the wireframe's arrangement.
          The wave is pulled entirely ABOVE this block (onto the picture), so
          it costs no height here and `pt` is ordinary breathing space under
          the seam rather than divider clearance. */}
      <div className={`${COLUMN} relative pt-14 pb-20 lg:pt-3 lg:pb-12`}>
        <p data-pt-eyebrow className={EYEBROW_DARK}>
          Work with us
        </p>
        {/* 84 / 108% / -2px, and the tracking is written as the em the frame's
            px works out to at THIS size — -2 on 84 is -0.0238em, and it would
            be a different em at any other step, which is why it is set at
            `lg:` beside the size rather than once on the element. */}
        <h1
          data-pt-heading
          className="headline mt-6 max-w-[1240px] text-[3.5rem] leading-[1.08] tracking-[-0.02em] sm:text-6xl lg:mt-[19px] lg:text-[5.25rem] lg:tracking-[-0.0238em]"
        >
          {claim}
        </h1>
        <p
          data-pt-arrive
          className="mt-10 max-w-[1000px] text-lg leading-[1.5] font-medium sm:text-2xl lg:mt-[26px]"
        >
          {obligation}
        </p>

        {/* 21px between the blob and the quiet link, not the 32 this row used
            to run: the frame sets the blob 100-376 and starts the secondary at
            397, and at 32 the two read as an equal pair rather than an action
            with a footnote beside it. */}
        <div
          data-pt-arrive
          className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5 lg:mt-10 lg:gap-x-[21px]"
        >
          <BlobButton href="#ways-in" tone="burnt" still>
            See the ways in →
          </BlobButton>
          <a
            href="#open-questions"
            className="eyebrow text-sm tracking-[0.28em] text-gold"
          >
            → Four open questions
          </a>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   02 · THE OBLIGATION — ⚑ the page's thesis, alone on a screen · 100vh
   ------------------------------------------------------------------------- */

/**
 * One sentence on a screen, and it is the page's whole argument: hosting
 * carries an obligation, which greeting does not, and the obligation is what
 * makes this a partnerships page rather than a contact page.
 *
 * Source is about.ts — the Reciprocity value, split at its own sentence
 * boundary so the claim lands at 64 and the consequence follows at 28.
 *
 * ⚠ R22 travels with this sentence. The Strategic Plan frames reciprocity as
 * the Ngapartji-Ngapartji principle, which is Western Desert language and not
 * Iningai. About raises it against itself; this page states the value without
 * the term, which is the safe rendering while it is unresolved — but the risk
 * is not closed by omitting the word here.
 */
export function TheObligation() {
  const [claim, consequence] = sentences(RECIPROCITY_BODY);

  return (
    <section className={`relative overflow-hidden bg-evergreen text-canvas ${SCREEN.obligation}`}>
      <RingArtwork
        piece="b"
        className="-top-32 left-[44%] w-[62.5rem] opacity-8"
      />
      <div className={`${COLUMN} relative py-16 lg:py-28`}>
        <p className={EYEBROW_DARK}>The obligation</p>
        <h2 className="headline mt-8 max-w-[1180px] text-4xl leading-[1.2] tracking-[-0.02em] sm:text-5xl lg:text-[3.5rem]">
          {claim}
        </h2>
        <p className="mt-14 max-w-[1000px] text-xl leading-[1.5] font-medium sm:text-[1.75rem]">
          {consequence}
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   03 · Open research — the three disciplines · 120vh
   ------------------------------------------------------------------------- */

/**
 * ⚠ `#research-opportunities` IS LOAD-BEARING and lives here. Truth's "Open
 * research" entry and The Record's knowledge-gaps section both link to it by
 * anchor; unbuilt, both are dead links. It was on the old build of this page
 * and it must not be renamed.
 *
 * The three disciplines are the Truth draft's own list, set one per rule.
 *
 * ⚠ R24 ON THE PHOTOGRAPH. 378A7604_1.45.2 is the only research frame in the
 * collection and its subject's face is visible and identifiable. Use was
 * cleared; identification was not asked. Badged in the markup, as on Our
 * People and About §07.
 */
const DISCIPLINES = [
  "Palaeontology and archaeology",
  "Ecology and biodiversity",
  "Medicinal botany",
] as const;

export function OpenResearch() {
  return (
    <section
      id="research-opportunities"
      className={`relative scroll-mt-28 bg-canvas text-charcoal ${SCREEN.openResearch}`}
    >
      <WaveDivider ground="var(--color-canvas)" />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <RingArtwork piece="b" className="top-[6%] left-[62%] w-[56.25rem] opacity-30" />
        <RingArtwork
          piece="a"
          tone="roasted"
          className="-left-48 bottom-[8%] w-[40rem] opacity-30"
        />
      </div>

      <div className={`${COLUMN} relative pt-16 pb-16 lg:pt-24 lg:pb-24`}>
        <p className="eyebrow text-xl leading-[1.5] tracking-[0.08em] text-burnt sm:text-2xl">
          Still to be found
        </p>
        <h2 className="headline mt-6 max-w-[1180px] text-4xl leading-[1.2] text-evergreen sm:text-5xl lg:text-[3.5rem]">
          Open research
        </h2>
        <p className="mt-8 max-w-[940px] text-lg leading-[1.5] font-medium text-charcoal/92 sm:text-2xl">
          Most of this Country has never been studied. We are looking for
          researchers in the three disciplines below.
        </p>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_26.25rem] lg:items-start">
          <div>
            {DISCIPLINES.map((discipline) => (
              <div key={discipline} className="border-t border-charcoal/14 py-8">
                <p className="headline text-2xl leading-[1.2] text-evergreen sm:text-[2.5rem]">
                  {discipline}
                </p>
              </div>
            ))}
            <div className="border-t border-charcoal/14" />
          </div>

          <figure className="relative">
            <div className="relative aspect-[420/300] w-full overflow-hidden rounded-3xl">
              <div
                data-motion={RESEARCH?.grade ?? "frame"}
                className="absolute inset-0"
              >
                <MediaOrField
                  src={RESEARCH?.src ?? null}
                  alt="A man working a pestle in a stone mortar on a ute tray"
                  sizes="(min-width: 1024px) 448px, 100vw"
                  fieldClass="bg-evergreen/40"
                />
              </div>
              <span aria-hidden className="absolute inset-0 bg-black/35" />
              <SeamGlyph motif="b" className="right-4 bottom-4 w-11" />
              <p
                data-placeholder="consent-unresolved"
                className="eyebrow absolute top-4 left-4 rounded-xs bg-charcoal/70 px-3 py-1.5 text-[10px] text-canvas"
              >
                ⟡ Stand-in · ⚠ consent unresolved
              </p>
            </div>
            <figcaption className="mt-5 text-base leading-[1.5] text-roasted">
              Working a pestle in a stone mortar — the only research frame in the
              collection.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   04 · FOUR OPEN QUESTIONS — ⚑ the inversion · 190vh
   ------------------------------------------------------------------------- */

/**
 * ⚑ THE PAGE'S ARGUMENT. The Record §03 sets these four questions as absence
 * and puts nothing under them. Here each one discloses WHAT IS ALREADY
 * RUNNING, so the reader sees a programme they could join rather than a hole
 * they would have to fill alone. Same imported `knowledgeGaps`, opposite
 * argument — see the note on `running` in src/content/the-record.ts.
 *
 * ⚠ THE SHUTTER IS NOT BUILT, AND ITS ABSENCE IS THE POINT. The frame draws a
 * panel over each disclosure that flattens onto its own baseline as the
 * section scrolls, and its layer name says ⛔ never hover. On a static page
 * the rest state IS the finished state, so the disclosure renders already
 * open. Do not turn the shutter into a click or a hover to "restore" it —
 * that would make the reader work for content the design gives them.
 *
 * ⚠ GAP 1 HAS NO PHOTOGRAPH and is not missing one. No cleared frame of Marra
 * Wonga exists, so the card stays typographic and says so on its face. The
 * row does not restyle around the gap.
 */
const GAP_PHOTOS = [null, "work-seed", "pt-soil", "about-fire"] as const;
const GAP_GROUNDS = [
  "bg-evergreen",
  "bg-roasted",
  "bg-midnight",
  "bg-charcoal",
] as const;

export function OpenQuestions() {
  return (
    <section
      id="open-questions"
      className={`relative scroll-mt-28 bg-canvas text-charcoal ${SCREEN.openQuestions}`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <RingArtwork piece="b" className="top-[4%] left-[64%] w-[56.25rem] opacity-30" />
        <RingArtwork
          piece="a"
          tone="roasted"
          className="-left-48 bottom-[16%] w-[40rem] opacity-30"
        />
      </div>

      <div className={`${COLUMN} relative pt-16 pb-16 lg:pt-24 lg:pb-28`}>
        <p className="eyebrow text-xl leading-[1.5] tracking-[0.08em] text-burnt sm:text-2xl">
          The offer
        </p>
        <h2 className="headline mt-6 max-w-[1180px] text-4xl leading-[1.2] text-evergreen sm:text-5xl lg:text-[3.5rem]">
          {knowledgeGaps.title}
        </h2>
        <p className="mt-8 max-w-[940px] text-lg leading-[1.5] font-medium text-charcoal/92 sm:text-2xl">
          {knowledgeGaps.lede}
        </p>

        {/* `label` is set HERE and nowhere else: these cards are `article`s
            with nothing focusable inside them, so without a tab stop on the
            rail a keyboard cannot reach questions two to four on a phone.
            The other three rails are rows of links and need none. */}
        <CardRail
          className="mt-12 lg:mt-16"
          columns="lg:grid-cols-2"
          gap="sm:gap-8"
          label="The four open questions"
        >
          {knowledgeGaps.gaps.map((gap, i) => {
            const photo = GAP_PHOTOS[i] ? photoById(GAP_PHOTOS[i]!) : undefined;
            return (
              <article
                key={gap.question}
                className={`relative flex flex-col overflow-hidden rounded-3xl ${GAP_GROUNDS[i]} text-canvas lg:min-h-[29.5rem]`}
              >
                {photo ? (
                  <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden lg:aspect-[610/200]">
                    <div data-motion={photo.grade} className="absolute inset-0">
                      <MediaOrField
                        src={photo.src}
                        alt={photo.subject}
                        sizes="(min-width: 1024px) 610px, (min-width: 640px) 100vw, 78vw"
                        fieldClass="bg-canvas/6"
                      />
                    </div>
                    <span aria-hidden className="absolute inset-0 bg-black/35" />
                    <SeamGlyph
                      motif={CARD_GLYPHS[i % CARD_GLYPHS.length]}
                      className="right-5 bottom-4 w-10"
                    />
                    <p
                      data-placeholder="stand-in"
                      className="eyebrow absolute top-4 left-4 rounded-xs bg-charcoal/70 px-2.5 py-1 text-[9px] text-gold"
                    >
                      ⟡ Stand-in
                    </p>
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col p-6 lg:p-[34px]">
                  {!photo ? (
                    <SeamGlyph
                      motif={CARD_GLYPHS[i % CARD_GLYPHS.length]}
                      className="relative top-0 right-0 mb-6 w-10"
                    />
                  ) : null}

                  <h3 className="headline text-2xl leading-[1.2] tracking-[-0.025em] sm:text-[1.875rem]">
                    {gap.question}
                  </h3>
                  <p className="mt-5 max-w-[540px] text-[0.9375rem] leading-[1.5] text-canvas/78">
                    {gap.detail}
                  </p>

                  {/* No cleared frame, and the card says so rather than
                      restyling around the gap. */}
                  {!photo ? (
                    <p
                      data-placeholder="no-cleared-frame"
                      className="mt-6 text-xs leading-[1.45] text-gold"
                    >
                      ⚠ No cleared frame — stays typographic
                    </p>
                  ) : null}

                  {/* The disclosure, at rest: already open. */}
                  <div className="mt-auto pt-10">
                    <p className="eyebrow text-[10px] leading-[1.3] tracking-[0.5em] text-gold">
                      What is running
                    </p>
                    <p className="mt-2 text-[1.0625rem] leading-[1.4] font-medium">
                      {gap.running}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </CardRail>

        {/* The peak of interest — four projects a reader could take on, and
            the action sits right under them. Quiet on purpose: the questions
            are the loud thing here. */}
        <a
          href="#ways-in"
          className="eyebrow mt-14 block text-sm tracking-[0.28em] text-burnt"
        >
          → See the ways in
        </a>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   04b · BREATH — one photograph, no words · 55vh
   ------------------------------------------------------------------------- */

/** No caption, by design: a caption would make the breath an argument. */
export function Breath() {
  return (
    <section className="relative bg-charcoal">
      <WaveDivider ground="var(--color-charcoal)" />
      <div
        data-motion={BREATH?.grade ?? "full"}
        className="relative h-[55svh] w-full overflow-hidden"
      >
        <MediaOrField
          src={BREATH?.src ?? null}
          alt="A wide plain of low green scrub seen through a screen of slender trees"
          sizes="(min-width: 1024px) 100vw, 260vw"
          fieldClass="bg-evergreen/40"
        />
      </div>
      <SeamGlyph motif="a" className="right-10 bottom-8 w-11" />
    </section>
  );
}

/* -------------------------------------------------------------------------
   05 · Who we already work with — nine names, three groups · 130vh
   ------------------------------------------------------------------------- */

/**
 * ⚠ R12 — NAMES, NEVER LOGOS. No approved logo files exist and the draft asks
 * whether each partnership is still active. A lapsed partner's logo is a worse
 * problem than a plain name.
 *
 * ⚠ THE SAME NINE NAMES ARE ON /about#partners, and that is deliberate. About
 * sets them in rows on a dotted rule as evidence of credibility; the hub
 * groups them into cards by what each group is FOR, because a reader here is
 * deciding which group they would be joining. If these two ever read the
 * same, one of them is redundant — the difference is the treatment, and it is
 * load-bearing.
 */
/**
 * FILLED, NOT OUTLINED — corrected 10 September 2026 against the 1440 frame.
 *
 * These three were `border border-canvas/12` on charcoal, which reads as an
 * outline on a dark ground and all but vanishes at 1440. The frame draws them
 * as solid cards in the same rotation §04 and §06 already use, and the reason
 * is structural rather than decorative: this section groups partners by what
 * each group is FOR, and a reader scanning for which group they'd be joining
 * needs the three to separate at a glance. An outline does not do that.
 *
 * Charcoal is skipped deliberately — it is the section's own ground, and a
 * charcoal card on charcoal is the outline problem again. Three groups, three
 * distinct fills.
 */
const PARTNER_GROUNDS = ["bg-evergreen", "bg-roasted", "bg-midnight"] as const;

export function AlreadyWorkingWith() {
  return (
    <section className={`relative overflow-hidden bg-charcoal text-canvas ${SCREEN.partners}`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <RingArtwork piece="b" className="top-[8%] left-[62%] w-[62.5rem] opacity-8" />
        <RingArtwork piece="a" className="-left-52 bottom-[6%] w-[45rem] opacity-7" />
      </div>

      <div className={`${COLUMN} relative pt-16 pb-16 lg:pt-24 lg:pb-24`}>
        <p className={EYEBROW_DARK}>Already here</p>
        <h2 className="headline mt-6 max-w-[1180px] text-4xl leading-[1.2] tracking-[-0.02em] sm:text-5xl lg:text-[3.5rem]">
          Who we already work with
        </h2>
        <p className="mt-8 max-w-[940px] text-lg leading-[1.5] font-medium text-canvas/88 sm:text-2xl">
          {partners.body}
        </p>

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-3">
          {partners.groups.map((group, i) => (
            <div
              key={group.title}
              className={`relative rounded-3xl ${PARTNER_GROUNDS[i]} p-6 lg:min-h-[25rem] lg:p-8`}
            >
              <SeamGlyph
                motif={CARD_GLYPHS[i % CARD_GLYPHS.length]}
                className="relative top-0 left-0 mb-7 w-11"
              />
              <p className="eyebrow text-xs tracking-[0.28em] text-gold">
                {group.title}
              </p>
              <ul className="mt-6">
                {group.names.map((name) => (
                  <li
                    key={name}
                    className="border-t border-canvas/12 py-5 text-lg leading-[1.25] font-medium first:border-t-0 first:pt-0 lg:py-4 lg:leading-[1.35]"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 max-w-[900px]">
          <EditorialNote tone="canvas">
            <p>{partners.pending}</p>
          </EditorialNote>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   06 · Ways in — four cards · 140vh
   ------------------------------------------------------------------------- */

/**
 * ⚑ THE SECTION THE SITE NEVER HAD. Until this page, someone who wanted to
 * work with YACHATDAC had no single place that said how — the offer was split
 * across Living Work and The Record and neither named it as an offer.
 *
 * ⚠ THREE OF THE FOUR ARE RETARGETED, and the frame is right to do it.
 * `getInvolved` lives on Living Work, where its "Fund the work" and "Land
 * management services" cards correctly point at /partnerships. On THIS page
 * those are self-links — a button that reloads the page you are reading — so
 * both go to /connect, and Ranger exchange goes to the section that actually
 * describes it. The content module is not edited: its hrefs are right for the
 * page that owns it, and the mapping below is right for this one.
 *
 * ⚠ D7 IS STILL OPEN on the third card's label. The decision says "book a
 * consultation", the draft says "Enquire", and neither is picked here — the
 * frame labels it GET IN TOUCH, which is true whichever way D7 lands.
 *
 * Bodies are verbatim: three from `getInvolved.paths`, and the first from
 * the-record.ts, which is where the researcher-facing sentence already lived.
 */
const WAYS = [
  {
    title: "Research partnership",
    body: "What we do not know and would like studied. Start here if you are a researcher.",
    href: "#open-questions",
    label: "Four open questions",
    ground: "bg-charcoal",
  },
  {
    title: "Fund the work",
    body: getInvolved.paths[1].body,
    href: "/connect",
    label: "Get in touch",
    ground: "bg-roasted",
  },
  {
    title: "Land management services",
    body: getInvolved.paths[2].body,
    href: "/connect",
    label: "Get in touch",
    ground: "bg-midnight",
  },
  {
    title: "Ranger exchange",
    body: getInvolved.paths[0].body,
    href: "/living-work#rangers",
    label: "Meet the rangers",
    ground: "bg-charcoal",
  },
] as const;

export function WaysIn() {
  return (
    <section
      id="ways-in"
      className={`relative scroll-mt-28 bg-evergreen text-canvas ${SCREEN.waysIn}`}
    >
      <WaveDivider ground="var(--color-evergreen)" />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <RingArtwork piece="b" className="top-[10%] left-[64%] w-[56.25rem] opacity-8" />
        <RingArtwork piece="a" className="-left-48 bottom-[14%] w-[40rem] opacity-7" />
      </div>

      <div className={`${COLUMN} relative pt-16 pb-16 lg:pt-24 lg:pb-24`}>
        <p className={EYEBROW_DARK}>Get involved</p>
        <h2 className="headline mt-6 text-4xl leading-[1.2] tracking-[-0.023em] sm:text-5xl lg:text-[3.5rem]">
          Ways in
        </h2>

        <CardRail className="mt-12" columns="sm:grid-cols-2 lg:grid-cols-4">
          {WAYS.map((way, i) => (
            <a
              key={way.title}
              href={way.href}
              className={`relative flex flex-col rounded-3xl ${way.ground} p-6 text-canvas lg:min-h-[22.5rem]`}
            >
              <SeamGlyph
                motif={CARD_GLYPHS[i % CARD_GLYPHS.length]}
                className="relative top-1 left-0 w-14 shrink-0"
              />
              <h3 className="headline mt-8 text-2xl leading-[1.2] tracking-[-0.02em] sm:text-[1.625rem]">
                {way.title}
              </h3>
              <p className="mt-4 text-sm leading-[1.5] text-canvas/78">
                {way.body}
              </p>
              {/* A label says what happens, never where the file is. */}
              <p className="eyebrow mt-auto pt-6 text-xs tracking-[0.28em] text-gold">
                → {way.label}
              </p>
            </a>
          ))}
        </CardRail>

        <div className="mt-16">
          <BlobButton href="/connect" tone="burnt" still>
            Get in touch →
          </BlobButton>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   07 · How work is agreed — and what is still unwritten · 100vh
   ------------------------------------------------------------------------- */

/**
 * ⚑ THE CONTAINER NEVER FILLS. The research protocol — consent, access, who
 * holds data, what the Elder Advisory Group signs off — is the document that
 * would answer "how does work here get agreed", and it is in preparation. The
 * frame draws the container with a status pill and nothing inside it, which is
 * the honest rendering: the shape of the answer, marked as absent.
 *
 * Drawing it rather than omitting it is the same rule Living Work §08 uses for
 * unconfirmed status. Omitting it would let the page imply the protocol
 * exists; filling it would invent one.
 */
export function HowWorkIsAgreed() {
  const protocol = documents.find((d) => d.title.includes("research protocol"));

  return (
    <section className={`relative bg-roasted text-canvas ${SCREEN.protocol}`}>
      <WaveDivider ground="var(--color-roasted)" />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <RingArtwork piece="a" className="-left-52 top-[30%] w-[47.5rem] opacity-7" />
        <RingArtwork piece="b" className="top-[8%] left-[66%] w-[56.25rem] opacity-8" />
      </div>

      <div className={`${COLUMN} relative pt-16 pb-16 lg:pt-24 lg:pb-24`}>
        <p className={EYEBROW_DARK}>How work is agreed</p>
        <h2 className="headline mt-6 max-w-[1180px] text-4xl leading-[1.2] tracking-[-0.02em] sm:text-5xl lg:text-[3.5rem]">
          {protocol?.title ?? "Working with us — research protocol"}
        </h2>
        <p className="mt-8 max-w-[940px] text-lg leading-[1.5] font-medium text-canvas/88 sm:text-2xl">
          {protocol?.summary}
        </p>

        {/* Drawn, not filled. */}
        <div
          data-placeholder="protocol-in-preparation"
          className="relative mt-12 max-w-[900px] rounded-3xl border-[1.5px] border-dashed border-gold/55 p-6 lg:mt-16 lg:p-9"
        >
          <SeamGlyph motif="a" className="right-6 bottom-6 hidden w-11 lg:block" />
          <p className="eyebrow inline-block rounded-xs border border-gold/55 px-3 py-1.5 text-[10px] tracking-[0.28em] text-gold">
            In preparation
          </p>
          <p className="mt-6 max-w-[640px] text-base leading-[1.6] text-canvas/85">
            No page anywhere explains how research here is agreed. The protocol
            is the document that would, and it is being written. Until it
            exists, requests are answered case by case — {onRequest.pending}
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   08 · The ending — one action · 70vh
   ------------------------------------------------------------------------- */

/**
 * ⚠ NO CONTACT BLOCK, AND THAT IS THE DECISION. This section used to clone
 * About §09 — the four-way router and the six bracketed fields. D5 puts that
 * block on About and Our People because both their v1 drafts carry it word
 * for word; this page has no draft, so its copy was never sourced, it was
 * assembled. It was removed on 2 September.
 *
 * What is left is the one contact detail that is NOT a placeholder — the
 * office locality, contact.ts's only confirmed field — and a single action.
 * Partnerships persuades; Connect transacts.
 */
export function TheEnding() {
  const office = contactDetails.find((d) => !d.pending);

  return (
    <section className={`relative bg-canvas text-charcoal ${SCREEN.ending}`}>
      <WaveDivider ground="var(--color-canvas)" />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <RingArtwork piece="b" className="top-[7%] left-[78%] w-[35rem] opacity-30" />
      </div>

      {/* Two columns, and the split is the argument: the address is a fact
          and the action is a choice, so they sit beside each other instead of
          stacking into one long left-hand list. `items-end` sets the button on
          the address's baseline rather than floating it against the eyebrow.
          One column below lg — at 1024 the two would be 392px apiece and the
          button would sit a screen-width from the words it answers. */}
      <div className={`${COLUMN} relative grid gap-x-12 gap-y-12 pt-16 pb-16 lg:grid-cols-2 lg:items-end lg:pt-24 lg:pb-28`}>
        <div>
          <p className="eyebrow text-xl leading-[1.5] tracking-[0.08em] text-burnt sm:text-2xl">
            Where we are
          </p>

          <div className="mt-10">
            <p className="eyebrow text-xs tracking-[0.08em] text-burnt">
              {office?.label}
            </p>
            <p className="mt-2 max-w-[360px] text-base leading-[1.5] text-charcoal">
              {office?.value}
            </p>
          </div>
        </div>

        <div className="lg:justify-self-end">
          <BlobButton href="/connect" tone="burnt" still>
            Get in touch →
          </BlobButton>
        </div>
      </div>
    </section>
  );
}
