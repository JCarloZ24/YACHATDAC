/**
 * Home collage, user screenshot 8 September 2026 (F7/F8, R11, D5).
 * Mid-fidelity selection of supplied photos; origin names the exact library
 * source. WebP derivatives leave masters intact. Credits remain in kit.ts /
 * record-media.ts. F8 permits use; portraits imply no identity or role.
 * Gallery moves held frames around a fixed camera, with fixed UVs (9 September).
 * No fire used as atmosphere.
 */
export type HomeHeroFrame = {
  id: string; src: string; origin: string; grade: "full" | "frame";
  width: number; height: number;
  x: number; y: number; w: number; aspect: number;
  depth: number; angle: number; opacity: number;
};

/** Figma 3371:41740, 9 September 2026. Exact supplied fills; credits and
 * identities unconfirmed. F8 user-authorised; held frame grade. See media README. */
export const homeInvitationMedia = [
  { src: "/media/home/derivatives/sandstone-overhang-group.webp", icon: "/media/home/derivatives/invitation-ring.svg", position: "center top", grade: "frame", node: "3371:41802" },
  { src: "/media/home/derivatives/verandah-table-people.webp", icon: "/media/home/derivatives/invitation-spiral.svg", position: "center", grade: "frame", node: "3371:41842" },
  { src: "/media/home/derivatives/person-beside-smoking-fire.webp", icon: "/media/home/derivatives/invitation-boomerang.svg", position: "24% center", grade: "frame", node: "3371:41865" },
];

/**
 * The closing offer's four photographs — prototype deck slide 23, user
 * direction 9 September 2026. Read as a set around the body copy, two above
 * and two below, none of them touching it.
 *
 * `left` / `top` / `w` are percentages of the panel and `aspect` its ratio,
 * measured off the deck rather than a Figma node — the slide has none. They
 * are composition, not geography. Every plate is `frame` grade: the panel
 * moves them into place and they never scrub, warp or crop under motion, and
 * the portrait is `frame` for the additional reason that portraits always
 * are. Credits and identities unconfirmed; F8 permits the use, and no
 * identity or role is implied by placing a face here.
 */
export type HomeOfferSlot = {
  src: string; origin: string; grade: "frame";
  width: number; height: number;
  left: number; top: number; w: number; aspect: number;
};

export const homeOfferMedia: HomeOfferSlot[] = [
  { src: "/media/home/derivatives/scrub-through-trees.webp", origin: "/media/library/partnerships/pt-breath.webp",
    grade: "frame", width: 480, height: 270, left: 21, top: 5, w: 31.5, aspect: 1.8 },
  { src: "/media/home/derivatives/woodland-track.webp", origin: "/media/library/about/about-road.webp",
    grade: "frame", width: 480, height: 270, left: 68.2, top: 14.3, w: 24, aspect: 1.68 },
  { src: "/media/home/derivatives/sunset-outcrop.webp", origin: "/media/library/record/therecord-hero.webp",
    grade: "frame", width: 480, height: 253, left: 6.5, top: 57, w: 22.5, aspect: 1.48 },
  { src: "/media/home/derivatives/elder-portrait.webp", origin: "/media/library/elder-portrait.webp",
    grade: "frame", width: 520, height: 274, left: 68, top: 59, w: 13.75, aspect: 0.79 },
];

/**
 * The four pathway cards — prototype deck slide 24, user direction 9
 * September 2026. One photograph and one artwork mark per pathway, in the
 * order `wayForward.paths` declares them, so the card and its route cannot
 * drift apart.
 *
 * The marks are the same four the Invitation uses; the deck repeats the
 * boomerang on the last two and so does this. Photographs are `frame` grade
 * and are chosen not to repeat the Invitation's three — the two sets sit on
 * one page and reading the same picture twice makes them look like the same
 * navigation. Credits and identities unconfirmed; F8 permits the use.
 *
 * ⚠ The deck's first card is a night fire in grass and there is no such
 * derivative — `escarpment-walk` stands in, which changes what the card shows
 * (people arriving on Country rather than fire at night) while keeping what
 * it says. Flag at review if the fire is the point.
 */
export const homePathwayMedia = [
  { src: "/media/home/derivatives/escarpment-walk.webp", origin: "/media/library/escarpment-approach.webp",
    icon: "/media/home/derivatives/invitation-ring.svg", grade: "frame", position: "center" },
  { src: "/media/home/derivatives/emu-woodland.webp", origin: "/media/library/living-work/livingwork-spring.webp",
    icon: "/media/home/derivatives/invitation-spiral.svg", grade: "frame", position: "center" },
  { src: "/media/home/derivatives/mortar-at-ute.webp", origin: "/media/library/living-work/livingwork-work7.webp",
    icon: "/media/home/derivatives/invitation-boomerang.svg", grade: "frame", position: "center" },
  { src: "/media/home/derivatives/hand-at-rock.webp", origin: "/media/library/engravings-hand.webp",
    icon: "/media/home/derivatives/invitation-boomerang.svg", grade: "frame", position: "center" },
];

