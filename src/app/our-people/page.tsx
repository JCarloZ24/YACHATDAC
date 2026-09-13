import type { Metadata } from "next";
import { FooterGround } from "@/components/layout/FooterGround";
import { PageTransition } from "@/components/transitions/PageTransition";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ourPeopleHero } from "@/content/our-people";
import { OurPeopleCanvas } from "./_components/OurPeopleCanvas";
import "./_components/our-people.css";
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
 * User direction, 11 September 2026, supersedes the earlier static decision:
 * use the homepage's one-canvas architecture. All ten existing sections ride
 * one Three.js stage and one controller-owned reading clock. Their original
 * markup is the accessible text layer and the ordinary-flow fallback (D5/D12).
 *
 * `PageTransition` stays: it paints the page's own ground behind everything,
 * and its route transition is site-wide chrome that every page.tsx carries
 * rather than motion belonging to this page.
 */
export default function OurPeoplePage() {
  return (
    <PageTransition ground="#090e12">
      <SmoothScroll />
      <div data-people-stage data-page-ready="loading" className="people-stage relative isolate bg-charcoal">
        <OurPeopleCanvas />
        {/* Testimony → Who decides colour wash (14 Sep 2026), our-people.ts. */}
        <div data-people-veil aria-hidden className="people-veil" />
        {/* Who decides' ground while it is held under the team (14 Sep 2026). */}
        <div data-people-hold-veil aria-hidden className="people-veil" />
        {/* The Who decides ring pattern, already on the testimony screen
            (14 Sep 2026): the same two pieces at the same placement as
            HerDecision's, drawn as masks so only their colour changes with the
            ground. our-people.ts sizes the box to the section and hands over
            to the section's own rings at the cut. */}
        <div data-people-pattern aria-hidden className="people-pattern">
          <div data-people-pattern-box className="absolute inset-x-0 top-0 overflow-hidden">
            <div data-artwork="ring-a" data-people-pattern-ring style={{ maskImage: "url(/artwork/ring-a.svg)" }} className="absolute -left-44 bottom-[8%] aspect-[415.952/375.023] w-[36.7rem]" />
            <div data-artwork="ring-b" data-people-pattern-ring style={{ maskImage: "url(/artwork/ring-b.svg)" }} className="absolute top-[7%] left-[64.4%] aspect-[465.005/469.992] w-[56.25rem]" />
          </div>
        </div>
        <div data-people-track className="people-track relative">
          {/* The advisory renders first, as the draft specifies. */}
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
        </div>
      </div>

      {/* §06 ends on canvas, so the footer's band above its burnt crest is
          canvas here — the same handover The Record makes. */}
      <FooterGround color="var(--color-canvas)" />
    </PageTransition>
  );
}
