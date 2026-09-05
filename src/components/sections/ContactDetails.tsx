import { contactDetails } from "@/content/contact";

/**
 * The six contact fields — the other half of "Get in touch".
 *
 * One block, two pages. Our People §06 (Figma 2841:25358) and About §09
 * (2653:19676) draw the same object: three across, two rows, label over value.
 * It was built on Our People first and copied to About, and the copy was 30 of
 * 33 lines identical — the same rendering logic and the same nine-line comment
 * about bracketing. That is the duplication `ContactDoors` was extracted to
 * avoid, so this followed it here.
 *
 * Under D5 both v1 drafts carry this block word for word, which is why the
 * data lives in `src/content/contact.ts` once. The markup should live once too:
 * if the bracketing rule below ever changes, it must change for both pages, and
 * two copies is how that quietly stops being true.
 *
 * ⚠ NOTHING HERE IS EVER A LINK. R9 and R15: every field is the drafter's own
 * square bracket, including the email address, which looks real and is not.
 * `contact.ts` models them as `pending` precisely so a UI cannot render one as
 * a live mailto: or tel: by accident — publishing an unverified address is
 * worse than publishing none, because mail goes somewhere nobody reads and the
 * sender believes they have made contact. Do not add an `href` here.
 */
export function ContactDetails({
  accent = "text-burnt",
  ink = "text-charcoal",
  width = "max-w-[360px]",
}: {
  /** Label colour, as a literal class. Burnt on canvas, ochre on charcoal. */
  accent?: string;
  /** Value colour for a CONFIRMED field. A pending one is always oxide. */
  ink?: string;
  /** The field column's cap — the two frames draw 360 and 390. */
  width?: string;
}) {
  return (
    <dl className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {contactDetails.map((detail) => (
        <div key={detail.label} className={width}>
          <dt className={`eyebrow text-xs tracking-[0.08em] ${accent}`}>
            {detail.label}
          </dt>
          {/* Bracketed and NOT a link while `pending`. The brackets are the
              drafter's own mark for "not confirmed", which is how both frames
              set these too.

              Two of the six carry no value at all — contact.ts writes them as
              the literal "To be confirmed", standing in for the draft's own
              `[ street address ]` and `[ number ]`. Bracketing that verbatim
              gives "[ To be confirmed ]", which says the same thing twice, so
              the marker carries it alone. */}
          <dd
            {...(detail.pending ? { "data-placeholder": "contact-field" } : {})}
            className={`mt-3 text-base leading-[1.5] ${
              detail.pending ? "text-oxide" : ink
            }`}
          >
            {detail.pending
              ? `[ ${
                  detail.value.toLowerCase() === "to be confirmed"
                    ? "to be confirmed"
                    : detail.value
                } ]`
              : detail.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
