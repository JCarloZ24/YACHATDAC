import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { isLight, toneInk, type Tone } from "@/lib/tone";

/**
 * A card pointing at an item in the record.
 *
 * Used by Wonder's "Stories from out here", Truth's cross-links and the
 * Resources browser, so the same item looks the same wherever it surfaces.
 *
 * ⚠ Every one of these currently points at an article that has not been
 * written. src/app/the-record/[slug]/page.tsx catches them: it renders the
 * item's own title and summary above a marked "not written yet" panel rather
 * than 404ing. That is deliberate — a dead link reads as a bug, and inventing
 * the article body would put words in the client's mouth.
 */
export function ArticleCard({
  title,
  summary,
  href,
  tag,
  meta,
  image,
  tone = "canvas",
}: {
  title: string;
  summary: string;
  href: string;
  /** Content tag — "#lore", "Story", "Historical account". */
  tag?: string;
  /** Secondary line — source, subject, date. */
  meta?: string;
  /** Art direction for the thumbnail slot, where the draft gives one. */
  image?: string;
  tone?: Tone;
}) {
  const ink = toneInk[tone];

  return (
    <Link
      href={href}
      className={`group flex h-full flex-col rounded-sm border p-6 transition-colors duration-(--dur-small) ease-quiet ${ink.border} hover:border-ochre focus-visible:border-ochre`}
    >
      {image ? (
        <div
          data-placeholder="image"
          className={`mb-6 flex aspect-4/3 items-end rounded-sm border border-dashed ${ink.border} ${
            isLight(tone) ? "bg-evergreen/5" : "bg-canvas/5"
          }`}
        >
          <p className={`p-3 text-xs leading-relaxed ${ink.muted}`}>{image}</p>
        </div>
      ) : null}

      {tag ? <Eyebrow className={ink.accent}>{tag}</Eyebrow> : null}

      <h3
        className={`headline text-xl leading-snug ${ink.heading} ${tag ? "mt-3" : ""}`}
      >
        {title}
      </h3>

      <p className={`mt-3 grow text-sm leading-relaxed ${ink.body}`}>
        {summary}
      </p>

      {meta ? (
        <p className={`mt-5 text-xs ${ink.muted}`}>{meta}</p>
      ) : null}

      <span
        className={`eyebrow mt-6 inline-flex items-center gap-2 ${ink.accent}`}
      >
        Read more
        <span
          aria-hidden
          className="transition-transform duration-(--dur-small) ease-quiet group-hover:translate-x-1"
        >
          &rarr;
        </span>
      </span>
    </Link>
  );
}
