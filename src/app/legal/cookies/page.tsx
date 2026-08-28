import type { Metadata } from "next";
import { LegalStub } from "@/components/layout/LegalStub";

export const metadata: Metadata = { title: "Cookie Settings" };

/**
 * Cookie Settings — the route D4 created.
 *
 * The footer has linked `/legal/cookies` on every page since the legal row was
 * written, with nothing behind it. D4 (Final, 26 Aug) settles the label and the
 * route; the content is still held under R9.
 *
 * ⚠ "Cookie **Settings**" implies a consent preferences dialog rather than a
 * policy page. Those are different things and both may be wanted. The wording
 * cannot be finalised until the analytics setup is, so this stays a stub.
 */
export default function CookiesPage() {
  return (
    <LegalStub
      title="Cookie Settings"
      note="Blocked on the analytics setup: the wording has to describe the cookies actually set, and GA4 is not configured yet. Note the label implies a consent preferences dialog rather than a policy page — build documentation calls for a cookie/consent notice, the sitemap calls for a Cookie Policy, and both may be wanted. Needs legal review alongside the Privacy Policy."
    />
  );
}
