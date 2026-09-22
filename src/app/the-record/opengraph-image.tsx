import { BANNER_CONTENT_TYPE, BANNER_SIZE, renderBanner } from "@/lib/og/banner";
import { recordHero } from "@/content/the-record";

/** Link-preview banner for this route — see src/lib/og/banner.tsx. */
export const alt = `The Record — ${recordHero.title}`;
export const size = BANNER_SIZE;
export const contentType = BANNER_CONTENT_TYPE;

export default function Image() {
  return renderBanner({
    eyebrow: recordHero.eyebrow,
    title: recordHero.title,
    standfirst: recordHero.standfirst,
    ground: "charcoal",
    path: "/the-record",
  });
}
