import { BANNER_CONTENT_TYPE, BANNER_SIZE, renderBanner } from "@/lib/og/banner";
import { legalDocBySlug } from "@/content/legal";

/** Link-preview banner for this route — see src/lib/og/banner.tsx. */
export const alt = legalDocBySlug("cookies").metaTitle;
export const size = BANNER_SIZE;
export const contentType = BANNER_CONTENT_TYPE;

export default function Image() {
  return renderBanner({
    eyebrow: "Legal",
    title: legalDocBySlug("cookies").title,
    ground: "canvas",
    path: "/legal/cookies",
  });
}
