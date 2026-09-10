"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { register, start } from "@/lib/motion-controller";
import { createHomeLoader } from "@/lib/motion/home-loader";
import { homeLoader } from "@/content/homepage";
import { HOME_LOADER_ARTWORK } from "@/content/kit";
import { homeLoaderFilm } from "@/content/homepage-media";
import { INTRO_SEEN_KEY } from "@/lib/intro-gate";

gsap.registerPlugin(useGSAP);

/**
 * Runs during HTML PARSE, before first paint — no flash of the cover on a
 * repeat visit. Copied in shape from lofi/Preloader.tsx:53, including the
 * `currentScript.parentNode` reach-up, which needs no id and no querySelector
 * and does not care when hydration happens.
 *
 * It has to live INSIDE the cover rather than stamping <html> from the root
 * layout: /homepagev2 ships a forked loader carrying the same
 * `data-home-loader` attribute, and a global rule would silently gate that too.
 *
 * The ?intro=1 force is tested here as well as at runtime. If only the runtime
 * honoured it, a forced visit would parse with the cover already hidden and
 * then have to un-hide it — a flash in the opposite direction.
 */
const SKIP_IF_SEEN = `try{if(!/[?&]intro=1(&|$)/.test(location.search)&&sessionStorage.getItem('${INTRO_SEEN_KEY}')){document.currentScript.parentNode.setAttribute('data-seen','');}}catch(e){}`;

/**
 * The homepage opening — a 39-second film, then a door.
 *
 * ⚠ This was a ONE-SECOND cut that dismissed itself (8 September 2026). On
 * 10 September, user direction: the supplied film plays behind it end to end,
 * the 0-100 count is retimed so the film's last frame IS 100%, and the cover
 * then WAITS. It no longer exits on its own — the reader presses the blob.
 * `Skip` fills the count for anyone without 39 seconds, but does not enter:
 * that was explicit, and it is why there are two controls rather than one.
 *
 * So this stopped being a loading cut and became a held opening screen. The
 * loud channel moved with it: the scene note called TRANSITION loud, and a
 * reveal stretched from 0.78s to 39s is by definition quiet, so MEDIA is the
 * loud channel here now (F7 — still exactly one).
 *
 * Reuses supplied vectors (F8 artwork motion permission); no Three.js scene is
 * needed for this flat masked band.
 */
