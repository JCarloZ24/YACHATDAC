import { BANNER_CONTENT_TYPE, BANNER_SIZE, renderBanner } from "@/lib/og/banner";
import { aboutHero } from "@/content/about";

/** Link-preview banner for this route — see src/lib/og/banner.tsx. */
export const alt = "About YACHATDAC";
export const size = BANNER_SIZE;
export const contentType = BANNER_CONTENT_TYPE;

export default function Image() {
  return renderBanner({
    eyebrow: aboutHero.eyebrow,
    title: aboutHero.title,
    standfirst: aboutHero.standfirst,
    ground: "charcoal",
    path: "/about",
  });
}
