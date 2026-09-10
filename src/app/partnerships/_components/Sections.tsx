import { photoById } from "@/content/kit";
import { howWeWork, partners } from "@/content/about";
import { contactDetails } from "@/content/contact";
import { getInvolved } from "@/content/living-work";
import { documents, knowledgeGaps } from "@/content/the-record";
import { partnershipsHiFi } from "@/content/partnerships";
import { CardRail } from "@/components/ui/CardRail";
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
          /* `text-h1` since 11 Sep 2026 — was a 56/60/84 ladder. Tracking
             is kept, being this hero's own optical correction. */
          className="headline mt-6 max-w-[1240px] text-h1 tracking-[-0.02em] lg:mt-[19px] lg:tracking-[-0.0238em]"
        >
          {/* ⚠ THE FULL STOP IS DROPPED HERE AND NOWHERE ELSE. The frame sets
              this headline without one; `PRINCIPLE` keeps it, because that
              string is the Truth v3 draft's sentence quoted verbatim and the
              draft punctuates it. Stripping at render rather than editing the
              constant keeps the quotation intact for anyone diffing it against
              the draft, and leaves the standfirst — the sentence's second half
              — untouched. A headline's terminal stop is a typographic call the
              frame is entitled to make; the words are unchanged. */}
          {claim.replace(/\.$/, "")}
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
          {/* size + align are the frame's own: `Nav & CTA/16` at 0.08em, and
              the label seated 26 from the left of the shape rather than
              centred. Measured off the readout, not guessed — the button was
              rendering a 12px label centred at 73/73, which is why it read as
              floating in the blob. */}
          <BlobButton href="#ways-in" tone="burnt" still size="cta" align="frame">
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
        className="-top-32 left-[44%] w-[62.5rem]"
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
/* Lowercase, and sourced — see partnershipsHiFi.disciplines for why the
   frame and the Truth draft both set them that way. */
const DISCIPLINES = partnershipsHiFi.disciplines.items;

