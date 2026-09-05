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
import { EditorialNote } from "@/components/ui/EditorialNote";
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
 * ⚠ THIS PAGE IS STATIC BY DECISION. It mounts no motion module and carries no
 * scroll animation, no hover transition and no `data-*` motion hooks. It
 * renders the same with JavaScript on or off. The frame's layer names describe
 * a motion build — a 300vh pin on §03, Group G travelling the page, six F9
 * releases — and none of it is built. Those names are documented at
 * `docs/motion/scenes.md:331-390`; do not re-add any of it piecemeal.
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
 * The column. Every body in the frame measures at x=100 of 1440, so the
 * padding alone is the column — `lg:px-25` and NO max-width. Adding
 * `mx-auto max-w-7xl` centres a 1280 box in 1440 and lands content at x=180,
 * which is the mistake The Record already made and documented.
 */
const COLUMN = "w-full px-6 lg:px-25";

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
const PEOPLE_A = photoById("op-card-01");
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
    <section className="relative bg-charcoal text-canvas">
      {/* Flex-centred, not absolutely centred. The copy is a flow child, so a
          short viewport makes this block taller instead of clipping the
          standfirst — `min-h` can only grow for content that is in the flow. */}
      {/* 990px of an 18,474px frame that runs at 9px per vh — so the hero is
          110vh, not the round 100 it was. `min-h` rather than `h`: the copy is
          a flow child, so a short viewport grows the block instead of clipping
          the standfirst. */}
      <div className="relative flex min-h-[110svh] w-full flex-col justify-center overflow-hidden">
        <div
          data-motion={HERO?.grade ?? "full"}
          className="absolute inset-0"
        >
          <MediaOrField
            src={HERO?.src ?? null}
            alt="Three figures on a ledge beneath a long banded sandstone escarpment"
            sizes="100vw"
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
          className="absolute inset-x-0 top-[38%] h-[37%]"
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

        <div className={`${COLUMN} relative py-32`}>
          <p className="eyebrow text-xl leading-[1.5] tracking-[0.08em] text-gold sm:text-2xl">
            {aboutHero.eyebrow}
          </p>
          <h1 className="headline mt-4 max-w-[1100px] text-5xl leading-[1.2] sm:text-7xl lg:text-[6rem]">
            {aboutHero.title}
          </h1>
          <p className="mt-8 max-w-[900px] text-lg leading-[1.5] font-medium sm:text-2xl">
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
    <section className="relative bg-canvas text-charcoal">
      {/* ⚠ NO `overflow-hidden` ON THIS SECTION. The wave is pulled entirely
          above the section's own box so that it lands on the hero photograph
          below it — a clip here deletes it outright. The artwork is clipped on
          its own layer instead, which it needs (ring-b is 1000px at left-54%
          and would otherwise scroll the page sideways). */}
      <WaveDivider ground="var(--color-canvas)" />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <RingArtwork
          piece="b"
          tone="roasted"
          className="top-[14%] left-[54%] w-[62.5rem] rotate-7 opacity-[0.08]"
        />
      </div>

      <div className={`${COLUMN} relative pt-40`}>
        <p className="eyebrow text-xl leading-[1.5] tracking-[0.08em] text-burnt sm:text-2xl">
          {whatWeAre.title}
        </p>

        {/* The long name, held back so the short one can land. */}
        <p className="headline mt-8 max-w-[1240px] text-3xl leading-[1.2] text-evergreen/30 sm:text-5xl lg:text-[4rem]">
          {legalName}
        </p>
        <p className="headline mt-6 max-w-[1240px] text-4xl leading-[1.2] text-evergreen sm:text-6xl lg:text-[6rem]">
          {shortName}
        </p>

        <p className="mt-16 max-w-[780px] text-lg leading-[1.5] font-medium text-charcoal/92 sm:text-2xl">
          {whatWeAre.body[1]}
        </p>
        <p className="mt-8 max-w-[780px] text-lg leading-[1.5] font-medium text-charcoal/92 sm:text-2xl">
          {whatWeAre.body[2]}
        </p>
      </div>

      {/* The road. Full bleed — a screen, not an inset. */}
      <figure className="relative mt-28">
        <div
          data-motion={ROAD?.grade ?? "full"}
          className="relative h-[44svh] w-full overflow-hidden lg:h-[62svh]"
        >
          <MediaOrField
            src={ROAD?.src ?? null}
            alt="An aerial view down a straight sandy two-wheel track through low bushland"
            sizes="100vw"
            fieldClass="bg-roasted/40"
          />
        </div>
        <figcaption className={`${COLUMN} mt-6 text-base leading-[1.5] text-roasted`}>
          The way in. Turraburra is 120km north of Barcaldine.
        </figcaption>
      </figure>

      <div className={`${COLUMN} relative pt-32 pb-40`}>
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

        <div className="mt-14 max-w-[900px]">
          <EditorialNote>
            <p>{whatWeAre.pending}</p>
          </EditorialNote>
        </div>
      </div>

      {/* The seam. This rule runs past the column and becomes §03's. */}
      <div
        aria-hidden
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
      className="relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(180deg, #f6f6ec 0%, #f1f0e5 26%, #22372b 40%, #090e12 53%, #090e12 100%)",
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
          picture belongs to the claims, and the question is asked on nothing. */}
      <div className="relative">
        <div data-motion={QUESTION?.grade ?? "full"} className="absolute inset-0 opacity-50">
          <MediaOrField
            src={QUESTION?.src ?? null}
            alt="Open Country, wide — mulga running to the horizon"
            sizes="100vw"
            fieldClass="bg-evergreen/40"
          />
        </div>
        {/* The coming-apart. Resolves to solid charcoal before the block ends,
            so the ground has taken the photograph by the time the copy does. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(246,246,236,0.6) 0%, rgba(241,240,229,0.58) 40%, rgba(34,55,43,0.92) 66%, #090e12 88%, #090e12 100%)",
          }}
        />

        <div className={`${COLUMN} relative pt-36 pb-[34svh]`}>
          <p className="eyebrow text-xl leading-[1.5] tracking-[0.08em] text-burnt sm:text-2xl">
            {whyWeExist.title}
          </p>
          <p className="mt-10 max-w-[940px] text-lg leading-[1.5] font-medium text-charcoal/90 sm:text-2xl">
            {whyWeExist.body[0]}
          </p>
          <p className="mt-10 max-w-[940px] text-lg leading-[1.5] font-medium text-charcoal/90 sm:text-2xl">
            {whyWeExist.body[1]}
          </p>
        </div>
      </div>

      {/* The screen has cleared. Nothing behind the question but ground. */}
      <div className={`${COLUMN} relative pb-40`}>
        <blockquote>
          <p className="headline max-w-[1240px] text-4xl leading-[1.2] text-canvas sm:text-6xl lg:text-[6rem]">
            {whyWeExist.quote}
          </p>
          {/* The question contracts into this. The thread starts here and runs
              to §09, where it arrives. */}
          <div aria-hidden className="mt-14 h-[3px] w-[26.5rem] max-w-full bg-ochre" />
          <footer className="mt-4 max-w-[900px] text-base leading-[1.5] text-canvas/72">
            {whyWeExist.attribution}
          </footer>
        </blockquote>

        <p className="mt-24 max-w-[940px] text-lg leading-[1.5] font-medium text-canvas/90 sm:text-2xl">
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
    <section className="relative bg-charcoal">
      <div
        data-motion={BREATH?.grade ?? "full"}
        className="relative h-[55svh] w-full overflow-hidden"
      >
        <MediaOrField
          src={BREATH?.src ?? null}
          alt="Open woodland at sunset, the sun low behind the trunks"
          sizes="100vw"
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
    <section className="relative bg-canvas text-charcoal">
      {/* Figma 2668:20274 — seated on the BREATH photograph, not under it, so
          the photograph's horizon becomes the baseline this section sits on. */}
      <WaveDivider ground="var(--color-canvas)" />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <RingArtwork
          piece="b"
          tone="roasted"
          className="top-[26%] left-[52%] w-[62.5rem] -rotate-6 opacity-[0.09]"
        />
      </div>

      <div className={`${COLUMN} relative pt-36`}>
        <p className="eyebrow text-xl leading-[1.5] tracking-[0.08em] text-burnt sm:text-2xl">
          {whatWeDo.title}
        </p>
        <h2 className="headline mt-6 max-w-[1240px] text-3xl leading-[1.2] text-evergreen sm:text-5xl lg:text-[4rem]">
          {headline}
        </h2>
        <p className="mt-10 max-w-[940px] text-lg leading-[1.5] font-medium text-charcoal/92 sm:text-2xl">
          {lede}
        </p>
      </div>

      <div className={`${COLUMN} relative pt-20 pb-36`}>
        {/* ONE ROW OF FOUR — the house pattern, and the same grid The Record
            §07, /partnerships §06 and the shared ContactDoors all use:
            `gap-4 sm:grid-cols-2 lg:grid-cols-4`. Two-up on tablet, stacked on
            a phone.

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whatWeDo.areas.map((area, i) => {
            const photo = photoById(AREA_PHOTOS[i]);
            return (
              <a
                key={area.title}
                href={area.cta.href}
                className={`relative flex min-h-[30rem] flex-col overflow-hidden rounded-3xl ${AREA_GROUNDS[i]} text-canvas`}
              >
                <div className="relative aspect-[380/232] w-full shrink-0 overflow-hidden">
                  <div data-motion={photo?.grade ?? "full"} className="absolute inset-0">
                    <MediaOrField
                      src={photo?.src ?? null}
                      alt={photo?.subject ?? ""}
                      sizes="(min-width: 1024px) 298px, (min-width: 640px) 50vw, 100vw"
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
                  <h3 className="headline text-2xl leading-[1.2]">
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
    <section className="relative overflow-hidden bg-roasted text-canvas">
      <RingArtwork
        piece="a"
        className="-left-56 top-[34%] w-[47.5rem] -rotate-11 opacity-[0.07]"
      />

      <div className={`${COLUMN} relative pt-36`}>
        <p className="eyebrow text-xl leading-[1.5] tracking-[0.08em] text-gold sm:text-2xl">
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
              <figure className="relative mt-28 mb-4">
                <div
                  data-motion={RECIPROCITY?.grade ?? "frame"}
                  className="relative h-[40svh] w-full overflow-hidden lg:h-[56svh]"
                >
                  <MediaOrField
                    src={RECIPROCITY?.src ?? null}
                    alt="Ochre-marked adult palms held out over a grinding stone toward a child's"
                    sizes="100vw"
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

            <div className={`${COLUMN} relative pt-16`}>
              {/* The thread, one line again. */}
              <div aria-hidden className="h-[2px] w-full bg-gold/55" />
              <p className="eyebrow mt-5 text-xs tracking-[0.08em] text-gold">
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

      <div className={`${COLUMN} relative pt-20 pb-36`}>
        <div className="max-w-[900px]">
          <EditorialNote tone="canvas">
            <p>{howWeWork.pending}</p>
          </EditorialNote>
        </div>
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
 * across this section carrying three beats, and 2031 is set at display size —
 * stated and held, never counted up to. It is the date this page is
 * accountable to.
 */
