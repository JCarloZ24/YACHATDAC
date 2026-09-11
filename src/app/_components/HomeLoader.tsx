"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";
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
      {/* The film. `muted playsInline` in the MARKUP are what make autoplay
          legal at all — the muted attribute is the fallback state, not the
          intended one. ⚠ The encodes carried `-an` until 11 September 2026 and
          the comment here used to say muting removed nothing that was there;
          they carry a normalised music bed now, and home-loader.ts asks for it
          unmuted first and only falls back to this. No
          `src` in the markup — home-loader.ts attaches one only where the film
          is actually going to play, so a data-saver link and reduced motion
          never spend the bytes (the rule HeroVideo.tsx set on 9 September).
          There are no `<source>` children either, and after 11 September 2026
          nothing to put in them: the tiers are WebM only (homepage-media.ts),
          so a browser without VP9 takes the `error` path rather than a second
          format. A source list would also undo the held fetch.
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
      {/* X5 media scrim — the palette's one sanctioned gradient exception.
          ⚠ REMADE 11 September 2026, user direction: "smoother fade so it's
          not obvious / abrupt from dark to transparent … it needs to be
          lighter to see what it covers."

          What was wrong was not the ALPHAS so much as the SHAPE. The previous
          ramp ran 0.20 → 0.88 across twenty per cent of the frame (34% → 54%)
          with hard corners at both ends. A linear-gradient is smooth between
          two stops by construction, but its DERIVATIVE jumps at every stop, and
          a 0.68 alpha change over a fifth of the screen with a corner at each
          end is exactly the visible edge that was being read as a band.

          So this is the same idea spread over twice the distance (38% → 90%)
          with intermediate stops following an ease rather than a straight
          line, and lighter at every point: 0.30 at the very top against 0.45,
          0.10 through the clear window against 0.20, and 0.80 at the foot
          against 0.92. The film now reads through the top half instead of the
          top third.

          THE HONEST COST, recorded rather than hidden. The old 0.88 wall was
          bought for a measured reason — this film is close to WHITE (p90
          luminance 0.935 top, 0.950 mid) and the branded block sits from
          roughly 57% down, where the new curve is only ~0.35. A white wordmark
          on that measures near 1.6 : 1, where the old scrim gave 6.38. The
          darkness is NOT being put back — it is being spent locally instead:
          the wordmark, the readout and Skip each carry their own drop-shadow
          below, which lifts small light shapes off a bright frame without
          drawing a rectangle anybody can see. That is a legibility aid, not a
          contrast guarantee, and a re-cut with a brighter foot would need
          re-measuring. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(9,14,18,0.30)_0%,rgba(9,14,18,0.18)_8%,rgba(9,14,18,0.10)_26%,rgba(9,14,18,0.11)_38%,rgba(9,14,18,0.16)_46%,rgba(9,14,18,0.26)_54%,rgba(9,14,18,0.38)_61%,rgba(9,14,18,0.50)_68%,rgba(9,14,18,0.61)_75%,rgba(9,14,18,0.70)_82%,rgba(9,14,18,0.76)_90%,rgba(9,14,18,0.80)_100%)]"
      />
      {/* THE SOUND CONTROL — user direction, 11 September 2026: "sound should
          be on by default, but provide the sound off option right away."
          Wonder's control, in Wonder's shape, for the reason Wonder gives:
          this is the same reader meeting the same kind of film twice, and two
          different sound affordances on one site is one too many. It names the
          CURRENT state rather than the action, same as that one.

          It DIFFERS from Wonder's in what it does on load. Wonder opens silent
          and offers sound; this opens with sound and offers silence. Neither
          is a default anyone gets to promise — an audible autoplay is refused
          until the browser has seen an interaction — so home-loader.ts asks
          for sound first and falls back to a muted pass, correcting the label
          on the way. See the comment there; the ordering is load-bearing.

          Top-LEFT, mirroring Skip. It carries a ground where Skip deliberately
          does not: Skip's bare-text treatment was a user call and is a
          recorded contrast miss (below), and the fix for the corners being sky
          was never available to it. Nothing stops it being available here, and
          a control that turns audio off is one somebody may be reaching for in
          a hurry. 4.5 : 1 on the pill against the film's worst frame.

          `group` plus `data-on` is the whole state machine: the module sets one
          attribute and CSS picks which label and which icon is on screen, so
          no JavaScript anywhere reaches inside this button. */}
      <button
        type="button"
        data-loader-sound
        aria-pressed="false"
        className="eyebrow group absolute top-6 left-6 z-10 inline-flex items-center gap-2 rounded-full border border-canvas/40 bg-charcoal/60 px-4 py-2 text-[0.8125rem] leading-[1.4] text-canvas opacity-0 backdrop-blur-sm transition-colors duration-(--dur-small) ease-quiet hover:bg-charcoal/80 motion-reduce:transition-none lg:top-16 lg:left-16"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 shrink-0"
          fill="none" stroke="currentColor" strokeWidth="1.75"
          strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7.5h3l4-3.5v12l-4-3.5H3z" />
          {/* Waves when on, a cross when off — both drawn, one shown. */}
          <g className="hidden group-data-[on]:block">
            <path d="M13 7.5a3.5 3.5 0 0 1 0 5" />
            <path d="M15.5 5a7 7 0 0 1 0 10" />
          </g>
          <path d="M13.5 8l4 4m0-4l-4 4" className="group-data-[on]:hidden" />
        </svg>
        <span className="group-data-[on]:hidden">{homeLoader.soundOff}</span>
        <span className="hidden group-data-[on]:inline">{homeLoader.soundOn}</span>
      </button>
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
        className="eyebrow absolute top-6 right-6 text-[0.8125rem] leading-[1.4] text-canvas underline decoration-canvas/50 decoration-1 underline-offset-4 opacity-0 [text-shadow:0_1px_10px_rgba(9,14,18,0.9),0_0_3px_rgba(9,14,18,0.7)] transition-colors duration-(--dur-small) ease-quiet hover:decoration-canvas motion-reduce:transition-none lg:top-16 lg:right-16"
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
        {/* The drop-shadow is the lighter scrim's counterweight (11 September
            2026) — see the scrim comment above. It is a filter on the SVG, so
            it follows the letterforms rather than boxing them, and at 18px
            blur it is a halo nobody reads as a shape. It does NOT recreate or
            recolour the logo (hard rule 3): the asset is rendered untouched. */}
        <Image src="/brand/logo-wordmark.svg" alt="YACHATDAC" width={216} height={64}
          className="mx-auto h-12 w-auto drop-shadow-[0_2px_18px_rgba(9,14,18,0.95)] sm:h-16" />
        {/* w-[min(80vw,52rem)] is PageLoader's exact figure, not an
            approximation of it — 832px at 1440 against the 576 this was. */}
        <div aria-hidden="true" className="relative mt-14 w-[min(80vw,52rem)]">
          <Image src={HOME_LOADER_ARTWORK.wave} alt="" width={823.37} height={93.25}
            className="block h-auto w-full opacity-10" />
          <div data-loader-wave className="absolute inset-0 drop-shadow-[0_2px_14px_rgba(9,14,18,0.9)] [clip-path:inset(0_100%_0_0)]">
            <Image src={HOME_LOADER_ARTWORK.wave} alt="" width={823.37} height={93.25}
              className="block h-auto w-full" />
          </div>
        </div>
        {/* The readout does NOT halve with the artwork: 14px is already the
            floor the type system allows, and half of it is not readable. */}
        {/* PageLoader's readout treatment — mt-8, text-sm, tabular-nums, and
            its leading. Both loading screens were always the same face (Work
            Sans 14/400, the type system's answer for a numeric readout at this
            size), but they did not READ the same: this one carried an `ml-1`
            on the per-cent sign and so said "100 %" where the panel says
            "100%". Closed 11 September 2026, user direction — the gap and the
            `leading-none` are gone and the two now match.

            What does NOT come across is the colour: held at FULL canvas rather
            than the panel's canvas/60, because that 60% is read on solid
            charcoal and here it sits over a film, where it measures 2.4 : 1.
            The text-shadow is there for the same reason. */}
        <p aria-hidden="true" className="mt-8 text-sm tabular-nums text-canvas [text-shadow:0_1px_10px_rgba(9,14,18,0.9),0_0_3px_rgba(9,14,18,0.7)]">
          <span data-loader-count>0</span><span>%</span>
        </p>
        {/* Not BlobButton: that one requires an href and renders a Link, and
            this is an action, not navigation (see Signup.tsx — there is no
            button variant). It also avoids BlobButton's hard-coded 56x276 box
            — and the box is the point here, because the height came down to
            44px on user direction. Ochre ground, charcoal label: 7.7 : 1.

            Everything home-loader.ts reaches for lives on the <button> inside
            EnterButton below — `data-loader-enter`, the opacity it tweens, the
            `pointer-events-none` it strips at 100%, the aria-hidden and
            tabIndex it clears. Moving any of those is a change to that module
            as well as to this one. */}
        <EnterButton />
      </div>
    </div>
  );
}

