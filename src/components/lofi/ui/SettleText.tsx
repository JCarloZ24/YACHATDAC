"use client";

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type ElementType,
} from "react";
import { useInView, usePrefersReducedMotion } from "@/lib/motion";
import { onEnter } from "@/lib/site-entry";

/**
 * B5 — Type that settles. "Line-level mask, yPercent 110→0, 90ms stagger,
 * expo.out. Workhorse for every heading."
 *
 * WHY THIS IS CSS AND NOT GSAP
 * ----------------------------
 * B5 is the workhorse for *every* heading, which means Tier 2 and CMS pages
 * use it too — and those must never pull GSAP. Transform and a transition
 * delay do the whole job, so the behaviour lives at Tier 2 and the homepage
 * simply also uses it. Nothing here reaches the motion controller.
 *
 * SPLIT BY LINE, NOT BY CHARACTER
 * -------------------------------
 * The type rule is explicit: "Split text by line or word. Never by character:
 * it breaks screen readers and reads as a gimmick against this brand."
 *
 * Words are the DOM unit here — each gets its own mask — but the *stagger* is
 * keyed to which visual line a word landed on, measured from layout. So whole
 * lines rise together, which is what B5 asks for, without restructuring the
 * DOM into line wrappers that would fight React and break on reflow. A
 * ResizeObserver re-measures, so the stagger survives a resize.
 *
 * The full string stays in the accessibility tree as ordinary text.
 */

/** Fixed by the token set: "headline lines 90ms". */
export const LINE_STAGGER_MS = 90;

type SettleTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  /**
   * "inView" — settles when scrolled to. The default, and what every heading
   * below the fold wants.
   * "enter"  — settles when the loader hands off. For the hero only: it is
   * already in view at load, so an inView trigger would fire behind the panel.
   */
  mode?: "inView" | "enter";
  /** Added to every line's delay, for sequencing against a sibling. */
  delayMs?: number;
};

export function SettleText({
  text,
  as: Tag = "h2",
  className = "",
  mode = "inView",
  delayMs = 0,
}: SettleTextProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  const prefersReduced = usePrefersReducedMotion();
  const [entered, setEntered] = useState(false);
  const [lineOf, setLineOf] = useState<number[]>([]);

  useEffect(() => {
    if (mode !== "enter") return;
    return onEnter(() => setEntered(true));
  }, [mode]);

  // Which visual line did each word land on? offsetTop is layout position and
  // is unaffected by the transform, so this is safe to read at any time.
  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReduced) return;

    const measure = () => {
      const words = [...root.querySelectorAll<HTMLElement>("[data-word]")];
      const tops = words.map((word) => word.offsetTop);
      const rows = [...new Set(tops)].sort((a, b) => a - b);
      setLineOf(tops.map((top) => rows.indexOf(top)));
    };

    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [text, prefersReduced]);

  // X6 — the settled state, as plain text. No masks, no transforms, nothing
  // to play. This is also what the server renders.
  if (prefersReduced) {
    return (
      <Tag ref={ref} className={className}>
        {text}
      </Tag>
    );
  }

  const shown = mode === "enter" ? entered : inView;

  return (
    <Tag ref={ref} className={className}>
      {text.split(/\s+/).map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          {index > 0 && " "}
          {/* The mask. Padding and matching negative margin keep descenders
              from being clipped by the overflow. */}
          <span
            data-word
            aria-hidden
            className="inline-block -mb-[0.18em] overflow-hidden pb-[0.18em] align-bottom"
          >
            <span
              className={`inline-block transition-transform duration-(--dur-large) ease-country ${
                shown ? "translate-y-0" : "translate-y-[110%]"
              }`}
              style={{
                transitionDelay: `${(lineOf[index] ?? 0) * LINE_STAGGER_MS + delayMs}ms`,
              }}
            >
              {word}
            </span>
          </span>
        </Fragment>
      ))}
      {/* The masks above are aria-hidden so the heading is not read as a pile
          of disconnected words. This is the copy the reader actually gets. */}
      <span className="sr-only">{text}</span>
    </Tag>
  );
}
