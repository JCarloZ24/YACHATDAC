import { BANNER_CONTENT_TYPE, BANNER_SIZE, renderBanner, type Ground } from "@/lib/og/banner";
import { extraArticleSlugs, recordItems, type RecordSource } from "@/content/the-record";

/**
 * Link-preview banner per article — see src/lib/og/banner.tsx. The ground
 * follows the article hero's D21 source colour (page.tsx HERO_GROUND) so a
 * shared Mitchell entry and a shared Iningai account look as different in a
 * chat as they do on the page.
 */
export const alt = "An article from The Record";
export const size = BANNER_SIZE;
export const contentType = BANNER_CONTENT_TYPE;

const SOURCE_GROUND: Record<RecordSource, Ground> = {
  "Iningai knowledge": "evergreen",
  "Colonial record": "roasted",
  "Published research": "midnight",
};

export function generateStaticParams() {
  return [...recordItems, ...extraArticleSlugs].map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = recordItems.find((a) => a.slug === slug);
  const article = item ?? extraArticleSlugs.find((a) => a.slug === slug);

  return renderBanner({
    eyebrow: item ? `The Record · ${item.source}` : "The Record",
    title: article?.title ?? "The Record",
    standfirst: article?.summary,
    ground: item ? SOURCE_GROUND[item.source] : "charcoal",
    // The section path, not the slug: a 60-character URL breaks mid-word on
    // the card, and the title already names the article.
    path: "/the-record",
  });
}
