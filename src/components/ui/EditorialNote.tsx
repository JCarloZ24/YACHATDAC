import type { ReactNode } from "react";

/**
 * A bracketed note carried over from a draft document.
 *
 * The v3 drafts are full of these — `[ NEEDS CONFIRMATION ]`,
 * `[ For YACHATDAC to write ]`, `[ Status labels to be confirmed before
 * publishing ]`, `[ TENSE — keep this in the future tense ]`. They are
 * instructions to us, not copy for a visitor.
 *
 * There are two wrong ways to handle them and this is neither:
 *
 *   - Dropping them silently. The note is the only record that a paragraph is
 *     unconfirmed, and R14/R20 both exist because that record keeps getting
 *     lost between rounds.
 *   - Rendering them as if they were prose. A visitor cannot tell a drafting
 *     instruction from a sentence, and "Status labels to be confirmed" next to
 *     a carbon registration claim is worse than either alternative.
 *
 * So they render, visibly marked as not-for-publication, in the same house
 * style as the Welcome to Country and legal-page placeholders. Nothing on this
 * site is public yet; when it is, this component is the checklist of what has
 * to be resolved first. Grep for it before launch — the page will not ship
 * clean while any of these are still on it.
 */
export function EditorialNote({
  children,
  label = "Editorial note — not for publication",
  tone = "ochre",
  className = "",
}: {
  children: ReactNode;
  label?: string;
  /**
   * `canvas` is the Truth frames' held document slot (13 · ENTRY 1950s):
   * off-white dashed at 0.35 on a 0.05 wash, the label at Link/14 and 0.7 —
   * a quieter register on the dark grounds. Still a placeholder, still
   * data-placeholder — the pre-launch grep sees both tones.
   */
  tone?: "ochre" | "canvas" | "ink";
  className?: string;
}) {
  /**
   * `ink` — the note takes whatever colour its surroundings are already using,
   * through currentColor.
   *
   * The other two cuts each assume a ground: `canvas` is off-white and dies on
   * a light page, `ochre` measures 2.30:1 on off-white and is the live defect
   * ART-DIRECTION open question #14 already names. Truth needs neither,
   * because since the page went to one egg-white ground its notes sit on
   * charcoal type — and the 1950s note sits on a ground that MOVES from cream
   * to charcoal as it is read, so no fixed colour could have been right for it
   * at both ends. Inheriting is the only thing that travels.
   */
  if (tone === "ink") {
    return (
      <aside
        data-placeholder="editorial-note"
        className={`rounded-sm border border-dashed border-current/35 bg-current/5 p-5 ${className}`}
      >
        <p className="eyebrow text-current">{label}</p>
        <div className="mt-2 space-y-2 text-sm leading-relaxed text-current">
          {children}
        </div>
      </aside>
    );
  }
  if (tone === "canvas") {
    return (
      <aside
        data-placeholder="editorial-note"
        className={`rounded border border-dashed border-canvas/35 bg-canvas/5 p-6 text-sm leading-relaxed text-canvas/70 ${className}`}
      >
        <p>&#9671; {label}</p>
        <div className="space-y-2">{children}</div>
      </aside>
    );
  }
  return (
    <aside
      data-placeholder="editorial-note"
      className={`rounded-sm border border-dashed border-ochre/50 bg-ochre/5 p-5 ${className}`}
    >
      <p className="eyebrow text-ochre">{label}</p>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-ochre/85">
        {children}
      </div>
    </aside>
  );
}
