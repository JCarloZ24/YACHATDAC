import type { Metadata } from "next";
import { FooterGround } from "@/components/layout/FooterGround";
import { PageTransition } from "@/components/transitions/PageTransition";
import { V2TruthMotion } from "./_components/Motion";
import {
  DissolveBreak,
  EraSection,
  FullBleedBreak,
  SuzanneBand,
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
    <PageTransition ground="#22372B">
      <V2TruthMotion />
      <div
        data-descent-root
        className="relative -mb-[13.9vw] bg-evergreen text-canvas"
      >
        {/* The winding record trail — the wireframe's scroll indicator: the
            path of the descent with a mark at each era, gold up to where the
            reader stands. */}
        <TruthTrailRail />

        <section data-descent-band="present" className="bg-evergreen">
          <TruthHeroV2 />
          <EraSection era={ahead} />
          <EraSection era={today} />
          {/* The 08 break closes the present band and hands the reader to
              Bought back's roasted ground via Marc's wave. */}
          <FullBleedBreak which="countryNow" waveTo="roasted" />
        </section>

        <section data-descent-band="return" className="bg-roasted">
          <EraSection era={boughtBack} prependEntries={todayRecords} />
        </section>

        {/* Bought Back and the 1950s share one roasted-brown ground. The
            1950s frame deepens it locally; no unapproved sixth divider or
            independent viewport cross-fade is introduced at this join. */}
        <section data-descent-band="named-wrong" className="bg-roasted">
          <EraSection era={namedWrong} />
          {/* 14 → 15 is one composed deck: the charcoal count ground and
              its divider rise over the held escarpment image, matching the
              TODAY image-to-record treatment. */}
          <DissolveBreak deckContent={<SuzanneBand withinDeck />} />
        </section>

        <section data-descent-band="before-record" className="bg-midnight">
          <EraSection era={mitchell} />
          <EraSection era={olderThanRecord} />
        </section>

        <section data-descent-band="deep-time" className="bg-charcoal">
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
