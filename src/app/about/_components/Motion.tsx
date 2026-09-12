"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { register, start, stop, watchVisibility } from "@/lib/motion-controller";
import { breath } from "@/lib/motion/recipes";
import {
  boardHandoff,
  coverSeams,
  doorsAssembly,
  heroQuiet,
  theLoop,
  theRegister,
  partnersDots,
  peopleWave,
  theQuestion,
  valuesRelay,
} from "@/lib/motion/recipes-about";

/**
 * /about — the page's motion script. Verb: ANSWERS.
 *
 * THE SEAMS, AND THE PAGE'S TWO HELD SCREENS. This host wires the ten section
 * joins of Figma `REF · SCORE · 05 ABOUT` (2642:19666), the X4 baseline
 * arrivals, and — from 12 September 2026, user direction — the interiors of
 * §02 (`theRegister`), §03 (`theQuestion`) and §04 (`theLoop`). Group G's eight
 * waypoints and the remaining section interiors are still unbuilt. Renders
 * nothing.
 *
 * ⚠ THREE HELD SCREENS ON A PAGE THE GRAMMAR BUDGETS ONE PIN FOR, on top of
 * the eight the deck already spends. Both were user directions and both are
 * flagged for design sign-off in scenes.md. Neither is a GSAP pin — they are
 * sticky spans in about.css, so they do not fight the deck's own pins.
 *
 * THE SCENE LEDGER, so the pacing is readable here as well as in the docs:
 *
 *   §01 hero          media       110vh   ⚡4   (baseline only this pass)
 *   §02 what-we-are   type        300vh   ⚡3   HELD — the name resolves, the
 *                                                facts arrive one at a time
 *   §03 why-we-exist  type        300vh   ⚡5   HELD — the claims leave, the
 *                                                ground goes out, the question
 *   §03b breath       none         55vh   ⚡1   the hold
 *   §04 what-we-do    media       300vh   ⚡4   HELD — each clause builds its
 *                                                card, the loop closes
 *   §05 how-we-work   type        249vh   ⚡2
 *   §06 who-decides   TRANSITION  245vh   ⚡4   navy wave in · overlap out
 *   §07 the-people    media       145vh   ⚡3
 *   §08 partners      type        175vh   ⚡2
 *   §09 get-in-touch  TRANSITION  140vh   ⚡3   charcoal wave in · the doors
 *   §10 footer        none        135vh   ⚡1
 *
 * THE PAGE IS A DECK (user direction, 8 Sep 2026): a section is a slide —
 * read normally to 100% (its foot at the viewport's, the rail's own 100%),
 * at which point the transition PLAYS: the outgoing slide holds while the
 * incoming one runs over it, wave on its crest, wheel held until it lands.
 * Entering a seam from above plays it; from below, rewinds it. Eight seams
 * are gated (see the pair list in the effect below). ⚠ That spends eight
 * pins where the grammar budgets one per page (§03's, still unspent for the
 * interiors pass) — a deliberate deviation, flagged for design sign-off.
 *
 * TWO SEAMS DELIBERATELY HAVE NO CODE: 03 → 03b is the page's only hard cut
 * ("nothing carries — that is the point") and 09 → 10 is continuous charcoal.
 * The Guide's departure at the footer (G4) is ▲ Leonard Mickelo's to approve;
 * `data-ab-guide="g4"` is the reserved hook name when it is.
 *
 * Waits for fonts before building — the arrivals split nothing, but trigger
 * positions are measured from layout, and Block Berthold arriving late moves
 * every section foot on a cold cache.
 */
export function AboutMotion() {
  useEffect(() => {
    let disposed = false;
    const unregister: Array<() => void> = [];

    const build = () => {
      if (disposed) return;
      const find = (name: string) =>
        document.querySelector<HTMLElement>(`[data-ab="${name}"]`);

      const wire = (
        el: HTMLElement | null,
        make: (e: HTMLElement) => ReturnType<typeof breath>,
      ) => {
        if (el) unregister.push(register(make(el)));
      };

      // The deck (user direction, 8 Sep 2026): nine of the ten seams are
      // gated slides — the outgoing section holds at 100% read, charges,
      // and the incoming one plays over it. The Breath, shorter than a
      // viewport, gates at "top top" (coverSeams decides that per slide),
      // so its photograph stops at the top of the page with §04 riding
      // directly against its horizon. 03 → 03b gates like every seam but
      // stays waveless and ruleless — the scored hard cut survives as
      // charcoal covering charcoal. NOT gated: only 09 → 10 (continuous
      // charcoal into the footer, which lives outside the page tree).
      // Deviates from the score's played-wave reading and the one-pin
      // budget; flagged for design sign-off.
      const seamPairs: Array<[string, string]> = [
        ["hero", "what-we-are"],
        ["what-we-are", "why-we-exist"],
        ["why-we-exist", "breath"],
        ["breath", "what-we-do"],
        ["what-we-do", "how-we-work"],
        ["how-we-work", "who-decides"],
        ["who-decides", "the-people"],
        ["the-people", "partners"],
        ["partners", "get-in-touch"],
      ];
      const pairs = seamPairs.flatMap(([out, over]) => {
        const a = find(out);
        const b = find(over);
        return a && b ? [{ out: a, over: b }] : [];
      });
      if (pairs.length) unregister.push(register(coverSeams(pairs)));

      wire(find("hero"), (el) => heroQuiet(el, 110));
      // §02 is the page's other held screen — the register writes itself.
      // 200 is derived the same way §03's is: the section's 300vh less the one
      // viewport its sticky screen is held for. `roadScreen` is gone; the road
      // is a beat inside this sequence now, and its parallax with it (F7 —
      // see the note at `theRegister`).
      wire(find("what-we-are"), (el) => theRegister(el, 200));
      // §03 is the page's one held screen. 200 is derived, not chosen — the
      // section's 300vh less the one viewport its sticky screen is held for.
      // The deck's BUFFER does NOT come off it; see the arithmetic and the
      // measurement at `theQuestion`.
      wire(find("why-we-exist"), (el) => theQuestion(el, 200));
      wire(find("breath"), (el) => breath(el, 55));
      // §04 is the page's third held screen — the loop closes. 200 is derived
      // the same way §02's and §03's are: the section's 300vh less the one
      // viewport its sticky screen is held for.
      wire(find("what-we-do"), (el) => theLoop(el, 200));
      wire(find("how-we-work"), (el) => valuesRelay(el, 249));
      wire(find("who-decides"), (el) => boardHandoff(el, 245));
      wire(find("the-people"), (el) => peopleWave(el, 145));
      wire(find("partners"), (el) => partnersDots(el, 175));
      wire(find("get-in-touch"), (el) => doorsAssembly(el, 140));

      start();
    };

    if (document.fonts?.status === "loaded") build();
    else void document.fonts?.ready.then(build);

    // Triggers are created at two moments (the rail at mount, the recipes
    // after fonts), and a layout settle between them left the two families
    // measured against different documents — seams landed ~400px off. One
    // refresh after everything has settled re-measures every trigger against
    // the same layout.
    const settle = window.setTimeout(() => ScrollTrigger.refresh(), 900);

    const unwatch = watchVisibility();
    return () => {
      disposed = true;
      window.clearTimeout(settle);
      unwatch();
      unregister.forEach((fn) => fn());
      stop();
    };
  }, []);

  return null;
}
