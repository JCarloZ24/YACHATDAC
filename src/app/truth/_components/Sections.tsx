import { existsSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import {
  loreMarker,
  suzanne,
  truthHero,
  type TruthEntry,
  type TruthEra,
} from "@/content/truth";
import { MOTION_GRADE, type MediaSlot } from "@/content/lofi/media";
import { rewindCue, truthBreaks, wattanuri } from "@/content/truth";
import {
  truthBreakMedia,
  truthEntryMedia,
  truthCountPortrait,
  truthDeedPlateSlot,
  truthHeroSlot,
  truthTodayPlateSlot,
  truthWattanuriMedia,
} from "@/content/truth-media";
import { MediaOrField } from "@/components/ui/MediaOrField";
import { EditorialNote } from "@/components/ui/EditorialNote";
import { PullQuote } from "@/components/ui/PullQuote";
import { WordEmphasis } from "@/components/lofi/ui/WordEmphasis";
import { SharedMorph } from "@/components/transitions/SharedMorph";
import { WaveDivider } from "@/components/ui/Furniture";

/* COVER CROPS NEED HEIGHT, NOT JUST WIDTH.
   Every photograph in the library is ~1.9:1 landscape (3840x2024). `sizes`
   only tells the browser the WIDTH a slot renders at, so a full-bleed slot on
   a phone (375x667, portrait) asked for a 750px-wide file and then had to
   stretch its 395px of height up to 1334 — a 3.4x upscale, which is what
   read as blur (up to 6x on the tall closing plate). The width a cover crop
   really needs is box-width x (source-aspect / box-aspect), so the phone
   values below are deliberately larger than the viewport. Measured 5 Sep
   2026 at 375x667 and 1440x900, both @2x. */
const COVER_FULL_BLEED = "(min-width: 1024px) 100vw, 260vw";
/**
 * The two ENTRY plates (TODAY, the 2026 deed) hold a full 100svh on a phone,
 * which is a taller box than the breaks: 390x844 needs 1.9 x 844 = 1,604 CSS
 * px of cover crop, or 411vw. 260vw served 1,014 and the plate read soft at
 * device-pixel-ratio 1 — sharp enough at the 2x a handset actually has, but
 * this is also what a reviewer sees in a desktop browser's device emulation,
 * which is where it was reported (user, 11 September 2026). Both plates are
 * below the fold and lazy, so this spends no part of the R11 budget.
 */
const COVER_PLATE = "(min-width: 1024px) 100vw, 420vw";
/** The closing plate runs ~3.2 screens tall on a phone; 3840 is the ceiling. */
const COVER_TALL_BLEED = "(min-width: 1024px) 100vw, 400vw";

/**
 * /v2/truth — the descent, at full cinematic weight (F7).
 *
 * Structure and copy are the committed src/content/truth.ts, unchanged. The
 * grounds belong to their section bands and the five supplied Wave / Divider
 * instances carry each incoming colour over the join. The rail on the left is
 * the record; its fill is scroll position (machine easing — a progress
 * indicator that eases is lying).
 *
 * The 1902 band is the page's hard moment: the count stands alone at
 * viewport scale with nothing else on screen (the copy draft's own build
 * note), and Suzanne's testimony below it carries NO motion attributes —
 * stillness as the doctrine's stated exception, because these are her words
 * being read.
 *
 * Era → band mapping (content eras are finer-grained than the six grounds):
 * Ahead + Today → present · Bought back → return · 1950s → named-wrong ·
 * 1902 → count · 1840s + Older than the record → before-record · 100M years
 * → deep-time. Return and named-wrong share one roasted-brown surface.
 */

export type BandId =
  | "present"
  | "return"
  | "named-wrong"
  | "count"
  | "before-record"
  | "deep-time";

const RAIL_MARKS: Array<{ id: BandId; label: string }> = [
  { id: "present", label: "Today" },
  { id: "return", label: "Bought back" },
  { id: "named-wrong", label: "1950s" },
  { id: "count", label: "1902" },
  { id: "before-record", label: "Older" },
  { id: "deep-time", label: "Deep time" },
];

/** The record rail. The lore legend never breaks; the marks track the reader. */
export function TruthRailV2() {
  return (
    <div
      aria-hidden
      className="fixed left-6 top-1/2 z-20 hidden -translate-y-1/2 lg:block"
    >
      <p className="eyebrow mb-6 origin-top-left text-[9px] tracking-[0.2em] text-ochre/70">
        {loreMarker}
      </p>
      <div className="relative h-[46svh] w-px bg-canvas/15">
        <div
          data-descent-rail-fill
          className="absolute inset-0 bg-ochre will-change-transform"
        />
      </div>
      <ul className="mt-6 space-y-3">
        {RAIL_MARKS.map((mark) => (
          <li
            key={mark.id}
            data-descent-mark={mark.id}
            className="eyebrow text-[9px] text-canvas/30 transition-colors duration-300 data-[state=active]:text-ochre data-[state=passed]:text-canvas/60"
          >
            {mark.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The gitignored library means a slot's file may be absent on this machine
 * even when its src is set. Resolve at render (server component) so an absent
 * photograph falls back to the honest field instead of a broken image.
 */
function presentSrc(src: string | null): string | null {
  return src && existsSync(join(process.cwd(), "public", src)) ? src : null;
}

/**
 * The hero — the C4 morph target from /v2/home's Truth beat, now set to the
 * hi-fi frame (1440×1052 SVG spec, 2026-09-02): dusk photograph full-bleed
 * under a dark linear wash, gold TRUTH eyebrow, Display/96 headline, plain
 * lead standfirst, and the GoodDog cue — the block sits mid-frame, not on the
 * baseline. The spec's hero carries only the cue; "Research & partnerships"
 * is reachable through the Ahead era's own entries.
 */
export function TruthHeroV2() {
  return (
    /* The hero owns no divider. Its incoming Ahead deck carries that wave,
       keeping the crest attached to the cover rather than to this pinned
       runway. */
    <div data-truth-slide-runway data-nav-hero className="relative bg-canvas">
      <header
        data-truth-slide
        data-truth-slide-label="Truth"
        data-truth-ground="present"
        className="relative flex min-h-svh items-center overflow-hidden"
      >
        <SharedMorph name="v2-truth-media">
          <div className="absolute inset-0">
            <div
              data-v2-hero-media
              data-motion={MOTION_GRADE[truthHeroSlot.bucket]}
              className="absolute inset-0"
            >
              <MediaOrField
                src={presentSrc(truthHeroSlot.src)}
                alt="Country at dusk — bare trees against the last light over Turraburra."
                sizes={COVER_FULL_BLEED}
                quality={85}
                priority
                className="object-cover"
                fieldClass="bg-midnight"
              />
            </div>
          </div>
        </SharedMorph>
        {/* X5 — the spec's linear wash: heavier at the foot, never opaque.
            DEEPENED THROUGH THE MIDDLE, 11 September 2026 (client: the hero is
            not readable under its white type). The wash was built bottom-
            weighted — 80% at the foot falling to 10% at the crown — but the
            copy block is seated MID-FRAME, which is exactly where it was
            thinnest. The foot is left where it was; what changes is the band
            the words actually sit in. Still never opaque: this is a scrim over
            a photograph, the one gradient the token rules allow. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-charcoal/85 via-charcoal/55 to-charcoal/25"
        />

        {/* Spec column: text block ~225px in from the frame edge, lines running
            to ~1035px — wider than the body container, so the hero opens up. */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-24 lg:px-12">
          {/* Gold here is the spec's hero accent — eyebrow and cue only. */}
          <p className="eyebrow text-gold">
            {truthHero.eyebrow}
          </p>
          <h1 className="headline mt-8 max-w-4xl text-h1 text-canvas lg:max-w-none">
            {truthHero.title}
          </h1>
          <p className="mt-10 max-w-2xl text-xl leading-relaxed text-canvas">
            {truthHero.standfirst}
          </p>
          {/* The href IS the behaviour on the deck and with no JavaScript.
              Below lg `truthRewind` takes the press instead and carries the
              reader down the descent to the Wattanuri floor — the grammar's
              "the guide leading the eye, Truth's rewind cue". */}
          <a
            href={truthHero.actions[0].href}
            data-hero-cue
            data-truth-rewind
            className="callout scroll-cue-glow mt-14 block w-fit text-scroll text-gold"
          >
            {truthHero.actions[0].label} &darr;
          </a>
        </div>

      </header>

    </div>
  );
}

/**
 * One entry's photo strip. Real photograph where the library has one, honest
 * tonal field where it does not (the photo-batch rule: do not fake the gap).
 *
 * Default image planes use the scrubbed M1 camera push. A frame-graded tile
 * remains held; the grade travels with the slot, not the call site.
 */
/** Tailwind cannot see a computed class — the tone map has to be literal. */
const FIELD_CLASS: Record<MediaSlot["tone"], string> = {
  evergreen: "bg-evergreen/50",
  midnight: "bg-midnight/50",
  roasted: "bg-roasted/50",
  oxide: "bg-oxide/50",
  burnt: "bg-burnt/50",
  eucalyptus: "bg-eucalyptus/50",
  charcoal: "bg-charcoal/50",
};

/**
 * Each ledger beat owns an opaque ground while the previous beat is pinned.
 * The value is semantic rather than a computed Tailwind class: globals.css
 * paints the matching Country token across the full viewport width.
 */
function entryGround(id: string | undefined): BandId {
  if (id === "precinct" || id === "partner" || id === "today-fire") {
    return "present";
  }
  if (
    id === "study-2022" ||
    id === "research-discovery" ||
    id === "renamed" ||
    id === "just-us" ||
    id === "father"
  ) {
    return "return";
  }
  if (id === "art-gallery") return "named-wrong";
  if (id === "mitchell" || id === "engraving" || id === "opportunities") {
    return "before-record";
  }
  return "deep-time";
}

/**
 * The precinct's photo pair, per the hi-fi frame (1440×1078 SVG, 2026-09-02):
 * a large rounded photograph left, a smaller one seated lower right, the
 * boomerang glyph over the big photo's top-left and the blue spiral in the
 * small photo's corner. Artwork stays static (the GoldTrail rule) and the
 * glyphs are decorative — empty alt, hidden from readers.
 */
function FeatureMedia({ slots, caption }: { slots: MediaSlot[]; caption?: string }) {
  const [lead, side] = slots;
  /* NO CAMERA PUSH, deliberately, and this is the only media frame on the page
     without one. Two reasons, and either would be enough:

     §02/§03's loud channel is TYPE (scenes.md) — the precinct is argued in
     words and its photographs are evidence, so a scrubbed push here would be a
     second loud channel on a screen that already has one.

     And the plane's transform is spoken for. These are the only photographs on
     Truth that respond to a pointer: hovering the card scales the picture
     inside its fixed frame. GSAP writes `pushIn` as an inline transform, which
     beats a stylesheet rule, so a push and a hover cannot share one plane —
     the hover would simply never appear. The quieter of the two wins. */
  return (
    <figure className="mt-10 max-w-4xl">
      <div className="grid items-end gap-6 sm:grid-cols-[3fr_2fr] sm:gap-10">
        <div
          data-truth-tile="0"
          className="relative aspect-3/2 overflow-hidden rounded-2xl"
        >
          <MediaOrField
            src={presentSrc(lead.src)}
            alt={lead.expects}
            sizes="(min-width: 640px) 45vw, 100vw"
            fieldClass={FIELD_CLASS[lead.tone]}
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
          <img
            src="/artwork/glyph-c.svg"
            alt=""
            aria-hidden
            className="absolute left-5 top-5 w-11 opacity-90"
            loading="lazy"
          />
          {/* The wireframe's dot-wave trail running under the lead photo. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
          <img
            src="/artwork/dots-wave-gold.svg"
            alt=""
            aria-hidden
            className="pointer-events-none absolute -bottom-1 left-0 w-full opacity-70"
            loading="lazy"
          />
        </div>
        <div
          data-truth-tile="1"
          className="relative aspect-3/2 overflow-hidden rounded-2xl sm:mb-10"
        >
          <MediaOrField
            src={presentSrc(side.src)}
            alt={side.expects}
            sizes="(min-width: 640px) 30vw, 100vw"
            fieldClass={FIELD_CLASS[side.tone]}
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
          <img
            src="/artwork/glyph-b.svg"
            alt=""
            aria-hidden
            className="absolute bottom-4 right-4 w-10"
            loading="lazy"
          />
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-3 text-xs leading-relaxed text-charcoal/60">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/**
 * The Today montage (05 · TODAY montage — GROUND, 2026-09-02): four
 * photographs in the frame's staggered grid — the lead large on the left
 * with the boomerang glyph seated bottom-right, the seedling tunnel top
 * right carrying the spiral mark, the close seed-hand small under the lead,
 * the picking photograph closing lower right. Rounded like the precinct
 * pair; artwork static (the GoldTrail rule), decorative, hidden.
 *
 */
function TodayMontage({ slots }: { slots: MediaSlot[] }) {
  const [lead, tunnel, hand, picker] = slots;
  const anyFrameGraded = slots.some((slot) => MOTION_GRADE[slot.bucket] === "frame");
  return (
    <figure className="mt-10 max-w-4xl">
      <div
        {...(anyFrameGraded ? {} : { "data-v2-camera": true })}
        className="grid items-start gap-6 sm:grid-cols-[13fr_9fr]"
      >
        {/* data-truth-tile carries the LAYING order, which is not DOM order:
            the grid reads down its left column then its right, and the frame
            lays the montage lead → tunnel → hand → picker. The module wants
            the order a hand would put them down in, so it is stated here
            rather than inferred from the column split. */}
        <div className="space-y-6">
          <div
            data-truth-tile="0"
            className="relative aspect-3/2 overflow-hidden rounded-2xl"
          >
            <MediaOrField
              src={presentSrc(lead.src)}
              alt={lead.expects}
              sizes="(min-width: 640px) 50vw, 100vw"
              fieldClass={FIELD_CLASS[lead.tone]}
            />
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
            <img
              src="/artwork/glyph-c.svg"
              alt=""
              aria-hidden
              className="absolute bottom-4 right-4 w-11 opacity-90"
              loading="lazy"
            />
          </div>
          <div
            data-truth-tile="2"
            className="relative aspect-3/2 w-3/5 overflow-hidden rounded-2xl"
          >
            <MediaOrField
              src={presentSrc(hand.src)}
              alt={hand.expects}
              sizes="(min-width: 640px) 25vw, 60vw"
              fieldClass={FIELD_CLASS[hand.tone]}
            />
          </div>
        </div>
        <div className="space-y-6">
          <div
            data-truth-tile="1"
            className="relative aspect-8/5 overflow-hidden rounded-2xl"
          >
            <MediaOrField
              src={presentSrc(tunnel.src)}
              alt={tunnel.expects}
              sizes="(min-width: 640px) 35vw, 100vw"
              fieldClass={FIELD_CLASS[tunnel.tone]}
            />
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
            <img
              src="/artwork/glyph-spiral-blue.svg"
              alt=""
              aria-hidden
              className="absolute right-4 top-4 w-10 opacity-90"
              loading="lazy"
            />
          </div>
          <div
            data-truth-tile="3"
            className="relative aspect-3/2 overflow-hidden rounded-2xl"
          >
            <MediaOrField
              src={presentSrc(picker.src)}
              alt={picker.expects}
              sizes="(min-width: 640px) 35vw, 100vw"
              fieldClass={FIELD_CLASS[picker.tone]}
            />
          </div>
        </div>
      </div>
    </figure>
  );
}

/**
 * The 2020 diptych (10 · ENTRY 2020 — GROUND · brown + DIPTYCH, 2026-09-03):
 * "the walk in, and the light on it". Two photographs on a 920 stage —
 * the anchor 539×341 left, the detail 359×270 right and dropped 80px —
 * deliberately unbalanced. The seam glyph (glyph-a, an existing artist
 * mark) sits in the detail's lower-right corner; the gold dot wave rides
 * the anchor's lower edge at 0.85. Artwork static (the GoldTrail rule),
 * decorative, hidden from readers.
 */
function Diptych({
  slots,
  variant,
}: {
  slots: MediaSlot[];
  /**
   * `seam` — the 2020 frame: starburst in the detail's lower-right corner,
   * dot wave along the anchor's foot. `lead` — the 2019 frame (11 · ENTRY
   * 2019): the blue spiral (Truth/motif5) on the anchor's top-left, no wave.
   */
  variant: "seam" | "lead";
}) {
  const [anchor, detail] = slots;
  const anyFrameGraded = slots.some((slot) => MOTION_GRADE[slot.bucket] === "frame");
  return (
    <figure className="mt-10 max-w-4xl">
      <div
        {...(anyFrameGraded ? {} : { "data-v2-camera": true })}
        className="grid gap-6 sm:grid-cols-[539fr_359fr] sm:items-start"
      >
        <div className="relative aspect-539/341 overflow-hidden rounded-3xl">
          <MediaOrField
            src={presentSrc(anchor.src)}
            alt={anchor.expects}
            sizes="(min-width: 640px) 40vw, 100vw"
            fieldClass={FIELD_CLASS[anchor.tone]}
          />
          {variant === "seam" ? (
            /* The dot wave ON the photograph, along its lower edge — spec
               x466 of the 440 stage, 460 wide of the anchor's 539. */
            /* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */
            <img
              src="/artwork/dots-wave-gold.svg"
              alt=""
              aria-hidden
              className="pointer-events-none absolute -bottom-1 left-[5%] w-[85%] opacity-85"
              loading="lazy"
            />
          ) : (
            /* Truth/motif5 — the blue spiral, 44px at x466 y462 of the frame:
               26px in and 13px down from the anchor's corner. */
            /* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */
            <img
              src="/artwork/glyph-spiral-blue.svg"
              alt=""
              aria-hidden
              className="absolute left-6 top-3 w-11"
              loading="lazy"
            />
          )}
        </div>
        {/* The detail drops 80px on the 342-high stage (~23%) — self-start
            plus a top margin, so it never stretches to the anchor's height. */}
        <div className="relative aspect-359/270 overflow-hidden rounded-3xl sm:mt-[21%]">
          <MediaOrField
            src={presentSrc(detail.src)}
            alt={detail.expects}
            sizes="(min-width: 640px) 27vw, 130vw"
            fieldClass={FIELD_CLASS[detail.tone]}
          />
          {variant === "seam" ? (
            /* Seam glyph — marks the image edge. glyph-a is the spec's
               orange starburst (F9B24C / D57907 / 98470D). */
            /* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */
            <img
              src="/artwork/glyph-a.svg"
              alt=""
              aria-hidden
              className="absolute bottom-4 right-4 w-11"
              loading="lazy"
            />
          ) : null}
        </div>
      </div>
    </figure>
  );
}

/**
 * 16 · ENTRY 1840s — GROUND · navy (2026-09-03). The photograph of the
 * Country he described, wide and shallow (920×320, radius 8), the artwork
 * cluster on its top-right corner and the blue spiral seam glyph at its
 * lower-right edge; beneath it the DOCUMENT slot — a scan of the journal
 * page, not a photograph — held, dashed, labelled in the slot itself.
 * Artwork static (the GoldTrail rule); the held slot is not for
 * publication and says so.
 */
function CountryAndDocument({ slots }: { slots: MediaSlot[] }) {
  const [country, document] = slots;
  const documentSrc = presentSrc(document.src);
  return (
    <figure className="mt-10 max-w-4xl">
      <div
        {...(MOTION_GRADE[country.bucket] === "frame" ? {} : { "data-v2-camera": true })}
        className="relative aspect-23/8 overflow-hidden rounded-lg"
      >
        <MediaOrField
          src={presentSrc(country.src)}
          alt={country.expects}
          sizes="(min-width: 1024px) 64vw, 100vw"
          fieldClass={FIELD_CLASS[country.tone]}
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
        <img
          src="/artwork/cluster.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute right-[4%] top-6 w-28 opacity-95"
          loading="lazy"
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
        <img
          src="/artwork/glyph-spiral-blue.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-4 right-6 w-11"
          loading="lazy"
        />
      </div>
      {documentSrc ? (
        <div
          data-motion={MOTION_GRADE[document.bucket]}
          className="relative mt-6 aspect-[768/420] max-w-3xl overflow-hidden rounded"
        >
          <MediaOrField
            src={documentSrc}
            alt={document.expects}
            sizes="(min-width: 1024px) 54vw, 100vw"
            fieldClass={FIELD_CLASS[document.tone]}
          />
        </div>
      ) : null}
      {/* THE HELD NOTE IS GONE from this slot (client direction, 11 September
          2026). The journal scan is still outstanding and the slot is still
          here waiting for it — `documentSrc` renders the moment one is
          supplied — but the page no longer says so on its own face. The
          placeholder doctrine is unchanged everywhere else; this is one
          section being taken out of draft dress for the presentation. */}
    </figure>
  );
}

/**
 * P6 · portrait + testimony (12 · ENTRY 2003 — GROUND · brown + PORTRAIT,
 * 2026-09-03). Portrait 294×386 left, rounded 24px; quoted speech right at
 * Lead/24 with the gold Eyebrow/Footer-12 attribution seated at the foot.
 *
 * The quote is Y2 — per-word opacity ramp, dim state 0.28, NO movement —
 * right for testimony, wrong for marketing copy. The ramp runs from the
 * descent module; without it the words read at full opacity.
 *
 * The portrait is HELD — no push, no scale, whatever its bucket allows. The
 * ledger says so in as many words (scenes.md §12, "the portrait is held",
 * intensity ✓✓) and the grammar's "a person speaking" row says "no movement at
 * all". It used to take the page's default 1.00→1.06 camera push, which is the
 * ordinary-media treatment and this is not ordinary media: it is the one
 * photograph on the page of the man being spoken about. The permission the
 * bucket grants is not the same as the instruction the frame gives.
 *
 * The attribution waits for the last word. Someone finishes speaking and only
 * then are they named — naming them while they are still talking puts the
 * caption ahead of the testimony.
 *
 * No testimony in the content means no quotation on the page: the slot
 * renders an editorial note instead. A quote is never paraphrased into
 * being (D15/R17).
 */
function PortraitTestimony({
  slot,
  testimony,
}: {
  slot: MediaSlot;
  testimony?: TruthEntry["testimony"];
}) {
  return (
    <figure className="mt-10 max-w-4xl">
      <div className="grid gap-8 sm:grid-cols-[294fr_626fr] sm:gap-14">
        <div className="relative aspect-294/386 overflow-hidden rounded-3xl">
          <div
            data-v2-static
            data-motion={MOTION_GRADE[slot.bucket]}
            className="absolute inset-0"
          >
            <MediaOrField
              src={presentSrc(slot.src)}
              alt={slot.expects}
              sizes="(min-width: 640px) 34vw, 220vw"
              quality={85}
              fieldClass={FIELD_CLASS[slot.tone]}
            />
          </div>
        </div>
        <div className="flex flex-col justify-between py-2 sm:py-9">
          {testimony ? (
            <>
              <WordEmphasis
                as="blockquote"
                text={testimony.quote}
                className="max-w-xl text-xl font-medium leading-relaxed text-charcoal/92 sm:text-2xl"
              />
              <figcaption
                data-truth-attribution
                className="eyebrow mt-10 max-w-xs text-xs leading-relaxed text-ochre-deep"
              >
                {testimony.attribution} &middot; {testimony.role}
              </figcaption>
            </>
          ) : (
            <EditorialNote label="Needs Suzanne's words — not for publication">
              The frame sets quoted speech here, attributed to Suzanne Thompson.
              The draft carries no quotation for this entry, and the frame&apos;s
              placeholder line paraphrased the narration, so nothing is
              rendered until her recorded words are supplied.
            </EditorialNote>
          )}
        </div>
      </div>
    </figure>
  );
}

/**
 * The 1950s written record (13 · ENTRY 1950s — GROUND · brown, dimmed · the
 * light is going out, 2026-09-03): the visitor photograph wide (920×300 of
 * the 1440 frame) and dead still — no push, no depth — with the boomerang
 * glyph and its faint ring cluster seated in the top-right corner; then the
 * DOCUMENT slot below it, dashed, held. The slot wants a scan of the archival
 * write-up, not a photograph, so it renders as an editorial note until one is
 * supplied — nothing is faked into it. The band's ground (#4E3524 under a
 * 0.34 dim) is the descent module's named-wrong layer.
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars -- KEPT ON PURPOSE.
   Its call site was withdrawn on 11 September 2026 (see the 1950s branch in
   EntryBlock) and the two `art-gallery` slots are still in the manifest, so
   this comes back by restoring one line the day a replacement photograph and
   write-up scan are supplied. Deleting it would mean re-deriving the frame's
   920x300 proportion and the seated cluster/glyph placement from the hi-fi. */
function WrittenRecordFrame({ slots }: { slots: MediaSlot[] }) {
  const [visitor, document] = slots;
  const documentSrc = presentSrc(document?.src ?? null);
  return (
    <figure data-v2-static className="mt-10 max-w-4xl">
      <div className="relative aspect-[920/300] overflow-hidden rounded-lg">
        <div data-motion={MOTION_GRADE[visitor.bucket]} className="absolute inset-0">
          <MediaOrField
            src={presentSrc(visitor.src)}
            alt={visitor.expects}
            sizes="(min-width: 1024px) 64vw, 100vw"
            fieldClass={FIELD_CLASS[visitor.tone]}
          />
        </div>
        {/* PENDING-MOTIF — the small ring cluster behind the glyph, 0.08
            baked into the cut. Static, decorative. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
        <img
          src="/artwork/cluster.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute right-[5%] top-6 w-28 opacity-95"
          loading="lazy"
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
        <img
          src="/artwork/glyph-c.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute right-[8%] top-8 w-11"
          loading="lazy"
        />
      </div>
      <div className="mt-6 max-w-3xl">
        {documentSrc ? (
          <div className="relative aspect-[768/180] overflow-hidden rounded-sm border border-current/30">
            <MediaOrField
              src={documentSrc}
              alt={document.expects}
              sizes="(min-width: 1024px) 54vw, 100vw"
              className="object-contain"
            />
          </div>
        ) : (
          /* tone="ink": this note is inside the band whose ground travels
             from cream to charcoal, so it has to travel with it. */
          <EditorialNote
            tone="ink"
            label="HELD — this is a document slot, not a photograph."
            className="min-h-45"
          >
            Wants a scan of the 1950s write-up. Nothing is missing; nothing has
            been supplied yet.
          </EditorialNote>
        )}
      </div>
    </figure>
  );
}

/**
 * P7 · strata stack (19 · ABOUT 100 MILLION YEARS AGO — GROUND · charcoal,
 * 2026-09-03): surface, tree line, stone. Three images stepped vertically
 * with the ground showing between them as sediment bands, each offset
 * horizontally (0 / 129 / 64 of the 920 column) — the layout itself is a
 * cross-section. No people in any layer. Rounded 16px.
 *
 * ⚠ PENDING-MOTIF — both artworks static: the dot cluster sits ON the
 * deepest layer, the seam glyph marks the second image's right edge.
 * Country bucket, so the layers take the ground's depth drift.
 */
function StrataStack({ slots }: { slots: MediaSlot[] }) {
  /* Built from what the manifest actually holds rather than from three fixed
     names: a withdrawn layer (stratum 3 went, client direction 11 September
     2026) used to destructure to `undefined` and take the whole figure down
     on `slot.id`. The indents stay in their order, so the layers that remain
     keep the offsets they were drawn with. */
  const STRATA_OFFSETS = ["ml-0", "sm:ml-[14%]", "sm:ml-[7%]"] as const;
  const strata = slots
    .filter(Boolean)
    .map((slot, i) => ({ slot, offset: STRATA_OFFSETS[i] ?? "ml-0" }));
  return (
    <figure className="mt-10 max-w-4xl">
      {/* §19 is the one section that builds DOWNWARD, with the scroll rather
          than against it — the seabed accumulates the way the strata did. The
          index is stated so the module sequences top → middle → bottom
          explicitly instead of relying on a stagger reading DOM order. */}
      {strata.map(({ slot, offset }, i) => (
        <div
          key={slot.id}
          data-motion={MOTION_GRADE[slot.bucket]}
          data-truth-strata-layer={i}
          {...(MOTION_GRADE[slot.bucket] === "frame" ? {} : { "data-v2-camera": true })}
          className={`relative aspect-[699/221] w-full overflow-hidden rounded-2xl sm:w-[76%] ${offset} ${i > 0 ? "mt-6 sm:mt-9" : ""
            }`}
        >
          <MediaOrField
            src={presentSrc(slot.src)}
            alt={slot.expects}
            sizes="(min-width: 1024px) 48vw, 100vw"
            fieldClass={FIELD_CLASS[slot.tone]}
          />
          {i === 1 ? (
            /* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */
            <img
              src="/artwork/glyph-a.svg"
              alt=""
              aria-hidden
              className="pointer-events-none absolute right-[3%] top-[71%] w-11"
              loading="lazy"
            />
          ) : null}
          {i === 2 ? (
            /* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */
            <img
              src="/artwork/cluster.svg"
              alt=""
              aria-hidden
              className="pointer-events-none absolute left-[66%] top-[44%] w-[16%] opacity-95"
              loading="lazy"
            />
          ) : null}
        </div>
      ))}
    </figure>
  );
}

function EntryMedia({ slots, caption }: { slots: MediaSlot[]; caption?: string }) {
  const anyFrameGraded = slots.some((slot) => MOTION_GRADE[slot.bucket] === "frame");
  /* Six or more slots render as the hi-fi's square filmstrip (the 2022
     frame's Research & discovery strip), not the stacked grid. */
  const strip = slots.length >= 6;
  const cols = strip
    ? "grid-cols-3 sm:grid-cols-6"
    : slots.length >= 3
      ? "sm:grid-cols-3"
      : slots.length === 2
        ? "sm:grid-cols-2"
        : "";
  return (
    <figure className={strip ? "mt-8 max-w-4xl" : "mt-8 max-w-3xl"}>
      <div
        {...(anyFrameGraded ? {} : { "data-v2-camera": true })}
        {...(strip ? { "data-truth-strip": true } : {})}
        className={`grid gap-3 ${cols}`}
      >
        {/* Both six-up strips share this component; the interior recipe is
            chosen by the article the strip sits in, not here. §07 pulls across
            L→R and then drifts; §18 is laid down unevenly. */}
        {slots.map((slot, index) => (
          <div
            key={slot.id}
            data-motion={MOTION_GRADE[slot.bucket]}
            data-truth-tile={index}
            className={`relative overflow-hidden ${strip
              ? "aspect-square rounded-lg"
              : slots.length === 1
                ? "aspect-video max-w-xl"
                : "aspect-4/3"
              }`}
          >
            <MediaOrField
              src={presentSrc(slot.src)}
              alt={slot.expects}
              sizes={strip ? "(min-width: 640px) 15vw, 55vw" : "(min-width: 640px) 33vw, 100vw"}
              fieldClass={FIELD_CLASS[slot.tone]}
            />
          </div>
        ))}
      </div>
      {caption ? (
        <figcaption className="mt-3 text-xs leading-relaxed text-charcoal/60">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function EntryBlock({
  entry,
  kicker,
  titleOnPlate,
  gutterLabel,
  gutterSub,
  withinDeck = false,
}: {
  entry: TruthEntry;
  /**
   * The hi-fi precinct frame (1440×1078 SVG, 2026-09-02) folds the era title
   * into the entry column as an ochre eyebrow over a display-scale entry
   * title — passed down by EraSection where a frame calls for it.
   */
  kicker?: string;
  /**
   * The Today entry's title lives on its full-bleed plate (04 · ENTRY TODAY),
   * so the block below the plate opens straight on the body — repeating the
   * headline would read the same line twice in one viewport.
   */
  titleOnPlate?: boolean;
  /**
   * Overrides the gutter's gold era label (Eyebrow/Section-24 per the 06
   * frame) — the Ahead era passes its marker here so the gutter reads
   * AHEAD / WITHIN FIVE YEARS. Dated entries derive the year themselves.
   */
  gutterLabel?: string;
  /**
   * Overrides the gutter's Link/14 sub. The 2020 frame (10 · ENTRY 2020)
   * sets the era title — BOUGHT BACK — under the year, not the entry's
   * full when, which the body already opens with.
   */
  gutterSub?: string;
  /** Related articles can share one scroll deck. In that case the parent
   * owns the slide/runway hooks and each article keeps only its semantic
   * anchor and interior arrival treatment. */
  withinDeck?: boolean;
}) {
  const isPartner = entry.id === "partner";
  const isToday = entry.id === "today-fire";
  const isRenamed = entry.id === "renamed";
  /* The 2020 and 2019 frames (10 and 11) share one treatment: the date
     folded into the body's first line at full off-white, the coda at
     Lead/24 medium, the era title as the gutter sub, a diptych below. */
  const isFather = entry.id === "father";
  const isDiptych = isRenamed || entry.id === "just-us";
  /* The 1950s frame (13): the visitor photograph wide, dead still, then the
     held document slot beneath it. */
  const isArtGallery = entry.id === "art-gallery";
  /* 16 · ENTRY 1840s: the Country he described, then the held journal slot. */
  const isMitchell = entry.id === "mitchell";
  /* 17 · OLDER THAN THE RECORD — ⛔ SILENT: typographic only. The era
     marker sits in the gutter with the draft's dating line under it, the
     era title as the burnt kicker, and nothing moves. The story-wall slot
     is withheld (R10), so no media renders here — not even a tonal field. */
  const isEngraving = entry.id === "engraving";
  /* 18 · CARD Still to be found: kicker at Link/14, then evidence strip B. */
  const isOpportunities = entry.id === "opportunities";
  /* 19 · ABOUT 100 MILLION YEARS AGO: the era marker in the gutter, the era
     title as the kicker, then the P7 strata stack — a cross-section. */
  const isSeabed = entry.id === "seabed";
  /* Figma's held beats: these articles are present at full brightness from
     first paint and never join the generic M1 arrival system. */
  const isStill = entry.id === "study-2022" || isEngraving;
  /* Frames 10–13 and 16–19 share the ground-record treatment. */
  const isGroundFrame =
    isDiptych ||
    isFather ||
    isArtGallery ||
    isMitchell ||
    isEngraving ||
    isOpportunities ||
    isSeabed;
  /* The 2022 record frame (2026-09-02) sets the pattern for ground records:
     the year alone in the left gutter at gold, the title at display scale,
     the coda as a large statement, and the record label + CTA on one row.
     A when with no date ("More of this") renders as a burnt kicker instead. */
  const year = isPartner ? undefined : entry.when?.match(/\d{4}s?/g)?.pop();
  /* The gutter block (06 frame): gold era label at Eyebrow/Section-24, the
     full when beneath as a Work Sans Link/14 sub — the sub is dropped when
     it would just repeat the label. */
  const label = gutterLabel ?? year;
  const sub =
    gutterSub ?? (entry.when && entry.when !== label ? entry.when : undefined);
  const whenKicker =
    !isPartner && !label && !isToday ? entry.when : undefined;
  /* The Ahead deck's two records are read as a SET rather than as two
     paragraphs: they arrive one after another and each lifts as it brightens.
     The frame shows a three-across row (L, M, R at ~100ms); the governing
     draft carries only these two entries, so the third card does not exist to
     stagger — raised as a drift rather than invented here. */
  const isAheadCard = entry.id === "precinct" || isPartner;
  /* THE INK. Every entry now reads on the page's one egg-white ground, so the
     dark-ground palette inverts: charcoal body, evergreen headings, and
     burnt-deep for warm accents — the only warm the measured table clears on
     #f6f6ec (6.31:1, where gold is 1.72 and ochre 2.30).

     The 1950s is the exception, because its ground MOVES. Its band walks from
     egg white to the count's charcoal as it is read, so its type cannot be a
     fixed utility in either palette — it rides the same ramped custom
     properties the ground does and crosses over with it.

     Oxide is deliberately absent: it is the count's red, spent once, and the
     canvas tone set in tone.ts would have handed it to every eyebrow here.

     Written as whole literal class strings, never assembled — Tailwind scans
     source text and cannot see a class built at runtime. */
  const ink = isArtGallery ? "text-[color:var(--truth-ink)]" : "text-charcoal";
  const inkBody = isArtGallery ? "text-[color:var(--truth-ink)]" : "text-charcoal/92";
  const inkMuted = isArtGallery ? "text-[color:var(--truth-ink)]" : "text-charcoal/60";
  /* The heading is the SAME dark green in the 1950s as everywhere else (client
     direction, 11 September 2026) — it used to take the band's travelling ink,
     which meant it opened charcoal rather than evergreen. It cannot simply stay
     evergreen, though: this band's ground walks to charcoal and evergreen is
     1.52:1 there. `nineteenFifties` steps it to off-white at the band's own
     0.53 crossover, the same instant the body ink crosses. */
  const inkHead = "text-evergreen";
  /* In the 1950s the accent IS the ink. No warm in the palette clears 4.5:1
     across that band's travel — burnt-deep wants a near-white ground and gold
     a near-black one, and the band spends its middle between the two. The
     colour drains out of the labels as the light goes out of the band. */
  const accent = isArtGallery
    ? "text-[color:var(--truth-ink)]"
    : "text-ochre-deep";
  const accentHover = isArtGallery
    ? "hover:text-[color:var(--truth-ink)]"
    : "hover:text-ochre-deep";
  const entryLayout = `relative grid gap-6 md:grid-cols-[180px_1fr] md:gap-12 ${isPartner ? "py-16 md:py-24" : "py-10"
    }`;
  const article = (
    <article
      id={entry.id}
      {...(withinDeck
        ? {}
        : {
          "data-truth-slide": true,
          "data-truth-slide-label": entry.title,
          "data-truth-ground": entryGround(entry.id),
        })}
      /* A still beat is marked HELD in the markup rather than remembered in a
         motion module. data-v2-static is the existing "never give this motion"
         hook, and every module already honours it, so the stillness survives a
         pass that does not know why it is there. §06 — "the page stops moving
         here, on purpose" (Figma). §17 — older than the record; the stillness
         is the argument. */
      {...(isStill
        ? { "data-v2-static": true }
        : { "data-descent-arrive": true })}
      {...(isAheadCard ? { "data-truth-card": true } : {})}
      /* The 1950s band is the one ground that DETERIORATES as it is read. The
         dim has to ride the slide, not the section around it: once the deck
         pins the article the section stays behind in flow, so a section-level
         overlay stops covering the very thing it is meant to darken. */
      {...(isArtGallery ? { "data-truth-deteriorates": true } : {})}
      /* No rule between records (2026-09-03): the hi-fi frames run the
         entries straight on, separated by the grounds and their spacing. */
      className="relative"
    >
      {/* The hand-off out of the count, seated on the section it INTRODUCES.

          This is the general law — "the hero→Ahead divider is seated on the
          incoming Ahead deck, never on the hero runway" (scenes.md) — and this
          seam was the one place that broke it. Sitting in flow at the count's
          foot, the wave rode the escarpment slide's track, stopped when that
          track stopped, and was then covered by this section rising over it
          instead of leading it. A divider has to be attached to the surface
          that moves during the cover.

          Sibling of the deck viewport, not inside it: the deck sets
          overflow:hidden on [data-truth-deck-viewport] and overflow:visible on
          the slide precisely so an incoming crest can overhang upward onto the
          outgoing beat.

          data-count-wave stays on it — TrailRail measures the record strand's
          restart from this node, and drops to the band top if it vanishes. */}
      {isMitchell && !withinDeck ? (
        <HandoffWave to="canvas" placement="leading" railAnchor bleed />
      ) : null}
      <div {...(withinDeck ? {} : { "data-truth-deck-viewport": true })}>
        <div
          {...(withinDeck ? {} : { "data-truth-deck-track": true })}
          className={entryLayout}
        >
          {/* The left gutter carries the era label and its sub (the 06 frame).
              At lg and up the rail's pointer carries them instead, riding at
              the arrow's tip (user, 10 Sep 2026), so this block goes
              transparent — but stays in flow and in the accessibility tree.
              `opacity-0`, not `sr-only` and not `invisible`: `sr-only` is
              `position: absolute`, which takes the block OUT of the grid, and
              the 180px column then collapses and drags every reading column on
              the page 228px to the left. `invisible` keeps the layout but
              drops the text from the accessibility tree, and the rail that
              replaces it is aria-hidden — so the era would reach nobody. */}
          {label ? (
            /* self-start: as a grid child this would stretch to the row
               height. `data-era-label` / `data-era-sub` are what the deck
               reads the pointer's strings from — see gated-deck's railLabel. */
            <div className="hidden self-start pt-2 md:block lg:pointer-events-none lg:opacity-0">
              {/* normal-case: the eyebrow uppercases, and a decade reads
              "1950s", not "1950S". */}
              <p
                data-era-label
                className={`eyebrow text-xl ${accent} ${/^\d/.test(label) ? "normal-case" : ""}`}
              >
                {label}
              </p>
              {sub ? (
                <p
                  data-era-sub
                  className={`mt-1 text-sm font-normal uppercase leading-relaxed ${ink}`}
                >
                  {sub}
                </p>
              ) : null}
            </div>
          ) : (
            <span aria-hidden className="hidden md:block" />
          )}
          {/* The rail measures its label budget against this column's left edge. */}
          <div data-truth-entry-copy className="max-w-2xl">
            {isPartner ? (
              <p className={`eyebrow mb-6 font-normal ${accent}`}>{entry.when}</p>
            ) : null}
            {kicker || whenKicker ? (
              /* Undated whens ("More of this") are Link-weight, not ExtraBold —
                 only the era kicker keeps the eyebrow's full weight. */
              <p
                className={`eyebrow mb-6 ${accent} ${whenKicker && !kicker ? "font-normal" : ""}`}
              >
                {kicker ?? whenKicker}
              </p>
            ) : null}
            {label ? (
              <div className="mb-6 md:hidden">
                <p className={`eyebrow ${accent} ${/^\d/.test(label) ? "normal-case" : ""}`}>
                  {label}
                </p>
                {sub ? (
                  <p className={`mt-1 text-xs font-normal uppercase ${ink}`}>
                    {sub}
                  </p>
                ) : null}
              </div>
            ) : null}
            {titleOnPlate ? null : (
              <h3
                className={`headline ${inkHead} ${kicker || isPartner || label || whenKicker
                  ? "text-3xl sm:text-5xl"
                  : "text-2xl"
                  }`}
              >
                {entry.href ? (
                  <Link href={entry.href} className={`transition-colors ${accentHover}`}>
                    {entry.title}
                  </Link>
                ) : (
                  entry.title
                )}
              </h3>
            )}
            {kicker || isRenamed || isMitchell ? (
              /* ⚠ WITHDRAWN on the egg-white ground, not deleted from the design.
                 The wireframe's dotted-trail rule under the display title ships in
                 one cut only, gold (360×24), which measures 1.72:1 on #f6f6ec and
                 draws as a smear. There is no charcoal or roasted cut of this
                 asset — public/artwork has gold and off-white and nothing else —
                 so the honest move is to leave the slot empty until one is drawn
                 rather than ship a mark nobody can see. Logged in
                 docs/open-questions.md. Restore this when the light cut lands. */
              null
            ) : null}
            {entry.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className={`leading-relaxed ${isPartner
                  ? `mt-8 text-lg ${inkBody} sm:text-xl`
                  : isGroundFrame
                    ? `mt-6 max-w-3xl ${inkBody}`
                    : `mt-4 ${inkBody}`
                  }`}
              >
                {/* The 2020 frame folds the date into the body's first line. */}
                {isDiptych && entry.when && paragraph === entry.body[0]
                  ? `${entry.when}. ${paragraph}`
                  : paragraph}
              </p>
            ))}
            {entry.claim ? (
              <p className={`headline mt-8 max-w-xl text-3xl leading-snug ${inkHead}`}>
                {entry.claim}
              </p>
            ) : null}
            {/* The coda is the record's large statement (the 05 and 2022
            frames) — it reads before the photographs. */}
            {entry.coda ? (
              <p
                className={`mt-8 max-w-2xl text-xl leading-snug ${inkBody} sm:text-2xl ${isGroundFrame ? "font-medium leading-relaxed" : ""
                  }`}
              >
                {entry.coda}
              </p>
            ) : null}
            {entry.id && truthEntryMedia[entry.id] && !isEngraving ? (
              entry.id === "precinct" ? (
                <FeatureMedia
                  slots={truthEntryMedia[entry.id]}
                  caption={entry.caption}
                />
              ) : isToday ? (
                <TodayMontage slots={truthEntryMedia[entry.id]} />
              ) : isFather ? (
                <PortraitTestimony
                  slot={truthEntryMedia[entry.id][0]}
                  testimony={entry.testimony}
                />
              ) : isDiptych ? (
                <Diptych
                  slots={truthEntryMedia[entry.id]}
                  variant={isRenamed ? "seam" : "lead"}
                />
              ) : isArtGallery ? (
                /* WITHDRAWN, client direction 11 September 2026: the visitor
                   photograph AND the held write-up slot both come off the
                   1950s entry, so the band is carried by its words alone —
                   which is what the section is about. `WrittenRecordFrame`
                   and the two `art-gallery` slots stay in place for when a
                   replacement is supplied. */
                null
              ) : isMitchell ? (
                <CountryAndDocument slots={truthEntryMedia[entry.id]} />
              ) : isSeabed ? (
                <StrataStack slots={truthEntryMedia[entry.id]} />
              ) : (
                <EntryMedia slots={truthEntryMedia[entry.id]} caption={entry.caption} />
              )
            ) : null}
            {entry.footnotes?.map((footnote) => (
              <p key={footnote.slice(0, 32)} className={`mt-4 text-xs leading-relaxed ${inkMuted}`}>
                {footnote}
              </p>
            ))}
            {entry.source && entry.cta ? (
              /* The wireframe sets the record label and the CTA on one row. */
              <div className="mt-8 flex flex-wrap items-baseline justify-between gap-4">
                <p className={`eyebrow text-[10px] font-normal ${accent}`}>
                  {entry.source}
                </p>
                <Link
                  href={entry.cta.href}
                  /* The ground frames (17, 18) set the CTA at Yellow Gold. */
                  className={`eyebrow text-xs transition-transform duration-300 hover:translate-x-1 ${accent
                    }`}
                >
                  {entry.cta.label} &rarr;
                </Link>
              </div>
            ) : (
              <>
                {entry.source ? (
                  /* The ground frames (10–12) set the tag in Burnt Ochre with or
                     without a CTA; elsewhere it stays quiet. */
                  <p
                    className={`eyebrow mt-8 text-[10px] font-normal ${isGroundFrame ? accent : inkMuted
                      }`}
                  >
                    {entry.source}
                  </p>
                ) : null}
                {entry.cta ? (
                  <Link
                    href={entry.cta.href}
                    className={`eyebrow mt-6 inline-block text-xs transition-transform duration-300 hover:translate-x-1 ${accent
                      }`}
                  >
                    {entry.cta.label} &rarr;
                  </Link>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
  if (withinDeck) return article;
  return (
    <div data-truth-slide-runway className="relative">
      {article}
    </div>
  );
}

/** One viewport surface whose related records read on a single inner track. */
function CombinedEntryDeck({
  entries,
  label,
  ground,
}: {
  entries: TruthEntry[];
  label: string;
  ground: BandId;
}) {
  return (
    <div data-truth-slide-runway className="relative">
      <section
        data-truth-slide
        data-truth-slide-label={label}
        data-truth-ground={ground}
        className="relative"
      >
        <div data-truth-deck-viewport>
          <div data-truth-deck-track>
            {entries.map((entry) => (
              <EntryBlock key={entry.title} entry={entry} withinDeck />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * An era's full-viewport ENTRY plate — beats 04 (TODAY, 1440×900) and
 * 09 (2026, 1440×1044) of the hi-fi (2026-09-02): a photograph full-bleed
 * under a bottom-weighted scrim, gold eyebrow, optional burnt kicker, and
 * the entry title at Heading/64. The image pushes in 1.00→1.06 on entry
 * ([data-v2-plate], scrubbed). `deep`
 * deepens the scrim where the plate carries copy (the 09 spec); children
 * render below the title for plates that hold the whole entry. TODAY passes
 * `deckContent`: its original record layout rises from below as an evergreen
 * cover, Wave / Divider on its leading edge, while the plate stays untouched.
 */
function EntryPlate({
  id,
  slot,
  eyebrow,
  kicker,
  title,
  deep,
  focus,
  children,
  deckContent,
}: {
  id?: string;
  slot: MediaSlot;
  eyebrow: React.ReactNode;
  kicker?: string;
  title: string;
  deep?: boolean;
  /**
   * Where a cover crop holds, when the centre is the wrong part of the frame.
   * A plate is a viewport-tall window onto a 1.9:1 photograph, so `object-cover`
   * keeps the middle band and throws away most of the top and bottom — and on
   * TODAY the middle band is canopy, which left the burn reading as smoke in
   * trees with no ground under it (client, 11 September 2026). Tailwind cannot
   * see a computed class, so call sites pass a literal.
   */
  focus?: string;
  children?: React.ReactNode;
  deckContent?: React.ReactNode;
}) {
  const hasDeckContent = Boolean(deckContent);
  return (
    <div data-truth-slide-runway className="relative">
      <section
        id={id}
        data-truth-slide
        data-truth-slide-label={title}
        data-truth-ground={id === "deed" ? "return" : "present"}
        className={`relative min-h-svh overflow-hidden ${hasDeckContent ? "" : "flex items-end"
          }`}
      >
        {/* The crest that introduces this plate — below Ahead on TODAY, below
            TODAY's record on the deed (client direction, 11 September 2026).
            Egg-white over the photograph, which is where it reads. */}
        <LeadingCrest hook={id === "deed" ? "deed-wave" : "plate-wave"} retreats />
        {/* …and the deed plate also hands ON, into 2022 below it. */}
        {id === "deed" ? <TrailingCrest hook="boughtback-wave" /> : null}
        <div
          data-v2-plate
          data-motion={MOTION_GRADE[slot.bucket]}
          /* THE PLATE IS ONE SCREEN OF PHOTOGRAPH, NOT THE WHOLE SECTION.
             Where the deck runs it already is: the deck sets every slide to
             100svh before anything scrubs, so `inset-0` and `top-0 h-svh`
             describe the same box. Below lg the deck never initialises
             (`(pointer: fine) and (min-width: 1024px)` in gated-deck), the
             track's own `pt-[100svh]` stays in flow, and the section grows to
             hold it — measured 2,256px on a 390×844 phone. `inset-0` then
             asked one 1.9:1 photograph to cover a 0.17:1 box: a 4,286px-wide
             crop the library cannot serve, which is what read as blur at the
             TODAY join (user, 11 September 2026). Pinning the plane to the
             first screen puts the cover crop back inside what `sizes` asks
             for. */
          className="absolute inset-x-0 top-0 h-svh overflow-hidden lg:inset-0 lg:h-auto"
        >
          <MediaOrField
            src={presentSrc(slot.src)}
            alt={slot.expects}
            sizes={COVER_PLATE}
            quality={85}
            className={`object-cover ${focus ?? ""}`}
            fieldClass={FIELD_CLASS[slot.tone]}
          />
          {/* The spec's scrim remains part of the untouched plate while the
              incoming record covers both image and copy from below. */}
          <div
            aria-hidden
            className={`absolute inset-0 bg-linear-to-b ${deep
              ? "from-black/0 via-black/40 to-black/85"
              : "from-black/0 via-black/35 to-black/80"
              }`}
          />
        </div>
        <div
          data-descent-arrive
          data-truth-wave-heading={hasDeckContent ? true : undefined}
          /* …and the plate's own words are seated on that first screen for the
             same reason. `bottom-[16svh]` is measured from the SECTION foot,
             which off-deck is the foot of the whole stack — the TODAY eyebrow,
             kicker and headline were landing 1,900px down, underneath the
             record deck's opaque canvas, so the mobile plate showed a
             photograph with nothing on it. Below lg the block is hung from
             84svh and pulled back by its own height, which is where
             `bottom-[16svh]` puts it in a 100svh box. */
          className={`mx-auto w-full max-w-6xl px-6 lg:px-24 ${hasDeckContent
            ? "absolute inset-x-0 top-[84svh] z-10 -translate-y-full lg:bottom-[16svh] lg:top-auto lg:translate-y-0"
            : `relative z-30 ${deep ? "pb-[24svh]" : "pb-[16svh]"}`
            }`}
        >
          <p className="eyebrow text-lg text-gold sm:text-2xl">{eyebrow}</p>
          {kicker ? (
            <p className="eyebrow mt-1 text-ochre sm:text-base">{kicker}</p>
          ) : null}
          <h2
            data-descent-heading
            className="headline mt-6 max-w-4xl text-4xl leading-[1.2] text-canvas sm:text-6xl"
          >
            {title}
          </h2>
          {children}
        </div>
        {deckContent ? (
          <div data-truth-deck-viewport className="relative z-20">
            <div data-truth-deck-track className="pt-[100svh]">
              <div className="relative bg-canvas">
                <WaveDivider
                  ground="var(--color-canvas)"
                  hook="today-wave"
                />
                <div>{deckContent}</div>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

export function EraSection({
  era,
  prependEntries,
}: {
  era: TruthEra;
  /**
   * Records slotted in ahead of this era's own ground entries — the descent
   * is chronological, and the Today era's 2022 study reads AFTER the 2026
   * deed plate (Now → 2026 → 2022 → 2020), so the page hands those entries
   * down here rather than reordering the committed content structure.
   */
  prependEntries?: TruthEntry[];
}) {
  /**
   * The precinct wireframe (1440×1078 SVG, 2026-09-02) sets this era's
   * hierarchy differently: AHEAD in gold on the rail column, the era title
   * demoted to an ochre eyebrow inside the first entry, and the entry's own
   * title at display scale. Every other era keeps the big era headline.
   */
  const foldsTitleIntoEntry = era.id === "research";
  /**
   * The 1950s frame (13) carries the era title only as the gutter sub under
   * the year — no big era headline above the entry.
   */
  const titleInGutter = era.marker === "1950s";
  /* 16 · ENTRY 1840s does the same — BEFORE THE RUNS WERE TAKEN UP under the
     gold year — but on the navy ground the page band paints, not roasted. */
  const eraTitleInGutter = titleInGutter || era.entries[0]?.id === "mitchell";
  /* 17 · OLDER THAN THE RECORD + 18 · CARD Still to be found: the era title
     becomes the engraving entry's kicker, Ring A sits static behind the copy
     and Marc's charcoal wave hands the foot to deep time. */
  const isOlderThanRecord = era.entries[0]?.id === "engraving";
  /* 19 · ABOUT 100 MILLION YEARS AGO folds the same way: the marker in the
     gutter (no dating line — the entry's when is its own title's subject),
     ALL OF THIS WAS UNDER WATER as the seabed entry's burnt kicker. */
  const isBeginning = era.id === "beginning";
  const foldsEra = foldsTitleIntoEntry || isOlderThanRecord || isBeginning;
  const combinesAheadDeck = era.id === "research";
  /**
   * The Today era opens on its ENTRY plate (04, 1440×900 spec): the era
   * marker, title and lead-entry headline all live on the plate, so the
   * ground section below starts straight on the lead entry's body.
   */
  if (era.id === "researched") {
    /* Only the lead (Now) renders here — the era's dated records (2022, and
       Research & discovery with them) follow the 2026 plate, passed to the
       Bought back section as prependEntries so the descent stays in order. */
    const [lead] = era.entries;
    return (
      <EntryPlate
        id={era.id}
        slot={truthTodayPlateSlot}
        /* Hold the foot of the frame: the fire is on the ground, and the
           centred crop was showing canopy (client, 11 September 2026). */
        focus="object-[50%_82%]"
        eyebrow={
          <>
            {era.marker} &middot; {lead.when}
          </>
        }
        kicker={era.title}
        title={lead.title}
        deckContent={
          <div className="mx-auto max-w-6xl px-6 lg:px-24">
            {/* The era reaches the gutter here only so the rail's pointer has
                something to name on Today (user, 10 Sep 2026) — every other
                era already put its marker there. At lg the block is
                transparent and the pointer carries it; at md it reads as the
                section's own marker, which this section did not have. */}
            <EntryBlock
              entry={lead}
              titleOnPlate
              withinDeck
              gutterLabel={era.marker}
              gutterSub={lead.when}
            />
          </div>
        }
      />
    );
  }

  /**
   * Bought back opens on the 09 · ENTRY 2026 plate: the deed entry lives
   * entirely ON the plate — body (with the timestamp), the coda at Lead/24,
   * and the record label + CTA on one row — so the ground section below
   * starts straight at 2020. The plate carries the deed anchor for the rail.
   */
  if (era.entries[0]?.id === "deed") {
    const [deed, ...rest] = era.entries;
    const orderedEntries = [...(prependEntries ?? []), ...rest];
    const studyPair = orderedEntries.filter(
      (entry) =>
        entry.id === "study-2022" || entry.id === "research-discovery",
    );
    return (
      <>
        <EntryPlate
          id="deed"
          slot={truthDeedPlateSlot}
          eyebrow={<>2026 &middot; {era.title}</>}
          title={deed.title}
          deep
        >
          {/* The plate's own line (client direction, 11 September 2026). It
              replaces the `when` + `body[0]` pair this used to set; the draft
              sentence it displaces is flagged on the entry in truth.ts. */}
          <p className="mt-8 max-w-3xl leading-relaxed text-canvas">
            {deed.plateCaption ?? `${deed.when}. ${deed.body[0]}`}
          </p>
          {deed.coda ? (
            <p className="mt-6 max-w-3xl text-xl font-medium leading-relaxed text-canvas sm:text-2xl">
              {deed.coda}
            </p>
          ) : null}
          {deed.source && deed.cta ? (
            <div className="mt-10 flex flex-wrap items-baseline gap-x-16 gap-y-4">
              <p className="eyebrow text-[10px] font-normal text-ochre">
                {deed.source}
              </p>
              <Link
                href={deed.cta.href}
                className="eyebrow text-xs text-gold transition-transform duration-300 hover:translate-x-1"
              >
                {deed.cta.label} &rarr;
              </Link>
            </div>
          ) : null}
        </EntryPlate>
        {/* The 10 frame owns its Roasted Brown (#4E3524) ground outright. */}
        <section className="relative overflow-clip bg-canvas">
          {/* ⚠ RING WITHDRAWN on the egg-white ground. The delivered cut of
              ring-spiral-a is off-white with its 0.14 × 0.08 opacity baked in,
              so on #f6f6ec it is the ground painted onto the ground and draws
              literally nothing — ART-DIRECTION §299-305 records this exact
              failure ("which is why The Record §04's ring had never once been
              visible"). The house fix is a roasted repath at 0.30, and
              ring-a/ring-b have one; this spiral does not. Withdrawn rather
              than shipped invisible. Logged in docs/open-questions.md. */}
          <div className="relative mx-auto max-w-6xl px-6 py-10 lg:px-24 lg:py-20">
            {orderedEntries.map((entry) => {
              if (entry.id === "research-discovery" && studyPair.length === 2) {
                return null;
              }
              if (entry.id === "study-2022" && studyPair.length === 2) {
                return (
                  <CombinedEntryDeck
                    key="study-and-discovery"
                    entries={studyPair}
                    label="The site is studied with its owners and Research & discovery"
                    ground="return"
                  />
                );
              }
              return (
                <EntryBlock
                  key={entry.title}
                  entry={entry}
                  gutterSub={
                    entry.id === "renamed" ||
                      entry.id === "just-us" ||
                      entry.id === "father"
                      ? era.title
                      : undefined
                  }
                />
              );
            })}
          </div>
        </section>
      </>
    );
  }
  /* 1840s carries the hand-off out of the count on its own ARTICLE (see the
     note on that wave in EntryBlock), and a leading divider is drawn one
     wave-height ABOVE whatever it is seated on. On the deck that lands it on
     the outgoing charcoal, which is the whole point of it. Off-deck the
     section's own top padding stood between the two, so the crest was drawn in
     canvas on canvas — invisible, and the seam the reader met was a hard edge
     where every other seam on the page has a wave (user, 11 September 2026).
     The padding goes below lg so the article starts flush and the crest has
     the charcoal to cut into; the era's first entry brings its own top margin.  */
  const startsFlush = era.entries[0]?.id === "mitchell";
  /* And the 1950s ends flush for the mirror-image reason. Its ground is the one
     that DETERIORATES as it is read, so the charcoal is painted by the SLIDE's
     own ::after — the article — not by the section around it, which is
     bg-canvas. Off-deck the section's bottom padding is therefore a strip of
     egg white between the band going dark and the escarpment break it hands
     into (user screenshot, 11 September 2026). On the deck the break covers
     it, which is why it has never shown at 1440. */
  const endsFlush = titleInGutter;
  const inner = (
    <div
      className={`relative mx-auto max-w-6xl px-6 py-10 lg:px-24 lg:py-20 ${startsFlush ? "pt-0 lg:pt-20" : ""
        } ${endsFlush ? "pb-0 lg:pb-20" : ""}`}
    >
      {/* The era marker, the lore line, and the entry whens all live on the
          trail rail now (2026-09-02) — repeating them here doubled the
          timeline and crowded the gutter the rail moved into. */}
      {foldsEra || eraTitleInGutter ? null : (
        <h2
          data-descent-heading
          className="headline mt-4 max-w-3xl text-3xl text-evergreen sm:text-5xl"
        >
          {era.title}
        </h2>
      )}
      {/* Flush means flush: with the section's own top padding gone, this top
          margin collapsed straight through it and pushed the whole band 32px
          down the page, which put a canvas strip back under the charcoal and
          took a third of the crest with it. The entry's own `py-10` is the
          breathing room here. */}
      <div className={startsFlush ? "mt-0 lg:mt-12" : "mt-8 lg:mt-12"}>
        {era.entries.map((entry, index) => (
          <EntryBlock
            key={entry.title}
            entry={entry}
            withinDeck={combinesAheadDeck}
            /* 17 · OLDER THAN THE RECORD folds the era the same way as
               Ahead: the marker (with the dating line under it) in the
               gutter, CUT INTO THE WALL as the burnt kicker. */
            kicker={foldsEra && index === 0 ? era.title : undefined}
            gutterLabel={foldsEra && index === 0 ? era.marker : undefined}
            /* The 13 frame sets the era title under the year in the gutter
               (1950s / ADMIRED UNDER THE WRONG NAME), the same as 10–12. */
            gutterSub={
              entry.id === "art-gallery" || entry.id === "mitchell"
                ? era.title
                : entry.id === "seabed"
                  ? "" /* the 19 frame carries no dating line under the era */
                  : undefined
            }
          />
        ))}
      </div>
    </div>
  );
  if (combinesAheadDeck) {
    return (
      <div data-truth-slide-runway className="relative">
        <section
          data-truth-slide
          data-truth-slide-label="What is being built and Work with us"
          data-truth-ground="present"
          className="relative"
        >
          {/* The wave belongs to the incoming Ahead deck, so its crest stays
              attached while the hero is pinned. The gated deck scrubs the
              shared About ink over the final 20vh before the buffer. */}
          <WaveDivider ground="var(--color-canvas)" hook="truth-wave" />
          <div data-truth-deck-viewport>
            <div data-truth-deck-track>{inner}</div>
          </div>
        </section>
      </div>
    );
  }
  if (titleInGutter) {
    /* The 13 frame keeps the shared Roasted Brown (#4E3524) ground and adds
       its local dim — "the light is going out of this band".

       The dim DEEPENS as the band is read (0.10 -> 0.45, around the frame's
       0.34): this is the one ground that deteriorates under the reader rather
       than simply being darker than its neighbour. The photograph itself still
       takes no push — giving it camera movement would flatter it.

       It is painted by the slide's own ::after (globals.css) off a custom
       property, so the scrub writes one CSS variable rather than a colour
       string, the dim travels with the pin, and the resting value is the
       frame's own number — no-JS and reduced motion both read as drawn. */
    return (
      <section id={era.id} className="relative bg-canvas">
        {inner}
      </section>
    );
  }
  if (isOlderThanRecord) {
    return (
      <section id={era.id} /* pb-16 stacked on the next era's own top padding put 248px of nothing
           between two eras on a phone (user, 11 September 2026). The frame's
           foot is kept from sm up. */
        className="relative overflow-clip pb-6 sm:pb-28">
        {/* ⚠ PENDING-MOTIF · Artwork Ring A — static, deliberately behind the
            copy. Spec: x900 y70 of the 1440 frame, 416px wide, 0.12 over the
            0.08 fill. The delivered cut bakes 0.14 × 0.08, so it is dimmed to
            0.86 here. Artwork-motion permission is not recorded. */}
        {/* ⚠ RING WITHDRAWN — same reason as the 06 frame's: the off-white
            cut is invisible on the off-white ground and no roasted repath of
            this spiral exists. */}
        {inner}
        {/* NO WAVE HERE. This seam used to hand roasted-brown into charcoal;
            both sides are now the one egg-white ground, and a divider filled
            with the colour it introduces has nothing to carry — it would draw
            canvas onto canvas. /about settles the same case the same way: its
            charcoal-to-charcoal seam is deliberately waveless, "nothing
            carries; that is the point". The four waves that survive are the
            ones that still cross a real change. */}
      </section>
    );
  }
  if (isBeginning) {
    /* The 19 frame owns the incoming Charcoal Black (#090E12) ground. */
    return (
      <section id={era.id} className="relative bg-canvas">
        {inner}
      </section>
    );
  }
  return <section id={era.id}>{inner}</section>;
}

/**
 * THE COUNT IS THREE SCREENS, not one scroll.
 *
 * It arrived as a single 2,989px panel — head, then the figures, then her
 * testimony — inside the escarpment slide's deck track. At three and a third
 * viewports it read as a long scroll through a dark passage, and the count
 * itself, which is the thing the whole descent has been walking toward, was
 * just something you went past on the way.
 *
 * Split at the joins the copy already has, each one a gated screen the deck
 * holds: WHO IS SPEAKING, THE COUNT, HER TESTIMONY. The draft's order is
 * unchanged (D5) and not one word moved — this is where the page breathes, not
 * what it says.
 *
 * ⛔ The count itself does not move. No arrival, no count-up, no glow: the
 * number is simply there. That is the grammar's figures-of-loss rule — a
 * number describing people taken is stated and held, never ticked upward —
 * and it is declared on the numerals, so the sourced line beneath each one is
 * still read a word at a time (user, 10 Sep 2026). The figure holding while
 * its own sentence arrives around it is what makes the stillness legible.
 */

/**
 * The charcoal ground, the ring, and the reading column every beat shares.
 *
 * No screen here is held whole any more. The count marks its own numerals with
 * `data-v2-static` instead, so the sourced line beneath each figure can still
 * be read — which is why this takes no `still` prop.
 */
function CountScreen({
  id,
  label,
  readVh,
  children,
}: {
  id: string;
  label: string;
  /**
   * Scroll distance for this screen, in vh. Default is the deck's 125.
   *
   * This is the budget the pacing in truth-scenes.ts spends: enough for her
   * words at LINE_VH per rendered line, plus the tail the screen is held for
   * afterwards. Too small and the words are compressed to fit — dev builds
   * print the number to use.
   */
  readVh?: number;
  children: React.ReactNode;
}) {
  return (
    <div data-truth-slide-runway className="relative">
      <section
        id={id}
        data-truth-slide
        data-truth-slide-label={label}
        data-truth-ground="count"
        {...(readVh ? { "data-truth-read-vh": readVh } : {})}
        data-descent-arrive
        className="relative min-h-svh overflow-hidden bg-charcoal"
      >
        {/* 15 · HARD STOP — PENDING-MOTIF · Artwork Ring B, static, behind
            the copy. Spec: x900 y90 of the 1440 frame, 465 wide, 0.1 — the
            delivered cut is off-white; the opacity is applied here. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
        <img
          src="/artwork/ring-b.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute right-[5%] top-24 w-[32%] max-w-116 opacity-10"
          loading="lazy"
        />
        {/* The deck pins a slide at exactly 100svh and clips it, so a screen
            whose content is taller than the viewport loses the overflow —
            measured, her testimony ran 1,053px into a 900px box and the first
            quotation was cut off at the top. The deck track is the mechanism
            for that: it carries the content up across the section's own
            reading span, which is how TODAY and the escarpment already work.

            The inner wrapper keeps `min-h-svh` + centring, so a screen that
            FITS (the count) sits centred and its track has nothing to travel,
            while one that does not (her testimony) grows and is carried. */}
        <div data-truth-deck-viewport className="relative">
          <div data-truth-deck-track>
            <div className="relative mx-auto flex min-h-svh w-full max-w-6xl flex-col justify-center px-6 py-10 lg:px-24 lg:py-24">
              {children}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * A · WHO IS SPEAKING. Rides the escarpment cover, so it is the screen the
 * charcoal ground arrives on.
 *
 * Order follows the draft (D5): marker, title, who is speaking, her opening
 * line, the lede.
 *
 * The draft's standing warning — "Draft, awaiting her approval"
 * (`suzanne.draftWarning`) — is NOT rendered. Removed 9 September 2026 on
 * August's instruction: this build is what goes in front of Suzanne and the
 * Elder Advisory Group to be approved, so the band shows the page as it would
 * read rather than announcing its own draft state. The check note at the foot
 * came off in the same pass. Neither text is deleted — both stay in
 * src/content/truth.ts and in the v3 draft — but nothing on this page now says
 * the copy is unapproved, so restore both if the section is ever shown
 * anywhere other than that review.
 */
export function SuzanneBand({ withinDeck = false }: { withinDeck?: boolean }) {
  const head = (
    <div className="grid gap-6 md:grid-cols-[180px_1fr] md:gap-12">
      <p className="eyebrow self-start pt-3 text-h6 text-canvas">
        {suzanne.marker}
      </p>
      <div>
        <h2 className="headline max-w-4xl text-h2 leading-[1.2] text-oxide">
          {suzanne.title}
        </h2>
        {/* `.eyebrow`, not a hand-rolled one. This label used to be Work Sans
            set uppercase with letter-spacing, two lines above a real eyebrow —
            two micro-labels in two different faces, touching. */}
        <p className="eyebrow mt-10 text-canvas/70">Told by</p>
        <div className="mt-6 grid gap-8 sm:grid-cols-[320px_1fr] sm:gap-8">
          {/* ⟡ PORTRAIT SLOT — Suzanne. A photograph was supplied for it on
              11 September 2026 (client direction), so the dashed hold comes
              off. Held still: `data-v2-static` — this is the woman whose
              testimony the next two screens are, and the grammar's "a person
              speaking" row is no movement at all. Centre crop, which is what
              a 4:5 window on this frame wants.

              ⚠ R5 IS NOT CLOSED BY THIS. Her words still await her approval;
              what changed is that there is now a file for the slot. */}
          <div
            data-v2-static
            className="relative aspect-4/5 w-full max-w-80 overflow-hidden rounded-xs"
          >
            <MediaOrField
              src={presentSrc(truthCountPortrait.src)}
              alt={truthCountPortrait.expects}
              sizes="(min-width: 640px) 320px, 100vw"
              quality={85}
              className="object-cover object-center"
              fieldClass={FIELD_CLASS[truthCountPortrait.tone]}
            />
          </div>
          <div>
            <p className="eyebrow text-base text-oxide">{suzanne.attribution}</p>
            <p className="mt-2 text-sm leading-relaxed text-canvas">
              {suzanne.role}
            </p>
            {/* Her opening line is testimony: it is read in stillness, never in
                the callout face — and, since 10 Sep, never in the display face
                either. `voice` sets it in the reading face. */}
            <PullQuote tone="charcoal" voice className="mt-8">
              {suzanne.openingQuote}
            </PullQuote>
          </div>
        </div>
        <p className="mt-10 max-w-2xl leading-relaxed text-canvas/80">
          {suzanne.lede}
        </p>
      </div>
    </div>
  );

  /* Inside the escarpment deck the wrappers belong to that slide, so this beat
     is cargo. Standalone it is a screen of its own like the other two. */
  return withinDeck ? (
    <div
      id="the-count"
      data-descent-band="count"
      className="relative overflow-hidden bg-charcoal"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
      <img
        src="/artwork/ring-b.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-[5%] top-24 w-[32%] max-w-116 opacity-10"
        loading="lazy"
      />
      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-36 lg:px-24">
        {head}
      </div>
    </div>
  ) : (
    <CountScreen id="the-count" label="Who is speaking">
      {head}
    </CountScreen>
  );
}

/**
 * B · THE COUNT. The numerals take the viewport alone — the draft's build
 * note: "nothing else on screen".
 *
 * ⛔ THE FIGURES DO NOT MOVE. `data-v2-static` is on each one rather than on
 * the section, so `isHeld()` — an ancestor test — holds the numbers still
 * inside a screen that now reads. The count is stated and held, never ticked
 * upward: that is the grammar's figures-of-loss ban, not a Truth-local
 * preference, and it outranks anything this screen might want.
 *
 * ⚠ THE DISPLAY SLOT MOVED FROM THE YEAR TO THE COUNT (user, 10 Sep 2026).
 * The year is now the rail-marker eyebrow the screen above uses, and the count
 * carries `text-h1`. The screen is no louder than it was — it spends the same
 * one display slot per row — but note ART-DIRECTION.md's standing caution that
 * neither 1902 number should be set as a display statistic until Suzanne
 * settles thirty-five against thirty-seven. Logged against R5 in
 * open-questions.md; the Hoch/Taçon citation sits directly beneath, which is
 * what keeps it a sourced figure rather than a headline.
 */
export function SuzanneCount() {
  return (
    <CountScreen id="the-count-figures" label="The count" readVh={220}>
      <dl className="space-y-16">
        {suzanne.figures.map((figure) => (
          <div
            key={figure.year}
            className="grid gap-6 md:grid-cols-[180px_1fr] md:gap-12"
          >
            {/* Same marker column as SuzanneBand, so the two screens line up.
                `pt-3` seats the eyebrow against the figure's cap height. */}
            <dt className="eyebrow self-start pt-3 text-h6 text-canvas">
              {figure.year}
            </dt>
            <dd className="max-w-3xl">
              <p data-v2-static className="headline text-h1 text-canvas">
                {figure.figure}
              </p>
              {/* The sentence the figure belongs to, read a word at a time —
                  the treatment her quotations get two screens on. */}
              <WordEmphasis
                as="p"
                text={figure.detail}
                className="mt-4 text-lg leading-relaxed text-canvas/80"
              />
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-16 max-w-2xl text-sm leading-relaxed text-canvas/50 md:pl-[calc(180px+3rem)]">
        <a
          href={suzanne.citation.href}
          className="underline decoration-canvas/30 underline-offset-4 transition-colors hover:text-canvas/80"
        >
          {suzanne.citation.text}
        </a>
      </p>
    </CountScreen>
  );
}

/**
 * C · HER TESTIMONY. Her words, read in stillness — the words undim at
 * speaking pace and nothing else moves.
 *
 * `suzanne.checkNote` — her two open questions, the order of the count against
 * the blankets and thirty-five against thirty-seven — is NOT rendered here.
 * Removed 9 September 2026 on August's instruction, with the head warning, so
 * the band presents as the page rather than as a marked-up draft. Both
 * questions are still open and still unanswered; they now have to be PUT TO
 * HER IN THE PRESENTATION, because the page no longer asks them. The text is
 * kept in src/content/truth.ts and in the Truth v3 draft.
 */
export function SuzanneTestimony() {
  return (
    /* 300vh, not the deck's 125. Sixty-three words of her speech undim one
       after another here; at the normalised span they arrived about seven to a
       line every 145px of scroll, which is faster than the line can be read.
       The last third of the span is deliberately left after the words have
       finished, so the section is not already handing over to the 1840s while
       she is still being read. */
    <CountScreen id="the-count-testimony" label="Her testimony" readVh={560}>
      <div className="max-w-3xl pb-10 md:pl-[calc(180px+3rem)] lg:py-28">
        {/* The first of these carries the unratified CR4 word. Steve's note of
            7 Sep is explicit that as a bare pull quote it "reads as our copy —
            it isn't", so this one is attributed on the spot rather than relying
            on the "Told by" line two screens above. */}
        {suzanne.quotes.map((quote, index) => (
          <PullQuote
            key={quote.slice(0, 32)}
            tone="charcoal"
            voice
            className="mt-10 first:mt-0"
            {...(index === 0
              ? { attribution: suzanne.attribution, role: suzanne.role }
              : {})}
          >
            {quote}
          </PullQuote>
        ))}
        <p className="mt-10 leading-relaxed text-canvas/80">
          {suzanne.afterQuotes}
        </p>
        {/* The line the page stands on. Set large, but a step BELOW the section
            title and in the reading face — it is her sentence, not a heading of
            ours. It was set in the display face at the title's own size, which
            made the page appear to say it. */}
        <blockquote className="mt-14 text-h3 leading-[1.2] text-canvas">
          {suzanne.standingQuote}
        </blockquote>
        {suzanne.closing.map((paragraph) => (
          <p
            key={paragraph.slice(0, 32)}
            className="mt-8 leading-relaxed text-canvas/80"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </CountScreen>
  );
}

/**
 * Full-bleed photographic break — the hi-fi's breathing screens between eras.
 * No caption by design; the alt text still names the subject. Country bucket
 * only (R10 — a break must never be cultural-site material).
 */
/** Marc's colour-handoff wave — fill is the ground of the section it
 *  INTRODUCES (the 08 spec). Literal map: Tailwind cannot see computed
 *  classes. */
const WAVE_FILL: Record<string, string> = {
  canvas: "fill-canvas",
  roasted: "fill-roasted",
  evergreen: "fill-evergreen",
  charcoal: "fill-charcoal",
  midnight: "fill-midnight",
};

/**
 * Marc's colour-handoff wave (349:3676), 1442×151. Fill = the colour of the
 * section it INTRODUCES; it sits over the foot of the outgoing section, so
 * the parent must be `relative`. The breaks (08, 14) and the deep-time
 * hand-off after Open research (the CHARCOAL divider at 16236) all use it.
 */
export function HandoffWave({
  to,
  placement = "trailing",
  railAnchor = false,
  bleed = false,
}: {
  to: keyof typeof WAVE_FILL;
  placement?: "leading" | "trailing";
  /**
   * Break out of a width-constrained ancestor to span the viewport.
   *
   * Most waves sit on a full-width surface and need nothing. The count's
   * hand-off does: it is seated on the 1840s ARTICLE, because that is the
   * element the deck pins and moves, and the article lives inside the page's
   * max-w-6xl reading column. Left alone it drew a wave across the column
   * only, with the outgoing escarpment showing down both margins. This is the
   * same `calc(50% - 50vw)` escape the pinned slide's own ground uses in
   * globals.css, for the same reason.
   */
  bleed?: boolean;
  /**
   * Stamps `data-count-wave`, which the trail rail measures the record
   * strand's restart from. Exactly one wave on the page carries it — the
   * hand-off out of the count — and the rail falls back to the top of the
   * before-record band if it ever goes missing.
   */
  railAnchor?: boolean;
}) {
  return (
    <svg
      aria-hidden
      data-descent-wave
      {...(railAnchor ? { "data-count-wave": true } : {})}
      viewBox="0 0 1442 151"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute h-16 sm:h-28 ${bleed
        ? "left-[calc(50%-50vw)] w-screen"
        : "inset-x-0 w-full"
        } ${placement === "leading"
          ? "top-0 -translate-y-[calc(100%-1px)]"
          : "bottom-0"
        }`}
    >
      <path
        d="M1470.04 7.9544C1427.51 -2.1372 1377.18 -2.66008 1333.96 6.57748C1270.32 20.155 1224.29 42.5343 1157.49 50.8132C1113.11 56.3209 1072.13 52.2598 1028.08 50.5343C969.069 48.2162 917.126 51.1444 860.791 61.48C807.923 71.1707 756.575 83.7895 700.999 88.7046C633.371 94.6829 564.487 84.9573 499.434 73.4888C434.382 62.0203 369.263 48.5648 300.776 46.7696C195.602 44.0157 95.7447 68.87 1.00558 93.1491L1.00123 151H1470.04V7.9544Z"
        className={WAVE_FILL[to]}
      />
    </svg>
  );
}

/* ⚠ NO CALL SITE AS OF 11 SEPTEMBER 2026 — KEPT ON PURPOSE.
   §08's only call site was withdrawn on 11 September 2026 (client direction,
   see the note in truth/page.tsx). The pair in truth-media.ts, the
   `breakDissolve` recipe and truth-break1.webp are all still in place, so the
   section comes back by restoring one line in the page. Deleting this would
   mean re-deriving the dissolve stack, the scrim and the travelling crest from
   the Figma boards a second time. */
export function FullBleedBreak({
  which,
  waveTo,
}: {
  which: keyof typeof truthBreakMedia;
  /** Renders the hand-off wave over the break's foot, filled with the
   *  incoming section's ground. */
  waveTo?: keyof typeof WAVE_FILL;
}) {
  const { outgoing, incoming } = truthBreakMedia[which];
  const outgoingSrc = presentSrc(outgoing.src);
  /**
   * §08 · "you never see the join" (Figma 2051:5464, built 11 September 2026).
   *
   * Two shots of the same Country stacked, and the join is never on screen:
   * shot B sits beneath at full opacity from the first frame, shot A lies over
   * it and fades to nothing across the read. Nothing slides and nothing
   * scales — the ERA DISSOLVE reference (2309:4172) is explicit that the
   * photographs cross-dissolve on opacity alone, "nothing scales during the
   * dissolve (P9's rule)", and that ruling was taken over this break's own
   * note asking for a slow pull-back (user, 11 September 2026). So
   * `data-v2-pullback` is gone from here: the page has stopped, and it shows
   * it by being still.
   *
   * `data-v2-dissolve` is set ONLY when shot A has a file. Without it the
   * attribute is absent, no recipe finds anything to fade, and the delivered
   * photograph simply holds — which is what this break has always done.
   */
  return (
    <div data-truth-slide-runway className="relative">
      <section
        id={truthBreaks[which].id}
        data-truth-slide
        data-truth-slide-label={truthBreaks[which].id}
        data-motion={MOTION_GRADE[incoming.bucket]}
        /* 80svh on a phone is a 390x675 box, and a 1.9:1 photograph covering
           it needs 1,283 CSS px of crop against the 1,014 that 260vw asks for
           — the soft break the reader meets on the way out of TODAY (user, 11
           September 2026). 58svh brings the requirement back under what is
           served, and a breathing screen does not need to be four fifths of
           the viewport to breathe. Unchanged from lg up, where the frame is
           its own proportion. */
        className="relative min-h-[58svh] overflow-hidden lg:min-h-[80svh]"
      >
        <MediaOrField
          src={incoming.src}
          alt={truthBreaks[which].alt}
          sizes={COVER_FULL_BLEED}
          quality={85}
          fieldClass={FIELD_CLASS[incoming.tone]}
        />
        {outgoingSrc ? (
          <div data-v2-dissolve className="absolute inset-0">
            <MediaOrField
              src={outgoingSrc}
              alt=""
              sizes={COVER_FULL_BLEED}
              quality={85}
              fieldClass={FIELD_CLASS[outgoing.tone]}
            />
          </div>
        ) : null}
        {/* The 08 spec's light scrim — nothing to read here. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-b from-charcoal/40 via-transparent to-charcoal/40"
        />
        {waveTo ? (
          /* ⚠ THE BOX IS A MOTION HOOK WITH A JOB, not a wrapper for its own
             sake — the same one /partnerships puts around its divider, for the
             same reason. `waveHandoff` travels its target by `yPercent`, and a
             wave SVG is untouchable: it seats itself on a Tailwind transform
             that an inline GSAP write clobbers (About's disappearing-wave
             defect). So the effect moves this box, and the box is given the
             divider's own height — h-16 / sm:h-28, matching HandoffWave — so
             `yPercent: 100` is exactly one wave-height of travel: parked, it
             sits below the section's foot where `overflow-hidden` clips it;
             played, it rises onto the photograph.

             ⚠ AND IT RESTS SEATED, NOT PARKED. The recipe sets yPercent 100
             itself before playing to 0. The deck is desktop-only, so on touch,
             below lg, with no JavaScript and under reduced motion there is no
             read span to play — and a wave whose CSS rest state were `hidden`
             would leave a hard seam on every one of those paths. Same shape as
             the 1950s ground: the rest state is the END state. */
          <div
            data-truth-break-wave
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 sm:h-28"
          >
            <HandoffWave to={waveTo} />
          </div>
        ) : null}
      </section>
    </div>
  );
}

/**
 * 14 · BREAK The Escarpment. Built 2026-09-03 as a dissolve pair — two
 * full-bleed country shots stacked, the upper one fading across the break's
 * travel while the lower pulled back — and stripped of both photographs on
 * 11 September 2026 at the client's direction. What remains is charcoal ground
 * and Marc's charcoal wave — the last hand-off, into the count.
 */
export function DissolveBreak({ deckContent }: { deckContent?: React.ReactNode }) {
  const hasDeckContent = Boolean(deckContent);
  return (
    /* THE ESCARPMENT PHOTOGRAPH IS WITHDRAWN (client direction, 11 September
       2026). This slide used to be the page's second full-bleed break — two
       country shots cross-dissolving while the camera pulled back, with the
       count's charcoal panel then rising to close the image completely. The
       photographs come off; the hand-off does not.

       What is kept, and why:
       · the SLIDE itself, because it is what the deck pins and what carries
         the count's opening screen — `#break-escarpment` is also the id the
         rail's `railHiddenSlides` names, so removing the section would put the
         traveller back over the hard stop;
       · the charcoal ground, which is now the whole surface rather than a
         backstop behind a half-transparent plate;
       · Marc's leading wave, which is the animation asked to stay — it still
         cuts into the outgoing egg white exactly as it did.

       What goes with the image is the viewport of lead the track carried. The
       `pt-[100svh]` existed so the count could travel UP over the photograph
       and land bottom-flush against it; with nothing to cover, it was simply a
       blank charcoal screen to scroll past before the words. The reader now
       arrives on the words. */
    <div data-truth-slide-runway className="relative bg-charcoal">
      <section
        id={truthBreaks.escarpment.id}
        data-truth-slide
        data-truth-slide-label={truthBreaks.escarpment.id}
        className="relative overflow-hidden bg-charcoal"
      >
        {hasDeckContent ? (
          <div data-truth-deck-viewport className="relative z-20">
            <div data-truth-deck-track>
              <div className="relative min-h-svh bg-charcoal">
                <HandoffWave to="charcoal" placement="leading" />
                {deckContent}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative min-h-svh bg-charcoal">
            <HandoffWave to="charcoal" placement="leading" />
          </div>
        )}
      </section>
    </div>
  );
}

/**
 * Leonard Mickelo's dotted trail, in the gold cut — the wayfinding thread the
 * hi-fi runs down the page between eras.
 *
 * ⚠ STATIC. Motion on artwork is permitted as of 2026-08-30 (media.ts), but
 * the artist's own sign-off is still noted outstanding there, so this stays a
 * plain <img> until it isn't. Decorative: empty alt, hidden from readers.
 */
export function GoldTrail({ variant = "wave" }: { variant?: "wave" | "trail" }) {
  return (
    <div aria-hidden className="pointer-events-none overflow-hidden py-10 opacity-70">
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork, no optimization pass wanted */}
      <img
        src={variant === "wave" ? "/artwork/dots-wave-gold.svg" : "/artwork/dots-trail-gold.svg"}
        alt=""
        className="mx-auto w-full max-w-5xl"
        loading="lazy"
      />
    </div>
  );
}

/**
 * The mirror of `LeadingCrest`, for a seam that runs DARK to LIGHT.
 *
 * Above 2022 the incoming surface is the page's own egg white and the outgoing
 * one is the deed plate's photograph — so a crest seated at the head of the
 * incoming section would again be canvas on canvas. It goes on the OUTGOING
 * plate's foot instead, where egg white rising out of a photograph is the thing
 * that reads. Inside that plate, not below it: the plate is the slide, and the
 * deck only rolls waves it finds inside one.
 */
function TrailingCrest({ hook }: { hook: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 sm:h-26"
    >
      <WaveDivider ground="var(--color-canvas)" hook={hook} />
    </div>
  );
}

/**
 * A `WaveDivider` seated at the HEAD of the section it introduces, drawn over
 * whatever that section opens with rather than above it.
 *
 * ⚠ WHY THE BOX. Two reasons, and either alone would be enough.
 *
 * `WaveDivider` seats itself with `top-0 -translate-y-[calc(100%-1px)]` — it
 * lives ENTIRELY ABOVE its own parent, which is right when the section above is
 * a different colour and wrong here twice over: Truth's sections are almost all
 * the one egg-white ground, so a canvas crest drawn above a canvas section is
 * canvas on canvas and draws nothing (measured on the floor seam, 12 September
 * 2026 — it shipped invisible), and the plates it needs to cut into are
 * `overflow-hidden`, which deletes anything living above their box. Giving the
 * box the divider's own height and pushing it down by exactly that height lands
 * the crest ON the section's first screen, where a light wave over a dark
 * photograph is the thing you can actually see.
 *
 * ⚠ AND IT MUST BE INSIDE THE SLIDE. The deck finds the waves it rolls with
 * `gate.over.querySelectorAll(...)` — `gate.over` is the NEXT SLIDE. A crest
 * seated on a runway is outside that subtree and silently never rolls, which is
 * the other half of what was wrong with the floor seam.
 */
function LeadingCrest({
  hook,
  retreats = false,
}: {
  hook: string;
  /**
   * Withdraw off the top of the slide once the reader has arrived.
   *
   * A crest on an ordinary section scrolls away by itself. A crest on a PINNED
   * slide does not — it sits on the photograph for the whole read, and on the
   * ENTRY plates the photograph is the point: the TODAY plate opened with an
   * egg-white band eating its sky and never gave it back (client, 12 September
   * 2026). So on those, the crest marks the hand-off and then lifts clear,
   * revealing the plate whole.
   *
   * The lift is authored in `bindTruthScenes`, not here, and the CSS rest
   * state stays SEATED — off the deck, below lg, with no JavaScript and under
   * reduced motion there is no read to play, and a crest that rested lifted
   * would simply be a seam with no divider on all four.
   */
  retreats?: boolean;
}) {
  return (
    <div
      aria-hidden
      {...(retreats ? { "data-truth-crest-retreats": true } : {})}
      className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 translate-y-full sm:h-26"
    >
      <WaveDivider ground="var(--color-canvas)" flip hook={hook} />
    </div>
  );
}

/**
 * The landing mark for the mobile rewind cue — grammar row "the guide leading
 * the eye", Truth's rewind cue.
 *
 * A gold chevron at the head of the Wattanuri floor with a hairline running
 * out of it to both edges, pointing back up the way the reader has just been
 * carried: from the floor the page is read UPWARD, because everything above
 * this band is later than it.
 *
 * THE MARK IS THE SUPPLIED ONE. `/artwork/chevron-down.svg` — August's brush
 * chevron, the same family as the CTA mark the cursor is cut from — turned
 * 180° (user direction, 11 September 2026, replacing a drawn full-width
 * chevron that read "too big and thick, and out of style"). It is carried
 * through a mask rather than an `<img>` so it can take the page's gold, which
 * is the colour of the cue that sent the reader here; the path itself is
 * untouched. Note that Furniture's blob chevrons are deliberately NOT one mark
 * rotated — right and down are drawn separately there because the stroke hooks
 * the other way. This is a rotation by direction, and it is on the record.
 *
 * It rests at opacity 0 and is only ever seated by `truthRewind`: a reader who
 * arrives by scrolling has read the whole descent to get here and does not
 * need to be told which way it runs.
 *
 * `aria-hidden`: the anchor that starts the journey already names it, and
 * focus lands on the band itself, so this is confirmation for the eye only.
 * Below lg only — the deck never presses this button.
 */
function RewindArrow() {
  return (
    <div
      data-truth-rewind-hint
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-30 bg-linear-to-b from-charcoal/70 via-charcoal/25 to-transparent px-5 pb-10 pt-8 opacity-0 lg:hidden"
    >
      {/* The rule is what fills the width; the mark is just the mark. */}
      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-gold/45" />
        <span className="block h-[13px] w-[23px] shrink-0 rotate-180 bg-gold [mask-image:url(/artwork/chevron-down.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
        <span className="h-px flex-1 bg-gold/45" />
      </div>
      <p className="eyebrow mt-4 text-center text-[10px] text-gold">
        {rewindCue.hint}
      </p>
    </div>
  );
}

/**
 * The floor. Below the seabed, closing the descent — see the wattanuri note
 * in src/content/truth.ts.
 *
 * ⚠ IT USED TO BE COMPLETELY STILL, and that is no longer true. This comment
 * read "still, like the testimony: one authored closing shot, no return to the
 * hero, dissolve, push, fade or entrance" from the day it was built until
 * 11 September 2026, when the client asked the closing photograph to drift.
 * The COPY is still held — `data-v2-static` stays, and it still holds
 * everything in the band — but the photograph now carries a slow diagonal
 * under it (`closingDrift`). Recorded rather than quietly dropped: the
 * stillness was an argument, and it has been overruled, not forgotten.
 *
 * 20 · UNDERNEATH ALL OF IT. Bottom-weighted scrim 0 → .387 → .86. The copy
 * sits at the gutter's left edge, not the entry column and carries no M1.
 *
 * The frame's "consequence line" (`wattanuri.floor`) is NOT rendered. It was
 * spec rather than draft, carried as an editorial note flagged [ SPEC — COPY
 * NOT COMMISSIONED ] because spec copy is never set as prose; it came off on
 * 11 September 2026, client direction, with the rest of the page's placeholder
 * dress. The content and the reasoning both survive in src/content/truth.ts.
 */
export function WattanuriBand() {
  const { outgoing } = truthWattanuriMedia;
  return (
    <div data-truth-slide-runway className="relative">
      <section
        id={wattanuri.id}
        data-truth-slide
        data-truth-slide-label={wattanuri.title}
        data-truth-ground="deep-time"
        data-v2-static
        /* The floor is where the mobile rewind cue lands, so it is also where
           focus is put down — `tabIndex={-1}` makes that possible without
           adding a tab stop (truth-rewind.ts). */
        data-truth-rewind-target
        tabIndex={-1}
        className="relative flex min-h-svh items-end overflow-hidden outline-none"
      >
        {/* THE CREST INTO THE FLOOR — the upside-down egg-white wave closing
            "Before people" (client direction, 11 September 2026).

            It shipped on the RUNWAY first and was invisible: above the runway
            is the seabed section, which is the same egg-white ground, so the
            crest was canvas drawn on canvas. It belongs on the photograph. */}
        <LeadingCrest hook="floor-wave" />
        <RewindArrow />
        {/* ⚠ THE ONE MOVING THING IN A HELD BAND. The section is
            `data-v2-static`, which is an ANCESTOR test — `isHeld()` walks the
            chain — so every module skips everything in here, and that is still
            what the copy wants. The photograph is the stated exception (client
            direction, 11 September 2026): `data-truth-galaxy` is a hook no
            shared beat reads, and `closingDrift` in truth-scenes targets it
            directly and says in as many words that it is reaching past the
            hold. Nothing else in the band moves, and nothing else should.

            `scale-105` is not decoration: a plane that travels needs somewhere
            to travel from, or the drift walks its own edge into frame. Every
            other moving plate on the page opens oversized for the same reason. */}
        <div
          data-truth-galaxy
          className="absolute inset-0 scale-105 overflow-hidden will-change-transform"
        >
          <MediaOrField
            src={presentSrc(outgoing.src)}
            alt={outgoing.expects}
            sizes={COVER_TALL_BLEED}
            quality={85}
            fieldClass={FIELD_CLASS[outgoing.tone]}
          />
        </div>
        {/* LIGHTENED, 11 September 2026 (client: the ending is too dark). The
            wash was 0 → .387 → .86; the foot cannot move far, because that is
            where the band's white type sits and the copy has to clear it, so
            the lift is taken through the middle and the foot comes back only
            as far as the type allows. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-b from-black/0 via-black/[0.25] to-black/[0.68]"
        />
        {/* pb clears the footer's burnt crest (13.9vw), which rides the foot of
          this photograph — the page root is pulled up under it. */}
        <div data-truth-deck-viewport className="relative z-10">
          <div data-truth-deck-track>
            <div /* 36svh of runway above the copy grew the closing plate to 1,234px on a
                 phone, which is a 2,345px cover crop out of a photograph served at
                 1,560 — and 240px of it was empty. The frame's proportion is kept
                 from lg up, where the plate is its own screen. */
              className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-[calc(12svh+14vw)] pt-[22svh] lg:px-24 lg:pt-[36svh]">
              <p className="eyebrow text-lg text-gold sm:text-2xl">{wattanuri.marker}</p>
              <h2 className="headline mt-4 max-w-4xl text-4xl leading-[1.2] text-canvas sm:text-6xl">
                {wattanuri.title}
              </h2>
              <p className="mt-8 max-w-3xl leading-relaxed text-canvas">{wattanuri.body}</p>
              {/* THE CONSEQUENCE LINE COMES OFF (client direction, 11 September
                  2026) — `wattanuri.floor`, inside its [ SPEC — COPY NOT
                  COMMISSIONED ] note. It was the last placeholder dress left on
                  the page, and the floor now closes on the Lore itself and its
                  one link out. The text is NOT deleted: it stays in
                  src/content/truth.ts, where the note on `wattanuri` explains
                  what it was for, so it can be restored the day the line is
                  actually commissioned. */}
              <Link
                href={wattanuri.cta.href}
                className="eyebrow mt-10 inline-block text-xs text-gold transition-transform duration-300 hover:translate-x-1"
              >
                {wattanuri.cta.label} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
