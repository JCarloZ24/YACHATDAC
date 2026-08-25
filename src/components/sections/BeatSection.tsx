import { BeatContent, toneClasses } from "@/components/sections/BeatContent";
import { GhostType } from "@/components/ui/GhostType";
import { MediaTile } from "@/components/ui/MediaTile";
import type { Beat } from "@/content/homepage";
import { skyBeatSlots } from "@/content/media";

/**
 * A narrative beat in ordinary document flow — one full-height panel, no call
 * to action. The visitor is being carried, not routed.
 *
 * On the homepage, beats 2–4 are inside the A2 pin (see SkyClock) and beat 5
 * carries M2 (see FrameExpandBeat), so this renders the reduced-motion twin of
 * the A2 group and stays available for any Tier 2 page that wants the same
 * treatment.
 *
 * The background changes beat to beat while the content holds its position —
 * the "static foreground, moving background" direction from the 18 Aug
 * briefing.
 */
export function BeatSection({ beat }: { beat: Beat }) {
  return (
    <section
      id={beat.id}
      className={`relative flex min-h-svh items-center ${toneClasses[beat.tone]}`}
    >
      {/* Same content as the pinned tree, minus the motion. Reduced motion
          removes movement, not material — a reader who has asked for less
          animation should still get the beat's imagery and its ghost word. */}
      <GhostType word={beat.eyebrow} />

      {skyBeatSlots[beat.id] ? (
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-[7%] hidden w-[26vw] max-w-sm -translate-y-1/2 lg:block"
        >
          <MediaTile slot={skyBeatSlots[beat.id]} />
        </div>
      ) : null}

      <BeatContent beat={beat} emphasis={beat.id === "truth"} />
    </section>
  );
}
