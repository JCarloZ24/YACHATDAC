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
 * The four scene states this page reads, measured from the Figma frames on
 * user direction, 10 September 2026. Every one of them is the same
 * composition — the sky sequence behind the photograph, the frame's own black
 * over both, the light sequence soft-lit through the land's alpha — so the
 * time of day is nothing but WHERE the frame sits in the two sequences and
 * how much black it carries.
 *
 *   night   3371:41344  the page opens here, before a word is on screen
 *   welcome 3371:41275  where the intro lightens to, under the welcome
 *   wonder  3371:41413  the first thing the scroll moves to
 *   truth   3371:44759  then the seven dated frames in home-truth-scenes.ts
 *
 * `sky` and `light` are pixels down each layer (Figma places both against the
 * 1500-row scene, one image row to one layer row). `lightHeight` is the
 * height that layer is placed AT, which is not the same in every frame, so it
 * travels with the offset. `shade` is the frame's full-scene black.
 *
 * These are measurements, not taste: change one only by re-reading its node.
 * Taste lives in the timing below. Solar amendment, 13 September 2026:
 * "Country carries the day" derives the sun/atmosphere from this same sky
 * clock in home-sun.ts; these offsets now also drive generated lighting.
 * "The stars emerge as daylight leaves", 13 September 2026: stellar
 * visibility follows the resulting local sky light, not a panel entrance
 * or a whole-field fade based on the sun's elevation.
 */
export const HOME_SCENE = {
  night: { sky: 0, light: 0, lightHeight: 8028, shade: 0.4 },
  welcome: { sky: 316, light: 263, lightHeight: 8028, shade: 0.4 },
  wonder: { sky: 600, light: 510, lightHeight: 7619, shade: 0.2 },
  truth: { sky: 1422, light: 464, lightHeight: 7619, shade: 0.25 },
} as const;

/**
 * How far the land scene travels up the screen across The Invitation beat, in
 * screen heights. Land across the top, charcoal below it for the cards to be
 * read against (latest reference, 9 September 2026). Raised 0.55 → 0.62 on
 * user direction the same day — the band the land finished on was reading as
 * too much of the canvas. Nothing bounds this but taste: the travel is in
 * screen space, so a larger number simply takes more of the land off the top,
 * and the soft edge (liftEdge in home-land.ts) follows it up.
 *
 * ⚠ Reversed twice on user direction the same day. It began as a drift DOWN
 * of the sampling window — parallax, ground further away than the cards —
 * which fought the illusion the panel move was made for: a page's background
 * does not travel against its own scroll. It then briefly rose by moving that
 * same window, which a bottom-anchored crop has almost no room for. This
 * moves the whole scene in SCREEN space instead, so the travel is not bounded
 * by the texture at all and the edge that rises into view is the
 * photograph's own dissolve. The uniform is `lift`; see home-land.ts.
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

/** Grammar: "the page opens on Country", Home hero, 10 September 2026.
 * Scene first, type second (F7). Semantic word wrappers remain CMS-safe.
 *
 * ⚠ These effects are the homepage's, and the homepage alone. /homepagev2 is
 * an independent fork with its own registry (homeV2*): nothing here reaches
 * it, which is why the opening it still runs -- the photo collage, the
 * painting reveal, the portal zoom -- could be taken out of these three
 * timelines without touching that route.
 */
