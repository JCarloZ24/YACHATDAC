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
      {/* NO LOADING SCREEN. User direction 11 Sep 2026: the opening film on `/`
          is the site's only loading screen, so `<WonderLoader />` is unmounted
          here. Wonder's is HIDDEN, NOT DELETED — _components/Loader.tsx and the
          shared components/ui/PageLoader it binds are both still in the tree;
          restoring this page's panel is one import and one element. Living Work
          and The Record had theirs removed outright in the same pass. */}
      {/* The page's motion script — docs/motion/wonder-plan.md. Renders
          nothing; every screen is a composition with a declared channel. */}
      <WonderMotion />
      <div className="relative">
        {/* The sticky hero is bounded to the one section that rides over it
            (18 Sep 2026). Loose in the page wrapper it stayed pinned behind
            EVERY section, so any gap lower down — a held section shorter
            than a tall phone — showed the film ("the hero section got out"). */}
        <div className="relative">
          <WonderHero />
          <WonderFacts />
        </div>
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
