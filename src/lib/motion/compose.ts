"use client";

/**
 * Compositions — screen recipes.
 *
 * THE PROBLEM THIS SOLVES
 * -----------------------
 * A vocabulary of named effects is not immersion. Lumen is not dense because it
 * has forty effects; it is dense because every screen runs three or four at
 * once. Our code fired one effect per element, which is exactly why the result
 * read as a list of tricks rather than as a place.
 *
 * The hi-fi proves it. Living Work §02 runs, on one screen: a pin, the aperture
 * opening in three stages, four figures cycling, a progress rail drawing, a
 * full-bleed break-out, and a Flip handoff into the next section's heading. Six
 * behaviours, one timeline, one meaning.
 *
 * So a composition is a named recipe: a screen's worth of layered motion, built
 * once, with its scroll span and its loud channel declared.
 *
 * WHAT A COMPOSITION OWNS THAT AN EFFECT DOES NOT
 * -----------------------------------------------
 *   - the ScrollTrigger, and therefore the span in vh
 *   - the ordering and overlap of several effects
 *   - the reduced-motion cut for the whole screen
 *   - the loud-channel declaration, asserted in development
 *
 * Effects stay pure builders that know nothing about scroll. That separation is
 * what lets `pushIn` serve a hero, a scrub and a composition without three
 * copies of it existing.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "@/lib/motion-controller";
import {
  registerYachatdacEffects,
  revertSplits,
  type EffectName,
} from "@/lib/motion/effects";
import { clampScrollTo } from "@/lib/motion/smooth-scroll";
import { SCRUB } from "@/lib/motion/tokens";

gsap.registerPlugin(ScrollTrigger);

/**
 * F7's pacing law: every screen declares ONE loud channel and keeps the other
 * two quiet. Plain text means a big media or transition moment; plain media
 * means big type. This is what stops "cinematic everywhere" becoming noise, and
 * it is the only reason a page can carry this much motion and still be read.
 */
export type LoudChannel = "media" | "type" | "transition" | "none";

export type CompositionSpec = {
  /** Which effects are allowed to be loud on this screen. */
  channel: LoudChannel;
  /** Scroll cost in vh. Required — a pin without a documented span is the
      thing that makes a reader think the page is broken. */
  span: number;
  /** Whether the screen pins. */
  pin?: boolean;
  /**
   * Minimum viewport width the composition is allowed to build at, as a CSS
   * length. Below it the screen takes its `cut` instead — the same branch
   * reduced motion gets, which lands on the server markup.
   *
   * For screens whose device IS the desktop: a pin, a FLIP hand-off or a
   * clip-path measured against a glyph box are choreography for a window you
   * can see all of at once. On a phone they cost enormous scroll, fight the
   * touch scroller, and measure against a layout that has since reflowed.
   * Leaving them off is not a downgrade — the markup is already the finished
   * document, which is the same property the reduced-motion cut relies on.
   */
  minWidth?: string;
  /**
   * Minimum viewport HEIGHT the composition is allowed to build at. Same
   * contract as `minWidth` — below it the screen takes its `cut` — and a
   * screen may declare either, both, or neither.
   *
   * It exists because a held screen is withheld by height as well as width.
   * `globals.css`'s `deck:` and `hold:` variants both carry
   * `(min-height: 820px)` for a stated reason: "a slide taller than its screen
   * is a trap, because the snapping pulls the reader back to the top of the
   * thing they were trying to see the bottom of". When the layout withholds
   * the sticky screen on a short window, the motion has to stand down on the
   * same query or it animates a held screen that is not held —
   * `src/lib/motion/record.ts` writes the query out longhand for exactly this
   * reason, and this is that agreement made declarable.
   */
  minHeight?: string;
  /**
   * Minimum viewport width at which the screen is allowed to PIN. Below it the
   * composition still builds — same timeline, same entrance — it just does not
   * hold the section still.
   *
   * Different from `minWidth`, and the distinction matters: a pin is a
   * desktop affordance (it costs scroll and argues with a touch scroller),
   * but the thing the pin was holding still for is usually worth keeping.
   */
  pinMinWidth?: string;
  /** Snap points, for step-throughs. `1 / (steps - 1)`. */
  snap?: number;
  /**
   * The effects this recipe reaches for.
   *
   * Declared rather than detected: GSAP does not tag a tween with the effect
   * that made it, and inferring it would be guesswork. Declaring it costs one
   * line, makes the loud-channel assertion real, and doubles as the recipe's
   * own documentation — you can read what a screen does without reading its
   * build function.
   */
  uses: EffectName[];
  /**
   * Scrubbed motion — tied to scroll position. Parallax, ramps, apertures,
   * counters: anything where the reader is running the projector.
   */
  build: (tl: gsap.core.Timeline, root: HTMLElement) => void;
  /**
   * Entry motion. Defaults to a single arrival; enterScrub opts into a
   * reversible scroll entrance (Wonder, user direction 9 September 2026).
   */
  enter?: (tl: gsap.core.Timeline, root: HTMLElement) => void;
  /**
   * Where the entry trigger starts. Default "top 82%". A screen that follows
   * a pinned scene sits parked at the viewport's bottom edge until the pin
   * releases — give it "top 95%" so its arrival reads as the pin's hand-off
   * rather than a beat of blank ground.
   */
  enterStart?: string;
  /** Tie entry progress to scroll and retrace it on return. Grammar: X4. */
  enterScrub?: boolean;
  /** End of a scrubbed entry. Default "top 20%". */
  enterEnd?: string;
  /** The cut. Final state, instantly. No tweens with a duration, no pins. */
  cut: (root: HTMLElement) => void;
};

