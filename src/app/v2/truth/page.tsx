import type { Metadata } from "next";
import { PageTransition } from "@/components/transitions/PageTransition";
import { V2TruthMotion } from "@/components/v2/V2TruthMotion";
import {
  EraSection,
  PublicationBand,
  SuzanneBand,
  TruthHeroV2,
  TruthRailV2,
} from "@/components/v2/TruthSections";
import { erasAfter, erasBefore } from "@/content/truth";

export const metadata: Metadata = { title: "Truth" };

/**
 * /v2/truth — verb: DESCENDS.
 *
 * The committed descent module owns the grounds: each band below names one of
 * the six era grounds and the fixed layer stack beneath cross-fades as the
 * reader travels back. Content is src/content/truth.ts verbatim — held by
 * community, draft warnings rendered, quotations untouched (R17/D15).
 *
 * Band mapping (content eras are finer-grained than the six grounds):
 * hero + Ahead + Today → present · Bought back → return · 1950s →
 * named-wrong · 1902 + 1840s → count · Older than the record →
 * before-record · the seabed → deep-time.
 */
export default function V2TruthPage() {
  const [ahead, today, boughtBack, namedWrong] = erasBefore;
  const [mitchell, olderThanRecord, beginning] = erasAfter;

  return (
    <PageTransition ground="#22372B">
      <V2TruthMotion />
      <div data-descent-root className="relative text-canvas">
        {/* The ground — the module builds one opaque layer per era into it. */}
        <div data-descent-ground aria-hidden className="fixed inset-0 -z-10" />
        <TruthRailV2 />

        <section data-descent-band="present">
          <TruthHeroV2 />
          <EraSection era={ahead} />
          <EraSection era={today} />
        </section>

        <section data-descent-band="return">
          <EraSection era={boughtBack} />
        </section>

        <section data-descent-band="named-wrong">
          <EraSection era={namedWrong} />
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
          <PublicationBand />
        </section>
      </div>
    </PageTransition>
  );
}
