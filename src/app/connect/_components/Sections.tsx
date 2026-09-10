import { CardRail } from "@/components/ui/CardRail";
import { ContactDetails } from "@/components/sections/ContactDetails";
import { EditorialNote } from "@/components/ui/EditorialNote";
import {
  BlobButton,
  RingArtwork,
  SeamGlyph,
  WaveDivider,
} from "@/components/ui/Furniture";
import type { SeamGlyphMotif } from "@/components/ui/Furniture";
import { contactNote } from "@/content/contact";

/**
 * /connect — "Get in touch", at hi-fi weight.
 * Figma 3028:28875 (08 · Connect — HI-FI · Desktop · the page reaches),
 * 1440 x 5,805px = 645vh across five frames. The verb is REACHES.
 *
 *   01  Hero — "Get in touch" · ⚠ no hero image supplied, typographic · 130vh
 *   02  Ways in — the four routes at full size · ⚑ THIS is the router · 190vh
 *   03  No form, and that is on purpose · R9 · 100vh
 *   04  Contact details — no doors, because §02 already routed · 90vh
 *   05  Footer — already built to Marc's styling; the page declares its ground
 *
 * The shortest page on the site, and the only one whose whole job is to hand
 * the reader off. Every other page's arrows end here.
 *
 * ⚠ STATIC BY DECISION, like /our-people, /about and /partnerships. No motion
 * module, no scroll animation, no hover. It renders the same with JS off.
 *
 * ⚠⚠ THERE IS NO CONNECT DRAFT, and this is the most-linked destination on the
 * site — Truth, Living Work (three times), Resources, About and Our People all
 * point here. Every word is borrowed from a page that does have a draft: the
 * contact block is the "Get in touch" section About and Our People both carry
 * verbatim (D5), and the four ways in are Living Work's "Get involved". Do not
 * add copy here without a provenance.
 *
 * ⚑ §02 IS THE ROUTER, AND §04 CARRIES NO DOORS. The frame is explicit about
 * this (`showRoutes={false}` in its own layer name): the four routes appear
 * ONCE, at full size, and the contact block below is details only. Rendering
 * `ContactDoors` here as well would state the same four destinations twice in
 * one screen — which is the fault the 2 September pass found on Partnerships.
 *
 * ⚠ WHAT IS HELD: R9 no form until the legal pages exist · R15 five of the six
 * contact fields are the drafter's own square brackets, the email included ·
 * the primary action is drawn and not filled, because every arrow on the site
 * ends here and there is still no address to send anyone to · D2, whether
 * Connect survives as a nav item at all, is open and this build does not
 * settle it.
 */

/**
 * THE MOBILE RAMP, read off the one mobile design that exists.
 *
 * Figma `01 · Wonder — HI-FI · Mobilep` (node 2576:21896, 375 wide) carries
 * the file's `Typography/Mobile/*` styles: H1 56 · H2 36 · H3 32 · lead 24 ·
 * eyebrow 16, against the desktop 96 / 56 / 40 / 36 / 20. These bases follow
 * it, and section padding follows its 64. See the same note on /about,
 * /our-people and /partnerships for what is deliberately NOT taken from it.
 */

/**
 * The column. Every body in the frame measures at x=100 of 1440, so the
 * padding alone is the column — `lg:px-25` and NO max-width.
 *
 * ⚠ `sm:px-10` is the deliberate addition the other three hi-fi pages carry:
 * without it a 768px viewport holds `sm:text-2xl` copy across a 720px measure
 * inside 24px gutters. Raise it with Juan Carlos before spreading it further.
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
 * The section eyebrow on a dark ground — 24px on 8px of tracking, which is
 * 0.333em, the same value /partnerships measured off its own frame. It opens
 * out only once there is room: at 375 the widest consumer here would otherwise
 * run past the column.
 *
 * ⚠ §03 and §04 do NOT use this. The frame draws §03 at 6px (0.25em) and §04
 * at 1.92px (0.08em) on the same 24px type, so all three are written out
 * rather than shared — they were measured, not assumed.
 */
