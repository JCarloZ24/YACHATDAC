import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";
import { pageSpecs } from "@/content/page-specs";
import { pillars } from "@/content/site";

const pillar = pillars.find((p) => p.id === "connect")!;

export const metadata: Metadata = { title: pillar.title };

export default function ConnectPage() {
  return (
    <PageStub
      eyebrow={pillar.subtitle}
      title={pillar.title}
      subtitle={pillar.subtitle}
      audience={pillar.audience}
      sections={pageSpecs.connect}
    />
  );
}
