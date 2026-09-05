import { photoById } from "@/content/kit";
import {
  acknowledgements,
  culturalAdvice,
  governance,
  ourPeopleHero,
  suzanneProfile,
  team,
} from "@/content/our-people";
import { contactRoutes } from "@/content/contact";
import { ContactDetails } from "@/components/sections/ContactDetails";
import { ContactDoors } from "@/components/sections/ContactDoors";
import { EditorialNote } from "@/components/ui/EditorialNote";
import { MediaOrField } from "@/components/ui/MediaOrField";
import {
  ClusterArtwork,
  RingArtwork,
  SeamGlyph,
  WaveDivider,
} from "@/components/ui/Furniture";
import type { SeamGlyphMotif } from "@/components/ui/Furniture";

/**
 * /our-people — "Our people", at hi-fi weight.
 * Figma 2841:25358 (06 · Our People — HI-FI · Desktop · the page gathers),
 * 1440 x 16,515px = 1,835vh across eleven frames. The verb is GATHERS.
 *
 *   00  The advisory — the one thing on this page that never moves
 *   01  Hero — the picture leaves the screen and survives inside the word
 *   02  Suzanne Thompson — her own photograph, and the ground that follows it
 *   02b Her decision — the operative sentence on the site, alone on a screen
 *   03  THE GATHERING — six cards, one name
 *   03b BREATH — one photograph, no words
 *   04  Board and cultural governance — drawn, not filled
 *   05  The ones who got us here — the inversion
 *   05b BREATH — the pivot from the ones who are gone to the ask
 *   06  Get in touch — four doors
 *   07  Footer — already built to Marc's styling; the page declares its ground
 *
 * ⚠⚠ WHY THIS PAGE IS BUILT THE WAY IT IS — R24.
 *
 * Eight of the nine people here have no name, and the blocker is not missing
 * copy. Consent to be named and photographed has never been sought, from any
 * of them. Ivy's photo clearances of 31 August and 1 September are USE
 * clearances, not IDENTIFICATION consent: you may show a face, you may not say
 * whose it is.
 *
 * So the page is built to make the gap legible rather than to hide it. The
 * rules below are R24's mitigation and are not styling preferences:
 *
 *   · A held name is a GOLD RULE at the width a name would have taken, on the
 *     baseline it would have used. Never the string "[ Name ]" — which
 *     src/content/our-people.ts already refuses in code by modelling a
 *     placeholder as `name: null` — and never an invented sentence like
 *     "Name to be confirmed", which the v1 build of this page rendered.
 *   · A missing biography renders as NOTHING. The v1 build invented "One or
 *     two lines — who they are and what they do here"; that is gone.
 *   · NOTHING PULSES, SHIMMERS OR BREATHES. A held card is not a loading
 *     skeleton. A skeleton says "this is arriving", and these names are not
 *     arriving until somebody is asked. Stillness is the honest state and it
 *     must survive any later polish pass.
 *   · EVERY FACE IS BADGED IN THE MARKUP, never only in a comment or a layer
 *     name. A screenshot circulated without the badge is exactly how a
 *     placeholder becomes a claim.
 *   · Held cards are the same size and the same ground as the named one, with
 *     the role at full weight. All six share ONE ground: varying it would code
 *     a difference between the named card and the five held ones, and §03's
 *     whole argument is that there is none.
 *   · §05 is the inversion. It is the only section where a name is set large,
 *     because the living are unnamed for want of consent and the ones who got
 *     us here are named because it has been given. The client's own sentence
 *     makes the argument: "We name them because that is how the record stays
 *     straight."
 *
 * ⚠ This page must not go to `in-review` until the consent question is
 * answered. Building it does not make it a directory.
 *
 * ⚠ CR4 is HELD: "settler" in Graham Ambridge's biography is his own word
 * about himself and stays unedited in src/content/our-people.ts.
 *
 * ⚠ D16 is open on the page's own title — CR10 asks whether "our people" can
 * be said in this voice. Suzanne decides it.
 *
 * ⚠ THIS PAGE IS STATIC, AND THAT IS THE DESIGN — not a stage waiting to be
 * finished. It carries no scroll animation, no reveal, no pinned section and
 * no motion module, and the `data-*` hooks that a motion pass would have used
 * are gone rather than left dangling.
 *
 * The page therefore renders identically with JavaScript on or off, and under
 * `prefers-reduced-motion` there is nothing to reduce. What the Figma frame's
 * NOTE lane describes as motion — the knockout scrub, the word-by-word dim,
 * the gathering's scatter and escape, the ground wipe — is expressed here as
 * the FINISHED STATE of each of those moves, which is what the reader was
 * always going to be left looking at.
 *
 * TYPE. Figma sets the display face as Baloo 2 ExtraBold; the built page uses
 * Block Berthold via `.headline`, which is the repo-wide decision in fonts.css
 * and not this page's to change. Colour follows the palette tokens rather than
 * the frame's raw hexes — the frame's #cb7722 eyebrow on canvas is `burnt` and
 * its #fbae3d on dark is `gold`, which is the convention the other three hi-fi
 * pages already use.
 */