const EYEBROW_DARK =
  "eyebrow text-base leading-[1.3] tracking-[0.16em] text-gold sm:text-2xl sm:tracking-[0.333em]";

/**
 * The four ways in.
 *
 * ⚠ NOT `contactRoutes`. That object carries the same four destinations as
 * three-word descriptions ("Guesting, school groups, bookings") for the
 * compact door set on About and Our People. The frame draws these at full
 * size with the longer body, which is Living Work's "Get involved" wording —
 * the same text the previous build of this page already carried. Both are
 * needed and neither is a duplicate of the other: one is a door, this is the
 * room behind it.
 *
 * The labels are verb-led and never a route path, which is the frame's own
 * treatment (`→ GUESTING ON-COUNTRY`, not `→ /wonder`).
 */
const WAYS = [
  {
    title: "Coming on Country",
    body: "Guesting for families, school groups and visitors. Small groups, and dates arranged with you rather than off a list.",
    label: "Guesting on-Country",
    href: "/wonder",
  },
  {
    title: "Research and partnerships",
    /* Verbatim from the Truth v3 draft, the same sentence /partnerships opens
       on. Quoted rather than imported for the reason recorded there: reaching
       into Truth's era model for one string couples this page to it. */
    body: "A researcher on Country is a guest on Country. Partnerships here are expected to give something back to the land and the people.",
    label: "Research opportunities",
    href: "/partnerships",
  },
  {
    title: "Ranger exchange",
    body: "On-Country training camps and exchanges with other First Nations ranger groups.",
    label: "See the work",
    href: "/living-work#rangers",
  },
  {
    title: "Something for the record",
    /* A compression of `recordGrows.contribute.items` (the-record.ts) — the
       four things the record asks people to look for, run into one sentence. */
    body: "Photographs of the escarpment or the station, station records, letters, diaries, maps, and family papers mentioning Iningai people.",
    label: "What is in the record",
    href: "/the-record",
  },
] as const;

/** The frame's rotation. Literal classes — `bg-${tone}` compiles to nothing. */
const WAY_GROUNDS = [
  "bg-evergreen",
  "bg-roasted",
  "bg-midnight",
  "bg-charcoal",
] as const;

/** boomerang, circle, starburst, boomerang — decorative, never a category. */
const WAY_GLYPHS: SeamGlyphMotif[] = ["c", "a", "b", "c"];

/* -------------------------------------------------------------------------
   01 · Hero — "Get in touch" · 130vh
   ------------------------------------------------------------------------- */

/**
 * Type on a bare evergreen ground, with the artist's two spirals behind it.
 *
 * ⚠ THE ONLY HERO ON THE SITE WITH NO PHOTOGRAPH, and that is the frame's
 * decision, not an omission: the lo-fi supplies no direction for this page and
 * no frame has been chosen from any batch. The marker says so on the canvas
 * rather than in a comment, because an absent picture is unreal content and
 * that is what the placeholder rule is for. It is trimmed to the absence
 * itself — why no frame was chosen is the notes lane's business.
 *
 * THE PAGE'S FIRST ACTION GOES DOWN, not away. The blob jumps to §04 for the
 * reader who already knows what they want; everyone else reads §02.
 */