/** viewBox geometry of the supplied blob (public/artwork/blob-button.svg). */
const BLOB_VB_W = 276;
const BLOB_VB_H = 56;

/**
 * That blob's single path, inlined. ⚠ The SVG file is still the source of
 * truth — a redrawn blob means re-copying this, not editing it here.
 *
 * It is inlined rather than used as a CSS mask (which is what this button did
 * until 11 September 2026) because a mask can only clip ONE painted layer, and
 * the water below needs the ochre base and the white fill clipped to the same
 * shape as a single group. See the group's own comment for why that matters.
 */
const BLOB_BUTTON_D =
  "M275.887 34.415C276.594 40.5689 273.913 44.8518 269.833 46.8634C263.812 49.8376 257.651 51.4707 251.045 52.3251C226.13 55.5697 54.3528 56.0954 29.2727 55.9872C22.5441 55.9548 9.87967 54.1049 4.53298 49.3029C0.57643 45.7663 -0.682099 39.9153 0.337885 34.0318C1.44835 27.64 2.69043 21.5077 4.81265 15.7324C8.66227 5.25242 22.4881 -0.230507 31.3636 0.00742848C52.0183 0.591452 219.335 2.06662 239.916 3.88358C249.285 4.71636 255.989 5.64647 264.396 10.6756C271.387 14.8611 274.752 24.4542 275.887 34.415Z";

