import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * The Invitation card — bordered card, tag label + short title + short
 * description (build doc §5). The first navigational choice the homepage
 * offers, so it has to feel like an opening, not a menu.
 *
 * The draft leads each card with the descriptive phrase as an eyebrow and the
 * pillar name as the title — "Guesting on Country" above "Wonder".
 */
export function PathCard({
  eyebrow,
  title,
  description,
  cta,
  href,
}: {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col justify-between gap-8 rounded-sm border border-canvas/25 p-7 transition-colors duration-(--dur-small) ease-quiet hover:border-ochre focus-visible:border-ochre"
    >
      <div className="space-y-3">
        <Eyebrow className="text-canvas/60">{eyebrow}</Eyebrow>
        <h3 className="headline text-2xl text-ochre">{title}</h3>
        <p className="text-sm leading-relaxed text-canvas/75">{description}</p>
      </div>
      <span className="eyebrow text-canvas transition-transform duration-(--dur-small) ease-quiet group-hover:translate-x-1">
        {cta} &rarr;
      </span>
    </Link>
  );
}
