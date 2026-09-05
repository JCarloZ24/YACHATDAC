import type { Metadata } from "next";
import { FooterGround } from "@/components/layout/FooterGround";
import { PageTransition } from "@/components/transitions/PageTransition";
import { ourPeopleHero } from "@/content/our-people";
import {
  Acknowledgements,
  BreathPivot,
  BreathTeam,
  GetInTouch,
  Governance,
  HerDecision,
  OurPeopleAdvisory,
  OurPeopleHero,
  SuzanneTestimony,
  TheGathering,
} from "./_components/Sections";

export const metadata: Metadata = {
  title: "Our people",
  description: ourPeopleHero.standfirst,
};

/**
 * Our People — the hi-fi build (Figma 2841:25358, 06 · Our People — HI-FI ·
 * Desktop · the page gathers), promoted onto the real route the way /truth,
 * /living-work and /the-record were. D23 makes this a route of its own.
 *
 * The page's verb is GATHERS: everything on it converges, and the five held
 * cards arrive in the same breath as the named one and then hold still —
 * which is how a page about people it may not name says so.
 *
 * Eleven frames, 1,835vh. The eleventh is the site footer, already built to
 * Marc's styling and not rebuilt here; the page just declares the ground it
 * hands over on.
 *
 * ⚠⚠ R24 IS THIS PAGE'S BLOCKER. Consent to be named and photographed has not
 * been sought from any of the eight unnamed people here, and this page must
 * not go to `in-review` until it has been. Every constraint that follows from
 * that is documented at the top of ./_components/Sections.tsx — read it before
 * changing anything on this page. Making /our-people a route did not make it a
 * directory.
 *
 * FOUR INBOUND LINKS point here and are load-bearing: the homepage Belonging
 * CTA, About's "Meet the people", and the footer's Organisation column (twice).
 * The one anchor other pages target is #contact, on §06.
 *
 * ⚠ THIS PAGE IS STATIC BY DECISION, not by omission. It mounts no motion
 * module and carries no scroll animation; it renders the same with JavaScript
 * on or off. A motion pass was built against this markup and then removed —
 * see git history if it is ever wanted back, and do not re-add it piecemeal.
 *
 * `PageTransition` stays: it paints the page's own ground behind everything,
 * and its route transition is site-wide chrome that every page.tsx carries
 * rather than motion belonging to this page.
 */
export default function OurPeoplePage() {
  return (
    <PageTransition ground="#090e12">
      {/* The advisory renders FIRST, above everything, and nothing sits above
          it. Australian cultural protocol, and the draft's own placement. */}
      <OurPeopleAdvisory />

      <OurPeopleHero />
      <SuzanneTestimony />
      <HerDecision />
      <TheGathering />
      <BreathTeam />
      <Governance />
      <Acknowledgements />
      <BreathPivot />
      <GetInTouch />

      {/* §06 ends on canvas, so the footer's band above its burnt crest is
          canvas here — the same handover The Record makes. */}
      <FooterGround color="var(--color-canvas)" />
    </PageTransition>
  );
}
