import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Shared chrome for the /lab prototypes.
 *
 * These pages exist so Marc can judge A2, D4 and E1 in a browser at real scroll
 * speed, and so the open land-detail question can be answered by looking at
 * something rather than by describing it. They are not site pages: they are
 * noindex, they are not in the nav, and they carry their own explanation.
 *
 * Everything here is page furniture that sits *around* the prototype. Anything
 * that would sit on top of it belongs in LabControlPanel, which floats and can
 * be put away — each sketch is simulated at the full viewport, so chrome in the
 * flow would change the frame the behaviour is being judged in.
 */

export function LabHeader({
  sketch,
  title,
  standfirst,
  status,
}: {
  sketch: string;
  title: string;
  standfirst: string;
  status: string;
}) {
  return (
    <header className="mx-auto max-w-4xl px-6 pt-32 pb-14 lg:px-16">
      <Link href="/lab" className="eyebrow text-ochre hover:text-burnt">
        ← Prototypes
      </Link>
      <p className="eyebrow mt-8 text-canvas/45">Sketch {sketch}</p>
      <h1 className="headline mt-3 text-5xl text-canvas sm:text-6xl">{title}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-canvas/75">
        {standfirst}
      </p>
      <p className="mt-6 inline-block rounded-sm border border-ochre/40 bg-ochre/5 px-4 py-2 text-sm text-ochre">
        {status}
      </p>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-canvas/50">
        Scroll on. The sketch runs at the full viewport — the frame it would get
        on the page, at your screen&rsquo;s own aspect ratio, with nothing
        cropping it. Controls float bottom right and hide with{" "}
        <kbd className="rounded-xs border border-canvas/30 px-1.5 py-0.5 text-[0.625rem] tracking-[0.12em]">
          C
        </kbd>
        .
      </p>
    </header>
  );
}

/** A titled block of prose. Used for the notes under each prototype. */
export function LabNote({
  title,
  tone = "neutral",
  children,
}: {
  title: string;
  tone?: "neutral" | "flag";
  children: ReactNode;
}) {
  const border = tone === "flag" ? "border-oxide/50" : "border-canvas/15";
  const heading = tone === "flag" ? "text-oxide" : "text-ochre";

  return (
    <section className={`rounded-sm border ${border} p-6`}>
      <h2 className={`eyebrow ${heading}`}>{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-canvas/70">
        {children}
      </div>
    </section>
  );
}

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  hint?: string;
};

/**
 * The control the whole prototype is for. Marc's open question is how much of
 * the land may be shown and at what detail — so make that a thing you can move
 * and watch, not a number in a config file.
 */
export function SegmentedControl<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="eyebrow text-canvas/45">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
              className={`rounded-sm border px-4 py-2 text-sm transition-colors duration-(--dur-small) ease-quiet ${
                selected
                  ? "border-ochre bg-ochre text-charcoal"
                  : "border-canvas/25 text-canvas/70 hover:border-ochre/60 hover:text-canvas"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {options.find((option) => option.value === value)?.hint ? (
        <p className="mt-2 text-xs leading-relaxed text-canvas/55">
          {options.find((option) => option.value === value)!.hint}
        </p>
      ) : null}
    </fieldset>
  );
}

/**
 * Says out loud which motion branch is on screen.
 *
 * Without this, a reviewer whose machine asks for reduced motion sees a
 * finished contour map that never draws and a terrain section that is a flat
 * panel, and reasonably concludes the prototype is broken.
 */
export function MotionPreviewNotice({
  systemReduced,
  forced,
}: {
  systemReduced: boolean;
  /** True when the reviewer has overridden the system preference. */
  forced: boolean;
}) {
  if (forced) {
    return (
      <p className="mx-auto max-w-4xl px-6 pb-10 text-sm text-canvas/45 lg:px-16">
        Motion branch is forced for preview. The site itself always follows the
        system preference.
      </p>
    );
  }

  if (!systemReduced) return null;

  return (
    <div className="mx-auto max-w-4xl px-6 pb-10 lg:px-16">
      <div className="rounded-sm border border-oxide/50 p-5">
        <h2 className="eyebrow text-oxide">
          Reduced motion is on — this is the cut version
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-canvas/70">
          Your system asks for reduced motion, so nothing here animates on
          scroll: the contour map is drawn already, and the terrain section
          shows its poster instead of building a scene. That is the correct
          behaviour and it is exactly what a visitor with the same setting gets.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-canvas/70">
          To see the behaviour itself, set <strong>Motion</strong> to{" "}
          <strong>Animated</strong> in the floating controls at the bottom
          right. That switch exists on this page only.
        </p>
      </div>
    </div>
  );
}
