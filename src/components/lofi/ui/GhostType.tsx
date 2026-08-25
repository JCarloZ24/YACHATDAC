/**
 * Oversized background type — the pale letterforms sitting behind a section.
 *
 * NOT A NEW BEHAVIOUR. This is a type layer moving at the slowest of the four
 * parallax ratios (0.15), which the token set already fixes:
 *
 *   "0.15 / 0.4 / 0.7 / 1.0 — deliberately uneven. Evenly spaced ratios read
 *    as a slider; uneven ones read as landscape."
 *
 * The word is always copy that already exists on the beat — its eyebrow. This
 * layer never introduces text of its own, because text on this site is
 * source-traced and a decorative word would be copy nobody approved.
 *
 * aria-hidden: it is a duplicate of the eyebrow directly beside it, and
 * reading the same word twice is noise. Set at 0.06 alpha against the section
 * tone, so it reads as surface rather than as content competing with the
 * headline.
 */
export function GhostType({
  word,
  className = "",
}: {
  word: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      data-ghost
      data-parallax="0.15"
      className={`pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden ${className}`}
    >
      <span className="headline whitespace-nowrap text-[28vw] leading-none text-canvas/6 select-none">
        {word}
      </span>
    </div>
  );
}
