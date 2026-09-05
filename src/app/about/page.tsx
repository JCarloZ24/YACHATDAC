import type { Metadata } from "next";
import { FooterGround } from "@/components/layout/FooterGround";
import { PageTransition } from "@/components/transitions/PageTransition";
import { aboutHero } from "@/content/about";
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
 * ⚠ THIS PAGE IS STATIC BY DECISION, not by omission. It mounts no motion
 * module and carries no scroll animation; it renders the same with JavaScript
 * on or off. The frame's layer names describe a motion build that is not built
 * — see the header of ./_components/Sections.tsx before changing anything.
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
