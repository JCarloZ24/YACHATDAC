import { BANNER_CONTENT_TYPE, BANNER_SIZE, renderBanner } from "@/lib/og/banner";

/** Link-preview banner for this route — see src/lib/og/banner.tsx. */
export const alt = "Partnerships — research on Turraburra";
export const size = BANNER_SIZE;
export const contentType = BANNER_CONTENT_TYPE;

export default function Image() {
  return renderBanner({
    eyebrow: "Partnerships",
    title: "Research and partnership opportunities on Turraburra",
    standfirst: "A researcher On-Country is a guest On-Country.",
    ground: "roasted",
    path: "/partnerships",
  });
}
