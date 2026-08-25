import { isLight, toneInk, type Tone } from "@/lib/tone";

/**
 * A media slot that has art direction but no asset.
 *
 * The v3 prototypes carried 61 embedded base64 photographs between them, about
 * 12 MB. None were imported: STATUS note 12 records that the photography is
 * placeholder *direction* rather than an asset manifest, and pasting base64
 * back into the repo would fix the wrong problem.
 *
 * What survived is the direction itself — "Suzanne handing lemongrass to a
 * guest", "Fossil footprints in the rock". This renders that direction in the
 * space the photograph will occupy, so the page can be reviewed for rhythm and
 * so whoever commissions the shot can see what it sits next to.
 *
 * Swap-in-ready: when a real asset lands, replace the frame with next/image and
 * keep `note` as the alt text starting point. Do not build layout that depends
 * on a specific crop — see the Beat.mediaNote warning in content/homepage.ts.
 */
export function ImageSlot({
  note,
  caption,
  tone = "canvas",
  aspect = "landscape",
  className = "",
}: {
  /** Art direction for this slot. What the shot has to carry. */
  note: string;
  /** Published caption, where the draft gives the slot one. Rendered as copy. */
  caption?: string;
  tone?: Tone;
  aspect?: "landscape" | "portrait" | "square" | "wide";
  className?: string;
}) {
  const ink = toneInk[tone];

  const aspectClass = {
    landscape: "aspect-4/3",
    portrait: "aspect-3/4",
    square: "aspect-square",
    wide: "aspect-16/9",
  }[aspect];

  return (
    <figure className={className}>
      <div
        data-placeholder="image"
        className={`flex ${aspectClass} items-end overflow-hidden rounded-sm border border-dashed ${ink.border} ${
          isLight(tone) ? "bg-evergreen/5" : "bg-canvas/5"
        }`}
      >
        <p className={`p-4 text-xs leading-relaxed ${ink.muted}`}>
          <span className={`eyebrow block ${ink.accent}`}>Image</span>
          <span className="mt-1 block">{note}</span>
        </p>
      </div>

      {caption ? (
        <figcaption className={`mt-3 text-sm ${ink.muted}`}>
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
