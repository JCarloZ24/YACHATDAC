import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Band } from "@/components/layout/Band";
import { PageHero } from "@/components/layout/PageHero";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { CtaLink } from "@/components/ui/CtaLink";
import { EditorialNote } from "@/components/ui/EditorialNote";
import { Reveal } from "@/components/ui/Reveal";
import {
  extraArticleSlugs,
  recordItems,
  type RecordItem,
} from "@/content/the-record";

/**
 * A single item in the record.
 *
 * ⚠ NONE OF THESE ARTICLES HAVE BEEN WRITTEN. This route exists because the
 * drafts link to them heavily — Truth alone points at seven — and there are
 * only three ways to handle a link to an unwritten article:
 *
 *   1. Let it 404. Reads as a broken site during review and tells the reader
 *      nothing.
 *   2. Write the article. That is putting words in the client's mouth about
 *      massacres, a buyback and a rock art site. Not ours to do.
 *   3. Resolve to the item's own index entry — its real title, summary and
 *      subjects, which the client did write — above a marked panel saying the
 *      body does not exist yet.
 *
 * This is 3. When an article is written, replace the panel with its body and
 * delete nothing else.
 *
 * Slugs come from src/content/the-record.ts, plus `extraArticleSlugs` for
 * routes the drafts link to that are not items in the record index.
 */

type ArticleStub = Pick<RecordItem, "slug" | "title" | "summary"> &
  Partial<Pick<RecordItem, "type" | "source" | "subjects">>;

const articles: readonly ArticleStub[] = [
  ...recordItems,
  ...extraArticleSlugs,
];

function findArticle(slug: string): ArticleStub | undefined {
  return articles.find((article) => article.slug === slug);
}

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) return { title: "The Record" };

  return { title: article.title, description: article.summary };
}

export default async function RecordArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = findArticle(slug);

  // A slug nobody links to really is a 404. Only the known set resolves.
  if (!article) notFound();

  const related = recordItems
    .filter(
      (item) =>
        item.slug !== article.slug &&
        article.subjects?.some((subject) => item.subjects.includes(subject)),
    )
    .slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={article.type ? `The Record · ${article.type}` : "The Record"}
        title={article.title}
        standfirst={article.summary}
        tone="charcoal"
      >
        {article.source || article.subjects?.length ? (
          <p className="eyebrow text-canvas/50">
            {[article.source, ...(article.subjects ?? [])]
              .filter(Boolean)
              .join(" · ")}
          </p>
        ) : null}
      </PageHero>

      <Band tone="canvas">
        <div className="max-w-2xl">
          <EditorialNote label="Not written yet">
            <p>
              This item is in the record&rsquo;s index — its title, summary and
              subjects are the client&rsquo;s — but the article itself has not
              been written.
            </p>
            <p>
              It is linked from elsewhere on the site, so the route resolves
              here rather than 404ing. Replace this panel with the article when
              it is written; nothing else on the page needs to change.
            </p>
          </EditorialNote>

          <div className="mt-10">
            <CtaLink href="/the-record" tone="canvas">
              Back to the record
            </CtaLink>
          </div>
        </div>

        {related.length > 0 ? (
          <div className="mt-20">
            <h2 className="eyebrow text-oxide">Related in the record</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal key={item.slug} index={index}>
                  <ArticleCard
                    title={item.title}
                    summary={item.summary}
                    href={`/the-record/${item.slug}`}
                    tag={item.type}
                    meta={item.source}
                    tone="canvas"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        ) : null}
      </Band>
    </>
  );
}
