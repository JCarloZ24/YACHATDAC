"use client";

/**
 * The screen recipes.
 *
 * Six compositions, each a screen's worth of layered motion. Every one is drawn
 * from a section of the Living Work hi-fi (`03 · Living Work · HI-FI · the
 * field notebook`, Figma 2137:2613), because that file is the most complete
 * statement of what this site is supposed to feel like.
 *
 * Each recipe declares its markup contract in its doc comment. The server owns
 * structure and stamps `data-*` hooks; the recipe owns behaviour and knows
 * nothing about what the section is *about*. That is what makes them reusable
 * beyond the page they came from.
 *
 * Spans are in vh and are load-bearing. A pin whose span is not in the layout
 * gets retrofitted badly later, and a reader who scrolls through 300vh of
 * nothing thinks the page is broken.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clearAll, composition } from "@/lib/motion/compose";
import { DUR, EASE, SCRUB } from "@/lib/motion/tokens";
import type { MotionModule } from "@/lib/motion-controller";

const q = <T extends HTMLElement>(root: HTMLElement, sel: string) =>
  root.querySelector<T>(sel);
const qa = <T extends HTMLElement>(root: HTMLElement, sel: string) =>
  Array.from(root.querySelectorAll<T>(sel));

/* -------------------------------------------------------------------------
   01 — fullBleedOpen
   ------------------------------------------------------------------------- */

/**
 * The full-bleed hero. Hi-fi §01.
 *
 * A photograph takes the whole screen, the scrim comes up under the copy as it
 * arrives, the heading settles, and the wave divider hands the photograph off
 * into the page below it.
 *
 * Loud channel: MEDIA. The type is a plain settle and the transition is one
 * divider — the picture is what takes the screen.
 *
 * Markup:
 *   [data-media]    the image plane
 *   [data-scrim]    the legibility scrim (X5) — required where copy sits on media
 *   [data-heading]  the headline
 *   [data-wave]     the divider at the foot
 */
export function fullBleedOpen(root: HTMLElement, span = 100): MotionModule {
  return composition("fullBleedOpen", root, {
    channel: "media",
    span,
    uses: ["plateParallax", "scrimRamp", "settle", "waveHandoff"],
    build: (tl) => {
      const media = qa(root, "[data-media]");
      const scrim = q(root, "[data-scrim]");

      if (media.length) tl.plateParallax(media, { duration: 1 }, 0);
      if (scrim) tl.scrimRamp(scrim, { duration: 1 }, 0);
    },
    enter: (tl) => {
      const heading = q(root, "[data-heading]");
      const wave = q(root, "[data-wave]");
      if (heading) tl.settle(heading, { duration: DUR.large });
      // The divider rises once on arrival and then stays seated. Scrubbing it
      // across the hero's whole span left it hanging detached over the
      // photograph for most of the scroll, which read as a broken edge rather
      // than a handoff — the design holds the wave at the section's foot.
      if (wave) tl.waveHandoff(wave, { duration: DUR.large }, 0);
    },
    cut: clearAll,
  });
}

/* -------------------------------------------------------------------------
   02 — apertureSequence
   ------------------------------------------------------------------------- */

/**
 * THE APERTURE. Hi-fi §02, and the page's signature.
 *
 * "The 0 is a portal onto the plain · 300vh sticky · Y1 · M2 · C2 into the O of
 * 'Our'." The aperture opens as the figures change — the counter of the 0, then
 * the whole glyph, then the whole screen.
 *
 * Pinned, because the reader has to stay with one frame while it opens; the
 * whole device collapses if the screen scrolls away mid-open.
 *
 * Loud channel: TYPE. The photograph is enormous by the end, but it is the
 * letterform that is doing the work — the picture only exists where the type
 * lets it through. The figures and rail are quiet; nothing else on the screen
 * moves.
 *
 * THE COUNTDOWN (client direction, 31 Aug): the number itself counts down —
 * 8,870 rolls through real values to 2019, dwells with its caption, rolls to
 * 480, then lands on 120. The figures stay centred. 120's 0 is filled by the
 * wide shot (Y1 — the glyph's fill is the photograph, not ink), and the
 * opening grows from that glyph until the picture fills the THEATER: a wide
 * band with canvas above and below, never the whole page — where the four
 * figures return as one caption line.
 *
 * A rolled number is a counted figure, which accumulate.ts warns about — but
 * these are figures of return counted DOWNWARD to the one that opens onto
 * Country, and the direction is the meaning.
 *
 * The glyph's clip geometry is measured after fonts resolve, never hardcoded
 * (the display face is gitignored, F5).
 *
 * Markup:
 *   [data-aperture]        the theater band holding the photograph
 *   [data-figure]          each landmark figure (four of them)
 *   [data-zero]            the `0` inside each figure — 120's carries the crop
 *   [data-count-live]      the rolling number between landmarks (motion-only)
 *   [data-figure-caption]  the caption under each figure
 *   [data-seg-fill]        the four segment fills of the progress rail · [data-rail-count] the counter
 *   [data-band-caption]    the four figures as one line, on the full frame
 *   [data-copy]            everything that leaves as the zoom begins
 */
