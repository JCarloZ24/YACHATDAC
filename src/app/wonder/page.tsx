import type { Metadata } from "next";
import { FooterGround } from "@/components/layout/FooterGround";
import { PageTransition } from "@/components/transitions/PageTransition";
import {
  WonderBeforeYouCome,
  WonderClose,
  WonderFacts,
  WonderGettingHere,
  WonderHero,
  WonderHighlights,
  WonderHosts,
  WonderOutHere,
  WonderStay,
  WonderStories,
  WonderTurraburra,
  WonderWhereYouSleep,
} from "./_components/Sections";
import { wonderHero } from "@/content/wonder";

export const metadata: Metadata = {
  title: "Wonder — Guesting On-Country",
  description: wonderHero.standfirst,
};

/**
 * /wonder — Guesting On-Country. The hi-fi build, to
 * `01 · Wonder · HI-FI · Desktop` (Figma 2033:4367), replacing the lo-fi
 * page on 2026-09-05. Desktop-first at 1440 × 900; sections in the frame's
 * order, grounds as the frame sets them:
 *
 *   hero (photo) → canvas facts → canvas highlights → charcoal getting here
 *   → Turraburra (photo) → canvas stay → evergreen before you come → canvas
 *   where you sleep → out here (photo) → canvas hosts → canvas stories →
 *   roasted close → footer.
 *
 * Copy is src/content/wonder.ts (D5). The `#experience` and `#turraburra`
 * anchors are load-bearing — src/content/site.ts points at both.
 */
export default function WonderPage() {
  return (
    <PageTransition ground="#4E3524">
      <div className="relative">
        <WonderHero />
        <WonderFacts />
        <WonderHighlights />
        <WonderGettingHere />
        <WonderTurraburra />
        <WonderStay />
        <WonderBeforeYouCome />
        <WonderWhereYouSleep />
        <WonderOutHere />
        <WonderHosts />
        <WonderStories />
        <WonderClose />
      </div>
      {/* The page ends on roasted; without this the footer's double wave
          opens onto a stray canvas band. */}
      <FooterGround color="var(--color-roasted)" />
    </PageTransition>
  );
}
