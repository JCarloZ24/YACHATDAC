import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Band } from "@/components/layout/Band";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { CtaLink } from "@/components/ui/CtaLink";
import { EditorialNote } from "@/components/ui/EditorialNote";
import { ClusterArtwork } from "@/components/ui/Furniture";
import { RecordHeroImage } from "../_components/RecordHeroImage";
import { recordArticles, recordArticleCopy, type RecordArticleBlock } from "@/content/record-articles";
import { recordArticleMedia, recordArticleHeroMedia } from "@/content/record-media";
import {
  extraArticleSlugs,
  recordItems,
  type RecordItem,
  type RecordSource,
} from "@/content/the-record";

/**
 * A single item in the record.
 *
 * User revisions, 2026-09-11 (D5/F8): eleven supplied articles replace their
 * stubs. Structured copy preserves headings, testimony, law passages, source
 * notes and image positions. Testimony and images are read in stillness.
 * Missing bodies retain explicit stubs; missing assets retain tonal fields.
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

/** D21 source colours, matching the catalogue in the user's 2026-09-11 reference. */
const HERO_GROUND: Record<RecordSource, { className: string; colour: string }> = {
  "Iningai knowledge": { className: "bg-evergreen", colour: "var(--color-evergreen)" },
  "Colonial record": { className: "bg-roasted", colour: "var(--color-roasted)" },
  "Published research": { className: "bg-midnight", colour: "var(--color-midnight)" },
};

function findArticle(slug: string): ArticleStub | undefined {
  return articles.find((article) => article.slug === slug);
}