/**
 * Effects that count as loud in each channel.
 *
 * Used by the development assertion below. This is deliberately a short list:
 * the question is not "does this move" — on this site nearly everything moves —
 * but "does this take the screen".
 *
 * `waveHandoff` is deliberately NOT here, though it is a transition effect. A
 * 9vw divider rising at the foot of a hero is furniture: it carries one ground
 * into the next without ever competing for attention. `groundRamp` walking a
 * colour across four screens is the loud version of the same idea, and that one
 * is listed. The distinction is scale, not category.
 *
 * `escape` was missing and is a straightforward omission rather than a
 * judgement: the grammar defines it as "`handoff` made reversible", `handoff`
 * has always been listed, and a card that becomes the entire screen is the
 * loudest transition available. It was absent because nothing had used it, so
 * the gap never fired. Added with `gathering`, the first recipe that does.
 *
 * `scatterResolve` stays OUT, and that is a judgement. The grammar's variants
 * table files it in the loud column of "what radiates", but this list asks a
 * narrower question — does it *take the screen* — and cards arriving into their
 * own grid does not, whatever its amplitude. Same reasoning as `emanate` and
 * `triad`, which are loud in the grammar and absent here too.
 */
const LOUD: Record<Exclude<LoudChannel, "none">, string[]> = {
  media: ["breakOut", "bleed", "plateParallax", "mosaic", "aperture"],
  type: ["aperture", "ghostType", "knockout", "display", "decode"],
  transition: ["groundRamp", "overlap", "handoff", "escape"],
};

/**
 * Fails in development when a screen stacks loud effects from two channels.
 *
 * The rule was written down in F7 and in the motion grammar and then obeyed by
 * memory, which is the same as not being obeyed. A composition declares its
 * channel, so this can be checked rather than remembered.
 *
 * `aperture` appears under both media and type on purpose — it is a typographic
 * device that takes the screen with a photograph, so it is legitimately either,
 * and the declaring composition decides which.
 */
function assertChannel(
  name: string,
  spec: CompositionSpec,
  used: readonly string[],
): void {
  if (process.env.NODE_ENV === "production") return;
  if (spec.channel === "none") {
    const loud = used.filter((u) => Object.values(LOUD).flat().includes(u));
    if (loud.length) {
      throw new Error(
        `[motion] composition "${name}" declares no loud channel but uses ${loud.join(", ")}. ` +
          `A rest screen holds still — that is what makes the loud ones land.`,
      );
    }
    return;
  }

  const allowed = LOUD[spec.channel];
  const trespass = used.filter(
    (u) => !allowed.includes(u) && Object.values(LOUD).flat().includes(u),
  );
  if (trespass.length) {
    const channels = trespass.map(
      (t) =>
        `${t} (${(Object.keys(LOUD) as Array<keyof typeof LOUD>).find((c) => LOUD[c].includes(t))})`,
    );
    throw new Error(
      `[motion] composition "${name}" declares the "${spec.channel}" channel loud, ` +
        `but also uses ${channels.join(", ")}. One loud channel per screen (F7) — ` +
        `keep the other two quiet, or change which channel this screen is loud in.`,
    );
  }
}

/**
 * Build a composition as a MotionModule.
 *
 * Both branches are required by CompositionSpec, so a screen cannot ship
 * without its reduced-motion cut — the same contract scene() enforces, at
 * screen scale.
 */