export function registerHome(): void {
  // AMB-05 / "the stars emerge as daylight leaves": one seamless phase for
  // breeze and restrained stellar scintillation; the owner controls cleanup.
  // "Clouds carry the passing hours", 13 September 2026: the renderer also
  // reads this timeline's totalTime for continuous cloud travel. Keep the
  // wrapping phase for foliage/twinkle, never for the cloud translation.
  gsap.registerEffect({
    name: "homeLandscapeBreeze",
    defaults: {},
    effect: (_targets: HTMLElement[], config: { phase: { value: number }; render: () => void }) =>
      gsap.timeline({ paused: true, repeat: -1 }).fromTo(config.phase,
        { value: 0 }, { value: Math.PI * 2, duration: 24, ease: "none", onUpdate: config.render }),
  });
  // Grammar: a change of ground / Home hero dissolve, 9 September 2026,
  // rewritten at the front 10 September 2026: the ground no longer changes at
  // the opening, it is simply uncovered.
  gsap.registerEffect({
    name: "homeHeroDissolve",
    defaults: {},
    effect: (targets: HTMLElement[], config: { state: { sky: number; light: number; lightHeight: number; shade: number; belonging: number; landscapeLift: number; landscapeZoom: number }; render: () => void }) => {
      const root = targets[0];
      const timeline = gsap.timeline({ paused: true });
      // The hero holds on the land (10 September 2026, user direction). What
      // used to happen across the first three units -- the photo collage
      // dissolving, the ground warming from charcoal to oxide, the supplied
      // painting drawing itself outward from its rosette, speaking its three
      // lines, and finally opening on the road -- is gone. The scene is
      // already up, so the first thing the scroll does is take the welcome
      // off it. The whole of that opening is kept, running, at /homepagev2.
      timeline.fromTo(root.querySelectorAll("[data-hero-copy]"),
        { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.5, ease: "sine.in" }, 0);
      // Nothing darkens the land here any more. The frame's own black is in
      // the canvas (HOME_SCENE.shade), so the DOM scrims would be a second
      // one laid over it; they are gated to the no-canvas fallback in
      // home-hero.css and this timeline no longer touches them.
      // Everything below is timed from this one constant, so the beat can be
      // moved without retiming the sequence after it.
      const wonderAt = 0.8;
      // The scene goes on through the day with the beat. Wonder's frame sits
      // 600 rows further into the sky than the welcome's and carries half its
      // black, so the light lifts as the copy rises rather than after it.
      timeline.fromTo(config.state,
        { sky: HOME_SCENE.welcome.sky, light: HOME_SCENE.welcome.light,
          lightHeight: HOME_SCENE.welcome.lightHeight, shade: HOME_SCENE.welcome.shade },
        { sky: HOME_SCENE.wonder.sky, light: HOME_SCENE.wonder.light,
          lightHeight: HOME_SCENE.wonder.lightHeight, shade: HOME_SCENE.wonder.shade,
          duration: 0.8, ease: "none", onUpdate: config.render }, wonderAt);
      timeline.fromTo(root.querySelector("[data-home-wonder]"),
        { y: () => root.clientHeight, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: "none" }, wonderAt);
      // SCR-09: where the scroll cue jumps to. home-hero.ts reads the label,
      // so the cue and the beat cannot drift apart.
      timeline.addLabel("wonderReady", wonderAt + 0.8);
      timeline.to({}, { duration: 0.3 }, wonderAt + 0.8);
      timeline.to(root.querySelector("[data-home-wonder]"),
        { y: () => -root.clientHeight, autoAlpha: 0, duration: 0.65, ease: "none" }, wonderAt + 1.1);
      // Truth is not a different picture, it is a later hour: the same two
      // layers travel on to 3371:44759 and the black closes a little.
      timeline.to(config.state,
        { sky: HOME_SCENE.truth.sky, light: HOME_SCENE.truth.light, shade: HOME_SCENE.truth.shade,
          duration: 0.8, ease: "none", onUpdate: config.render }, wonderAt + 1.1);
      timeline.fromTo(root.querySelector("[data-home-truth]"),
        { y: () => root.clientHeight * 0.35, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, ease: "none" }, wonderAt + 1.3);
      timeline.to({}, { duration: 0.4 }, wonderAt + 1.9);
      // SCR-10: measured Figma layer offsets; still prose between transitions.
      const marker = root.querySelector("[data-truth-marker]");
      const markerY = (y: number) => root.clientWidth < 1024
        ? (730 / 901 + (y - 730) * root.clientWidth / 1440 / root.clientHeight) * 100
        : y / 9.01;
      timeline.set(marker, { xPercent: homeTruthScenes[0].x / 14.4, yPercent: () => markerY(homeTruthScenes[0].y) }, 0);
      // SCR-10 / "Country carries the years", user direction 13 September
      // 2026: orient the reader during Truth's introduction, with a quiet
      // fade in place alongside the heading rather than a later arrival.
      timeline.fromTo(root.querySelector("[data-truth-timeline]"),
        { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: "sine.inOut" }, wonderAt + 1.3);
      // SCR-10, 13 September 2026: only the line introduces the chronology;
      // the marker and its date wait until after the opening hold.
      timeline.fromTo(marker,
        { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "sine.inOut" }, wonderAt + 2.3);
      homeTruthScenes.forEach((scene, index) => {
        const at = wonderAt + 2.3 + index;
        timeline.to(config.state, { sky: scene.sky, light: scene.light,
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
      timeline.to(config.state, { sky: 5822, light: 5822, belonging: 1,
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
      // Frame grade: the plates are REVEALED, not moved (10 September 2026,
      // user direction — the same opening Living Work uses on its §02 spring
      // photograph). M2 `frameOpen` with edge "left" unrolls the clip from
      // the left edge, and `scale: 1` is the frame-grade pin recipes.ts sets
      // for the same reason: the window travels, the picture inside it never
      // does. This replaces a rise-and-fade, which moved the plane.
      //
      // Ordered by where each plate actually SITS rather than by DOM order.
      // homeOfferMedia lists them at 21%, 68.2%, 6.5% and 68%, so a plain
      // stagger crossed the panel left, right, left, right. Read off the
      // inline style, not layout: the plates are `display:none` below lg and
      // would every one of them measure offsetLeft 0.
      const offerPlates = Array.from(root.querySelectorAll<HTMLElement>("[data-offer-plate]"))
        .sort((a, b) => parseFloat(a.style.left) - parseFloat(b.style.left));
      // Closed at the TOP of the timeline, not left to the effect's own
      // from-state. `frameOpen` builds a NESTED timeline, and a nested fromTo
      // positioned forty-odd units into a `paused: true` parent cannot be
      // relied on to have rendered its from-state before the playhead gets
      // there. Without this set the plates sit fully open through the
      // statement beat and the wipe has nothing left to reveal — which is
      // exactly how it looked. The old rise-and-fade never showed this up
      // because it was a direct child of the parent and its autoAlpha: 0
      // immediate-rendered. Zero duration, so it reverses on scrub.
      timeline.set(offerPlates, { clipPath: "inset(0% 100% 0% 0%)" }, 0);
      offerPlates.forEach((plate, index) => {
        timeline.frameOpen(plate, { edge: "left", scale: 1, duration: 0.9 },
          offerAt + 1.4 + index * 0.18);
      });
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
      return timeline;
    },
  });
  // Grammar: the page opens on Country, 10 September 2026 (supersedes the
  // photo-collage row). Nothing arrives and nothing travels. home-hero.ts has
  // waited for the photograph to decode, so the black beat lifts off a
  // finished scene -- and that scene is night (3371:41344). It is held for a
  // beat on its own, then the light comes up into the welcome frame
  // (3371:41275) as the words arrive. The two sequence layers travel
  // together, so the sky lightens and the land lights with it: this is the
  // one place on the page where the scene changes without the reader asking.
  // The gallery glide it replaces runs unchanged at /homepagev2.
  gsap.registerEffect({
    name: "homeHeroOpen",
    defaults: {},
    effect: (targets: HTMLElement[], config: { state: { sky: number; light: number }; render: () => void }) => {
      const root = targets[0];
      const timeline = gsap.timeline({ paused: true });
      timeline.fromTo(root.querySelector("[data-hero-black]"),
        { opacity: 1 }, { opacity: 0, duration: 1.1, ease: "sine.inOut" }, 0.14,
      );
      // Anything but "black" restores the header and the thread line.
      timeline.call(() => { root.dataset.heroPhase = "scene"; }, [], 0.14);
      // Night is SET at the top of the intro rather than being a fromTo's
      // start value: the scrubbed timeline owns the same state object and
      // parks it on the welcome frame the moment it is built, so a start
      // value that is only applied when its own tween begins would leave the
      // first second and a half of the page sitting on the wrong hour and
      // then snap back. A set renders when the playhead reaches it, which is
      // what the black beat is covering.
      timeline.set(config.state,
        { sky: HOME_SCENE.night.sky, light: HOME_SCENE.night.light, onComplete: config.render }, 0);
      timeline.to(config.state,
        { sky: HOME_SCENE.welcome.sky, light: HOME_SCENE.welcome.light,
          duration: 2.4, ease: "sine.inOut", onUpdate: config.render }, 1.3,
      );
      // Type second (F7), and quiet: one fade for the whole headline, no
      // stagger and no movement. The photograph is the loud channel.
      timeline.fromTo(root.querySelectorAll("[data-hero-word]"),
        { opacity: 0 },
        { opacity: 1, duration: 0.9, ease: "sine.out" }, 1.7,
      );
      timeline.fromTo(root.querySelectorAll("[data-hero-quiet]"),
        { opacity: 0 }, { opacity: 1, duration: 0.45, stagger: 0.12, ease: "power1.out" }, 2.15,
      );
      return timeline;
    },
  });
}
