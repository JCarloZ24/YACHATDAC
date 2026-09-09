import { FooterGround } from "@/components/layout/FooterGround";
import { BeatSection } from "@/components/sections/BeatSection";
import { HomeHero } from "./_components/HomeHero";
import { Invitation } from "@/components/sections/Invitation";
import { WayForward } from "@/components/sections/WayForward";
import { ThreadLine } from "@/components/ui/ThreadLine";
import { beats } from "@/content/homepage";
import { HomeLoader } from "./_components/HomeLoader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

/**
 * Homepage — one continuous scroll.
 *
 * Not a landing page with a grid of links, and not CMS-managed yet: the copy
 * lives in src/content/homepage.ts so it is versioned and reviewed like code.
 * See build documentation §3 and decision D12.
 *
 * ⚠ SIX sections in v3, not seven. Hero, three beats, the Invitation, the Way
 * Forward. The standalone Living Work beat is gone and survives as an
 * Invitation card.
 *
 * ⚠ The v2 restraint — "beats 1–5 offer no navigation at all" — no longer
 * holds. v3 gives Wonder, Truth and Belonging a link each, so the first
 * navigation now arrives three sections earlier than the Invitation. That is
 * the drafts' call under D5 and it renders, but it changes what the Invitation
 * is for and is worth putting to the wireframe review rather than absorbing
 * silently.
 */
const [hero, ...rest] = beats;

export default function HomePage() {
  return (
    <>
      {/* SCR-09, 9 September 2026: match the other immersive pages' wheel inertia. */}
      <SmoothScroll />
      <HomeLoader />
      <ThreadLine />
      <HomeHero beat={hero} wonder={rest[0]} truth={rest[1]} belonging={rest[2]} />
      {rest.map((beat) => (
        <BeatSection key={beat.id} beat={beat} />
      ))}
      <Invitation />
      <WayForward />
      <FooterGround color="var(--color-evergreen)" />
    </>
  );
}