/**
 * Displacement amplitude of the waterline, in viewBox units.
 *
 * ⚠ NOT ConnectButton's 14, and the difference is arithmetic rather than
 * taste. Every filter number here is in VIEWBOX units, and the two blobs have
 * different viewBoxes — 116x44 there, 276x56 here — so copying the values
 * across unchanged would render the same effect about two and a half times
 * finer on this button. These are that component's values rescaled by the
 * ratio of the two boxes, so the water reads at the same size on screen:
 *
 *   scale        14 -> 18       (14/44 of the height, kept)
 *   baseFreq x   0.09 -> 0.038  (x 116/276)
 *   baseFreq y   0.13 -> 0.102  (x 44/56)
 *   shimmer      0.035 0.16 -> 0.015 0.126
 */
const WATER_SCALE = 18;

/**
 * Covers the whole blob from any entry point: the box's diagonal (~282) plus
 * the full displacement and a little. ConnectButton carries the argument for
 * the margin — at bare diagonal the roughened edge falls back INSIDE the shape
 * in places and the base shows through as a rim.
 */
const COVER_R = 282 + WATER_SCALE * 2 + 12;

/**
 * "Walk with us" — the door out of the opening film.
 *
 * THE HOVER, user direction 11 September 2026: "add hover effect on button,
 * like the effect on connect in nav bar, but use color white." So this is
 * ConnectButton's waterline — a fill that spreads from wherever the cursor
 * entered, its edge roughened by animated turbulence so no two hovers look
 * alike, receding toward the exit point on leave.
 *
 * It is REPRODUCED rather than shared, deliberately. ConnectButton bakes its
 * label into the asset as paths and carries a two-tone light/dark system this
 * button has no use for; extracting the water from all that is a bigger job
 * than the ask, and doing it badly would put a hover effect in the critical
 * path of the site header. If a third blob ever wants water, extract then —
 * this paragraph is the note saying so.
 *
 * WHAT IS GENUINELY SIMPLER HERE, and it is the one real difference.
 * ConnectButton has to paint its label TWICE — its own colour underneath, a
 * midnight copy clipped to the rising water above — because cream lettering on
 * gold water measures about 1.9 : 1. This water is WHITE and this label is
 * already charcoal, so it reads 7.7 : 1 on the ochre and better than 18 : 1 on
 * the white, and needs no clipped copy at all. Label and chevron are live
 * text, not paths, which is also why the SVG sits behind them rather than
 * containing them.
 *
 * `preserveAspectRatio="none"`, as the supplied asset itself declares: the
 * blob stretches to whatever box the label makes, exactly as the CSS mask it
 * replaces did. The circle stretches with it, which is right — it should
 * spread through the shape as drawn, not as a true circle laid over it.
 */