export function apertureSequence(root: HTMLElement, span = 300): MotionModule {
  return composition("apertureSequence", root, {
    channel: "type",
    span,
    pin: true,
    uses: ["aperture"],
    build: (tl) => {
      const container = q(root, "[data-aperture]");
      const figures = qa(root, "[data-figure]");
      const zeros = qa(root, "[data-figure] [data-zero]");
      const captions = qa(root, "[data-figure-caption]");
      const segs = qa(root, "[data-seg-fill]");
      const count = q(root, "[data-rail-count]");
      const live = q(root, "[data-count-live]");
      if (!container || figures.length < 2 || zeros.length !== figures.length) return;

      // The landmark values, stamped by the markup as data-value — the zero
      // glyph renders twice inside each figure (ink + fill layers), so
      // parsing textContent would double the trailing 0.
      const values = figures.map((f) => Number(f.dataset.value ?? "0"));

      // In motion, every 0 starts as plain ink: the image layer inside each
      // glyph is clipped away, and only 120's liquid-fills later. Reverting
      // restores the rest state's filled glyph.
      const fills = qa(root, "[data-figure] [data-zero-fill]");
      if (fills.length) gsap.set(fills, { clipPath: "inset(100% 0% 0% 0%)" });
      const lastFill = fills[fills.length - 1];

      // The theater's opening starts from 120's glyph, measured where it
      // renders — clipped to the zero's own box so the reveal begins exactly
      // where the letter stood. (Measured now, not on refresh — the caller
      // waits for document.fonts.ready before building.)
      const lastZero = zeros[zeros.length - 1];
      const box = container.getBoundingClientRect();
      const z = lastZero.getBoundingClientRect();

      // The reveal mask — the blob is seated over the measured zero at the
      // glyph's own size, so when the 0 hands over to it nothing jumps; it
      // then grows (transform only) until the frame is all photograph.
      // Chrome ignores attribute transforms on clipPath children, so the blob
      // is driven through CSS transforms (fill-box origin) via a proxy tween.
      const blob = container.querySelector<SVGPathElement>("[data-reveal-blob]");
      let setBlobScale: ((s: number) => void) | null = null;
      let blobStart = 1;
      let blobEnd = 1;
      if (blob) {
        const bb = blob.getBBox();
        const dx = z.left - box.left + z.width / 2 - (bb.x + bb.width / 2);
        const dy = z.top - box.top + z.height / 2 - (bb.y + bb.height / 2);
        blob.style.transformBox = "fill-box";
        blob.style.transformOrigin = "50% 50%";
        setBlobScale = (s: number) => {
          blob.style.transform = `translate(${dx}px, ${dy}px) scale(${s})`;
        };
        blobStart = Math.max(z.width / bb.width, z.height / bb.height);
        // Big enough that the blob's edge clears every corner of the band.
        blobEnd = (Math.max(box.width, box.height) * 2.4) / Math.min(bb.width, bb.height);
        setBlobScale(blobStart);
      }

      // Align the 0's knockout crop to the band's own object-cover framing,
      // so the picture inside the glyph IS the picture the zoom opens onto —
      // the swap leaves no seam, and the growth reads as the 0 zooming into
      // the photograph rather than one crop being traded for another.
      const bandImg = container.querySelector<HTMLImageElement>("[data-reveal-full]");
      if (bandImg) {
        const iw = Number(bandImg.getAttribute("width")) || bandImg.naturalWidth;
        const ih = Number(bandImg.getAttribute("height")) || bandImg.naturalHeight;
        if (iw && ih) {
          const s = Math.max(box.width / iw, box.height / ih);
          const dw = iw * s;
          const dh = ih * s;
          gsap.set(lastFill ?? lastZero, {
            backgroundSize: `${dw}px ${dh}px`,
            backgroundPosition: `${box.left + (box.width - dw) / 2 - z.left}px ${box.top + (box.height - dh) / 2 - z.top}px`,
          });
        }
      }

      // The rest markup shows the last figure; the sequence starts on the first.
      gsap.set(figures, { autoAlpha: 0 });
      gsap.set(captions, { autoAlpha: 0 });
      gsap.set(figures[0], { autoAlpha: 1 });
      if (captions[0]) gsap.set(captions[0], { autoAlpha: 1 });
      if (count) gsap.set(count, { textContent: `01 / 0${figures.length}` });
      gsap.set(container, { autoAlpha: 0 });
      if (bandImg) gsap.set(bandImg, { autoAlpha: 0 });
      if (segs.length) gsap.set(segs, { scaleX: 0, transformOrigin: "left center" });

      // One leg of the countdown: the standing figure gives way to the live
      // counter, the number itself rolls down to the next landmark, and the
      // landmark takes over. The caption holds through the dwell and only
      // hands off as the roll begins.
      const fmt = (v: number) => Math.round(v).toLocaleString("en-US");
      // A raw tween flies through arbitrary values (5,137 … 994) and reads as
      // random digits. Quantising to round steps — hundreds up high, tens and
      // ones as the figure gets small — makes it read as a genuine countdown:
      // 8,800 → 8,700 → … → 2,100 → 2,019.
      const quantize = (v: number, from: number, to: number) => {
        const step = v >= 3000 ? 100 : v >= 1000 ? 50 : v >= 300 ? 10 : 1;
        return Math.max(to, Math.min(from, Math.round(v / step) * step));
      };
      const roll = (from: number, to: number, at: number, dur = 0.5) => {
        tl.set(figures[from], { autoAlpha: 0 }, at);
        if (live) {
          const proxy = { v: values[from] };
          tl.set(live, { autoAlpha: 1, textContent: fmt(values[from]) }, at);
          tl.to(
            proxy,
            {
              v: values[to],
              duration: dur,
              ease: EASE.machine,
              onUpdate: () => {
                live.textContent = fmt(quantize(proxy.v, values[from], values[to]));
              },
            },
            at,
          );
          tl.set(live, { autoAlpha: 0 }, at + dur);
        }
        tl.set(figures[to], { autoAlpha: 1 }, at + dur);
        if (captions[from])
          tl.to(captions[from], { autoAlpha: 0, duration: 0.2, ease: EASE.machine }, at);
        if (captions[to])
          tl.to(captions[to], { autoAlpha: 1, duration: 0.25, ease: EASE.machine }, at + dur);
        if (count) tl.set(count, { textContent: `0${to + 1} / 0${figures.length}` }, at + dur);
      };

      // THE COUNTDOWN — 8,870 rolls down to 2019, to 480, to 120. Each
      // landmark dwells with its caption before the next roll begins.
      roll(0, 1, 0.8);
      roll(1, 2, 2.1);
      roll(2, 3, 3.4);
      // STATE 4, in order:
      // 1 · 120 lands and stands in plain font colour, like every figure
      //     before it (3.9 → 4.6, the dwell).
      // 2 · mid-state, the LIQUID FILL — the image rises inside the 0 from
      //     the bottom, the ink giving way to Country (4.6 → 5.2).
      if (lastFill) {
        tl.to(
          lastFill,
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: EASE.machine },
          4.6,
        );
      }
      // 3 · everything except the filled 0 fades — the "12", the rail, the
      //     captions, the description (5.3 → 5.8).
      const lastRest = qa(root, "[data-figure]").length
        ? Array.from(figures[figures.length - 1].querySelectorAll<HTMLElement>("[data-figure-rest]"))
        : [];
      const fadeEls = [...qa(root, "[data-fade]"), ...lastRest];
      if (fadeEls.length) tl.to(fadeEls, { autoAlpha: 0, duration: 0.5, ease: EASE.machine }, 5.3);
      // 4 · at the END of the state the 0 becomes the pattern: the glyph
      //     melts into the blob (both show the same aligned pixels, so
      //     nothing jumps) and the blob grows — an irregular, smooth edge
      //     uncovering the photograph until the theater is one frame.
      tl.set(container, { autoAlpha: 1 }, 5.9);
      tl.to(lastZero, { autoAlpha: 0, duration: 0.2, ease: EASE.machine }, 5.9);
      if (blob && setBlobScale) {
        const grow = { s: blobStart };
        const apply = setBlobScale;
        tl.to(
          grow,
          {
            s: blobEnd,
            duration: 1.2,
            ease: EASE.machine,
            onUpdate: () => apply(grow.s),
          },
          5.95,
        );
      }
      if (bandImg) tl.to(bandImg, { autoAlpha: 1, duration: 0.55, ease: EASE.machine }, 6.45);
      // The description arrives WITH the frame and dwells on it.
      const dress = q(root, "[data-band-dress]");
      if (dress) tl.to(dress, { autoAlpha: 1, duration: 0.35, ease: EASE.machine }, 6.6);

      // THE HAND-OFF — still on this ONE wide shot. The O of "Our challenges"
      // appears as a letterform absorbing the frame, caption and all; it
      // flies into the ghost header's O, the heading assembles around it, and
      // the image drains into solid ink — the reader watches the photograph
      // become the word before §03 opens with the real heading in its place.
      const oGlyph = container.querySelector<SVGTextElement>("[data-o-glyph]");
      const oShrink = q(root, "[data-o-shrink]");
      const ghost = q(root, "[data-o-ghost]");
      const ghostLand = q(root, "[data-o-ghost-land]");
      const ghostItems = qa(root, "[data-ghost-item]");
      let setOFlight: ((p: number) => void) | null = null;
      if (oGlyph && oShrink && ghost && ghostLand) {
        const o = ghostLand.getBoundingClientRect();
        const ocs = getComputedStyle(ghostLand);
        gsap.set(oGlyph, {
          fontFamily: ocs.fontFamily,
          fontWeight: ocs.fontWeight,
          fontSize: ocs.fontSize,
        });
        const obb = oGlyph.getBBox();
        if (obb.height > 0) {
          // Same face at the same font-size IS the same glyph — no rescaling.
          // The old ratio compared the span's line box (leading included) to
          // the glyph's ink box, so the landed O never matched the heading's.
          // Alignment centres the ink inside the span's box instead.
          const landX = o.left - box.left;
          const landY = o.top - box.top;
          gsap.set(oGlyph, {
            attr: {
              x: landX - obb.x + (o.width - obb.width) / 2,
              y: landY - obb.y + (o.height - obb.height) / 2,
            },
          });
          const startScale = (box.height * 0.85) / obb.height;
          const fdx = box.width / 2 - (landX + o.width / 2);
          const fdy = box.height / 2 - (landY + o.height / 2);
          oGlyph.style.transformBox = "fill-box";
          oGlyph.style.transformOrigin = "50% 50%";
          setOFlight = (p: number) => {
            const inv = 1 - p;
            oGlyph.style.transform = `translate(${fdx * inv}px, ${fdy * inv}px) scale(${1 + (startScale - 1) * inv})`;
          };
          setOFlight(0);
        }
      }
      if (oShrink && setOFlight) {
        const reveal = q(root, "[data-reveal-clipped]");
        // The O appears, absorbing the frame.
        tl.set(oShrink, { autoAlpha: 1 }, 8.2);
        tl.to(
          [bandImg, reveal, dress].filter(Boolean) as HTMLElement[],
          { autoAlpha: 0, duration: 0.35, ease: EASE.machine },
          8.25,
        );
        // It flies into the ghost header's O… (the ghost's own solid O stays
        // hidden until the flying one has arrived and drained — the flying O
        // IS the letter until then)
        if (ghost) tl.set(ghost, { autoAlpha: 1 }, 8.4);
        if (ghostLand) gsap.set(ghostLand, { autoAlpha: 0 });
        const flight = { p: 0 };
        const fly = setOFlight;
        tl.to(
          flight,
          { p: 1, duration: 0.7, ease: EASE.machine, onUpdate: () => fly(flight.p) },
          8.45,
        );
        // …the heading assembles around it…
        if (ghostItems.length)
          tl.to(ghostItems, { autoAlpha: 1, duration: 0.3, ease: EASE.machine, stagger: 0.15 }, 9.2);
        // …and the image drains into the solid letter. The word stands.
        if (ghostLand)
          tl.to(ghostLand, { autoAlpha: 1, duration: 0.2, ease: EASE.machine }, 9.7);
        tl.to(oShrink, { autoAlpha: 0, duration: 0.2, ease: EASE.machine }, 9.7);
        // The word STANDS and is never faded — it IS the section title from
        // here on. The landing is the pin's final beat: the moment the image
        // drains into the letter the pin releases, and §03's content fades in
        // directly beneath (its own duplicate header is suppressed by
        // clusterDescent while motion runs). One heading, then its section.
      }
      tl.to({}, { duration: 0.1 }); // a breath, then the unpin

      // The rail is the scroll progress bar, divided into four: each segment
      // fills across its own figure's stretch of the pin — the fourth keeps
      // filling through the zoom and completes as the pin releases.
      if (segs.length === figures.length) {
        const bounds = [0, 1.3, 2.6, 3.9, tl.duration()];
        segs.forEach((seg, i) => {
          tl.to(
            seg,
            { scaleX: 1, duration: bounds[i + 1] - bounds[i], ease: EASE.machine },
            bounds[i],
          );
        });
      }
    },
    cut: (el) => {
      // The markup's rest state IS the design's own frame 05 — 480 with the
      // photograph cropped into the glyph (Y1) and the rail marking 03/04.
      // Nothing to add: the caption strip under BREAK-OUT carries all four
      // figures, so nothing is lost but the motion.
      clearAll(el);
    },
  });
}

