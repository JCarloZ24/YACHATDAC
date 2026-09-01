import Image from "next/image";
import Link from "next/link";
import { welcomeToCountry } from "@/content/homepage";
import {
  footerNav,
  legalLinks,
  org,
  registration,
  socialLinks,
} from "@/content/site";

/**
 * Site footer. Shared component, every route — built to the hi-fi footer
 * (frame 2137:2623): the double wave hands the page into charcoal, the
 * Acknowledgement sits centred above everything, the artist's gold dot wave
 * divides it from the navigation, and the gold dot trail closes the page over
 * the legal row.
 *
 * Held content, all visibly marked so none of it can ship by accident:
 *   ⚠ R1  — the Acknowledgement / Welcome to Country wording is Suzanne
 *           Thompson's to give. The bracketed hold renders verbatim.
 *   ⚠ R15 — ICN and ABN not yet supplied; bracketed holds plus a warning.
 *   ⚠ Social profile URLs not supplied — the FOLLOW column and the icon row
 *           render as inert placeholders until site.ts carries real hrefs.
 *
 * Labels and links are read from site.ts rather than typed here, so the
 * footer cannot drift from the navigation.
 */

/** Simple social glyphs, 24×24, currentColor. Generic marks, not artwork. */
const SOCIAL_ICONS: Record<string, string> = {
  Facebook:
    "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z",
  Instagram:
    "M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.3.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.4 2.3.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.3-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.3.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.3-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1.1-.4-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.3.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.3-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 3.1a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 1.8a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4Zm5.2-2.9a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z",
  X: "M17.5 3h3.1l-6.8 7.8L21.9 21h-6.3l-4.9-6.4L5.1 21H2l7.3-8.3L2.3 3h6.4l4.4 5.9L17.5 3Zm-1.1 16.1h1.7L7.8 4.8H6l10.4 14.3Z",
  LinkedIn:
    "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9V21H9V9Z",
  YouTube:
    "M23 12s0-3.3-.4-4.9a2.5 2.5 0 0 0-1.8-1.8C19.2 5 12 5 12 5s-7.2 0-8.8.3a2.5 2.5 0 0 0-1.8 1.8C1 8.7 1 12 1 12s0 3.3.4 4.9c.2.9.9 1.6 1.8 1.8C4.8 19 12 19 12 19s7.2 0 8.8-.3a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.9.4-4.9ZM9.8 15.3V8.7L15.9 12l-6.1 3.3Z",
};

