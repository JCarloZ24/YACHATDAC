"use client";

import { useEffect, useRef } from "react";
import { register, start } from "@/lib/motion-controller";
import { createRecordLoader } from "@/lib/motion/record-loader";

/**
 * F7/F8, user direction 2026-09-08. Only the opening uses Three.js; defer its
 * bundle until the client needs motion. React supplies the actual canvas;
 * the server-rendered ground and headline form the static fallback.
 * The central controller owns the module; React owns this mount point.
 */
export function RecordPortalMotion({
  maskSrc,
  stoneSrc,
  stencilSrc,
}: {
  maskSrc: string | null;
  stoneSrc: string | null;
  stencilSrc: string | null;
}) {
  const mount = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = mount.current;
    const root = host?.closest<HTMLElement>("[data-record-portal]");
    if (!host || !root) return;
    root.dataset.portalState = "loading";
    root.dataset.portalProgress = "0";
    let disposed = false;
    let abandoned = false;
    let loading = false;
    let unregister: (() => void) | undefined;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cover = root.closest("[data-page-root]")?.querySelector<HTMLDivElement>("[data-record-loader]");
    const abort = () => {
      abandoned = true;
      unregister?.();
      unregister = undefined;
      root.dataset.portalState = "fallback";
    };
    root.addEventListener("record-portal-abort", abort);
    const unregisterLoader = cover ? register(createRecordLoader(cover, root)) : undefined;
    start();
    // A stalled request must cancel the scene before revealing the fallback;
    // otherwise a late WebGL mount could replace the page after dismissal.
    const timeout = window.setTimeout(() => {
      if (root.dataset.portalState !== "ready") abort();
    }, 20000);
    const monitor = new MutationObserver(() => {
      if (root.dataset.portalState === "ready" || root.dataset.portalState === "fallback") {
        window.clearTimeout(timeout);
      }
    });
    monitor.observe(root, { attributes: true, attributeFilter: ["data-portal-state"] });

    const activate = () => {
      if (disposed || abandoned || loading || unregister) return;
      if (preference.matches || !maskSrc || !stoneSrc) {
        root.dataset.portalState = "fallback";
        return;
      }
      loading = true;
      root.dataset.portalProgress = "5";
      void import("@/lib/motion/record-portal")
        .then(({ createRecordPortal, mountRecordPortal }) => {
          if (disposed || abandoned) return;
          unregister = mountRecordPortal(
            createRecordPortal(root, host, maskSrc, stoneSrc, stencilSrc),
          );
        })
        .catch(() => {
          // Chunk/network failure leaves the ground, words and native links.
          loading = false;
          if (!disposed) root.dataset.portalState = "fallback";
        });
    };
    preference.addEventListener("change", activate);
    activate();

    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      monitor.disconnect();
      root.removeEventListener("record-portal-abort", abort);
      preference.removeEventListener("change", activate);
      unregister?.();
      unregisterLoader?.();
    };
  }, [maskSrc, stoneSrc, stencilSrc]);

  return (
    <canvas ref={mount} className="record-portal-canvas" aria-hidden="true" />
  );
}