export function composition(
  name: string,
  root: HTMLElement,
  spec: CompositionSpec,
): MotionModule {
  let mm: gsap.MatchMedia | null = null;

  const init = () => {
    registerYachatdacEffects();
    mm = gsap.matchMedia();

    // Three branches, not two, once a screen declares `minWidth` or
    // `minHeight`: full motion only when the reader wants it AND the window
    // can carry it; otherwise the cut, whichever of the reasons applies.
    //
    // Width and height are ONE gate, not two: a screen is withheld by either,
    // so the complement below negates the pair rather than each half. Negating
    // them separately builds both branches on a window that fails only one.
    const bounds = [
      spec.minWidth ? `(min-width: ${spec.minWidth})` : null,
      spec.minHeight ? `(min-height: ${spec.minHeight})` : null,
    ].filter(Boolean) as string[];
    const wide = bounds.length ? ` and ${bounds.join(" and ")}` : "";

    // The full branch, parameterised by whether it may pin — so a screen can
    // keep its choreography on a phone and give up only the pin.
    const buildFull = (pin: boolean) => () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: `+=${spec.span}%`,
          scrub: SCRUB.normal,
          pin,
          invalidateOnRefresh: true,
          ...(spec.snap
            ? { snap: { snapTo: spec.snap, duration: 0.3, ease: "power2.inOut" } }
            : {}),
        },
      });

      spec.build(tl, root);

      // Entry motion has its own range, before the section's reading span.
      let entryTl: gsap.core.Timeline | null = null;
      let entryTrigger: ScrollTrigger | null = null;
      if (spec.enter) {
        // Build before attaching the trigger so it sees the full duration.
        // Scrubbed entries derive their state from scroll, including restored
        // positions. Single-play entries explicitly complete missed arrivals
        // on refresh so hash links cannot leave the content hidden.
        entryTl = gsap.timeline({ paused: true });
        spec.enter(entryTl, root);
        entryTrigger = spec.enterScrub ? ScrollTrigger.create({
          trigger: root,
          animation: entryTl,
          start: spec.enterStart ?? "top 82%",
          end: spec.enterEnd ?? "top 20%",
          scrub: SCRUB.normal,
        }) : ScrollTrigger.create({
          trigger: root,
          start: spec.enterStart ?? "top 82%",
          // NOT `once`. A one-shot trigger that misses its crossing — a fast
          // scroll, a refresh landing mid-flight, a section whose height
          // changed under it — kills itself having never played, and the
          // screen keeps its `from` state for good. This trigger stays alive
          // and every later crossing simply asks the timeline to play again,
          // which for a finished timeline costs nothing.
          onEnter: () => entryTl?.play(),
          onEnterBack: () => entryTl?.play(),
          onRefresh: (self) => {
            if (self.scroll() >= self.start) entryTl?.progress(1);
          },
        });
      }

      assertChannel(name, spec, spec.uses);

      const detachFocus = revealOnFocus(root, tl);

      return () => {
        detachFocus();
        tl.kill();
        entryTrigger?.kill();
        entryTl?.kill();
      };
    };

    const wantsPin = spec.pin ?? false;
    if (wantsPin && spec.pinMinWidth) {
      // Two branches so a resize across the breakpoint actually re-runs and
      // the pin appears or disappears with it.
      mm.add(
        `(prefers-reduced-motion: no-preference)${wide} and (min-width: ${spec.pinMinWidth})`,
        buildFull(true),
      );
      mm.add(
        `(prefers-reduced-motion: no-preference)${wide} and (not (min-width: ${spec.pinMinWidth}))`,
        buildFull(false),
      );
    } else {
      mm.add(`(prefers-reduced-motion: no-preference)${wide}`, buildFull(wantsPin));
    }

    mm.add("(prefers-reduced-motion: reduce)", () => {
      // The cut. Splits go back to plain text, styles clear, nothing pins.
      revertSplits(root);
      spec.cut(root);
    });

    // Too small and motion-willing: same cut, different reason.
    // `not (...)` rather than a max-width, so the two branches are exactly
    // complementary — a max-width of the same value would ALSO match at the
    // boundary itself and both branches would build.
    if (bounds.length) {
      mm.add(
        `(prefers-reduced-motion: no-preference) and (not (${bounds.join(" and ")}))`,
        () => {
          revertSplits(root);
          spec.cut(root);
        },
      );
    }
  };

  const destroy = () => {
    mm?.revert();
    mm = null;
  };

  return { init, destroy };
}

/**
 * The default cut for most screens: everything at its natural final state.
 *
 * Works because the server markup IS the final state — content is laid out
 * readable, and motion only ever animates *from* somewhere else to here. That
 * is also what makes the JS-disabled case work, and the two are the same
 * property rather than two features.
 */
export function clearAll(root: HTMLElement): void {
  gsap.set(root.querySelectorAll("*"), { clearProps: CLEARABLE });
}

