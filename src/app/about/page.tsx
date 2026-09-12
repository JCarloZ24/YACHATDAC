import type { Metadata } from "next";
import { FooterGround } from "@/components/layout/FooterGround";
import { PageTransition } from "@/components/transitions/PageTransition";
import { aboutHero } from "@/content/about";
import { skipLinks } from "@/content/site";
import {
  AboutHero,
  Breath,
  GetInTouch,
  HowWeWork,
  Partners,
  ThePeople,
  WhatWeAre,
  WhatWeDo,
  WhoDecides,
  WhyWeExist,
} from "./_components/Sections";
import { AboutMotion } from "./_components/Motion";
import { DebugRail } from "./_components/DebugRail";
import "./_components/about.css";

export const metadata: Metadata = {
  title: "About",
  description: aboutHero.standfirst,
};

/**
 * About — the hi-fi build (Figma 2653:19666, 05 · About — HI-FI · Desktop ·
 * the page answers), promoted onto the real route the way /truth,
 * /living-work, /the-record and /our-people were.
 *
 * The page's verb is ANSWERS: one question travels it, and everything on the
 * page is measured against that question. §03 asks it — "What does it leave
 * for the generations who come after us?" — and every section after answers
 * some part of it.
 *
 * Eleven frames, 2,053vh. The eleventh is the site footer, already built to
 * Marc's styling and not rebuilt here; the page just declares the ground it
 * hands over on.
 *
 * ⚠ THE SEAM PASS IS MOUNTED, AND SO IS §03'S INTERIOR. `<AboutMotion />`
 * builds the ten section-to-section seams of `REF · SCORE · 05 ABOUT` (Figma
 * 2642:19666), the X4 baseline arrivals, and — from 12 September 2026, user
 * direction — §03's held screen: the claims leave, the ground goes out under
 * them from the foot up, and the question is asked on bare charcoal
 * (`theQuestion`, and the held layout in ./_components/about.css). Every other
 * section interior (IMG-03's siblings, Group G's waypoints) remains unbuilt and
 * ledgered at docs/motion/scenes.md. With JavaScript off the page still renders
 * complete — rest state is the finished state, the reduced-motion cut is that
 * same state, and §03 falls back to the two stacked screens it used to be.
 * See the header of ./_components/Sections.tsx before changing anything.
 *
 * `PageTransition` stays: it paints the page's own ground behind everything,
 * and its route transition is site-wide chrome that every page.tsx carries
 * rather than motion belonging to this page.
 *
 * FIVE INBOUND LINKS point here and are load-bearing: `primaryNav`, the
 * Connect nav's children, and the footer's Organisation column, all in
 * src/content/site.ts — plus `/about#partners`, which src/app/partnerships
 * links to by anchor. The two anchors this page owns are #partners (§08) and
 * #contact (§09); neither may be renamed.
 *
 * ⚠ R24 REACHES THIS PAGE TOO. §07 shows two photographs of people who have
 * not been asked whether they may be identified, and it must not go to
 * `in-review` until that is answered. R15, R22, R12 and the Elder Advisory
 * Group's tense are all held as well; each is documented at its section.
 */
export default function AboutPage() {
  return (
    <PageTransition ground="#090e12">
      <AboutMotion />
      {/* Dev-only scroll readout for tuning the seams; renders nothing in
          production. */}
      {process.env.NODE_ENV !== "production" ? <DebugRail /> : null}
      {/* ⚠ THE DECK'S OWN ESCAPE, and this page needs one where the static
          routes do not: eleven sections, seven of them held screens, about
          23,700px — roughly 29 PageDowns end to end. The layout's "skip to
          content" lands a reader at the top of THIS; this one lands them past
          it, at §09's #contact. `sr-only` until focused, so it changes nothing
          visually. MOTION-SYSTEM.md: a page that jacks scroll must not trap a
          keyboard or screen-reader user, and must provide a skip mechanism. */}
      <a
        href="#contact"
        className="eyebrow sr-only rounded-xs bg-charcoal px-4 py-2 text-xs tracking-[0.08em] text-canvas focus:not-sr-only focus:fixed focus:top-16 focus:left-4 focus:z-100"
      >
        {skipLinks.sequence}
      </a>
      <AboutHero />
      <WhatWeAre />
      <WhyWeExist />
      <Breath />
      <WhatWeDo />
      <HowWeWork />
      <WhoDecides />
      <ThePeople />
      <Partners />
      <GetInTouch />

      {/* §09 ends on charcoal, so the footer's band above its burnt crest is
          charcoal here — the dark run carries straight into the footer. */}
      <FooterGround color="var(--color-charcoal)" />
    </PageTransition>
  );
}