export function ConnectHero() {
  return (
    <section data-nav-hero className="relative bg-evergreen text-canvas">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <RingArtwork piece="a" className="-left-48 top-[53%] w-[40rem]" />
        <RingArtwork piece="b" className="top-[8%] left-[64.5%] w-[56.25rem]" />
      </div>

      <div className={`${COLUMN} relative flex min-h-[92svh] flex-col justify-center py-24 lg:min-h-[130svh] lg:py-0`}>
        <p className={EYEBROW_DARK}>Connect</p>
        {/* `text-h1` since 11 Sep 2026 — was a 56/72/100 ladder. The
            tracking stays: it is this hero's own optical correction on two
            short words, not part of the scale. */}
        <h1 className="headline mt-6 max-w-[1240px] text-h1 tracking-[-0.017em]">
          Get in touch
        </h1>
        <p className="mt-8 max-w-[1000px] text-lg leading-[1.5] font-medium sm:text-2xl">
          Different things go to different people. Tell us which and it reaches
          the right person faster.
        </p>

        {/* Verb-led, and it says where it lands — never the route path. */}
        <div className="mt-10">
          <BlobButton href="#contact-details" tone="burnt" still>
            Contact details →
          </BlobButton>
        </div>

        <p
          data-placeholder="no-hero-image"
          className="mt-10 max-w-[900px] text-xs leading-[1.5] text-gold"
        >
          [ No hero image — typographic until a frame is chosen ]
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   02 · Ways in — ⚑ the router · 190vh
   ------------------------------------------------------------------------- */

/**
 * Four cards at full size — 600 x 420 in the frame, two across.
 *
 * THE CARD IS `ContactDoors`' RECIPE AT ROOM SCALE, not a second pattern:
 * coloured ground, the artist's motif where an image band would be, then
 * title, body and a verb-led label at the foot. It is written here rather than
 * reusing that component because the two differ in both the copy they carry
 * and the size they carry it at — a door is a three-word description in a
 * 298px column, this is Living Work's full sentence in a 600px one. Change one
 * and look at the other.
 *
 * ⚠ NO PHOTOGRAPHS, and the frame is right about that. This is the no-image
 * card set: four routes have to read as four equal choices, and a photograph
 * on each would rank them by how good the picture is.
 *
 * On a phone the row becomes a swipe rail, the way every four-card row on the
 * site now does. Two-up returns at 640, which is where the frame's own layout
 * starts to fit.
 */
export function WaysIn() {
  return (
    <section className="relative bg-canvas text-charcoal">
      <WaveDivider ground="var(--color-canvas)" />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <RingArtwork piece="a" className="-left-48 top-[52%] w-[40rem] opacity-30" />
      </div>

      <div className={`${COLUMN} relative pt-16 pb-16 lg:pt-24 lg:pb-28`}>
        <p className="eyebrow text-base leading-[1.3] tracking-[0.16em] text-ochre sm:text-2xl sm:tracking-[0.333em]">
          What are you after?
        </p>
        <h2 className="headline mt-6 text-4xl leading-[1.2] tracking-[-0.016em] text-evergreen sm:text-5xl lg:text-[3.5rem]">
          Ways in
        </h2>

        <CardRail
          className="mt-12"
          columns="sm:grid-cols-2"
          gap="sm:gap-10"
        >
          {WAYS.map((way, i) => (
            <a
              key={way.title}
              href={way.href}
              className={`relative flex flex-col overflow-hidden rounded-3xl ${WAY_GROUNDS[i]} p-6 text-canvas lg:min-h-[25rem] lg:p-9`}
            >
              <SeamGlyph
                motif={WAY_GLYPHS[i]}
                className="relative top-0 left-0 mb-8 w-12 shrink-0 lg:mb-12 lg:w-16"
              />
              <h3 className="headline text-2xl leading-[1.2] tracking-[-0.03em] sm:text-[1.75rem] lg:text-[2rem]">
                {way.title}
              </h3>
              <p className="mt-4 max-w-[500px] text-[1.0625rem] leading-[1.5] text-canvas/85">
                {way.body}
              </p>
              <p className="eyebrow mt-auto pt-8 text-[0.8125rem] tracking-[0.24em] text-gold lg:tracking-[0.357em]">
                → {way.label}
              </p>
            </a>
          ))}
        </CardRail>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   03 · No form, and that is on purpose · R9 · 100vh
   ------------------------------------------------------------------------- */

/**
 * A whole screen given to something the page does NOT have.
 *
 * It earns the screen: a contact page without a form reads as unfinished
 * unless it says otherwise, and the reader who came here to send a message
 * needs to know where to go instead — which is the four cards above and the
 * address below.
 *
 * ⚠ THE INTERNAL CITATIONS ARE NOT ON THE CANVAS. The frame sets this
 * paragraph with "Build documentation §11 and risk R9 both require…" in it,
 * and the second paragraph is about there being no Connect draft. A visitor
 * can no more parse "R9" than they can parse `→ /living-work#rangers`, so the
 * risk keeps its sentence and loses its reference number, and the paragraph
 * about the draft renders as an `EditorialNote` — marked as a note, which is
 * what it is — rather than dressed as page copy. Nothing is invented and
 * nothing is dropped; see CLAUDE.md, "Notes belong in the notes lane".
 */
export function NoForm() {
  return (
    <section className="relative bg-roasted text-canvas">
      <WaveDivider ground="var(--color-roasted)" />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <RingArtwork piece="b" className="top-[9%] left-[66%] w-[47.5rem]" />
      </div>

      <div className={`${COLUMN} relative py-16 lg:py-24`}>
        <p className="eyebrow text-base leading-[1.3] tracking-[0.16em] text-gold sm:text-2xl sm:tracking-[0.25em]">
          No form — and that is on purpose
        </p>
        <p className="mt-8 max-w-[980px] text-lg leading-[1.5] font-medium sm:text-[1.375rem]">
          There is no enquiry form on this page. The Privacy Policy and the
          Terms have to exist before any form goes live, and both are still
          placeholders.
        </p>

        <div className="mt-12 max-w-[980px]">
          <EditorialNote label="Why this page reads as it does">
            <p>
              There is no Connect draft. The block below is the “Get in touch”
              section the About and Our People drafts both carry, and the four
              ways in are Living Work’s. When a Connect draft arrives, this page
              is where it goes.
            </p>
          </EditorialNote>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   04 · Contact details — ⚑ no doors · 90vh
   ------------------------------------------------------------------------- */

/**
 * The six fields, the thread arriving as a 2px rule, and an action that is
 * drawn and not filled.
 *
 * ⚠ THE PRIMARY ACTION IS A HOLD, AND IT IS THE POINT OF THE PAGE. Every
 * arrow on the site ends at Connect, and Connect has no address to send
 * anyone to — five of the six fields below are the drafter's own square
 * brackets, the email included. Rendering a live `mailto:` here would send
 * mail somewhere nobody reads while the sender believes they have made
 * contact, which is worse than sending none. So the button is drawn at full
 * size and left unfilled: the shape of the thing that is missing, at the exact
 * spot it is missing from. It is not a link and must not become one until
 * `contact.ts` clears `pending`.
 *
 * ⚑ NO DOORS HERE. §02 is the router; this is details only.
 */
export function ContactDetailsSection() {
  return (
    <section
      id="contact-details"
      className="relative scroll-mt-28 bg-charcoal text-canvas"
    >
      <WaveDivider ground="var(--color-charcoal)" />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <RingArtwork piece="a" className="-left-44 top-[32%] w-[36.7rem]" />
        <RingArtwork piece="b" className="top-[2%] left-[64.4%] w-[56.25rem]" />
      </div>

      <div className={`${COLUMN} relative pt-16 pb-16 lg:pt-24 lg:pb-28`}>
        <p className="eyebrow text-base leading-[1.5] tracking-[0.08em] text-ochre sm:text-2xl">
          Contact details
        </p>
        {/* The thread, arrived. It is the full column wide at every size. */}
        <div aria-hidden className="mt-8 h-[2px] w-full bg-ochre" />

        <div className="mt-12 lg:mt-14">
          <ContactDetails
            accent="text-ochre"
            ink="text-canvas/90"
            width="max-w-[390px]"
          />
        </div>

        {/* Drawn, not filled. Not an anchor, not a button — there is nothing
            for it to do yet, and an element that looks pressable and is not
            is worse than a shape that plainly is not. */}
        <p
          data-placeholder="primary-action"
          className="eyebrow mt-14 inline-block max-w-full rounded-full border-[1.5px] border-dashed border-gold/70 px-6 py-4 text-[0.8125rem] leading-[1.4] tracking-[0.28em] text-gold lg:px-10 lg:text-base lg:tracking-[0.3125em]"
        >
          [ Email us — no confirmed address yet ]
        </p>

        <p className="mt-10 max-w-[1100px] text-[0.9375rem] leading-[1.5] text-gold">
          {contactNote}
        </p>
      </div>
    </section>
  );
}
