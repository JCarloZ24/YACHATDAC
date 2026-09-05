import type { Metadata } from "next";
import { PageTransition } from "@/components/transitions/PageTransition";
import { LivingWorkLoader } from "./_components/Loader";
import { V2LivingWorkMotion } from "./_components/Motion";
import {
  LivingWorkAperture,
  LivingWorkBreath,
  LivingWorkChallenges,
  LivingWorkHero,
  LivingWorkInfrastructure,
  LivingWorkInvitation,
  LivingWorkOutputs,
  LivingWorkRangers,
  LivingWorkSpring,
  LivingWorkStreams,
} from "./_components/Sections";
import { livingWorkHero } from "@/content/living-work";

export const metadata: Metadata = {
  title: "Living Work — Caring for Country",
  description: livingWorkHero.standfirst,
};

/**
 * /living-work — verb: ACCUMULATES. The immersive build, promoted from
 * /v2/living-work on 31 Aug — the first page to make the move.
 *
 * Built to `03 · Living Work · HI-FI · the field notebook` (Figma 2137:2613).
 * The page's argument is that the work adds up, and its motion says the same
 * thing: figures cycling behind an aperture, eight days counted at the spring,
 * seven streams lit one at a time, five vessels filling to their own
 * proportions with the fifth honestly empty.
 *
 * Sections are ordered as the hi-fi orders them. §07b BREATH sits between the
 * apparatus and what it earns, holding for half a screen — it is the reason the
 * sections either side of it land.
 *
 * Load-bearing anchors (src/content/site.ts and /connect point here):
 * #rangers, #streams, #infrastructure.
 */
export default function LivingWorkPage() {
  return (
    <PageTransition ground="#22372B">
      {/* Hard loads only — covers the motion build's settling window, counts
          to 100 against real readiness gates, announces the page, lifts onto
          the hero. */}
      <LivingWorkLoader />
      <V2LivingWorkMotion />
      <div className="relative text-canvas">
        <LivingWorkHero />
        <LivingWorkAperture />
        <LivingWorkChallenges />
        <LivingWorkRangers />
        <LivingWorkSpring />
        <LivingWorkStreams />
        <LivingWorkInfrastructure />
        <LivingWorkBreath />
        <LivingWorkOutputs />
        <LivingWorkInvitation />
      </div>
    </PageTransition>
  );
}
