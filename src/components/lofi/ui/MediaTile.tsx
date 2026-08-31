import { MAY_SHOW, MOTION_GRADE, type MediaSlot } from "@/content/lofi/media";

/**
 * One media slot, rendered as a square.
 *
 * ⚠ There are no photographs in this repository yet. Every tile is currently a
 * tonal square standing in for one. That is deliberate for the prototype — the
 * mechanism is provable without the imagery, and dropping a photo in means
 * setting `src` in src/content/lofi/media.ts and nothing else.
 *
 * THIS COMPONENT ENFORCES A PERMISSION, IT DOES NOT JUST DESCRIBE ONE
 * -------------------------------------------------------------------
 * Every tile is stamped with its MOTION GRADE as `data-motion`, and modules
 * that move an image plane select `[data-media-tile]:not([data-motion="frame"])`.
 * So a cultural-site photo dropped into a scrubbing grid keeps its image still —
 * it does not quietly inherit the behaviour of whatever component it was placed
 * in. Modules that move the plate, ground, scrim or type around a tile need no
 * such filter: that is the whole point of the grade.
 *
 * `frame` is not a smaller ration. It is the P1/P8 language — full-bleed, held,
 * with the world moving around it — which is the heaviest cinema in the kit.
 */

const toneClass: Record<MediaSlot["tone"], string> = {
  evergreen: "bg-evergreen",
  midnight: "bg-midnight",
  roasted: "bg-roasted",
  oxide: "bg-oxide",
  burnt: "bg-burnt",
  eucalyptus: "bg-eucalyptus",
  charcoal: "bg-charcoal",
};

export function MediaTile({
  slot,
  className = "",
  square = true,
  tier,
  showLabel = true,
}: {
  slot: MediaSlot;
  className?: string;
  /** Squares by default — the placeholder shape while photography is pending. */
  square?: boolean;
  /** L2 arrival tier. Read by converge-grid.ts; layout and motion agree by
      construction rather than by two lists being kept in step by hand. */
  tier?: "anchor" | "mid" | "detail";
  /**
   * The "what photo goes here" note. Useful where a tile is the subject and
   * somebody is sourcing imagery against it; pure noise where a tile is
   * wallpaper behind type, which is where it starts competing with the copy
   * it is supposed to sit behind.
   */
  showLabel?: boolean;
}) {
  if (!MAY_SHOW[slot.bucket]) {
    return (
      <div
        data-media-hold={slot.bucket}
        className={`flex items-center justify-center border border-dashed border-oxide/50 p-4 ${
          square ? "aspect-square" : ""
        } ${className}`}
      >
        <p className="text-center text-[10px] leading-snug text-oxide">
          ⛔ HELD — {slot.bucket}
          <br />
          permission unresolved
        </p>
      </div>
    );
  }

  const grade = MOTION_GRADE[slot.bucket];

  return (
    <div
      data-media-tile={slot.id}
      data-bucket={slot.bucket}
      data-tier={tier}
      /* Read by every motion module. "frame" means the world moves around this
         tile and its image plane holds; absent/"full" means anything goes. */
      data-motion={grade}
      className={`relative overflow-hidden ${square ? "aspect-square" : ""} ${
        toneClass[slot.tone]
      } ${className}`}
    >
      {slot.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={slot.src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
          {/* Placeholder square. A hairline keeps the tile legible where its
              tone sits close to the section behind it. */}
          <span
            aria-hidden
            className="absolute inset-0 border border-canvas/12"
          />
          {showLabel ? (
            <span className="absolute inset-x-0 bottom-0 p-2 text-[9px] leading-tight text-canvas/35">
              {slot.expects}
            </span>
          ) : null}
        </>
      )}
    </div>
  );
}