/* -------------------------------------------------------------------------
   The library, and the column
   ------------------------------------------------------------------------- */

/**
 * ⚠ EVERY FACE BELOW IS A PLACEHOLDER, including the one on the named card.
 * No photograph of Graham Ambridge exists in any batch. See the block comment
 * on the Our People batch in src/content/kit.ts.
 *
 * Suzanne is the exception and is not in this map: she is the one person shown
 * as herself, and `lw-hero` is her frame (378A7604_1.40.2).
 */
const HERO = photoById("op-hero");
const SUZANNE = photoById("lw-hero");
const BREATH_TEAM = photoById("op-breath-01");
const BREATH_PIVOT = photoById("op-breath-02");

/**
 * The column. Every body in the frame measures at x=100 of 1440, so the
 * padding alone is the column — `lg:px-25` and NO max-width. Adding
 * `mx-auto max-w-7xl` centres a 1280 box in 1440 and lands content at x=180,
 * which is the mistake The Record already made and documented.
 */
const COLUMN = "w-full px-6 lg:px-25";

/** boomerang, circle, starburst — the frame's rotation, in repo glyph names. */
const CARD_GLYPHS: SeamGlyphMotif[] = ["c", "a", "b"];

/* -------------------------------------------------------------------------
   00 · The advisory — the page's one still element · 45vh
   ------------------------------------------------------------------------- */

/**
 * Australian cultural protocol, and the draft puts it first for that reason.
 * Set in the body face at 24 rather than a display face, because it is a
 * protocol notice and not a headline.
 *
 * No dismiss, no collapse, NOTHING ABOVE IT. It is also the only element on
 * the page that never moves: everything else gathers, and this holds. The
 * hero photograph rises from beneath it as the reader scrolls; the band itself
 * does not shift.
 */
