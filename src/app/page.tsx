import { BeatSection } from "@/components/sections/BeatSection";
import { Hero } from "@/components/sections/Hero";
import { Invitation } from "@/components/sections/Invitation";
import { WayForward } from "@/components/sections/WayForward";
import { ThreadLine } from "@/components/ui/ThreadLine";
import { beats } from "@/content/homepage";

/**
 * Homepage — one continuous scroll through seven beats.
 *
 * Not a landing page with a grid of links, and not CMS-managed: the copy lives
 * in src/content/homepage.ts so it is versioned and reviewed like code. See
 * build documentation §3.
 *
 * Beats 1–5 offer no navigation at all. That restraint is the design.
 */
const [hero, ...rest] = beats;

export default function HomePage() {
  return (
    <>
      <ThreadLine />
      <Hero beat={hero} />
      {rest.map((beat) => (
        <BeatSection key={beat.id} beat={beat} />
      ))}
      <Invitation />
      <WayForward />
    </>
  );
}
