"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import { Flip } from "gsap/Flip";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { prefersReduced } from "@/lib/motion-controller";
import { lockScroll, unlockScroll } from "@/lib/motion/smooth-scroll";
import { registerYachatdacEffects } from "@/lib/motion/effects";
import type { Photo } from "@/content/kit";

gsap.registerPlugin(useGSAP, Draggable, Flip, InertiaPlugin);

/**
 * The §04 ranger carousel — the RangerStrip's successor.
 *
 * Three behaviours, per the 1 Sep direction (the two reference gifs):
 *
 *   1. THE BELT. A flat, linear row (3 Sep direction — the earlier arc is
 *      gone): cards stay upright, and presence is carried by scale — biggest
 *      at the viewport centre, easing down toward the edges. The falloff
 *      holds whether or not anyone is dragging.
 *   2. THE LOOP. Dragging travels an infinite belt: positions wrap, so the
 *      seven slots repeat without ends. Inertia carries a throw and settles
 *      on a card centre.
 *   3. THE PROFILE. Hovering a card previews it (the frame lifts its label);
 *      clicking opens the ranger's profile IN PLACE — a scrollable overlay
 *      with portrait, copy and the gallery, and an exit button back to the
 *      section. No route change: the page never leaves §04.
 *
 * SSR / no-JS floor: the markup renders as the old drag strip (a plain
 * overflow-x scroll row). The arc, the loop and the overlay are all applied
 * on mount — with JavaScript off this is still every photograph in a row.
 *
 * ⚠ Names, identification and consent are still to come (see the section's
 * note in living-work/_components/Sections.tsx) — the profile renders "[ name held ]" and
 * the section body as a stand-in biography until they land.
 */

export type RangerSlot = {
  photo?: Photo;
  caption: string;
};

/** Card geometry. SPACING is card width + the strip's gap. */
const CARD_W = 280;
const SPACING = 300;
/** The edge card's scale (3 Sep direction: the belt is LINEAR — no rotation,
    no arc — and the centre card is the biggest). Cards ease between 1 at the
    viewport centre and this at its edges on a cosine bell. */
const SCALE_MIN = 0.78;

const pad = (n: number) => String(n).padStart(2, "0");

