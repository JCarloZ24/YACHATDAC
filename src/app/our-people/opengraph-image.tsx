import { BANNER_CONTENT_TYPE, BANNER_SIZE, renderBanner } from "@/lib/og/banner";
import { ourPeopleHero } from "@/content/our-people";

/** Link-preview banner for this route — see src/lib/og/banner.tsx. */
export const alt = "Our people — YACHATDAC";
export const size = BANNER_SIZE;
export const contentType = BANNER_CONTENT_TYPE;

export default function Image() {
  return renderBanner({
    eyebrow: ourPeopleHero.eyebrow,
    title: ourPeopleHero.title,
    standfirst: ourPeopleHero.standfirst,
    ground: "midnight",
    path: "/our-people",
  });
}
