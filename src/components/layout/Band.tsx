import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { toneBg, toneInk, type Tone } from "@/lib/tone";

/**
 * A full-width content band.
 *
 * The interior pages are long — Living Work runs fourteen challenges, seven
 * work streams, six infrastructure blocks and five outputs — and the thing
 * that keeps a page that length readable is the ground changing under it. This
 * is the same "static foreground, moving background" idea the homepage beats
 * use, at a smaller amplitude: sections rather than viewports.
 *
 * `id` is not decorative. Half the anchors in src/content/site.ts and most of
 * the cross-links in the drafts point at section ids on these pages, so a band
 * that something links to must carry the id the link expects.
 */
export function Band({
  id,
  tone = "canvas",
  children,
  className = "",
}: {
  id?: string;
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`${toneBg[tone]} scroll-mt-20 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-16 lg:py-28">
        {children}
      </div>
    </section>
  );
}

/**
 * The heading block at the top of a band: eyebrow, title, and the one-line
 * lede the drafts almost always put underneath ("What the work is up against",
 * "The same activities, measured").
 *
 * Wrapped in Reveal at the same stagger indices the homepage uses, so a band
 * heading and a homepage beat heading enter identically. That consistency is
 * the reason the stagger step is a shared token rather than a per-section
 * choice.
 */
export function BandHeading({
  eyebrow,
  title,
  lede,
  tone = "canvas",
  className = "",
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  tone?: Tone;
  className?: string;
}) {
  const ink = toneInk[tone];

  return (
    <header className={`max-w-3xl ${className}`}>
      {eyebrow ? (
        <Reveal>
          <Eyebrow className={ink.accent}>{eyebrow}</Eyebrow>
        </Reveal>
      ) : null}

      <Reveal index={1}>
        <h2
          className={`headline text-3xl sm:text-4xl ${ink.heading} ${eyebrow ? "mt-5" : ""}`}
        >
          {title}
        </h2>
      </Reveal>

      {lede ? (
        <Reveal index={2}>
          <p className={`mt-5 text-base leading-relaxed ${ink.body}`}>{lede}</p>
        </Reveal>
      ) : null}
    </header>
  );
}
