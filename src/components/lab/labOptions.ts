import type { SegmentedOption } from "./LabChrome";
import type { MotionPreview } from "./useMotionPreview";
import {
  DETAIL_ORDER,
  DETAIL_PRESETS,
  type DetailLevel,
} from "@/lib/terrain/generic-field";

/**
 * Options shared by both prototype pages.
 *
 * Detail means the same thing on D4 and E1 on purpose — it is one decision,
 * asked once, and the answer applies to both components.
 */

export const DETAIL_OPTIONS: SegmentedOption<DetailLevel>[] = DETAIL_ORDER.map(
  (id) => ({
    value: id,
    label: DETAIL_PRESETS[id].label,
    hint: `${DETAIL_PRESETS[id].reads} · With real data: ${DETAIL_PRESETS[id].gdalEquivalent}`,
  }),
);

export function motionOptions(
  systemReduced: boolean,
): SegmentedOption<MotionPreview>[] {
  return [
    {
      value: "system",
      label: "System",
      hint: systemReduced
        ? "Your system asks for reduced motion, so this is the cut version. This is what the real site does."
        : "Your system allows motion, so this is the animated version. This is what the real site does.",
    },
    {
      value: "motion",
      label: "Animated",
      hint: "Forces the animated branch for preview, whatever the system says. Prototype only.",
    },
    {
      value: "reduced",
      label: "Reduced",
      hint: "Forces the cut branch, so the accessible version can be reviewed on any machine. Prototype only.",
    },
  ];
}