/* -------------------------------------------------------------------------
   03 — clusterDescent
   ------------------------------------------------------------------------- */

/**
 * A ground that changes under the reader. Hi-fi §03.
 *
 * "Four clusters on a ground that thins" — the ground ramp walks bone → dust →
 * dry earth across them. The colour is the argument: the section is about
 * drought and erosion, and the page dries out while you read it.
 *
 * Loud channel: TRANSITION. The clusters themselves arrive quietly; what takes
 * the screen is the ground moving underneath them.
 *
 * Markup:
 *   [data-ground]         the element whose --ground custom property is ramped
 *   [data-cluster]        each cluster
 *   [data-fade-seq]       lede and first bands — held back, then faded in as
 *                         the section rises under §02's landed heading
 *   [data-handoff-title]  the section's own eyebrow + heading — the document's
 *                         copy of the title. Suppressed while motion runs:
 *                         §02's aperture lands the O in ITS header and that
 *                         one stays as the only "Our challenges" on the page.
 */
export function clusterDescent(
  root: HTMLElement,
  stops: string[],
  span = 330,
): MotionModule {
  return composition("clusterDescent", root, {
    channel: "transition",
    span,
    // §02 above is pinned, so this section waits parked at the viewport's
    // bottom edge — fire the entrance the moment the pin releases and it
    // peeks in, or the hand-off shows a beat of blank ground.
    enterStart: "top 100%",
    uses: ["groundRamp", "triad", "arrive", "frameOpen"],
    build: (tl) => {
      // While motion runs, §02's aperture has already landed the O in its own
      // "Our challenges" header and that one stays standing as THE title —
      // this section's duplicate pair collapses so the page never shows the
      // heading twice. Reduced motion and no-JS keep it: there the aperture's
      // header never appears at all.
      const titles = qa(root, "[data-handoff-title]");
      if (titles.length) gsap.set(titles, { display: "none" });
      // The pinned scene above ends with the landed heading standing alone in
      // an emptied theater. Pull this section up so its content begins just
      // below that heading the moment the pin releases — the overlap only
      // ever covers ground the aperture has already faded, and the pull is
      // capped so it can never reach the heading itself. The previous sibling
      // is the pin spacer once §02's trigger exists; measure the section
      // inside it.
      const prev = root.previousElementSibling as HTMLElement | null;
      const pinned = prev?.classList.contains("pin-spacer")
        ? (prev.firstElementChild as HTMLElement | null)
        : prev;
      if (pinned) {
        const overhang = pinned.offsetHeight - window.innerHeight;
        const ghost = pinned.querySelector<HTMLElement>("[data-o-ghost]");
        let pullUp = Math.max(0, overhang);
        if (ghost) {
          const g = ghost.getBoundingClientRect();
          const p = pinned.getBoundingClientRect();
          const headingBottom = g.top - p.top + g.height;
          // Land the section's top a breath under the standing heading.
          pullUp = Math.max(
            pullUp,
            overhang + window.innerHeight - headingBottom - 24,
          );
        }
        if (pullUp > 0) gsap.set(root, { marginTop: -pullUp });
      }
      const ground = q(root, "[data-ground]");
      if (ground) tl.groundRamp(ground, { stops, duration: 1 }, 0);

      // The rows open themselves as the reader reaches them: each <details>
      // flips open once as it crosses the trigger line, and the CSS
      // ::details-content transition (globals.css) does the expanding — the
      // row unfolds and the page reflows with it. One-way, like every
      // entrance (X4): rows never re-close on scroll-up, but the summary
      // stays a real disclosure control, so a reader can still close and
      // reopen by hand. The programmatic open fires the same `toggle` event
      // the motion script debounces into a ScrollTrigger.refresh.
      //
      // "top 42%": the reading gaze rests in the upper-middle of the screen,
      // not at its bottom edge. Triggering there means the row unfolds right
      // under the line the reader is actually looking at — an earlier trigger
      // opens rows off in peripheral vision at the fold, and the reader only
      // ever meets them already expanded.
      //
      // Opens are SERIALIZED through one queue: a fast scroll can carry
      // several rows across the line in a single frame, and opening them all
      // at once both hides the expand animation and dumps every answer on the
      // reader together. One row unfolds, holds a beat, then the next —
      // accumulating, which is this page's verb. The 650ms spacing is the
      // 450ms ::details-content transition plus a breath.
      const queue: HTMLDetailsElement[] = [];
      let draining = false;
      const drain = () => {
        const next = queue.shift();
        if (!next) {
          draining = false;
          return;
        }
        draining = true;
        next.open = true;
        window.setTimeout(drain, 650);
      };
      // The markup ships each band's first row open (the rest state, and what
      // no-JS and reduced motion read). In motion that pre-open would show
      // rows further down the page already expanded before the reader gets
      // there — so every row starts closed here, and ALL opens run through
      // the queue, strictly in reading order.
      qa<HTMLDetailsElement>(root, "details[data-line]").forEach((row) => {
        row.open = false;
        ScrollTrigger.create({
          trigger: row,
          start: "top 42%",
          once: true,
          onEnter: () => {
            queue.push(row);
            if (!draining) drain();
          },
        });
      });

      // The landscape that splits the bands — "the world opening": the frame's
      // letterbox clip opens across its own approach, so the escarpment is
      // revealed rather than simply sitting there, and the caption settles in
      // as the frame completes. Grade-aware: at `frame` grade the image plane
      // itself holds still (the world moves, the record holds) — the clip is
      // the only thing that animates, so scale is pinned to 1.
      qa(root, "[data-frame]").forEach((frame) => {
        const caption = frame.parentElement?.querySelector<HTMLElement>(
          "[data-frame-caption]",
        );
        const sub = gsap.timeline({
          scrollTrigger: {
            trigger: frame,
            start: "top 85%",
            end: "top 20%",
            scrub: SCRUB.normal,
          },
        });
        sub.frameOpen(frame, {
          duration: 1,
          ...(frame.dataset.motion === "frame" ? { scale: 1 } : {}),
        });
        if (caption) {
          sub.fromTo(
            caption,
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.35, ease: EASE.country },
            0.6,
          );
        }
      });
    },
    enter: (tl) => {
      // The header sequence first — the aperture's hand-off has just spelled
      // "Our challenges" and faded; the section's own copy fades in beneath it
      // in reading order rather than standing there already, which read as the
      // heading appearing twice.
      const seq = qa(root, "[data-fade-seq]");
      const clusters = qa(root, "[data-cluster]");
      const lines = qa(root, "[data-cluster] [data-line]");
      if (seq.length) tl.arrive(seq, { duration: DUR.medium, stagger: 0.18 }, 0);
      if (clusters.length) tl.triad(clusters, { duration: DUR.medium }, 0.3);
      if (lines.length) tl.arrive(lines, { duration: DUR.medium }, 0.45);
    },
    cut: clearAll,
  });
}

