import { toneInk, type Tone } from "@/lib/tone";

/**
 * A quotation, set large.
 *
 * ⚠ Read this before editing any text passed to this component.
 *
 * Most of the quotations on this site are Suzanne Thompson's recorded words,
 * transcribed from the Unfinished Business and Yacadak Framework recordings.
 * The Truth page is tagged **held by community** and says so on its own face.
 * FNAN reviews the site and is the route to the client, but it is not the
 * owner of these words — that distinction is recorded in
 * docs/decisions-and-risks.md and it is the whole of risk R17.
 *
 * Two terminology change requests currently sit inside one of these blocks:
 * CR4 ("settlers" → "colonists") and CR10 (the word "our"). Both are **held**
 * pending D15, which decides whether a reviewer's correction may be applied to
 * a speaker's recorded speech at all. Do not apply either here. If a
 * terminology point needs making, make it in the narration around the quote —
 * that is the site's voice and ours to write.
 *
 * `attribution` renders visibly for a reason beyond credit: a display quote
 * with no name on it reads as house copy, which is how CR4 came to be raised
 * against Suzanne's words in the first place.
 */
export function PullQuote({
  children,
  attribution,
  role,
  tone = "canvas",
  className = "",
}: {
  children: string;
  attribution?: string;
  role?: string;
  tone?: Tone;
  className?: string;
}) {
  const ink = toneInk[tone];

  return (
    <figure className={`border-l-2 pl-6 sm:pl-8 ${ink.border} ${className}`}>
      <blockquote>
        <p className={`headline text-2xl leading-snug sm:text-3xl ${ink.heading}`}>
          &ldquo;{children}&rdquo;
        </p>
      </blockquote>

      {attribution ? (
        <figcaption className={`mt-5 text-sm ${ink.muted}`}>
          <span className={`eyebrow ${ink.accent}`}>{attribution}</span>
          {role ? <span className="mt-1 block italic">{role}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
