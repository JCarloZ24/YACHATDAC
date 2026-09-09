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

/** The hi-fi's social glyphs (the 21 frame's 168×24 icon row), each cell
 *  translated back to its own 24×24 box; fill is currentColor. */
const SOCIAL_ICONS: Record<
  string,
  { d: string; dx: number; evenOdd: boolean }
> = {
  Facebook: {
    dx: 0,
    evenOdd: false,
    d: "M22 12.3033C22 6.7467 17.5229 2.24219 12 2.24219C6.47715 2.24219 2 6.7467 2 12.3033C2 17.325 5.65684 21.4874 10.4375 22.2422V15.2116H7.89844V12.3033H10.4375V10.0867C10.4375 7.56515 11.9305 6.17231 14.2146 6.17231C15.3088 6.17231 16.4531 6.36882 16.4531 6.36882V8.8448H15.1922C13.95 8.8448 13.5625 9.62041 13.5625 10.4161V12.3033H16.3359L15.8926 15.2116H13.5625V22.2422C18.3432 21.4874 22 17.3252 22 12.3033Z",
  },
  Instagram: {
    dx: 36,
    evenOdd: true,
    d: "M52 3.24219H44C41.2386 3.24219 39 5.48077 39 8.24219V16.2422C39 19.0036 41.2386 21.2422 44 21.2422H52C54.7614 21.2422 57 19.0036 57 16.2422V8.24219C57 5.48077 54.7614 3.24219 52 3.24219ZM55.25 16.2422C55.2445 18.0348 53.7926 19.4867 52 19.4922H44C42.2074 19.4867 40.7555 18.0348 40.75 16.2422V8.24219C40.7555 6.44954 42.2074 4.99768 44 4.99219H52C53.7926 4.99768 55.2445 6.44954 55.25 8.24219V16.2422ZM52.75 8.49219C53.3023 8.49219 53.75 8.04447 53.75 7.49219C53.75 6.93991 53.3023 6.49219 52.75 6.49219C52.1977 6.49219 51.75 6.93991 51.75 7.49219C51.75 8.04447 52.1977 8.49219 52.75 8.49219ZM48 7.74219C45.5147 7.74219 43.5 9.75691 43.5 12.2422C43.5 14.7275 45.5147 16.7422 48 16.7422C50.4853 16.7422 52.5 14.7275 52.5 12.2422C52.5027 11.0479 52.0294 9.90176 51.1849 9.05727C50.3404 8.21278 49.1943 7.73953 48 7.74219ZM45.25 12.2422C45.25 13.761 46.4812 14.9922 48 14.9922C49.5188 14.9922 50.75 13.761 50.75 12.2422C50.75 10.7234 49.5188 9.49219 48 9.49219C46.4812 9.49219 45.25 10.7234 45.25 12.2422Z",
  },
  X: {
    dx: 72,
    evenOdd: false,
    d: "M89.1761 4.24219H91.9362L85.9061 11.0196L93 20.2422H87.4456L83.0951 14.6488L78.1172 20.2422H75.3554L81.8052 12.993L75 4.24219H80.6954L84.6279 9.35481L89.1761 4.24219ZM88.2073 18.6176H89.7368L79.8644 5.78147H78.2232L88.2073 18.6176Z",
  },
  LinkedIn: {
    dx: 108,
    evenOdd: true,
    d: "M112.5 3.24219C111.672 3.24219 111 3.91376 111 4.74219V19.7422C111 20.5706 111.672 21.2422 112.5 21.2422H127.5C128.328 21.2422 129 20.5706 129 19.7422V4.74219C129 3.91376 128.328 3.24219 127.5 3.24219H112.5ZM116.521 7.24491C116.526 8.20116 115.811 8.79038 114.961 8.78616C114.161 8.78194 113.464 8.14491 113.468 7.24632C113.472 6.40116 114.14 5.72194 115.008 5.74163C115.888 5.76132 116.526 6.40679 116.521 7.24491ZM120.28 10.0039H117.76H117.758V18.5638H120.422V18.3641C120.422 17.9842 120.421 17.6042 120.421 17.2241C120.42 16.2103 120.419 15.1954 120.425 14.1819C120.426 13.9358 120.437 13.6799 120.5 13.445C120.738 12.5675 121.527 12.0008 122.407 12.1401C122.973 12.2286 123.347 12.5563 123.504 13.0893C123.601 13.4225 123.645 13.7811 123.649 14.1285C123.661 15.1761 123.659 16.2237 123.657 17.2714C123.657 17.6412 123.656 18.0112 123.656 18.381V18.5624H126.328V18.3571C126.328 17.9051 126.328 17.4532 126.327 17.0013C126.327 15.8718 126.326 14.7423 126.329 13.6124C126.331 13.1019 126.276 12.5985 126.151 12.1049C125.964 11.3708 125.577 10.7633 124.948 10.3246C124.503 10.0124 124.013 9.81129 123.466 9.78879C123.404 9.7862 123.341 9.78281 123.278 9.7794C122.998 9.76428 122.714 9.74892 122.447 9.80285C121.682 9.95613 121.01 10.3063 120.502 10.9236C120.443 10.9944 120.385 11.0663 120.299 11.1736L120.28 11.1979V10.0039ZM113.682 18.5666H116.332V10.0095H113.682V18.5666Z",
  },
  YouTube: {
    dx: 144,
    evenOdd: true,
    d: "M165.593 7.20301C165.479 6.78041 165.257 6.39501 164.948 6.08518C164.639 5.77534 164.254 5.55187 163.831 5.43701C162.265 5.00701 156 5.00001 156 5.00001C156 5.00001 149.736 4.99301 148.169 5.40401C147.747 5.52415 147.363 5.75078 147.054 6.06214C146.745 6.3735 146.521 6.75913 146.403 7.18201C145.99 8.74801 145.986 11.996 145.986 11.996C145.986 11.996 145.982 15.26 146.392 16.81C146.622 17.667 147.297 18.344 148.155 18.575C149.737 19.005 155.985 19.012 155.985 19.012C155.985 19.012 162.25 19.019 163.816 18.609C164.239 18.4943 164.624 18.2714 164.934 17.9622C165.244 17.653 165.468 17.2682 165.583 16.846C165.997 15.281 166 12.034 166 12.034C166 12.034 166.02 8.76901 165.593 7.20301ZM153.996 15.005L154.001 9.00501L159.208 12.01L153.996 15.005Z",
  },
};

