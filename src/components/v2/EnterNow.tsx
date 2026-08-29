"use client";

import { useEffect } from "react";
import { markEntered } from "@/lib/site-entry";

/**
 * Opens the entry gate immediately, for pages with no Preloader — without
 * this, gate="entry" reveals on a directly-loaded page wait forever.
 * Idempotent; never mount it on a page that renders the Preloader.
 */
export function EnterNow() {
  useEffect(() => {
    markEntered();
  }, []);
  return null;
}
