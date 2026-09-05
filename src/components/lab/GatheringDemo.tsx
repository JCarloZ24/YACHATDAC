"use client";

import { useEffect } from "react";
import { photoById } from "@/content/kit";
import { register, start, stop, watchVisibility } from "@/lib/motion-controller";
import { gathering } from "@/lib/motion/recipes";

/**
 * THE GATHERING — `06 · Our People` §03, prototyped before it is drawn.
 *
 * WHY THIS EXISTS
 * ---------------
 * `escape` and `mosaic` had zero consumers anywhere in the repo and
 * `scatterResolve` had one, so two of the three effects carrying this section
 * had never been executed in a browser. Drawing eight static frames of a
 * behaviour nobody has watched run is the wrong order — a transition strip is a
 * drawing of a thing, and a drawing cannot tell you the thing works.
 *
 * So the choreography is proved here first and the Figma frames are drawn from
 * what actually happened.
 *
 * WHAT IT IS
 * ----------
 * Six cards. ONE of them has a name. The other five carry a real role, a real
 * photograph, and a gold rule where a name would be — because the site's rule
 * is that identification travels with consent, and consent has not been asked
 * for. We may well hold a photograph of a ranger and still have no right to
 * name them; the card is built to say exactly that and nothing more.
 *
 * The held cards arrive in the same breath as the named one and then hold
 * still while it resolves. That difference is the whole design.
 *
 * ⚠ NOT A SKELETON. Nothing here pulses, shimmers or breathes. A loading
 * skeleton says "this is arriving"; these names are not arriving until somebody
 * is asked. If a later polish pass adds a shimmer it has changed what the page
 * claims.
 *
 * ⚠ EVERY PHOTOGRAPH IS A STAND-IN and says so on the card, not just in a
 * comment. The library holds no portraits of these people; batch 1 is an
 * elder/knowledge shoot and ART-DIRECTION §7 is explicit that a portrait from
 * it captioned under a role asserts that person holds that role. The visible
 * badge is what stops a screenshot of this prototype becoming that claim.
 *
 * ⚠ Roles are real and come from `src/content/our-people.ts`. Names are absent
 * as `null`, never as the string "[ Name ]".
 */

/** The set, in grid order. Roles verbatim from `our-people.ts`. */
const CARDS: Array<{
  name: string | null;
  role: string;
  /** Marked where the role itself is unconfirmed in the draft. */
  roleUnconfirmed?: boolean;
  photo: string;
  /** What the stand-in must be replaced by. Rendered, not just recorded. */
  brief: string;
  /** The one that escapes. A held card, by design. */
  escapes?: boolean;
}> = [
  {
    name: "Graham Ambridge",
    role: "Role to confirm",
    roleUnconfirmed: true,
    photo: "work-botanical",
    brief: "Graham Ambridge",
  },
  {
    name: null,
    role: "Iningai Ranger",
    photo: "work-seed",
    brief: "the first Ranger, named and consented",
    escapes: true,
  },
  { name: null, role: "Iningai Ranger", photo: "escarpment-approach", brief: "the second Ranger" },
  { name: null, role: "Operations", photo: "country-wide", brief: "whoever holds operations" },
  { name: null, role: "Cultural heritage", photo: "engravings-hand", brief: "whoever holds cultural heritage" },
  { name: null, role: "Guesting and visitors", photo: "country-sunset-grass", brief: "whoever holds guesting" },
];

function Card({ card }: { card: (typeof CARDS)[number] }) {
  const photo = photoById(card.photo);
  const held = card.name === null;

  return (
    <article
      data-card
      {...(card.escapes ? { "data-escape": true } : {})}
      className="relative flex w-full flex-col overflow-hidden rounded-sm bg-charcoal/[0.03] ring-1 ring-charcoal/12"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-charcoal/8">
        {photo ? (
          <div data-card-media className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src}
              alt=""
              width={photo.width}
              height={photo.height}
              /* The frame opens and reveals more of the picture; the picture
                 itself never magnifies. `holdPlane` counter-scales this node. */
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}

        {/* The marker is on the card, not in a layer name. A screenshot
            circulated without it is exactly how a stand-in becomes a claim. */}
        <p className="absolute top-3 left-3 z-10 max-w-[85%] bg-oxide px-2 py-1 text-[10px] leading-tight font-semibold tracking-wide text-canvas uppercase">
          ⟡ Stand-in — not this person
          <span className="mt-0.5 block font-normal normal-case opacity-90">
            replace with: {card.brief}
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-2 p-5">
        {held ? (
          /* The name is a RULE, never a word, and never "[ Name ]". It sits on
             the baseline the name would have used, at the width a name would
             have taken, so the card reads as a place set rather than a card
             that failed to load. */
          <div
            aria-label="Name to be confirmed"
            className="h-[3px] w-[168px] bg-gold"
          />
        ) : (
          <h3 data-name className="headline text-xl leading-tight text-charcoal">
            {card.name}
          </h3>
        )}

        <p className="eyebrow text-[11px] text-burnt">
          {card.role}
          {card.roleUnconfirmed ? " *" : ""}
        </p>

        {card.name === "Graham Ambridge" ? (
          <p data-bio className="mt-1 text-xs leading-relaxed text-charcoal/70">
            Graham came out from England as a boy and describes himself as an
            inside-outsider.
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function GatheringDemo() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-op='gathering']");
    if (!root) return;
    const unregister = register(gathering(root, 330));
    start();
    const unwatch = watchVisibility();
    return () => {
      unwatch();
      unregister();
      stop();
    };
  }, []);

  return (
    <section
      data-op="gathering"
      className="relative min-h-screen overflow-hidden bg-canvas px-6 py-24 lg:px-16"
    >
      <p className="eyebrow text-ochre">The team</p>
      <h2 className="headline mt-3 max-w-2xl text-4xl text-charcoal lg:text-5xl">
        The team
      </h2>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-charcoal/70">
        Placeholder roles below. Names, titles and photographs to be confirmed.
      </p>

      <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-3 lg:gap-8">
        {CARDS.map((c) => (
          <Card key={c.role + (c.name ?? "")} card={c} />
        ))}
      </div>

      <p className="mt-10 max-w-2xl border-l-2 border-oxide pl-4 text-xs leading-relaxed text-oxide">
        ⚠ Ranger names, and consent to be named and photographed. Rangers are the
        heart of Living Work and are currently unnamed across the site.
      </p>

      {/* Where the escaping card flies to. Fixed, so it is the whole screen
          rather than the whole section — the card leaves the page, not the
          grid. The real cell stays in place at opacity 0, so nothing reflows
          behind it and the card comes back to exactly where it was. */}
      <div
        data-stage
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40"
      />
    </section>
  );
}
