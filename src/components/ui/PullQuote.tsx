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
 * Two terminology change requests sit inside one of these blocks: CR4
 * ("settlers" → "colonists") and CR10 (the word "our").
 *
 * ⚠ CORRECTED 10 September 2026 — this comment said both were held pending
 * D15. CR4 was in fact APPLIED to Suzanne's quotation on 7 Sep, on August's
 * instruction, while D15 was still open. See the ⚠⚠ block on `quotes` in
 * src/content/truth.ts, which carries her words as spoken and the record of
 * the change. CR10 is genuinely still unapplied. Do not apply either here; if
 * a terminology point needs making, make it in the narration around the quote
 * — that is the site's voice and ours to write.
 *
 * `attribution` renders visibly for a reason beyond credit: a quote with no
 * name on it reads as house copy, which is how CR4 came to be raised against
 * Suzanne's words in the first place.
 */
export function PullQuote({
  children,
  attribution,
  role,
  tone = "canvas",
  voice = false,
  className = "",
}: {
  children: string;
  attribution?: string;
  role?: string;
  tone?: Tone;
  /**
   * Set the quotation in the READING face rather than the display one.
   *
   * The default here is Block Berthold, which is the right call for a pulled
   * line lifted out of an article to advertise it. It is the wrong one for a
   * transcript. The type system reserves that face for display headings, page
   * titles and big figures; a recorded quotation is none of those, and setting
   * a person's speech in the same face as the section titles around it is a
   * large part of why a bare quote "reads as our copy — it isn't" (Steve, 7
   * September 2026). Truth's testimony passes `voice`; the marketing pulls on
   * /about and Our People keep the default, so their look does not move.
   */
  voice?: boolean;
  className?: string;
}) {
  const ink = toneInk[tone];

  return (
    <figure className={`border-l-2 pl-6 sm:pl-8 ${ink.border} ${className}`}>
      <blockquote>
        {/* Literal class strings, not assembled — Tailwind reads source text
            and cannot see a utility built at runtime. */}
        <p
          className={
            voice
              ? `text-lead leading-relaxed ${ink.heading}`
              : `headline text-2xl leading-snug sm:text-3xl ${ink.heading}`
          }
        >
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