export function OurPeopleAdvisory() {
  return (
    <section
      className="relative flex min-h-[45svh] items-center bg-charcoal text-canvas"
    >
      <div className={`${COLUMN} pt-28`}>
        {/* the threshold — gold, 3px */}
        <div aria-hidden className="h-[3px] w-[72px] bg-gold" />
        <p className="mt-10 max-w-[1040px] text-lg leading-[1.5] font-medium sm:text-2xl">
          {culturalAdvice}
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   01 · Hero — the picture survives inside the word · 210vh
   ------------------------------------------------------------------------- */

/**
 * A full-bleed photograph, hard cut into charcoal, then the page's name at 200
 * carrying that same photograph as its fill. The caption sits BELOW the cut
 * rather than over the grass, where it was unreadable.
 *
 * The photograph is held: there are people in it, so no push-in and no Ken
 * Burns — and on a static page, nothing moves at all. The fill sits at the
 * crop the frame chose (50% / 17.88% of a 108.7% x 408.16% background) and
 * stays there.
 *
 * ⚠ KNOCKOUT FALLBACK. `background-clip: text` with transparent ink is
 * invisible where the property is unsupported, which would delete the page's
 * title rather than degrade it. The ink is `text-canvas` by default and only
 * goes transparent inside a `supports-` guard, so the unsupported case gets a
 * solid off-white headline — the fallback the note asks for.
 *
 * ⚠ ⟡ STAND-IN — crew-walking-burnt carries two identifiable adults. Replace
 * with a cleared frame of Iningai Rangers on Country.
 */
export function OurPeopleHero() {
  return (
    <section className="relative bg-charcoal text-canvas">
      {/* The photograph. 1150 of the frame's 1890, hard-cut into charcoal at
          its foot — the scrim carries the cut so it does not read as a seam. */}
      <div className="relative h-[128svh] w-full overflow-hidden">
        <div
          data-media
          data-motion={HERO?.grade ?? "full"}
          className="absolute inset-0"
        >
          <MediaOrField
            src={HERO?.src ?? null}
            alt="Rangers walking burnt Country"
            sizes="100vw"
            priority
            fieldClass="bg-charcoal"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(9,14,18,0) 0%, rgba(9,14,18,0.12) 62%, rgba(9,14,18,0.72) 100%)",
          }}
        />
        <ClusterArtwork
          tone="gold"
          className="top-[14.8%] right-[7.4%] hidden w-28 lg:block"
        />
        <SeamGlyph
          motif="b"
          className="top-[81.7%] right-[7.85%] hidden w-11 lg:block"
        />

        {/* ⟡ STAND-IN. On the image, not only in a layer name — the marker
            stays because it flags unreal content. What it must be replaced BY
            (a cleared frame of Iningai Rangers on Country) is the notes lane's
            job, not the page's. */}
        <p
          data-placeholder="stand-in"
          className="eyebrow absolute top-6 left-6 z-10 rounded-xs bg-charcoal/70 px-3 py-1.5 text-[0.625rem] text-canvas"
        >
          ⟡ Stand-in
        </p>
      </div>

      <div className={`${COLUMN} pt-8 pb-32`}>
        {/* Captioned by what the frame SHOWS, never by who the people are —
            which is the rule this caption obeys, not a sentence for a reader. */}
        <p className="max-w-[760px] text-sm leading-[1.5] text-canvas/60">
          Rangers walking burnt Country.
        </p>

        <div className="mt-20 text-center">
          <p
            className="eyebrow text-xl leading-[1.5] tracking-[0.08em] text-ochre sm:text-2xl"
          >
            {ourPeopleHero.eyebrow}
          </p>

          {/* Y1 · the picture leaves the screen and survives inside the word. */}
          <h1
            className="headline mt-4 bg-center bg-no-repeat bg-clip-text text-6xl leading-[1] text-canvas supports-[background-clip:text]:text-transparent sm:text-8xl lg:text-[12.5rem]"
            style={
              HERO
                ? {
                    backgroundImage: `url(${HERO.src})`,
                    backgroundSize: "108.7% 408.16%",
                    /* Longhands, not the shorthand: `knockout` reads
                       backgroundPositionY back off the inline style to centre
                       its travel on the frame's crop, and the shorthand does
                       not reliably read back. */
                    backgroundPositionX: "50%",
                    backgroundPositionY: "17.88%",
                  }
                : undefined
            }
          >
            {ourPeopleHero.title}
          </h1>

          <p
            className="mx-auto mt-8 max-w-[900px] text-lg leading-[1.5] font-medium sm:text-2xl"
          >
            {ourPeopleHero.standfirst}
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   02 · Suzanne Thompson — her own photograph, and the ground that follows it
   ------------------------------------------------------------------------- */

/**
 * The one person on this page shown as herself — 378A7604_1.40.2, identified
 * by Ivy, and the one identification that is not in question.
 *
 * FRAME GRADE. Her photograph holds still: no push-in, no Ken Burns, no
 * scrub. `data-motion` still records the grade in the DOM — it is the
 * permission, not a motion hook, and it should survive any later pass.
 *
 * ⚠ None of her frames may be reused in a team card — a reader would take her
 * for two people. Five more of her exist (1.10.1, 1.69.1, 1.69.5,
 * March22-1512, March22-1668) and they are alternates for THIS slot only.
 *
 * ⚠ Her photograph carries NO ARTWORK, deliberately. It is the one frame on
 * this page of a named, living person, and a decorative mark laid over her
 * portrait is a different act from one laid over Country.
 *
 * The quote sits low, with most of a screen of canvas above it, so the
 * testimony arrives after a pause rather than under a paragraph. The frame's
 * word-by-word `dim` is not built — the page is static — so the quote simply
 * reads at full strength, which is that effect's own end state.
 */
export function SuzanneTestimony() {
  return (
    <section className="relative bg-canvas text-charcoal">
      <WaveDivider ground="var(--color-canvas)" />

      <div className={`${COLUMN} pt-40 pb-32`}>
        <figure>
          <div
            data-media
            data-motion={SUZANNE?.grade ?? "frame"}
            className="relative aspect-[1240/620] w-full overflow-hidden"
          >
            <MediaOrField
              src={SUZANNE?.src ?? null}
              alt="Suzanne Thompson standing in the Country being brought back"
              sizes="(min-width: 1024px) 1240px, 100vw"
              fieldClass="bg-evergreen/40"
            />
          </div>
          <figcaption className="mt-5 max-w-[760px] text-[0.9375rem] leading-[1.5] text-charcoal/60">
            Standing in the Country being brought back.
          </figcaption>
        </figure>

        <p className="eyebrow mt-24 text-xl leading-[1.5] tracking-[0.08em] text-burnt sm:text-2xl">
          Iningai custodian
        </p>
        <h2 className="headline mt-3 max-w-[900px] text-5xl leading-[1.16] text-evergreen sm:text-7xl">
          {suzanneProfile.name}
        </h2>
        <p className="mt-5 max-w-[700px] text-xl leading-[1.5] font-semibold text-roasted">
          Founder and Managing Director
        </p>

        {/* Two columns at 600 of a 1240 measure, as drawn. */}
        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          {suzanneProfile.body.map((para) => (
            <p
              key={para.slice(0, 32)}
              className="max-w-[600px] text-lg leading-[1.5] font-medium sm:text-[1.3125rem]"
            >
              {para}
            </p>
          ))}
        </div>

        {/* The testimony. Sits low on purpose — a screen of canvas above it. */}
        <blockquote className="mt-56">
          <span
            aria-hidden
            className="headline block text-[10rem] leading-[1] text-ochre/30"
          >
            &ldquo;
          </span>
          <p
            className="headline mt-6 max-w-[1240px] text-5xl leading-[1.22] text-evergreen sm:text-7xl"
          >
            {suzanneProfile.quote}
          </p>
          <cite
            className="eyebrow mt-20 block text-xs text-burnt not-italic"
          >
            {suzanneProfile.name}
          </cite>
        </blockquote>

        {/* Her external roles are incomplete — a national emissions reduction
            board, and possibly others. The §02 note carries this as a HELD
            item, so it renders marked rather than being dropped: the note is
            the only record that this profile is unfinished. */}
        <EditorialNote
          label="Editorial note — not for publication"
          className="mt-20 max-w-[900px]"
        >
          <p>{suzanneProfile.pending}</p>
        </EditorialNote>
      </div>

    </section>
  );
}

/* -------------------------------------------------------------------------
   02b · Her decision — one sentence, one screen · 140vh · ROASTED
   ------------------------------------------------------------------------- */

/**
 * THE OPERATIVE SENTENCE ON THE WHOLE SITE. It is why the Truth page is held
 * by community and why CR4 and CR10 are both on hold.
 *
 * ⚠ It is NOT a pull quote and must not be styled as one. It is the only thing
 * on its screen.
 */
export function HerDecision() {
  return (
    <section
      className="relative flex min-h-[140svh] items-center bg-roasted text-canvas"
    >
      <WaveDivider ground="var(--color-roasted)" />
      <RingArtwork piece="a" className="-left-44 bottom-[8%] w-[36.7rem]" />
      <RingArtwork piece="b" className="top-[7%] left-[64.4%] w-[56.25rem]" />

      <div className={`${COLUMN} relative py-32`}>
        <p className="eyebrow text-xl leading-[1.5] tracking-[0.08em] text-gold sm:text-2xl">
          Who decides
        </p>
        <p className="headline mt-12 max-w-[1180px] text-4xl leading-[1.24] sm:text-6xl lg:text-[4.75rem]">
          {suzanneProfile.authority}
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   03 · THE GATHERING — six cards, one name · pinned 330vh (270vh drawn)
   ------------------------------------------------------------------------- */

/**
 * The page's signature, and the section every rule at the top of this file
 * exists for.
 *
 * Six cards at 380x520 in a 3x2 set, ALL ON ONE GROUND. One carries a name;
 * five carry a role at full weight and a gold rule where a name would be.
 *
 * The frame choreographs this — cards scattering into a set, the named one
 * resolving while the five held ones hold still, then a held card taking the
 * whole screen. NONE OF THAT IS BUILT: the page is static. What survives is
 * the thing that choreography was carrying, which is the only part that was
 * ever load-bearing — six identical cards, one name among them, and five gold
 * rules that a reader can count.
 *
 * The argument does not depend on the movement. It depends on the five rules
 * being the same size as the one name.
 *
 * Card photographs and motifs are presentation, so they live here rather than
 * in the content module. The motif rotation deliberately cuts across the roles
 * and encodes nothing.
 */
const CARD_PHOTOS = [
  "op-card-01",
  "op-card-02",
  "op-card-03",
  "work-botanical",
  "op-card-05",
  "op-card-06",
] as const;

/**
 * WHAT EACH STAND-IN MUST BECOME, in card order. Recorded here rather than
 * rendered: the ⟡ badge on the card is the marker a reader needs, and the
 * replacement brief is production talk that belongs off the artboard.
 *
 *   1  a portrait of Graham Ambridge — NONE EXISTS in any batch
 *   2  a cleared portrait of the Ranger this card names  (the escapee)
 *   3  a cleared portrait of the Ranger this card names
 *   4  a cleared portrait of the person on operations
 *   5  a cleared portrait of the person on cultural heritage
 *   6  a cleared portrait — ⚠ this frame repeats card 1's subject, and is the
 *      only repeat on the page; it goes when the real portraits arrive
 *
 * None of these can be commissioned until R24 is answered — the blocker is
 * consent, not a photographer.
 */

function PersonCard({
  person,
  index,
}: {
  person: (typeof team.people)[number];
  index: number;
}) {
  const photo = photoById(CARD_PHOTOS[index]);

  return (
    <article
      /* Same size, same ground, whether the person is named or not. A held
         card is not a lesser card, and the ground never varies across the
         set — that is §03's whole argument. */
      className="relative flex h-[520px] flex-col overflow-hidden rounded-3xl bg-evergreen text-canvas"
    >
      <div className="relative aspect-[380/320] w-full shrink-0 overflow-hidden">
        {/* The image plane. Its own element rather than a bare <img> so the
            crop, the scrim and the badge stack in a fixed order — and so a
            later pass that wants the frame to open has something to open,
            without the face inside it changing size. */}
        <div
          data-media
          data-motion={photo?.grade ?? "full"}
          className="absolute inset-0"
        >
          <MediaOrField
            src={photo?.src ?? null}
            alt=""
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            fieldClass="bg-charcoal"
          />
        </div>
        <span aria-hidden data-scrim className="absolute inset-0 bg-black/35" />

        {/* ⟡ PLACEHOLDER FACE — top-left, which is why the motif is
            bottom-right: a face sits high in a 380x320 crop. */}
        <p
          data-placeholder="face"
          className="eyebrow absolute top-2.5 left-1.5 z-10 rounded-xs bg-charcoal/70 px-2 py-1 text-[0.625rem] tracking-[0.08em] text-canvas"
        >
          ⟡ Placeholder face
        </p>
        <SeamGlyph
          motif={CARD_GLYPHS[index % CARD_GLYPHS.length]}
          className="right-4 bottom-4 w-11"
        />
      </div>

      <div className="flex flex-1 flex-col px-[22px] pt-6 pb-7">
        {person.name ? (
          <h3 data-name className="headline text-[1.625rem] leading-[1.23]">
            {person.name}
          </h3>
        ) : (
          /* THE NAME IS A RULE, NEVER A WORD. It sits on the baseline the
             name would have used, at the width a name would have taken, so
             the card reads as a place set rather than a card that failed to
             load. Never the string "[ Name ]". */
          <div
            data-placeholder="held-name"
            role="img"
            aria-label="Name withheld — consent has not been sought"
            className="mt-6 h-[3px] w-[168px] bg-gold"
          />
        )}

        {/* The role is REAL. Only the identity is held, so this carries full
            weight either way. */}
        <p className="eyebrow mt-5 text-xs tracking-[0.08em] text-gold">
          {person.roleUnconfirmed ? "⚠ Role to confirm" : person.role}
        </p>

        {person.bio ? (
          <p data-bio className="mt-3.5 text-sm leading-[1.5] text-canvas/80">
            {person.bio}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function TheGathering() {
  return (
    <section
      className="relative overflow-hidden bg-canvas text-charcoal"
    >
      <div className={`${COLUMN} py-32`}>
        <p className="eyebrow text-xl leading-[1.5] tracking-[0.08em] text-burnt sm:text-2xl">
          The team
        </p>
        <h2 className="headline mt-3 text-5xl leading-[1.16] text-evergreen sm:text-6xl">
          {team.title}
        </h2>
        <p className="mt-7 max-w-[760px] text-lg leading-[1.5] font-medium sm:text-[1.375rem]">
          {team.lede}
        </p>

        <div
          className="mt-24 grid gap-y-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-x-12"
        >
          {team.people.map((person, i) => (
            <PersonCard key={person.role + i} person={person} index={i} />
          ))}
        </div>

        {/* The hold renders, VISIBLY MARKED as not for publication. Dropping
            it would lose the only record that this section is unconfirmed
            (R14/R20 exist because that keeps happening); rendering it as prose
            would leave a reader unable to tell a drafting instruction from a
            sentence. EditorialNote is the house answer to both. */}
        <EditorialNote
          label="Blocked — needs consent, not just content (R24)"
          className="mt-20 max-w-[900px]"
        >
          <p>{team.pending}</p>
        </EditorialNote>
      </div>

    </section>
  );
}

/* -------------------------------------------------------------------------
   03b · BREATH — one photograph, no words · 55vh
   ------------------------------------------------------------------------- */

/**
 * NO CAPTION, deliberately. A caption would make a breath an illustration.
 * Country only — there are no people in either breath frame, which is what
 * lets them run without one.
 */
export function BreathTeam() {
  return (
    <section
      className="relative h-[55svh] w-full bg-charcoal"
    >
      <div
        data-media
        data-motion={BREATH_TEAM?.grade ?? "full"}
        className="absolute inset-0"
      >
        <MediaOrField
          src={BREATH_TEAM?.src ?? null}
          alt=""
          sizes="100vw"
          fieldClass="bg-evergreen/40"
        />
      </div>
      <ClusterArtwork
        tone="gold"
        className="top-[12%] right-[7.4%] hidden w-28 lg:block"
      />
      <p
        data-placeholder="stand-in"
        className="eyebrow absolute bottom-6 left-6 z-10 rounded-xs bg-charcoal/70 px-3 py-1.5 text-[0.625rem] text-canvas"
      >
        ⟡ Stand-in
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------
   04 · Board and cultural governance — drawn, not filled · 220vh · EVERGREEN
   ------------------------------------------------------------------------- */

/**
 * The 80/20 constitution is DRAWN TO SCALE — a 1240 bar split 992/248 — rather
 * than buried inside its sentence, with the figures set at 110 above it. The
 * bar is the argument: a ratio you can see is harder to misread than a ratio
 * you have to parse out of a clause.
 *
 * Everything unconfirmed on this page is DRAWN AND NOT FILLED: the seats, the
 * Elder Advisory container, the held portrait slots. That is Living Work §08's
 * rule for unconfirmed status, reused rather than reinvented.
 *
 * ⚠ THE SEATS CARRY NO PHOTOGRAPH. Nothing in the library shows governance,
 * and a fire-crew frame under "Board member" would assert what a board member
 * does.
 *
 * ⚠ TENSE — the Elder Advisory Group is not yet sitting. The container NEVER
 * FILLS and the copy stays future tense until it does.
 */
function HeldSeat({
  person,
  index,
}: {
  person: (typeof governance.people)[number];
  index: number;
}) {
  return (
    <div
      className="relative flex h-[260px] flex-col justify-between overflow-hidden rounded-3xl border-[1.5px] border-dashed border-gold/55 bg-charcoal p-[26px]"
    >
      <p className="eyebrow text-xs tracking-[0.5em] text-gold">Seat held</p>
      <div>
        {/* A gold rule, never a word. The same rule as the team cards. */}
        <div
          data-placeholder="held-name"
          role="img"
          aria-label="Name withheld — to be confirmed"
          className="h-[3px] w-[168px] bg-gold"
        />
        <div className="mt-7 flex items-end justify-between gap-4">
          <p className="eyebrow text-xs tracking-[0.1em] text-canvas/90">
            {person.role}
          </p>
          <SeamGlyph
            motif={CARD_GLYPHS[index % CARD_GLYPHS.length]}
            className="relative right-0 bottom-0 w-11 shrink-0"
          />
        </div>
      </div>
    </div>
  );
}

export function Governance() {
  return (
    <section className="relative bg-evergreen text-canvas">
      <WaveDivider ground="var(--color-evergreen)" />
      <RingArtwork piece="b" className="top-[4%] left-[64.4%] w-[56.25rem]" />
      <RingArtwork piece="a" className="-left-48 bottom-[16%] w-[40rem]" />

      <div className={`${COLUMN} relative py-32`}>
        <p className="eyebrow text-xl leading-[1.5] tracking-[0.08em] text-gold sm:text-2xl">
          Governance
        </p>
        <h2 className="headline mt-3 max-w-[1000px] text-5xl leading-[1.16] sm:text-6xl">
          {governance.title}
        </h2>

        {/* The clause is split so the ratio can be drawn inside it. The words
            are the content module's, unchanged — only the break is here. */}
        <p className="mt-8 max-w-[900px] text-lg leading-[1.5] font-medium sm:text-[1.375rem]">
          The board holds accountability for performance, direction and
          cultural integrity.
        </p>

        <p className="eyebrow mt-24 text-xs tracking-[0.66em] text-gold">
          Under our constitution
        </p>

        <div
          className="mt-6 flex flex-wrap items-baseline gap-x-24 gap-y-6"
        >
          <div>
            <p
              className="headline text-6xl leading-[1.07] text-gold sm:text-[6.875rem]"
            >
              80%
            </p>
            <p className="mt-2 text-xl leading-[1.5] font-medium text-canvas/75">
              Aboriginal
            </p>
          </div>
          <div>
            <p
              className="headline text-6xl leading-[1.07] text-ochre sm:text-[6.875rem]"
            >
              20%
            </p>
            <p className="mt-2 text-xl leading-[1.5] font-medium text-canvas/75">
              non-Aboriginal
            </p>
          </div>
        </div>

        {/* The ratio DRAWN TO SCALE — 992 and 248 of 1240. */}
        <div className="mt-10 flex h-4 w-full max-w-[1240px] overflow-hidden rounded-lg">
          <div className="h-full basis-4/5 rounded-lg bg-gold" />
          <div className="h-full basis-1/5 rounded-lg bg-ochre/55" />
        </div>

        <p className="mt-12 max-w-[1240px] text-lg leading-[1.5] font-medium text-canvas/90 sm:text-[1.375rem]">
          members under our constitution and ORIC requirements, and includes a
          formal Iningai Nation representative.
        </p>

        <p className="eyebrow mt-28 text-xs tracking-[0.66em] text-gold">
          Board seats · held
        </p>
        <div
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {governance.people.map((person, i) => (
            <HeldSeat key={person.role + i} person={person} index={i} />
          ))}
        </div>

        {/* ⚑ The container NEVER FILLS. It is not sitting yet. */}
        <div
          data-placeholder="elder-advisory"
          className="relative mt-20 min-h-[420px] overflow-hidden rounded-3xl border-[1.5px] border-dashed border-gold/60 p-[38px]"
        >
          <p className="eyebrow inline-block rounded-full bg-gold px-4 py-2 text-xs tracking-[0.66em] text-charcoal">
            Not yet sitting
          </p>
          {/* ⚠ THE ONLY FUTURE-TENSE PASSAGE ON THE PAGE, and it stays that
              way until the group is actually sitting. */}
          <p className="mt-10 max-w-[1000px] text-xl leading-[1.5] font-medium text-canvas/90 sm:text-[1.625rem]">
            {governance.body[1]}
          </p>
          <SeamGlyph motif="a" className="right-9 bottom-9 w-11" />
        </div>

        <EditorialNote
          tone="canvas"
          label="Editorial note — not for publication"
          className="mt-14 max-w-[900px]"
        >
          <p>{governance.pending}</p>
        </EditorialNote>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   05 · The ones who got us here — THE INVERSION · 260vh · CHARCOAL
   ------------------------------------------------------------------------- */

/**
 * THE ONLY SECTION ON THIS PAGE WHERE A NAME IS SET LARGE.
 *
 * Everywhere else a name is a gold rule. Here they are at sixty points and at
 * full brightness — the deliberate opposite of §02, where the testimony is the
 * thing being read and the names are not.
 *
 * That is the page's argument, and the client's own sentence makes it: "We
 * name them because that is how the record stays straight." The living are
 * unnamed because consent has not been asked for; the ones who got us here are
 * named because it has.
 *
 * The section ends on a SIXTH PLACE HELD — a gold rule at name scale, carrying
 * the draft's own outstanding line. An empty name at full size is the honest
 * state of this list.
 *
 * ⚠ NO PHOTOGRAPH IN THIS SECTION, by design. Neither batch holds archival
 * material of any kind, and three generations is written, not shown.
 *
 * ⚠ Four of six names are transcribed; the buyback recording garbles most of
 * them. Two entries carry unresolved identity questions and both are kept as
 * written — guessing at a name on a memorial list is not a tidy-up. Suzanne
 * decides on naming people who have passed.
 */
export function Acknowledgements() {
  return (
    <section className="relative bg-charcoal text-canvas">
      <WaveDivider ground="var(--color-charcoal)" />
      <RingArtwork piece="b" className="top-[7%] left-[48.6%] w-[62.5rem]" />
      <RingArtwork piece="a" className="-left-45 bottom-[10%] w-[44rem]" />

      <div className={`${COLUMN} relative py-32`}>
        <p className="eyebrow text-xl leading-[1.5] tracking-[0.08em] text-ochre sm:text-2xl">
          Acknowledgements
        </p>
        <h2 className="headline mt-3 max-w-[1100px] text-5xl leading-[1.16] sm:text-6xl">
          {acknowledgements.title}
        </h2>
        <p className="mt-7 max-w-[1000px] text-lg leading-[1.5] font-medium sm:text-2xl">
          {acknowledgements.lede}
        </p>

        <ul className="mt-24">
          {acknowledgements.people.map((entry) => (
            <li key={entry.name} className="border-t border-canvas/15 py-8">
              <p
                className="headline text-4xl leading-[1.17] sm:text-6xl"
              >
                {entry.name}
              </p>
              <p className="mt-5 max-w-[860px] text-lg leading-[1.5] text-canvas/70">
                {entry.detail}
              </p>
              {entry.unconfirmed ? (
                <p className="mt-3 max-w-[860px] text-[0.9375rem] leading-[1.5] text-gold">
                  ⚠ {entry.unconfirmed}
                </p>
              ) : null}
            </li>
          ))}
        </ul>

        {/* ⚑ THE SIXTH PLACE — a gold rule at NAME scale. The section ends on
            an empty name at full size, which is the honest state of a list
            that is not finished. */}
        <div className="border-t border-canvas/15 pt-14">
          <div
            data-placeholder="held-name"
            role="img"
            aria-label="Further names to be added — Suzanne to complete"
            className="h-1.5 w-[430px] max-w-full bg-gold"
          />
          <p className="mt-6 max-w-[860px] text-lg leading-[1.5] text-canvas/70">
            {acknowledgements.outstanding}
          </p>
        </div>

        <EditorialNote
          tone="canvas"
          label="Editorial note — not for publication"
          className="mt-14 max-w-[900px]"
        >
          <p>{acknowledgements.pending}</p>
        </EditorialNote>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   05b · BREATH — the pivot from the ones who are gone to the ask · 55vh
   ------------------------------------------------------------------------- */

export function BreathPivot() {
  return (
    <section
      className="relative h-[55svh] w-full bg-charcoal"
    >
      <div
        data-media
        data-motion={BREATH_PIVOT?.grade ?? "full"}
        className="absolute inset-0"
      >
        <MediaOrField
          src={BREATH_PIVOT?.src ?? null}
          alt=""
          sizes="100vw"
          fieldClass="bg-roasted"
        />
      </div>
      <SeamGlyph
        motif="a"
        className="top-[12%] right-[10.9%] hidden w-11 lg:block"
      />
      <p
        data-placeholder="stand-in"
        className="eyebrow absolute bottom-6 left-6 z-10 rounded-xs bg-charcoal/70 px-3 py-1.5 text-[0.625rem] text-canvas"
      >
        ⟡ Stand-in
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------
   06 · Get in touch — four doors · 195vh
   ------------------------------------------------------------------------- */

/**
 * The contact fields run THREE ACROSS on two rows at 360 wide. Six across
 * breaks the email over three lines with orphaned brackets — the same fix
 * already made on About.
 *
 * ⚠ EVERY CONTACT DETAIL IS A PLACEHOLDER and none of them becomes a live
 * mailto: or tel:. The square brackets are the drafter's and they mean "not
 * confirmed" — including the email address, which looks real and is not.
 * Publishing an unverified address is worse than publishing none: mail goes
 * somewhere nobody reads and the sender thinks they have made contact.
 *
 * ⚠ R23 — phone answering hours. There is no reliable mobile coverage at
 * Turraburra, so a number without hours is a promise the page cannot keep.
 *
 * The four doors take NO PHOTOGRAPH (Ivy, 2 September) — they are the card
 * template with a motif where the image band would be. Their destinations and
 * labels come from src/content/contact.ts, which is also what About and
 * Connect render, so the four routes cannot drift apart.
 *
 * ⚠ The frame's fourth door still reads `/resources`. The content module says
 * `/the-record`, which is the route that exists after the rename, and under D5
 * the content wins. Every label here is verb-led and none renders a path.
 */
const DOOR_GROUNDS = [
  "bg-evergreen",
  "bg-roasted",
  "bg-midnight",
  "bg-charcoal",
] as const;

export function GetInTouch() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-28 bg-canvas text-charcoal"
    >
      <WaveDivider ground="var(--color-canvas)" />
      <RingArtwork
        piece="b"
        className="top-[5%] left-[64.4%] w-[56.25rem] opacity-30"
      />
      <RingArtwork
        piece="a"
        tone="roasted"
        className="-left-48 bottom-[12%] w-[40rem] opacity-30"
      />

      <div className={`${COLUMN} relative py-32`}>
        <p className="eyebrow text-xl leading-[1.5] tracking-[0.08em] text-burnt sm:text-2xl">
          Get in touch
        </p>
        <h2 className="headline mt-3 max-w-[1100px] text-5xl leading-[1.16] text-evergreen sm:text-6xl">
          Different things go to different people.
        </h2>

        {/* Three across, two rows, 360 wide. */}
        {/* Three across, two rows, 360 wide. */}
        <div className="mt-24">
          <ContactDetails />
        </div>

        <p className="mt-24 max-w-[900px] text-lg leading-[1.5] font-medium sm:text-[1.375rem]">
          {contactRoutes.lede}
        </p>

        <div className="mt-14">
          <ContactDoors grounds={DOOR_GROUNDS} glyphs={CARD_GLYPHS} />
        </div>
      </div>
    </section>
  );
}
