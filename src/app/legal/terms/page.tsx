import type { Metadata } from "next";
import { LegalStub } from "@/components/layout/LegalStub";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <LegalStub
      title="Terms of Use"
      note="Needed alongside the Privacy Policy once payments (Stripe), donations and email collection go live. Needs legal review before launch."
    />
  );
}
