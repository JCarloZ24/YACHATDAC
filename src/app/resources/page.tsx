import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";
import { pageSpecs } from "@/content/page-specs";
import { resourcesHub } from "@/content/site";

export const metadata: Metadata = { title: resourcesHub.title };

export default function ResourcesPage() {
  return (
    <PageStub
      eyebrow="Explore"
      title={resourcesHub.title}
      subtitle="Everything, filterable — stories, research, publications, events, updates."
      audience="All site visitors"
      sections={pageSpecs.resources}
    />
  );
}
