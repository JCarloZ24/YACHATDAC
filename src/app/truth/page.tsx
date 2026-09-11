import type { Metadata } from "next";
import { FooterGround } from "@/components/layout/FooterGround";
import { PageTransition } from "@/components/transitions/PageTransition";
import { V2TruthMotion } from "./_components/Motion";
import {
  DissolveBreak,
  EraSection,
  SuzanneBand,
  SuzanneCount,
  SuzanneTestimony,
  TruthHeroV2,
  WattanuriBand,
} from "./_components/Sections";
import { TruthTrailRail } from "./_components/TrailRail";
import { erasAfter, erasBefore, truthHero } from "@/content/truth";

export const metadata: Metadata = {
  title: "Truth",
  description: truthHero.standfirst,
};

/**
 * /truth — verb: DESCENDS. The hi-fi build, promoted from /v2/truth
 * (2026-09-02) to be the real page.
 *
 * Each band owns its solid ground and Marc's supplied dividers carry the
 * incoming colour as the reader travels back. Content is src/content/truth.ts verbatim — held by
 * community, draft warnings rendered, quotations untouched (R17/D15).
 *
 * From the hi-fi wireframes:
 *   · the winding record trail on the left — the scroll indicator, gold up to
 *     where the reader stands, with a mark at each era;
 *   · photo strips per entry (src/content/truth-media.ts — real photographs
 *     where the library has them, tonal fields where it does not);
 *   · two full-bleed country breaks between eras (R10 — never cultural-site);
 *   · the gold dot-trail artwork threading the descent (static — artwork);
 *   · the Wattanuri floor closing the chronology below the seabed.
 *
 * Band mapping (content eras are finer-grained than the six grounds):
 * hero + Ahead + Today → present · Bought back → return · 1950s →
 * named-wrong · 1902 → count · 1840s + Older than the record →
 * before-record (the 16 frame sets the 1840s on navy) · the seabed +
 * Wattanuri → deep-time.
 */
export default function TruthPage() {
  const [ahead, today, boughtBack, namedWrong] = erasBefore;
  /* The descent is chronological: Now → 2026 → 2022 → 2020. Today's dated
     records (the 2022 study, and Research & discovery with them) therefore
     render after the 2026 deed plate, inside the Bought back section. */
  const [, ...todayRecords] = today.entries;
  const [mitchell, olderThanRecord, beginning] = erasAfter;

  return (
    <PageTransition ground="#f6f6ec">
      <V2TruthMotion />
      <div
        data-descent-root
        className="relative -mb-[13.9vw] bg-canvas text-charcoal"
      >
        {/* The winding record trail — the wireframe's scroll indicator: the
            path of the descent with a mark at each era, gold up to where the
            reader stands. */}
        <TruthTrailRail />

        <section data-descent-band="present" className="bg-canvas">
          <TruthHeroV2 />
          <EraSection era={ahead} />
          <EraSection era={today} />
          {/* §08 · BREAK Country Now IS WITHDRAWN (client direction, 11
              September 2026). It closed the present band with a full-bleed
              photograph and handed the reader to Bought back through Marc's
              wave; the present band now runs straight into the 2026 deed
              plate, and the plate's own cover is the whole transition.

              NOTHING IS DELETED BEHIND THIS. `FullBleedBreak`, the
              `countryNow` pair in truth-media.ts, the `breakDissolve` recipe
              and `truth-break1.webp` itself are all still here — restoring the
              section is restoring this one line.

              ⚠ THE SEAM LOSES ITS DIVIDER. This wave was the only one between
              TODAY's record and the deed plate, and every other join on the
              page has one. Deliberately not replaced here: seating a crest on
              the incoming plate is a design decision about a different
              section, not part of removing this one. Raised rather than
              quietly reconciled. */}
        </section>

        <section data-descent-band="return" className="bg-canvas">
          <EraSection era={boughtBack} prependEntries={todayRecords} />
        </section>

        {/* Bought Back and the 1950s share one roasted-brown ground. The
            1950s frame deepens it locally; no unapproved sixth divider or
            independent viewport cross-fade is introduced at this join. */}
        <section data-descent-band="named-wrong" className="bg-canvas">
          <EraSection era={namedWrong} />
          {/* 14 → 15 is one composed deck: the charcoal count ground and
              its divider rise over the held escarpment image, matching the
              TODAY image-to-record treatment. */}
          <DissolveBreak deckContent={<SuzanneBand withinDeck />} />
        </section>

        {/* 15 · THE HARD STOP, in three held screens (10 Sep 2026).
            Who is speaking arrives on the escarpment cover above; the count
            and her testimony are screens of their own, so the numerals take a
            viewport alone as the draft's build note asks and her words are not
            something the reader scrolls past on the way somewhere else.
            They carry data-truth-ground="count", which is also what finally
            makes the deck's own railHiddenSlides selector do its job — the
            rail is silent across all three. */}
        <section data-descent-band="count" className="bg-charcoal">
          <SuzanneCount />
          <SuzanneTestimony />
        </section>

        <section data-descent-band="before-record" className="bg-canvas">
          <EraSection era={mitchell} />
          <EraSection era={olderThanRecord} />
        </section>

        <section data-descent-band="deep-time" className="bg-canvas">
          {/* 19 runs straight into 20 (16341 + 1447 = 17788): no trail between. */}
          <EraSection era={beginning} />
          <WattanuriBand />
        </section>
      </div>
      {/* The page ends on the Wattanuri photograph itself (the 20 frame):
          the footer's burnt crest rides the foot of the image, so the wave
          block is pulled up over it (the negative margin above) and its
          ground is transparent — no published-record strip and no colour
          band between the floor and the footer. */}
      <FooterGround color="transparent" />
    </PageTransition>
  );
}
