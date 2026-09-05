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
import { truthBreaks, wattanuri } from "@/content/truth";
import {
  truthBreakMedia,
  truthDissolveMedia,
  truthEntryMedia,
  truthDeedPlateSlot,
  truthHeroSlot,
  truthTodayPlateSlot,
  truthWattanuriMedia,
} from "@/content/truth-media";
import { MediaOrField } from "@/components/ui/MediaOrField";
import { EditorialNote } from "@/components/ui/EditorialNote";
import { PullQuote } from "@/components/ui/PullQuote";
import { SplitReveal } from "@/components/motion/text/SplitReveal";
import { WordEmphasis } from "@/components/lofi/ui/WordEmphasis";
import { SharedMorph } from "@/components/transitions/SharedMorph";

/**
 * /v2/truth — the descent, at full cinematic weight (F7).
 *
 * Structure and copy are the committed src/content/truth.ts, unchanged. The
 * grounds come from the descent module's six-band ladder: sections carry
 * data-descent-band and the module cross-fades the fixed ground beneath them,
 * so the whole page darkens as it travels back. The rail on the left is the
 * record; its fill is scroll position (machine easing — a progress indicator
 * that eases is lying).
 *
 * The 1902 band is the page's hard moment: the count stands alone at
 * viewport scale with nothing else on screen (the copy draft's own build
 * note), and Suzanne's testimony below it carries NO motion attributes —
 * stillness as the doctrine's stated exception, because these are her words
 * being read.
 *
 * Era → band mapping (content eras are finer-grained than the six grounds):
 * Ahead + Today → present · Bought back → return · 1950s → named-wrong ·
 * 1902 + 1840s → count · Older than the record → before-record ·
 * 100M years → deep-time.
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
      <p className="eyebrow mb-6 origin-top-left text-[0.55rem] tracking-[0.2em] text-ochre/70">
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
            className="eyebrow text-[0.55rem] text-canvas/30 transition-colors duration-300 data-[state=active]:text-ochre data-[state=passed]:text-canvas/60"
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
    /* The wave lives OUTSIDE the clipped header so it can bleed a pixel past
       the hero's foot. Inside it, its own antialiased bottom edge landed
       exactly on the header boundary — with min-h-svh resolving to a
       fractional device pixel and the band below being transparent (the
       evergreen is the fixed descent ground), that edge read as a pale
       hairline across the full width under the crest. */
    <div className="relative">
      <header className="relative flex min-h-svh items-center overflow-hidden">
        <SharedMorph name="v2-truth-media">
          <div className="absolute inset-0">
            <div data-v2-hero-media className="absolute inset-0">
              <MediaOrField
                src={presentSrc(truthHeroSlot.src)}
                alt="Country at dusk — bare trees against the last light over Turraburra."
                sizes="100vw"
                priority
                className="object-cover"
                fieldClass="bg-midnight"
              />
            </div>
          </div>
        </SharedMorph>
        {/* X5 — the spec's linear wash: heavier at the foot, never opaque. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-charcoal/80 via-charcoal/30 to-charcoal/10"
        />

        {/* Spec column: text block ~225px in from the frame edge, lines running
            to ~1035px — wider than the body container, so the hero opens up. */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-24 lg:px-12">
          {/* Gold here is the spec's hero accent — eyebrow and cue only. */}
          <p data-v2-arrive className="eyebrow text-gold">
            {truthHero.eyebrow}
          </p>
          <SplitReveal
            as="h1"
            mode="lines"
            gate="entry"
            className="headline mt-8 max-w-4xl text-4xl text-canvas sm:text-6xl lg:max-w-none lg:text-display"
          >
            {truthHero.title}
          </SplitReveal>
          <p className="mt-10 max-w-2xl text-xl leading-relaxed text-canvas">
            {truthHero.standfirst}
          </p>
          <a
            href={truthHero.actions[0].href}
            data-hero-cue
            className="callout scroll-cue-glow mt-14 block w-fit text-scroll text-gold"
          >
            {truthHero.actions[0].label} &darr;
          </a>
        </div>

      </header>

      {/* The first era's ground rises into the hero — the spec's organic
          hand-off. Same wave as the footer divider, filled with the present
          band's evergreen so the crest and the ground below read as one.
          The viewBox starts at x=1 because the path's own left edge does:
          at 0 a sub-pixel column of the crest went unfilled down the left.
          -bottom-px drops the antialiased foot below the join. */}
      <svg
        aria-hidden
        viewBox="1 0 1469 151"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 -bottom-px h-20 w-full sm:h-36"
      >
        <path
          d="M1470.04 7.9544C1427.51 -2.1372 1377.18 -2.66008 1333.96 6.57748C1270.32 20.155 1224.29 42.5343 1157.49 50.8132C1113.11 56.3209 1072.13 52.2598 1028.08 50.5343C969.069 48.2162 917.126 51.1444 860.791 61.48C807.923 71.1707 756.575 83.7895 700.999 88.7046C633.371 94.6829 564.487 84.9573 499.434 73.4888C434.382 62.0203 369.263 48.5648 300.776 46.7696C195.602 44.0157 95.7447 68.87 1.00558 93.1491L1.00123 151H1470.04V7.9544Z"
          className="fill-evergreen"
        />
      </svg>
    </div>
  );
}

