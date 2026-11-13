"use client";

import { useEffect, useRef, useState } from "react";
import { culturalAdvice } from "@/content/homepage";

/**
 * Site-wide cultural advice, shown as a pop-up on a reader's first visit.
 *
 * Site-wide review, comment GA9 (13 Nov 2026): "move the advice so it is a
 * pop-up on the main page … phrasing similar to the ABC TV". It replaces the
 * /our-people loading-cover advice (15 Sep 2026). Wording, scope and how often
 * it shows are provisional — the questions went back to the team the same day.
 *
 * No motion: it is a notice the reader must read in stillness, like testimony.
 * Dismissal is remembered per browser; storage failures just mean it shows
 * again, never that it is skipped.
 */
const KEY = "yachatdac:cultural-advice-seen";

export function CulturalAdviceNotice() {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.localStorage.getItem(KEY) === "1";
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- storage is client-only
    if (!seen) setOpen(true);
  }, []);

  useEffect(() => {
    if (open) button.current?.focus();
  }, [open]);

  if (!open) return null;

  const close = () => {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {}
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cultural-advice-title"
      aria-describedby="cultural-advice-body"
      onKeyDown={(e) => {
        if (e.key === "Escape") close();
      }}
      className="fixed inset-0 z-200 flex items-center justify-center bg-charcoal/80 px-5"
    >
      <div className="w-full max-w-lg rounded-xs bg-charcoal p-8 text-center text-canvas sm:p-10">
        <h2 id="cultural-advice-title" className="eyebrow text-gold">
          Cultural advice
        </h2>
        <p id="cultural-advice-body" className="mt-6 text-base leading-relaxed sm:text-lg">
          {culturalAdvice}
        </p>
        <button
          ref={button}
          type="button"
          onClick={close}
          className="eyebrow mt-8 rounded-xs bg-gold px-6 py-3 text-sm text-charcoal"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
