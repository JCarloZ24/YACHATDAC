import { Fragment, type ElementType } from "react";

/**
 * Y2 — Word emphasis. "Per-word opacity ramp, dim state 0.28 not
 * near-invisible. No movement." Status: build — right for quoted speech,
 * wrong for marketing copy.
 *
 * This is the Truth beat's treatment, and it is there because of a permission
 * rather than a preference: story-wall imagery is unresolved, permissions.md
 * says "treat as unavailable — build the Truth beat typographically (B5, Y2)",
 * and this is the Y2 half of that instruction.
 *
 * NO MOVEMENT. Opacity only, per the spec. If this ever grows a transform it
 * has stopped being Y2 and has started being something nobody approved for a
 * truth-telling beat — where the standing brand rule is that things move LESS
 * than the rest of the site, not more.
 *
 * THE DIM STATE IS THE DEFAULT-OFF, NOT THE DEFAULT-ON
 * ---------------------------------------------------
 * Words render at full opacity, which is why Y2_DIM is not imported here. The
 * dim start state is applied by the motion module (sky-clock.ts) from
 * src/lib/sections/y2.ts, so if the motion never runs — reduced motion, no JS,
 * a failed chunk — the reader gets fully legible text rather than a paragraph
 * stranded at 28%.
 */

export function WordEmphasis({
  text,
  as: Tag = "h2",
  className = "",
}: {
  text: string;
  as?: ElementType;
  className?: string;
}) {
  return (
    <Tag className={className} data-y2>
      {text.split(/\s+/).map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          {index > 0 && " "}
          <span data-y2-word aria-hidden className="inline-block">
            {word}
          </span>
        </Fragment>
      ))}
      <span className="sr-only">{text}</span>
    </Tag>
  );
}
