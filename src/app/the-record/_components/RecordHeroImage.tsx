"use client";

import Image from "next/image";
import { useState } from "react";

/** NAV-06 / frame grade, 11 September 2026: decoded pixels fade in, held still.
 * Next's onLoad runs after decoding, including a cached image on hydration.
 * A failed photo leaves the article's source-colour field and readable copy.
 */
export function RecordHeroImage({ src, width, height }: { src: string; width: number; height: number }) {
  const [ready, setReady] = useState(false);
  return (
    <>
      <Image src={src} alt="" width={width} height={height}
        data-record-hero-image data-ready={ready}
        sizes="100vw" loading="eager" fetchPriority="high"
        onLoad={() => setReady(true)} onError={() => setReady(false)}
        className="record-hero-image absolute inset-0 -z-20 h-full w-full object-cover object-[60%_center] lg:object-center" />
      <noscript><style>{".record-hero-image { opacity: 1; }"}</style></noscript>
    </>
  );
}
