import type { Metadata } from "next";
import { PageTransition } from "@/components/transitions/PageTransition";
import { V2LivingWorkMotion } from "@/components/v2/V2LivingWorkMotion";
import {
  LivingWorkAperture,
  LivingWorkBreath,
  LivingWorkChallenges,
  LivingWorkHero,
  LivingWorkInvitation,
  LivingWorkOutputs,
  LivingWorkRangers,
  LivingWorkSpring,
  LivingWorkStreams,
} from "@/components/v2/LivingWorkSections";

export const metadata: Metadata = { title: "Living Work" };

/**
 * /v2/living-work — verb: ACCUMULATES.
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
 */
export default function V2LivingWorkPage() {
  return (
    <PageTransition ground="#22372B">
      <V2LivingWorkMotion />
      <div className="relative text-canvas">
        <LivingWorkHero />
        <LivingWorkAperture />
        <LivingWorkChallenges />
        <LivingWorkRangers />
        <LivingWorkSpring />
        <LivingWorkStreams />
        <LivingWorkBreath />
        <LivingWorkOutputs />
        <LivingWorkInvitation />
      </div>
    </PageTransition>
  );
}
