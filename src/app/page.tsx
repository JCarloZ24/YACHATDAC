import { FooterGround } from "@/components/layout/FooterGround";
import { HomeHero } from "./_components/HomeHero";
import { ThreadLine } from "@/components/ui/ThreadLine";
import { beats } from "@/content/homepage";
import { HomeLoader } from "./_components/HomeLoader";
import { HomeMotion } from "./_components/Motion";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { PageTransition } from "@/components/transitions/PageTransition";

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
 * ⚠ The Invitation is no longer a section here (9 September 2026, user
 * direction). It moved inside the pinned hero and is rendered by HomeHero, so
 * it reads as the canvas scrolling on rather than as a document section
 * handed the land in a gradient. Look for it there, not in this list.
 *
 * ⚠ The pathways render again (9 September 2026, user direction), as the last
 * panel ON the canvas — HomeHero, not this file. `/partnerships` has a
 * homepage entry point once more; the newsletter signup still does not exist
 * anywhere on the page. Every screen of this page above the footer is now a
 * panel on the pinned hero.
 *
 * ⚠ The Way Forward is now a statement panel, and it followed The Invitation
 * onto the hero canvas the same day. Both are rendered by HomeHero; what is
 * left here is the hero and the footer ground. On 12 September 2026 the
 * static beats moved into HomeHero so slow/failed canvas startup preserves
 * their reading order before the closing panels (SCR-09). Its pathways
 * and signup went with the old section — see the note in
 * WayForwardStatement.tsx before assuming they moved somewhere.
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
    /* The blink, like every other route (11 September 2026). The homepage had
       no PageTransition at all, so leaving it was a hard cut into whatever the
       browser had already painted — the one navigation on the site that
       flashed. Charcoal is the hero's own ground (HomeHero's `bg-charcoal`),
       so the first frame under the lights is the colour the page opens on. */
    <PageTransition ground="#090e12">
      {/* SCR-09, 9 September 2026: match the other immersive pages' wheel inertia. */}
      <SmoothScroll />
      {/* The controller lifecycle every other route already had. Without it a
          client-side navigation to `/` arrived with its motion destroyed by the
          outgoing page — see Motion.tsx, which carries the measurements. */}
      <HomeMotion />
      <HomeLoader />
      <ThreadLine />
      <HomeHero beat={hero} wonder={rest[0]} truth={rest[1]} belonging={rest[2]} />
      {/* Follows the statement panel's ground, not the retired evergreen one. */}
      <FooterGround color="var(--color-charcoal)" />
    </PageTransition>
  );
}
