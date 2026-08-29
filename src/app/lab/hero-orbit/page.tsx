import type { Metadata } from "next";
import Link from "next/link";
import { OrbitHero } from "@/components/v2/OrbitHero";
import { EnterNow } from "@/components/v2/EnterNow";
import { V2HomeMotion } from "@/components/v2/V2HomeMotion";
import { beats } from "@/content/lofi/homepage";

export const metadata: Metadata = { title: "Lab — T7 hero orbit" };

/**
 * T7 in isolation, for review against the Recall (/v2/home is P1;
 * /v2/home?hero=orbit is this same wheel in situ). Lab chrome only.
 */
export default function HeroOrbitLabPage() {
  const [heroBeat] = beats;

  return (
    <>
      <EnterNow />
      <V2HomeMotion variant="orbit" />
      <div className="px-6 py-4">
        <Link href="/lab" className="eyebrow text-xs text-canvas/60 hover:text-ochre">
          &larr; Lab index
        </Link>
      </div>
      <OrbitHero beat={heroBeat} />
      <div className="mx-auto max-w-3xl px-6 py-16 text-sm leading-relaxed text-canvas/60">
        <p>
          Sketch T7 — the artwork orbit (Danu lineage). Scroll turns the wheel
          and lends it velocity; it drifts on its own while on screen and stops
          the moment it leaves. Pointer tilt is capped at 2&deg; (T3&rsquo;s
          rule). ▲ Artwork slats await Leonard&rsquo;s sign-off — photography,
          era fields and type stand in (permissions.md, sign-off queue).
        </p>
      </div>
    </>
  );
}