export function OpenResearch() {
  return (
    <section
      id="research-opportunities"
      className={`relative scroll-mt-28 bg-canvas text-charcoal ${SCREEN.openResearch}`}
    >
      <WaveDivider ground="var(--color-canvas)" />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* ⚑ ROASTED, AND AT ITS OWN OPACITY — corrected 10 September 2026
            against the frame's `rings` node (3003:27158: 900.01 x 909.984,
            fill #4E3524, opacity 0.08).

            This was `piece="b"` with no tone, which resolves to ring-b.svg —
            filled #F6F6EC. On a canvas ground that is off-white on off-white,
            so the artwork was rendering and could not be seen. Its own sibling
            below already carried `tone="roasted"` for exactly this reason; the
            b ring was simply missed.

            `opacity-30` is dropped rather than retuned. Every ring export
            bakes `opacity="0.08"` into its own `<g>`, which is already the
            figure the frame states, so the utility was multiplying it down to
            0.024 — a quarter of the intended weight on top of the wrong
            colour. The width is untouched: `w-[56.25rem]` is 900px, and the
            node is 900.01.

            ⚑ EVERY RING ON THIS PAGE NOW CARRIES NO OPACITY UTILITY, for the
            same reason. All nine sites had one — `opacity-30` on the canvas
            grounds and `opacity-8` / `opacity-7` on the dark ones — and the
            dark-ground pair was the worst of it at 0.08 x 0.08 = 0.0064,
            twelve times fainter than drawn. The baked 0.08 is the artist's
            own value and the only one the frame quotes; nothing should
            multiply it. If a ring ever needs to be quieter than 0.08, change
            it in the export so the number stays in one place.

            ⚠ TONE STILL FOLLOWS THE GROUND, and that is not the same question
            as opacity. #4E3524 is the canvas-ground fill — §03, §04 and §08.
            On evergreen, charcoal and roasted the rings stay the off-white
            cut, because roasted-on-roasted is the identical invisibility
            fault in a different colour. */}
        <RingArtwork
          piece="b"
          tone="roasted"
          className="top-[6%] left-[62%] w-[56.25rem]"
        />
        <RingArtwork
          piece="a"
          tone="roasted"
          className="-left-48 bottom-[8%] w-[40rem]"
        />
      </div>

      <div className={`${COLUMN} relative pt-16 pb-16 lg:pt-24 lg:pb-24`}>
        <p className="eyebrow text-xl leading-[1.5] tracking-[0.08em] text-ochre sm:text-2xl">
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

              {/* ⚠ THE VISIBLE ⟡ STAND-IN BADGE WAS REMOVED on user request,
                  10 September 2026 — the same call made for the hero badge on
                  9 September, and for the same reason: a visitor should not be
                  reading our asset log.

                  WHAT IT SAID IS STILL TRUE AND STILL HELD. `pt-research`
                  (378A7604_1.45.2) is the only research frame in the
                  collection and its CONSENT IS UNRESOLVED — an older man,
                  identifiable, working a pestle. It must be cleared or
                  replaced before launch. The claim now lives only in
                  `src/content/kit.ts`, which carries it both as a ⚠ comment
                  and inside the entry's own `subject` string. Nothing on the
                  page will tell a reviewer any more. */}
            </div>
            {/* Frame copy, 10 September 2026. The caption used to editorialise
                about the collection ("the only research frame in the
                collection") — an asset-log fact, not something a visitor needs,
                and the same class of thing the stand-in badges were removed
                for. The frame describes the picture instead. */}
            <figcaption className="mt-5 text-base leading-[1.5] text-roasted">
              {partnershipsHiFi.researchCaption.text}
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
const GAP_PHOTOS = ["engravings-hand", "work-seed", "pt-soil", "about-fire"] as const;
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
        {/* Same correction as §03 above, and for the same reason: canvas
            ground, 900px b ring, so it needs the roasted cut and its own
            baked 0.08. No separate readout for this one — it is the same
            component at the same size on the same ground, and off-white on
            off-white is not a thing a frame asks for. */}
        <RingArtwork
          piece="b"
          tone="roasted"
          className="top-[4%] left-[64%] w-[56.25rem]"
        />
        <RingArtwork
          piece="a"
          tone="roasted"
          className="-left-48 bottom-[16%] w-[40rem]"
        />
      </div>

      <div className={`${COLUMN} relative pt-16 pb-16 lg:pt-24 lg:pb-28`}>
        <p className="eyebrow text-xl leading-[1.5] tracking-[0.08em] text-ochre sm:text-2xl">
          {partnershipsHiFi.openQuestions.eyebrow}
        </p>
        {/* ⚠ THE FRAME'S TITLE, NOT `knowledgeGaps.title`. The Record keeps
            "What we do not know" because Resources v1 governs it; this page
            has no draft, so the frame governs here. See the header note in
            src/content/partnerships.ts — the override is local and the shared
            module is deliberately untouched. */}
        <h2 className="headline mt-6 max-w-[1180px] text-4xl leading-[1.2] text-evergreen sm:text-5xl lg:text-[3.5rem]">
          {partnershipsHiFi.openQuestions.title}
        </h2>
        {/* The frame's shorter lede, not `knowledgeGaps.lede`. The Record's
            version explains why IT keeps a record; this page is making an
            offer, so the frame drops that clause. Local override — the shared
            module is untouched. */}
        <p className="mt-8 max-w-[940px] text-lg leading-[1.5] font-medium text-charcoal/92 sm:text-2xl">
          {partnershipsHiFi.openQuestions.lede}
        </p>

        {/* ⚑ MOVED ABOVE THE CARDS, 10 September 2026, to the frame's own
            placement (2977:27165 — "intent capture → §06 · placed at the
            top"). It used to sit at the foot of the section on the reasoning
            that the action belongs under the questions. The frame disagrees
            and its layer name says why: this is INTENT CAPTURE. A reader who
            already knows they want in should not have to scroll four cards to
            act, and one who does not will read the cards regardless.

            ⚑ YELLOW OCHRE, BY DIRECTION — August, 10 September 2026, and it
            settles a colour I had changed twice. The frame draws this link
            #D69828, which is `--color-ochre`; I first mis-named that as "the
            dark-ground gold", then substituted `text-burnt`, then
            `text-burnt-deep`, on contrast grounds. The instruction is the
            frame's own colour, so it is used.

            ⚠ THE CONTRAST FIGURE IS RECORDED, NOT RE-ARGUED. On the off-white
            ground #D69828 measures 2.31:1. This link is 14px ExtraBold, under
            WCAG's large-text threshold (18.66px bold), so 4.5:1 would be the
            AA target and it does not reach it. `--color-burnt-deep` (6.31:1)
            is the token that exists for that case and is what this was. The
            call has been made with the number known; it is a live risk for the
            accessibility pass, not an oversight to quietly re-fix. The four
            canvas eyebrows on this page moved with it for the same reason. */}
        <a
          href="#ways-in"
          className="eyebrow mt-8 block text-sm tracking-[0.28em] text-ochre"
        >
          → See the ways in
        </a>

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
        <RingArtwork piece="b" className="top-[8%] left-[62%] w-[62.5rem]" />
        <RingArtwork piece="a" className="-left-52 bottom-[6%] w-[45rem]" />
      </div>

      <div className={`${COLUMN} relative pt-16 pb-16 lg:pt-24 lg:pb-24`}>
        <p className={EYEBROW_DARK}>{partnershipsHiFi.partners.eyebrow}</p>
        <h2 className="headline mt-6 max-w-[1180px] text-4xl leading-[1.2] tracking-[-0.02em] sm:text-5xl lg:text-[3.5rem]">
          Who we already work with
        </h2>
        <p className="mt-8 max-w-[940px] text-lg leading-[1.5] font-medium text-canvas/88 sm:text-2xl">
          {partners.body}
        </p>

        {/* 400 x 440 per the frame (user, 10 September 2026), and the gutter
            falls out of it rather than being chosen: three 400s in the 1240
            column leave 40px across two gaps, so `lg:gap-5` is 20 and the row
            lands on 1240 exactly. The build ran `gap-8`, which forced the
            cards to 392. Height is `lg:min-h-`, not a fixed `h-`: the three
            groups hold four, three and two names, and a hard height would
            clip the longest rather than let the shortest run tall. */}
        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-3 lg:gap-5">
          {partners.groups.map((group, i) => (
            <div
              key={group.title}
              className={`relative rounded-3xl ${PARTNER_GROUNDS[i]} p-6 lg:min-h-[27.5rem] lg:p-8`}
            >
              {/* ⚑ THE FRAME'S CARD, 10 September 2026 (node 0-1).
                  Three things changed and each was wrong on its own terms:

                  GLYPH TOP-RIGHT, NOT STACKED ABOVE THE LABEL. It sat on its
                  own line at the left with the eyebrow pushed beneath it,
                  which spent a whole row of card height on decoration. The
                  frame sets label and glyph on one line, opposite ends, so
                  the names start higher and all three cards align.

                  RULES BELOW EACH NAME, NOT ABOVE. `border-t` with
                  `first:border-t-0` drew the divider between names and left
                  the last one bare; the frame closes the list — a rule under
                  every name including the last, which is what makes the three
                  cards read as the same object at different lengths.

                  NAMES BOLD AND UP A STEP. `font-medium` at `text-lg` was
                  quieter than the frame draws them; these are the content of
                  the section, not a caption under the eyebrow. */}
              <div className="flex items-start justify-between gap-4">
                <p className="eyebrow max-w-[16ch] text-xs leading-[1.5] tracking-[0.28em] text-gold">
                  {group.title}
                </p>
                <SeamGlyph
                  motif={CARD_GLYPHS[i % CARD_GLYPHS.length]}
                  className="relative top-0 right-0 w-11 shrink-0"
                />
              </div>
              <ul className="mt-7">
                {group.names.map((name) => (
                  <li
                    key={name}
                    className="border-b border-canvas/12 py-4 text-xl leading-[1.3] font-bold lg:leading-[1.35]"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
        <RingArtwork piece="b" className="top-[10%] left-[64%] w-[56.25rem]" />
        <RingArtwork piece="a" className="-left-48 bottom-[14%] w-[40rem]" />
      </div>

      <div className={`${COLUMN} relative pt-16 pb-16 lg:pt-24 lg:pb-24`}>
        <p className={EYEBROW_DARK}>Get involved</p>
        {/* H64, per the frame's own layer name ("H64 → Ways in — settle B5").
            The page's other section headings are 56; this one is drawn a step
            larger and only this one has a readout, so only this one moves.
            ⚑ If the rest of the page is meant to be 64 too, that is a single
            change across five headings — ask before assuming it. */}
        <h2 className="headline mt-6 text-4xl leading-[1.2] tracking-[-0.023em] sm:text-5xl lg:text-[4rem]">
          Ways in
        </h2>

        {/* 141 from the heading's box to the rail, measured off the frame at
            100% zoom (the card height checked at 361 against a stated 360, so
            the scale is 1:1). The build ran 48. */}
        <CardRail className="mt-12 lg:mt-[141px]" columns="sm:grid-cols-2 lg:grid-cols-4">
          {WAYS.map((way, i) => (
            <a
              key={way.title}
              href={way.href}
              /* THE FRAME'S CARD, read off node 2958:26269 (way 1).
                 298 x 360, radius 24, padding 24 — all three already fell out
                 of the grid: `lg:grid-cols-4` inside the 1240 column at the
                 rail's own `gap-4` gives (1240 - 3x16) / 4 = 298 exactly, and
                 `rounded-3xl` / `p-6` / `lg:min-h-[22.5rem]` are 24 / 24 / 360.
                 Nothing about the box needed changing.

                 ⚑ WHAT DID: the title sits at y=112 from the card top in the
                 frame, and the build let it float on whatever height the glyph
                 happened to be. The three motifs are NOT the same height —
                 glyph-c (the boomerang) is 44.67 x 37.23, a and b are ~43 x 42
                 — so a margin under an in-flow glyph put the four titles on
                 three different baselines. The glyph is absolute at the
                 padding corner now and the title's y is set by `pt-[112px]`,
                 so every card agrees whatever motif it draws.

                 The glyph is w-11 (44) and not w-14 (56): the frame's asset
                 panel gives the boomerang 44.67 wide. */
              className={`relative flex flex-col rounded-3xl ${way.ground} px-6 pb-[42px] pt-[112px] text-canvas lg:min-h-[22.5rem]`}
            >
              <SeamGlyph
                motif={CARD_GLYPHS[i % CARD_GLYPHS.length]}
                className="top-6 left-6 w-11"
              />
              <h3 className="headline text-2xl leading-[1.2] tracking-[-0.02em] sm:text-[1.625rem]">
                {way.title}
              </h3>
              <p className="mt-4 text-sm leading-[1.5] text-canvas/78">
                {way.body}
              </p>
              {/* A label says what happens, never where the file is.

                  CTA16 as the frame actually sets it (2958:26317): 12px / 800
                  / 150% / 4px, #FBAE3D — which is `--color-gold`, so `text-gold`
                  was already right. Two things were not: tracking ran 0.28em
                  where 4px on 12px is 0.333em, and there was no explicit
                  leading, so the box measured 40 instead of the frame's 18.

                  ⚠ THE 42 IS THE CARD'S BOTTOM PADDING, NOT A MARGIN HERE.
                  The frame seats this label 42 from the card's foot and 24
                  from each side — the sides are the card's own padding, the
                  foot is not. With `pb-[42px]` on the card and an 18px line
                  box, the label's top lands at 360 - 42 - 18 = 300, which is
                  the y the frame gives it. Setting it as a margin on this
                  element instead would have put the number in the wrong place
                  and left the 24/42 asymmetry looking like a mistake. */}
              <p className="eyebrow mt-auto pt-6 text-xs leading-[1.5] tracking-[0.333em] text-gold">
                → {way.label}
              </p>
            </a>
          ))}
        </CardRail>

        {/* 107 from the rail's foot to the button, same measurement pass.

            ⚠ TONE IS BURNT OCHRE — user direction, 10 September 2026, and it
            OVERRIDES THE COMPONENT PROPERTY. The Figma component at 3117:27286
            reports its `tone` as `ochre`, which I took literally and set to
            `--color-ochre` (#d69828, "Yellow Ochre — Morning Light"). August
            corrected it to Burnt Ochre, which is `--color-burnt` (#d97804,
            "Burnt Ochre — Country") — a different colour, not a synonym.

            The likely cause of the disagreement is that the component's
            variant is named for the family rather than the palette entry, so
            "ochre" there means Burnt Ochre. Do not re-derive this tone from
            the component property; it has been answered by the person whose
            palette it is.

            ⚑ AND #CB7722 IS A SEPARATE, STILL-OPEN QUESTION. V2's own
            `Colour/Burnt Ochre` is #CB7722 — the hero blob's readout says so —
            while `--color-burnt` carries the brand kit's #d97804. globals.css
            records that gap as raised and not reconciled, alongside eucalyptus
            and canvas. This button uses the token, so it moves when that
            decision does rather than hard-coding one side of it.

            size + align are the hero's, and the frame's numbers agree: label
            inset 26 from the left and 16 from the top, 24 tall, which is
            `Nav & CTA/16` at 150%. */}
        <div className="mt-16 lg:mt-[107px]">
          <BlobButton href="/connect" tone="burnt" still size="cta" align="frame">
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
        <RingArtwork piece="a" className="-left-52 top-[30%] w-[47.5rem]" />
        <RingArtwork piece="b" className="top-[8%] left-[66%] w-[56.25rem]" />
      </div>

      {/* THE FRAME'S MEASURE (2944:25996 — 1440 x 900 on #4E3524, which is
          `bg-roasted` and the 100vh the budget already gave it). The stack
          reads, section-relative: eyebrow 150 · heading 202 · body 320 ·
          container 430-730. The `lg:` margins below are those gaps — 21, 41,
          38 — rather than the 24 / 32 / 64 the build was running. */}
      <div className={`${COLUMN} relative pt-16 pb-16 lg:pt-24 lg:pb-24`}>
        <p className={EYEBROW_DARK}>{partnershipsHiFi.protocol.eyebrow}</p>
        <h2 className="headline mt-6 max-w-[1100px] text-4xl leading-[1.2] tracking-[-0.02em] sm:text-5xl lg:mt-[21px] lg:text-[4rem]">
          {protocol?.title ?? "Working with us — research protocol"}
        </h2>
        <p className="mt-8 max-w-[1000px] text-lg leading-[1.5] font-medium text-canvas/88 sm:text-2xl lg:mt-[41px]">
          {protocol?.summary}
        </p>

        {/* ⚑ THE CONTAINER IS THE FULL COLUMN, not a 900 box. The frame runs it
            x=100 to x=1340 — the same 1240 the rest of the page sits in — and
            300 tall with 40 of padding. It was `max-w-[900px]` with `lg:p-9`,
            which made the one element on the page whose whole job is to look
            like an empty space read as a narrow aside instead.

            Still drawn, never filled: the protocol does not exist, so this
            container must not either. */}
        <div
          data-placeholder="protocol-in-preparation"
          className="relative mt-12 rounded-3xl p-6 lg:mt-[38px] lg:min-h-[300px] lg:p-10"
        >
          {/* ⚑ THE STROKE IS AN SVG, NOT A CSS BORDER, and it had to become one.
              The frame gives it weight 1.5, inside, #FBAE3D at 55%, radius 24.
              `border-[1.5px]` cannot deliver that: Chrome floors border-width
              to 1px and reports 1px even at devicePixelRatio 2, so the drawn
              stroke was two device pixels where the frame asks for three — a
              third of the weight missing on the one element that is nothing
              BUT its outline. CSS also gives no control over dash length at
              all, and the frame's dashes are visibly longer than the browser
              default for a hairline.

              An SVG stroke fixes both: 1.5 renders as 1.5, and the dash is a
              number rather than a guess by the engine.

              GEOMETRY. The svg box is inset 0.75 — half the stroke — and the
              rect fills it, so a centred stroke spans 0 to 1.5 from the
              container's own edge. That is what Figma means by "Inside".
              `overflow-visible` is required or the root clips the outer half.
              `rx` is 24 minus the same 0.75.

              ⚠ REMOVING THE CSS BORDER MOVED THE CONTENT 1.5px, and in the
              right direction: the border no longer occupies layout, so `p-10`
              now puts the pill at x=140 rather than 141.5. That is the frame's
              number exactly.

              ⚠ THE DASH IS THE ONE VALUE I DO NOT HAVE. Figma's dash/gap sits
              in the advanced stroke panel, which the readout does not show, so
              10/7 is read off the export rather than quoted. Everything else
              here is a stated value. */}
          <svg
            aria-hidden
            /* ⚠ THE WIDTH AND HEIGHT ARE NOT REDUNDANT WITH THE INSET. An
               <svg> is a REPLACED element: with `width: auto` it falls back to
               its 300x150 intrinsic size no matter how many insets are set, so
               `inset-[0.75px]` alone drew a 300x150 rect in the corner rather
               than a 1240x300 one. The inset positions it; the calc sizes it. */
            className="pointer-events-none absolute inset-[0.75px] h-[calc(100%-1.5px)] w-[calc(100%-1.5px)] overflow-visible"
          >
            <rect
              width="100%"
              height="100%"
              rx="23.25"
              fill="none"
              stroke="var(--color-gold)"
              strokeOpacity="0.55"
              strokeWidth="1.5"
              strokeDasharray="10 7"
            />
          </svg>
          <SeamGlyph motif="a" className="right-6 bottom-6 hidden w-11 lg:block" />
          {/* ⚠ THE PILL IS FILLED IN THE FRAME, and the build had it outlined.
              An outlined pill inside an already-dashed container gave two
              weights of the same dashed idea and neither read as a status.

              Every value here is off the supplied export (243 x 34, rx 17):
                fill  #FBAE3D — `--color-gold`
                ink   #090E12 — `--color-charcoal`, and NOT the roasted ground
                      it sits on. I had used `text-roasted` from the section's
                      own colour, which was a guess; the export is explicit.
                rx    17 on a 34 box, so it is a true pill — `rounded-full`.
                type  12px, from the glyph paths' 8.5 cap height. 10 above and
                      11 below in the layer readout, so `py-2.5` with a 14px
                      line box lands the pill on 34.

              ⚑ RENDERED AS TEXT, NOT AS THE SVG. The export is the reference,
              not the asset — dropping it in as an image would make the one
              status label on the page uneditable at launch (D12) and unreadable
              to a screen reader. The rect and the type are reproducible from
              tokens, so they are. */}
          <p className="eyebrow inline-block rounded-full bg-gold px-4 py-2.5 text-xs leading-[14px] tracking-[0.28em] text-charcoal">
            In preparation
          </p>
          <p className="mt-6 max-w-[1120px] text-base leading-[1.5] text-canvas/85 lg:mt-9 lg:text-[22px]">
            {partnershipsHiFi.protocol.note}
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
        {/* Canvas ground, so roasted — the same off-white-on-off-white fault
            §03 carried, and the second of the two on this page. */}
        <RingArtwork
          piece="b"
          tone="roasted"
          className="top-[7%] left-[78%] w-[35rem]"
        />
      </div>

      {/* Two columns, and the split is the argument: the address is a fact
          and the action is a choice, so they sit beside each other instead of
          stacking into one long left-hand list. `items-end` sets the button on
          the address's baseline rather than floating it against the eyebrow.
          One column below lg — at 1024 the two would be 392px apiece and the
          button would sit a screen-width from the words it answers. */}
      <div className={`${COLUMN} relative grid gap-x-12 gap-y-12 pt-16 pb-16 lg:grid-cols-2 lg:items-end lg:pt-24 lg:pb-28`}>
        <div>
          <p className="eyebrow text-xl leading-[1.5] tracking-[0.08em] text-ochre sm:text-2xl">
            Where we are
          </p>

          <div className="mt-10">
            <p className="eyebrow text-xs tracking-[0.08em] text-ochre">
              {office?.label}
            </p>
            <p className="mt-2 max-w-[360px] text-base leading-[1.5] text-charcoal">
              {office?.value}
            </p>
          </div>
        </div>

        <div className="lg:justify-self-end">
          {/* OXIDE RED, matching the frame — user direction, 10 September 2026.

              ⚑ THIS REVERSES A CALL MADE MINUTES EARLIER in the same session,
              and the history is kept because the earlier note said the
              opposite in strong terms. August first ruled that the built
              page's Burnt Ochre read better than the frame's `rust` and should
              stand; the call was then reversed to follow the frame. Oxide is
              the current instruction — the previous "do not correct this back
              to oxide" is void, not advice to weigh.

              `--color-oxide` is #af231c, which is exactly the fill the supplied
              264 export carries, so shape and tone now agree on one hex.

              ⚠ IT IS THE ONLY NON-BURNT BLOB ON THE PAGE. The hero and Ways in
              buttons stay Burnt Ochre per their own readouts, so a reviewer
              seeing three blobs in two colours is looking at the frames, not
              at a drift.

              The label follows the same readout — inset 26 from the left and
              16 from the top, the 24-tall `Nav & CTA/16` the other two carry.
              That was the last button still running a 12px centred label.

              ⚑ AND THE WIDTH IS THE FRAME'S 264. This was raised as
              unreconciled an hour earlier — the code had only the 276 export,
              so a narrow instance would have meant stretching that mask down
              12px and squashing Marc's wobble. August then supplied the 264
              cut, so it is a real second shape now: `shape="narrow"` picks both
              the width and its own mask. See BLOB_SHAPE in Furniture.tsx for
              why the two are not one scaled. */}
          <BlobButton
            href="/connect"
            tone="oxide"
            still
            size="cta"
            align="frame"
            shape="narrow"
          >
            Get in touch →
          </BlobButton>
        </div>
      </div>
    </section>
  );
}