/**
 * Keyboard focus must never land on something the reader cannot see.
 *
 * ⚠ THIS IS A FIX FOR A REGRESSION THE HELD SCREENS INTRODUCED, and the
 * measurement is worth keeping. Every held screen pre-hides its content with
 * `autoAlpha` so nothing can flash before the timeline first renders — and
 * `visibility: hidden` takes an element out of the tab order entirely. Driven
 * in a browser on /about at scroll 0, SEVEN of the page's eleven focusable
 * elements were unreachable: §04's four area cards, §06's governance link,
 * §07's "meet the people" and §08's "partner with us". A keyboard user tabbing
 * from the top reached the four footer links and nothing else
 * (13 September 2026). MOTION-SYSTEM.md: "Keyboard focus visible and never
 * animated out of view."
 *
 * So focus is treated as a request to be somewhere: when it lands on something
 * this section is currently hiding, the page scrolls to the read position where
 * that element is revealed, and the reader sees what they have tabbed to.
 *
 * ⚠ IT CANNOT JUST JUMP TO THE END OF THE READ. That would be right for §06,
 * §07 and §08, whose registers are complete at 1.0 — but §04's cards have
 * CONTRACTED by then, so its four links would still be invisible at the very
 * position meant to reveal them. The section's own timeline is sampled instead:
 * the first progress at which the element is actually visible is the one to
 * scroll to. No per-section table, and it stays correct when a beat sheet moves.
 *
 * Sampling renders the timeline, so progress is restored before returning and
 * the whole walk happens inside one synchronous event — the browser paints once,
 * after it, and the reader sees no flicker.
 *
 * `clampScrollTo` rather than `window.scrollTo`: the deck clamps scroll at a
 * gate and a raw jump fights it.
 */
function revealOnFocus(root: HTMLElement, tl: gsap.core.Timeline): () => void {
  const onFocusIn = (event: FocusEvent) => {
    const el = event.target as HTMLElement | null;
    if (!el || !root.contains(el) || shown(el, root)) return;
    const st = tl.scrollTrigger;
    if (!st) return;

    const was = tl.progress();
    let at: number | null = null;
    for (let i = 0; i <= FOCUS_STEPS; i += 1) {
      tl.progress(i / FOCUS_STEPS, true);
      if (shown(el, root)) {
        at = i / FOCUS_STEPS;
        break;
      }
    }
    tl.progress(was, true);
    if (at === null) return;

    clampScrollTo(st.start + at * (st.end - st.start));
  };

  root.addEventListener("focusin", onFocusIn);
  return () => root.removeEventListener("focusin", onFocusIn);
}

/**
 * 20 is enough to land on the right beat and cheap enough to do on a keypress:
 * on a 200vh read each step is 10vh, and every beat on this page is longer than
 * that. Style is read once per step, only while a reader is actually tabbing.
 */
const FOCUS_STEPS = 20;

/** Visible to a reader — and to the tab order — all the way up to the root. */
function shown(el: HTMLElement, root: HTMLElement): boolean {
  let node: HTMLElement | null = el;
  while (node && node !== root.parentElement) {
    const cs = getComputedStyle(node);
    if (
      cs.visibility === "hidden" ||
      cs.display === "none" ||
      Number(cs.opacity) < 0.05
    ) {
      return false;
    }
    node = node.parentElement;
  }
  return true;
}

/**
 * What the cut is allowed to clear, and why it is a list rather than `"all"`.
 *
 * ⚠ `clearProps: "all"` DOES NOT MEAN "everything GSAP set" — it means every
 * inline style on the element, including ones the application wrote and needs.
 * `next/image` with `fill` positions itself entirely through an inline style
 * attribute (`position:absolute;height:100%;width:100%;inset:0`), so a cut
 * running over a section that contains one left the image with NO style
 * attribute at all: `position: static`, height 0, gone. Measured 12 September
 * 2026 on /about §03 at 1179 × 643, where the photograph collapsed and the
 * section's gradient showed through the hole.
 *
 * The bug was latent for as long as the cut only ran under reduced motion. It
 * surfaced when compositions started declaring `minWidth`/`minHeight`, because
 * that made the cut the ordinary path for any window too small to hold a
 * screen — which is a great many of them.
 *
 * So the cut clears exactly what the motion system is permitted to write.
 * CLAUDE.md states that budget: "Per-frame work is transform, opacity,
 * clip-path and CSS custom properties only." `visibility` is here because
 * `autoAlpha` writes it, and the independent transform properties are here
 * because GSAP writes those separately from the `transform` shorthand.
 *
 * Custom properties are deliberately NOT cleared and do not need to be: every
 * rule that reads one is gated on a flag the recipe's own `cut` removes, so a
 * value left inline is inert. Clearing them by name would put page-specific
 * knowledge in a helper four pages share.
 */
const CLEARABLE = [
  "transform",
  "translate",
  "rotate",
  "scale",
  "opacity",
  "visibility",
  "clipPath",
  "willChange",
].join(",");
