import type { Metadata } from "next";
import { EffectsGallery } from "@/components/lab/EffectsGallery";
import { LabHeader } from "@/components/lab/LabChrome";

export const metadata: Metadata = { title: "The motion vocabulary" };

/**
 * /lab/effects — every registered effect, running on the real kit.
 *
 * Unlike the other lab pages this one is not a single sketch under review. It
 * is the vocabulary itself, so it reads as a reference rather than as a
 * prototype: replay buttons instead of scroll triggers, and the kit inventory
 * underneath.
 */
export default function EffectsLabPage() {
  return (
    <>
      <LabHeader
        sketch="—"
        title="The motion vocabulary"
        standfirst="Every effect in docs/motion/motion-grammar.md, registered with gsap.registerEffect() and running on the real artwork and photography. The name on each panel is the name in the code and in the grammar table."
        status="Foundation · 30 Aug 2026 · the kit now lives in src/content/kit.ts"
      />
      <EffectsGallery />
    </>
  );
}
