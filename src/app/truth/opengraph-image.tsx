import { BANNER_CONTENT_TYPE, BANNER_SIZE, renderBanner } from "@/lib/og/banner";
import { truthHero } from "@/content/truth";

/** Link-preview banner for this route — see src/lib/og/banner.tsx. */
export const alt = `Truth — ${truthHero.standfirst}`;
export const size = BANNER_SIZE;
export const contentType = BANNER_CONTENT_TYPE;

export default function Image() {
  return renderBanner({
    eyebrow: "Truth",
    title: "Truth",
    standfirst: truthHero.standfirst,
    ground: "canvas",
    path: "/truth",
  });
}
