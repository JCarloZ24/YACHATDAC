import { Fragment, type ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { WordEmphasis } from "@/components/ui/WordEmphasis";
import type { Beat } from "@/content/homepage";

/**
 * Palette anchor per beat. Explicit map — Tailwind cannot see dynamic names.
 *
 * Shared by BeatSection (ordinary beats) and SkyClock (the A2 group), so the
 * two cannot drift apart.
 */
export const toneClasses: Record<Beat["tone"], string> = {
  evergreen: "bg-evergreen",
  midnight: "bg-midnight",
  roasted: "bg-roasted",
  oxide: "bg-oxide",
  canvas: "bg-canvas",
  charcoal: "bg-charcoal",
};

/**
 * One staggered step, or a plain pass-through when staggering is off.
 *
 * Declared at module scope rather than inside BeatContent: a component created
 * during render is a new type on every render, so React would unmount and
 * remount its subtree and the entry animation would restart.
 */
function Step({
  reveal,
  index,
  children,
}: {
  reveal: boolean;
  index: number;
  children: ReactNode;
}) {
  return reveal ? <Reveal index={index}>{children}</Reveal> : <>{children}</>;
}

/**
 * Inner copy block for a narrative beat: eyebrow, headline, body.
 *
 * `reveal` controls whether X4 entry stagger is applied. It is ON for beats in
 * normal document flow, and OFF inside the A2 pin — there the container's own
 * cross-fade already owns opacity, and layering an entry stagger on top of it
 * would have two things fighting for the same property.
 */
export function BeatContent({
  beat,
  reveal = true,
  headingLevel: Heading = "h2",
  emphasis = false,
}: {
  beat: Beat;
  reveal?: boolean;
  headingLevel?: "h1" | "h2";
  /**
   * Y2 word emphasis on the headline. Used by the Truth beat, where
   * story-wall imagery is unavailable and permissions.md directs the beat to
   * be built typographically instead.
   */
  emphasis?: boolean;
}) {
  const onCanvas = beat.tone === "canvas";

  return (
    <div className="relative mx-auto w-full max-w-7xl px-6 py-28 lg:px-16">
      <Step reveal={reveal} index={0}>
        <Eyebrow className={onCanvas ? "text-oxide" : "text-ochre"}>
          {beat.eyebrow}
        </Eyebrow>
      </Step>

      <Step reveal={reveal} index={1}>
        {emphasis ? (
          <WordEmphasis
            as={Heading}
            text={beat.headline}
            className={`headline mt-6 max-w-3xl text-4xl sm:text-5xl lg:text-(length:--text-beat) ${
              onCanvas ? "text-evergreen" : "text-canvas"
            }`}
          />
        ) : (
          <Heading
            className={`headline mt-6 max-w-3xl text-4xl sm:text-5xl lg:text-(length:--text-beat) ${
              onCanvas ? "text-evergreen" : "text-canvas"
            }`}
          >
            {beat.headline}
          </Heading>
        )}
      </Step>

      <div className="mt-8 max-w-xl space-y-5">
        {beat.body.map((paragraph, index) => (
          <Fragment key={paragraph}>
            <Step reveal={reveal} index={2 + index}>
              <p
                className={`text-base leading-relaxed ${
                  onCanvas ? "text-evergreen/80" : "text-canvas/75"
                }`}
              >
                {paragraph}
              </p>
            </Step>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