export function RangerCarousel({
  slots,
  profileBody,
}: {
  slots: RangerSlot[];
  profileBody: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const lastCard = useRef<HTMLElement | null>(null);
  /** The card image's captured state at click — the flight in starts here. */
  const flipIn = useRef<ReturnType<typeof Flip.getState> | null>(null);
  /** The portrait's captured state at exit — the flight home starts here. */
  const flipOut = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  /* --- the belt: arc layout + infinite drag -------------------------------- */
  useGSAP(
    () => {
      // Registers the `country` / `quiet` CustomEases the overlay uses —
      // idempotent, and the motion pass usually beat us to it anyway.
      registerYachatdacEffects();
      const stage = stageRef.current;
      const track = trackRef.current;
      if (!stage || !track) return;

      const cards = Array.from(track.children) as HTMLElement[];
      const n = cards.length;
      if (!n) return;

      // REDUCED MOTION — leave the strip alone. The markup below is a native
      // `overflow-x-auto` row that already scrolls by touch, wheel and
      // keyboard, and it snaps. Building the belt would replace that with
      // Draggable, so a reader who asked for less motion would be left with a
      // strip that only moves if JavaScript is holding it up. The count stays
      // at its server value, which is honest: nothing is moving.
      if (prefersReduced()) return;

      const total = n * SPACING;
      // Wrap around the viewport centre so the belt has no ends.
      const wrapX = gsap.utils.wrap(-total / 2, total / 2);
      const wrapIndex = gsap.utils.wrap(0, n);

      // Leave the SSR strip: the track becomes a stage and the cards seat on
      // the wheel. Height is measured from a card BEFORE absolutising, plus
      // the deepest arc drop a visible card can reach.
      const cardH = cards[0].offsetHeight;
      gsap.set(track, {
        display: "block",
        position: "relative",
        overflow: "visible",
        height: cardH + 24,
        paddingLeft: 0,
        paddingRight: 0,
      });
      gsap.set(cards, {
        position: "absolute",
        top: 0,
        left: "50%",
        width: CARD_W,
        transformOrigin: "50% 50%",
      });

      const pos = { x: 0 };
      const render = () => {
        // LINEAR, per the 3 Sep direction: a flat belt, cards upright, with
        // presence carried by scale alone — biggest at the centre, easing
        // down toward the edges on a cosine bell so nothing steps.
        const half = Math.max(window.innerWidth / 2, 1);
        for (let i = 0; i < n; i++) {
          const x = wrapX(i * SPACING + pos.x);
          const t = Math.min(Math.abs(x) / half, 1);
          gsap.set(cards[i], {
            x: x - CARD_W / 2,
            scale: SCALE_MIN + (1 - SCALE_MIN) * 0.5 * (1 + Math.cos(Math.PI * t)),
          });
        }
        if (countRef.current) {
          const centred = wrapIndex(Math.round(-pos.x / SPACING));
          countRef.current.textContent = `${pad(centred + 1)} / ${pad(n)}`;
        }
      };
      render();

      // One proxy carries the drag; the belt just reads its x. The proxy's x
      // grows without bound and the wrap doesn't care, so no re-centering
      // bookkeeping is needed.
      const proxy = document.createElement("div");
      const draggable = Draggable.create(proxy, {
        type: "x",
        trigger: stage,
        inertia: !prefersReduced(),
        // A throw settles with a card on the centre line.
        snap: (value: number) => Math.round(value / SPACING) * SPACING,
        onDrag() {
          pos.x = this.x;
          render();
        },
        onThrowUpdate() {
          pos.x = this.x;
          render();
        },
      })[0];

      return () => {
        draggable.kill();
      };
    },
    { scope: stageRef },
  );

  /* --- the profile overlay ------------------------------------------------- */
  /** The card image the open flight left behind — hidden while its double is
      away, shown again the moment the flight home begins. */
  const sourceMedia = () =>
    lastCard.current?.querySelector<HTMLElement>("[data-card-media]") ?? null;

  const close = () => {
    const overlay = overlayRef.current;
    const finish = () => {
      setOpenIndex(null);
      lastCard.current?.focus({ preventScroll: true });
    };
    if (overlay && !prefersReduced()) {
      // THE EXIT, in order: the profile scrolls back up to the portrait, THEN
      // everything that is not the portrait dissolves (backdrop included —
      // the section shows through), THEN the image flies home. Capturing the
      // Flip state after the scroll settles is what makes the flight start
      // from the portrait the reader is actually looking at.
      const portrait = overlay.querySelector<HTMLElement>("[data-profile-portrait]");
      const dissolve = () => {
        if (portrait) flipOut.current = Flip.getState(portrait);
        gsap.to(overlay.querySelectorAll("[data-profile-fade]"), {
          autoAlpha: 0,
          duration: 0.3,
          ease: "quiet",
          onComplete: finish,
        });
      };
      if (overlay.scrollTop > 4) {
        gsap.to(overlay, {
          scrollTop: 0,
          // Deeper scrolls get a touch longer, capped — never a long ride.
          duration: gsap.utils.clamp(0.35, 0.7, overlay.scrollTop / 3000),
          ease: "quiet",
          onComplete: dissolve,
        });
      } else {
        dissolve();
      }
    } else {
      finish();
    }
  };

  useGSAP(
    () => {
      const overlay = overlayRef.current;

      if (openIndex === null) {
        // THE WAY BACK. The overlay has just unmounted; the portrait's last
        // position is in flipOut — fly the card's own image home from there.
        const media = sourceMedia();
        const state = flipOut.current;
        flipOut.current = null;
        const card = lastCard.current;
        const text = card?.querySelector<HTMLElement>("[data-card-text]");
        // The caption returns and the hover UI re-arms only once the image
        // has landed — mid-flight both read as clutter over the arc.
        const land = () => {
          card?.removeAttribute("data-flying");
          if (text) gsap.to(text, { autoAlpha: 1, duration: 0.4, ease: "quiet" });
        };
        if (media) {
          gsap.set(media, { autoAlpha: 1 });
          if (state && !prefersReduced()) {
            Flip.from(state, {
              targets: media,
              absolute: true,
              // Transforms only — the default left/top/width/height mode
              // re-lays-out the full-size image every frame, which is the
              // stutter the flight home showed on both desktop and mobile.
              scale: true,
              duration: 0.7,
              ease: "country",
              zIndex: 90,
              onComplete: land,
            });
          } else {
            land();
          }
        } else {
          land();
        }
        return;
      }
      if (!overlay) return;

      overlay
        .querySelector<HTMLElement>("[data-profile-exit]")
        ?.focus({ preventScroll: true });

      if (!prefersReduced()) {
        // THE FLIGHT IN. The card's image (captured at click) morphs into the
        // portrait slot — one photograph travelling, no cut — while the
        // charcoal rises behind it and the copy settles in after it lands.
        const portrait = overlay.querySelector<HTMLElement>("[data-profile-portrait]");
        // Hide the copy and gallery BEFORE first paint — a fromTo starting at
        // 0.35 leaves them visible for a third of a second, which read as the
        // text flashing over the flight.
        const lines = overlay.querySelectorAll("[data-profile-line]");
        const gallery = overlay.querySelector("[data-profile-gallery]");
        gsap.set(lines, { autoAlpha: 0, y: 24 });
        if (gallery) gsap.set(gallery, { autoAlpha: 0 });
        if (flipIn.current && portrait) {
          Flip.from(flipIn.current, {
            targets: portrait,
            absolute: true,
            scale: true,
            duration: 0.82,
            ease: "country",
          });
        }
        flipIn.current = null;
        const tl = gsap.timeline({ defaults: { ease: "country" } });
        tl.fromTo(
          overlay.querySelector("[data-profile-backdrop]"),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.5, ease: "quiet" },
          0,
        );
        tl.to(lines, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08 }, 0.55);
        if (gallery) tl.to(gallery, { autoAlpha: 1, duration: 0.55 }, 0.8);
      } else {
        flipIn.current = null;
      }
    },
    { dependencies: [openIndex] },
  );

  // The locks live in a plain effect, NOT in useGSAP: without revertOnUpdate,
  // useGSAP only runs a returned cleanup on unmount — so closing the profile
  // left Lenis stopped and the page unscrollable. useEffect guarantees the
  // cleanup on every openIndex change.
  useEffect(() => {
    if (openIndex === null) return;
    // Both locks are needed: overflow for native scroll, lockScroll for
    // Lenis — the smooth-scroll module intercepts wheel on the whole window
    // and would keep driving the page under the overlay otherwise.
    document.body.style.overflow = "hidden";
    lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      unlockScroll();
      document.removeEventListener("keydown", onKey);
    };
  }, [openIndex]);

  const open = openIndex === null ? null : slots[openIndex];

  return (
    <div>
      {/* The count and the drag cue, aligned with the section's column. */}
      <div className="mx-auto flex w-full max-w-7xl items-baseline justify-between px-6 lg:px-16">
        <p className="eyebrow text-xs text-gold">
          <span ref={countRef}>01 / {pad(slots.length)}</span>
        </p>
        <p className="eyebrow text-xs text-canvas/55">Drag &rarr;</p>
      </div>

      {/* The stage. SSR renders the old strip; on mount the cards seat on
          the wheel. Both edges fade — the belt continues both ways. */}
      <div
        ref={stageRef}
        className="relative mt-4 cursor-grab touch-pan-y select-none active:cursor-grabbing"
      >
        <ul
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] lg:px-16 [&::-webkit-scrollbar]:hidden"
        >
          {slots.map((slot, i) => (
            <li key={slot.caption} className="w-[280px] shrink-0 snap-start">
              {slot.photo ? (
                <button
                  type="button"
                  className="group block w-full cursor-pointer text-left"
                  aria-label={`View ranger profile — ${slot.caption}`}
                  aria-haspopup="dialog"
                  onClick={(e) => {
                    const card = e.currentTarget;
                    lastCard.current = card;
                    // Capture the image where it stands on the arc, then hide
                    // it — its double flies to the profile from exactly here.
                    // The caption fades with it and the hover UI is gated off
                    // (data-flying) until the flight home has landed.
                    const media = card.querySelector<HTMLElement>("[data-card-media]");
                    if (media && !prefersReduced()) {
                      flipIn.current = Flip.getState(media);
                      card.setAttribute("data-flying", "");
                      gsap.set(media, { autoAlpha: 0 });
                      gsap.to(card.querySelector("[data-card-text]"), {
                        autoAlpha: 0,
                        duration: 0.2,
                        ease: "quiet",
                      });
                    }
                    setOpenIndex(i);
                  }}
                >
                  {/* The holder keeps the card's shape while Flip absolutises
                      the image for its flights — without it the caption jumps
                      into the emptied space and back. */}
                  <div className="relative h-[400px]">
                  <div
                    data-card-media
                    data-flip-id={`ranger-${i}`}
                    className="absolute inset-0 overflow-hidden rounded-sm"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slot.photo.src}
                      alt={slot.caption}
                      width={slot.photo.width}
                      height={slot.photo.height}
                      draggable={false}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 ease-quiet group-hover:scale-[1.06] group-focus-visible:scale-[1.06]"
                    />
                    {/* The hover preview — a scrim rises and the invitation
                        lands. Pure CSS, so it costs nothing while dragging. */}
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-linear-to-t from-charcoal/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 ease-quiet group-hover:opacity-100 group-focus-visible:opacity-100 group-data-flying:opacity-0!"
                    />
                    <p
                      aria-hidden
                      className="eyebrow absolute bottom-4 left-4 text-xs text-gold opacity-0 transition-all duration-500 ease-quiet group-hover:opacity-100 group-focus-visible:opacity-100 group-data-flying:opacity-0!"
                    >
                      View profile &rarr;
                    </p>
                  </div>
                  </div>
                  <div data-card-text>
                    <p className="eyebrow mt-4 text-xs text-gold">[ name held ]</p>
                    <p className="mt-1 text-sm text-canvas/70">{slot.caption}</p>
                  </div>
                </button>
              ) : (
                <div>
                  <div
                    data-placeholder="image"
                    className="flex h-[400px] items-end rounded-sm border border-dashed border-canvas/25 bg-canvas/5 p-4"
                  >
                    <p className="text-xs leading-relaxed text-canvas/50">
                      1.82.1 &mdash; at the escarpment. Not yet gathered.
                    </p>
                  </div>
                  <p className="eyebrow mt-4 text-xs text-gold">[ name held ]</p>
                  <p className="mt-1 text-sm text-canvas/70">{slot.caption}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-l from-transparent to-charcoal lg:w-40"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-r from-transparent to-charcoal lg:w-40"
        />
      </div>

      {/* THE PROFILE — in place, never a page. Scrollable, exits back to §04. */}
      {open?.photo ? (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Ranger profile — ${open.caption}`}
          data-lenis-prevent
          className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* The ground — separate from the root so the flights can play over
              a rising/dissolving charcoal while the portrait stays solid. */}
          <div
            data-profile-backdrop
            data-profile-fade
            aria-hidden
            className="fixed inset-0 -z-10 bg-charcoal"
          />
          <button
            type="button"
            data-profile-exit
            data-profile-fade
            onClick={close}
            className="eyebrow fixed top-6 right-6 z-10 flex items-center gap-3 rounded-full border border-canvas/25 bg-charcoal/70 px-5 py-3 text-xs text-canvas backdrop-blur transition-colors duration-(--dur-small) ease-quiet hover:border-gold hover:text-gold lg:top-8 lg:right-12"
          >
            <span aria-hidden className="text-base leading-none">&times;</span>
            Back to the Rangers
          </button>

          <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-16 lg:py-28">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              {/* The holder keeps the grid cell's size while Flip absolutises
                  the portrait for the flight — without it the left column
                  collapses mid-flight and the copy slides under the image. */}
              <div className="relative h-[60svh] lg:sticky lg:top-28 lg:h-[70svh]">
              <div
                data-profile-portrait
                data-flip-id={`ranger-${openIndex}`}
                className="absolute inset-0 overflow-hidden rounded-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={open.photo.src}
                  alt={open.caption}
                  width={open.photo.width}
                  height={open.photo.height}
                  className="h-full w-full object-cover"
                />
              </div>
              </div>

              <div data-profile-fade>
                <p data-profile-line className="eyebrow text-burnt">
                  The Rangers &middot; {pad((openIndex ?? 0) + 1)} /{" "}
                  {pad(slots.length)}
                </p>
                <h3
                  data-profile-line
                  className="headline mt-5 text-4xl text-canvas sm:text-5xl"
                >
                  [ name held ]
                </h3>
                <p data-profile-line className="eyebrow mt-4 text-xs text-gold">
                  {open.caption}
                </p>
                {/* ⚠ Stand-in biography — the section body until per-ranger
                    copy and consent land. */}
                <p
                  data-profile-line
                  className="mt-8 max-w-xl text-base leading-relaxed text-canvas/80"
                >
                  {profileBody}
                </p>
                <p
                  data-profile-line
                  className="eyebrow mt-10 max-w-xl text-xs leading-relaxed text-gold"
                >
                  &#9671; Name, identification and consent to be named are
                  still to come &mdash; this profile is built to receive them.
                </p>
              </div>
            </div>

            {/* The gallery — the rest of the strip, inside the profile. */}
            <div data-profile-fade data-profile-gallery className="mt-24">
              <p data-profile-line className="eyebrow text-xs text-burnt">
                Gallery
              </p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {slots.map((slot, i) =>
                  i === openIndex || !slot.photo ? null : (
                    <figure key={slot.caption}>
                      <div className="aspect-[3/4] overflow-hidden rounded-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={slot.photo.src}
                          alt={slot.caption}
                          width={slot.photo.width}
                          height={slot.photo.height}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <figcaption className="mt-3 text-sm text-canvas/70">
                        {slot.caption}
                      </figcaption>
                    </figure>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
