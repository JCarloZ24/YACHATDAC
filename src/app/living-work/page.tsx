import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";
import { pageSpecs } from "@/content/page-specs";
import { pillars } from "@/content/site";

const pillar = pillars.find((p) => p.id === "living-work")!;

export const metadata: Metadata = { title: pillar.title };

export default function LivingWorkPage() {
  return (
    <PageStub
      eyebrow={pillar.subtitle}
      title={pillar.title}
      subtitle={pillar.subtitle}
      audience={pillar.audience}
      sections={pageSpecs["living-work"]}
    />
  );
}
