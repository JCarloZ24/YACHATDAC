"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { loreMarker, wattanuri } from "@/content/truth";
import {
  RAIL_TRAVEL_BOTTOM_INSET,
  RAIL_TRAVEL_TOP,
} from "@/lib/motion/truth-rail-map";

/**
 * The record trail — FINITE AND STICKY from 15 September 2026 (user
 * direction; grammar row "the guide leading the eye, Truth cut"). It
 * supersedes the document-height strand of 8–14 September, which scrolled
 * with the page and went under at the count. Three parts:
 *
 *   · the legend — "LORE — CONTINUOUS" — at the head of the rail. The rail
 *     is sticky now, so the legend rides with the reader the whole descent;
 *   · the LEFT dotted strand — LORE · continuous: the record itself, static
 *     ochre (#CB7722) the whole page, never breaks, not even at the count;
 *   · the RIGHT dotted strand — RECORD: the page-progress indicator. Faint
 *     dots ahead, the lore ochre filling through them to the pointer
 *     ([data-v2-steps-fill], clipped open by the motion module,
 *     scroll-derived, both directions).
 *
 * Both strands stand ONE VIEWPORT tall inside the sticky screen and are cut
 * at its head and foot under a gradient opacity mask (truth.css,
 * `[data-truth-rail-strands]`) so the cut never reads as a cut. The strand
 * NO LONGER GOES UNDER at the count — the rail is visible on the dark bands,
 * and its inks ride the custom properties the deck's painter steps at the
 * 1950s' luminance crossover (`--rail-base-ink`, `--rail-ink`,
 * `--rail-ink-sub`; values in truth.css under `[data-rail-dark]`).
 *
 * One trail-point traveller is the pointer. Its y is PAGE PROGRESS: the
 * document's scroll fraction mapped piecewise through the era anchors
 * (src/lib/motion/truth-rail-map.ts — Ahead at the head, 2020 near three
 * quarters), so it sits on an era's mark while that era is read. The fill's
 * clip goes through the same map, so tip and pointer cannot disagree.
 *
 * IT CARRIES THE ERA (user, 10 September 2026) — the label and its sub ride
 * at the arrow's tip, so the arrow points at something. Still no progress
 * gauge and no count readout: the chronology is what the rail exists to
 * carry. The pointer appears only on sections that HAVE an era — and the
 * count's screens now have theirs (1902, 1886, from the figures beside
 * them).
 *
 * RAIL A / RAIL B — the Figma pull landed 15 September 2026. The strands
 * render the exported hi-fi assets, public/artwork/rail-a.svg (the artist's
 * jittered dots — LORE) and rail-b.svg (the smooth strand — RECORD), as CSS
 * mask stencils over token-coloured fields — About §06's mechanism — so the
 * dark-band ink swap stays one custom-property write. The invisible guide
 * the pointer samples is retuned to rail-b.svg's measured wander (the
 * constants below). Recorded in ASSETS.md as Figma-exported generated
 * artwork, per the 8 September amendment.
 *
 * Decorative wayfinding: aria-hidden, pointer-events-none, lg and up only.
 */

/** Strand geometry — measured off the committed assets (a least-squares sine
 *  fit over each file's 112 dot positions, rms ≤ 1.5px): ~4.5px dots every
 *  ~10px, centre-of-wander 12.7 inside the 27.57-wide box, amplitude 10.2,
 *  wavelength ~216. The pair stands 38px apart in the frame, wander centre
 *  to wander centre (Rail A at 85.8, Rail B at 123.7 of the 1440 grid). */
const RAIL_W = 160;
const INK_X = 40; // Rail A's centre-of-wander — LORE
const STEP_X = 78; // Rail B's centre-of-wander — RECORD, the frame's 38px gap
/** The assets' natural box; the mask repeats down the screen at this size.
 *  One strand is ~5.03 wanders, so the repeat seam lands near a crest and
 *  the guide below drifts ≤ ~2px into a second tile — invisible under the
 *  50px rosette. */
