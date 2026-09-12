import { photoById } from "@/content/kit";
import {
  aboutHero,
  howWeWork,
  partners,
  thePeople,
  whatWeAre,
  whatWeDo,
  whoDecides,
  whyWeExist,
} from "@/content/about";
import { contactRoutes } from "@/content/contact";
import { ContactDetails } from "@/components/sections/ContactDetails";
import { ContactDoors } from "@/components/sections/ContactDoors";
import { CardRail } from "@/components/ui/CardRail";
import { MediaOrField } from "@/components/ui/MediaOrField";
import {
  DottedRule,
  RingArtwork,
  SeamGlyph,
  WaveDivider,
} from "@/components/ui/Furniture";
import type { SeamGlyphMotif } from "@/components/ui/Furniture";

/**
 * /about — "About YACHATDAC", at hi-fi weight.
 * Figma 2653:19666 (05 · About — HI-FI · Desktop · the page answers),
 * 1440 x 18,474px = 2,053vh across eleven frames. The verb is ANSWERS.
 *
 *   01  Hero — the escarpment, and three figures for scale
 *   02  What we are — the name, the road, and the register
 *   03  WHY WE EXIST — the question everything is measured against
 *   03b BREATH — one photograph, no words
 *   04  What we do — four things on the artist's spiral
 *   05  How we work — three values, and a held photograph before the third
 *   06  Who decides — the sentence that keeps qualifying itself
 *   07  The people — two frames and one absence
 *   08  Partners — names, not logos
 *   09  Get in touch — four doors
 *   10  Footer — already built to Marc's styling; the page declares its ground
 *
 * ⚠ THE SEAM PASS IS BUILT; THE INTERIORS ARE NOT. `./Motion.tsx` wires the
 * ten section joins of Figma `REF · SCORE · 05 ABOUT` (2642:19666) — the five
 * waves, the drawn rules, §06's overlap out, §09's doors — plus the X4
 * baseline arrivals, and nothing further. The `data-ab*` hooks below are that
 * contract. §03's 300vh pin, IMG-03, the animated ground ramp and every other
 * section interior stay unbuilt; `docs/motion/scenes.md:331-390` is their
 * ledger and the interiors pass builds from it, whole, not piecemeal. Group G
 * (the traveller) is entirely unbuilt — every placement is ▲ Leonard
 * Mickelo's to approve — and only named comments mark where its legs attach.
 *
 * REST STATE IS THE FINISHED STATE. Where the frame draws a thing mid-effect,
 * this renders the end of that effect, which is what the frame itself draws.
 *
 * ⚠ WHAT IS HELD ON THIS PAGE, and why each renders the way it does:
 *
 *   · R15 — the legal name is unconfirmed. The logo and the published research
 *     differ on Yambangku / Yumbangku, and ICN and ABN are both blank. §02
 *     sets the long name as the frame does and carries the draft's own note.
 *   · R22 — reciprocity is framed as Ngapartji-Ngapartji, which is Western
 *     Desert language, not Iningai. The draft raises this against itself.
 *   · R12 — no approved partner logo files exist and the draft asks whether
 *     each partnership is still active. §08 is names, never logos.
 *   · R9 / R15 — every contact field is the drafter's square bracket. None
 *     becomes a live mailto: or tel:.
 *   · TENSE — the Elder Advisory Group is not sitting. §06 stays future tense
 *     and its sentence is the one clause on the page held at full strength.
 *   · R24 — §07's two portraits are of people who have not been asked whether
 *     they may be identified. Both carry the marker in the markup.
 *   · CR10 — "bought back for our people" is held. It is a comment in
 *     `src/content/about.ts` and stays one; the sentence renders unedited.
 *
 * WORDS COME FROM `src/content/about.ts` AND `src/content/contact.ts`, never
 * retyped here. Where the frame splits one authored paragraph across two type
 * sizes, this derives the split from the string rather than restating it — see
 * `sentences()` below and each section's note.
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
 * The column. Every body in the frame measures at x=100 of 1440, so the
 * padding alone is the column — `lg:px-25` and NO max-width. Adding
 * `mx-auto max-w-7xl` centres a 1280 box in 1440 and lands content at x=180,
 * which is the mistake The Record already made and documented.
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

/** boomerang, circle, starburst — the frame's rotation, in repo glyph names. */
const CARD_GLYPHS: SeamGlyphMotif[] = ["c", "a", "b"];

/**
 * Split an authored paragraph into its sentences.
 *
 * Several frames set the first sentence of a paragraph at display size and the
 * rest at body size — the page's documented headline convention, where a
 * headline is "the draft's own opening sentence, lifted out of the paragraph
 * that follows" (`docs/design/lofi-spec.md:491`). Deriving that split from the
 * source string is the difference between rendering the content module and
 * transcribing it: if the draft is revised, the headline follows.
 *
 * Naive on purpose. No sentence in `about.ts` contains an abbreviation, a
 * decimal or an ellipsis, which is the only reason a split on "." is safe
 * here. It is not a general-purpose tokeniser and should not become one.
 */
const sentences = (para: string): string[] =>
  para.match(/[^.]+\./g)?.map((s) => s.trim()) ?? [para];

const HERO = photoById("about-hero");
const ROAD = photoById("about-road");
const QUESTION = photoById("country-wide");
const BREATH = photoById("about-breath");
const RECIPROCITY = photoById("about-reciprocity");
const PEOPLE_A = photoById("about-suzanne");
const PEOPLE_B = photoById("about-people-02");

/* -------------------------------------------------------------------------
   01 · Hero — the escarpment, and three figures for scale · 110vh
   ------------------------------------------------------------------------- */

/**
 * A full-bleed photograph under a left-weighted scrim, with the page's name at
 * 96 over it. The picture is doing an argument's work: the cliff takes the
 * upper two-thirds and the three people in it are about 5% of the frame each,
 * so scale is the subject and nobody is identifiable (batch-2.md:349).
 *
 * TWO SCRIMS, both from the frame. The first is horizontal and carries the
 * copy's contrast — measured against the brightest frame so type clears 4.5:1.
 * The second is a soft horizontal band behind the copy block only, which is
 * what stops the standfirst sitting on open rubble.
 *
 * `Dots / Trail` is the Guide's road (group G, ▲ Leonard Mickelo). On a static
 * page it is what it is on the canvas: artwork, placed where the frame places
 * it, at the rotation and opacity the frame gives it. It does not travel.
 */
