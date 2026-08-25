"use client";

import { useEffect, useRef } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MediaTile } from "@/components/ui/MediaTile";
import { PathCard } from "@/components/ui/PathCard";
import { Reveal } from "@/components/ui/Reveal";
import { SettleText } from "@/components/ui/SettleText";
import { invitationGrid } from "@/content/media";
import { invitation } from "@/content/homepage";
import { register } from "@/lib/motion-controller";
import {
  createConvergeGrid,
  CONVERGE_SPAN_VH,
} from "@/lib/sections/converge-grid";

/**
 * Beat 6 — The Invitation.
 *
 * The first navigation on the page. Three cards, one per pillar, and nothing
 * else: no secondary links, no "learn more" chrome. The visitor has just been
 * through five beats of story; this is the moment they choose a direction.
 *
 * ⚠ THE CONVERGING GRID IS A THIRD SIGNATURE MOMENT AND F4 ALLOWS TWO.
 * It runs as a flagged exception pending D9 — see converge-grid.ts.
 *
 * WHY THE GRID STOPS ABOVE THE CARDS
 * ----------------------------------
 * First attempt put the grid across the whole section, behind the cards as
 * well as the heading. It failed, and the reason is worth writing down so it
 * does not get re-attempted.
 *
 * The reference this behaviour comes from resolves its grid behind TYPE and
 * nothing else. Type works as a foreground over busy ground because its
 * silhouette is irregular and full of holes — imagery reads through the
 * counters and between the words, so the two layers stay legible as figure and
 * ground. Cards are opaque rectangles. Putting a rectangular grid behind a row
 * of rectangular cards gives you two grids of similar scale competing on the
 * same plane: tile edges cut through card edges, neither reads as background,
 * and the scrim needed to rescue the copy flattens the imagery into mud.
 *
 * So the grid is scoped to the heading block and the cards sit on solid
 * ground. The scrim is directional (X5) rather than a flat wash — imagery at
 * the top where the type is, fully opaque by the time the cards begin.
 *
 * L1 AND L2 SHARE ONE AXIS HERE, DELIBERATELY
 * -------------------------------------------
 * L2's arrival tiers are "a layout rule as much as motion". On a horizontal
 * band the honest layout property to tier by is distance from the centre
 * column — which is where the heading sits and where L1's radial origin is.
 * So the middle tiles are anchors and the outer ones arrive last, and the two
 * sketches describe the same movement outward from the headline. A
 * simplification, on purpose; noting it so nobody later "fixes" it.
 */

const COLUMNS = 6;
const ROWS = 2;

/** Distance from the centre column → L2 tier. Middle lands first. */
function tierFor(index: number): "anchor" | "mid" | "detail" {
  const column = index % COLUMNS;
  const distance = Math.abs(column - (COLUMNS - 1) / 2);
  if (distance < 1) return "anchor";
  if (distance < 2) return "mid";
  return "detail";
}

export function Invitation() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // Registered in both modes: the module's reduced branch sets the resolved
    // state, so tiles are never left sitting scattered.
    return register(createConvergeGrid(root));
  }, []);

  return (
    <section
      ref={rootRef}
      id="invitation"
      data-motion="B2+L1+L2+L3"
      data-span-vh={CONVERGE_SPAN_VH}
      data-tier1-exception="D9"
      className="relative bg-roasted"
    >
      {/* --- Heading block: the grid's territory ------------------------- */}
      <div data-converge-scope className="relative overflow-hidden">
        {/* Decorative — the real navigation is the three cards below, so this
            is hidden from assistive technology entirely. No labels: behind
            type they read as content and compete with the headline. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 grid gap-2 p-3 sm:gap-3 sm:p-6"
          style={{
            gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
          }}
        >
          {invitationGrid.slice(0, COLUMNS * ROWS).map((slot, index) => (
            <MediaTile
              key={slot.id}
              slot={slot}
              square={false}
              showLabel={false}
              tier={tierFor(index)}
              className="h-full w-full"
            />
          ))}
        </div>

        {/* X5 — directional, not a flat wash. Imagery survives at the top
            where the type is; solid by the bottom so the cards begin on clean
            ground rather than on a half-visible grid. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-b from-roasted/45 via-roasted/80 to-roasted"
        />

        <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-20 lg:px-16">
          <Reveal>
            <Eyebrow className="text-ochre">{invitation.eyebrow}</Eyebrow>
          </Reveal>

          <SettleText
            as="h2"
            text={invitation.headline}
            className="headline mt-6 max-w-3xl text-4xl text-canvas sm:text-5xl"
          />

          {invitation.body ? (
            <Reveal index={2}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-canvas/75">
                {invitation.body}
              </p>
            </Reveal>
          ) : null}
        </div>
      </div>

      {/* --- Cards: solid ground ----------------------------------------- */}
      <div className="relative mx-auto max-w-7xl px-6 pb-28 lg:px-16">
        <div className="grid gap-6 md:grid-cols-3">
          {invitation.cards.map((card, index) => (
            <Reveal key={card.title} index={index}>
              <PathCard {...card} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
