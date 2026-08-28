import { MotionRoot } from "@/components/lofi/MotionRoot";
import { Preloader } from "@/components/lofi/Preloader";
import { FrameExpandBeat } from "@/components/lofi/FrameExpandBeat";
import { Hero } from "@/components/lofi/Hero";
import { Invitation } from "@/components/lofi/Invitation";
import { SkyClock } from "@/components/lofi/SkyClock";
import { WayForward } from "@/components/lofi/WayForward";
import { ThreadLine } from "@/components/ui/ThreadLine";
import { beats } from "@/content/lofi/homepage";

/**
 * Homepage — one continuous scroll through seven beats.
 *
 * Not a landing page with a grid of links, and not CMS-managed: the copy lives
 * in src/content/lofi/homepage.ts so it is versioned and reviewed like code. See
 * build documentation §3.
 *
 * Beats 1–5 offer no navigation at all. That restraint is the design.
 *
 * MOTION — the only Tier 1 page on the site (F4)
 * ----------------------------------------------
 *   ★ A2  beats 2–4 share one pinned screen, 250vh, sky ramping on the same
 *         clock as the beats cross-fade.
 *   ★ M2  beat 5's media frame opens while the image counter-scales.
 *
 * ⚠ TWO MORE ARE RUNNING AS FLAGGED EXCEPTIONS, PENDING DECISION D9.
 *   ✎ B2+L1+L2+L3  beat 6's grid converges out of a scatter.
 *   ✎ D1           beat 5's frame opens onto a dollying 3D scene.
 *
 * F4's budget is two and these make four. They are built so the shape can be
 * judged before Marc's hi-fi, not because the budget moved — D9 has not even
 * named who signs motion off yet. Every one of them is marked in the DOM with
 * `data-tier1-exception="D9"`, so:
 *
 *     grep -rn 'data-tier1-exception' src/
 *
 * finds all of them, and removing them is deleting two components rather than
 * unpicking motion from across the page. Do not quietly promote one by
 * deleting its flag.
 *
 * X1 (loader) and B5 (type that settles) are Group X and Group B plumbing, not
 * signature moments, and spend no budget.
 */
const [hero, wonder, truth, belonging, livingWork] = beats;

/** The three beats that share the A2 pin. Order is the narrative order. */
const skyBeats = [wonder, truth, belonging];

export default function HomePage() {
  return (
    <>
      <Preloader />
      <MotionRoot />
      <ThreadLine />
      <Hero beat={hero} />
      <SkyClock beats={skyBeats} />
      <FrameExpandBeat beat={livingWork} />
      <Invitation />
      <WayForward />
    </>
  );
}