const ART_W = 27.57;
const ART_H = 1087.7;
const ART_MID = 12.7;
/** THE LEGEND IS PART OF RAIL A, in Rail A's own coordinates (user redesign,
 *  16 September 2026: Figma `Layer_1` 3874:30134 inside `Rail A` 2048:12273,
 *  file 7XBvi0Mdbtmym10nkF9IGp). Read off the frame, not fitted: the lettering
 *  is 26.49 × 113.72 at (4.36, 99) from Rail A's origin. Positioning it off
 *  the same origin as the strand is what keeps the two from drifting apart —
 *  the placement it replaces was a separate number derived from a sine fit to
 *  the strand's wander, and it sat ~5.7px left and 8px low of the frame. */
const LEGEND_X = 4.36;
const LEGEND_Y = 99;
const LEGEND_W = 26.49;
const LEGEND_H = 113.72;
/** Where Rail A's dots begin: the redesign hides the strand's top 23 dots
 *  (2048:12339…12361, y 0 → 214) so the rail STARTS at its lettering. 221 is
 *  the midpoint between the last hidden dot's foot (214.17 + 4.5 = 218.67) and
 *  the first kept dot (2048:12338 at 224.29). */
const RAIL_A_START = 221;
/** rail-b.svg's own wander, for the invisible guide the pointer samples:
 *  x(y) = STEP_X + AMPLITUDE · sin(2πy / WAVELENGTH + GUIDE_PHASE). */
const AMPLITUDE = 10.2;
const WAVELENGTH = 216.2;
const GUIDE_PHASE = 1.34;
const SAMPLE = 12;
/** Where the artwork's chevron ends, from the traveller anchor. The image is
 *  96px drawn at left-[-22px] and its arrowhead sits at x 87–93, so the tip
 *  lands at +71; the label clears it by a space. */
const LABEL_X = 86;
const LABEL_W_MAX = 200;
/** Narrower than this and the label is not worth the collision. */
const LABEL_W_MIN = 120;

/** LORE · continuous — the record, static. The frame's own ochre; deliberately
 *  NOT `--color-ochre` (#d69828), which is a different colour. */
const LORE_COLOR = "#CB7722";

/** One strand as a stencil: the asset's alpha over a token-coloured field,
 *  at its natural size so the dots stay round — never stretched. */
function strandMask(asset: string): CSSProperties {
  return {
    width: ART_W,
    backgroundColor: "currentcolor",
    maskImage: `url("${asset}")`,
    maskSize: `${ART_W}px ${ART_H}px`,
    maskRepeat: "repeat-y",
    WebkitMaskImage: `url("${asset}")`,
    WebkitMaskSize: `${ART_W}px ${ART_H}px`,
    WebkitMaskRepeat: "repeat-y",
  };
}

function strandX(y: number, center: number, phase: number): number {
  return center + AMPLITUDE * Math.sin((y / WAVELENGTH) * Math.PI * 2 + phase);
}

function strandPath(
  height: number,
  center: number,
  phase: number,
  from = 0,
): string {
  const pts: string[] = [`M ${strandX(from, center, phase)} ${from}`];
  for (let y = from + SAMPLE; y <= height; y += SAMPLE) {
    pts.push(`L ${strandX(y, center, phase).toFixed(1)} ${y}`);
  }
  return pts.join(" ");
}

