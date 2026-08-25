import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Lo-fi — animated walkthrough" };

/**
 * Index for the lo-fi walkthrough.
 *
 * WHY THIS LIVES UNDER /lab AND NOT AT THE REAL ROUTES
 * ----------------------------------------------------
 * `/`, `/truth`, `/wonder` and `/living-work` are built from the v3 copy
 * drafts. These four are the same pages drawn for the lo-fi review with the
 * motion actually wired up, and the two cannot share components — the Beat
 * shapes disagree and the homepage is five beats here against four there.
 *
 * Both are real work and neither supersedes the other yet. Which one becomes
 * the homepage is the lo-fi review's call, so they sit side by side until it
 * is made.
 */
const PAGES = [
  {
    title: "Home",
    href: "/lab/lofi/home",
    motion: "X1 · A2 · M2 · D1 · B2+L1+L2+L3 · B5",
    summary:
      "The loader runs on real asset progress, then lifts onto a hero already laid out beneath it. Three beats share one pinned screen with the sky ramping on the same clock; the Living Work frame opens onto a dollying scene; the invitation grid resolves out of a scatter.",
  },
  {
    title: "Truth",
    href: "/lab/lofi/truth",
    motion: "rail · hard stop",
    summary:
      "A descending timeline, newest first. The rail is a plain vertical rule and is genuinely absent across the hard stop, which holds the viewport rather than decorating it. Deliberately the least-moving page on the site.",
  },
  {
    title: "Wonder",
    href: "/lab/lofi/wonder",
    motion: "Tier 2 only",
    summary:
      "Entry staggers and the section primitives, with the held slots drawn as held rather than filled with something that implies a decision nobody has made.",
  },
  {
    title: "Living Work",
    href: "/lab/lofi/living-work",
    motion: "Tier 2 · governance table",
    summary:
      "The what-travels / what-stays-here pair rendered as a real table, so the governance rule is legible in the layout instead of being described next to it.",
  },
];

export default function LofiIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pt-36 pb-28 lg:px-16">
      <Link href="/lab" className="eyebrow text-ochre hover:text-burnt">
        ← Prototypes
      </Link>

      <p className="eyebrow mt-8 text-canvas/45">Walkthrough</p>
      <h1 className="headline mt-3 text-5xl text-canvas sm:text-6xl">
        Lo-fi, with the motion wired up
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-canvas/75">
        The four pillar pages as drawn for the lo-fi review, built so the
        transitions can be judged by scrolling rather than by description.
        Structure and behaviour are the point here; the copy is whatever was
        current when each page was built, and the imagery is placeholder
        direction.
      </p>

      <p className="mt-6 inline-block rounded-sm border border-oxide/50 bg-oxide/5 px-4 py-2 text-sm text-oxide">
        Knowingly over the motion budget — see below
      </p>

      <ul className="mt-14 space-y-4">
        {PAGES.map((page) => (
          <li key={page.href}>
            <Link
              href={page.href}
              className="block rounded-sm border border-canvas/15 p-6 transition-colors duration-(--dur-small) ease-quiet hover:border-ochre/60"
            >
              <p className="eyebrow text-canvas/45">{page.motion}</p>
              <h2 className="headline mt-2 text-2xl text-canvas">
                {page.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-canvas/70">
                {page.summary}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-14 rounded-sm border border-oxide/50 p-6">
        <h2 className="eyebrow text-oxide">Four signature moments, where F4 budgets two</h2>
        <p className="mt-3 text-sm leading-relaxed text-canvas/70">
          A2 and M2 are the two the homepage is budgeted. The converge grid and
          the layered dolly are over that budget, and the hard stop and the rail
          are Tier 1 behaviours on a Tier 2 page. All four run as flagged
          exceptions pending <strong className="text-canvas">D9</strong>, which
          has not yet named who signs motion off. Each is marked{" "}
          <code className="text-canvas/90">data-tier1-exception=&quot;D9&quot;</code>{" "}
          in the DOM, so they can be found and removed as whole components
          rather than unpicked. They are built so the shape can be judged before
          hi-fi — not because the budget moved.
        </p>
      </div>

      <div className="mt-4 rounded-sm border border-canvas/15 p-6">
        <h2 className="eyebrow text-ochre">Two things the frame gets wrong here</h2>
        <p className="mt-3 text-sm leading-relaxed text-canvas/70">
          The site header and footer wrap every route including this one, so the
          homepage shows a persistent navbar it is not designed to have —{" "}
          <strong className="text-canvas">D24</strong> is open on exactly that
          question. And the hero photography lives in the client media library,
          which is not in git, so on any machine but the one it was built on the
          hero renders its placeholder instead.
        </p>
      </div>
    </div>
  );
}