/* -------------------------------------------------------------------------
   04 — pinnedCount
   ------------------------------------------------------------------------- */

/**
 * THE SPRING. Hi-fi §05 — "the page's pinned moment · eight days".
 *
 * "Counter · X3 scrubbed 1→8, the only place scroll controls time." Eight days
 * a spring ran, one per step, the reader turning them over.
 *
 * Snapped, because a scrubbed counter stranded between two days shows a number
 * that does not exist. `snap` is 1/(steps-1).
 *
 * Loud channel: MEDIA. The photograph behind the count is the thing; the
 * numerals are large but they are an index, not a display.
 *
 * The days turn split-flap style — a departure board, per the hi-fi frames —
 * and the last day pays off: the story's release line lifts in. The section's
 * scrim is static — part of the image, keeping the right-side text legible —
 * and is deliberately not animated here.
 *
 * Markup:
 *   [data-step]     each step, flapped in turn
 *   [data-media]    the plate behind them
 *   [data-release]  the withheld payoff, revealed with the final step
 */
export function pinnedCount(root: HTMLElement, span = 150): MotionModule {
  const steps = qa(root, "[data-step]");
  return composition("pinnedCount", root, {
    channel: "media",
    span,
    pin: true,
    snap: steps.length > 1 ? 1 / (steps.length - 1) : undefined,
    uses: ["splitFlap", "dissolve"],
    build: (tl) => {
      const media = qa(root, "[data-media]");
      const release = q(root, "[data-release]");
      if (steps.length > 1) tl.splitFlap(steps, { duration: DUR.medium }, 0);
      if (media.length > 1) tl.dissolve(media, { duration: DUR.large }, 0);
      // The payoff rides the last flip — day 08 and the koala arrive together.
      // The scrim is not touched: it is part of the image, holding the
      // right-side text legible for the section's whole life.
      const last = steps.length - 1;
      if (release) {
        tl.fromTo(
          release,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: DUR.medium, ease: EASE.country },
          last,
        );
      }
    },
    cut: (el) => {
      clearAll(el);
      // All eight days visible as a list, in order. The story still lands —
      // the release line is in the markup and simply reads where it sits.
      gsap.set(qa(el, "[data-step]"), { visibility: "visible", opacity: 1, rotationX: 0 });
    },
  });
}