export function TruthTrailRail() {
  const [left, setLeft] = useState(0);
  /** One viewport of strand. The finite rail's whole height. */
  const [viewH, setViewH] = useState(0);
  /**
   * Where the rail's WRAPPER ends: the Wattanuri floor's head, not the
   * root's foot. The sticky screen parks against it and rides up off the
   * page as the floor arrives — a rail that IS the descent must not run
   * past it (D20, carried onto the finite rail). Structural rather than
   * animated, so it holds for reduced motion and no-JS too.
   */
  const [railEnd, setRailEnd] = useState(0);
  /**
   * How wide the pointer's era label may be before it runs into the reading
   * column, in px — 0 when there is no room and the arrow rides alone.
   *
   * The rail's left edge is pinned to the wordmark and so barely moves, while
   * the content container is centred and travels LEFT as the viewport narrows:
   * measured, the gap between the arrow's tip and the reading column is 452px
   * at 1794 and only 131px at 1024. A fixed width would be wrong at one end or
   * the other, so it is measured.
   */
  const [labelWidth, setLabelWidth] = useState(LABEL_W_MAX);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-descent-root]");
    if (!root) return;

    const measure = () => {
      setViewH(window.innerHeight);
      // The floor's position is read off its RUNWAY through the offsetTop
      // chain, not a viewport rect: under the deck the slide itself goes
      // position:fixed while pinned and a rect would measure the pin, while
      // the runway never leaves the flow. The chain bottoms out at the root
      // (it is position:relative); a missing floor falls back to the root's
      // own height, which is the old wrapper extent.
      const floorSection = document.getElementById(wattanuri.id);
      const floorRunway =
        floorSection?.closest<HTMLElement>("[data-truth-slide-runway]") ??
        floorSection;
      let end = root.offsetHeight;
      if (floorRunway) {
        let y = 0;
        let node: HTMLElement | null = floorRunway;
        while (node && node !== root) {
          y += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        if (node === root && y > 0) end = y;
      }
      setRailEnd(end);
      // The strand pair centres on the "C" of the YACHATDAC wordmark (its
      // third letter): the descent drops out of the logo's own letterform.
      // More than one wordmark is in the DOM (the mobile bar's is first but
      // display:none at lg, measuring a zero rect), so take the visible one.
      // Falls back to the Ahead section's left edge if the logo is absent.
      //
      // ⚠ NOT THE LOADING PANEL'S. RouteLoader mounts PageLoader in the ROOT
      // layout ABOVE SiteHeader (11 September 2026), and its wordmark is
      // `mx-auto` inside a full-screen cover — first in document order, and
      // visible, because the panel is server-rendered to cover the settling
      // window. This measurement runs while it is still up, so the rail
      // centred the whole descent on the middle of the screen and stayed
      // there: the panel lifts without changing the root's height, so the
      // ResizeObserver below never fires to correct it. The rail belongs to
      // the NAVBAR wordmark, which is the one it has always meant.
      const logo = [
        ...document.querySelectorAll<HTMLElement>('img[src*="logo-wordmark"]'),
      ].find(
        (el) =>
          !el.closest("[data-page-loader]") &&
          el.getBoundingClientRect().width > 0,
      );
      if (logo) {
        const rect = logo.getBoundingClientRect();
        const aCenter = rect.left + rect.width * (2.5 / 9); // "C", 3rd of 9 letters
        const pairCenter = (INK_X + STEP_X) / 2;
        setLeft(Math.max(Math.round(aCenter - pairCenter), 0));
      } else {
        const section = document.getElementById("research");
        setLeft(
          section ? Math.max(section.getBoundingClientRect().left, 0) : 0,
        );
      }
      // The NARROWEST reading column on the page, not the first one.
      //
      // Entries do not all sit in the same wrapper — measured, the first copy
      // column starts at 370px and another at 297px — so sizing the label
      // against whichever happened to be first put it 57px inside the copy on
      // every section that indents less. The label is one element for the
      // whole descent, so it has to clear the worst case.
      const columns = [
        ...document.querySelectorAll<HTMLElement>("[data-truth-entry-copy]"),
      ]
        .map((el) => el.getBoundingClientRect().left)
        .filter((x) => x > 0);
      if (!columns.length) {
        setLabelWidth(LABEL_W_MAX);
        return;
      }
      const column = Math.min(...columns);
      const railLeft = Math.max(
        Math.round(
          (logo
            ? logo.getBoundingClientRect().left +
              logo.getBoundingClientRect().width * (2.5 / 9)
            : 0) - (INK_X + STEP_X) / 2,
        ),
        0,
      );
      // The traveller sits at the strand's own x inside the rail box, and the
      // label hangs off THAT — so the budget starts at the strand's rightmost
      // wander, not at the rail box's left edge. Omitting it overstated the
      // room by ~80px and put the label inside the copy.
      const room = column - (railLeft + STEP_X + AMPLITUDE + LABEL_X) - 16;
      setLabelWidth(room < LABEL_W_MIN ? 0 : Math.min(room, LABEL_W_MAX));
    };

    measure();
    // The root's box changes with every viewport resize (its paddings are in
    // vh), so observing it re-measures the viewport-height strands too.
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => {
      ro.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden
      data-truth-trail-rail
      className="pointer-events-none absolute top-0 z-20 hidden lg:block"
      style={{ width: RAIL_W + 220, left, height: railEnd || "100%" }}
    >
      {/* THE WHOLE RAIL IS ONE STICKY SCREEN. The strands, the legend and the
          traveller ride it together. The wrapper's measured height ends at
          the Wattanuri floor (see `railEnd`), so the screen parks there and
          leaves with the descent — no fade needed, and the end masks mean
          its exit reads as the strand dissolving, not as a box scrolling
          off. */}
      <div
        data-truth-rail-screen
        className="sticky top-0 h-svh w-full overflow-visible"
      >
        {/* The legend rides at the head of the sticky rail — Marc's hand-set
            LORE · CONTINUOUS cut (2026-09-02) — and RAIL A BEGINS AT IT (user
            redesign in Figma, 16 September 2026). It is seated in Rail A's
            own coordinates (see LEGEND_X / LEGEND_Y), off the same origin the
            strand's mask uses, so the lettering cannot drift off the line it
            heads.

            What this replaced, and why it never lined up: the legend was
            placed by a separate number fitted to the strand's wander
            (`left: 26, top: 107`) while Rail A drew all 112 dots from the top
            of the screen, so the strand ran up past and behind the lettering
            ("the first line extends too much"). Measured before the change at
            1440 × 900: 86 painted rows of Rail A above the lettering's foot.

            The frame's colours were already right and stay: the lettering is
            Colour/Yellow Gold #FBAE3D (baked into the asset), the dots Colour/
            Burnt Ochre #CB7722 (LORE_COLOR). */}
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
        <img
          src="/artwork/lore-legend.svg"
          alt={loreMarker}
          className="absolute"
          style={{
            left: INK_X - ART_MID + LEGEND_X,
            top: LEGEND_Y,
            width: LEGEND_W,
            height: LEGEND_H,
          }}
          loading="lazy"
        />

        {/* Both strands, one viewport tall, cut at the head and the foot
            under the gradient mask truth.css draws — the finite rail's ends
            dissolve rather than stop. */}
        <div data-truth-rail-strands className="absolute inset-0">
          {/* Geometry-only twin of the RECORD strand. Always mounted so the
              controller can retain the node before the first measurement;
              React updates its d attribute when the viewport is known. */}
          <svg
            width={RAIL_W}
            height={Math.max(viewH, 1)}
            viewBox={`0 0 ${RAIL_W} ${Math.max(viewH, 1)}`}
            fill="none"
            className="absolute left-0 top-0 overflow-visible opacity-0"
          >
            <path
              data-truth-trail-guide
              d={strandPath(Math.max(viewH, 1), STEP_X, GUIDE_PHASE)}
              stroke="transparent"
            />
          </svg>

          {/* Rail A — LORE · continuous. The artist's jittered dots
              (rail-a.svg) in the frame's own ochre. It STARTS at its
              lettering (RAIL_A_START) and then runs unbroken to the foot, not
              even breaking at the count (#CB7722 stands on both the egg white
              and the charcoal).

              ⚠ THE HEAD IS CLIPPED, NOT DELETED FROM THE ASSET. The redesign
              hides the strand's top 23 dots, and editing them out of
              rail-a.svg would reproduce that at the head — but the mask
              repeats down the screen every ART_H (1087.7px), so every tile
              would carry the same 221px hole. On a screen taller than that
              (2560 × 1440 at 100%, a 4K panel at 150%) the second tile's hole
              lands at 1088 → 1309, inside the opaque band above the foot
              fade. The clip removes the head of the FIRST tile only, leaves
              every later tile continuous, and leaves the exported strand as
              the artist drew it. Static style; nothing here moves. */}
          <div
            className="absolute top-0 h-full"
            style={{
              left: INK_X - ART_MID,
              color: LORE_COLOR,
              clipPath: `inset(${RAIL_A_START}px 0 0 0)`,
              WebkitClipPath: `inset(${RAIL_A_START}px 0 0 0)`,
              ...strandMask("/artwork/rail-a.svg"),
            }}
          />

          {/* Rail B base — RECORD · dots ahead (faint). The smooth strand
              (rail-b.svg); its ink is the painter's — charcoal on the egg
              white, canvas on the dark bands (`--rail-base-ink`) — at a
              constant quarter strength. */}
          <div
            className="absolute top-0 h-full opacity-25"
            style={{
              left: STEP_X - ART_MID,
              color: "var(--rail-base-ink)",
              ...strandMask("/artwork/rail-b.svg"),
            }}
          />

          {/* Rail B fill — the page-progress ink: the lore ochre flowing
              through the faint dots to the pointer, in both directions
              ([data-v2-steps-fill], clipped open by the motion module and
              derived from scroll each frame through the SAME map the pointer
              rides). Renders from the first paint, empty until measured —
              the module wires the clip at init. */}
          <div
            data-v2-steps-fill
            className="absolute left-0 top-0"
            /* Sized explicitly: the run inside is absolutely positioned, and
               a clip-path in percentages needs a box to clip. */
            style={{
              width: RAIL_W,
              height: Math.max(viewH, 1),
              clipPath: "inset(0% 0% 100% 0%)",
            }}
          >
            <div
              className="absolute top-0 h-full"
              style={{
                left: STEP_X - ART_MID,
                color: LORE_COLOR,
                ...strandMask("/artwork/rail-b.svg"),
              }}
            />
          </div>
        </div>

        {/* G1 / "the guide leading the eye": the gated-deck controller writes
            only transforms, opacity and the rail's ink custom properties. The
            viewport-height guide above is the source of the pointer's lateral
            position and tangent; its y is the mapped page progress
            (truth-rail-map.ts), inside the travel box the map exports
            (RAIL_TRAVEL_TOP / RAIL_TRAVEL_BOTTOM_INSET). */}
        <div
          data-truth-trail-traveller
          className="absolute left-0 top-0 h-0 w-0 opacity-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
          <img
            data-truth-trail-pointer
            src="/artwork/trail-point.svg"
            alt=""
            className="absolute left-[-22px] top-0 w-24 max-w-none -translate-y-1/2"
            loading="eager"
          />
          {/* The era the arrow is pointing at, riding with it. Empty here and
              filled by the deck on each slide change: the strings live in the
              section's own gutter block (or the count's own figure years), so
              there is one source for what the era is.

              NEVER GOLD. The artwork beside it is baked gold at 1.72:1 on the
              light ground (open-questions.md) and is already flagged for a
              light-ground cut; type must not inherit that. The colours ride
              `--rail-ink` / `--rail-ink-sub` — ochre-deep/charcoal on the egg
              white, canvas on the dark bands — stepped by the painter at the
              1950s' own crossover (truth.css, `[data-rail-dark]`). */}
          {/* Always rendered, even with no room for it — the deck looks these
              nodes up once at init, so a box that only appears after a resize
              would never be found and the label would stay blank until a
              reload. With no room it is a zero-width clip instead. */}
          {/* `py-3` is CLIP HEADROOM, not spacing: the box is overflow-hidden
              (the width clip when the reading column leaves no room) and the
              stack inside translates vertically between its two layouts —
              year centred on the arrow's axis alone, stacked above a sub —
              so the clip bounds need 12px of slack each way. Symmetric, so
              the -translate-y-1/2 centring is unmoved. The stack wrapper
              exists because the deck's year count owns the label <p>'s own
              transform (scale) — the layout shift has to ride a parent or
              the two writes would fight (truth.css owns the geometry;
              user direction, 15 September 2026). */}
          <div
            data-truth-trail-label-box
            className="absolute top-0 -translate-y-1/2 overflow-hidden py-3"
            style={{ left: LABEL_X, width: labelWidth }}
          >
            <div data-truth-trail-label-stack>
              <p
                data-truth-trail-label
                className="eyebrow text-xl"
                style={{ color: "var(--rail-ink)" }}
              />
              <p
                data-truth-trail-sub
                className="mt-1 text-sm font-normal uppercase leading-relaxed"
                style={{ color: "var(--rail-ink-sub)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The mobile timeline — the homepage's TWO-LINE RAIL, sticky at the foot of
 * the screen (user direction, 15 September 2026, superseding the same day's
 * per-era wave strips; grammar row "the guide leading the eye, Truth mobile
 * cut"). One persistent instrument, styled exactly as the homepage styles
 * its SCR-10 pair: Rail B is `truth-dotted-path.svg` bleeding past both
 * edges, Rail A the SAME artwork recoloured `--color-burnt` through a mask
 * a line below it (no new asset — the paths come off the homepage manifest,
 * `homeTruthArtwork`, so there is one source for what they are), and the
 * homepage's `truth-year-marker.svg` arrow rides Rail B pointing down at
 * the line with the era's SHORT mark above it — "Before people", never
 * "Before people · about 100 million years ago"; the full line lives in the
 * section. Geometry and colours in truth.css.
 *
 * Everything that MOVES — the marker's x and the year (both following the
 * section most visible on screen, measured off the live layout: user
 * direction, 16 September 2026), the year swaps, the bar's own
 * arrival with the chronology — is truth-mobile-rail.ts's. At rest the bar
 * is invisible (`opacity-0`); under reduced motion the module never runs
 * and the bar simply never shows, the same absence as the desktop
 * traveller.
 */
export function TruthTrailBar() {
  return (
    <div
      aria-hidden
      data-truth-trail-bar
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 opacity-0 lg:hidden"
    >
      {/* ⚠ EVERY PIECE IS A MASK, NOT AN <img>. The homepage draws this
          pair over dark photography and its artwork is baked #FCF7F0 —
          measured here, the dots simply vanish on /truth's egg white. So
          the SAME files render as alpha masks over token colours (the
          technique home-hero.css itself uses for Rail A): Rail B in ochre,
          Rail A in burnt, the marker a single-ink stamp of the homepage
          silhouette in charcoal — canvas over the dark bands. The forms
          are the homepage's exactly; only the ink adapts to the ground,
          as everything on this page does. Geometry in truth.css. */}
      <div data-truth-bar-line className="truth-bar-line">
        <span className="truth-bar-path-a" />
        <span className="truth-bar-path" />
        <div data-truth-bar-marker className="truth-bar-marker">
          <p data-truth-bar-year className="headline truth-bar-year" />
          <span className="truth-bar-marker-art" />
        </div>
      </div>
    </div>
  );
}

/* The travel box is shared with the painter and the masks; re-exported so
   truth.css's numbers have one named source to cite. */
export { RAIL_TRAVEL_TOP, RAIL_TRAVEL_BOTTOM_INSET };