/**
 * One entry's photo strip. Real photograph where the library has one, honest
 * tonal field where it does not (the photo-batch rule: do not fake the gap).
 *
 * Depth drift (data-v2-depth) is withheld from any strip carrying a
 * frame-graded bucket — the tile of a cultural record does not get moved to
 * decorate the scroll. The grade travels with the slot, not the call site.
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
 * The precinct's photo pair, per the hi-fi frame (1440×1078 SVG, 2026-09-02):
 * a large rounded photograph left, a smaller one seated lower right, the
 * boomerang glyph over the big photo's top-left and the blue spiral in the
 * small photo's corner. Artwork stays static (the GoldTrail rule) and the
 * glyphs are decorative — empty alt, hidden from readers.
 */
function FeatureMedia({ slots, caption }: { slots: MediaSlot[]; caption?: string }) {
  const [lead, side] = slots;
  return (
    <figure className="mt-10 max-w-4xl">
      <div className="grid items-end gap-6 sm:grid-cols-[3fr_2fr] sm:gap-10">
        <div className="relative aspect-3/2 overflow-hidden rounded-2xl">
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
        <div className="relative aspect-3/2 overflow-hidden rounded-2xl sm:mb-10">
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
        <figcaption className="mt-3 text-xs leading-relaxed text-canvas/50">
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
        {...(anyFrameGraded ? {} : { "data-v2-depth": true })}
        className="grid items-start gap-6 sm:grid-cols-[13fr_9fr]"
      >
        <div className="space-y-6">
          <div className="relative aspect-3/2 overflow-hidden rounded-2xl">
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
          <div className="relative aspect-3/2 w-3/5 overflow-hidden rounded-2xl">
            <MediaOrField
              src={presentSrc(hand.src)}
              alt={hand.expects}
              sizes="(min-width: 640px) 25vw, 60vw"
              fieldClass={FIELD_CLASS[hand.tone]}
            />
          </div>
        </div>
        <div className="space-y-6">
          <div className="relative aspect-8/5 overflow-hidden rounded-2xl">
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
          <div className="relative aspect-3/2 overflow-hidden rounded-2xl">
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
        {...(anyFrameGraded ? {} : { "data-v2-depth": true })}
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
            sizes="(min-width: 640px) 27vw, 100vw"
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
        {...(MOTION_GRADE[country.bucket] === "frame" ? {} : { "data-v2-depth": true })}
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
      ) : (
        <EditorialNote
          tone="canvas"
          label="HELD — this is a document slot, not a photograph."
          className="mt-6 min-h-45 max-w-3xl"
        >
          Wants a scan of the journal page. Nothing is missing; nothing has
          been supplied yet.
        </EditorialNote>
      )}
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
 * "Push in, slowest on the page": the portrait carries [data-v2-portrait],
 * and the descent module scrubs it 1.04→1.00 at the heavy scrub — slower
 * than the plates and the hero. Withheld from frame-graded slots.
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
  const frameGraded = MOTION_GRADE[slot.bucket] === "frame";
  return (
    <figure className="mt-10 max-w-4xl">
      <div className="grid gap-8 sm:grid-cols-[294fr_626fr] sm:gap-14">
        <div className="relative aspect-294/386 overflow-hidden rounded-3xl">
          <div
            {...(frameGraded ? {} : { "data-v2-portrait": true })}
            data-motion={MOTION_GRADE[slot.bucket]}
            className="absolute inset-0"
          >
            <MediaOrField
              src={presentSrc(slot.src)}
              alt={slot.expects}
              sizes="(min-width: 640px) 22vw, 100vw"
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
                className="max-w-xl text-xl font-medium leading-relaxed text-canvas sm:text-2xl"
              />
              <figcaption className="eyebrow mt-10 max-w-xs text-xs leading-relaxed text-gold">
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
function WrittenRecordFrame({ slots }: { slots: MediaSlot[] }) {
  const [visitor, document] = slots;
  const documentSrc = presentSrc(document?.src ?? null);
  return (
    <figure className="mt-10 max-w-4xl">
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
          <div className="relative aspect-[768/180] overflow-hidden rounded-sm border border-canvas/35">
            <MediaOrField
              src={documentSrc}
              alt={document.expects}
              sizes="(min-width: 1024px) 54vw, 100vw"
              className="object-contain"
            />
          </div>
        ) : (
          <EditorialNote
            tone="canvas"
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
  const [surface, treeLine, stone] = slots;
  const strata: Array<{ slot: MediaSlot; offset: string }> = [
    { slot: surface, offset: "ml-0" },
    { slot: treeLine, offset: "sm:ml-[14%]" },
    { slot: stone, offset: "sm:ml-[7%]" },
  ];
  return (
    <figure className="mt-10 max-w-4xl">
      {strata.map(({ slot, offset }, i) => (
        <div
          key={slot.id}
          data-motion={MOTION_GRADE[slot.bucket]}
          {...(MOTION_GRADE[slot.bucket] === "frame" ? {} : { "data-v2-depth": true })}
          className={`relative aspect-[699/221] w-full overflow-hidden rounded-2xl sm:w-[76%] ${offset} ${
            i > 0 ? "mt-6 sm:mt-9" : ""
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
        {...(anyFrameGraded || strip ? {} : { "data-v2-depth": true })}
        className={`grid gap-3 ${cols}`}
      >
        {slots.map((slot) => (
          <div
            key={slot.id}
            data-motion={MOTION_GRADE[slot.bucket]}
            className={`relative overflow-hidden ${
              strip
                ? "aspect-square rounded-lg"
                : slots.length === 1
                  ? "aspect-video max-w-xl"
                  : "aspect-4/3"
            }`}
          >
            <MediaOrField
              src={presentSrc(slot.src)}
              alt={slot.expects}
              sizes={strip ? "(min-width: 640px) 15vw, 33vw" : "(min-width: 640px) 33vw, 100vw"}
              fieldClass={FIELD_CLASS[slot.tone]}
            />
          </div>
        ))}
      </div>
      {caption ? (
        <figcaption className="mt-3 text-xs leading-relaxed text-canvas/50">
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
  return (
    <article
      id={entry.id}
      data-descent-arrive
      /* No rule between records (2026-09-03): the hi-fi frames run the
         entries straight on, separated by the grounds and their spacing. */
      className={`relative grid gap-6 md:grid-cols-[180px_1fr] md:gap-12 ${
        isPartner ? "py-16 md:py-24" : "py-10"
      }`}
    >
      {/* The left gutter carries the era label and its sub (the 06 frame). */}
      {label ? (
        /* self-start: as a grid child this would stretch to the row height,
           and the rail centers its pointer on this box. */
        <div className="hidden self-start pt-2 md:block">
          {/* data-era-label sits on the year line itself — the rail centers
              its pointer on this element exactly. */}
          {/* normal-case: the eyebrow uppercases, and a decade reads
              "1950s", not "1950S". */}
          <p
            data-era-label
            className={`eyebrow text-xl text-gold ${/^\d/.test(label) ? "normal-case" : ""}`}
          >
            {label}
          </p>
          {sub ? (
            <p className="mt-1 text-sm font-normal uppercase leading-relaxed text-canvas">
              {sub}
            </p>
          ) : null}
        </div>
      ) : (
        <span aria-hidden className="hidden md:block" />
      )}
      <div className="max-w-2xl">
        {isPartner ? (
          <p className="eyebrow mb-6 font-normal text-burnt">{entry.when}</p>
        ) : null}
        {kicker || whenKicker ? (
          /* Undated whens ("More of this") are Link-weight, not ExtraBold —
             only the era kicker keeps the eyebrow's full weight. */
          <p
            className={`eyebrow mb-6 text-burnt ${whenKicker && !kicker ? "font-normal" : ""}`}
          >
            {kicker ?? whenKicker}
          </p>
        ) : null}
        {label ? (
          <div className="mb-6 md:hidden">
            <p className={`eyebrow text-gold ${/^\d/.test(label) ? "normal-case" : ""}`}>
              {label}
            </p>
            {sub ? (
              <p className="mt-1 text-xs font-normal uppercase text-canvas">
                {sub}
              </p>
            ) : null}
          </div>
        ) : null}
        {titleOnPlate ? null : (
          <h3
            className={`headline text-canvas ${
              kicker || isPartner || label || whenKicker
                ? "text-3xl sm:text-5xl"
                : "text-2xl"
            }`}
          >
            {entry.href ? (
              <Link href={entry.href} className="transition-colors hover:text-ochre">
                {entry.title}
              </Link>
            ) : (
              entry.title
            )}
          </h3>
        )}
        {kicker || isRenamed || isMitchell ? (
          /* The wireframe's dotted-trail rule under the display title — its
             own gold cut (360×24), delivered 2026-09-02. Static, decorative.
             The 2020 and 1840s frames carry it too, at 0.55. */
          /* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */
          <img
            src="/artwork/dots-rule-gold.svg"
            alt=""
            aria-hidden
            className={`mt-8 w-72 ${isRenamed || isMitchell ? "opacity-55" : ""}`}
            loading="lazy"
          />
        ) : null}
        {entry.body.map((paragraph) => (
          <p
            key={paragraph.slice(0, 32)}
            className={`leading-relaxed ${
              isPartner
                ? "mt-8 text-lg text-canvas sm:text-xl"
                : isGroundFrame
                  ? "mt-6 max-w-3xl text-canvas"
                  : "mt-4 text-canvas/75"
            }`}
          >
            {/* The 2020 frame folds the date into the body's first line. */}
            {isDiptych && entry.when && paragraph === entry.body[0]
              ? `${entry.when}. ${paragraph}`
              : paragraph}
          </p>
        ))}
        {entry.claim ? (
          <p className="headline mt-8 max-w-xl text-3xl leading-snug text-canvas">
            {entry.claim}
          </p>
        ) : null}
        {/* The coda is the record's large statement (the 05 and 2022
            frames) — it reads before the photographs. */}
        {entry.coda ? (
          <p
            className={`mt-8 max-w-2xl text-xl leading-snug text-canvas sm:text-2xl ${
              isGroundFrame ? "font-medium leading-relaxed" : ""
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
            <WrittenRecordFrame slots={truthEntryMedia[entry.id]} />
          ) : isMitchell ? (
            <CountryAndDocument slots={truthEntryMedia[entry.id]} />
          ) : isSeabed ? (
            <StrataStack slots={truthEntryMedia[entry.id]} />
          ) : (
            <EntryMedia slots={truthEntryMedia[entry.id]} caption={entry.caption} />
          )
        ) : null}
        {entry.footnotes?.map((footnote) => (
          <p key={footnote.slice(0, 32)} className="mt-4 text-xs leading-relaxed text-canvas/45">
            {footnote}
          </p>
        ))}
        {entry.source && entry.cta ? (
          /* The wireframe sets the record label and the CTA on one row. */
          <div className="mt-8 flex flex-wrap items-baseline justify-between gap-4">
            <p className="eyebrow text-[0.6rem] font-normal text-burnt">
              {entry.source}
            </p>
            <Link
              href={entry.cta.href}
              /* The ground frames (17, 18) set the CTA at Yellow Gold. */
              className={`eyebrow text-xs transition-transform duration-300 hover:translate-x-1 ${
                isGroundFrame ? "text-gold" : "text-ochre"
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
                className={`eyebrow mt-8 text-[0.6rem] font-normal ${
                  isGroundFrame ? "text-burnt" : "text-canvas/40"
                }`}
              >
                {entry.source}
              </p>
            ) : null}
            {entry.cta ? (
              <Link
                href={entry.cta.href}
                className={`eyebrow mt-6 inline-block text-xs transition-transform duration-300 hover:translate-x-1 ${
                  isGroundFrame ? "text-gold" : "text-ochre"
                }`}
              >
                {entry.cta.label} &rarr;
              </Link>
            ) : null}
          </>
        )}
      </div>
    </article>
  );
}

/**
 * An era's full-viewport ENTRY plate — beats 04 (TODAY, 1440×900) and
 * 09 (2026, 1440×1044) of the hi-fi (2026-09-02): a photograph full-bleed
 * under a bottom-weighted scrim, gold eyebrow, optional burnt kicker, and
 * the entry title at Heading/64. The image pushes in 1.06→1.00 on entry
 * ([data-v2-plate], scrubbed — same family as the hero settle). `deep`
 * deepens the scrim where the plate carries copy (the 09 spec); children
 * render below the title for plates that hold the whole entry.
 */
function EntryPlate({
  id,
  slot,
  eyebrow,
  kicker,
  title,
  deep,
  children,
}: {
  id?: string;
  slot: MediaSlot;
  eyebrow: React.ReactNode;
  kicker?: string;
  title: string;
  deep?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className="relative flex min-h-svh items-end overflow-hidden">
      <div
        data-v2-plate
        data-motion={MOTION_GRADE[slot.bucket]}
        className="absolute inset-0"
      >
        <MediaOrField
          src={presentSrc(slot.src)}
          alt={slot.expects}
          sizes="100vw"
          className="object-cover"
          fieldClass={FIELD_CLASS[slot.tone]}
        />
      </div>
      {/* The spec's scrim — bottom-weighted, never opaque at the crown. */}
      <div
        aria-hidden
        className={`absolute inset-0 bg-linear-to-b ${
          deep
            ? "from-black/0 via-black/40 to-black/85"
            : "from-black/0 via-black/35 to-black/80"
        }`}
      />
      <div
        data-descent-arrive
        className={`relative z-10 mx-auto w-full max-w-6xl px-6 lg:px-24 ${
          deep ? "pb-[24svh]" : "pb-[16svh]"
        }`}
      >
        <p className="eyebrow text-lg text-gold sm:text-2xl">{eyebrow}</p>
        {kicker ? <p className="eyebrow mt-1 text-burnt sm:text-base">{kicker}</p> : null}
        <SplitReveal
          as="h2"
          mode="lines"
          className="headline mt-6 max-w-4xl text-4xl leading-[1.2] text-canvas sm:text-6xl"
        >
          {title}
        </SplitReveal>
        {children}
      </div>
    </section>
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
      <>
        <EntryPlate
          id={era.id}
          slot={truthTodayPlateSlot}
          eyebrow={
            <>
              {era.marker} &middot; {lead.when}
            </>
          }
          kicker={era.title}
          title={lead.title}
        />
        <section className="mx-auto max-w-6xl px-6 py-20 lg:px-24">
          <div>
            <EntryBlock entry={lead} titleOnPlate />
          </div>
        </section>
      </>
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
    return (
      <>
        <EntryPlate
          id="deed"
          slot={truthDeedPlateSlot}
          eyebrow={<>2026 &middot; {era.title}</>}
          title={deed.title}
          deep
        >
          <p className="mt-8 max-w-3xl leading-relaxed text-canvas">
            {deed.when}. {deed.body[0]}
          </p>
          {deed.coda ? (
            <p className="mt-6 max-w-3xl text-xl font-medium leading-relaxed text-canvas sm:text-2xl">
              {deed.coda}
            </p>
          ) : null}
          {deed.source && deed.cta ? (
            <div className="mt-10 flex flex-wrap items-baseline gap-x-16 gap-y-4">
              <p className="eyebrow text-[0.6rem] font-normal text-burnt">
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
        {/* The 10 frame sets this ground at Roasted Brown (#4E3524) outright —
            painted here so it holds regardless of where the descent's
            cross-fade stands when the reader arrives. */}
        <section className="relative overflow-hidden bg-roasted">
          {/* The 06 frame's PENDING-MOTIF — Artwork Ring A (Marc's Wonder
              footer spiral, 349:3461), static behind the copy. Its 0.14 ×
              0.08 opacity is baked into the delivered cut. Spec position:
              x900 y60 of the 1440 frame, 416px wide. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
          <img
            src="/artwork/ring-spiral-a.svg"
            alt=""
            aria-hidden
            className="pointer-events-none absolute right-[8.6%] top-14 w-104"
            loading="lazy"
          />
          <div className="relative mx-auto max-w-6xl px-6 py-20 lg:px-24">
            {[...(prependEntries ?? []), ...rest].map((entry) => (
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
            ))}
          </div>
        </section>
      </>
    );
  }
  const inner = (
    <div className="relative mx-auto max-w-6xl px-6 py-20 lg:px-24">
      {/* The era marker, the lore line, and the entry whens all live on the
          trail rail now (2026-09-02) — repeating them here doubled the
          timeline and crowded the gutter the rail moved into. */}
      {foldsEra || eraTitleInGutter ? null : (
        <SplitReveal
          as="h2"
          mode="lines"
          className="headline mt-4 max-w-3xl text-3xl text-canvas sm:text-5xl"
        >
          {era.title}
        </SplitReveal>
      )}
      <div className="mt-12">
        {era.entries.map((entry, index) => (
          <EntryBlock
            key={entry.title}
            entry={entry}
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
  if (titleInGutter) {
    /* The 13 frame paints this ground outright: Roasted Brown (#4E3524)
       under a 0.34 dim — "the light is going out of this band" — so it holds
       regardless of where the descent's cross-fade stands on arrival. */
    return (
      <section id={era.id} className="relative bg-roasted">
        <div aria-hidden className="absolute inset-0 bg-[rgba(9,14,18,0.34)]" />
        {inner}
      </section>
    );
  }
  if (isOlderThanRecord) {
    return (
      <section id={era.id} className="relative overflow-hidden pb-16 sm:pb-28">
        {/* ⚠ PENDING-MOTIF · Artwork Ring A — static, deliberately behind the
            copy. Spec: x900 y70 of the 1440 frame, 416px wide, 0.12 over the
            0.08 fill. The delivered cut bakes 0.14 × 0.08, so it is dimmed to
            0.86 here. Artwork-motion permission is not recorded. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
        <img
          src="/artwork/ring-spiral-a.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute right-[8.6%] top-[70px] w-104 opacity-[0.86]"
          loading="lazy"
        />
        {inner}
        {/* Wave / Divider · CHARCOAL — into deep time. Fill = the ground of
            the band it introduces, over the foot of this one. */}
        <HandoffWave to="charcoal" />
      </section>
    );
  }
  if (isBeginning) {
    /* The 19 frame paints this ground outright: Charcoal Black (#090E12),
       so it holds regardless of where the descent's cross-fade stands. */
    return (
      <section id={era.id} className="relative bg-charcoal">
        {inner}
      </section>
    );
  }
  return <section id={era.id}>{inner}</section>;
}

/**
 * 1902 — the count, then Suzanne's words.
 *
 * The numerals take the viewport alone (the draft's build note: "nothing else
 * on screen"). Everything from the testimony down is still: no arrive, no
 * depth, no split — the stated exception.
 */
/**
 * Held (2026-09-03): Suzanne's testimony — the count, her recorded words —
 * is not published until she has seen and signed it off. While this is
 * true the band renders the 15 frame's WITHHELD state only: the placeholder
 * title, the testimony line, the held portrait slot and the build note.
 * Flip to false once her approval is recorded and the draft copy in
 * src/content/truth.ts (title, figures, quotes, check note) renders again.
 */
const SUZANNE_WITHHELD = true;

export function SuzanneBand() {
  return (
    <div id="the-count" className="relative overflow-hidden bg-charcoal">
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
      <div className="relative mx-auto max-w-6xl px-6 lg:px-24">
        {/* The 15 frame's head: era at Eyebrow/Section-24 in off-white on
            the gutter line, the title at Display/96 in Rust Red — the only
            red on the page — then the testimony block: portrait slot HELD
            (R5) left, attribution and build note right. Nothing here moves. */}
        <div className="grid gap-6 pb-40 pt-36 md:grid-cols-[180px_1fr] md:gap-12">
          <p className="eyebrow self-start pt-3 text-xl text-canvas">
            {SUZANNE_WITHHELD ? <>1902 &rarr; 1886</> : suzanne.marker}
          </p>
          <div>
            <h2 className="headline max-w-4xl text-5xl leading-[1.2] text-oxide sm:text-7xl lg:text-display">
              {SUZANNE_WITHHELD ? "[ THE COUNT ]" : suzanne.title}
            </h2>
            <p className="mt-10 text-sm uppercase tracking-wide text-canvas">
              {suzanne.attribution} &mdash; Testimony
              {SUZANNE_WITHHELD ? <> &middot; Words not reproduced</> : null}
            </p>
            <div className="mt-6 grid gap-8 sm:grid-cols-[320px_1fr] sm:gap-8">
              {/* ⟡ PORTRAIT SLOT — Suzanne. HELD: her image is not placed
                  until she has seen this (R5). */}
              <div
                data-placeholder="portrait-held"
                aria-hidden
                className="aspect-4/5 w-full max-w-80 rounded-xs border border-dashed border-oxide/50"
              />
              <div>
                <p className="text-sm leading-relaxed text-canvas">{suzanne.role}</p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-burnt">
                  &#9888; Content withheld pending Suzanne&apos;s approval.
                  &#9940; No photograph. No motion. The rail breaks here and
                  does not resume until the 1840s.
                </p>
              </div>
            </div>
          </div>
        </div>

        {SUZANNE_WITHHELD ? null : (
          <>
            <div className="flex min-h-[100svh] flex-col justify-center py-24 md:pl-[calc(180px+3rem)]">
              <dl className="space-y-16">
                {suzanne.figures.map((figure) => (
                  <div key={figure.year} data-v2-count className="max-w-3xl">
                    <dt className="headline text-7xl text-canvas sm:text-9xl">
                      {figure.year}
                    </dt>
                    <dd className="mt-4 text-lg leading-relaxed text-canvas/80">
                      {figure.detail}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-16 max-w-2xl text-sm leading-relaxed text-canvas/50">
                <a
                  href={suzanne.citation.href}
                  className="underline decoration-canvas/30 underline-offset-4 transition-colors hover:text-canvas/80"
                >
                  {suzanne.citation.text}
                </a>
              </p>
            </div>

            {/* Testimony. Still, by rule — these are her words being read. */}
            <div className="max-w-3xl pb-24 md:pl-[calc(180px+3rem)]">
              <EditorialNote>{suzanne.draftWarning}</EditorialNote>

              <PullQuote
                tone="charcoal"
                attribution={suzanne.attribution}
                role={suzanne.role}
                className="mt-14"
              >
                {suzanne.openingQuote}
              </PullQuote>
              <p className="mt-10 leading-relaxed text-canvas/80">{suzanne.lede}</p>
              {suzanne.quotes.map((quote) => (
                <PullQuote key={quote.slice(0, 32)} tone="charcoal" className="mt-10">
                  {quote}
                </PullQuote>
              ))}
              <p className="mt-10 leading-relaxed text-canvas/80">
                {suzanne.afterQuotes}
              </p>
              <p className="headline mt-14 text-4xl text-canvas sm:text-5xl">
                {suzanne.standingQuote}
              </p>
              {suzanne.closing.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="mt-8 leading-relaxed text-canvas/80">
                  {paragraph}
                </p>
              ))}
              <div className="mt-14">
                <EditorialNote label="For Suzanne to check — not for publication">
                  {suzanne.checkNote}
                </EditorialNote>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Wave / Divider · NAVY — Marc's hand-off, filled with the ground it
          INTRODUCES: what came before the record. The record strand on the
          rail surfaces again here (data-count-wave), under the count. */}
      <svg
        aria-hidden
        data-count-wave
        viewBox="0 0 1442 151"
        preserveAspectRatio="none"
        className="block h-16 w-full sm:h-28"
      >
        <path
          d="M1470.04 7.9544C1427.51 -2.1372 1377.18 -2.66008 1333.96 6.57748C1270.32 20.155 1224.29 42.5343 1157.49 50.8132C1113.11 56.3209 1072.13 52.2598 1028.08 50.5343C969.069 48.2162 917.126 51.1444 860.791 61.48C807.923 71.1707 756.575 83.7895 700.999 88.7046C633.371 94.6829 564.487 84.9573 499.434 73.4888C434.382 62.0203 369.263 48.5648 300.776 46.7696C195.602 44.0157 95.7447 68.87 1.00558 93.1491L1.00123 151H1470.04V7.9544Z"
          className="fill-midnight"
        />
      </svg>
    </div>
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
export function HandoffWave({ to }: { to: keyof typeof WAVE_FILL }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1442 151"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full sm:h-28"
    >
      <path
        d="M1470.04 7.9544C1427.51 -2.1372 1377.18 -2.66008 1333.96 6.57748C1270.32 20.155 1224.29 42.5343 1157.49 50.8132C1113.11 56.3209 1072.13 52.2598 1028.08 50.5343C969.069 48.2162 917.126 51.1444 860.791 61.48C807.923 71.1707 756.575 83.7895 700.999 88.7046C633.371 94.6829 564.487 84.9573 499.434 73.4888C434.382 62.0203 369.263 48.5648 300.776 46.7696C195.602 44.0157 95.7447 68.87 1.00558 93.1491L1.00123 151H1470.04V7.9544Z"
        className={WAVE_FILL[to]}
      />
    </svg>
  );
}

export function FullBleedBreak({
  which,
  waveTo,
}: {
  which: keyof typeof truthBreakMedia;
  /** Renders the hand-off wave over the break's foot, filled with the
   *  incoming section's ground. */
  waveTo?: keyof typeof WAVE_FILL;
}) {
  const slot = truthBreakMedia[which];
  return (
    <section
      id={truthBreaks[which].id}
      className="relative min-h-[80svh] overflow-hidden"
    >
      <MediaOrField
        src={slot.src}
        alt={truthBreaks[which].alt}
        sizes="100vw"
        fieldClass={FIELD_CLASS[slot.tone]}
      />
      {/* The 08 spec's light scrim — nothing to read here. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-b from-charcoal/40 via-transparent to-charcoal/40"
      />
      {waveTo ? <HandoffWave to={waveTo} /> : null}
    </section>
  );
}

/**
 * 14 · BREAK The Escarpment — DISSOLVE PAIR (2026-09-03). Two full-bleed
 * country shots stacked: B beneath, A on top dissolving 1 → 0 across the
 * break's travel ([data-v2-dissolve]); B pulls back a touch as it is
 * revealed ([data-v2-plate], the plates' own push). Light scrim. Marc's
 * charcoal wave over the foot — the last hand-off, into the count.
 *
 * While shot B is undelivered A holds at full: [data-v2-dissolve] is only
 * set when there is something to dissolve TO. Country bucket only (R10).
 */
export function DissolveBreak() {
  const { outgoing, incoming } = truthDissolveMedia;
  const incomingSrc = presentSrc(incoming.src);
  return (
    <section
      id={truthBreaks.escarpment.id}
      /* The frame's 900 on 1440 — the break keeps that proportion rather
         than a viewport-height minimum, so it never towers on a wide screen. */
      className="relative h-[62.5vw] min-h-[24rem] overflow-hidden"
    >
      <div
        data-v2-plate
        data-motion={MOTION_GRADE[incoming.bucket]}
        className="absolute inset-0"
      >
        <MediaOrField
          src={incomingSrc}
          alt=""
          sizes="100vw"
          fieldClass={FIELD_CLASS[incoming.tone]}
        />
      </div>
      <div
        {...(incomingSrc ? { "data-v2-dissolve": true } : {})}
        className="absolute inset-0"
      >
        <MediaOrField
          src={presentSrc(outgoing.src)}
          alt={truthBreaks.escarpment.alt}
          sizes="100vw"
          fieldClass={FIELD_CLASS[outgoing.tone]}
        />
      </div>
      {/* scrim · light — 0 → .18 → .40 */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-b from-black/0 via-black/18 to-black/40"
      />
      <HandoffWave to="charcoal" />
    </section>
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
 * The floor. Below the seabed, closing the descent — see the wattanuri note
 * in src/content/truth.ts. Still, like the testimony: the band that has run
 * beside the reader the whole way down does not need an entrance.
 */
/**
 * 20 · UNDERNEATH ALL OF IT — DISSOLVE PAIR (2026-09-03): the descent ends,
 * looking up. Shot B beneath is the opening shot returning (the hero frame);
 * shot A, the dusk plains, dissolves 1 → 0 across the band's travel
 * ([data-v2-dissolve]). Bottom-weighted scrim 0 → .387 → .86. The copy sits
 * at the gutter's left edge, not the entry column. Text still — no arrive.
 *
 * The "consequence line" is spec, not draft: the frame flags it
 * [ SPEC — COPY NOT COMMISSIONED ] and so does the page — an editorial note,
 * never prose (the EditorialNote rule).
 */
export function WattanuriBand() {
  const { outgoing, incoming } = truthWattanuriMedia;
  const incomingSrc = presentSrc(incoming.src);
  return (
    <section
      id={wattanuri.id}
      className="relative flex min-h-svh items-end overflow-hidden"
    >
      <div
        data-v2-plate
        data-motion={MOTION_GRADE[incoming.bucket]}
        className="absolute inset-0"
      >
        <MediaOrField
          src={incomingSrc}
          alt=""
          sizes="100vw"
          fieldClass={FIELD_CLASS[incoming.tone]}
        />
      </div>
      <div
        {...(incomingSrc ? { "data-v2-dissolve": true } : {})}
        className="absolute inset-0"
      >
        <MediaOrField
          src={presentSrc(outgoing.src)}
          alt={outgoing.expects}
          sizes="100vw"
          fieldClass={FIELD_CLASS[outgoing.tone]}
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-b from-black/0 via-black/[0.387] to-black/[0.86]"
      />
      {/* pb clears the footer's burnt crest (13.9vw), which rides the foot of
          this photograph — the page root is pulled up under it. */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-[calc(12svh+14vw)] pt-[36svh] lg:px-24">
        <p className="eyebrow text-lg text-gold sm:text-2xl">{wattanuri.marker}</p>
        <h2 className="headline mt-4 max-w-4xl text-4xl leading-[1.2] text-canvas sm:text-6xl">
          {wattanuri.title}
        </h2>
        <p className="mt-8 max-w-3xl leading-relaxed text-canvas">{wattanuri.body}</p>
        <EditorialNote
          tone="canvas"
          label="SPEC — COPY NOT COMMISSIONED"
          className="mt-8 max-w-3xl"
        >
          <p className="text-xl font-medium leading-relaxed text-canvas sm:text-2xl">
            {wattanuri.floor}
          </p>
        </EditorialNote>
        <Link
          href={wattanuri.cta.href}
          className="eyebrow mt-10 inline-block text-xs text-gold transition-transform duration-300 hover:translate-x-1"
        >
          {wattanuri.cta.label} &rarr;
        </Link>
      </div>
    </section>
  );
}

