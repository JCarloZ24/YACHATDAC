import { toneInk, type Tone } from "@/lib/tone";

export type Fact = {
  label: string;
  value: string;
};

/**
 * Short label/value pairs — Wonder's "Where / Getting here / How long /
 * Sleeping / Best months / Who comes", About's registration details.
 *
 * A description list, not a table: these are definitions of one subject, and
 * they have no row-and-column relationship to each other. Screen readers get
 * the pairing for free.
 *
 * `columns` caps the widest breakpoint. Below that it steps down on its own —
 * six facts on a phone are six rows, and forcing them into a grid to look
 * tidy is how "Best months / May to September" ends up on two lines.
 */
export function FactGrid({
  facts,
  tone = "canvas",
  columns = 3,
  className = "",
}: {
  facts: readonly Fact[];
  tone?: Tone;
  columns?: 2 | 3;
  className?: string;
}) {
  const ink = toneInk[tone];
  const columnClass = columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <dl className={`grid gap-x-8 gap-y-7 ${columnClass} ${className}`}>
      {facts.map((fact) => (
        <div key={fact.label} className={`border-t pt-4 ${ink.border}`}>
          <dt className={`eyebrow ${ink.accent}`}>{fact.label}</dt>
          <dd className={`mt-2 text-sm leading-relaxed ${ink.body}`}>
            {fact.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