function ArticleBlock({ block }: { block: RecordArticleBlock }) {
  if (block.kind === "image") {
    const media = recordArticleMedia[block.mediaId];
    if (!media) return null;
    return (
      <figure className="my-12" data-motion-grade={media.motionGrade}>
        {media.src ? (
          <Image src={media.src} alt={media.alt} width={media.width} height={media.height}
            sizes="(min-width: 1024px) 768px, calc(100vw - 48px)"
            className="h-auto w-full rounded-sm" />
        ) : (
          <div data-placeholder="article-image" className="flex aspect-[3/2] items-center justify-center bg-evergreen/10 p-8 text-center text-base text-charcoal/70">
            [ Image — {media.alt} ]
          </div>
        )}
        {block.caption ? <figcaption className="mt-4 text-sm leading-[1.6] text-charcoal/70">{block.caption}</figcaption> : null}
      </figure>
    );
  }
  switch (block.kind) {
    case "heading":
      return <h2 className="headline mt-12 mb-5 text-h3 leading-[1.15] text-evergreen">{block.text}</h2>;
    case "label":
      return <h2 className="eyebrow mt-12 mb-4 text-base leading-[1.5] text-oxide">{block.text}</h2>;
    case "quote":
      return <blockquote className="my-8 border-l-2 border-oxide pl-6 text-lg leading-[1.8] lg:text-xl"><p>{block.text}</p></blockquote>;
    case "law":
      return <p className="my-6 border-l-2 border-ochre pl-6 text-lg leading-[1.8]">{block.text}</p>;
    case "pullquote":
      return <p className="my-10 border-l-2 border-oxide pl-6 text-xl leading-[1.6] font-semibold lg:text-2xl">{block.text}</p>;
    case "emphasis":
      return <p className="my-6 text-lg leading-[1.8] font-semibold">{block.text}</p>;
    case "note":
      return <p className="my-8 text-base leading-[1.8] italic text-charcoal/75">{block.text}</p>;
    default:
      return <p className="my-6 text-lg leading-[1.8]">{block.text}</p>;
  }
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
  const body = recordArticles[slug];
  const heroMedia = recordArticleHeroMedia[slug];
  const heroGround = HERO_GROUND[article.source ?? "Iningai knowledge"];

  const related = recordItems
    .filter(
      (item) =>
        item.slug !== article.slug &&
        article.subjects?.some((subject) => item.subjects.includes(subject)),
    )
    .slice(0, 3);

  return (
    <>
      {/* Screenshot follow-up, 2026-09-11 (D5/F8): shared height across all
          articles, individual catalogue images and D21 source colours. These
          minimums fit the supplied copy at 375/1440; longer CMS copy or larger
          user text can still grow the section instead of clipping it. */}
        <section data-nav-hero data-record-article-hero data-motion-grade="frame"
          className={`relative isolate overflow-hidden text-canvas ${heroGround.className}`}>
          {heroMedia?.src ? <>
          <RecordHeroImage key={heroMedia.src} src={heroMedia.src} width={heroMedia.width} height={heroMedia.height} />
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-charcoal/30"
            style={{ backgroundImage: `linear-gradient(180deg, color-mix(in srgb, var(--color-charcoal) 55%, transparent) 0%, color-mix(in srgb, ${heroGround.colour} 35%, transparent) 28%, color-mix(in srgb, ${heroGround.colour} 92%, transparent) 62%, ${heroGround.colour} 100%)` }} />
          </> : <div aria-hidden data-placeholder="media-field" className="absolute inset-x-0 top-0 -z-10 h-1/2 bg-canvas/6" />}
          <div className="relative mx-auto flex min-h-[640px] max-w-7xl flex-col justify-end px-6 pt-40 pb-8 lg:min-h-[560px] lg:px-16 lg:pt-32 lg:pb-10">
            <ClusterArtwork tone="gold" className="top-24 right-6 w-12 lg:top-28 lg:right-16 lg:w-16" />
            <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-2 text-sm leading-[1.5] tracking-[0.08em] text-gold">
              {article.type ? <span className="rounded-sm bg-gold px-2 py-0.5 text-charcoal">{article.type}</span> : null}
              {article.source ? <span>{article.type ? "· " : ""}{article.source}</span> : null}
            </p>
            <h1 className="headline mt-4 max-w-4xl text-h1 leading-[1.1]">{body?.title ?? article.title}</h1>
            <p className="mt-6 max-w-2xl text-base leading-[1.7] text-canvas/90 lg:text-lg">{body?.standfirst ?? article.summary}</p>
            {article.subjects?.length ? <p className="eyebrow mt-5 max-w-2xl text-xs leading-[1.6] tracking-[0.08em] text-gold lg:mt-6">{article.subjects.join(" · ")}</p> : null}
          </div>
        </section>

      <Band tone="canvas">
        <div className="mx-auto max-w-3xl text-charcoal">
          {body ? (
            <article aria-label={body.title}>
              {body.blocks.map((block, index) => <ArticleBlock key={index} block={block} />)}
              {body.sources.length > 0 ? (
                <footer className="mt-14 border-t border-charcoal/20 pt-8">
                  <h2 className="eyebrow mb-4 text-sm leading-[1.5] text-oxide">{recordArticleCopy.sources}</h2>
                  {body.sources.map((source, index) => (
                    <p key={index} className="mt-3 text-sm leading-[1.8] wrap-anywhere text-charcoal/70">
                      {source.href ? <a href={source.href} className="underline underline-offset-4">{source.text}</a> : source.text}
                    </p>
                  ))}
                </footer>
              ) : null}
            </article>
          ) : (
            <EditorialNote label={recordArticleCopy.pendingLabel}>
              <p>{recordArticleCopy.pendingBody}</p>
            </EditorialNote>
          )}

          <div className="mt-10">
            <CtaLink href="/the-record" tone="canvas">
              {recordArticleCopy.back}
            </CtaLink>
          </div>
        </div>

        {related.length > 0 ? (
          <div className="mt-20">
            <h2 className="eyebrow text-oxide">{recordArticleCopy.related}</h2>
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {related.map((item) => (
                  <ArticleCard
                    key={item.slug}
                    title={item.title}
                    summary={item.summary}
                    href={`/the-record/${item.slug}`}
                    tag={item.type}
                    meta={item.source}
                    tone="canvas"
                  />
              ))}
            </div>
          </div>
        ) : null}
      </Band>
    </>
  );
}
