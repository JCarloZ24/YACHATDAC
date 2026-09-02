import type { Metadata } from "next";
import { FooterGround } from "@/components/layout/FooterGround";
import { PageTransition } from "@/components/transitions/PageTransition";
import { V2TruthMotion } from "@/components/v2/V2TruthMotion";
import {
  EraSection,
  FullBleedBreak,
  GoldTrail,
  PublicationBand,
  SuzanneBand,
  TruthHeroV2,
  WattanuriBand,
} from "@/components/v2/TruthSections";
import { TruthTrailRail } from "@/components/v2/TruthTrailRail";
import { erasAfter, erasBefore, truthHero } from "@/content/truth";

export const metadata: Metadata = {
  title: "Truth",
  description: truthHero.standfirst,
};

/**
 * /truth — verb: DESCENDS. The hi-fi build, promoted from /v2/truth
 * (2026-09-02) to be the real page.
 *
 * The committed descent module owns the grounds: each band below names one of
 * the six era grounds and the fixed layer stack beneath cross-fades as the
 * reader travels back. Content is src/content/truth.ts verbatim — held by
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
 * named-wrong · 1902 + 1840s → count · Older than the record →
 * before-record · the seabed + Wattanuri → deep-time.
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
      <div data-descent-root className="relative text-canvas">
        {/* The ground — the module builds one opaque layer per era into it. */}
        <div data-descent-ground aria-hidden className="fixed inset-0 -z-10" />
        {/* The winding record trail — the wireframe's scroll indicator: the
            path of the descent with a mark at each era, gold up to where the
            reader stands. */}
        <TruthTrailRail />

        <section data-descent-band="present">
          <TruthHeroV2 />
          <EraSection era={ahead} />
          <EraSection era={today} />
          {/* The 08 break closes the present band and hands the reader to
              Bought back's roasted ground via Marc's wave. */}
          <FullBleedBreak which="countryNow" waveTo="roasted" />
        </section>

        <section data-descent-band="return">
          <EraSection era={boughtBack} prependEntries={todayRecords} />
        </section>

        <section data-descent-band="named-wrong">
          <GoldTrail variant="trail" />
          <EraSection era={namedWrong} />
          <FullBleedBreak which="duskCountry" />
        </section>

        <section data-descent-band="count">
          <SuzanneBand />
          <EraSection era={mitchell} />
        </section>

        <section data-descent-band="before-record">
          <EraSection era={olderThanRecord} />
        </section>

        <section data-descent-band="deep-time">
          <EraSection era={beginning} />
          <GoldTrail variant="wave" />
          <WattanuriBand />
          <PublicationBand />
        </section>
      </div>
      {/* The page ends on the deep-time ground, not canvas. */}
      <FooterGround color="var(--color-midnight)" />
    </PageTransition>
  );
}
