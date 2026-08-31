"use client";

import { useRef, type ReactNode } from "react";

/**
 * The §04 ranger strip's drag surface. The server still owns the slots — this
 * wrapper only turns pointer drag into horizontal travel. The scrollbar is
 * hidden: drag IS the interface (touch keeps native swipe via overflow-x).
 */
export function RangerStrip({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0 });

  return (
    <ul
      ref={trackRef}
      className="flex cursor-grab touch-pan-y select-none gap-5 overflow-x-auto px-6 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] active:cursor-grabbing lg:px-16 [&::-webkit-scrollbar]:hidden"
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse" || !trackRef.current) return;
        drag.current = {
          active: true,
          startX: e.clientX,
          startScroll: trackRef.current.scrollLeft,
        };
        trackRef.current.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!drag.current.active || !trackRef.current) return;
        trackRef.current.scrollLeft =
          drag.current.startScroll - (e.clientX - drag.current.startX);
      }}
      onPointerUp={() => {
        drag.current.active = false;
      }}
      onPointerCancel={() => {
        drag.current.active = false;
      }}
    >
      {children}
    </ul>
  );
}
