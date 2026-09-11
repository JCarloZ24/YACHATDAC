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
   02 · What we are — the name, the road, and the register · 299vh
   ------------------------------------------------------------------------- */

/**
 * The sentence says most people cannot say the corporation's legal name, so
 * the frame sets the long name at 64 and holds it at 0.3 while "Most people
 * say YACHATDAC." lands at 96 underneath. The type is making the point the
 * copy makes, which is why both halves come out of one authored string rather
 * than being two entries in the content module.
 *
 * ⚠ R15 — that long name is exactly what is unconfirmed. The logo and the
 * published research disagree on Yambangku / Yumbangku, and ICN and ABN are
 * blank. The draft's own note renders under the register rather than being
 * dropped, because a register that lists what is confirmed should say what is
 * not.
 *
 * ⚠ CR10 is held on the third paragraph — "bought back for our people" is the
 * client's phrase about their own history and is not edited here.
 *
 * THE ROAD RUNS FULL BLEED THROUGH THE SECTION. It is a screen of its own, not
 * an image on the side: 1440 wide between the paragraphs and the register,
 * with a caption that names the way in rather than describing the picture.
 */
export function WhatWeAre() {
  const [legalName, shortName] = (() => {
    const first = whatWeAre.body[0];
    const cut = first.indexOf(". ");
    return [first.slice(0, cut + 1), first.slice(cut + 2)];
  })();

  return (
    <section data-ab="what-we-are" className="relative bg-canvas text-charcoal">
      {/* ⚠ NO `overflow-hidden` ON THIS SECTION. The wave is pulled entirely
          above the section's own box so that it lands on the hero photograph
          below it — a clip here deletes it outright. The artwork is clipped on
          its own layer instead, which it needs (ring-b is 1000px at left-54%
          and would otherwise scroll the page sideways). */}
      {/* Seam 01 → 02 · Wave / Divider · OFF-WHITE. "The cliff's horizontal
          banding becomes the register's rules." The Guide's departure (G1,
          ▲ Leonard Mickelo) would leave from here; not built. */}
      <WaveDivider ground="var(--color-canvas)" hook="wave" />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <RingArtwork
          piece="b"
          tone="roasted"
          className="top-[14%] left-[54%] w-[62.5rem] rotate-7 opacity-[0.08]"
        />
      </div>

      <div className={`${COLUMN} relative pt-16 lg:pt-28`}>
        <p
          data-arrive
          className="eyebrow text-base leading-[1.5] tracking-[0.08em] text-burnt sm:text-2xl"
        >
          {whatWeAre.title}
        </p>

        {/* The long name, held back so the short one can land. */}
        <p
          data-arrive
          className="headline mt-8 max-w-[1240px] text-4xl leading-[1.2] text-evergreen/30 sm:text-5xl lg:text-[3.5rem]"
        >
          {legalName}
        </p>
        <p
          data-arrive
          className="headline mt-6 max-w-[1240px] text-4xl leading-[1.2] text-evergreen sm:text-6xl lg:text-[5rem]"
        >
          {shortName}
        </p>

        <p className="mt-16 max-w-[780px] text-lg leading-[1.5] font-medium text-charcoal/92 sm:text-2xl">
          {whatWeAre.body[1]}
        </p>
        <p className="mt-8 max-w-[780px] text-lg leading-[1.5] font-medium text-charcoal/92 sm:text-2xl">
          {whatWeAre.body[2]}
        </p>
      </div>

      {/* The road. Full bleed — a screen, not an inset, and its OWN screen in
          the ledger (scenes.md:358: "§02 is decode → the road → register"), so
          it carries its own motion root and its own loud channel (media). The
          plane is oversized past its clip so the parallax travel never exposes
          ground; `movable()` holds it still if the photo is `frame` grade. */}
      <figure data-ab="road" className="relative mt-16">
        <div className="relative h-[44svh] w-full overflow-hidden lg:h-[62svh]">
          <div
            data-media
            data-plane="mid"
            data-motion={ROAD?.grade ?? "full"}
            className="absolute inset-x-0 -inset-y-[8%]"
          >
            <MediaOrField
              src={ROAD?.src ?? null}
              /* The vehicle is named because the crop below brings it into frame;
                 it was entirely cut by the old centred crop. `kit.ts` has recorded
                 it as the subject all along ("one vehicle at the end — no people"). */
              alt="An aerial view down a sandy two-wheel track through low bushland, a single vehicle stopped on it"
              sizes="(min-width: 1024px) 100vw, 260vw"
              /* The plane is 2.70:1 and the photograph 1.78:1, so `object-cover`
                 discards ~178px at each edge, and the centred default cut the near
                 end of the track — including the vehicle on it, which is the thing
                 that gives the aerial its scale. Anchored to the bottom on user
                 direction, 11 September 2026. This moves the crop INSIDE the plane
                 only: the plane's own 8% overhang, and so the parallax, is
                 untouched, and ~48px of the photograph's true foot still sits
                 below the clip so the travel never exposes ground. */
              className="object-cover object-bottom"
              fieldClass="bg-roasted/40"
            />
          </div>
        </div>
        <figcaption className={`${COLUMN} mt-6 text-base leading-[1.5] text-roasted`}>
          The way in. Turraburra is 120km north of Barcaldine.
        </figcaption>
      </figure>

      <div className={`${COLUMN} relative pt-16 pb-16 lg:pt-24 lg:pb-28`}>
        {/* The thread enters. Ochre reads 2.30:1 on canvas, so on this ground
            it is a line and never a word. */}
        <div aria-hidden className="h-[3px] w-full bg-ochre" />

        <p className="eyebrow mt-5 text-xs tracking-[0.08em] text-roasted/70">
          Registered with
        </p>

        <dl className="mt-8 border-t border-charcoal/14">
          {whatWeAre.facts.map((fact) => (
            <div
              key={fact.label}
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
   03 · WHY WE EXIST — ⚑ the question · 235vh
   ------------------------------------------------------------------------- */

/**
 * The page's argument, and the section everything else is measured against.
 *
 * THE GROUND TAKES THE PHOTOGRAPH. A single ramp runs the whole section —
 * canvas at the top, evergreen at 40%, charcoal from 53% down — and the
 * photograph sits under a second gradient that resolves to solid charcoal
 * before the question arrives. So the two claims are read on Country, and the
 * question is asked on nothing.
 *
 * ⚠ THE ONE BARE GROUND ON THE PAGE, and it is deliberate. Every other section
 * carries the artist's rings behind it; here the question sits on charcoal
 * with nothing behind it at all, because anything behind it would be something
 * else to look at. The two rings the frame does place sit high and low, well
 * clear of the question's own band.
 *
 * The quote is the client's, from the Foreword to the Ten Year Strategic Plan,
 * and the attribution says so. It is never set as testimony and never split.
 */
export function WhyWeExist() {
  return (
    <section
      data-ab="why-we-exist"
      className="relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(180deg, #f6f6ec 0%, #f1f0e5 26%, #22372b 36%, #090e12 43%, #090e12 100%)",
      }}
    >
      <RingArtwork
        piece="b"
        className="top-[4%] left-[64%] w-[56.25rem] opacity-30"
      />
      <RingArtwork
        piece="a"
        className="-left-48 top-[54%] w-[40rem] opacity-30"
      />

      {/* THE CLAIMS ARE READ ON COUNTRY. The photograph fills exactly this
          block and no more — it is the intro's own background rather than a
          percentage of the section, so however tall the copy runs it can never
          reach the question below. That coupling is the whole point: the
          picture belongs to the claims, and the question is asked on nothing.

          ⚠ THE BLOCK IS A FULL SLIDE (user direction, 8 Sep). When the deck
          seats this section, the arrival screen is the claims on a largely
          CLEAR photograph — the coming-apart begins below the fold, so no
          darkness shows at the bottom of the first viewport. Content-sized it
          was 568px, which compressed the whole collapse into the arrival
          screen; min-height makes the first beat the photograph's. */}
      <div className="relative min-h-[100svh] lg:min-h-[130svh]">
        <div data-motion={QUESTION?.grade ?? "full"} className="absolute inset-0 opacity-50">
          <MediaOrField
            src={QUESTION?.src ?? null}
            alt="Open Country, wide — mulga running to the horizon"
            sizes="(min-width: 1024px) 100vw, 260vw"
            fieldClass="bg-evergreen/40"
          />
        </div>
        {/* The coming-apart. Still resolves to solid charcoal before the block
            ends — the ground takes the photograph before the question — but
            the collapse now lives in the block's last fifth: light through
            60%, evergreen at 82%, charcoal by 96%. On a 130svh block that
            puts the first dark pixel below the arrival screen's fold. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(246,246,236,0.6) 0%, rgba(241,240,229,0.55) 60%, rgba(34,55,43,0.92) 82%, #090e12 96%, #090e12 100%)",
          }}
        />

        <div className={`${COLUMN} relative pt-16 pb-[22svh] lg:pt-24 lg:pb-[22svh]`}>
          <p
            data-arrive
            className="eyebrow text-base leading-[1.5] tracking-[0.08em] text-burnt sm:text-2xl"
          >
            {whyWeExist.title}
          </p>
          <p
            data-arrive
            className="mt-10 max-w-[940px] text-lg leading-[1.5] font-medium text-charcoal/90 sm:text-2xl"
          >
            {whyWeExist.body[0]}
          </p>
          <p
            data-arrive
            className="mt-10 max-w-[940px] text-lg leading-[1.5] font-medium text-charcoal/90 sm:text-2xl"
          >
            {whyWeExist.body[1]}
          </p>
        </div>
      </div>

      {/* The screen has cleared. Nothing behind the question but ground.
          A FULL BEAT (user direction, 8 Sep): the question holds a viewport
          of bare charcoal to itself, centred, at the ramp's display size —
          the page's argument at the scale ART-DIRECTION.md always meant for
          it ("at full scale, on a pinned screen"). The line-mask settle and
          the pin stay the interiors pass. */}
      <div
        className={`${COLUMN} relative flex min-h-[100svh] flex-col justify-center pb-16 lg:pb-28`}
      >
        <blockquote>
          <p className="headline max-w-[1240px] text-4xl leading-[1.2] text-canvas sm:text-6xl lg:text-[6rem]">
            {whyWeExist.quote}
          </p>
          {/* The question contracts into this. The thread starts here and runs
              to §09, where it arrives. Seam 02 → 03's echo: the same ochre
              line §02 extended, redrawn under the question. The question's own
              line-mask settle is the interiors pass (scenes.md:367). */}
          <div
            aria-hidden
            data-ab-rule="quote"
            className="mt-14 h-[3px] w-[26.5rem] max-w-full bg-ochre"
          />
          <footer className="mt-4 max-w-[900px] text-base leading-[1.5] text-canvas/72">
            {whyWeExist.attribution}
          </footer>
        </blockquote>

        <p className="mt-14 max-w-[940px] text-lg leading-[1.5] font-medium text-canvas/90 sm:text-2xl lg:mt-14">
          {whyWeExist.tagline}
        </p>
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
     convention. What is left of the lede is the chain, rendered whole. */
  const [headline, ...chain] = sentences(whatWeDo.lede);
  const lede = chain.join(" ");

  return (
    <section data-ab="what-we-do" className="relative bg-canvas text-charcoal">
      {/* Figma 2668:20274 — seated on the BREATH photograph, not under it, so
          the photograph's horizon becomes the baseline this section sits on.
          Seam 03b → 04 · Wave / Divider · OFF-WHITE. "The photograph's horizon
          becomes the loop's baseline." The trail re-entering and forking into
          four is the Guide's (▲ Leonard Mickelo); not built. */}
      <WaveDivider ground="var(--color-canvas)" hook="wave" />
      {/* Seam 04 → 05 rides this ring: "ring contracts, transform-only scrub —
          the closed ring becomes the bullet of COUNTRY FIRST. Not C2 — Living
          Work's aperture already spent it." Motion.tsx scrubs the ring's scale
          as the section leaves; §05's first value rule receives it. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <RingArtwork
          piece="b"
          tone="roasted"
          className="top-[26%] left-[52%] w-[62.5rem] -rotate-6 opacity-[0.09]"
        />
      </div>

      <div className={`${COLUMN} relative pt-16 lg:pt-24`}>
        <p
          data-arrive
          className="eyebrow text-base leading-[1.5] tracking-[0.08em] text-burnt sm:text-2xl"
        >
          {whatWeDo.title}
        </p>
        <h2
          data-arrive
          className="headline mt-6 max-w-[1240px] text-4xl leading-[1.2] text-evergreen sm:text-5xl lg:text-[3.5rem]"
        >
          {headline}
        </h2>
        <p
          data-arrive
          className="mt-10 max-w-[940px] text-lg leading-[1.5] font-medium text-charcoal/92 sm:text-2xl"
        >
          {lede}
        </p>
      </div>

      <div className={`${COLUMN} relative pt-10 pb-16 lg:pt-20 lg:pb-24`}>
        {/* ONE ROW OF FOUR — the house pattern, and the same grid The Record
            §07, /partnerships §06 and the shared ContactDoors all use:
            `gap-4 sm:grid-cols-2 lg:grid-cols-4`. Two-up on tablet, and a
            swipe rail on a phone — `CardRail` supplies the row and leaves the
            grid from 640 up exactly as it was.

            It replaces a diamond arrangement that set the four around the
            artist's spiral with the lede's clauses as connectors between them.
            That was the frame's composition, and it was the only four-card row
            on the site laid out that way — a reader arriving from The Record or
            Partnerships met a different object doing the same job. The spiral
            stays as ground artwork; the chain it carried is the lede directly
            above, stated in full, which is where the argument actually lives.

            The card itself is unchanged: it is `04 · The Record` §02's recipe —
            coloured ground, full-width image band, 35% scrim, one motif, then
            title, body and a verb-led label at the foot. */}
        {/* The four seating with `catch` overshoot (scenes.md:381) is the
            interiors pass — the rail arrives as one quiet unit until then. */}
        <div data-arrive>
          <CardRail columns="sm:grid-cols-2 lg:grid-cols-4">
          {whatWeDo.areas.map((area, i) => {
            const photo = photoById(AREA_PHOTOS[i]);
            return (
              <a
                key={area.title}
                href={area.cta.href}
                className={`relative flex flex-col overflow-hidden rounded-3xl lg:min-h-[28.75rem] ${AREA_GROUNDS[i]} text-canvas`}
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
                  <p className="mt-3.5 text-[0.9375rem] leading-[1.5] text-canvas/86">
                    {area.body}
                  </p>
                  {/* Verb-led. Never a route path. */}
                  <p className="eyebrow mt-auto pt-6 text-xs tracking-[0.08em] text-gold">
                    {area.cta.label} →
                  </p>
                </div>
              </a>
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
 * ⚠ THE HEADLINE SLOT IS DELIBERATELY EMPTY. Every other section on this page
 * lifts its headline out of the draft's opening sentence; this section has no
 * opening sentence, so the slot renders the absence as a bracketed marker
 * rather than being filled with something invented or quietly closed up.
 * `docs/design/lofi-spec.md:491-495` is the rule; this is the exception it
 * names.
 *
 * Each value arrives as a lede and then a conclusion set at 44 — the sentence
 * that actually constrains a decision, landing on its own after a beat. The
 * split is the paragraph's last sentence, derived rather than restated.
 *
 * ⚠ R22 — the draft calls reciprocity the Ngapartji-Ngapartji principle, which
 * is Western Desert language and not Iningai. The draft raises it against
 * itself and the note renders; it is Suzanne's to resolve.
 *
 * The band is a rest scene, full bleed, sitting between the second value and
 * RECIPROCITY. `frame` grade: the notes record at least four people cropped to
 * hands and one of them a child, and no faces at all in the frame.
 */
export function HowWeWork() {
  return (
    <section
      data-ab="how-we-work"
      className="relative overflow-hidden bg-roasted text-canvas"
    >
      <RingArtwork
        piece="a"
        className="-left-56 top-[34%] w-[47.5rem] -rotate-11 opacity-[0.07]"
      />

      <div className={`${COLUMN} relative pt-16 lg:pt-24`}>
        <p
          data-arrive
          className="eyebrow text-base leading-[1.5] tracking-[0.08em] text-gold sm:text-2xl"
        >
          {howWeWork.title}
        </p>
        {/* The absence, marked. Not a headline, and not nothing. */}
        <p
          data-placeholder="no-headline"
          className="mt-4 max-w-[900px] text-base leading-[1.5] text-canvas/42"
        >
          [ no headline — the draft gives this section no opening sentence ]
        </p>
      </div>

      {howWeWork.values.map((value, i) => {
        const parts = sentences(value.body);
        const conclusion = parts[parts.length - 1];
        const lede = parts.slice(0, -1).join(" ");

        return (
          <div key={value.title}>
            {/* The band lands before the third value, not after the second —
                it is the rest scene RECIPROCITY arrives out of. */}
            {i === 2 ? (
              <figure className="relative mt-16 mb-4 lg:mt-16">
                <div
                  data-motion={RECIPROCITY?.grade ?? "frame"}
                  className="relative h-[40svh] w-full overflow-hidden lg:h-[56svh]"
                >
                  <MediaOrField
                    src={RECIPROCITY?.src ?? null}
                    alt="Ochre-marked adult palms held out over a grinding stone toward a child's"
                    sizes="(min-width: 1024px) 100vw, 260vw"
                    fieldClass="bg-charcoal/40"
                  />
                </div>
                <figcaption
                  className={`${COLUMN} mt-6 text-base leading-[1.5] text-canvas/75`}
                >
                  Ochre, prepared by hand.
                </figcaption>
              </figure>
            ) : null}

            <div className={`${COLUMN} relative pt-12 lg:pt-16`}>
              {/* The thread, one line again. The FIRST value's rule and title
                  are the landing of seam 04 → 05 — the frame's "bullet of
                  COUNTRY FIRST" is not built as an element, so the contracted
                  ring hands off to this rule and eyebrow instead. */}
              <div
                aria-hidden
                data-ab-rule={i === 0 ? "value" : undefined}
                className="h-[2px] w-full bg-gold/55"
              />
              <p
                data-ab-eyebrow={i === 0 ? "" : undefined}
                className="eyebrow mt-5 text-xs tracking-[0.08em] text-gold"
              >
                {value.title}
              </p>
              <p className="mt-4 max-w-[820px] text-lg leading-[1.5] font-medium text-canvas/86 sm:text-2xl">
                {lede}
              </p>
              <p className="headline mt-8 max-w-[1000px] text-2xl leading-[1.23] sm:text-[2.75rem]">
                {conclusion}
              </p>
            </div>
          </div>
        );
      })}

      {/* §04's foot. This was the editorial note's container; the notes came off
          the page on 11 September 2026 (user direction) and the padding stays,
          because it is the air between RECIPROCITY and seam 05 -> 06's navy
          crest, which is pulled up above §06's own box. */}
      <div aria-hidden className={`${COLUMN} pt-10 pb-16 lg:pt-20 lg:pb-24`} />
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
          deletes it. The rings re-clip on their own layer, as §02 and §04. */}
      <WaveDivider ground="var(--color-midnight)" hook="wave" />
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

      {/* Seam 06 → 07 lifts THIS wrapper (`overlap`, the page's one loud
          transition effect): the board recedes and dims as the people's
          off-white wave rides over it. */}
      <div data-ab-lift className={`${COLUMN} relative pt-16 pb-16 lg:pt-24 lg:pb-28`}>
        <p
          data-arrive
          className="eyebrow text-base leading-[1.5] tracking-[0.08em] text-gold sm:text-2xl"
        >
          {whoDecides.title}
        </p>
        <h2
          data-arrive
          className="headline mt-6 max-w-[1180px] text-4xl leading-[1.2] sm:text-5xl lg:text-[3.5rem]"
        >
          {claim[0]}
        </h2>

        {/* True, and not the point. */}
        <p className="mt-14 max-w-[940px] text-lg leading-[1.5] font-medium text-canvas/45 sm:text-2xl">
          {claim[1]}
        </p>
        <p className="mt-8 max-w-[940px] text-lg leading-[1.5] font-medium text-canvas/45 sm:text-2xl">
          {claim[2]}
        </p>

        {/* The thread, before it acquires a date. */}
        <div aria-hidden className="mt-16 h-[2px] w-[24rem] max-w-full bg-ochre" />

        {/* ⚠ Future tense. It stays that way until the group is sitting. */}
        <p className="mt-9 max-w-[940px] text-lg leading-[1.5] font-medium text-canvas/95 sm:text-2xl">
          {whoDecides.body[1]}
        </p>

        {/* The thread acquires a date. The rule draws scrubbed, at reading
            pace, and each beat seats with a short catch as the draw reaches
            it — the transition channel this section is loud in. */}
        <div className="relative mt-32">
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
                <p className="eyebrow mt-2 text-xs tracking-[0.08em] text-ochre">
                  {beat}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Reserved for the interiors pass: 2031 is stated and held, never
            counted up to. `data-ab-date` is the attachment point; nothing
            animates it in the seam pass. */}
        <p
          data-ab-date
          className="headline mt-16 text-6xl leading-[1.2] text-gold sm:text-8xl lg:mt-16 lg:text-[5rem]"
        >
          2031
        </p>
        <p className="mt-10 max-w-[940px] text-lg leading-[1.5] font-medium text-canvas/90 sm:text-2xl">
          {whoDecides.body[2]}
        </p>

        <div aria-hidden className="mt-20 h-px w-full bg-canvas/20" />
        {/* The frame renders this label in full. It names what is there, not
            where the file is. */}
        <a
          href={whoDecides.cta.href}
          className="eyebrow mt-11 block max-w-[1100px] text-xs tracking-[0.08em] text-gold"
        >
          {whoDecides.cta.label} →
        </a>
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
