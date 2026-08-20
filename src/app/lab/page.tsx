import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Motion prototypes" };

const PROTOTYPES = [
  {
    sketch: "A2",
    title: "Sky clock",
    href: "/lab/sky-clock",
    summary:
      "Marc's homepage mockup, built for real. Time of day and narrative beat on one clock, with Truth holding still.",
  },
  {
    sketch: "E1",
    title: "Terrain dolly",
    href: "/lab/terrain-dolly",
    summary:
      "Elevation as a wireframe mesh, camera flown low across it on scroll. The one WebGL section the site gets.",
  },
  {
    sketch: "D4",
    title: "Contour map with waypoints",
    href: "/lab/contour-map",
    summary:
      "The same landform as vector contours, drawing themselves on scroll, with waypoints lighting in sequence. No WebGL, no shoot.",
  },
];

export default function LabIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pt-36 pb-28 lg:px-16">
      <p className="eyebrow text-ochre">Internal</p>
      <h1 className="headline mt-5 text-5xl text-canvas sm:text-6xl">
        Motion prototypes
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-canvas/75">
        Behaviours from the motion &amp; 3D reference, built for real so they can
        be judged by scrolling rather than by description. Not linked from the
        site, not indexed.
      </p>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-canvas/50">
        Each one runs at the full viewport, at your screen&rsquo;s own aspect
        ratio, so what you judge is the frame the behaviour would really have.
        The settings float bottom right over the top of it and hide with{" "}
        <kbd className="rounded-xs border border-canvas/30 px-1.5 py-0.5 text-[0.625rem] tracking-[0.12em]">
          C
        </kbd>
        , so the frame can be seen clean.
      </p>

      <ul className="mt-14 space-y-4">
        {PROTOTYPES.map((prototype) => (
          <li key={prototype.sketch}>
            <Link
              href={prototype.href}
              className="block rounded-sm border border-canvas/15 p-6 transition-colors duration-(--dur-small) ease-quiet hover:border-ochre/60"
            >
              <p className="eyebrow text-canvas/45">Sketch {prototype.sketch}</p>
              <h2 className="headline mt-2 text-2xl text-canvas">
                {prototype.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-canvas/70">
                {prototype.summary}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-14 rounded-sm border border-oxide/50 p-6">
        <h2 className="eyebrow text-oxide">Both are on hold</h2>
        <p className="mt-3 text-sm leading-relaxed text-canvas/70">
          D4 and E1 are approved in principle for the About and Research pages.
          What is not confirmed is how much of the property may be shown and at
          what detail. Until that comes back, both run on a synthetic landform:
          no real elevation data, no boundaries, no place names, no coordinates.
          The detail control on each page is there so that question can be
          answered by looking.
        </p>
      </div>
    </div>
  );
}