function SocialIcon({ name }: { name: string }) {
  const icon = SOCIAL_ICONS[name];
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
      <path
        d={icon.d}
        transform={`translate(${-icon.dx} 0)`}
        fill="currentColor"
        fillRule={icon.evenOdd ? "evenodd" : undefined}
        clipRule={icon.evenOdd ? "evenodd" : undefined}
      />
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
      {/* -mb-px: the 13.9vw height rounds to a fraction on narrow viewports
          and leaves a hairline seam over the charcoal block — overlap it. */}
      <div aria-hidden className="pointer-events-none -mt-px -mb-px">
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
        {/* The artist's rings as ground — the 21 frame's five instances,
            edge-anchored so they bleed past the page at every width: the
            dotted ring cut by the left edge beside the acknowledgement, the
            large ring cut by the top-right corner, a second dotted ring cut
            by the lower-right edge behind the link columns, and the ring +
            cluster pair cut by the foot behind the credits row.
            Every one of these files carries the hi-fi's 8% opacity inside
            it, so none takes a wrapper opacity — ring-c used to sit at the
            foot with opacity-[0.08] on top of its own, which multiplied out
            to 0.64% and drew nothing. The design has no ring-c here. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[90px] -left-32 w-[260px] sm:-left-3 sm:w-[465px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/artwork/ring-b.svg" alt="" className="h-auto w-full" />
          </div>
          <div className="absolute -top-2 -right-20 w-[230px] sm:-right-32 sm:w-[416px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/artwork/ring-a.svg" alt="" className="h-auto w-full" />
          </div>
          <div className="absolute bottom-24 -right-36 w-[280px] -scale-x-100 sm:-right-24 sm:w-[470px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/artwork/ring-b.svg" alt="" className="h-auto w-full" />
          </div>
          {/* The pair riding the foot, behind the credits row: a second
              ring-a with the small cluster off its right shoulder. Unlike
              the three above, these are anchored to the CONTENT COLUMN and
              not the viewport — in the frame the ring sits against the
              credits row and the cluster tucks just left of the social
              icons, so they have to travel with the text. Pinned to the
              page edge instead, they drifted out from under both on any
              viewport wider than the 1440 frame. Percentages are of the
              content track, so at 1440 they resolve to the frame's own
              608 and 1053. Both are cut by the foot, so only their tops
              show — the frame crops the cluster at 114 of its 128.

              The track followed the copy onto the house column on 8 Sep, so
              both percentages were recomputed to hold those same two x
              positions: 41.25% of the old 1280 track (starting at x=80) and
              42.2222% of a 1440 one both land on 608, and 76% -> 73.125%
              both land on 1053. Re-derive them if the column moves again. */}
          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[1440px]">
            <div className="absolute -bottom-[148px] -left-10 w-[230px] sm:left-[42.2222%] sm:w-[416px] sm:-bottom-[268px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/artwork/ring-a.svg" alt="" className="h-auto w-full" />
            </div>
            <div className="absolute -bottom-[10px] left-[48%] w-[100px] sm:-bottom-[14px] sm:left-[73.125%] sm:w-[145px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/artwork/cluster.svg" alt="" className="h-auto w-full" />
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[1440px] px-6 pt-16 pb-12 sm:px-10 sm:pt-24 sm:pb-10 lg:px-25">
          {/* Acknowledgement — first, centred, above the navigation. Placement
              per open decision 3: footer, text only, no ceremony element. */}
          <div className="text-center">
            <h2 className="eyebrow text-gold">Acknowledgement of Country</h2>
            {welcomeToCountry.status === "awaiting-suzanne" ? (
              <p
                className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-canvas/90 sm:mt-8 sm:text-lg"
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
            className="mx-auto mt-12 w-full max-w-3xl sm:mt-20"
          />

          {/* data-footer-links is a motion hook and nothing else — no page
              animates it by default. Truth uses it to fade the whole block up
              ONCE, together, with no stagger: the descent has finished
              talking, and staggering the links there would restart a rhythm
              the page has just put down. Inert everywhere else. */}
          <div
            data-footer-links
            className="mt-14 grid gap-10 sm:mt-24 sm:gap-12 md:grid-cols-3 lg:grid-cols-[1.3fr_1fr_1fr_1fr_0.8fr]"
          >
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
                className="w-44"
              />

              {/* Registration — the 21 frame: label, ICN, then ABN with the
                  R15 flag on the same line. */}
              <p className="eyebrow mt-6 text-base text-canvas">Registration</p>
              <p className="mt-4 text-base text-canvas">
                ICN {registration.icn ?? "[ number ]"}
              </p>
              <p className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-2 text-sm text-canvas">
                <span>ABN {registration.abn ?? "[ number ]"}</span>
                {registration.icn === null || registration.abn === null ? (
                  <span className="text-canvas/90">
                    <span className="text-gold">&#9888;</span> R15 &mdash;
                    registration numbers not yet supplied
                  </span>
                ) : null}
              </p>
            </div>

            {/* Two-up below md; md:contents dissolves this wrapper back into
                the footer grid so the desktop columns are untouched. */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:contents">
              {footerNav.map((column) => (
                <div key={column.title}>
                  <h2 className="eyebrow text-gold">{column.title}</h2>
                  <ul className="mt-5 space-y-4 sm:mt-8 sm:space-y-6">
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
                <ul className="mt-5 space-y-4 sm:mt-8 sm:space-y-6">
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
          </div>

          {/* The thin gold dot rule closes the page (the 21 frame's
              1278×21 rule) — the artist's rule tiled to the full width. */}
          <div
            aria-hidden
            className="mt-12 h-6 w-full bg-[url(/artwork/dots-rule-gold.svg)] bg-repeat-x sm:mt-20"
            style={{ backgroundSize: "auto 24px" }}
          />

          {/* Credits row — the 21 frame: 14px Work Sans, 24px gaps, the
              icon row (24px, 12px apart) on the right. */}
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-16">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-canvas">
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

            <ul className="flex items-center gap-3 text-turquoise">
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
