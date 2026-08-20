"use client";

import { useState } from "react";
import {
  LabControls,
  MotionPreviewNotice,
  SegmentedControl,
  type SegmentedOption,
} from "./LabChrome";
import { DETAIL_OPTIONS, motionOptions } from "./labOptions";
import { TerrainDollySection } from "./TerrainDollySection";
import { useMotionPreview } from "./useMotionPreview";
import { type DetailLevel } from "@/lib/terrain/generic-field";

type Height = "flat" | "standard" | "dramatic";

/** Peak-to-trough height in world units, against a patch 5 units wide. */
const RELIEF: Record<Height, number> = {
  flat: 0.25,
  standard: 0.45,
  dramatic: 0.7,
};

const HEIGHT_OPTIONS: SegmentedOption<Height>[] = [
  {
    value: "flat",
    label: "Flat",
    hint: "Closest to the real profile of this country. Least dramatic, most honest.",
  },
  {
    value: "standard",
    label: "Standard",
    hint: "Ridges read clearly at a glance without overstating the landform.",
  },
  {
    value: "dramatic",
    label: "Dramatic",
    hint: "Overstates the relief. Worth seeing so we can decide against it deliberately.",
  },
];

export function TerrainDollyLab() {
  const [detail, setDetail] = useState<DetailLevel>("balanced");
  const [height, setHeight] = useState<Height>("standard");
  const { preview, setPreview, systemReduced, reduced } = useMotionPreview();

  return (
    <>
      <MotionPreviewNotice
        systemReduced={systemReduced}
        forced={preview !== "system"}
      />

      <LabControls>
        <SegmentedControl
          legend="Detail"
          options={DETAIL_OPTIONS}
          value={detail}
          onChange={setDetail}
        />
        <SegmentedControl
          legend="Vertical exaggeration"
          options={HEIGHT_OPTIONS}
          value={height}
          onChange={setHeight}
        />
        <SegmentedControl
          legend="Motion"
          options={motionOptions(systemReduced)}
          value={preview}
          onChange={setPreview}
        />
      </LabControls>

      <TerrainDollySection
        detail={detail}
        relief={RELIEF[height]}
        reduced={reduced}
      />
    </>
  );
}
