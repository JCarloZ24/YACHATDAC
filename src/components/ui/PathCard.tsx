import Link from "next/link";

/**
 * The Invitation card — bordered card, tag label + short title + short
 * description (build doc §5). The first navigational choice the homepage
 * offers, so it has to feel like an opening, not a menu.
 */
export function PathCard({
  title,
  description,
  cta,
  href,
}: {
  title: string;
  description: string;
  cta: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col justify-between gap-8 rounded-sm border border-canvas/25 p-7 transition-colors duration-300 hover:border-ochre focus-visible:border-ochre"
    >
      <div className="space-y-3">
        <h3 className="headline text-2xl text-ochre">{title}</h3>
        <p className="text-sm leading-relaxed text-canvas/75">{description}</p>
      </div>
      <span className="eyebrow text-canvas transition-transform duration-300 group-hover:translate-x-1">
        {cta} &rarr;
      </span>
    </Link>
  );
}
