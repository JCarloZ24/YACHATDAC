"use client";

import gsap from "gsap";
import { homeTruthScenes } from "@/content/home-truth-scenes";

/**
 * How far the land pushes in across The Invitation beat. Grammar: "being
 * drawn in" / pushIn — a slow scrubbed push toward the subject, scrubbed
 * rather than timed. HOME_PORTAL is grade `full`, so scaling the image plane
 * is permitted here. Opened up from an initial 1.06 on user direction, 9
 * September 2026: at six percent the approach was not reading. Fourteen is
 * still an approach rather than a zoom, but it is now doing visible work —
 * if it ever starts to feel like the land is being pushed at the reader
 * rather than met, this is the number that did it.
 *
 * Opened again 1.14 → 1.32 on user direction, 9 September 2026, once the beat
 * became a lifted panel: the land shows across a band at the top of the
 * canvas rather than the whole of it, and at 1.14 that band read as a distant
 * strip. The scale is about the held bottom edge, so magnifying pushes the
 * near ground up into the band rather than out of it. Past the point where
 * the road corridor loses the treeline this stops being an approach.
 */
const LANDSCAPE_INVITATION_ZOOM = 1.32;

/**
 * How far the land scene travels up the screen across The Invitation beat, in
 * screen heights. Land across the top, charcoal below it for the cards to be
 * read against (latest reference, 9 September 2026). Raised 0.55 → 0.62 on
 * user direction the same day — the band the land finished on was reading as
 * too much of the canvas. Nothing bounds this but taste: the travel is in
 * screen space, so a larger number simply takes more of the land off the top,
 * and the soft edge (liftEdge in home-painting.ts) follows it up.
 *
 * ⚠ Reversed twice on user direction the same day. It began as a drift DOWN
 * of the sampling window — parallax, ground further away than the cards —
 * which fought the illusion the panel move was made for: a page's background
 * does not travel against its own scroll. It then briefly rose by moving that
 * same window, which a bottom-anchored crop has almost no room for. This
 * moves the whole scene in SCREEN space instead, so the travel is not bounded
 * by the texture at all and the edge that rises into view is the
 * photograph's own dissolve. The uniform is `lift`; see home-painting.ts.
 */
const LANDSCAPE_INVITATION_LIFT = 0.62;

/**
 * How far the exit shade closes over the land, 9 September 2026 user
 * direction. It used to reach 1 — a full charcoal wipe, which is why the
 * band above The Invitation read as a flat blur rather than ground. Short of
 * 1 the photograph stays legible under it. It used to hand off to the
 * Invitation section's own charcoal gradient; since that section became a
 * panel on this canvas there is no gradient below to finish the job, so this
 * value is now the whole of the darkening the cards are read against.
 */
const LANDSCAPE_EXIT_SHADE = 0.55;

/** Grammar: "the world opening", Home photo collage, 8 September 2026.
 * Gallery first, type second (F7). Semantic word wrappers remain CMS-safe.
 */
