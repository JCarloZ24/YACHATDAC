import { photoById } from "@/content/kit";
import { ourPeopleMedia } from "@/content/our-people-media";
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
 *   00  The advisory — on the loading cover since 15 Sep 2026 (see below)
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
 * User direction, 11 September 2026: preserve this existing markup and put
 * the ten sections onto the homepage's single-canvas architecture. The
 * `data-people-*` hooks connect to one controller-owned journey; they do not
 * create separate pinned sections. Text stays selectable above the Three.js
 * world. This exact document is also the reduced-motion / no-WebGL fallback.
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
 * ⚠⚠ AND THE PAGE NO LONGER SAYS SO. The `⟡ Placeholder face` badge on every
 * card, and the `⟡ Stand-in` markers on the hero and both breaths, were
 * REMOVED on 14 September 2026 — Marc's review, explicitly: every rendered
 * editorial note off this page. That reverses the rule those markers existed
 * for (kit.ts: "a screenshot circulated without it is exactly how a
 * placeholder becomes a claim"), and the reason has not gone away. This
 * comment, kit.ts, docs/motion/scenes.md and
 * docs/design/our-people-review-2026-09-14.md are now the only places that
 * say these faces are stand-ins. A screenshot of this page does not.
 * R24 is still the page's blocker.
 *
 * Suzanne is the exception and is not in this map: she is the one person shown
 * as herself, and `lw-hero` is her frame (378A7604_1.40.2).
 */
const HERO = ourPeopleMedia.hero;
const SUZANNE = photoById("lw-hero");
const BREATH_TEAM = ourPeopleMedia.breathTeam;
const BREATH_PIVOT = ourPeopleMedia.breathPivot;
/**
 * LESS SOLID GROUND AND RING, 15 September 2026, user direction ("there's
 * too much solid background + ring vector on our people page ... the goal is
 * less solid color + ring"). Four long screens in a row were a flat ground
 * under the artist's rings (the testimony, Who decides, governance and the
 * acknowledgements), with the footer's rings straight after. Two of them now
 * stand on Country instead, the way the other pages set words on land (Home's
 * beats, Living Work's X5 plates, Truth's Underneath): a held photograph
 * under a legibility scrim. Both are Country with nobody in frame, so they
 * make no claim about who is shown. Who decides keeps the rings (the one
 * ring screen left, and it turns); governance and the doors lose theirs.
 */
const TESTIMONY_GROUND = photoById("country-sunset-grass"); // grass heads at last light
const REMEMBRANCE_GROUND = photoById("lw-regrowth-dusk"); // a dead tree over regrowth at dusk

/** R11, user sharpness refinement (11 September 2026): 85 is already allowed
 * by Next. Sizes account for the full image width required by object-cover,
 * particularly a landscape source inside a portrait card or the panorama.
 */
const PHOTO_QUALITY = 85;

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

/* -------------------------------------------------------------------------
   00 · The advisory — on the loading cover, not a screen of its own
   ------------------------------------------------------------------------- */

/**
 * Australian cultural protocol, and the draft puts it first for that reason.
 *
 * ⚑ MOVED TO THE COVER, 15 September 2026, user direction ("remove the …
 * caution text … put it on the loading part … so that the caution is not a
 * hero page"). It opened the page as a full black screen (14 Sep) and before
 * that as a 45vh band. It now sits on /our-people's loading cover under the
 * wordmark (RouteLoader → PageLoader `advice`), which is still the first
 * thing a reader meets, and the page opens on its photograph.
 *
 * What stays here is what the cover cannot reach:
 *   · a visually hidden copy, first in the document, so the notice still
 *     precedes the page for assistive technology and for anyone reading the
 *     markup without the cover;
 *   · a <noscript> band, because the cover is display:none without scripting
 *     and a no-JS reader would otherwise never see it.
 * Neither is a `data-people-scene`, so the reading clock does not measure
 * either as a screen.
 */
export function OurPeopleAdvisory() {
  return (
    <>
      <p className="sr-only">{culturalAdvice}</p>
      <noscript>
        <section className="bg-charcoal py-16 text-canvas lg:py-24">
          <div className={`${COLUMN}`}>
            <div aria-hidden className="h-[3px] w-[72px] bg-gold" />
            <p className="mt-8 max-w-[1040px] text-lg leading-[1.5] font-medium sm:text-2xl">
              {culturalAdvice}
            </p>
          </div>
        </section>
      </noscript>
    </>
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
 * Burns. The CSS fill is the fallback; the shared canvas uses the same hero
 * photograph in a mask measured from this heading's actual loaded font (Y1).
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
    <section data-people-scene="hero" data-nav-hero className="relative bg-charcoal text-canvas">
      {/* The photograph. 1150 of the frame's 1890, hard-cut into charcoal at
          its foot — the scrim carries the cut so it does not read as a seam. */}
      {/* User direction, 14 September 2026: at least a full screen below lg.
          The photograph now fades in on a held screen instead of scrolling
          up, and at 62svh / 86svh that screen showed a band of empty charcoal
          under it on phones and tablets. */}
      <div data-people-hero-frame className="relative h-svh w-full overflow-hidden lg:h-[128svh]">
        <div
          data-media
          data-motion="frame"
          className="absolute inset-0"
        >
          <MediaOrField
            src={HERO?.src ?? null}
            alt="Rangers walking burnt Country"
            sizes="(min-width: 1024px) max(100vw, 171svh), max(100vw, 134svh)"
            quality={PHOTO_QUALITY}
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

        {/* The ⟡ STAND-IN marker came off here on 14 September 2026 (Marc's
            review — every rendered editorial note off this page). What the
            frame must be replaced BY, and that it is a stand-in at all, stays
            recorded in this component's header and in src/content/kit.ts. */}
      </div>

      {/* User reference, 11 September 2026 (D5: reference governs layout):
          a broad, centred display with breathing room before the canvas wave.
          This section uses the current 20/64px viewport gutters. */}
      <div data-people-hero-copy className="mx-auto w-full max-w-[1920px] px-5 pt-8 pb-32 lg:px-16 lg:pb-60">
        {/* Captioned by what the frame SHOWS, never by who the people are —
            which is the rule this caption obeys, not a sentence for a reader. */}
        <p className="max-w-[760px] text-sm leading-[1.5] text-canvas/60">
          Rangers walking burnt Country.
        </p>

        <div className="mt-12 text-center lg:mt-16">
          <p
            className="eyebrow text-base leading-[1.5] tracking-[0.08em] text-ochre lg:text-2xl"
          >
            {ourPeopleHero.eyebrow}
          </p>

          {/* Y1 · the picture leaves the screen and survives inside the word. */}
          <h1
            data-people-title
            /* User reference, 11 September 2026: scoped display-size exception
               to the H1 token, matching the photograph-filled title's scale.
               Keep the licensed face and allow CMS copy to wrap. Canvas is
               also the clipped background fallback if the image fails. */
            className="headline mx-auto mt-8 w-fit max-w-full bg-canvas bg-center bg-no-repeat bg-clip-text text-h1 leading-[1.05] tracking-[-0.015em] text-canvas [--text-h1:clamp(3.5rem,14vw,7rem)] [overflow-wrap:anywhere] supports-[background-clip:text]:text-transparent lg:mt-10 lg:[--text-h1:clamp(8rem,14vw,16rem)]"
            style={
              HERO
                ? {
                    backgroundImage: `url(${ourPeopleMedia.titleFallback ?? HERO.src})`,
                    backgroundSize: "108.7% 408.16%",
                    /* Keep the reference crop held inside the letterforms. */
                    backgroundPositionX: "50%",
                    backgroundPositionY: "17.88%",
                  }
                : undefined
            }
          >
            {ourPeopleHero.title}
          </h1>

          <p
            className="mx-auto mt-10 max-w-[900px] text-lg leading-[1.5] font-medium lg:mt-16 lg:text-2xl"
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
 * The quote sits low so testimony arrives after a pause. Y2 now holds the
 * shared track still while the words undim, then keeps the whole quotation
 * lit for a reading beat (user direction, 11 September 2026).
 */
export function SuzanneTestimony() {
  return (
    <section data-people-scene="suzanne" className="relative bg-canvas text-charcoal">
      <WaveDivider ground="var(--color-canvas)" />

      <div className={`${COLUMN} pt-24 pb-20 lg:pt-28 lg:pb-24`}>
        <figure>
          <div
            data-media
            data-motion={SUZANNE?.grade ?? "frame"}
            className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-[1240/620]"
          >
            <MediaOrField
              src={SUZANNE?.src ?? null}
              alt="Suzanne Thompson standing in the Country being brought back"
              sizes="(min-width: 1024px) 1240px, 135vw"
              quality={PHOTO_QUALITY}
              fieldClass="bg-evergreen/40"
            />
          </div>
          <figcaption className="mt-5 max-w-[760px] text-[0.9375rem] leading-[1.5] text-charcoal/60">
            Standing in the Country being brought back.
          </figcaption>
        </figure>

        <p className="eyebrow mt-16 text-base leading-[1.5] tracking-[0.08em] text-burnt sm:text-2xl lg:mt-14">
          Iningai custodian
        </p>
        <h2 className="headline mt-3 max-w-[900px] text-4xl leading-[1.16] text-evergreen sm:text-7xl">
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

        {/* Her external roles are incomplete — a national emissions reduction
            board, and possibly others. The §02 note carries this as a HELD
            item in `suzanneProfile.pending`, which is still the record. It no
            longer RENDERS: the on-page editorial notes came off this page on
            14 September 2026 (user direction). */}
      </div>

      {/* The testimony. User direction, 14 September 2026: it takes a whole
          screen of its own, so the reader holds on her words alone.

          ON COUNTRY, 15 September 2026 (see TESTIMONY_GROUND): the screen was
          canvas with the ring pattern, and read as blank until the words
          arrived. It is now full bleed, out of the column, over a held
          photograph of grass at last light. Testimony is read in stillness,
          so the photograph never moves; the canvas paints it like every other
          [data-media] on the page. The scrim is X5's legibility exception,
          and the words take the canvas ink over it. */}
      <div data-people-testimony-screen className="relative flex min-h-svh flex-col justify-center text-canvas">
        <div data-media data-motion={TESTIMONY_GROUND?.grade ?? "full"} className="absolute inset-0 overflow-hidden">
          <MediaOrField
            src={TESTIMONY_GROUND?.src ?? null}
            alt=""
            sizes="max(100vw, 190svh)"
            quality={PHOTO_QUALITY}
            fieldClass="bg-roasted"
          />
        </div>
        <div aria-hidden data-people-testimony-scrim className="absolute inset-0 bg-charcoal/55" />
        <div aria-hidden data-people-testimony-scrim className="absolute inset-0 bg-linear-to-b from-charcoal/30 via-transparent to-charcoal/60" />
        <div className={`${COLUMN} relative`}>
          <blockquote data-people-testimony>
            <span
              aria-hidden
              className="headline block text-[5rem] leading-[1] text-gold/60 sm:text-[7.5rem] lg:text-[8rem]"
            >
              &ldquo;
            </span>
            <p
              className="headline mt-6 max-w-[1240px] text-4xl leading-[1.22] text-canvas sm:text-7xl"
            >
              {suzanneProfile.quote}
            </p>
            <cite
              className="eyebrow mt-20 block text-sm text-gold not-italic"
            >
              {suzanneProfile.name}
            </cite>
          </blockquote>
        </div>
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
      data-people-scene="decision"
      className="relative flex min-h-svh items-center lg:min-h-[140svh] bg-roasted text-canvas"
    >
      <WaveDivider ground="var(--color-roasted)" />
      {/* The rings are pulled outside the column and are far wider than a
          phone — `w-[56.25rem]` at `left-[64.4%]` reaches 1141px on a 375
          viewport. Nothing clamps overflow-x on html or body and globals.css
          hides every scrollbar, so unclipped they pan the whole page sideways
          with no visible cue. The clip is the same one /about and
          /partnerships already wrap every ring in.

          ⚠ THE WAVE STAYS OUTSIDE IT. WaveDivider is pulled entirely above
          its own box; inside an overflow-hidden parent it renders as nothing. */}
      <div aria-hidden data-people-decision-rings className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* The rings TURN with the scroll (15 Sep 2026); our-people.ts rotates
            the <img> inside each, since the pointer drift owns the
            [data-artwork] box's transform. They are kept off the photograph
            before this screen: they fade in after the cut, on brown alone. */}
        <RingArtwork piece="a" className="-left-44 bottom-[8%] w-[36.7rem]" />
        <RingArtwork piece="b" className="top-[7%] left-[64.4%] w-[56.25rem]" />
      </div>

      <div className={`${COLUMN} relative py-16 lg:py-24`}>
        <p className="eyebrow text-base leading-[1.5] tracking-[0.08em] text-gold sm:text-2xl">
          Who decides
        </p>
        <p className="headline mt-12 max-w-[1180px] text-4xl leading-[1.24] sm:text-6xl lg:text-[4rem]">
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
 * The existing grid now gathers by row inside the single page stage (P4,
 * 11 September 2026). Frame apertures travel around held image pixels; names
 * and roles retain their existing prominence. Nothing pulses while held.
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
      data-people-card={index}
      /* Same size, same ground, whether the person is named or not. A held
         card is not a lesser card, and the ground never varies across the
         set — that is §03's whole argument. */
      className="relative flex min-h-[520px] flex-col overflow-hidden rounded-3xl bg-evergreen text-canvas"
    >
      <div className="relative aspect-[380/320] w-full shrink-0 overflow-hidden">
        {/* The image plane. Its own element rather than a bare <img> so the
            crop, the scrim and the badge stack in a fixed order — and so a
            later pass that wants the frame to open has something to open,
            without the face inside it changing size. */}
        <div
          data-media
          /* Portrait override: the older kit entries say full. P4 holds every
             face; only its containing frame may gather (11 September 2026). */
          data-motion="frame"
          className="absolute inset-0"
        >
          <MediaOrField
            src={photo?.src ?? null}
            alt=""
            sizes="(min-width: 1024px) 680px, (min-width: 640px) 90vw, 160vw"
            quality={PHOTO_QUALITY}
            fieldClass="bg-charcoal"
          />
        </div>
        <span aria-hidden data-scrim className="absolute inset-0 bg-black/35" />

        {/* The ⟡ PLACEHOLDER FACE badge came off on 14 September 2026 (Marc's
            review). The motif stays BOTTOM-RIGHT regardless: a face sits high
            in a 380x320 crop, so the mark belongs low whether or not anything
            else occupies the top-left. That every face here is a stand-in is
            still recorded in this file's header and in src/content/kit.ts. */}
        <SeamGlyph
          motif={CARD_GLYPHS[index % CARD_GLYPHS.length]}
          className="right-4 bottom-4 w-11"
        />
      </div>

      <div className="flex flex-1 flex-col px-5 pt-6 pb-7 lg:px-[22px]">
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
            weight either way.

            ⚠ AN UNCONFIRMED ROLE RENDERS NOTHING (Marc's review, 14 September
            2026 — every rendered editorial note off this page). Dropping the
            "⚠" alone would not have done it: the string in the content module
            IS "Role to confirm", so the line would still have printed the
            note. `roleUnconfirmed` stays on the Person type; it is still the
            record that the role is open, it simply no longer draws. */}
        {person.roleUnconfirmed ? null : (
          <p className="eyebrow mt-5 text-sm tracking-[0.08em] text-gold">
            {person.role}
          </p>
        )}

        {person.bio ? (
          /* The bio takes the role's own top margin when no role is drawn, so
             a card with the line suppressed does not open a gap where it was. */
          <p
            data-bio
            className={`${person.roleUnconfirmed ? "mt-5" : "mt-3.5"} text-sm leading-[1.5] text-canvas/80`}
          >
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
      data-people-scene="team"
      /* 14 Sep 2026: a canvas wave introduces the team over Who decides.
         overflow-x-clip (not overflow-hidden) so the wave's overhang above
         the section still renders. */
      className="relative overflow-x-clip bg-canvas text-charcoal"
    >
      <WaveDivider ground="var(--color-canvas)" />
      <div className={`${COLUMN} py-16 lg:py-24`}>
        {/* The "The team" eyebrow above this came off on 15 September 2026
            (user: "there double the team here"): `team.title` is also "The
            team", so the section said it twice. The heading is the draft's
            (D5), so it is the one that stays. */}
        <h2 className="headline text-4xl leading-[1.16] text-evergreen sm:text-6xl">
          {team.title}
        </h2>
        {/* `team.lede` — "Placeholder roles below. Names, titles and
            photographs to be confirmed." — is held in the content module and
            no longer renders: every rendered editorial note came off this page
            on 14 September 2026 (Marc's review). R14/R20 are why the string
            stays. */}

        <div
          className="mt-14 grid gap-y-12 sm:grid-cols-2 sm:gap-6 lg:mt-14 lg:grid-cols-3 lg:gap-x-12"
        >
          {team.people.map((person, i) => (
            <PersonCard key={person.role + i} person={person} index={i} />
          ))}
        </div>

        {/* The hold (`team.pending`, R24) is still the record that this
            section is unconfirmed; it no longer renders on the page — the
            editorial notes came off /our-people on 14 September 2026 (user
            direction). R14/R20 are why the content module keeps the text. */}
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
      data-people-scene="breath-team"
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
          sizes="max(100vw, 74svh)"
          quality={PHOTO_QUALITY}
          fieldClass="bg-evergreen/40"
        />
      </div>
      <ClusterArtwork
        tone="gold"
        className="top-[12%] right-[7.4%] hidden w-28 lg:block"
      />
      {/* ⟡ Stand-in marker removed 14 September 2026 (Marc's review). */}
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
      data-people-seat
      className="relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-3xl border-[1.5px] border-dashed border-gold/55 bg-charcoal p-5 lg:p-[26px]"
    >
      <p className="eyebrow text-sm tracking-[0.5em] text-gold">Seat held</p>
      <div>
        {/* A gold rule, never a word. The same rule as the team cards. */}
        <div
          data-placeholder="held-name"
          role="img"
          aria-label="Name withheld — to be confirmed"
          className="h-[3px] w-[168px] bg-gold"
        />
        <div className="mt-7 flex items-end justify-between gap-4">
          <p className="eyebrow text-sm tracking-[0.1em] text-canvas/90">
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
    <section data-people-scene="governance" className="relative bg-evergreen text-canvas">
      <WaveDivider ground="var(--color-evergreen)" />
      {/* The rings, and they TURN (15 September 2026, user direction: "bring
          back the turning ring artwork on the green solid background part").
          our-people.ts rotates the <img> inside each with the scroll; the
          pointer drift keeps the [data-artwork] box's transform. */}
      <div aria-hidden data-people-governance-rings className="pointer-events-none absolute inset-0 overflow-hidden">
        <RingArtwork piece="b" className="top-[4%] left-[64.4%] w-[56.25rem]" />
        <RingArtwork piece="a" className="-left-48 bottom-[16%] w-[40rem]" />
      </div>

      <div className={`${COLUMN} relative py-16 lg:py-24`}>
        <p className="eyebrow text-base leading-[1.5] tracking-[0.08em] text-gold sm:text-2xl">
          Governance
        </p>
        <h2 className="headline mt-3 max-w-[1000px] text-4xl leading-[1.16] sm:text-6xl">
          {governance.title}
        </h2>

        {/* The clause is split so the ratio can be drawn inside it. The words
            are the content module's, unchanged — only the break is here. */}
        <p className="mt-8 max-w-[900px] text-lg leading-[1.5] font-medium sm:text-[1.375rem]">
          The board holds accountability for performance, direction and
          cultural integrity.
        </p>

        <p className="eyebrow mt-16 text-sm tracking-[0.3em] text-gold sm:tracking-[0.66em] lg:mt-14">
          Under our constitution
        </p>

        <div
          className="mt-6 flex flex-wrap items-baseline gap-x-24 gap-y-6"
        >
          <div>
            <p className="headline grid text-6xl leading-[1.07] text-gold sm:text-[6.875rem]">
              {/* User direction, 14 September 2026: the figure counts up with
                  the ratio bar (our-people.ts). The invisible copy holds the
                  box at the FINAL width so the row never reflows as the digits
                  change; the live copy is decorative and the sr-only text
                  carries the fact.

                  ⚠ THE LIVE COPY SHIPS AS "0%" AND THE COUNT STARTS THERE
                  (user direction, 14 September 2026). A pass earlier the same
                  day made the resting figure read 80% and swapped the counting
                  copy in when the ratio was reached — which meant the reader
                  watched 80% jump backwards to nothing and climb again. The
                  number the page shows before the count is the number the
                  count starts from. Writing it in the markup rather than from
                  the module also means there is no frame of 80% before the
                  clock exists. */}
              <span aria-hidden className="invisible col-start-1 row-start-1">80%</span>
              <span aria-hidden data-people-count="80" className="col-start-1 row-start-1">0%</span>
              <span className="sr-only">80%</span>
            </p>
            <p className="mt-2 text-xl leading-[1.5] font-medium text-canvas/75">
              Aboriginal
            </p>
          </div>
          <div>
            <p className="headline grid text-6xl leading-[1.07] text-ochre sm:text-[6.875rem]">
              {/* The 20% half of the same object — see the 80% figure above. */}
              <span aria-hidden className="invisible col-start-1 row-start-1">20%</span>
              <span aria-hidden data-people-count="20" className="col-start-1 row-start-1">0%</span>
              <span className="sr-only">20%</span>
            </p>
            <p className="mt-2 text-xl leading-[1.5] font-medium text-canvas/75">
              non-Aboriginal
            </p>
          </div>
        </div>

        {/* The ratio DRAWN TO SCALE — 992 and 248 of 1240. */}
        <div data-people-ratio className="mt-10 flex h-4 w-full max-w-[1240px] overflow-hidden rounded-lg">
          <div className="h-full basis-4/5 rounded-lg bg-gold" />
          <div className="h-full basis-1/5 rounded-lg bg-ochre/55" />
        </div>

        <p className="mt-12 max-w-[1240px] text-lg leading-[1.5] font-medium text-canvas/90 sm:text-[1.375rem]">
          members under our constitution and ORIC requirements, and includes a
          formal Iningai Nation representative.
        </p>

        <p className="eyebrow mt-16 text-sm tracking-[0.3em] text-gold sm:tracking-[0.66em] lg:mt-16">
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
          className="relative mt-14 overflow-hidden rounded-3xl border-[1.5px] border-dashed border-gold/60 p-6 lg:mt-12 lg:min-h-[420px] lg:p-[38px]"
        >
          <p className="eyebrow inline-block rounded-full bg-gold px-4 py-2 text-sm tracking-[0.3em] text-charcoal sm:tracking-[0.66em]">
            Not yet sitting
          </p>
          {/* ⚠ THE ONLY FUTURE-TENSE PASSAGE ON THE PAGE, and it stays that
              way until the group is actually sitting. */}
          <p className="mt-10 max-w-[1000px] text-xl leading-[1.5] font-medium text-canvas/90 sm:text-[1.625rem]">
            {governance.body[1]}
          </p>
          <SeamGlyph motif="a" className="right-9 bottom-9 hidden w-11 lg:block" />
        </div>

        {/* `governance.pending` is held in the content module and no longer
            renders — editorial notes off this page, 14 September 2026 (user
            direction). */}
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
    <section data-people-scene="acknowledgements" className="relative bg-charcoal text-canvas">
      {/* 15 September 2026 (see REMEMBRANCE_GROUND): the rings came off and the
          section opens on Country, a dead tree over regrowth at dusk, held,
          with the heading set low on it and a scrim that closes to the
          charcoal the names are read on. Still no photograph OF anyone: this
          is the land they kept reachable, not a picture of them (see the
          header note). The names stay on the plain ground. */}
      <div className="relative flex min-h-[78svh] flex-col justify-end lg:min-h-[92svh]">
        <div data-media data-motion={REMEMBRANCE_GROUND?.grade ?? "full"} className="absolute inset-0 overflow-hidden">
          <MediaOrField
            src={REMEMBRANCE_GROUND?.src ?? null}
            alt=""
            sizes="max(100vw, 175svh)"
            quality={PHOTO_QUALITY}
            fieldClass="bg-charcoal"
          />
        </div>
        <div aria-hidden className="absolute inset-0 bg-charcoal/35" />
        <div aria-hidden className="absolute inset-0 bg-linear-to-b from-charcoal/40 via-charcoal/25 to-charcoal" />
        {/* The join from governance (15 September 2026, user direction: "just
            do a green wave design and remove the black wave"). The charcoal
            crest that rose out of governance is gone; governance's evergreen
            carries on over the top of the photograph as a hanging wave, so
            the green gives way to Country rather than to a black band. */}
        <WaveDivider ground="var(--color-evergreen)" flip seat="inline" />
        <div className={`${COLUMN} relative pt-32 pb-4 lg:pb-8`}>
          <p className="eyebrow text-base leading-[1.5] tracking-[0.08em] text-gold sm:text-2xl">
            Acknowledgements
          </p>
          <h2 className="headline mt-3 max-w-[1100px] text-4xl leading-[1.16] sm:text-6xl">
            {acknowledgements.title}
          </h2>
          <p className="mt-7 max-w-[1000px] text-lg leading-[1.5] font-medium sm:text-2xl">
            {acknowledgements.lede}
          </p>
        </div>
      </div>

      {/* A very light ring at the foot of the names (15 September 2026, user
          direction), so the charcoal is not bare. Held back to 40% of the
          artwork's own weight so it stays behind the words. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] overflow-hidden">
        <RingArtwork piece="a" className="-left-45 bottom-[4%] w-[44rem] opacity-40" />
      </div>

      <div className={`${COLUMN} relative pb-16 lg:pb-24`}>
        <ul className="mt-10 lg:mt-14">
          {acknowledgements.people.map((entry) => (
            <li key={entry.name} className="border-t border-canvas/15 py-8">
              <p
                data-people-name
                className="headline text-4xl leading-[1.17] sm:text-6xl"
              >
                {entry.name}
              </p>
              <p className="mt-5 max-w-[860px] text-lg leading-[1.5] text-canvas/70">
                {entry.detail}
              </p>
              {/* `entry.unconfirmed` no longer renders — every rendered
                  editorial note came off this page on 14 September 2026
                  (Marc's review). The identity questions are still held
                  against their entries in src/content/our-people.ts, which is
                  the record, and guessing at a name on a memorial list is
                  still not a tidy-up. */}
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
          {/* `acknowledgements.outstanding` is held in the content module and
              no longer renders (Marc's review, 14 September 2026). The rule
              above it stays: an empty name at full size is the honest state of
              a list that is not finished, and it says so without a note. */}
        </div>

        {/* `acknowledgements.pending` is held in the content module and no
            longer renders — editorial notes off this page, 14 September 2026
            (user direction). */}
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
      data-people-scene="breath-pivot"
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
          sizes="max(100vw, 249svh)"
          quality={PHOTO_QUALITY}
          fieldClass="bg-roasted"
        />
      </div>
      <SeamGlyph
        motif="a"
        className="top-[12%] right-[10.9%] hidden w-11 lg:block"
      />
      {/* ⟡ Stand-in marker removed 14 September 2026 (Marc's review). */}
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
/**
 * Marc's review, 14 September 2026: the same four grounds, ORDERED. They ran
 * evergreen / roasted / midnight / charcoal, which reads as four arbitrary
 * picks; lightest to darkest grades the row across instead. Literal classes
 * only — see the `grounds` prop on ContactDoors for why an interpolated
 * `bg-${tone}` compiles to nothing.
 */
const DOOR_GROUNDS = [
  "bg-roasted", //   #4e3524
  "bg-evergreen", // #22372b
  "bg-midnight", //  #122449
  "bg-charcoal", //  #090e12
] as const;

export function GetInTouch() {
  return (
    <section
      data-people-scene="contact"
      id="contact"
      className="relative scroll-mt-28 bg-canvas text-charcoal"
    >
      <WaveDivider ground="var(--color-canvas)" />
      {/* Its two faint rings came off, 15 September 2026 (see
          TESTIMONY_GROUND): the footer's rings follow straight after, and the
          four coloured doors below already carry a motif each. */}

      <div className={`${COLUMN} relative py-16 lg:py-24`}>
        <p className="eyebrow text-base leading-[1.5] tracking-[0.08em] text-burnt sm:text-2xl">
          Get in touch
        </p>
        <h2 className="headline mt-3 max-w-[1100px] text-4xl leading-[1.16] text-evergreen sm:text-6xl">
          Different things go to different people.
        </h2>

        {/* Three across, two rows, 360 wide. */}
        {/* Three across, two rows, 360 wide. */}
        <div className="mt-14">
          <ContactDetails />
        </div>

        <p className="mt-14 max-w-[900px] text-lg leading-[1.5] font-medium sm:text-[1.375rem] lg:mt-14">
          {contactRoutes.lede}
        </p>

        <div className="mt-14">
          <ContactDoors grounds={DOOR_GROUNDS} glyphs={CARD_GLYPHS} />
        </div>
      </div>
    </section>
  );
}
