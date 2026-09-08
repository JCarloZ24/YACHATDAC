"use client";

import { useEffect, useRef } from "react";

/**
 * F7/F8, user direction 2026-09-08. Only the opening uses Three.js; defer its
 * bundle until the client needs motion. React supplies the actual canvas;
 * the server-rendered ground and headline form the static fallback.
 * The central controller owns the module; React owns this mount point.
 */
export function RecordPortalMotion({
  maskSrc,
  stoneSrc,
}: {
  maskSrc: string | null;
  stoneSrc: string | null;
}) {
  const mount = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = mount.current;
    const root = host?.closest<HTMLElement>("[data-record-portal]");
    if (!host || !root || !maskSrc || !stoneSrc) return;
    let disposed = false;
    let loading = false;
    let unregister: (() => void) | undefined;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");

    const activate = () => {
      if (disposed || loading || unregister || preference.matches) return;
      loading = true;
      void import("@/lib/motion/record-portal")
        .then(({ createRecordPortal, mountRecordPortal }) => {
          if (disposed) return;
          unregister = mountRecordPortal(
            createRecordPortal(root, host, maskSrc, stoneSrc),
          );
        })
        .catch(() => {
          // Chunk/network failure leaves the ground, words and native links.
          loading = false;
        });
    };
    preference.addEventListener("change", activate);
    activate();

    return () => {
      disposed = true;
      preference.removeEventListener("change", activate);
      unregister?.();
    };
  }, [maskSrc, stoneSrc]);

  return (
    <canvas ref={mount} className="record-portal-canvas" aria-hidden="true" />
  );
}
