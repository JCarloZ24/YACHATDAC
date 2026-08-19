import type { SectionSpec } from "@/content/page-specs";

/**
 * Placeholder for a page that is specified but not yet designed or built.
 *
 * Current milestone is Lo-Fi Wireframes — these routes exist so the
 * information architecture is walkable and so nobody hits a 404 while
 * reviewing navigation. Each renders its own spec.
 *
 * Delete this component once the last pillar page is real.
 */
export function PageStub({
  eyebrow,
  title,
  subtitle,
  audience,
  sections,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  audience: string;
  sections: SectionSpec[];
}) {
  return (
    <div className="bg-evergreen">
      <div className="mx-auto max-w-4xl px-6 pt-36 pb-28 lg:px-16">
        <p className="eyebrow text-ochre">{eyebrow}</p>
        <h1 className="headline mt-5 text-5xl text-canvas sm:text-6xl">
          {title}
        </h1>
        <p className="mt-4 text-lg text-canvas/75">{subtitle}</p>
        <p className="mt-2 text-sm text-canvas/50">For: {audience}</p>

        <div className="mt-12 rounded-sm border border-ochre/40 bg-ochre/5 p-5">
          <p className="eyebrow text-ochre">Not built yet</p>
          <p className="mt-2 text-sm leading-relaxed text-canvas/70">
            This route exists so the site map is walkable. The outline below is
            the page specification, not the page.
          </p>
        </div>

        <ol className="mt-12 space-y-8">
          {sections.map((section, index) => (
            <li
              key={section.title}
              className="border-l border-canvas/20 pl-6"
            >
              <p className="eyebrow text-canvas/45">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="headline mt-2 text-xl text-canvas">
                {section.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-canvas/70">
                {section.intent}
              </p>
              {section.cta ? (
                <p className="mt-3 text-xs text-ochre">CTA: {section.cta}</p>
              ) : (
                <p className="mt-3 text-xs text-canvas/35">No CTA</p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
