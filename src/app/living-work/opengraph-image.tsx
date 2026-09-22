import { BANNER_CONTENT_TYPE, BANNER_SIZE, renderBanner } from "@/lib/og/banner";
import { livingWorkHero } from "@/content/living-work";

/** Link-preview banner for this route — see src/lib/og/banner.tsx. */
export const alt = "Living Work — Caring for Country";
export const size = BANNER_SIZE;
export const contentType = BANNER_CONTENT_TYPE;

export default function Image() {
  return renderBanner({
    eyebrow: livingWorkHero.eyebrow,
    title: livingWorkHero.title,
    standfirst: livingWorkHero.standfirst,
    ground: "evergreen",
    path: "/living-work",
  });
}