function SocialIcon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
      <path d={SOCIAL_ICONS[name]} fill="currentColor" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative text-canvas">
      {/* The double wave — the burnt band riding the charcoal crest, the
          hi-fi's own two paths. preserveAspectRatio=none stretches them to
          the viewport; both paths run past the viewBox bottom so the block's
          lower edge is solid charcoal and hands off into the body below.
          The region above the burnt crest is painted --footer-ground — the
          colour the page's LAST SECTION ends on, declared per page with
          <FooterGround/> and defaulting to the hi-fi's canvas. A fixed fill
          put a stray band on dark-ending pages; overlapping the section
          instead had the wave invading its content. */}
      <div aria-hidden className="pointer-events-none">
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="block h-[13.9vw] w-full"
        >
          <rect
            width="1440"
            height="200"
            style={{ fill: "var(--footer-ground, var(--color-canvas))" }}
          />
          <path
            d="M1468.02 12.8747C1425.52 -3.69956 1375.23 -4.55833 1332.03 10.6133C1268.44 32.9127 1222.44 69.6681 1155.69 83.2653C1111.34 92.3111 1070.39 85.6413 1026.37 82.8073C967.396 79.0001 915.489 83.8092 859.193 100.784C806.362 116.7 755.049 137.425 699.512 145.498C631.931 155.316 563.095 139.343 498.087 120.507C433.08 101.672 368.006 79.5726 299.567 76.6242C194.466 72.1013 94.6777 112.922 0.0042572 152.797L0 1285.81H1466.83L1468.02 12.9034V12.8747Z"
            className="fill-burnt"
          />
          <path
            d="M1468 96.8464C1425.5 86.8918 1375.21 86.376 1332.01 95.4882C1268.43 108.881 1222.43 130.957 1155.67 139.123C1111.32 144.556 1070.37 140.55 1026.35 138.848C967.384 136.561 915.478 139.45 859.183 149.645C806.352 159.204 755.04 171.652 699.504 176.5C631.923 182.397 563.088 172.804 498.081 161.491C433.074 150.178 368.002 136.905 299.563 135.134C194.463 132.418 94.6766 156.935 0.00437922 180.884L0 1294H1466.81L1468 96.8636V96.8464Z"
            className="fill-charcoal"
          />
        </svg>
      </div>

      <div className="relative overflow-hidden bg-charcoal">
        {/* The artist's rings as ground — whole instances, single-digit
            opacity, static — 8% matches the hi-fi's own fill-opacity on
            these shapes (fill=white fill-opacity=0.08 at 100% layer
            opacity). Same rule as §08's charcoal passage. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute top-10 -left-56 h-190 w-190 opacity-[0.08]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/artwork/ring-a.svg" alt="" className="h-full w-full" />
          </div>
          <div className="absolute -top-24 -right-40 h-205 w-205 opacity-[0.08]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/artwork/ring-b.svg" alt="" className="h-full w-full" />
          </div>
          <div className="absolute right-24 bottom-0 h-140 w-140 opacity-[0.08]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/artwork/ring-c.svg" alt="" className="h-full w-full" />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-6 pt-24 pb-10 lg:px-16">
          {/* Acknowledgement — first, centred, above the navigation. Placement
              per open decision 3: footer, text only, no ceremony element. */}
          <div className="text-center">
            <h2 className="eyebrow text-gold">Acknowledgement of Country</h2>
            {welcomeToCountry.status === "awaiting-suzanne" ? (
              <p
                className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-canvas/90"
                data-placeholder="welcome-to-country"
              >
                {welcomeToCountry.placeholder}
              </p>
            ) : null}
          </div>

          {/* The gold dot wave — the artist's divider, whole. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/artwork/dots-wave-gold.svg"
            alt=""
            aria-hidden
            className="mx-auto mt-20 w-full max-w-3xl"
          />

          <div className="mt-24 grid gap-12 md:grid-cols-3 lg:grid-cols-[1.3fr_1fr_1fr_1fr_0.8fr]">
            {/* The stacked lockup — the artist's full mark (motifs, wordmark
                and legal name in one image), exported whole from the hi-fi
                (node 2146:3766) per build documentation §5. White type on
                transparency: dark grounds only. */}
            <div>
              <Image
                src="/brand/logo-stacked.png"
                alt={`${org.name} — ${org.legalName}`}
                width={1990}
                height={2338}
                className="w-56"
              />

              <p className="mt-6 text-lg text-canvas">Registration</p>
              <p className="mt-4 text-base text-canvas/80">
                ICN {registration.icn ?? "[ number ]"}
              </p>
              <p className="mt-3 text-base text-canvas/80">
                ABN {registration.abn ?? "[ number ]"}
              </p>
              {registration.icn === null || registration.abn === null ? (
                <p className="eyebrow mt-6 text-xs text-gold">
                  &#9888; R15 &mdash; registration numbers not yet supplied
                </p>
              ) : null}
            </div>

            {footerNav.map((column) => (
              <div key={column.title}>
                <h2 className="eyebrow text-gold">{column.title}</h2>
                <ul className="mt-8 space-y-6">
                  {column.links.map((link) => (
                    <li key={link.title}>
                      <Link
                        href={link.href}
                        className="text-base text-canvas/90 transition-colors duration-(--dur-small) ease-quiet hover:text-canvas"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* FOLLOW — the hi-fi lists the first two networks by name; the
                rest ride the icon row below. Inert until URLs are supplied. */}
            <div>
              <h2 className="eyebrow text-gold">Follow</h2>
              <ul className="mt-8 space-y-6">
                {socialLinks.slice(0, 2).map((social) => (
                  <li key={social.title}>
                    {social.href ? (
                      <a
                        href={social.href}
                        className="text-base text-canvas/90 transition-colors duration-(--dur-small) ease-quiet hover:text-canvas"
                      >
                        {social.title}
                      </a>
                    ) : (
                      <span className="text-base text-canvas/90">
                        {social.title}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* The gold dot trail closes the page. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/artwork/dots-trail-gold.svg"
            alt=""
            aria-hidden
            className="mt-20 w-full"
          />

          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-x-10 gap-y-3 text-base text-canvas/85">
              <p>
                &copy; {new Date().getFullYear()} {org.name}. All rights
                reserved.
              </p>
              {legalLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="underline underline-offset-4 transition-colors duration-(--dur-small) ease-quiet hover:text-canvas"
                >
                  {link.title}
                </Link>
              ))}
            </div>

            <ul className="flex items-center gap-5 text-turquoise">
              {socialLinks.map((social) => (
                <li key={social.title}>
                  {social.href ? (
                    <a
                      href={social.href}
                      aria-label={social.title}
                      className="transition-colors duration-(--dur-small) ease-quiet hover:text-canvas"
                    >
                      <SocialIcon name={social.title} />
                    </a>
                  ) : (
                    <span title={`${social.title} — profile URL to come`}>
                      <SocialIcon name={social.title} />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
