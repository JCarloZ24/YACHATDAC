import type { Metadata } from "next";
import { Preloader } from "@/components/lofi/Preloader";
import { PageTransition } from "@/components/transitions/PageTransition";
import { OrbitHero } from "@/components/v2/OrbitHero";
import { RecallHero } from "@/components/v2/RecallHero";
import { V2HomeMotion } from "@/components/v2/V2HomeMotion";
import {
  BelongingBeat,
  LivingWorkBeat,
  TruthBeat,
  WonderBeat,
} from "@/components/v2/beats";
import { InvitationV2 } from "@/components/v2/InvitationV2";
import { WayForwardV2 } from "@/components/v2/WayForwardV2";
import { beats } from "@/content/lofi/homepage";

export const metadata: Metadata = { title: "Home" };

/**
 * /v2/home — verb: OPENS.
 *
 * One continuous scroll, seven screens, each with one loud channel:
 * hero (A5 Recall / T7 Orbit — ?hero=orbit switches the proposal) →
 * Wonder (media, M2) → Truth (type + the C4 door) → Belonging (transition
 * sweep) → Living Work (the Y7 river) → Invitation (the first navigation) →
 * The Way Forward (rest).
 *
 * Copy is the committed lofi seed content, unchanged — the v2 build recreates
 * the page's cinema, not its words (D5/D12 stand).
 */
export default async function V2HomePage({
  searchParams,
}: {
  searchParams: Promise<{ hero?: string }>;
}) {
  const { hero } = await searchParams;
  const variant = hero === "orbit" ? ("orbit" as const) : ("recall" as const);
  const [heroBeat, wonder, truth, belonging, livingWork] = beats;

  return (
    <PageTransition ground="#090E12">
      <Preloader />
      <V2HomeMotion variant={variant} />
      {variant === "orbit" ? (
        <OrbitHero beat={heroBeat} />
      ) : (
        <RecallHero beat={heroBeat} />
      )}
      <WonderBeat beat={wonder} />
      <TruthBeat beat={truth} />
      <BelongingBeat beat={belonging} />
      <LivingWorkBeat beat={livingWork} />
      <InvitationV2 />
      <WayForwardV2 />
    </PageTransition>
  );
}