// Positions and widths are percentages of the collage stage, not geographic data.
// 9 September: lift three lower plates into the open area above the headline.
const slots: [string, string, number, number, number, number, number, number, number, number, number][] = [
  ["country-sunset-grass", "country-sunset-grass", 1000, 527, 49, 16, 30, 1.82, -0.4, -1, 0.78],
  ["seed-in-mortar", "living-work/livingwork-work3", 480, 253, 27, 16, 14, 1.75, -1.5, 2, 0.48],
  ["open-country", "country-wide", 480, 253, 71, 18, 15, 1.7, -1, -1, 0.7],
  ["elder-grinding", "record/therecord-keepingtherecord", 720, 380, 17, 42, 24, 1.85, 1, -2, 0.73],
  ["seed-in-hand", "work-seed", 650, 343, 31, 58, 13, 0.57, 0.4, 2, 0.68],
  ["sandstone-overhang", "record/therecord-story4", 720, 480, 50, 58, 22, 1.45, -1.8, 0, 0.57],
  ["woodland-sunset", "about/about-breath", 720, 379, 81, 43, 26, 1.85, 0.9, 2, 0.66],
  ["hand-at-rock", "engravings-hand", 520, 274, 72, 66, 13, 1.2, -0.2, -3, 0.65],
  ["reading-plant", "work-botanical", 520, 274, 85, 88, 23, 1.3, 1.5, -2, 0.52],
  ["elder-portrait", "elder-portrait", 520, 274, 36, 34, 17, 1.4, 0.8, 2, 0.63],
  ["nursery-silhouette", "living-work/livingwork-rangers3", 520, 274, 16, 92, 21, 1.4, -0.5, -2, 0.47],
  ["woodland-track", "about/about-road", 480, 270, 9, 60, 13, 1.8, -2.2, 2, 0.5],
  ["seedlings", "living-work/livingwork-rangers4", 480, 253, 8, 16, 20, 1.65, 2.4, -4, 0.6],
  ["seed-collecting", "living-work/livingwork-work2", 480, 253, 94, 15, 18, 1.45, 2.2, 3, 0.62],
  ["mortar-at-ute", "living-work/livingwork-work7", 480, 253, 17, 73, 13, 1.7, -2.8, -3, 0.53],
  ["emu-woodland", "living-work/livingwork-spring", 480, 253, 64, 35, 18, 1.7, -1.5, 2, 0.56],
  ["grass-at-sunset", "living-work/livingwork-getinvolved", 480, 253, 49, 40, 10, 1.8, -3, -2, 0.54],
  ["regrowth-tree", "living-work/livingwork-work5", 480, 253, 84, 27, 11, 1.8, -2.7, 3, 0.5],
  ["ochre-grinding", "about/about-ochre", 480, 320, 2, 85, 17, 1.3, 2, -4, 0.62],
  ["hands-with-ochre", "about/about-reciprocity", 480, 320, 99, 62, 16, 1.2, 2.5, 4, 0.6],
  ["escarpment-ledge", "about/about-hero", 480, 320, 67, 5, 13, 1.5, -2.4, -3, 0.53],
  ["scrub-through-trees", "partnerships/pt-breath", 480, 270, 26, 6, 14, 1.8, -2, 4, 0.52],
  ["sunset-outcrop", "record/therecord-hero", 480, 253, 70, 95, 12, 1.9, -3.4, -2, 0.5],
  ["escarpment-walk", "escarpment-approach", 480, 253, 95, 94, 17, 1.7, 2.4, 4, 0.56],
];

const primaryFrames: HomeHeroFrame[] = slots.map(
  ([id, source, width, height, x, y, w, aspect, depth, angle, opacity]) => ({
    id, src: `/media/home/derivatives/${id}.webp`,
    origin: `/media/library/${source}.webp`,
    // All plates take the conservative frame treatment, including open Country.
    grade: "frame", width, height, x, y, w, aspect, depth, angle, opacity,
  }),
);

/** ⚠ NOT RENDERED on `/` since 10 September 2026 (user direction): the hero
 * opens on the road and holds there, so the perspective gallery these frames
 * describe is gone from the homepage — with it, twenty-six above-the-fold
 * WebP requests. The collage still runs at /homepagev2, from that route's own
 * copy of this module. Kept because these are photo slots with sources and
 * grades recorded, not layout.
 *
 * 9 September: wing and distant gallery instances, no additional downloads.
 * Each instance retains its source and grade; the larger nearby photos frame
 * these smaller plates like the user's perspective-gallery reference. */
export const homeHeroFrames: HomeHeroFrame[] = [
  ...primaryFrames,
  ...primaryFrames.slice(12).map((frame, index) => ({
    ...frame, id: `${frame.id}-distant`,
    x: [-12, 112, -20, 120, -8, 108, 61, 40, 55, 47, 66, 33][index],
    y: [24, 18, 53, 60, 83, 90, 75, 91, 5, 98, 58, 78][index],
    w: index < 6 ? 15 + index % 3 : 7 + index % 4,
    depth: index < 6 ? -2 - index * 0.2 : -5 - index * 0.25,
    angle: index % 2 ? 4 : -4, opacity: 0.42,
  })),
];
