import type { Metadata } from "next";
import { FooterGround } from "@/components/layout/FooterGround";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
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
 * ⚑ THE PAGE IS SCORED (user direction, 11 September 2026). It was built
 * static below §01 and every header said so; the wireframe's side-notes are
 * now built, section by section. §04 takes the 190vh pin and the shutter over
 * each disclosure that the frame always described and nothing implemented.
 *
 * The photograph in §01 still holds still — no pushIn, no plateParallax —
 * because there are people in that frame, and §03's research frame holds for
 * the same reason (R24). §04b and §07 are rest screens by instruction.
 *
 * Scores: src/lib/motion/partnerships.ts · `hosting` in
 * src/lib/motion/recipes.ts · wired in ./_components/Motion.tsx · ledgered in
 * docs/motion/scenes.md. Read those before changing anything.
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
      {/* SCR-09 wheel inertia, opted into 11 September 2026 — grammar row
          "being drawn in". It is here for the THREE LOAD-BEARING ANCHORS named
          above as much as for the feel: `#research-opportunities`, `#ways-in`
          and `#open-questions` all jump instantly without it, and this page's
          own hero and §04 both link into the page. Lenis caps an anchor jump
          rather than animating it proportionally to distance, leaves keyboard
          and programmatic scrolling native, and is never constructed for
          `(pointer: coarse)` or reduced motion — which is why this is not the
          `scroll-behavior: smooth` that globals.css bans. */}
      <SmoothScroll />

      {/* Renders nothing; see ./_components/Motion.tsx. */}
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
