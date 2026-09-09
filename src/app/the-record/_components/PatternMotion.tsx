"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { register, start } from "@/lib/motion-controller";
import { createRecordPatterns } from "@/lib/motion/record-patterns";

/** User direction 2026-09-09 / AMB-04. Controller owns motion and teardown. */
export function RecordPatternMotion({ children }: { children: ReactNode }) {
  const mount = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mount.current) return;
    const unregister = register(createRecordPatterns(mount.current));
    start();
    return unregister;
  }, []);
  return <div ref={mount} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">{children}</div>;
}
