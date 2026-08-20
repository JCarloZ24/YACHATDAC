"use client";

import { useCallback, useState } from "react";
import {
  LabControls,
  MotionPreviewNotice,
  SegmentedControl,
  type SegmentedOption,
} from "./LabChrome";
import { motionOptions } from "./labOptions";
import { SkyClockSection } from "./SkyClockSection";
import { SKY_PHASES } from "./skyPhases";
import { useMotionPreview } from "./useMotionPreview";
import type { SkyClockMode } from "@/lib/motion/sky-clock";

/**
 * The question this page exists to settle is which of the two clocks feels
 * right, so both are built and switchable rather than argued about.
 */
const MODE_OPTIONS: SegmentedOption<SkyClockMode>[] = [
  {
    value: "scrubbed",
    label: "Scrubbed",
    hint: "The sky moves continuously with the scroll. The visitor sets the pace, and there is no duration to tune. Closest to the sketch library's A2.",
  },
  {
    value: "phased",
    label: "Phased",
    hint: "The mockup's model: each beat snaps the clock to its own time and the sky eases there over 820ms.",
  },
];

export function SkyClockLab() {
  const [mode, setMode] = useState<SkyClockMode>("scrubbed");
  const { preview, setPreview, systemReduced, reduced } = useMotionPreview();
  const [phase, setPhase] = useState(0);

  // Stable, or the section's effect would tear down and rebuild the whole
  // clock on every phase change.
  const onPhase = useCallback((index: number) => setPhase(index), []);

  return (
    <>
      <MotionPreviewNotice
        systemReduced={systemReduced}
        forced={preview !== "system"}
      />

      <LabControls>
        <SegmentedControl
          legend="Clock"
          options={MODE_OPTIONS}
          value={mode}
          onChange={setMode}
        />
        <SegmentedControl
          legend="Motion"
          options={motionOptions(systemReduced)}
          value={preview}
          onChange={setPreview}
        />
        <div>
          <p className="eyebrow text-canvas/45">Now</p>
          <p className="mt-3 text-sm text-canvas">
            {SKY_PHASES[phase]?.label}
          </p>
        </div>
      </LabControls>

      <SkyClockSection mode={mode} reduced={reduced} onPhase={onPhase} />
    </>
  );
}