function EnterButton() {
  const uid = useId();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const ripple = useRef<SVGCircleElement | null>(null);
  const turbulence = useRef<SVGFETurbulenceElement | null>(null);
  const shimmer = useRef<gsap.core.Tween | null>(null);

  const clipId = `${uid}-blob`;
  const waterId = `${uid}-water`;

  /** Pointer position in viewBox coordinates. */
  const toLocal = (event: React.PointerEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: BLOB_VB_W / 2, y: BLOB_VB_H / 2 };
    return {
      x: ((event.clientX - rect.left) / rect.width) * BLOB_VB_W,
      y: ((event.clientY - rect.top) / rect.height) * BLOB_VB_H,
    };
  };

  const fillFrom = (x: number, y: number) => {
    const circle = ripple.current;
    if (!circle) return;
    gsap.killTweensOf(circle);
    gsap.set(circle, { attr: { cx: x, cy: y } });
    // A fresh seed per entry is what makes the pattern inconsistent — the
    // same hover never draws the same waterline twice.
    const turb = turbulence.current;
    if (turb) {
      turb.setAttribute("seed", String(Math.floor(Math.random() * 1000)));
      shimmer.current?.kill();
      shimmer.current = gsap.to(turb, {
        attr: { baseFrequency: "0.015 0.126" },
        duration: 1.1,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }
    gsap.to(circle, { attr: { r: COVER_R }, duration: 0.76, ease: "power2.out" });
  };

  const drainTo = (x: number, y: number) => {
    const circle = ripple.current;
    if (!circle) return;
    gsap.killTweensOf(circle);
    gsap.to(circle, {
      attr: { cx: x, cy: y, r: 0 },
      duration: 0.58,
      ease: "power2.in",
      onComplete: () => {
        shimmer.current?.kill();
        shimmer.current = null;
      },
    });
  };

  // A quick on/off/on cancels whichever ramp is running (killTweensOf above),
  // and the shimmer is killed when the water finishes draining — but a reader
  // who presses the button mid-hover unmounts this with a repeating tween
  // still going, so it is killed here too.
  useEffect(() => () => {
    shimmer.current?.kill();
    shimmer.current = null;
  }, []);

  // NO REDUCED-MOTION BRANCH, and that is not an oversight. The whole cover is
  // `motion-reduce:hidden` and home-loader.ts returns before building any of
  // it under the preference, so no reader can both reach this button and be
  // refusing motion. ConnectButton needs its instant-fill branch because it
  // sits in the navbar on every page; this does not.
  return (
    <button
      type="button"
      data-loader-enter
      aria-hidden="true"
      tabIndex={-1}
      onPointerEnter={(event) => {
        const { x, y } = toLocal(event);
        fillFrom(x, y);
      }}
      onPointerLeave={(event) => {
        const { x, y } = toLocal(event);
        drainTo(x, y);
      }}
      onFocus={() => fillFrom(BLOB_VB_W / 2, BLOB_VB_H / 2)}
      onBlur={() => drainTo(BLOB_VB_W / 2, BLOB_VB_H / 2)}
      /* No focus-visible override: globals.css engineers a measured dual ring
         (charcoal outline inside a gold halo, worst ground 6.04 : 1) precisely
         for unknown backgrounds like a film, and a local `outline-canvas`
         would replace the half that survives on light frames. */
      className="pointer-events-none relative mt-8 inline-flex min-h-11 items-center gap-5 px-8 py-2.5 text-charcoal opacity-0 lg:mt-10"
    >
      <svg
        ref={svgRef}
        aria-hidden="true"
        viewBox={`0 0 ${BLOB_VB_W} ${BLOB_VB_H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <clipPath id={clipId}>
            <path d={BLOB_BUTTON_D} />
          </clipPath>
          {/* The watery edge: turbulence displaces the expanding circle so it
              reads as a spill, not a radar ping. The filter region is widened
              so the displaced edge is not cropped square. */}
          <filter id={waterId} x="-40%" y="-40%" width="180%" height="180%">
            <feTurbulence
              ref={turbulence}
              type="fractalNoise"
              baseFrequency="0.038 0.102"
              numOctaves="2"
              seed="7"
            />
            <feDisplacementMap in="SourceGraphic" scale={WATER_SCALE} />
          </filter>
        </defs>
        {/* ⚠ ONE CLIPPED GROUP, base and water together — ConnectButton's
            hard-won lesson (10 September 2026). Drawing the base as its own
            path and the water as a separate clipped layer gives the shape TWO
            independently antialiased edges, and the base's half-covered pixels
            stay visible under the water's as a rim. Inside one clip there is a
            single edge — the clip's — and whatever is topmost at it is what
            blends with the film behind. The rect overhangs the viewBox because
            the supplied path does too; it is clipped regardless, so the extra
            costs nothing. */}
        <g clipPath={`url(#${clipId})`}>
          <rect
            x={-4}
            y={-4}
            width={BLOB_VB_W + 8}
            height={BLOB_VB_H + 8}
            fill="var(--color-ochre)"
          />
          <circle
            ref={ripple}
            r="0"
            fill="var(--color-canvas)"
            filter={`url(#${waterId})`}
          />
        </g>
      </svg>
      <span className="eyebrow relative text-base leading-[1.4] tracking-normal">{homeLoader.enter}</span>
      <span aria-hidden="true" className="relative text-2xl">&rsaquo;</span>
    </button>
  );
}