export function AboutHero() {
  return (
    <section data-ab="hero" data-nav-hero className="relative bg-charcoal text-canvas">
      {/* Flex-centred, not absolutely centred. The copy is a flow child, so a
          short viewport makes this block taller instead of clipping the
          standfirst — `min-h` can only grow for content that is in the flow. */}
      {/* 990px of an 18,474px frame that runs at 9px per vh — so the hero is
          110vh, not the round 100 it was. `min-h` rather than `h`: the copy is
          a flow child, so a short viewport grows the block instead of clipping
          the standfirst. */}
      <div className="relative flex min-h-[86svh] w-full flex-col justify-end overflow-hidden lg:min-h-[110svh] lg:justify-center">
        <div
          data-motion={HERO?.grade ?? "full"}
          className="absolute inset-0"
        >
          <MediaOrField
            src={HERO?.src ?? null}
            alt="Three figures on a ledge beneath a long banded sandstone escarpment"
            sizes="(min-width: 1024px) 100vw, 260vw"
            priority
            fieldClass="bg-charcoal"
          />
        </div>

        {/* X5 · left-weighted, so the copy side is the dark side. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(9,14,18,0.88) 0%, rgba(9,14,18,0.62) 42%, rgba(9,14,18,0.12) 78%, rgba(9,14,18,0) 100%)",
          }}
        />
        {/* X5 band · under the copy block only. */}
        <div
          aria-hidden
          className="absolute inset-0 lg:top-[38%] lg:bottom-auto lg:h-[37%]"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(9,14,18,0) 0%, rgba(9,14,18,0.34) 35%, rgba(9,14,18,0.34) 70%, rgba(9,14,18,0) 100%)",
          }}
        />

        {/* The Guide's road. Decorative — the page's own words carry the
            meaning, so it is hidden from the accessibility tree. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
        <img
          aria-hidden
          src="/artwork/dots-trail.svg"
          alt=""
          className="pointer-events-none absolute top-[15%] left-[10%] hidden w-[57%] rotate-4 opacity-60 lg:block"
        />

        <div className={`${COLUMN} relative py-16 lg:py-24`}>
          <p
            data-arrive
            className="eyebrow text-base leading-[1.5] tracking-[0.08em] text-gold sm:text-2xl"
          >
            {aboutHero.eyebrow}
          </p>
          <h1
            data-arrive
            /* `text-h1` since 11 Sep 2026 — the site-wide scale, replacing a
               56/72/80 ladder of its own. The token carries the sheet's 120%
               leading, so the local `leading-[1.2]` went with it. */
            className="headline mt-4 max-w-[1100px] text-h1"
          >
            {aboutHero.title}
          </h1>
          <p
            data-arrive
            className="mt-8 max-w-[900px] text-lg leading-[1.5] font-medium sm:text-2xl"
          >
            {aboutHero.standfirst}
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   02 · What we are — the name, the road, and the register · 300vh held
   ------------------------------------------------------------------------- */

/**
 * ⚠ THE REGISTER PASS IS BUILT (12 September 2026, user direction). This was
 * three passive screens read by scrolling past them; it is now ONE held screen
 * running the sequence Figma `2632:19655` has specified all along — `REF ·
 * 05 ABOUT §02 THE REGISTER — the facts arrive one at a time · 6 FRAMES`. The
 * beats are `theRegister` in src/lib/motion/recipes-about.ts; the held layout
 * is ./about.css, which §03 already uses. Read both before changing markup.
 *
 * THE BOARD'S ARGUMENT, because it is the reason the section exists in this
 * shape: "The lo-fi draws four fact cards side by side, which means the reader
 * meets nine pieces of information at once and reads none of them. Here each
 * one arrives on its own, at size, and folds down into the register as the
 * next one comes up. Nothing is lost — the reader met every fact singly and
 * the record is still a readable index at the end."
 *
 * HOW THE SEQUENCE READS. The legal name arrives as noise and resolves into
 * itself, then dims as the short name settles under it — which is the copy's
 * own joke, since the draft sets the full name and then says most people say
 * YACHATDAC. The two paragraphs settle line by line and the screen clears to a
 * single dimmed recap. Then the road opens full bleed at the top of the
 * screen, the ochre thread draws, and each of the four facts takes the screen
 * ALONE at heading scale before folding down into the register — which is the
 * table below, arriving one row at a time. The road gives up its height to the
 * table as it fills.
 *
 * ⚠ THE BOARD SAYS "NO PIN, NO SCRUB" AND IS OVERRULED. Its own note reads
 * "230vh, and deliberately NOT pinned … the scroll is never taken away, so a
 * researcher can leave at any point and the register still reads". Held on
 * user direction, 12 September 2026. The objection is answered rather than
 * ignored: below `deck:` (1024 × 820), under reduced motion and with
 * JavaScript off none of this applies and the section is exactly the document
 * it was — the register the note is protecting. That is also the second held
 * screen on a page the grammar budgets one pin for; flagged for sign-off in
 * scenes.md alongside the deck's own deviation.
 *
 * ⚠ R15's NOTE IS IN BOARD FRAME 06 AND IS NOT BUILT. The editorial notes came
 * off /about on 11 September 2026; `whatWeAre.pending` and STATUS.md are the
 * record instead. The board predates that.
 *
 * ⚠ NO CLIP OF ANY KIND ON THIS SECTION — not `overflow-hidden`, and not
 * `overflow-clip` either. TWO separate reasons, and conflating them deleted
 * the seam wave once already (12 September 2026):
 *
 *   · the Wave / Divider below is seated `overhang`, which pulls it entirely
 *     ABOVE this section's own box so it lands on the hero photograph. ANY
 *     overflow clipping removes it — `clip` no less than `hidden`, since both
 *     clip; `clip` only differs in not creating a scroll container.
 *   · `overflow-hidden` would additionally make the section a scroll container,
 *     and `position: sticky` inside it would then never stick.
 *
 * §03 takes `overflow-clip` because it has rings to clip and no overhanging
 * wave. This section has the opposite pair, so the ring is clipped on its own
 * layer instead — it needs it, being 1000px at left-54% — and the section
 * itself clips nothing.
 */
export function WhatWeAre() {
  const [legalName, shortName] = (() => {
    const first = whatWeAre.body[0];
    const cut = first.indexOf(". ");
    return [first.slice(0, cut + 1), first.slice(cut + 2)];
  })();

  /**
   * The recap — what has been read, held at 0.28 while the facts take the
   * screen (board frames 04–06).
   *
   * DERIVED, NOT AUTHORED. The board draws a line that is not in the draft, so
   * it is composed here from strings that are: the short name, and the first
   * sentence of the last paragraph. D5 keeps copy in `src/content/about.ts`
   * and this adds nothing to it — the same move the legal-name split above
   * makes, and what `sentences()` exists for. A reviewer still reads it as a
   * sentence, so it is flagged rather than buried.
   */
  const recap = `${shortName} · ${sentences(whatWeAre.body[2])[0]}`;

  return (
    <section data-ab="what-we-are" className="relative bg-canvas text-charcoal">
      {/* Seam 01 → 02 · Wave / Divider · OFF-WHITE. "The cliff's horizontal
          banding becomes the register's rules." The Guide's departure (G1,
          ▲ Leonard Mickelo) would leave from here; not built. */}
      <WaveDivider ground="var(--color-canvas)" hook="wave" />

      {/* THE HELD SCREEN. A plain wrapper until ./about.css makes it a sticky
          grid; in flow it adds nothing and the children below simply stack in
          the order they are written, which is the document this replaces.

          ⚠ THE DOM ORDER IS THE FLOW ORDER, AND THE HELD ORDER IS THE GRID'S.
          Written out, this reads heading → the name → the road → the register,
          which is what the frame draws and what the fallback has to be. Held,
          the road is lifted to the first grid row so it can come in OVER the
          heading and push it down; see about.css. Nothing is reordered in the
          DOM to achieve that, so the reading order and the tab order are the
          frame's in both builds. */}
      <div data-ab-stage>
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <RingArtwork
            piece="b"
            tone="roasted"
            className="top-[14%] left-[54%] w-[62.5rem] rotate-7 opacity-[0.08]"
          />
        </div>

        {/* THE ONE HEADING, and it never leaves (user direction, 12 September
            2026: "What we are header retains"). It is the fixed point the
            whole section turns around — the name resolves under it, the copy
            clears from under it, the road arrives over it and pushes it down,
            and the register writes itself under it.

            ⚠ ITS TRAVEL GOES ON THE WRAPPER. The heading itself must stay free
            of inline transforms or the stylesheet's travel loses to them —
            the same collision the register index hit. Nothing animates the
            wrapper; nothing but the stylesheet writes its transform. */}
        <div data-ab2-headwrap className={`${COLUMN} relative pt-16 lg:pt-28`}>
          <p
            data-ab-eyebrow
            className="eyebrow text-base leading-[1.5] tracking-[0.08em] sm:text-2xl"
          >
            {whatWeAre.title}
          </p>
        </div>

        {/* ---- the name ---------------------------------------------------
            Clears whole when the road arrives. Faded as a BLOCK rather than
            line by line: its three children each already own a split, and a
            second split beat on any of them would orphan the first one's line
            nodes — see the note at `freshSplit`. */}
        <div data-ab2-block="name" className={`${COLUMN} relative pt-8 lg:pt-10`}>
          {/* THE NAME, UNRESOLVED. The run this decodes is `aria-hidden` and
              the real string is the paragraph's `aria-label`, so assistive
              tech never reads the scramble — the contract SplitText's
              `aria: "auto"` gives every other split on this page. With
              JavaScript off the span simply renders the name. */}
          <p
            aria-label={legalName}
            className="headline max-w-[1240px] text-4xl leading-[1.2] text-evergreen/30 sm:text-5xl lg:text-[3.5rem]"
          >
            <span data-ab2-decode aria-hidden="true">
              {legalName}
            </span>
          </p>
          <p
            data-ab2-short
            className="headline mt-6 max-w-[1240px] text-4xl leading-[1.2] text-evergreen sm:text-6xl lg:text-[5rem]"
          >
            {shortName}
          </p>

          <p
            data-ab2-body
            className="mt-16 max-w-[780px] text-lg leading-[1.5] font-medium text-charcoal/92 sm:text-2xl"
          >
            {whatWeAre.body[1]}
          </p>
          <p
            data-ab2-body
            className="mt-8 max-w-[780px] text-lg leading-[1.5] font-medium text-charcoal/92 sm:text-2xl"
          >
            {whatWeAre.body[2]}
          </p>
        </div>

        {/* ---- the road ---------------------------------------------------
            ⚠ ONE VARIABLE RUNS THIS BOTH WAYS. `--ab2-fold` is 1 when the band
            is closed and 0 when it stands at full height, and it does the
            arrival and the collapse with the same three tweens: the frame's
            clip, the plane inside it, and the travel of everything below.

            Arriving, it runs 1 → 0: the band opens downward from its own top
            edge while the heading and the copy under it travel DOWN out of the
            way, so the picture reads as sliding in over the heading and
            pushing it down (user direction, 12 September 2026). Collapsing, it
            runs 0 → 1 across the four register rows and everything travels
            back up into the space. The plane counter-travels throughout, which
            is what keeps the BOTTOM of the photograph — and the vehicle on the
            track — in frame the whole way. Height is never animated. */}
        <figure data-ab-road className="relative">
          <div data-ab2-band className="relative h-[44svh] w-full overflow-hidden lg:h-[52svh]">
            <div
              data-media
              data-ab2-plane
              data-motion={ROAD?.grade ?? "full"}
              className="absolute inset-0"
            >
              <MediaOrField
                src={ROAD?.src ?? null}
                /* The vehicle is named because the crop brings it into frame;
                   `kit.ts` has recorded it as the subject all along ("one
                   vehicle at the end — no people"). */
                alt="An aerial view down a sandy two-wheel track through low bushland, a single vehicle stopped on it"
                sizes="(min-width: 1024px) 100vw, 260vw"
                /* The plane is 2.70:1 and the photograph 1.78:1, so
                   `object-cover` discards ~178px at each edge, and the centred
                   default cut the near end of the track — including the
                   vehicle, which is the thing that gives the aerial its scale.
                   Anchored to the bottom on user direction, 11 September 2026,
                   and the fold above is built to keep that end visible. */
                className="object-cover object-bottom"
                fieldClass="bg-roasted/40"
              />
            </div>
          </div>
          <figcaption
            data-ab2-caption
            className={`${COLUMN} mt-4 text-base leading-[1.5] text-roasted`}
          >
            The way in. Turraburra is 120km north of Barcaldine.
          </figcaption>
        </figure>

        {/* ---- the register ----------------------------------------------- */}
        <div
          data-ab2-block="register"
          className={`${COLUMN} relative pt-6 pb-16 lg:pt-8 lg:pb-28`}
        >
          {/* What has been read. Derived — see `recap` above. */}
          <p
            data-ab2-recap
            className="max-w-[1240px] text-base leading-[1.5] text-charcoal/28 sm:text-lg"
          >
            {recap}
          </p>

          {/* The thread enters. Ochre reads 2.30:1 on canvas, so on this
              ground it is a line and never a word. */}
          <div aria-hidden data-ab2-rule className="mt-8 h-[3px] w-full bg-ochre" />

          {/* ⚠ THE CLOSING TRAVEL GOES ON THIS WRAPPER, NOT ON ITS CHILDREN.
              The register closes over the presenter's reserved height with a
              CSS transform, and the head inside it takes a GSAP arrival that
              writes `transform` INLINE — inline beats a stylesheet, so the
              head stood still while the table slid up underneath it and the
              two collided (caught on screen, 12 September 2026). A wrapper no
              tween touches keeps one writer per property. */}
          {/* THE REGISTER, AND THE ONE FACT CURRENTLY AT SIZE.

              ⚠ THE TABLE APPENDS (user direction, 12 September 2026). The fact
              being read is not a block sitting ABOVE the table — it stands in
              its OWN ROW'S PLACE, at heading scale, directly under the rows
              that have already settled, and then collapses into that row. The
              next fact appears in the slot below it. What the reader sees is a
              table writing itself one line at a time, which is the board's
              "folds down into the register as the next one comes up" read
              literally rather than as a hand-off between two places.

              The presenter is positioned ABSOLUTELY against this wrapper and
              travelled to each row's own offset, which is why the wrapper is
              the positioning context. Absolute also means it costs no layout:
              the rows beneath are present and merely invisible, so nothing
              reflows as the facts advance and the table is measured once. */}
          <div data-ab2-index className="relative">
            <p
              data-ab2-register-head
              className="eyebrow mt-5 text-xs tracking-[0.08em] text-roasted/70"
            >
              Registered with
            </p>

            <dl data-ab2-register className="mt-8 border-t border-charcoal/14">
              {whatWeAre.facts.map((fact) => (
                <div
                  key={fact.label}
                  data-ab2-row
                  className="grid gap-2 border-b border-charcoal/14 py-7 lg:grid-cols-[300px_1fr] lg:gap-10"
                >
                  <dt className="eyebrow text-xs tracking-[0.08em] text-burnt">
                    {fact.label}
                  </dt>
                  <dd className="headline text-xl leading-[1.19] text-evergreen sm:text-[2rem]">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* A SECOND rendering of copy the table already carries, so it is
                hidden from the accessibility tree exactly as §04's connectors
                are: a reader using a screen reader meets each fact once, in the
                table. Absent entirely in flow, where the table alone is the
                section. `pt-7` matches the row's own top padding so the big
                value seats on the same baseline the small one will. */}
            <div data-ab2-presenter aria-hidden className="absolute inset-x-0 top-0">
              {whatWeAre.facts.map((fact) => (
                <div
                  key={fact.label}
                  data-ab2-fact
                  className="absolute inset-x-0 top-0 pt-7"
                >
                  <p className="eyebrow text-xs tracking-[0.08em] text-burnt">
                    {fact.label}
                  </p>
                  <p className="headline mt-3 max-w-[1100px] text-3xl leading-[1.15] text-evergreen sm:text-[2.5rem]">
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* The seam. This rule runs past the column and becomes §03's.
          Seam 02 → 03 · "ground sweep, scrubbed — the last fact rule extends
          and becomes the quote rule." The extension is the scrub; the quote
          rule's echo lives in §03. G1 flies this leg (▲ Leonard Mickelo);
          not built. */}
      <div
        aria-hidden
        data-ab-rule="seam-out"
        className="absolute right-0 bottom-0 left-6 h-[3px] bg-ochre lg:left-25"
      />
    </section>
  );
}

/* -------------------------------------------------------------------------
   03 · WHY WE EXIST — ⚑ the question · 300vh held against 235vh drawn
   ------------------------------------------------------------------------- */

/**
 * The page's argument, and the section everything else is measured against.
 *
 * ⚠ THE INTERIORS PASS IS BUILT (12 September 2026, user direction). This was
 * two stacked screens read one after the other; it is now ONE held screen and
 * the frame's own sequence runs across it — Figma 2653:19669, "03 · Why we
 * exist — ⚑ THE QUESTION · PINNED 300vh · the ground goes out under it". The
 * beats are `theQuestion` in src/lib/motion/recipes-about.ts; the held layout
 * is ./about.css. Read both before changing the markup, because the two are
 * coupled through the `data-ab-*` hooks below and through one flag.
 *
 * HOW THE SEQUENCE READS. The first claim is read and then LEAVES upward past
 * the heading; the second takes its exact place, is read, and leaves the same
 * way. Underneath all of that the ground goes out from the foot up, taking the
 * photograph with it — and the heading goes with the ground (user direction,
 * 12 September 2026), so by the time the question is asked there is nothing on
 * the screen at all. The question settles by line mask on bare charcoal, the
 * ochre rule draws, the attribution arrives after it, and the tagline is the
 * last thing said before the Breath.
 *
 * ⚠ REST STATE IS STILL THE FINISHED STATE, and it is the same document as
 * before. Everything held is gated on ONE attribute that `theQuestion` writes
 * (`data-ab-held`); without it this section is ordinary flow — two screens,
 * every word present, the static ground ramp below doing the work the rising
 * front does when held. That covers JavaScript off, prefers-reduced-motion,
 * and a window too small or too short to hold a screen, as one state.
 *
 * ⚠ NO `overflow-hidden` ON THIS SECTION — it must be `overflow-clip`. Hidden
 * makes the section a scroll container and `position: sticky` inside it then
 * never sticks. See the note at the head of ./about.css.
 *
 * ⚠ THE ONE BARE GROUND ON THE PAGE, and it is deliberate. Every other section
 * carries the artist's rings behind it; here the question sits on charcoal
 * with nothing behind it at all, because anything behind it would be something
 * else to look at. The rings are placed under the rising front rather than
 * faded separately — the ground takes them the way it takes the photograph,
 * which is one mechanism instead of two.
 *
 * THE CLAIMS ARE NOT TESTIMONY. The frame notes both of them as "undims (Y2)",
 * and that is not built: Y2 is the `dim` row, "a person speaking", and the
 * grammar's variants table holds its one non-testimony use to Truth §15B. These
 * are the corporation's own sentences about itself, so they arrive and leave on
 * the type rows instead. Raised rather than reconciled.
 *
 * The quote is the client's, from the Foreword to the Ten Year Strategic Plan,
 * and the attribution says so. It is never set as testimony and never split
 * below the line.
 */
export function WhyWeExist() {
  return (
    <section
      data-ab="why-we-exist"
      className="relative overflow-clip"
      style={{
        backgroundImage:
          "linear-gradient(180deg, #f6f6ec 0%, #f1f0e5 26%, #22372b 36%, #090e12 43%, #090e12 100%)",
      }}
    >
      {/* THE HELD SCREEN. A plain wrapper until ./about.css makes it a sticky
          one-cell grid; in flow it adds nothing and the two screens below
          simply stack, which is the build this replaced. */}
      <div data-ab-stage>
        {/* ---- the claims screen ------------------------------------------
            THE CLAIMS ARE READ ON COUNTRY. The photograph fills exactly this
            block and no more — held, it is the screen; in flow it is a full
            slide of its own, and either way the question below can never
            reach it. */}
        <div
          data-ab-screen="claims"
          className="relative min-h-[100svh] lg:min-h-[130svh]"
        >
          <div
            data-ab-plate
            data-motion={QUESTION?.grade ?? "full"}
            /* 70, not the flow build's 50. Held, this photograph is a whole
               screen rather than the top of a tall block, and at 50 under the
               scrim below it read as a tint of Country instead of Country. The
               claims still clear their ratio — the scrim carries that, and it
               was lightened to match. */
            className="absolute inset-0 opacity-70"
          >
            <MediaOrField
              src={QUESTION?.src ?? null}
              alt="Open Country, wide — mulga running to the horizon"
              sizes="(min-width: 1024px) 100vw, 260vw"
              fieldClass="bg-evergreen/40"
            />
          </div>

          {/* The legibility scrim, and only that: constant, so the charcoal
              claims clear their ratio on the photograph at every point of the
              sequence. It used to carry the coming-apart as well; held, that
              job belongs to the rising front. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(246,246,236,0.52) 0%, rgba(241,240,229,0.34) 100%)",
            }}
          />

          {/* THE COMING-APART, flow build only. Light through 60%, evergreen
              at 82%, charcoal by 96% — so on a 130svh block the first dark
              pixel is below the arrival screen's fold. Hidden the moment the
              section is held, where the front below replaces it. */}
          <div
            aria-hidden
            data-ab-scrim="flow"
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(246,246,236,0) 0%, rgba(241,240,229,0.15) 60%, rgba(34,55,43,0.92) 82%, #090e12 96%, #090e12 100%)",
            }}
          />

          {/* THE GROUND GOING OUT, held build only. One rising front, driven
              by a single custom property. Above the plate so it takes the
              photograph; below the column so the type is never under it. */}
          <div aria-hidden data-ab-ground className="absolute inset-0" />

          {/* THE ARTIST'S RINGS, static at 30% as the frame draws them.

              ⚠ ABOVE THE FRONT, NOT BELOW IT, AND THE ASSET DECIDES THAT.
              `RingArtwork` ships in Ground/Off-White — its own comment says
              "invisible ON canvas" — so on the light half of this section
              there is nothing to see whichever side of the front they sit.
              They are ground for the DARK state: as the front rises past them
              they emerge out of it, which is the reading asked for on
              12 September 2026 ("a background for when the colour turns
              dark"). Under the front they were simply never visible at all,
              and before that, on the stage, they sat beneath a screen painting
              an opaque canvas ground.

              ⚠ AND THIS RUNS AGAINST THE BARE-GROUND NOTE at the head of the
              section, which says the question is asked on charcoal with
              nothing behind it. Held as ONE screen the question is centred,
              and ring B is 900px tall — there is no "high and low, clear of
              the question's band" left to place them in. Flagged rather than
              settled: if the bare ground wins, these come out of the held
              build entirely and stay in the flow one. */}
          <RingArtwork
            piece="b"
            className="top-[4%] left-[64%] w-[56.25rem] opacity-30"
          />
          <RingArtwork
            piece="a"
            className="-left-48 top-[54%] w-[40rem] opacity-30"
          />

          <div className={`${COLUMN} relative pt-16 pb-[22svh] lg:pt-24 lg:pb-[22svh]`}>
            <p
              data-arrive
              data-ab-eyebrow
              className="eyebrow text-base leading-[1.5] tracking-[0.08em] sm:text-2xl"
            >
              {whyWeExist.title}
            </p>
            {/* Both claims in one wrapper so the second can replace the first
                in place when held. No `data-arrive` on either — they are
                scrub-driven now, and the baseline arrival would fight the
                sequence for the same opacity. */}
            <div data-ab-claims className="mt-10">
              <p
                data-ab-claim
                className="max-w-[940px] text-lg leading-[1.5] font-medium text-charcoal/90 sm:text-2xl"
              >
                {whyWeExist.body[0]}
              </p>
              <p
                data-ab-claim
                className="mt-10 max-w-[940px] text-lg leading-[1.5] font-medium text-charcoal/90 sm:text-2xl"
              >
                {whyWeExist.body[1]}
              </p>
            </div>
          </div>
        </div>

        {/* ---- the answer screen ------------------------------------------
            The screen has cleared. Nothing behind the question but ground, at
            the ramp's display size — the page's argument at the scale
            ART-DIRECTION.md always meant for it ("at full scale, on a pinned
            screen"). */}
        <div
          data-ab-screen="answer"
          className={`${COLUMN} relative flex min-h-[100svh] flex-col justify-center pb-16 lg:pb-28`}
        >
          <blockquote>
            <p
              data-ab-question
              className="headline max-w-[1240px] text-4xl leading-[1.2] text-canvas sm:text-6xl lg:text-[6rem]"
            >
              {whyWeExist.quote}
            </p>
            {/* The question contracts into this. The thread starts here and
                runs to §09, where it arrives. Seam 02 → 03's echo: the same
                ochre line §02 extended, redrawn under the question, and it
                draws left to right as the question lands. */}
            <div
              aria-hidden
              data-ab-rule="quote"
              className="mt-14 h-[3px] w-[26.5rem] max-w-full bg-ochre"
            />
            <footer
              data-ab-attribution
              className="mt-4 max-w-[900px] text-base leading-[1.5] text-canvas/72"
            >
              {whyWeExist.attribution}
            </footer>
          </blockquote>

          <p
            data-ab-tagline
            className="mt-14 max-w-[940px] text-lg leading-[1.5] font-medium text-canvas/90 sm:text-2xl lg:mt-14"
          >
            {whyWeExist.tagline}
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   03b · BREATH — one photograph, no words · 55vh
   ------------------------------------------------------------------------- */

/**
 * No caption, by design. A caption would make a breath an illustration, and
 * the point of a rest scene is that there is nothing to do with it. The frame
 * holds the picture — no push-in, no scrub, no grade — which on a static page
 * is simply what a photograph does.
 */
export function Breath() {
  return (
    // Seam 03 → 03b is the page's hard cut — "nothing carries; that is the
    // point" (REF · SCORE · 05). It gates like every deck seam (user
    // direction, 8 Sep) but carries no wave and no rule: the cut survives
    // as this section's charcoal covering §03's. The Guide does not enter
    // this section.
    //
    // ⚠ A SHORT SLIDE, DELIBERATELY (user direction, 8 Sep). Its gate starts
    // at "top top" — coverSeams treats any outgoing slide shorter than the
    // viewport that way — so the photograph rises, stops AT the top of the
    // page, and only there does §04's transition play. §04 follows the
    // photograph directly in flow, wave on its crest, the whole way up: "the
    // photograph's horizon becomes the loop's baseline" (REF · SCORE · 05).
    // An earlier 100svh-of-charcoal version parked blank ground between the
    // picture and §04; the padding came out and the gate geometry moved
    // instead.
    <section data-ab="breath" className="relative bg-charcoal">
      <div
        data-media
        data-motion={BREATH?.grade ?? "full"}
        className="relative h-[55svh] w-full overflow-hidden"
      >
        <MediaOrField
          src={BREATH?.src ?? null}
          alt="Open woodland at sunset, the sun low behind the trunks"
          sizes="(min-width: 1024px) 100vw, 260vw"
          fieldClass="bg-evergreen/40"
        />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   04 · What we do — four things on the artist's spiral · 265vh
   ------------------------------------------------------------------------- */

/**
 * THE LOOP. The lede is a chain — if Country is not cared for there is nothing
 * to harvest, and so on — and the section draws it: four cards set around the
 * artist's spiral in a diamond, with the lede's own clauses set between them
 * as the connectors. The fourth connector carries no words, because the loop
 * closes back onto the first card and saying so would be saying it twice.
 *
 * The connectors are the lede verbatim, and the lede is already rendered in
 * full above them — so they are decorative repetition and are hidden from the
 * accessibility tree and from narrow screens, where the diamond becomes a
 * stack and a connector between two stacked cards would mean nothing.
 *
 * ⚠ THE CARD IS `04 · The Record` §02's, not a new one: coloured ground, image
 * band across the full width, a 35% scrim, the artist's motif, then title,
 * body and a verb-led label. Each ground is a literal class — `bg-${x}`
 * compiles to nothing.
 *
 * ⚠ CARDS 2, 3 AND 4 HAD UNNAMED IMAGE LAYERS — the only unnamed fills on the
 * page. Their masters were identified by matching the frame's own exported
 * fills against every original in the three batches, not chosen: March22-1521,
 * March22-1641 and 378A7604_1.65.1, all exact signature matches. See the note
 * in `src/content/kit.ts`.
 *
 * ⚠ NO `overflow-hidden` ON THIS SECTION — it carries the BREATH's wave, and
 * the wave is pulled entirely above the section's own box so it lands on the
 * photograph. A clip here deletes it.
 */
const AREA_PHOTOS = [
  "about-fire",
  "about-ochre",
  "about-walking",
  "work-seed",
] as const;

const AREA_GROUNDS = [
  "bg-evergreen",
  "bg-roasted",
  "bg-charcoal",
  "bg-midnight",
] as const;

export function WhatWeDo() {
  /* `whatWeDo.title` is the eyebrow; the headline is the lede's own opening
     sentence, lifted out of the paragraph that follows — the page's headline
     convention. What is left of the lede is the chain. */
  const [headline, ...chain] = sentences(whatWeDo.lede);
  const lede = chain.join(" ");

  /**
   * The chain, split into its clauses WITH their punctuation kept.
   *
   * The draft's sentence is three clauses joined by semicolons, and the board
   * sets each one on the spiral beside the card it names. Splitting on the
   * semicolon and putting the separator back means the paragraph below renders
   * character-for-character as it always did — one sentence, not three — while
   * each clause is still an element the sequence can move. D5 holds: nothing is
   * retyped here and nothing new enters `src/content/about.ts`.
   *
   * Three clauses, four cards. The fourth position is drawn and left empty,
   * because the draft has three clauses and a fourth would be invented.
   */
  const clauses = lede
    .split(";")
    .map((part, i, all) => (i < all.length - 1 ? `${part.trim()}; ` : part.trim()))
    .filter(Boolean);

  return (
    <section data-ab="what-we-do" className="relative bg-canvas text-charcoal">
      {/* Figma 2668:20274 — seated on the BREATH photograph, not under it, so
          the photograph's horizon becomes the baseline this section sits on.
          Seam 03b → 04 · Wave / Divider · OFF-WHITE. "The photograph's horizon
          becomes the loop's baseline." The trail re-entering and forking into
          four is the Guide's (▲ Leonard Mickelo); not built. */}
      <WaveDivider ground="var(--color-canvas)" hook="wave" />

      {/* THE HELD SCREEN. A plain wrapper until ./about.css makes it a sticky
          one, and in flow it adds nothing: the head, the lede and the card rail
          below simply stack, which is the document this replaces. */}
      <div data-ab-stage>
        {/* THE GROUND GOING ROASTED, held build only. §04 → §05 is the one seam
            on this page with no wave — the score gives it "ring contracts,
            transform-only" — so the join is made by arriving on §05's own
            ground before the seam plays. A rising front, the same single
            custom property §03's uses. */}
        <div aria-hidden data-ab4-ground className="absolute inset-0" />

        <div data-ab4-head className={`${COLUMN} relative pt-16 lg:pt-24`}>
          <p
            data-arrive
            data-ab4-eyebrow
            className="eyebrow text-base leading-[1.5] tracking-[0.08em] text-burnt sm:text-2xl"
          >
            {whatWeDo.title}
          </p>
          <h2
            data-arrive
            data-ab4-headline
            className="headline mt-6 max-w-[1240px] text-4xl leading-[1.2] text-evergreen sm:text-5xl lg:text-[3.5rem]"
          >
            {headline}
          </h2>
          {/* ONE PARAGRAPH, THREE MOVING PARTS. In flow these spans are inline
              and the sentence reads exactly as it always has. Held, each
              becomes the clause that is read at size and then folds onto its
              place on the spiral — the same element, moved, never a second
              copy of copy already on the page. */}
          <p
            data-arrive
            data-ab4-chain
            className="mt-10 max-w-[940px] text-lg leading-[1.5] font-medium text-charcoal/92 sm:text-2xl"
          >
            {clauses.map((clause, i) => (
              <span key={i} data-ab4-clause={i}>
                {clause}
              </span>
            ))}
          </p>
        </div>

        {/* ---- the loop ---------------------------------------------------
            ⚠ THE DIAMOND IS THE HELD BUILD'S, AND THE RAIL IS THE DOCUMENT'S.
            A diamond of four around the artist's spiral is the frame's
            composition, and it was taken out of the resting page on purpose:
            it was the only four-card row on the site laid out that way, so a
            reader arriving from The Record or /partnerships met a different
            object doing the same job. That objection is about the DOCUMENT,
            which has not changed — below `deck:`, under reduced motion and
            with JavaScript off this is `CardRail`'s row exactly as before. The
            diamond exists only while the screen is held, as choreography.

            ⚠ `CardRail` IS NOT MODIFIED. It already wraps each child in a cell
            that goes `display: contents` from 640 up, so the slot below is the
            grid item there and the desktop row is what it was. The Record §07,
            /partnerships §06 and ContactDoors are untouched. */}
        <div data-ab4-loop className={`${COLUMN} relative pt-10 pb-16 lg:pt-20 lg:pb-24`}>
          {/* The spiral the four sit on. Ground artwork in flow, the loop's own
              structure when held — which is why it moves out of the section's
              artwork layer and into the stage here.

              Seam 04 → 05 rides it: "the closed ring becomes the bullet of
              COUNTRY FIRST. Not C2 — Living Work's aperture already spent it."
              §05's first value rule receives it. */}
          <div aria-hidden data-ab4-ring className="pointer-events-none absolute inset-0 overflow-hidden">
            <RingArtwork
              piece="b"
              tone="roasted"
              className="top-[26%] left-[52%] w-[62.5rem] -rotate-6 opacity-[0.09]"
            />
          </div>

          {/* The fourth position on the loop. Drawn and empty by design — the
              draft's sentence has three clauses, and a fourth would be
              invented. It carries no mark of its own: what closes the loop
              visually is the spiral, not a connector rule. */}
          <div aria-hidden data-ab4-connector="empty" className="pointer-events-none absolute" />

          <CardRail columns="sm:grid-cols-2 lg:grid-cols-4">
            {whatWeDo.areas.map((area, i) => {
              const photo = photoById(AREA_PHOTOS[i]);
              return (
                /* The slot is the grid item from 640 up (CardRail's own cell is
                   `contents` there) and the thing the loop moves when held. In
                   flow it is a plain box and the card fills it. */
                <div key={area.title} data-ab4-slot={i} className="h-full">
                  <a
                    href={area.cta.href}
                    className={`relative flex h-full flex-col overflow-hidden rounded-3xl lg:min-h-[28.75rem] ${AREA_GROUNDS[i]} text-canvas`}
                  >
                    <div className="relative aspect-[380/232] w-full shrink-0 overflow-hidden">
                      <div data-motion={photo?.grade ?? "full"} className="absolute inset-0">
                        <MediaOrField
                          src={photo?.src ?? null}
                          alt={photo?.subject ?? ""}
                          sizes="(min-width: 1024px) 298px, (min-width: 640px) 50vw, 78vw"
                          fieldClass="bg-canvas/6"
                        />
                      </div>
                      <span aria-hidden className="absolute inset-0 bg-black/35" />
                      <SeamGlyph
                        motif={CARD_GLYPHS[i % CARD_GLYPHS.length]}
                        className="right-4 bottom-4 w-10"
                      />
                    </div>

                    <div className="flex flex-1 flex-col px-6 pt-6 pb-7">
                      <h3 className="headline text-2xl leading-[1.2] sm:text-[1.75rem]">
                        {area.title}
                      </h3>
                      {/* THE BODY AND THE LABEL ARE WHAT A CARD GIVES UP when
                          it compacts onto the loop. At the scale four cards
                          fit on the spiral this copy lands near 8px and is
                          unreadable, so a card is read WHOLE and then keeps
                          only its photograph and its title — which is exactly
                          what the board seats on the ring. Grouped so one
                          opacity carries both; never hidden in the document. */}
                      <div data-ab4-card-body className="flex flex-1 flex-col">
                        <p className="mt-3.5 text-[0.9375rem] leading-[1.5] text-canvas/86">
                          {area.body}
                        </p>
                        {/* Verb-led. Never a route path. */}
                        <p className="eyebrow mt-auto pt-6 text-xs tracking-[0.08em] text-gold">
                          {area.cta.label} →
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              );
            })}
          </CardRail>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   05 · How we work — three values, and a held photograph · 249vh
   ------------------------------------------------------------------------- */

/**
 * ⚠ THE INTERIORS PASS IS BUILT (12 September 2026, user direction). This was
 * three values stacked down the page with a photograph before the third; it is
 * now ONE held screen. "How we work" stands for the whole section, each value
 * is read on its own and clears, the photograph opens from the top and pushes
 * what is left down, and RECIPROCITY is read beneath it. The beats are
 * `theValues` in src/lib/motion/recipes-about.ts; the held layout is
 * ./about.css.
 *
 * ⚠ §05 HAS NO REFERENCE BOARD, unlike §02, §03 and §04. The page frame
 * (Figma 2653:19672) gives the composition and the constraints; the sequence
 * is the user's own. Where the two could disagree the frame won — see the
 * plane note below.
 *
 * ⚠ KEPT QUIET ON PURPOSE. The ledger scores this section ⚡2 with "rest
 * after": it is the page's breather between §04 and §06, both ⚡4. It is held,
 * but its beats are `settle` and a fade and nothing else — no overshoot, no
 * ground ramp, no contraction. §03b's Breath is still the page's hard rest.
 *
 * ⚠ THE IMAGE PLANE NEVER MOVES, and this is the one line where this band
 * differs from §02's road. The frame's own layer note reads "P1 full-bleed
 * hold: the ground and the type move around it, the image plane NEVER does",
 * and the photograph is `frame` grade — the notes record at least four people
 * cropped to hands, one of them a child, and no faces at all. So the band's
 * CLIP opens and the column travels; the picture that was always there is
 * uncovered and never translated. §02's road counter-travels inside its frame
 * and copying that here would be wrong.
 *
 * Each value arrives as a lede and then a conclusion set at 44 — the sentence
 * that actually constrains a decision, landing on its own after a beat. The
 * split is the paragraph's last sentence, derived rather than restated.
 *
 * ⚠ R22 — the draft calls reciprocity the Ngapartji-Ngapartji principle, which
 * is Western Desert language and not Iningai. The draft raises it against
 * itself; it is Suzanne's to resolve. (The editorial notes stopped rendering
 * on 11 September 2026, so this comment is the record.)
 *
 * ⚠ NO `overflow-hidden` ON THIS SECTION. It carries no wave of its own — seam
 * 05 → 06's navy crest belongs to §06 — so the clip may be `overflow-clip`,
 * which the artist's ring needs; `hidden` would make the section a scroll
 * container and the sticky screen inside it would never stick. Same pair of
 * reasons as §03; see the head of ./about.css.
 */
export function HowWeWork() {
  /* One value, rendered three times. Pulled out of the map so the photograph
     can be a SIBLING of the values rather than a child of the third — the flow
     order is unchanged (heading, value 1, value 2, the band, value 3, which is
     the frame's), and held, the band can be lifted to its own grid row. */
  const renderValue = (value: (typeof howWeWork.values)[number], i: number) => {
    const parts = sentences(value.body);
    const conclusion = parts[parts.length - 1];
    const lede = parts.slice(0, -1).join(" ");

    return (
      <div
        key={value.title}
        data-ab5-value={i}
        className={`${COLUMN} relative pt-12 lg:pt-16`}
      >
        {/* The thread, one line again. The FIRST value's rule and title are the
            landing of seam 04 → 05 — §04's contracting loop hands off to them,
            and `theLoop` says so. Neither hook may be renamed without changing
            that recipe too. */}
        <div
          aria-hidden
          data-ab5-rule
          data-ab-rule={i === 0 ? "value" : undefined}
          className="h-[2px] w-full bg-gold/55"
        />
        <p
          data-ab5-label
          data-ab-eyebrow={i === 0 ? "" : undefined}
          className="eyebrow mt-5 text-xs tracking-[0.08em] text-gold"
        >
          {value.title}
        </p>
        <p
          data-ab5-lede
          className="mt-4 max-w-[820px] text-lg leading-[1.5] font-medium text-canvas/86 sm:text-2xl"
        >
          {lede}
        </p>
        <p
          data-ab5-conclusion
          className="headline mt-8 max-w-[1000px] text-2xl leading-[1.23] sm:text-[2.75rem]"
        >
          {conclusion}
        </p>
      </div>
    );
  };

  return (
    <section
      data-ab="how-we-work"
      className="relative overflow-clip bg-roasted text-canvas"
    >
      <RingArtwork
        piece="a"
        className="-left-56 top-[34%] w-[47.5rem] -rotate-11 opacity-[0.07]"
      />

      {/* THE HELD SCREEN. A plain wrapper until ./about.css makes it a sticky
          grid; in flow it adds nothing and the children below stack in the
          order they are written, which is the frame's order and the document
          this replaces. Held, the grid lifts the band to the first row so it
          can arrive OVER the heading and push it down, exactly as §02 lifts its
          road. Nothing is reordered in the DOM. */}
      <div data-ab-stage>
        <div data-ab5-head className={`${COLUMN} relative pt-16 lg:pt-24`}>
          <p
            data-arrive
            className="eyebrow text-base leading-[1.5] tracking-[0.08em] text-gold sm:text-2xl"
          >
            {howWeWork.title}
          </p>
        </div>

        {howWeWork.values.slice(0, 2).map((value, i) => renderValue(value, i))}

        {/* The band lands before the third value, not after the second — it is
            the rest scene RECIPROCITY arrives out of. */}
        <figure data-ab5-band className="relative mt-16 mb-4 lg:mt-16">
          <div
            data-ab5-frame
            className="relative h-[40svh] w-full overflow-hidden lg:h-[56svh]"
          >
            {/* ⚠ NO TRANSFORM EVER REACHES THIS PLANE — see the head of the
                component. The frame opens around a picture that does not move. */}
            <div
              data-ab5-plane
              data-motion={RECIPROCITY?.grade ?? "frame"}
              className="absolute inset-0"
            >
              <MediaOrField
                src={RECIPROCITY?.src ?? null}
                alt="Ochre-marked adult palms held out over a grinding stone toward a child's"
                sizes="(min-width: 1024px) 100vw, 260vw"
                fieldClass="bg-charcoal/40"
              />
            </div>
          </div>
          <figcaption
            data-ab5-caption
            className={`${COLUMN} mt-6 text-base leading-[1.5] text-canvas/75`}
          >
            Ochre, prepared by hand.
          </figcaption>
        </figure>

        {renderValue(howWeWork.values[2], 2)}

        {/* The foot. This was the editorial note's container; the notes came off
            the page on 11 September 2026 (user direction) and the padding stays,
            because it is the air between RECIPROCITY and seam 05 → 06's navy
            crest, which is pulled up above §06's own box. */}
        <div aria-hidden data-ab5-foot className={`${COLUMN} pt-10 pb-16 lg:pt-20 lg:pb-24`} />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   06 · Who decides — the sentence that keeps qualifying itself · 245vh
   ------------------------------------------------------------------------- */

/**
 * The claim is made once at full size and then qualified twice, and the frame
 * holds both qualifications back at 0.45 — they are true, and they are not the
 * point. All three come out of one authored paragraph, split on its own
 * sentence boundaries.
 *
 * ⚠ THE ONLY FUTURE-TENSE SENTENCE ON THE PAGE is the Elder Advisory Group's,
 * and it is the one clause here NOT held back. The group is not sitting. "Is
 * being established" and "once it is sitting" are doing real work and an edit
 * that tidies them into the present tense would make the page claim a
 * governance body that does not yet exist. Do not tidy them.
 *
 * THE THREAD ACQUIRES A DATE. The rule that started under §03's question runs
 * into this section carrying three beats — drawn here as a dotted wave rather
 * than a bar (user direction, 11 September 2026), which is the one place on the
 * page the thread is dotted — and STOPS on the last of them. It does not run to
 * the column's edge: it ends on 2031, which is set at display size below it,
 * stated and held, never counted up to. It is the date this page is
 * accountable to, and it is where the thread has been going.
 */
const BEATS = ["Quarterly", "Annual general meeting", "2031 · the review"] as const;
/** The frame's marker positions, as fractions of the 1240 column. */
const BEAT_X = ["lg:left-0", "lg:left-[33.9%]", "lg:left-[73.4%]"] as const;
/**
 * Where the thread STOPS: on the last beat, not at the column's edge.
 *
 * The thread ends on 2031 because that is what it is for — it is the date this
 * page is accountable to, and a line that carries on past it is running out of
 * the section with nothing left to say (user, 11 September 2026: "it's still
 * extending overshooting"). `left` places a beat's LEFT edge, and the dot is
 * 18px wide, so the last beat's centre is its fraction + 9px and that is where
 * the line has to end.
 *
 * ⚠ Tied by hand to the last entry of BEAT_X — Tailwind cannot see a computed
 * class, so neither of these can be derived from the other. Move one, move both.
 */
const THREAD_W = "lg:w-[calc(73.4%+9px)]";

export function WhoDecides() {
  const claim = sentences(whoDecides.body[0]);

  return (
    <section data-ab="who-decides" className="relative bg-midnight text-canvas">
      {/* ⚠ NO `overflow-hidden` ON THIS SECTION — it carries seam 05 → 06's
          navy wave ("three values become three board facts"), pulled entirely
          above the section's own box onto §05's roasted foot. A clip here
          deletes it, and it has to stay OUTSIDE the stage below for the same
          reason: the stage is the held screen and the held screen clips. */}
      <WaveDivider ground="var(--color-midnight)" hook="wave" />

      {/* THE HELD SCREEN. A plain wrapper until ./about.css makes it a sticky
          grid; in flow it contributes nothing and the three blocks below stack
          in the order they are written — the eyebrow, the claim, the calendar —
          which is the document this replaces. Held, the eyebrow takes the first
          row and STANDS there while the two parts share the second, so the
          calendar replaces the claim in place rather than following it down the
          page (user direction, 12 September 2026).

          ⚠ THE STAGE PAINTS NOTHING. The section's midnight is what the rings
          sit on, so a ground here hides them — which is exactly what §03's
          canvas screen did to its own rings. The user asked for the rings to
          stay in the background; this is the line that keeps them.

          Seam 06 → 07 lifts THIS wrapper (`overlap`, the page's one loud
          transition effect): the board recedes and dims as the people's
          off-white wave rides over it. The hook is on the stage rather than on
          a column inside it because held, the stage IS what stands at the
          section's foot — and the rings recede with the board, which is what
          "the board recedes" asks for. */}
      <div data-ab-stage data-ab-lift className="relative">
        {/* The rings live INSIDE the stage, as §02's do. Left outside, they are
            `absolute inset-0` of a 300vh section, so `top-[8%]` is 72vh down and
            `top-[56%]` is 168vh down and neither is ever on the held screen.
            Inside, they resolve against the sticky screen when it is sticky (a
            sticky box is a positioned box) and against the section when it is
            not, which is the right answer in each build and needs no rule. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <RingArtwork
            piece="b"
            className="top-[8%] left-[55%] w-[56.25rem] rotate-9 opacity-15"
          />
          <RingArtwork
            piece="a"
            className="-left-64 top-[56%] w-[51.25rem] -rotate-13 opacity-[0.13]"
          />
        </div>

        {/* The persistent header. It settles once on the way in and then holds
            for the whole section — both parts below are read under it. */}
        <div data-ab6-head className={`${COLUMN} relative pt-16 lg:pt-24`}>
          <p
            data-arrive
            className="eyebrow text-base leading-[1.5] tracking-[0.08em] text-gold sm:text-2xl"
          >
            {whoDecides.title}
          </p>
        </div>

        {/* ---- PART 1 · the claim ------------------------------------------
            What the board is and how it is made up. Read, then cleared whole:
            the calendar is not more of this, it is the other half of the
            answer. */}
        <div data-ab6-part="claim" className={`${COLUMN} relative`}>
          <h2
            data-ab6-claim
            className="headline mt-6 max-w-[1180px] text-4xl leading-[1.2] sm:text-5xl lg:text-[3.5rem]"
          >
            {claim[0]}
          </h2>

          {/* True, and not the point. */}
          <p
            data-ab6-fact
            className="mt-14 max-w-[940px] text-lg leading-[1.5] font-medium text-canvas/45 sm:text-2xl"
          >
            {claim[1]}
          </p>
          <p
            data-ab6-fact
            className="mt-8 max-w-[940px] text-lg leading-[1.5] font-medium text-canvas/45 sm:text-2xl"
          >
            {claim[2]}
          </p>

          {/* The thread, before it acquires a date. */}
          <div
            aria-hidden
            data-ab6-rule
            className="mt-16 h-[2px] w-[24rem] max-w-full bg-ochre"
          />

          {/* ⚠ FUTURE TENSE, AND THE ONE LINE ON THIS PAGE THAT DOES NOT SETTLE.
              Grammar row: "what has not happened yet" — IMG-04's chromatic split,
              released by F9 and spent here and nowhere else on the site. Two ghost
              copies of the sentence sit a couple of pixels behind it, one oxide and
              one turquoise, and drift about a pixel on a cycle with no end state,
              because the Elder Advisory Group is not sitting. A tense marker, not a
              texture (Figma 2707:21402 frame 03, "the clause that will not resolve").

              ⚠ ITS REMOVAL CONDITION. When the group sits: delete
              `data-ab6-unsettled` here and take the future tense out of
              `whoDecides.body[1]` in the draft and in src/content/about.ts. One
              attribute and one sentence. Nothing else in the section knows about it.

              ⚠ THE GHOSTS ARE SIBLINGS OF THE SENTENCE, NOT CHILDREN OF IT, and
              that is structural rather than tidy: `settle` splits this paragraph
              with SplitText, and ghost copies inside it would be split along with
              it — three sets of lines animating as one, and the accessible name read
              three times. They are `aria-hidden`, they come FIRST so the real
              sentence paints over them, and the static paragraph is what gives the
              wrapper its height. */}
          <div data-ab6-unsettled className="relative mt-9 max-w-[940px]">
            <span
              aria-hidden
              data-ab6-ghost="oxide"
              className="absolute inset-0 text-lg leading-[1.5] font-medium text-oxide sm:text-2xl"
            >
              {whoDecides.body[1]}
            </span>
            <span
              aria-hidden
              data-ab6-ghost="turquoise"
              className="absolute inset-0 text-lg leading-[1.5] font-medium text-turquoise sm:text-2xl"
            >
              {whoDecides.body[1]}
            </span>
            <p
              data-ab6-future
              className="relative text-lg leading-[1.5] font-medium text-canvas/95 sm:text-2xl"
            >
              {whoDecides.body[1]}
            </p>
          </div>
        </div>

        {/* ---- PART 2 · the calendar ---------------------------------------
            The thread acquires a date. The rule draws scrubbed, at reading
            pace, and each beat seats with a short catch as the draw reaches it
            — the transition channel this section is loud in.

            ⚠ HELD, BOTH ARE DRIVEN FROM THE SECTION'S READ, NOT FROM THEIR OWN
            VIEWPORT CROSSINGS. See `theCalendar` for why. */}
        <div data-ab6-part="calendar" className={`${COLUMN} relative pb-16 lg:pb-28`}>
          <div data-ab6-thread className="relative mt-32">
            {/* The thread, drawn as a dotted wave rather than a bar (user direction,
                11 September 2026) — /truth's strand geometry turned horizontal, see
                `thread-dots` in globals.css. 20px tall because the wave has
                amplitude, and it is its MIDLINE, not its top, that the beats below
                have to sit on.

                ⚠ NOT `DottedRule`, and the difference is deliberate. That component
                is the artist's STRAIGHT supplied rule, gold, static, and §08 uses
                three of them as dividers between partner groups. This is the thread:
                ochre, wavy, and drawn. Two dotted things on one page doing two
                different jobs — do not reconcile them into one. */}
            <div
              aria-hidden
              data-ab-rule="timeline"
              /* Full width below `lg`, where the beats stack underneath it in their
                 own column and there is no last beat to stop on. */
              className={`thread-dots h-5 w-full ${THREAD_W}`}
            />
            <div className="mt-6 flex flex-col gap-5 lg:mt-0 lg:block lg:h-16">
              {BEATS.map((beat, i) => (
                <div key={beat} className={`lg:absolute lg:top-0 ${BEAT_X[i]}`}>
                  <span
                    aria-hidden
                    data-ab-beat
                    /* ⚠ `lg:top-0` is measured from `div.relative.mt-32` — the
                       wrapper that holds the THREAD as well as this row — so top 0
                       is the thread's own top, NOT the top of the row this span
                       sits in. The wave's midline is 10px down from there and the
                       dot's centre is 9px down from its own top, so +1px lands the
                       18px dot exactly on the line. (The old 2px rule needed -10px
                       because a 2px bar has no midline worth the name; carrying
                       that sign over put the beats 20px into the air.) Below `lg`
                       the beats stack in their own column and -10px is only an
                       optical nudge. */
                    className="block h-[18px] w-[18px] -translate-y-[10px] rounded-full bg-ochre lg:translate-y-[1px]"
                  />
                  <p
                    data-ab6-beat-label
                    className="eyebrow mt-2 text-xs tracking-[0.08em] text-ochre"
                  >
                    {beat}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 2031 is STATED AND HELD, never counted up to — the grammar's ban on
              a count-up over a date this page is accountable to. */}
          <p
            data-ab-date
            className="headline mt-16 text-6xl leading-[1.2] text-gold sm:text-8xl lg:mt-16 lg:text-[5rem]"
          >
            2031
          </p>
          <p
            data-ab6-body
            className="mt-10 max-w-[940px] text-lg leading-[1.5] font-medium text-canvas/90 sm:text-2xl"
          >
            {whoDecides.body[2]}
          </p>

          <div aria-hidden data-ab6-hairline className="mt-20 h-px w-full bg-canvas/20" />
          {/* The frame renders this label in full. It names what is there, not
              where the file is. */}
          <a
            href={whoDecides.cta.href}
            data-ab6-cta
            className="eyebrow mt-11 block max-w-[1100px] text-xs tracking-[0.08em] text-gold"
          >
            {whoDecides.cta.label} →
          </a>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   07 · The people — two frames and one absence · 145vh
   ------------------------------------------------------------------------- */

/**
 * R24 / user revision, 11 September 2026: the large frame now shows Suzanne,
 * using the already identified 378A7604_1.40.2 profile photograph. Its origin
 * and requested use are recorded under `about-suzanne` in kit.ts. The image
 * plane holds still. The second portrait remains an unnamed stand-in until
 * the correct team photographs arrive, with its consent marker visible.
 *
 * ⚠ THE THIRD SLOT DRAWS ITS OWN ABSENCE. Neither batch holds archival
 * material of any kind, and three generations of families is written here, not
 * shown. The marker renders and the row does not shorten — a shortened row
 * would say there were only ever two things to show.
 *
 * ⚠ NO CAPTION. The frame carries a sentence here explaining that frames are
 * captioned by what they show rather than by who the person is. That is a
 * design note about the page, not something a visitor came to read, and it is
 * stripped. The consent markers say the same thing by being there.
 *
 * ⚠ THE WAVE HERE IS THE SCORE'S. An earlier reading — a wave only where a
 * full-bleed PHOTOGRAPH hands off to a ground, every ground-to-ground seam cut
 * hard — is superseded by `REF · SCORE · 05 ABOUT` (2642:19666), which seats
 * Wave / Divider at five seams: into §02, §04, §06, §07 and §09. Seam 06 → 07
 * is "Wave / Divider · OFF-WHITE — 2031's endpoint becomes §07's first caption
 * rule; the Guide goes quiet and waits at the edge." So this section carries
 * the off-white wave and gives up its clip; the artwork re-clips on its own
 * layer. There is no caption rule in this markup (captions are deliberately
 * stripped, above) — `data-ab-rule="caption"` is the reserved attachment point
 * if design later adds one, and until then the seam's carry lands on the wave
 * and the eyebrow's arrival.
 */
export function ThePeople() {
  return (
    <section data-ab="the-people" className="relative bg-canvas text-charcoal">
      {/* ⚠ NO `overflow-hidden` ON THIS SECTION — it carries seam 06 → 07's
          off-white wave, pulled above its own box onto §06's navy foot. The
          rings and the dots-wave (120% wide) re-clip on their own layer. */}
      <WaveDivider ground="var(--color-canvas)" hook="wave" />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <RingArtwork
          piece="b"
          className="top-[7%] left-[64%] w-[56.25rem] opacity-30"
        />
        <RingArtwork
          piece="a"
          tone="roasted"
          className="-left-48 top-[54%] w-[40rem] opacity-30"
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
        <img
          aria-hidden
          src="/artwork/dots-wave.svg"
          alt=""
          className="pointer-events-none absolute -left-20 bottom-8 w-[120%] opacity-[0.09]"
        />
      </div>

      <div className={`${COLUMN} relative pt-16 pb-16 lg:pt-28 lg:pb-24`}>
        {/* Reserved: data-ab-rule="caption" — §07's first caption rule, the
            seam's scored carry target, if design adds the element. */}
        <p
          data-arrive
          className="eyebrow text-base leading-[1.5] tracking-[0.08em] text-burnt sm:text-2xl"
        >
          {thePeople.title}
        </p>
        <h2
          data-arrive
          className="headline mt-6 max-w-[1180px] text-4xl leading-[1.2] text-evergreen sm:text-5xl lg:text-[3.5rem]"
        >
          {sentences(thePeople.body)[0]}
        </h2>
        <p
          data-arrive
          className="mt-10 max-w-[900px] text-lg leading-[1.5] font-medium text-charcoal/92 sm:text-2xl"
        >
          {sentences(thePeople.body).slice(1).join(" ")}
        </p>

        {/* 560 · 370 · 250 on 30px gutters is exactly the frame's 1240 column,
            so the three run as proportions of whatever column they get rather
            than as fixed widths. As fixed widths they needed 1440px and the
            section's overflow-hidden was clipping the third slot at every
            viewport. The vertical offsets are the frame's: +60, +110. */}
        <div className="mt-16 flex flex-col gap-8 lg:grid lg:grid-cols-[560fr_370fr_250fr] lg:items-start lg:gap-[1.875rem]">
          {[
            { photo: PEOPLE_A, alt: thePeople.suzannePortraitAlt, pending: false },
            { photo: PEOPLE_B, alt: "", pending: true },
          ].map(({ photo, alt, pending }, i) => (
            <div
              key={photo?.id ?? i}
              className={`relative w-full overflow-hidden rounded-sm ${
                i === 0 ? "aspect-square" : "aspect-[370/500] lg:mt-[3.75rem]"
              }`}
            >
              <div data-motion={photo?.grade ?? "frame"} className="absolute inset-0">
                <MediaOrField
                  src={photo?.src ?? null}
                  alt={alt}
                  sizes="(min-width: 1024px) 560px, 100vw"
                  // X6 clears inline motion styles, including Next's fill
                  // positioning; utilities preserve the portrait crop in that cut.
                  className="absolute inset-0 h-full w-full object-cover"
                  fieldClass="bg-evergreen/40"
                />
              </div>
              {pending && (
                <p
                  data-placeholder="consent-unresolved"
                  className="eyebrow absolute top-4 left-4 rounded-xs bg-charcoal/70 px-3 py-1.5 text-[10px] text-canvas"
                >
                  ⚠ Consent unresolved
                </p>
              )}
            </div>
          ))}

          {/* The absence, drawn. It is the same height as a photograph and it
              does not collapse. */}
          <div
            data-placeholder="no-archival-photograph"
            role="img"
            aria-label="No archival photograph exists for this slot"
            className="flex aspect-[16/10] w-full items-end rounded-sm border-[1.5px] border-dashed border-oxide/60 p-5 lg:mt-[6.875rem] lg:aspect-[250/410]"
          >
            <p className="eyebrow text-[10px] leading-[1.6] tracking-[0.08em] text-oxide">
              ⟡ No archival photograph exists
            </p>
          </div>
        </div>

        <a
          href={thePeople.cta.href}
          className="eyebrow mt-20 block text-xs tracking-[0.08em] text-burnt"
        >
          {thePeople.cta.label} →
        </a>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   08 · Partners — names, not logos · 175vh
   ------------------------------------------------------------------------- */

/**
 * ⚠ R12 — NAMES, NEVER LOGOS. No approved logo files exist and the draft asks
 * whether each partnership is still active. A lapsed partner's logo on an
 * About page is a worse problem than a plain name, so the names are set as
 * type on the artist's dotted rule and there is no grid of marks to fill.
 *
 * ⚠ `#partners` IS LOAD-BEARING. `src/app/partnerships/page.tsx` links here by
 * anchor, and so does the homepage draft. Do not rename it.
 *
 * The headline is the paragraph's own claim, lifted out and closed off — the
 * page's headline convention. What is left of the paragraph is the lede, in
 * the order the frame sets it.
 *
 * The third group's `[ add ]` is the frame's own marker: the draft lists two
 * names in a group the pending note says is incomplete, so the gap is drawn
 * rather than closed up.
 */
export function Partners() {
  const [opening, claimSentence] = sentences(partners.body);
  const [claim, rest] = claimSentence.split(", and ");
  const lede = `${opening} ${rest.charAt(0).toUpperCase()}${rest.slice(1)}`;

  return (
    // Seam 07 → 08 is "Dots / Rule only, no ground change — the rule, and
    // nothing else": each group's dotted rule draws itself on; no wave, and
    // this section KEEPS its clip. The thread becoming the artist's dotted
    // rule is the Guide's reading (▲ Leonard Mickelo); not built.
    <section
      id="partners"
      data-ab="partners"
      className="relative scroll-mt-28 overflow-hidden bg-evergreen text-canvas"
    >
      <RingArtwork
        piece="b"
        className="top-[6%] left-[64%] w-[56.25rem] opacity-8"
      />
      <RingArtwork
        piece="a"
        className="-left-48 top-[54%] w-[40rem] opacity-7"
      />

      <div className={`${COLUMN} relative pt-16 pb-16 lg:pt-24 lg:pb-24`}>
        <p
          data-arrive
          className="eyebrow text-base leading-[1.5] tracking-[0.08em] text-gold sm:text-2xl"
        >
          {partners.title}
        </p>
        <h2
          data-arrive
          className="headline mt-6 max-w-[1180px] text-4xl leading-[1.2] sm:text-5xl lg:text-[3.5rem]"
        >
          {`${claim}.`}
        </h2>
        <p
          data-arrive
          className="mt-10 max-w-[900px] text-lg leading-[1.5] font-medium text-canvas/88 sm:text-2xl"
        >
          {lede}
        </p>

        <div className="mt-16">
          {partners.groups.map((group, i) => (
            <div key={group.title} className={i === 0 ? "" : "mt-16"}>
              <DottedRule tone="gold" className="opacity-85" />
              <p className="eyebrow mt-6 text-xs tracking-[0.08em] text-gold">
                {group.title}
              </p>
              {/* Names as list items, not one joined string.
                  `names.join("   ·   ")` set at 30px reads as a single line of
                  names in a 1240px column and as a run-on sentence in a 327px
                  one: the middots orphan at line ends and nothing distinguishes
                  a break INSIDE a name from a break BETWEEN two names. Each
                  name is now its own flex item, so it wraps as a unit, and the
                  separator trails its name (never leads the next) so it can
                  never start a line. The separator is decorative — the list
                  semantics carry the meaning for a screen reader. */}
              <ul className="mt-5 flex max-w-[1240px] flex-wrap items-baseline gap-y-1">
                {group.names.map((name, n) => (
                  <li
                    key={name}
                    className="headline text-xl leading-[1.53] text-canvas/95 sm:text-[1.875rem]"
                  >
                    {name}
                    {n < group.names.length - 1 ||
                    i === partners.groups.length - 1 ? (
                      <span aria-hidden className="mx-3 text-canvas/40 sm:mx-5">
                        ·
                      </span>
                    ) : null}
                  </li>
                ))}
                {/* The list is short and the draft says so. */}
                {i === partners.groups.length - 1 ? (
                  <li
                    data-placeholder="add-partner"
                    className="headline text-xl leading-[1.53] text-canvas/45 sm:text-[1.875rem]"
                  >
                    [ add ]
                  </li>
                ) : null}
              </ul>
            </div>
          ))}
        </div>

        <a
          href={partners.cta.href}
          className="eyebrow mt-20 block text-xs tracking-[0.08em] text-gold"
        >
          {partners.cta.label} →
        </a>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   09 · Get in touch — four doors · 140vh
   ------------------------------------------------------------------------- */

/**
 * The dark run begins, and the thread that started under §03's question
 * arrives here as a plain rule above the contact details.
 *
 * OCHRE CARRIES WORDS ONCE, HERE. It reads 7.74:1 on charcoal, which is the
 * only ground on this page where it clears as type; everywhere else on the
 * page ochre is a line and never a word.
 *
 * ⚠ EVERY DETAIL IS A PLACEHOLDER, including the email address, which looks
 * real and is not. The square brackets are the drafter's own mark and none of
 * these becomes a live mailto: or tel: — `src/content/contact.ts` models them
 * as `pending` precisely so a UI cannot link one by accident. Publishing an
 * unverified address is worse than publishing none.
 *
 * The doors are the shared `ContactDoors`, which Our People §06 renders too.
 * The grounds and the accent are this frame's; everything else is the same
 * object, so the four destinations cannot drift between the two pages.
 */
const DOOR_GROUNDS = [
  "bg-evergreen",
  "bg-roasted",
  "bg-evergreen",
  "bg-roasted",
] as const;

/** The frame's rotation here: boomerang, starburst, boomerang, starburst. */
const DOOR_GLYPHS: SeamGlyphMotif[] = ["c", "b"];

export function GetInTouch() {
  return (
    <section
      id="contact"
      data-ab="get-in-touch"
      className="relative scroll-mt-28 bg-charcoal text-canvas"
    >
      {/* ⚠ NO `overflow-hidden` ON THIS SECTION — it carries seam 08 → 09's
          charcoal wave ("the partner groups' rules become the four doors'
          edges"), pulled above its own box onto §08's evergreen foot. The
          rings re-clip on their own layer. Seam 09 → 10 is continuous
          charcoal: no device, no code — the Guide's upward departure (G4,
          ▲ Leonard Mickelo) would happen there and is not built. */}
      <WaveDivider ground="var(--color-charcoal)" hook="wave" />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <RingArtwork
          piece="b"
          className="top-[7%] left-[64%] w-[56.25rem] opacity-8"
        />
        <RingArtwork
          piece="a"
          className="-left-44 top-[54%] w-[36.6875rem] opacity-7"
        />
      </div>

      <div className={`${COLUMN} relative pt-16 pb-16 lg:pt-24 lg:pb-28`}>
        <p
          data-arrive
          className="eyebrow text-base leading-[1.5] tracking-[0.08em] text-ochre sm:text-2xl"
        >
          Get in touch
        </p>
        <h2
          data-arrive
          className="headline mt-6 max-w-[1180px] text-4xl leading-[1.2] sm:text-5xl lg:text-[3.5rem]"
        >
          Different things go to different people.
        </h2>
        <p
          data-arrive
          className="mt-8 max-w-[900px] text-lg leading-[1.5] font-medium text-canvas/88 sm:text-2xl"
        >
          {contactRoutes.title} {sentences(contactRoutes.lede).slice(1).join(" ")}
        </p>

        {/* The doors open from their own top edges — a thin line echoing
            §08's rules, then the full card, with the score's short catch. */}
        <div data-ab-doors className="mt-14">
          <ContactDoors
            grounds={DOOR_GROUNDS}
            glyphs={DOOR_GLYPHS}
            accent="text-ochre"
          />
        </div>

        {/* The thread, arrived — drawn at the reader's own pace. */}
        <div
          aria-hidden
          data-ab-rule="thread"
          className="mt-14 h-[2px] w-full bg-ochre lg:mt-14"
        />

        {/* Three across, two rows, 390 wide — the same fix already made on
            Our People, which carries this block word for word under D5. */}
        {/* Three across, two rows, 390 wide — the same block Our People
            carries word for word under D5. */}
        <div data-arrive className="mt-10">
          <ContactDetails
            accent="text-ochre"
            ink="text-canvas/90"
            width="max-w-[390px]"
          />
        </div>
      </div>
    </section>
  );
}
