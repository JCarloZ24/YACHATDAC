"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { registerYachatdacEffects } from "@/lib/motion/effects";

/**
 * The click answer — grammar row `the waterline, click cut`, user direction
 * 10 September 2026, in reply to "does it have a click animation".
 *
 * It did not, and the obvious way to give it one does not exist: browsers
 * latch the cursor image while a button is held, so a `:active { cursor: … }`
 * pressed state never repaints. Measured, not assumed — the computed cursor is
 * identical held and released. So the page answers the click instead, with one
 * gold ring blooming at the exact point of contact. That is arguably the
 * better place for it: it marks WHERE the click landed, which a change of
 * cursor cannot say.
 *
 * ⚠ THIS IS A MODULE, NOT AN EFFECT — it owns a listener, and the effects
 * registry is for pure animation builders (see the header of
 * `effects/index.ts`). The animation itself is `clickBloom` and lives there.
 *
 * Mounted once in the root layout, so it is the one piece of motion on the
 * site that is not a page's own. It is allowed to be site-wide because it is
 * not a channel competing with a page's verb — it exists only in the moment of
 * a click, and only where the reader just pressed.
 */

/** Only the primary button. Middle opens tabs and right opens the context
 *  menu; blooming at either would claim a click the page never received. */
const PRIMARY = 0;

export function ClickBloom() {
  useEffect(() => {
    // Touch has no cursor and gets the platform's own tap feedback; doubling
    // it would be noise. Reduced motion opts out of the whole thing.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || still.matches) return;

    registerYachatdacEffects();

    const layer = document.createElement("div");
    layer.dataset.clickBloom = "";
    // `fixed` and viewport coordinates, so the ring stays where the click
    // landed on screen rather than drifting if the page scrolls under it.
    layer.style.cssText =
      "position:fixed;inset:0;z-index:2147483647;pointer-events:none;overflow:hidden";
    document.body.appendChild(layer);

    const onDown = (event: PointerEvent) => {
      if (event.button !== PRIMARY || event.pointerType !== "mouse") return;

      const ring = document.createElement("span");
      ring.style.cssText =
        "position:absolute;border-style:solid;border-color:var(--color-gold);" +
        "border-radius:9999px;transform:translate(-50%,-50%);will-change:width,height,opacity";
      ring.style.left = `${event.clientX}px`;
      ring.style.top = `${event.clientY}px`;
      layer.appendChild(ring);

      // Each ring owns its own timeline and removes itself, so a fast clicker
      // never accumulates nodes and nothing has to be swept up later.
      gsap.effects
        .clickBloom(ring)
        .eventCallback("onComplete", () => ring.remove());
    };

    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", onDown);
      gsap.killTweensOf(layer.querySelectorAll("span"));
      layer.remove();
    };
  }, []);

  return null;
}
