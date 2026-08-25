import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

/**
 * WHAT TRAVELS / WHAT STAYS HERE — the governance pair on every Living Work step.
 *
 * Both columns get identical width, padding, border and type. That is a brand
 * rule, not a layout preference: the right-hand column is where the cultural
 * governance line is drawn in public, and rendering it lighter or shorter than
 * its partner would read as a footnote. `items-stretch` plus `h-full` keeps
 * them the same height even when one has three sentences and the other has
 * five words.
 *
 * `stays: null` renders the explicit "nothing restricted here" state. It is a
 * real answer — this step's knowledge is all shareable — and it is set at full
 * strength rather than dimmed, so it reads as a statement rather than a gap.
 */
export function GovernanceTable({
  travels,
  stays,
  index = 0,
}: {
  travels: string;
  stays: string | null;
  index?: number;
}) {
  return (
    <Reveal index={index}>
      <div className="grid items-stretch gap-px bg-canvas/15 md:grid-cols-2">
        <div className="flex h-full flex-col gap-3 bg-evergreen p-6">
          <Eyebrow className="text-ochre">What travels</Eyebrow>
          <p className="text-sm leading-relaxed text-canvas/80">{travels}</p>
        </div>

        <div className="flex h-full flex-col gap-3 bg-evergreen p-6">
          <Eyebrow className="text-ochre">What stays here</Eyebrow>
          {stays ? (
            <p className="text-sm leading-relaxed text-canvas/80">{stays}</p>
          ) : (
            <p className="text-sm leading-relaxed text-canvas/80">
              — nothing restricted here
            </p>
          )}
        </div>
      </div>
    </Reveal>
  );
}
