import type { Metadata } from "next";
import { FooterGround } from "@/components/layout/FooterGround";
import { LegalDocument } from "@/components/layout/LegalDocument";
import { legalDocBySlug } from "@/content/legal";

const doc = legalDocBySlug("privacy");

export const metadata: Metadata = {
  title: doc.metaTitle,
  /**
   * ⚠ NOINDEX WHILE THE TEXT IS SPECIMEN. Everything below the banner on this
   * page is generic template prose, not YACHATDAC's policy and not reviewed by
   * counsel. A search engine that indexes it will surface it, out of its
   * frame and without the banner, as this organisation's actual position.
   * Remove this block in the same commit that replaces the specimen text.
   */
  robots: { index: false, follow: true },
};

/**
 * Privacy Policy — /legal/privacy.
 *
 * Figma 3113:27146 §00 makes the rule explicit: three routes, one template.
 * The layout is `LegalDocument`, the words are `src/content/legal.ts`, and
 * this file exists to name one and hand it the other.
 *
 * ⚠ SPECIMEN COPY — REPLACE ENTIRELY. R9: this document and its two siblings
 * are what the whole site is waiting on. No form goes live until they are
 * real, which is why /connect draws its primary action and leaves it unfilled
 * and the signup field is inert.
 */
export default function PrivacyPage() {
  return (
    <>
      <LegalDocument doc={doc} />
      <FooterGround color="var(--color-canvas)" />
    </>
  );
}