const BEATS = ["Quarterly", "Annual general meeting", "2031 · the review"] as const;
/** The frame's marker positions, as fractions of the 1240 column. */
const BEAT_X = ["lg:left-0", "lg:left-[33.9%]", "lg:left-[73.4%]"] as const;

export function WhoDecides() {
  const claim = sentences(whoDecides.body[0]);

  return (
    <section className="relative overflow-hidden bg-midnight text-canvas">
      <RingArtwork
        piece="b"
        className="top-[8%] left-[55%] w-[56.25rem] rotate-9 opacity-15"
      />
      <RingArtwork
        piece="a"
        className="-left-64 top-[56%] w-[51.25rem] -rotate-13 opacity-[0.13]"
      />

      <div className={`${COLUMN} relative pt-36 pb-40`}>
        <p className="eyebrow text-xl leading-[1.5] tracking-[0.08em] text-gold sm:text-2xl">
          {whoDecides.title}
        </p>
        <h2 className="headline mt-6 max-w-[1180px] text-3xl leading-[1.2] sm:text-5xl lg:text-[4rem]">
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

        {/* The thread acquires a date. */}
        <div className="relative mt-32">
          <div aria-hidden className="h-[2px] w-full bg-ochre" />
          <div className="mt-6 flex flex-col gap-5 lg:mt-0 lg:block lg:h-16">
            {BEATS.map((beat, i) => (
              <div key={beat} className={`lg:absolute lg:top-0 ${BEAT_X[i]}`}>
                <span
                  aria-hidden
                  className="block h-[18px] w-[18px] -translate-y-[10px] rounded-full bg-ochre"
                />
                <p className="eyebrow mt-2 text-xs tracking-[0.08em] text-ochre">
                  {beat}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="headline mt-28 text-6xl leading-[1.2] text-gold sm:text-8xl lg:text-[6rem]">
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

        <div className="mt-16 max-w-[900px]">
          <EditorialNote tone="canvas">
            <p>{whoDecides.pending}</p>
          </EditorialNote>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   07 · The people — two frames and one absence · 145vh
   ------------------------------------------------------------------------- */

/**
 * ⚠⚠ R24 GOVERNS THIS SECTION. Nobody in either photograph has been asked
 * whether they may be named or shown. Ivy's photo clearances are USE
 * clearances, not IDENTIFICATION consent — you may show a face, you may not
 * say whose it is. So both frames carry ⚠ CONSENT UNRESOLVED in the markup,
 * not in a comment and not in a layer name: a screenshot circulated without
 * the marker is exactly how a placeholder becomes a claim.
 *
 * ⚠ THE TWO PORTRAITS ARE THE SAME MAN. `brand/photo-notes/batch-1.md:355`
 * opens 378A7604_1.77.4 with "The same older man" — the same person as
 * 378A7604_1.80.1 beside it. The library holds no second cleared face, the
 * frame draws two slots, and inventing a third person is not an option. It is
 * recorded rather than disguised and it goes when real portraits arrive.
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
 * ⚠ NO WAVE, DELIBERATELY. The frame seats a wave only where a full-bleed
 * PHOTOGRAPH hands off to a ground — §01's hero and §03b's breath, and nowhere
 * else on the page. §06 is navy and this is canvas: a ground-to-ground seam,
 * and the page cuts those hard. A wave here would invent a transition the
 * design does not make, so this section keeps its clip.
 */
export function ThePeople() {
  return (
    <section className="relative overflow-hidden bg-canvas text-charcoal">
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

      <div className={`${COLUMN} relative pt-40 pb-36`}>
        <p className="eyebrow text-xl leading-[1.5] tracking-[0.08em] text-burnt sm:text-2xl">
          {thePeople.title}
        </p>
        <h2 className="headline mt-6 max-w-[1180px] text-3xl leading-[1.2] text-evergreen sm:text-5xl lg:text-[4rem]">
          {sentences(thePeople.body)[0]}
        </h2>
        <p className="mt-10 max-w-[900px] text-lg leading-[1.5] font-medium text-charcoal/92 sm:text-2xl">
          {sentences(thePeople.body).slice(1).join(" ")}
        </p>

        {/* 560 · 370 · 250 on 30px gutters is exactly the frame's 1240 column,
            so the three run as proportions of whatever column they get rather
            than as fixed widths. As fixed widths they needed 1440px and the
            section's overflow-hidden was clipping the third slot at every
            viewport. The vertical offsets are the frame's: +60, +110. */}
        <div className="mt-16 flex flex-col gap-8 lg:grid lg:grid-cols-[560fr_370fr_250fr] lg:items-start lg:gap-[1.875rem]">
          {[PEOPLE_A, PEOPLE_B].map((photo, i) => (
            <div
              key={photo?.id ?? i}
              className={`relative w-full overflow-hidden rounded-sm ${
                i === 0 ? "aspect-square" : "aspect-[370/500] lg:mt-[3.75rem]"
              }`}
            >
              <div data-motion={photo?.grade ?? "frame"} className="absolute inset-0">
                <MediaOrField
                  src={photo?.src ?? null}
                  alt=""
                  sizes="(min-width: 1024px) 560px, 100vw"
                  fieldClass="bg-evergreen/40"
                />
              </div>
              {/* On the image, not in a comment. */}
              <p
                data-placeholder="consent-unresolved"
                className="eyebrow absolute top-4 left-4 rounded-xs bg-charcoal/70 px-3 py-1.5 text-[0.625rem] text-canvas"
              >
                ⚠ Consent unresolved
              </p>
            </div>
          ))}

          {/* The absence, drawn. It is the same height as a photograph and it
              does not collapse. */}
          <div
            data-placeholder="no-archival-photograph"
            role="img"
            aria-label="No archival photograph exists for this slot"
            className="flex aspect-[250/410] w-full items-end rounded-sm border-[1.5px] border-dashed border-oxide/60 p-5 lg:mt-[6.875rem]"
          >
            <p className="eyebrow text-[0.625rem] leading-[1.6] tracking-[0.08em] text-oxide">
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
    <section
      id="partners"
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

      <div className={`${COLUMN} relative pt-36 pb-36`}>
        <p className="eyebrow text-xl leading-[1.5] tracking-[0.08em] text-gold sm:text-2xl">
          {partners.title}
        </p>
        <h2 className="headline mt-6 max-w-[1180px] text-3xl leading-[1.2] sm:text-5xl lg:text-[4rem]">
          {`${claim}.`}
        </h2>
        <p className="mt-10 max-w-[900px] text-lg leading-[1.5] font-medium text-canvas/88 sm:text-2xl">
          {lede}
        </p>

        <div className="mt-16">
          {partners.groups.map((group, i) => (
            <div key={group.title} className={i === 0 ? "" : "mt-16"}>
              <DottedRule tone="gold" className="opacity-85" />
              <p className="eyebrow mt-6 text-xs tracking-[0.08em] text-gold">
                {group.title}
              </p>
              <p className="headline mt-5 max-w-[1240px] text-xl leading-[1.53] text-canvas/95 sm:text-[1.875rem]">
                {group.names.join("   ·   ")}
                {/* The list is short and the draft says so. */}
                {i === partners.groups.length - 1 ? (
                  <span data-placeholder="add-partner" className="text-canvas/45">
                    {"   ·   [ add ]"}
                  </span>
                ) : null}
              </p>
            </div>
          ))}
        </div>

        <a
          href={partners.cta.href}
          className="eyebrow mt-20 block text-xs tracking-[0.08em] text-gold"
        >
          {partners.cta.label} →
        </a>

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
      className="relative scroll-mt-28 overflow-hidden bg-charcoal text-canvas"
    >
      <RingArtwork
        piece="b"
        className="top-[7%] left-[64%] w-[56.25rem] opacity-8"
      />
      <RingArtwork
        piece="a"
        className="-left-44 top-[54%] w-[36.6875rem] opacity-7"
      />

      <div className={`${COLUMN} relative pt-36 pb-40`}>
        <p className="eyebrow text-xl leading-[1.5] tracking-[0.08em] text-ochre sm:text-2xl">
          Get in touch
        </p>
        <h2 className="headline mt-6 max-w-[1180px] text-3xl leading-[1.2] sm:text-5xl lg:text-[4rem]">
          Different things go to different people.
        </h2>
        <p className="mt-8 max-w-[900px] text-lg leading-[1.5] font-medium text-canvas/88 sm:text-2xl">
          {contactRoutes.title} {sentences(contactRoutes.lede).slice(1).join(" ")}
        </p>

        <div className="mt-14">
          <ContactDoors
            grounds={DOOR_GROUNDS}
            glyphs={DOOR_GLYPHS}
            accent="text-ochre"
          />
        </div>

        {/* The thread, arrived. */}
        <div aria-hidden className="mt-24 h-[2px] w-full bg-ochre" />

        {/* Three across, two rows, 390 wide — the same fix already made on
            Our People, which carries this block word for word under D5. */}
        {/* Three across, two rows, 390 wide — the same block Our People
            carries word for word under D5. */}
        <div className="mt-10">
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
