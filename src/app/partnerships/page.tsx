import type { Metadata } from "next";
import { FooterGround } from "@/components/layout/FooterGround";
import { PageTransition } from "@/components/transitions/PageTransition";
import { PartnershipsMotion } from "./_components/Motion";
import {
  AlreadyWorkingWith,
  Breath,
  HowWorkIsAgreed,
  OpenQuestions,
  OpenResearch,
  PartnershipsHero,
  TheEnding,
  TheObligation,
  WaysIn,
} from "./_components/Sections";

export const metadata: Metadata = {
  title: "Partnerships",
  description:
    "Research and partnership opportunities on Turraburra. A researcher on Country is a guest on Country.",
};

/**
 * Partnerships — the hi-fi build (Figma 2944:25988, 07 · Partnerships — HI-FI ·
 * Desktop · the page hosts), promoted onto the real route the way /truth,
 * /living-work, /the-record, /our-people and /about were.
 *
 * The page's verb is HOSTS. Greeting carries no obligation; hosting does, and
 * the obligation is the argument — §02 states it alone on a screen and every
 * section after is a way of meeting it.
 *
 * Ten frames, 1,190vh. The tenth is the site footer, already built to Marc's
 * styling and not rebuilt here; the page just declares the ground it hands
 * over on.
 *
 * ⚠ §01 NOW MOVES; §02 DOWN ARE STILL STATIC BY DECISION, not by omission.
 * The hero takes an arrival overture — X4 on the eyebrow, B5 on the headline
 * by line, X4 on the standfirst and the action row a beat later, and the
 * divider handing the photograph off (user direction, 9 September 2026). The
 * photograph itself holds still: no pushIn and no plateParallax, because
 * there are people in that frame. Everything below §01 has no motion module,
 * no scroll animation and no hover, and renders the same with JavaScript on
 * or off. The frame describes more — a 190vh pin on §04 and a shutter over
 * each disclosure — and none of that is built; see docs/motion/scenes.md,
 * src/lib/motion/partnerships.ts and the header of ./_components/Sections.tsx
 * before changing anything.
 *
 * ⚠⚠ THIS PAGE HAS NO DRAFT. It exists under D22 because four live links
 * already pointed at it, and every word on it is borrowed from a page that
 * does have one — About, Living Work, The Record and Truth. That is the
 * page's defining constraint and the reason each section names its source.
 * Do not add copy here without a provenance.
 *
 * THREE ANCHORS ARE LOAD-BEARING. `#research-opportunities` (§03) is linked
 * from Truth and from The Record's knowledge-gaps section; unbuilt, both are
 * dead links. `#ways-in` (§06) and `#open-questions` (§04) are this page's
 * own, used by the hero and by §04's action.
 *
 * ⚠ WHAT IS HELD: R12, R9/R15, R22 and R24 all reach this page, and the
 * research protocol is in preparation. Each is documented at its section.
 */
export default function PartnershipsPage() {
  return (
    <PageTransition ground="#22372b">
      {/* §01's overture only. Renders nothing; see ./_components/Motion.tsx. */}
      <PartnershipsMotion />
      <PartnershipsHero />
      <TheObligation />
      <OpenResearch />
      <OpenQuestions />
      <Breath />
      <AlreadyWorkingWith />
      <WaysIn />
      <HowWorkIsAgreed />
      <TheEnding />

      {/* §08 ends on canvas, so the footer's band above its burnt crest is
          canvas here — the same handover The Record and Our People make. */}
      <FooterGround color="var(--color-canvas)" />
    </PageTransition>
  );
}
