import type { Metadata } from "next";
import { LegalStub } from "@/components/layout/LegalStub";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalStub
      title="Privacy Policy"
      note="Required before any form collects personal data — newsletter, donations, merch orders and enquiry forms all trigger this. Must reflect Australian Privacy Act obligations, and must cover the GA4 tracking cookies. Needs legal review, not just internal drafting."
    />
  );
}