/* -------------------------------------------------------------------------
   05 — stickyStreams
   ------------------------------------------------------------------------- */

/**
 * The work, and what it takes. Hi-fi §06 and §07.
 *
 * Seven streams as alternating rows, each carrying its own photograph; three
 * of them anchor tier (L2), whose frames sit bled to the viewport edge as the
 * markup's rest state.
 *
 * Every frame arrives with the Lumen reveal — "the world opening", scrubbed
 * across the frame's own approach: the clip-path opens while the photograph
 * counter-scales, so the picture is revealed rather than resized. The old
 * `bleed` tween is gone: the edge-bleed is now CSS rest state, and its scaleX
 * would fight frameOpen's media scale.
 *
 * Loud channel: MEDIA. Seven photographs opening in turn are what take the
 * screen; the copy just arrives.
 *
 * Markup:
 *   [data-index-item]        optional index rows, lit in turn
 *   [data-stream]            each stream row, carrying data-tier for L2
 *   [data-frame]/[data-media] the frame per stream; media is [data-frame-media]
 */
export function stickyStreams(root: HTMLElement, span = 360): MotionModule {
  return composition("stickyStreams", root, {
    channel: "media",
    span,
    uses: ["stickyIndex", "frameOpen", "triad"],
    build: (tl) => {
      const index = qa(root, "[data-index-item]");
      if (index.length) tl.stickyIndex(index, { duration: DUR.medium }, 0);

      // One reveal per frame, on its own scrubbed trigger — same pattern as
      // §03's landscape. The wipe unrolls from the frame's own side of the
      // page ([data-reveal-edge], stamped by the markup's alternation), so a
      // right-hand image opens right-to-left and vice versa. Grade-aware: at
      // `frame` grade the image plane holds still (the world moves, the
      // record holds), so scale pins to 1 and the clip is the only mover.
      qa(root, "[data-stream] [data-frame], [data-stream] [data-media]").forEach(
        (frame) => {
          const sub = gsap.timeline({
            scrollTrigger: {
              trigger: frame,
              start: "top 85%",
              end: "top 30%",
              scrub: SCRUB.normal,
            },
          });
          sub.frameOpen(frame, {
            duration: 1,
            edge: frame.dataset.revealEdge ?? "center",
            ...(frame.dataset.motion === "frame" ? { scale: 1 } : {}),
          });
        },
      );
    },
    enter: (tl) => {
      const streams = qa(root, "[data-stream]");
      if (streams.length) tl.triad(streams, { duration: DUR.medium });
    },
    cut: clearAll,
  });
}

