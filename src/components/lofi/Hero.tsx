"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { SettleText } from "@/components/lofi/ui/SettleText";
import type { Beat } from "@/content/lofi/homepage";
import { heroNightSlot, heroPathArtwork, heroSlot } from "@/content/lofi/media";
import { onEnter } from "@/lib/site-entry";

/**
 * Beat 1 — Welcome to Country.
 *
 * ★ TYPE AND LAYOUT COME FROM THE LO-FI, node 3:2 ("01 Welcome to Country
 * (hero) · 100vh"). IMAGERY COMES FROM MARC'S HI-FI. That split is deliberate:
 * where the two disagree on text, the lo-fi wins.
 *
 * FROM THE LO-FI (node 3:2, measured — not chosen here)
 *   frame          1440×900. Content block x=100, y=438, w=900, h=398, so it
 *                  sits low with a 64px tail — 7vh, held in vh so it keeps its
 *                  proportion rather than collapsing on a taller viewport.
 *   container      1240 wide with 100px gutters at 1440
 *   headline       Display/96 · Block Berthold Regular · 96 / **120%** · w900
 *   body           Body/Lead-24 · Work Sans Medium · 24 / 150% · w700
 *   cue            Accent/Scroll-32 · GoodDog Plain · 32 / 150% · "↓ Scroll"
 *   gaps           24px between all three
 *
 * ⚠ NO EYEBROW, AND THAT IS THE LO-FI'S CALL, NOT AN OMISSION.
 * Node 3:2 contains three text nodes — headline, body, cue. There is no
 * eyebrow. homepage.ts already anticipated this: "The draft shows no eyebrow
 * on the hero, unlike the other beats ... it is a design-level call, so the
 * wireframes decide whether it renders." The wireframe has now decided.
 * Marc's hi-fi does carry one ("WELCOME TO COUNTRY", 32px) — a logged
 * divergence. `beat.eyebrow` is still in the content model, so restoring it is
 * one <SettleText> if the team goes the other way.
 *
 * FROM MARC'S HI-FI (frames 17:256 sunset / 17:2802 night)
 *   photograph     node 17:257 / 17:2803 → public/media/
 *   dotted path    node 17:312, 562 vectors → public/brand/artwork-path.svg
 *   cue colour     #fbae3d, Figma paint style "Warm/Yellow Gold"
 *
 * ⚠ The lo-fi's image annotation asks for "escarpment / first light". The
 * photograph we have is a road at sunset, which is `country` and unrestricted.
 * An escarpment IS cultural-site material — if that swap ever happens, the
 * night-to-day cross-fade below stops being permitted and the frame becomes
 * static. Do not swap the asset without re-reading permissions.md.
 *
 * ⛔ THE DOTTED PATH DOES NOT MOVE. It is the artist's supplied artwork and
 * permissions.md records no motion permission: "static imagery only". Stamped
 * data-static, which every motion module checks. It is also NOT sketch C1 —
 * see heroPathArtwork in media.ts for why that distinction matters.
 *
 * ⚠ Copy is the draft's, per D5. Marc's hi-fi body is a different sentence
 * ("YACHATDAC is a living thread between Country, culture, ..."). Raise it.
 *
 * THE ENTRY — "the clock, wound back"
 * -----------------------------------
 * The night frame sits over the sunset frame and clears on entry, so the page
 * opens at night and dawn breaks under the settling headline. Two existing
 * sketches, not a third invented one:
 *   A1  sky as background clock, run backwards — A2 runs it forward on scroll
 *   B5  type that settles, line by line
 * Opacity only in the per-frame path.
 *
 * Motion: X1 loader hands off · X2 cue killed on first scroll · X5 scrim ·
 * X6 no rewind and no loop under reduced motion.
 */

/**
 * Two hi-fi frames may be two OPTIONS rather than a sequence — see
 * heroNightSlot. false renders the sunset frame alone, as drawn.
 */
const HERO_NIGHT_ENTRY = true;

