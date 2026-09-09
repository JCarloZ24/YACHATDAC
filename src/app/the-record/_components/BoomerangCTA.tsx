"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { register, start } from "@/lib/motion-controller";
import { recordBoomerangCopy } from "@/content/the-record";

/** INT-04, 2026-09-09: generated Three.js closing object; existing CTA copy. */
export function BoomerangCTA({ href, label }: { href: string; label: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    let disposed = false, loaded = false;
    let unregister: (() => void) | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || loaded) return;
      loaded = true;
      void import("@/lib/motion/record-boomerang").then(({ createRecordBoomerang }) => {
        if (disposed) return;
        unregister = register(createRecordBoomerang(el, () => setReady(true)));
        start();
      }).catch(() => { /* The contribution link remains available without WebGL. */ });
    }, { rootMargin: "400px" });
    observer.observe(el);
    return () => { disposed = true; observer.disconnect(); unregister?.(); };
  }, []);
  return (
    <div className="relative min-w-0 text-center">
      <canvas ref={canvas} tabIndex={0} role="img" aria-label={recordBoomerangCopy.label}
        className={`mx-auto h-[42svh] min-h-72 max-h-[440px] w-full cursor-grab touch-pan-y active:cursor-grabbing ${ready ? "opacity-100" : "opacity-0"}`} />
      {ready ? <p className="eyebrow mt-3 text-xs tracking-[0.08em] text-canvas/55">{recordBoomerangCopy.hint}</p> : null}
      <Link href={href} className="headline mx-auto mt-6 block max-w-xl text-h3 leading-[1.12] underline decoration-2 underline-offset-8">{label}</Link>
    </div>
  );
}