/* -------------------------------------------------------------------------
   06 — breath
   ------------------------------------------------------------------------- */

/**
 * BREATH. Hi-fi §07b — "1.65.1 held, no caption · the hinge between the
 * apparatus and what it earns."
 *
 * One photograph, held, with nothing on it and nothing happening. This is the
 * shortest recipe in the file and the one that makes the rest work: after 360vh
 * of streams and index, the page stops talking for half a screen.
 *
 * Loud channel: NONE, and the assertion enforces it — reach for a loud effect
 * here and the build fails. That is the point. A rest scene is a real scene.
 *
 * Markup:
 *   [data-media]  the held photograph
 */
export function breath(root: HTMLElement, span = 47): MotionModule {
  return composition("breath", root, {
    channel: "none",
    span,
    uses: ["hold"],
    build: (tl) => {
      const media = qa(root, "[data-media]");
      if (media.length) tl.hold(media, { duration: 1 }, 0);
    },
    cut: clearAll,
  });
}

/* -------------------------------------------------------------------------
   07 — vessels (the accumulating close)
   ------------------------------------------------------------------------- */

/**
 * What the work produces. Hi-fi §08.
 *
 * Five vessels, four filling — 78%, 58%, 42%, 26%, and one at 0% that has not
 * started. The fifth staying empty is the honest part of the section.
 *
 * Loud channel: NONE declared, because nothing here takes the screen: the marks
 * are small and the movement is proportional. The section's weight comes from
 * what it says, which is the correct answer for a page's final claim.
 *
 * ⚠ R14 — the regulatory status labels are an open risk. Copy comes from the
 * content file; this only moves the marks.
 *
 * Markup:
 *   [data-vessel]  each fill mark, carrying data-fill="78"
 */
