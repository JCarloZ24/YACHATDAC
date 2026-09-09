import Image from "next/image";
import { wayForward } from "../_content/homepage";

/**
 * /homepagev2 copy, 10 September 2026, user direction.
 *
 * A duplicate of the live homepage component of the same name, so the two
 * can be worked on apart. What is COPIED is the markup; what is SHARED is
 * everything the markup reaches for -- the content modules, the stylesheets,
 * the motion library and the effects registry. A change to a hook name, an
 * effect, a CSS class or a content string still lands on both pages, and an
 * edit here that renames a data attribute breaks the live page silently
 * unless the effect is forked too. Diverge deliberately, and say so here
 * when you do.
 */

/**
 * The Way Forward — the last section, as a held statement.
 *
 * 9 September 2026, user direction: the prototype deck's slide 20 replaces the
 * previous section outright. That one was a working panel — eyebrow, body,
 * four pathways and the signup on evergreen; this one is the line alone on a
 * near-black ground, with the dotted spirals turned up faint behind it. The
 * page ends on a sentence rather than on a set of doors.
 *
 * ⚠ WHAT LEFT WITH THE OLD SECTION, so nobody has to rediscover it:
 *   · the four pathways (/wonder, /partnerships, /connect, /the-record). Three
 *     are reachable from the primary nav; `/partnerships` is NOT, so it now
 *     has no homepage entry point at all.
 *   · the newsletter signup. `SiteFooter` has none, so the site currently has
 *     no email capture on the homepage.
 *   · the organisation's tagline, which Wonder, Living Work and About still
 *     carry, so it is not lost from the site.
 * `WayForward.tsx` is left in place, unreferenced, so any of that can come
 * back without being rebuilt. Removing it is an IA change and wants a
 * D-number if it stands.
 *
 * ⚠ 9 September 2026, later the same day, user direction: like The
 * Invitation before it, this is no longer a section of its own. It is the
 * last panel on the pinned hero canvas — it arrives by travelling up one
 * viewport as The Invitation leaves, over a canvas the lift has by then
 * carried the land clean off, which is why the panel's own ground can be
 * nothing at all. `Reveal` went with the move: the dissolve timeline owns the
 * entrance now, and a scroll-triggered reveal inside a pinned section fires
 * against a viewport that is not moving.
 *
 * D5: the headline is `wayForward.headline`, unchanged and still the draft's.
 * The eyebrow and body stay in the content module unrendered, as the pathways
 * and tagline did through v2 — content is not deleted to match a layout.
 */
export function WayForwardStatement() {
  return (
    <div
      id="way-forward"
      data-home-way-forward
      /* Fills the pinned canvas rather than the document: the page ends on
         this line and nothing shares the view with it. */
      className="v2-home-way-forward absolute inset-0 z-[3] flex items-center overflow-hidden"
    >
      {/* The flattened footer spirals (kit `ring-b` / `ring-a`, nodes
          2051:4024 and 2051:4022). They were at the 0.06 wash used elsewhere
          on the site; raised to 0.16 on user direction, 9 September 2026 —
          then to 0.28 on a second pass. On the near-black canvas the site's
          wash read as screen dirt rather than as pattern. It is still a
          ground, not a mark — the line has to win — so this is the number to
          bring back down if the spirals start competing with the sentence.
          Both run off the edge as they do in the frame, so the panel is
          clipped rather than fitting them in. Sized in vw so they scale with
          the panel instead of pinning to a 1440 assumption.

          The wrapper exists for the motion: the closing beat brings the
          pattern up from off screen to rest under the held line, and GSAP
          writes `transform`, which
          would otherwise overwrite the centring and offset transforms these
          two carry as classes. Animate the wrapper, never the images. */}
      <div data-way-forward-ground aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Image
          src="/artwork/ring-b.svg"
          alt=""
          width={465}
          height={470}
          sizes="60vw"
          className="absolute -right-[18vw] top-1/2 w-[60vw] max-w-none -translate-y-1/2 opacity-[0.28]"
        />
        <Image
          src="/artwork/ring-a.svg"
          alt=""
          width={416}
          height={375}
          sizes="34vw"
          className="absolute -bottom-[10vw] -left-[8vw] w-[34vw] max-w-none opacity-[0.28]"
        />
      </div>
      <div className="relative mx-auto w-full max-w-[1440px] px-6 lg:px-16">
        <h2 data-way-forward-line className="headline mx-auto max-w-[16ch] text-center text-h1 leading-[1.1] tracking-normal text-canvas">
          {wayForward.headline}
        </h2>
      </div>
    </div>
  );
}
