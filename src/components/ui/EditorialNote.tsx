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
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <aside
      data-placeholder="editorial-note"
      className="rounded-sm border border-dashed border-ochre/50 bg-ochre/5 p-5"
    >
      <p className="eyebrow text-ochre">{label}</p>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-ochre/85">
        {children}
      </div>
    </aside>
  );
}