export function Hero({ beat }: { beat: Beat }) {
  const [entered, setEntered] = useState(false);
  const [cueLive, setCueLive] = useState(true);

  useEffect(() => onEnter(() => setEntered(true)), []);

  // X2: killed permanently on first scroll, not paused. It does not come back.
  useEffect(() => {
    if (!cueLive) return;
    const kill = () => setCueLive(false);
    window.addEventListener("scroll", kill, { passive: true, once: true });
    return () => window.removeEventListener("scroll", kill);
  }, [cueLive]);

  return (
    <section
      id={beat.id}
      data-motion="A1-reverse+B5"
      data-lofi="3:2"
      data-hifi="17:256"
      className="relative flex min-h-svh items-end overflow-hidden bg-charcoal"
    >
      {/* No JS means nothing ever calls markEntered(), and the night frame
          would sit over the hero permanently. Uncover it. */}
      <noscript>
        <style>{`[data-hero-night]{opacity:0}`}</style>
      </noscript>

      {/* Sunset — the settled state, and what the beat's mediaNote asks for.

          GUARDED, because public/media/ is the client media library and is
          gitignored — it lives in Drive today and moves into the CMS at launch.
          On any machine but the one these were dropped onto, `src` is absent,
          and a hero that 404s reads as a broken build rather than as an empty
          slot. Same fallback shape as MediaTile: say what the slot expects. */}
      {heroSlot.src ? (
        <Image
          src={heroSlot.src}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          data-bucket={heroSlot.bucket}
          className="object-cover"
        />
      ) : (
        <div
          aria-hidden
          data-placeholder="media"
          data-bucket={heroSlot.bucket}
          className="absolute inset-0 bg-canvas/10"
        >
          <p className="absolute inset-x-0 top-0 p-4 text-[11px] leading-snug text-canvas/45">
            [ IMAGE — {heroSlot.expects} ]
          </p>
        </div>
      )}

      {/* Night — the opening state. Clears on entry.

          REDUCED MOTION IS HANDLED IN CSS HERE, NOT IN JS, and the reason is
          specific: usePrefersReducedMotion reports `true` on the server, so
          gating this layer on it would keep the night frame out of the
          server-rendered HTML entirely. It would mount only after hydration —
          late, un-preloaded, popping in over a hero the reader is already
          looking at. Rendering it always and hiding it with
          `motion-reduce:hidden` keeps it in the initial payload and still
          makes it genuinely absent for anyone who asked for less motion. */}
      {HERO_NIGHT_ENTRY && heroNightSlot.src ? (
        <Image
          src={heroNightSlot.src}
          alt=""
          aria-hidden
          data-hero-night
          fill
          priority
          sizes="100vw"
          data-bucket={heroNightSlot.bucket}
          className={`object-cover transition-opacity duration-[1600ms] ease-country motion-reduce:hidden ${
            entered ? "opacity-0" : "opacity-100"
          }`}
        />
      ) : null}

      {/* X5 — directional scrim. Marc lays a flat #000 at 40% over the whole
          frame; this is shaped toward the copy, where it is actually needed,
          and leaves the sky readable. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-charcoal/90 via-charcoal/35 to-charcoal/45"
      />

      {/* ⛔ Supplied artwork. Static — see file header. Lo-fi and hi-fi agree on
          placement: low, right, running off the edge. */}
      <div
        aria-hidden
        data-media-tile={heroPathArtwork.id}
        data-bucket={heroPathArtwork.bucket}
        data-static=""
        className="pointer-events-none absolute right-0 bottom-[7%] w-[68%] max-w-[60rem]"
      >
        {/* Plain <img>, not next/image: this is a two-tone SVG (281 paths at
            #F6F6EC over 281 in black) and the optimiser has nothing to do to a
            vector. Do NOT add a filter to recolour it — the two tones are the
            artwork, and altering them is "transforming an artwork element". */}
        {heroPathArtwork.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroPathArtwork.src}
            alt=""
            className="h-auto w-full opacity-80"
          />
        ) : null}
      </div>

      {/* Lo-fi container: 1240 wide, 100px gutters at 1440. */}
      <div className="relative mx-auto w-full max-w-310 px-6 pb-[max(3rem,7vh)] lg:px-0">
        {/* 900px column, 24px gaps — both from node 3:4. */}
        <div className="flex max-w-225 flex-col gap-6">
          <SettleText
            as="h1"
            mode="enter"
            text={beat.headline}
            className="headline text-4xl leading-[1.2] tracking-normal text-canvas sm:text-6xl lg:text-display"
          />

          {beat.body.map((paragraph, index) => (
            <SettleText
              key={paragraph}
              as="p"
              mode="enter"
              delayMs={120 + index * 90}
              text={paragraph}
              className="max-w-175 text-base leading-normal font-medium text-white lg:text-lead"
            />
          ))}

          {/* Accent/Scroll-32. The lo-fi carries the arrow; Marc's does not. */}
          <p
            aria-hidden
            data-motion="X2"
            className={`callout text-2xl leading-normal text-gold lg:text-scroll ${
              cueLive ? "scroll-cue" : ""
            }`}
          >
            ↓ Scroll
          </p>
        </div>
      </div>
    </section>
  );
}
