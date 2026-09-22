import { BANNER_CONTENT_TYPE, BANNER_SIZE, renderBanner } from "@/lib/og/banner";
import { wonderHero } from "@/content/wonder";

/** Link-preview banner for this route — see src/lib/og/banner.tsx. */
export const alt = "Wonder — guesting on-Country with YACHATDAC";
export const size = BANNER_SIZE;
export const contentType = BANNER_CONTENT_TYPE;

export default function Image() {
  return renderBanner({
    eyebrow: "Wonder · Guesting on-Country",
    title: "Guesting on-Country",
    standfirst: wonderHero.standfirst,
    ground: "ochre",
    path: "/wonder",
  });
}
