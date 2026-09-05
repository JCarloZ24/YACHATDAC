import { RingArtwork, SeamGlyph } from "@/components/ui/Furniture";
import { LAST_UPDATED_HELD, SPECIMEN_BANNER } from "@/content/legal";
import type { LegalDoc } from "@/content/legal";

/**
 * The legal template — one component, three routes.
 *
 * Figma `09 · Legal — HI-FI · Desktop · the page holds` (3113:27146). Its §00
 * is a route index rather than a page, and it says the thing this file exists
 * for: **three pages share one template**. /legal/privacy, /legal/terms and
 * /legal/cookies differ only in their words, their motif and which side the
 * spiral sits on, so there is one layout here and three thin route files.
 *
 * ⚠ THE PAGE IS TYPE, AND THAT IS THE DESIGN. No photograph, no card, no
 * coloured ground. A legal document that is dressed like the rest of the site
 * reads as marketing; this one is meant to read as a document, and the only
 * decoration is the artist's spiral behind it at 10% and one motif at the
 * head. It is the one place on the site where the plain treatment is right.
 *
 * ⚠⚠ EVERYTHING BELOW THE BANNER IS SPECIMEN TEXT. See `src/content/legal.ts`
 * for the boundary that keeps it honest — generic prose is fine, anything that
 * would come from the client is bracketed and renders in oxide. The banner is
 * not decorative and must not be quietened: it is what stops a reader taking
 * this for YACHATDAC's actual policy. It stays until counsel supplies the real
 * documents, and then the whole body goes with it.
 *
 * ⚠ STATIC. No motion, no hover, no JavaScript — as the four hi-fi pages
 * before it.
 *
 * ⚠ NO ROUTE PATH ON THE CANVAS. The frame sets `/legal/privacy` in small caps
 * under each title. That is a note telling the team which frame maps to which
 * route, and the reader is already standing at that URL — it goes in the notes
 * lane, not on the page. See CLAUDE.md.
 */

/** Every body in the frame measures at x=100 of 1440 — the padding IS the column. */
const COLUMN = "w-full px-6 sm:px-10 lg:px-25";

export function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <div className="relative bg-canvas text-charcoal">
      {/* The spiral is roasted at 10% — the canvas convention, and the reason
          it can sit behind body copy at all. Clipped, because it is wider than
          the frame by design and nothing in this repo clamps overflow-x. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <RingArtwork
          piece={doc.ring.piece}
          tone="roasted"
          className={
            doc.ring.side === "right"
              ? "top-[7%] left-[69%] w-[51.25rem] opacity-10"
              : "-left-60 top-[26%] w-[43.75rem] opacity-10"
          }
        />
      </div>

      <div className={`${COLUMN} relative pt-32 pb-20 lg:pt-40 lg:pb-28`}>
        {/* The motif sits with the title, not in the margin: at 375 there is
            no margin to sit in, and a glyph pinned to the corner of a text
            page lands on the words. */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="eyebrow text-base leading-[1.3] tracking-[0.16em] text-oxide sm:text-2xl sm:tracking-[0.333em]">
              Legal
            </p>
            <h1 className="headline mt-5 max-w-[1000px] text-[3.5rem] leading-[1.1] tracking-[-0.014em] text-evergreen lg:text-7xl">
              {doc.title}
            </h1>
          </div>
          <SeamGlyph
            motif={doc.glyph}
            className="relative top-2 right-0 hidden w-14 shrink-0 lg:block"
          />
        </div>

        {/* ⟡ THE BANNER. Dashed, oxide, and the first thing under the title —
            a reader must meet it before any clause. It is a placeholder marker
            in the strict sense: it marks unreal content, which is what the
            whole document below it is. */}
        <div
          data-placeholder="specimen-copy"
          className="mt-10 rounded border-[1.5px] border-dashed border-oxide/45 bg-oxide/6 p-6 lg:mt-12 lg:p-8"
        >
          <p className="eyebrow text-[0.8125rem] leading-[1.4] tracking-[0.06em] text-oxide">
            {SPECIMEN_BANNER}
          </p>
          <p className="mt-4 max-w-[1180px] text-[0.9375rem] leading-[1.5] text-evergreen/85">
            {doc.note}
          </p>
        </div>

        {/* Two columns of three from lg — the frame's 570px measures at a
            100px gutter. One column below that: at 640 a two-up would give
            each clause 260px, and "Accessing your information, and complaints"
            is a heading that needs a line to itself. */}
        <dl className="mt-14 grid gap-x-25 gap-y-12 lg:mt-20 lg:grid-cols-2 lg:gap-y-16">
          {doc.clauses.map((clause) => (
            <div key={clause.number} className="max-w-[570px]">
              <dt className="eyebrow text-base leading-[1.4] tracking-[0.125em] text-evergreen">
                <span className="text-evergreen/55">{clause.number}</span>
                <span className="ml-4">{clause.title}</span>
              </dt>
              <dd className="mt-4 text-[0.9375rem] leading-[1.65] text-evergreen/82">
                {clause.body}
                {clause.held ? (
                  <>
                    {" "}
                    {/* The value nobody has yet. Oxide and bracketed, the same
                        mark `contact.ts` uses, and never filled in by
                        guessing. */}
                    <span
                      data-placeholder="legal-value"
                      className="font-medium text-oxide"
                    >
                      {clause.held}
                    </span>
                  </>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>

        <p className="eyebrow mt-16 text-xs leading-[1.5] tracking-[0.08em] text-oxide lg:mt-20">
          Last updated{" "}
          <span data-placeholder="legal-date">{LAST_UPDATED_HELD}</span>
        </p>
      </div>
    </div>
  );
}
