import Link from "next/link";
import { toneInk, type Tone } from "@/lib/tone";

/**
 * The arrow link the drafts use everywhere — "Read the findings →",
 * "Partner with us →", "Explore our discoveries →".
 *
 * Text and an arrow, no button chrome. The brand is grounded; a filled button
 * every time someone is invited somewhere would make the pages read like a
 * funnel, which is the thing build documentation §4 keeps warning about.
 *
 * The arrow is inside the link text rather than a pseudo-element so it is
 * carried into copy-paste and read out in sequence by a screen reader.
 */
export function CtaLink({
  href,
  children,
  tone = "canvas",
  className = "",
}: {
  href: string;
  children: string;
  tone?: Tone;
  className?: string;
}) {
  const ink = toneInk[tone];

  return (
    <Link
      href={href}
      className={`group eyebrow inline-flex items-center gap-2 ${ink.accent} transition-colors duration-(--dur-small) ease-quiet hover:underline ${className}`}
    >
      {children}
      <span
        aria-hidden
        className="transition-transform duration-(--dur-small) ease-quiet group-hover:translate-x-1"
      >
        &rarr;
      </span>
    </Link>
  );
}
