import Link from "next/link";
import { org, pillars } from "@/content/site";

/**
 * Site header.
 *
 * ⚠ Logo: the real mark is a hand-lettered "YACHATDAC." wordmark in Oxide Red
 * with boomerang and dot-painting motifs. Build documentation §5 is explicit —
 * do NOT recreate or approximate it in code. The text below is a placeholder
 * standing in until the vector files (SVG/EPS) arrive from the brand team;
 * swap it for an <Image>/inline SVG then. See public/brand/README.md.
 */
export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-6 lg:px-16"
      >
        <Link
          href="/"
          className="headline text-xl tracking-tight text-canvas"
          data-placeholder="logo"
        >
          {org.name}
          <span className="text-oxide">.</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {pillars.map((pillar) => (
            <li key={pillar.id}>
              <Link
                href={pillar.href}
                className="eyebrow text-canvas/80 transition-colors hover:text-ochre"
              >
                {pillar.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
