"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * DEV ONLY — the scroll rail.
 *
 * A fixed readout on the right edge: one row per top-level `[data-ab]`
 * section (nested screens like §02's road are the section's interior and are
 * skipped — a row of their own only double-counted §02). A section's fill is
 * READING progress: 0% when it seats (or first shows, for sections shorter
 * than the viewport), 100% when it is fully consumed — its bottom at the
 * viewport bottom. At 100% the page HOLDS: the view stops moving and
 * wheel-down input charges the gate instead — the small TEAL bar is that
 * charge, fed live by the hold's `ab:buffer` events (not by scroll
 * position; during the hold there is no scroll). Idling drains it; a full
 * teal bar is the moment the transition plays. So the order on screen is:
 * gold bar fills → 100%, page stops → teal bar charges → the wave appears
 * and the transition runs → the next section seats and its own bars start.
 * The bottom line of the rail prints every gate decision (`play` /
 * `rewind`, from → to, via the `ab:gate` event) so the deck's thinking is
 * visible.
 *
 * Hidden until asked for: **F10** toggles it. Nothing on the page hints that
 * it exists — an instrument the builder reaches for is not a control the
 * reader should meet. It keeps measuring while hidden, so revealing it
 * mid-scroll shows true state rather than starting from zero.
 *
 * Renders nothing in production builds; the tree ships without it. Rows are
 * built imperatively and updated by direct DOM writes so a 60fps scroll never
 * touches React. Deliberately outside the motion-controller and outside the
 * reduced-motion contract — it is an instrument, not a behaviour.
 */
export function DebugRail() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = rootRef.current;
    if (!host) return;

    // Dev instrument: reachable from the console as `ST` for trigger
    // inspection (ST.getAll(), start/end/progress/pin).
    (window as unknown as Record<string, unknown>).ST = ScrollTrigger;

    // F10 reveals it. preventDefault because F10 opens the menu bar in some
    // browsers; the deck's own keys (paging, arrows, space) are untouched.
    const onToggle = (e: KeyboardEvent) => {
      if (e.key !== "F10") return;
      e.preventDefault();
      host.style.display = host.style.display === "none" ? "flex" : "none";
    };
    window.addEventListener("keydown", onToggle);

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-ab]"),
    ).filter((el) => !el.parentElement?.closest("[data-ab]"));
    const triggers: ScrollTrigger[] = [];
    const bufFills = new Map<string, HTMLElement>();

    sections.forEach((el) => {
      const name = el.dataset.ab ?? "?";
      const row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;gap:6px;";
      const label = document.createElement("span");
      label.textContent = name;
      label.style.cssText =
        "font:9px/1 monospace;color:#f6f6ec;opacity:.4;min-width:86px;text-align:right;";
      const track = document.createElement("div");
      track.style.cssText =
        "width:56px;height:5px;background:rgba(246,246,236,.18);border-radius:2px;overflow:hidden;";
      const fill = document.createElement("div");
      fill.style.cssText = "width:0%;height:100%;background:#d69828;";
      const pct = document.createElement("span");
      pct.textContent = "0%";
      pct.style.cssText =
        "font:9px/1 monospace;color:#d69828;min-width:30px;text-align:right;";
      track.appendChild(fill);
      // The buffer bar — the after-100% allowance before the gate plays.
      const bufTrack = document.createElement("div");
      bufTrack.style.cssText =
        "width:14px;height:5px;background:rgba(50,176,174,.22);border-radius:2px;overflow:hidden;";
      const bufFill = document.createElement("div");
      bufFill.style.cssText = "width:0%;height:100%;background:#32b0ae;";
      bufTrack.appendChild(bufFill);
      row.append(label, track, bufTrack, pct);
      host.appendChild(row);

      const paint = (self: { progress: number; isActive: boolean }) => {
        const p = Math.round(self.progress * 100);
        fill.style.width = `${p}%`;
        pct.textContent = `${p}%`;
        label.style.opacity = self.isActive ? "1" : ".4";
        label.style.color = self.isActive ? "#fbae3d" : "#f6f6ec";
      };

      // Reading progress, matched to the gate geometry: a tall section runs
      // seated → fully consumed (foot at the viewport's = its gate's start);
      // a short one runs first-shown → seated ("top top" IS its gate's
      // start). Either way 100% is the exact scroll where its transition
      // plays.
      const tall = el.offsetHeight > window.innerHeight;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: tall ? "top top" : "top bottom",
          end: tall ? "bottom bottom" : "top top",
          onUpdate: paint,
          onRefresh: paint,
        }),
      );

      // The teal charge bar is event-fed by the hold (see onBuffer below) —
      // only tall sections have one (short slides gate at their seat with
      // no hold).
      if (tall) {
        bufFills.set(name, bufFill);
      } else {
        bufTrack.style.opacity = "0.3";
      }
    });

    // The hold's charge, live. There is no scroll during a hold, so this is
    // the only honest source for the teal bar.
    const onBuffer = (e: Event) => {
      const d = (e as CustomEvent<{ name: string; progress: number }>).detail;
      const f = bufFills.get(d.name);
      if (f) f.style.width = `${Math.round(d.progress * 100)}%`;
    };
    window.addEventListener("ab:buffer", onBuffer);

    // The gate's decisions, printed as they happen.
    const gateLine = document.createElement("div");
    gateLine.textContent = "gate: —";
    gateLine.style.cssText =
      "font:9px/1 monospace;color:#32b0ae;margin-top:6px;text-align:right;";
    host.appendChild(gateLine);
    const onGate = (e: Event) => {
      const d = (
        e as CustomEvent<{
          action: string;
          from: number;
          to: number;
          name?: string;
        }>
      ).detail;
      gateLine.textContent = `gate: ${d.action} ${d.from} → ${d.to}`;
      // A rewind un-earns the seam's charge display.
      if (d.action === "rewind" && d.name) {
        const f = bufFills.get(d.name);
        if (f) f.style.width = "0%";
      }
    };
    window.addEventListener("ab:gate", onGate);

    // Rows for sections already scrolled past (deep links, reloads) paint
    // their true progress instead of resting at 0%.
    requestAnimationFrame(() => triggers.forEach((t) => t.vars.onRefresh?.(t)));

    return () => {
      window.removeEventListener("keydown", onToggle);
      window.removeEventListener("ab:gate", onGate);
      window.removeEventListener("ab:buffer", onBuffer);
      triggers.forEach((t) => t.kill());
      host.replaceChildren();
    };
  }, []);

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      style={{
        position: "fixed",
        right: 8,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 200,
        display: "none",
        flexDirection: "column",
        gap: 4,
        pointerEvents: "none",
        background: "rgba(9,14,18,.72)",
        padding: "8px 10px",
        borderRadius: 8,
      }}
    />
  );
}
