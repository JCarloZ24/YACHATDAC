import type { Metadata } from "next";
import { FooterGround } from "@/components/layout/FooterGround";
import { PageTransition } from "@/components/transitions/PageTransition";
import {
  WonderBeforeYouCome,
  WonderClose,
  WonderFacts,
  WonderCountry,
  WonderHero,
  WonderHighlights,
  WonderHosts,
  WonderOutHere,
  WonderStay,
  WonderStories,
  WonderWhereYouStay,
} from "./_components/Sections";
import { WonderLoader } from "./_components/Loader";
import { WonderMotion } from "./_components/Motion";
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
      {/* Hard loads and refreshes only: holds scroll and covers the hero film's
          first buffer — see _components/Loader. */}
      <WonderLoader />
      {/* The page's motion script — docs/motion/wonder-plan.md. Renders
          nothing; every screen is a composition with a declared channel. */}
      <WonderMotion />
      <div className="relative">
        <WonderHero />
        <WonderFacts />
        <WonderHighlights />
        <WonderCountry />
        <WonderStay />
        <WonderBeforeYouCome />
        <WonderWhereYouStay />
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
