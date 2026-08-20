"use client";

import { useState } from "react";
import {
  LabControls,
  MotionPreviewNotice,
  SegmentedControl,
} from "./LabChrome";
import { DETAIL_OPTIONS, motionOptions } from "./labOptions";
import { ContourMapSection } from "./ContourMapSection";
import { useMotionPreview } from "./useMotionPreview";
import { type DetailLevel } from "@/lib/terrain/generic-field";

export function ContourMapLab() {
  const [detail, setDetail] = useState<DetailLevel>("balanced");
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
          legend="Motion"
          options={motionOptions(systemReduced)}
          value={preview}
          onChange={setPreview}
        />
      </LabControls>

      <ContourMapSection detail={detail} reduced={reduced} />
    </>
  );
}
