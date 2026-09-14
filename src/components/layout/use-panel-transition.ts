"use client";

import { useEffect, useRef, useState, type TransitionEvent } from "react";

/**
 * A CSS enter/exit transition for a panel that is otherwise `hidden`.
 * Grammar: "the world opening", About nav panel (user direction, 14 September
 * 2026, desktop and mobile). Shared by DesktopNavMenu and MobileNav.
 *
 * The panel is unhidden in its closed pose (`mounted`, not `entered`), that
 * pose is committed, and the flip to open comes a frame later so it is a
 * transition and not the panel's first frame. On close the pose drops in the
 * same render while `mounted` keeps the wrapper unhidden, so the exit has a
 * frame to run in; `hidden` returns on `transitionend`, or after the fallback
 * timer under reduced motion, where the transition is off and the event never
 * fires. 400ms covers --dur-small (320ms) in motion-tokens.css.
 *
 * Use: `hidden={!mounted}` on the wrapper, `data-state` from `entered` on the
 * element that carries the transition, `ref` and `onTransitionEnd` on that
 * same element.
 */
export function usePanelTransition<T extends HTMLElement>(open: boolean) {
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const ref = useRef<T>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Render-phase derived state, so both flips land in the same commit as the
  // change that caused them (the pattern the nav already uses for the route).
  if (open && !mounted) setMounted(true);
  if (!open && entered) setEntered(false);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      void ref.current?.getBoundingClientRect();
      setEntered(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (open || !mounted) return;
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMounted(false), 400);
    return () => clearTimeout(closeTimer.current);
  }, [open, mounted]);

  const onTransitionEnd = (event: TransitionEvent<T>) => {
    if (event.target !== event.currentTarget || entered) return;
    clearTimeout(closeTimer.current);
    setMounted(false);
  };

  return { mounted, entered, ref, onTransitionEnd, state: entered ? "open" : "closed" } as const;
}