export function registerHome(): void {
  // AMB-05: one seamless phase; the canvas owner controls visibility/cleanup.
  gsap.registerEffect({
    name: "homeLandscapeBreeze",
    defaults: {},
    effect: (_targets: HTMLElement[], config: { phase: { value: number }; render: () => void }) =>
      gsap.timeline({ paused: true, repeat: -1 }).fromTo(config.phase,
        { value: 0 }, { value: Math.PI * 2, duration: 24, ease: "none", onUpdate: config.render }),
  });
  // Grammar: a change of ground / Home hero dissolve, 9 September 2026.
  gsap.registerEffect({
    name: "homeHeroDissolve",
    defaults: {},
    effect: (targets: HTMLElement[], config: { state: { progress: number; portal: number; wonder: number; truth: number; truthSky: number; truthLight: number; belonging: number; landscapeLift: number; landscapeZoom: number }; render: () => void }) => {
      const root = targets[0];
      const timeline = gsap.timeline({ paused: true });
      timeline.fromTo(config.state, { progress: 0 },
        { progress: 1, duration: 1, ease: "none", onUpdate: config.render }, 0);
      timeline.fromTo(root.querySelectorAll("[data-hero-copy]"),
        { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.3, ease: "none" }, 0);
      timeline.fromTo(root.querySelectorAll("[data-hero-scrim]"),
        { opacity: 1 }, { opacity: 0, duration: 0.4, ease: "none" }, 0);
      timeline.to(root.querySelectorAll(".home-painting-copy"),
        { autoAlpha: 0, duration: 0.15, ease: "sine.inOut" }, 1.03);
      timeline.fromTo(config.state, { portal: 0 },
        { portal: 1, duration: 1, ease: "sine.inOut", onUpdate: config.render }, 1.18);
      timeline.to({}, { duration: 0.12 }, 2.18);
      timeline.fromTo(config.state, { wonder: 0 },
        { wonder: 1, duration: 0.8, ease: "none", onUpdate: config.render }, 2.3);
      timeline.fromTo(root.querySelector("[data-home-wonder]"),
        { y: () => root.clientHeight, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: "none" }, 2.3);
      timeline.to({}, { duration: 0.3 }, 3.1);
      timeline.to(root.querySelector("[data-home-wonder]"),
        { y: () => -root.clientHeight, autoAlpha: 0, duration: 0.65, ease: "none" }, 3.4);
      timeline.fromTo(config.state, { truth: 0 },
        { truth: 1, duration: 0.8, ease: "none", onUpdate: config.render }, 3.4);
      timeline.fromTo(root.querySelector("[data-home-truth]"),
        { y: () => root.clientHeight * 0.35, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, ease: "none" }, 3.6);
      timeline.to({}, { duration: 0.4 }, 4.2);
      // SCR-10: measured Figma layer offsets; still prose between transitions.
      const marker = root.querySelector("[data-truth-marker]");
      const markerY = (y: number) => root.clientWidth < 1024
        ? (730 / 901 + (y - 730) * root.clientWidth / 1440 / root.clientHeight) * 100
        : y / 9.01;
      timeline.set(marker, { xPercent: homeTruthScenes[0].x / 14.4, yPercent: () => markerY(homeTruthScenes[0].y) }, 0);
      timeline.fromTo(root.querySelector("[data-truth-timeline]"),
        { autoAlpha: 0, xPercent: 100 }, { autoAlpha: 1, xPercent: 0, duration: 0.4, ease: "sine.inOut" }, 4.6);
      homeTruthScenes.forEach((scene, index) => {
        const at = 4.6 + index;
        timeline.to(config.state, { truthSky: scene.sky, truthLight: scene.light,
          duration: 1, ease: "none", onUpdate: config.render }, at);
        if (index) {
          timeline.to(marker, { xPercent: scene.x / 14.4, yPercent: () => markerY(scene.y),
            duration: 1, ease: "none" }, at);
          timeline.to(root.querySelector('[data-truth-panel="' + (index - 1) + '"]'),
            { autoAlpha: 0, duration: 0.3, ease: "sine.inOut" }, at);
          timeline.to(root.querySelector('[data-truth-year="' + (index - 1) + '"]'),
            { autoAlpha: 0, duration: 0.3, ease: "sine.inOut" }, at);
          timeline.fromTo(root.querySelector('[data-truth-panel="' + index + '"]'),
            { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: "sine.inOut" }, at + 0.32);
          timeline.fromTo(root.querySelector('[data-truth-year="' + index + '"]'),
            { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: "sine.inOut" }, at + 0.32);
        }
        // Continuous travel between years; pause only on the final account.
        if (index === homeTruthScenes.length - 1) timeline.to({}, { duration: 0.9 }, at + 1);
      });
      // SCR-10: the dated account clears before Belonging arrives.
      const belongingAt = timeline.duration();
      timeline.to(root.querySelectorAll("[data-home-truth], [data-truth-timeline]"),
        { autoAlpha: 0, duration: 0.45, ease: "sine.inOut" }, belongingAt);
      timeline.to(config.state, { truthSky: 5822, truthLight: 5822, belonging: 1,
        duration: 1.2, ease: "sine.inOut", onUpdate: config.render }, belongingAt);
      timeline.fromTo(root.querySelector("[data-home-belonging]"),
        { y: () => root.clientHeight * 0.3, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, ease: "sine.out" }, belongingAt + 0.45);
      timeline.to({}, { duration: 1.2 }, belongingAt + 1.45);
      const invitationAt = timeline.duration();
      timeline.to(root.querySelector("[data-home-belonging]"),
        { autoAlpha: 0, duration: 0.6, ease: "sine.inOut" }, invitationAt);
      timeline.to(root.querySelector("[data-landscape-exit-shade]"),
        { opacity: LANDSCAPE_EXIT_SHADE, duration: 0.6, ease: "none" }, invitationAt);
      // The land goes up with the panel and charcoal follows it in, so the
      // canvas reads as the page scrolling on. Slower than the panel, which
      // is the parallax a scroll produces; the panel covers a viewport in
      // 1.3 units, the land a little over half of one in 1.6.
      timeline.to(config.state, { landscapeLift: LANDSCAPE_INVITATION_LIFT,
        duration: 1.6, ease: "sine.out", onUpdate: config.render }, invitationAt);
      // Grammar: being drawn in / pushIn. Rides the same span as the drift so
      // the land settles on one movement, not two competing ones; the anchor
      // follows the zoom, so this magnifies about the held bottom edge.
      timeline.to(config.state, { landscapeZoom: LANDSCAPE_INVITATION_ZOOM,
        duration: 1.6, ease: "sine.out", onUpdate: config.render }, invitationAt);
      // Grammar: the road opens into an invitation (SCR-09 / ENT-05).
      // 9 September 2026, user direction: the beat is a panel on this canvas
      // now, not a section below it, so it has to arrive the way a scroll
      // would deliver it — the whole block travelling up one viewport while
      // the land keeps drifting the other way behind it. yPercent, so the
      // distance is the panel's own height and nothing measures layout. It
      // rides the drift's span and lands a little before it settles.
      timeline.fromTo(root.querySelector("[data-home-invitation]"),
        { yPercent: 100, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 1.3, ease: "sine.out" }, invitationAt + 0.2);
      // The pin end is derived from this duration, so the reading hold is what
      // buys the cards a still screen before the page moves on.
      timeline.to({}, { duration: 1.1 }, invitationAt + 1.6);
      // The Way Forward, on the same canvas (9 September 2026, user
      // direction). The cards leave the way they came and the closing line
      // takes their place, while the lift finishes carrying the land off the
      // top: the panel is read on a canvas that has become nothing but its
      // own ground, which is what the reference shows.
      const wayAt = timeline.duration();
      timeline.to(root.querySelector("[data-home-invitation]"),
        { yPercent: -100, autoAlpha: 0, duration: 1, ease: "sine.in" }, wayAt);
      timeline.to(config.state, { landscapeLift: 1.15,
        duration: 1.2, ease: "sine.inOut", onUpdate: config.render }, wayAt);
      // The closing line does not travel (9 September 2026, user direction).
      // Every other panel on this canvas arrives by moving; this one is the
      // page's last word and is simply there, held still while it resolves —
      // testimony's stillness applied to a statement. Opacity only, so it
      // stays in the place the reader's eye is already resting.
      //
      // And it waits. The cards clear at wayAt + 1 and the land finishes
      // leaving at + 1.2; the fade starts after both, so there is an empty
      // canvas for a beat before the sentence arrives on it. Bringing this
      // forward is what makes the line feel like it was following the cards
      // out rather than beginning something.
      timeline.fromTo(root.querySelector("[data-home-way-forward]"),
        { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, ease: "sine.inOut" }, wayAt + 1.5);
      // The pattern rises into place and stays there (9 September 2026, user
      // direction, revising a continuous traverse the same day). It enters
      // from below the canvas — a whole panel height down, so it is genuinely
      // off screen and not merely low — and comes to rest at its Figma
      // position, where it holds under the line for the rest of the beat.
      // Easing out, so it arrives rather than stops. yPercent, so the
      // distance is the panel's own height at any viewport; the wrapper
      // carries the transform because the images' centring and offsets are
      // classes — see WayForwardStatement.tsx.
      timeline.fromTo(root.querySelector("[data-way-forward-ground]"),
        { yPercent: 100 }, { yPercent: 0, duration: 1.9, ease: "sine.out" }, wayAt + 0.9);
      // The page ends on this line; hold it before the offer arrives, or the
      // sentence is gone the moment it lands.
      timeline.to({}, { duration: 1.2 }, wayAt + 2.7);
      // The offer, on the same canvas again — deck 22 then 23 (9 September
      // 2026, user direction). The line clears and the paragraph takes its
      // place in the same middle band, then the four photographs arrive
      // around it. Only the line goes: the spirals are this beat's ground
      // too, and holding them is what keeps the two panels one screen rather
      // than two.
      const offerAt = timeline.duration();
      // The panel is held hidden by CSS until its beat (the same gate the
      // other two carry, in invitation.css), and unlike them nothing here
      // animates the panel itself -- the body and the plates each own their
      // own opacity. Without this it stays hidden for the whole page: the
      // line fades at offerAt and the screen is left with nothing but the
      // spirals, which is exactly how it shipped for one build. Zero
      // duration, so it reverses on scrub with everything else.
      timeline.set(root.querySelector("[data-home-offer]"), { autoAlpha: 1 }, offerAt);
      timeline.to(root.querySelector("[data-way-forward-line]"),
        { autoAlpha: 0, duration: 0.7, ease: "sine.inOut" }, offerAt);
      timeline.fromTo(root.querySelector("[data-offer-body]"),
        { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9, ease: "sine.inOut" }, offerAt + 0.6);
      // Frame grade: the plates arrive and then hold absolutely still. The
      // rise is a fraction of the canvas rather than a pixel count, and the
      // stagger reads corner to corner rather than as one block landing.
      timeline.fromTo(root.querySelectorAll("[data-offer-plate]"),
        { y: () => root.clientHeight * 0.07, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.18, ease: "sine.out" }, offerAt + 1.4);
      // A held screen before the last one arrives.
      timeline.to({}, { duration: 1.3 }, offerAt + 2.9);
      // The pathways, and the end of the page (deck 24, 9 September 2026,
      // user direction — they were briefly a section below the canvas). The
      // offer and the spirals both clear, and the row comes up a viewport the
      // way The Invitation did, so the page closes on the same movement it
      // opened the choices with. The cards then settle in a corner-to-corner
      // stagger; frame grade, so nothing moves once they land.
      const pathAt = timeline.duration();
      timeline.to(root.querySelectorAll("[data-home-offer], [data-home-way-forward]"),
        { autoAlpha: 0, duration: 0.7, ease: "sine.inOut" }, pathAt);
      timeline.fromTo(root.querySelector("[data-home-pathways]"),
        { yPercent: 100, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 1.2, ease: "sine.out" }, pathAt + 0.25);
      timeline.fromTo(root.querySelectorAll("[data-pathway-card]"),
        { y: () => root.clientHeight * 0.06, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.12, ease: "sine.out" }, pathAt + 0.9);
      // Then the scroll keeps carrying the row right, so the fourth card is
      // brought in by reading on rather than by finding a swipe. Linear: this
      // is the page's scroll shown sideways, and easing it would make the
      // wheel feel like it was slipping. The distance is read once per
      // refresh, never per frame, and clamps to zero when the track already
      // fits — a wide enough viewport simply has nothing to travel.
      //
      // Measured against the mask's CONTENT width, not its clientWidth, which
      // would count the left padding twice over. The margin the row rests
      // against on the right is the track's own trailing padding, and it is
      // inside scrollWidth — so the space at either end is stated once, in
      // the markup, and this stays a single subtraction.
      const track = root.querySelector<HTMLElement>("[data-pathways-track]");
      timeline.to(track, {
        x: () => {
          const mask = track?.parentElement;
          if (!mask || !track) return 0;
          const gutter = parseFloat(getComputedStyle(mask).paddingLeft) || 0;
          return Math.min(0, mask.clientWidth - gutter - track.scrollWidth);
        },
        duration: 1.8, ease: "none",
      }, pathAt + 1.9);
      // The last held screen of the page before the pin releases to the footer.
      timeline.to({}, { duration: 1.2 }, pathAt + 3.7);
      // SCR-09, 9 September: reveal completes at 0.95; give the copy its own
      // quiet reading span. Shift the continuation without changing its pace.
      timeline.addLabel("wonderReady", 3.1);
      timeline.shiftChildren(2, true, 1.03);
      timeline.fromTo(root.querySelector("[data-painting-entrance]"),
        { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "sine.inOut" }, 1.08);
      timeline.fromTo(root.querySelector("[data-painting-place]"),
        { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "sine.inOut" }, 1.62);
      timeline.fromTo(root.querySelector("[data-painting-story]"),
        { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.55, ease: "sine.inOut" }, 2.18);
      return timeline;
    },
  });
  gsap.registerEffect({
    name: "homeHeroOpen",
    defaults: {},
    effect: (targets: HTMLElement[], config: {
      gallery: { x: number; y: number; z: number; yaw: number };
      render: () => void;
    }) => {
      const root = targets[0];
      const timeline = gsap.timeline({ paused: true });
      // 9 September: move the photos to the viewer in one uninterrupted glide.
      timeline.fromTo(root.querySelector("[data-hero-black]"),
        { opacity: 1 }, { opacity: 0, duration: 0.12, ease: "none" }, 0.14,
      );
      timeline.call(() => { root.dataset.heroPhase = "gallery"; }, [], 0.14);
      timeline.fromTo(config.gallery, { x: 24, y: -1, z: -16, yaw: -0.3 }, {
        x: 0, y: 0, z: 0, yaw: 0,
        duration: 3, ease: "power2.out", onUpdate: config.render,
      }, 0.14);
      timeline.call(() => { root.dataset.heroPhase = "type"; }, [], 3.14);
      timeline.fromTo(root.querySelectorAll("[data-hero-word]"),
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "sine.out" }, 3.14,
      );
      timeline.fromTo(root.querySelectorAll("[data-hero-quiet]"),
        { opacity: 0 }, { opacity: 1, duration: 0.45, stagger: 0.12, ease: "power1.out" }, 3.5,
      );
      return timeline;
    },
  });
}