export function HomeLoader() {
  const cover = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cover.current) return;
    const unregister = register(createHomeLoader(cover.current));
    start();
    return unregister;
  }, { scope: cover });

  return (
    <div
      ref={cover}
      data-home-loader
      data-lenis-prevent
      role="progressbar"
      aria-label={homeLoader.label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      className="fixed inset-0 z-[100] overflow-hidden bg-night-black text-gold data-[seen]:hidden motion-reduce:hidden"
    >
      <script dangerouslySetInnerHTML={{ __html: SKIP_IF_SEEN }} />
      <noscript><style>{"[data-home-loader]{display:none!important}"}</style></noscript>
      {/* The film. `muted playsInline` are what make autoplay legal at all;
          the encode is `-an`, so muting removes nothing that was there. No
          `src` in the markup — home-loader.ts attaches one only where the film
          is actually going to play, so a data-saver link and reduced motion
          never spend the bytes (the rule HeroVideo.tsx set on 9 September).
          bg-night-black stays on the root beneath it: a film that fails to
          load leaves charcoal, which is the ground this screen always had.

          `loop` because the cover now WAITS for a press and a reader can sit
          here indefinitely — without it the 40th second is a black screen
          behind a button (user direction, 10 September 2026). The count is
          measured against the FIRST pass only: it reaches 100 as that pass
          ends and stays there, so every later loop is just moving wallpaper
          behind a door that is already open. See home-loader.ts — `loop`
          suppresses `ended`, so the pass is detected from currentTime. */}
      <video
        data-loader-video
        aria-hidden="true"
        muted
        loop
        playsInline
        preload="auto"
        poster={homeLoaderFilm.poster}
        className="absolute inset-0 h-full w-full object-cover opacity-0"
      />
      {/* X5 media scrim — the palette's one sanctioned gradient exception, and
          it has to be graded rather than flat. Measured on 13 frames of the
          actual encode: the film is close to WHITE through the middle (p90
          luminance 0.935 up top, 0.950 mid-frame) and only settles at the foot
          (p90 0.493). Under the flat 45% this replaces, the gold artwork
          measured 1.72 : 1 and even full canvas managed 2.95 — a scrim heavy
          enough to fix that everywhere would have blacked out the film, which
          is the one thing this screen exists to show.

          So the darkness is spent where the interface is and nowhere else:
          20% through the middle (the film, clear), rising to 88% by just over
          half way down. The ramp moved UP from 40-66% when the wordmark and
          PageLoader's larger artwork arrived: that block is 346px tall against
          the 188 it replaced, so its top now sits at 55% of the frame, where
          the old gradient was still only 59% dark and the white wordmark
          measured 3.03 : 1. At 34-54% the wordmark measures 6.38, the gold
          wave 3.97 and the readout 7.36, with the clear band unchanged at 20%.

          The cost is honest: the film's clear window is now the top third
          rather than the top 40%. That is what a taller branded block over a
          near-white film costs, and the alternative was a wordmark nobody
          could read. Skip does not rely on
          this at all — it carries its own ground, because the top of the frame
          is sky and no survivable scrim fixes sky. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(9,14,18,0.45)_0%,rgba(9,14,18,0.20)_16%,rgba(9,14,18,0.20)_34%,rgba(9,14,18,0.88)_54%,rgba(9,14,18,0.92)_100%)]"
      />
      {/* Skip lives in the top-RIGHT corner, out of the film entirely (user
          direction, 10 September 2026). It was centred under the count, which
          put an interface control in the middle of the picture — the one place
          the film is asking to be looked at. Underlined because a bare word in
          a corner over moving footage does not read as pressable.

          ⚠ NO GROUND, on user direction, and this is a known contrast miss.
          Measured across 13 frames of the encode, the top corners are sky:
          raw p90 luminance 0.943 on the right, so cream text lands at
          1.31 : 1 where an interactive control wants 4.5. Both corners are
          equally bad — moving it right did not help (the left was 1.30).
          Bare text needs an 83% scrim there, which is a black bar across the
          top of the film and worse than the thing it fixes. The ways back are
          a ground behind the word, or moving it down beside the artwork where
          the foot is already 86% dark. Left as asked; recorded so it is a
          decision rather than an oversight. */}
      <button
        type="button"
        data-loader-skip
        className="eyebrow absolute top-6 right-6 text-[0.8125rem] leading-[1.4] text-canvas underline decoration-canvas/50 decoration-1 underline-offset-4 opacity-0 transition-colors duration-(--dur-small) ease-quiet hover:decoration-canvas motion-reduce:transition-none lg:top-16 lg:right-16"
      >
        {homeLoader.skip}
      </button>
      {/* The progress artwork, halved and moved to the lower third (user
          direction). It was full-bleed across the vertical centre, which is
          exactly where a 39-second film wants the reader's eyes. The cropped
          dot ring that sat off the left edge is GONE for the same reason —
          the film is the loud channel now, and the ring was a second one.

          A flex column, not the old absolute stack: the blob is in flow and
          holds its space from the first frame at opacity 0, so arriving at
          100% moves nothing. */}
      <div data-loader-art className="absolute inset-x-0 bottom-[6%] flex flex-col items-center px-6 opacity-0">
        {/* The real wordmark, exported whole from the hi-fi navbar — never
            redrawn, never recoloured (CLAUDE.md hard rule 3). Same asset and
            the same h-12/sm:h-16 box PageLoader gives it, so the film's
            opening and Living Work's read as one family (10 September 2026,
            user direction: cohesiveness). */}
        <Image src="/brand/logo-wordmark.svg" alt="YACHATDAC" width={216} height={64}
          className="mx-auto h-12 w-auto sm:h-16" />
        {/* w-[min(80vw,52rem)] is PageLoader's exact figure, not an
            approximation of it — 832px at 1440 against the 576 this was. */}
        <div aria-hidden="true" className="relative mt-14 w-[min(80vw,52rem)]">
          <Image src={HOME_LOADER_ARTWORK.wave} alt="" width={823.37} height={93.25}
            className="block h-auto w-full opacity-10" />
          <div data-loader-wave className="absolute inset-0 [clip-path:inset(0_100%_0_0)]">
            <Image src={HOME_LOADER_ARTWORK.wave} alt="" width={823.37} height={93.25}
              className="block h-auto w-full" />
          </div>
        </div>
        {/* The readout does NOT halve with the artwork: 14px is already the
            floor the type system allows, and half of it is not readable. */}
        {/* PageLoader's readout treatment — mt-8, text-sm, tabular-nums. Held
            at FULL canvas rather than its canvas/60: that 60% is read on solid
            charcoal, and here it sits over a film where it measures 2.4 : 1. */}
        <p aria-hidden="true" className="mt-8 text-sm tabular-nums leading-none text-canvas">
          <span data-loader-count>0</span><span className="ml-1">%</span>
        </p>
        {/* Not BlobButton: that one requires an href and renders a Link, and
            this is an action, not navigation (see Signup.tsx — there is no
            button variant). This is the auto-sizing inline-mask pattern the
            homepage hero already uses, which also avoids BlobButton's
            hard-coded 56x276 box — and the box is the point here, because the
            height came down to 44px on user direction. Ochre ground, charcoal
            label: 7.7 : 1.

            No focus-visible override here: globals.css engineers a measured
            dual ring (charcoal outline inside a gold halo, worst ground
            6.04 : 1) precisely for unknown backgrounds like a film, and a
            local `outline-canvas` would have replaced the half that survives
            on light frames. */}
        <button
          type="button"
          data-loader-enter
          aria-hidden="true"
          tabIndex={-1}
          className="pointer-events-none relative mt-8 inline-flex min-h-11 items-center gap-5 px-8 py-2.5 text-charcoal opacity-0 lg:mt-10"
        >
          <span aria-hidden="true" className="absolute inset-0 bg-ochre [mask-image:url('/artwork/blob-button.svg')] [mask-size:100%_100%]" />
          <span className="eyebrow relative text-base leading-[1.4] tracking-normal">{homeLoader.enter}</span>
          <span aria-hidden="true" className="relative text-2xl">&rsaquo;</span>
        </button>
      </div>
    </div>
  );
}