export function vessels(root: HTMLElement, span = 120): MotionModule {
  return composition("vessels", root, {
    channel: "none",
    span,
    uses: ["vesselFill", "arrive"],
    // Nothing scrubs here. A fill that runs backwards as the reader scrolls up
    // would read as the work being undone, which is the opposite of the claim.
    build: () => {},
    enter: (tl) => {
      const marks = qa(root, "[data-vessel]");
      const labels = qa(root, "[data-vessel-label]");
      if (labels.length) tl.arrive(labels, { duration: DUR.medium }, 0);
      if (marks.length) tl.vesselFill(marks, { duration: DUR.large }, 0.1);
    },
    cut: (el) => {
      clearAll(el);
      // Fills shown at their true proportions, statically. The figures are the
      // content; only the animation of them is optional.
      qa(el, "[data-vessel]").forEach((mark) => {
        gsap.set(mark, {
          scaleX: Number(mark.dataset.fill ?? 0) / 100,
          transformOrigin: "left center",
        });
      });
    },
  });
}

/* -------------------------------------------------------------------------
   08 — quietArrival
   ------------------------------------------------------------------------- */

/**
 * A screen that simply arrives. Hi-fi §09.
 *
 * Heading settles, cards come in on their tiers, nothing scrubs and nothing
 * pins. Most of a site is this, and a page that ends on it ends by getting out
 * of its own way — which is right for the screen that carries the one ask.
 *
 * Loud channel: TYPE, by elimination. There is no media and no transition, so
 * the heading is the only thing that can be the loudest thing present.
 *
 * Markup:
 *   [data-heading]  the headline
 *   [data-cluster]  each card, carrying data-tier
 */
export function quietArrival(root: HTMLElement, span = 100): MotionModule {
  return composition("quietArrival", root, {
    channel: "type",
    span,
    uses: ["settle", "triad", "arrive"],
    build: () => {},
    enter: (tl) => {
      const heading = q(root, "[data-heading]");
      const clusters = qa(root, "[data-cluster]");
      const lines = qa(root, "[data-cluster] [data-line]");
      if (heading) tl.settle(heading, { duration: DUR.large }, 0);
      if (clusters.length) tl.triad(clusters, { duration: DUR.medium }, 0.1);
      if (lines.length) tl.arrive(lines, { duration: DUR.medium }, 0.2);
    },
    cut: clearAll,
  });
}

/** Everything, for the lab. */
export const RECIPES = {
  fullBleedOpen,
  apertureSequence,
  clusterDescent,
  pinnedCount,
  stickyStreams,
  breath,
  vessels,
  quietArrival,
} as const;

export type RecipeName = keyof typeof RECIPES;

