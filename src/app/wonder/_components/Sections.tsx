import { existsSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import type { ReactNode } from "react";
import type { MediaSlot } from "@/content/lofi/media";
import {
  beforeYouCome,
  gettingHere,
  stayStages,
  turraburra,
  whatItIsLike,
  whereYouSleep,
  whoYouAreWith,
  wonderClose,
  wonderHero,
  wonderHighlights,
  wonderStories,
} from "@/content/wonder";
import {
  hostsSlot,
  stayStageMedia,
  turraburraSlot,
  whatItIsLikeSlot,
  whereYouSleepMedia,
  wonderHeroSlot,
  wonderHighlightMedia,
  wonderStoryMedia,
} from "@/content/wonder-media";
import { MediaOrField } from "@/components/ui/MediaOrField";
import {
  BlobButton,
  BlobHold,
  WAVE_PATH,
  WaveDivider,
} from "@/components/ui/Furniture";

/**
 * /wonder — the markup, built to `01 · Wonder · HI-FI · Desktop`
 * (Figma 2033:4367, 1440 × 11900). Desktop-first at 1440 × 900, as the frame
 * is; the responsive pass comes after the sections are signed off.
 *
 * Copy is src/content/wonder.ts verbatim (D5 — the draft governs copy, the
 * frame governs layout). Where the frame carries copy the draft does not,
 * it is registered in wonder.ts with a hi-fi flag rather than typed here.
 *
 * Photography is src/content/wonder-media.ts: a slot whose file is not on
 * disk renders a tonal field. The Wonder batch is still to be gathered.
 *
 * Load-bearing anchors (src/content/site.ts points at them):
 * #experience (What a stay looks like), #turraburra.
 */

/* -------------------------------------------------------------------------
   Shared bits
   ------------------------------------------------------------------------- */

/** Photograph on disk, or null so the slot renders its field. */
function presentSrc(src: string | null): string | null {
  return src && existsSync(join(process.cwd(), "public", src)) ? src : null;
}

/** Tailwind cannot see a computed class — the tone map has to be literal. */
const FIELD_CLASS: Record<MediaSlot["tone"], string> = {
  evergreen: "bg-evergreen",
  midnight: "bg-midnight",
  roasted: "bg-roasted",
  oxide: "bg-oxide",
  burnt: "bg-burnt",
  eucalyptus: "bg-eucalyptus",
  charcoal: "bg-charcoal",
};

/** Every photograph in the library is ~1.9:1; cover crops need height. */
const COVER_FULL_BLEED = "(min-width: 1024px) 100vw, 260vw";

function Slot({
  slot,
  sizes,
  priority = false,
  className = "object-cover",
}: {
  slot: MediaSlot;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <MediaOrField
      src={presentSrc(slot.src)}
      alt={slot.expects}
      sizes={sizes}
      priority={priority}
      className={className}
      fieldClass={FIELD_CLASS[slot.tone]}
    />
  );
}

/* The frame's type ramp, Typography/Desktop: H1 96/1, H2 56/1.2, H3 40/1,
   H4 36/1.3 (Bantayog), H5 20/1.4 (Bantayog), H6 14/1.4 (Bantayog). Set as
   explicit sizes because the site's `eyebrow` utility is the 13px nav size
   and the frame's eyebrows are 20. */
const H1 = "headline text-[96px] leading-none";
const H2 = "headline text-[56px] leading-[1.2]";
const H3 = "headline text-[40px] leading-none";
const H4 = "font-eyebrow text-[36px] leading-[1.3] font-extrabold";
const H5 = "font-eyebrow text-[20px] leading-[1.4] font-extrabold uppercase";
const H6 = "font-eyebrow text-[14px] leading-[1.4] font-extrabold uppercase";

/** The section frame: 64px side padding, a 1280 container. */
function Container({
  children,
  className = "",
  width = "max-w-[1280px]",
}: {
  children: ReactNode;
  className?: string;
  width?: string;
}) {
  return (
    <div className={`relative mx-auto w-full ${width} ${className}`}>
      {children}
    </div>
  );
}

/** Chip — the eucalyptus tag the frame uses for the summary line and cards. */
function Chip({ children }: { children: string }) {
  return (
    <span
      className={`inline-block rounded-lg bg-eucalyptus px-3.5 py-1.5 whitespace-nowrap text-canvas ${H6}`}
    >
      {children}
    </span>
  );
}

/**
 * The OUTGOING ground dripping down into the section below — the frame's
 * other use of the wave. WaveDivider is the incoming ground rising up out
 * of the join; this is the same path, flipped, seated inside the top of the
 * incoming section and filled with the ground it is leaving.
 */
function WaveDrip({
  ground,
  className = "",
}: {
  ground: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="1.00123 0 1467.84877 105.324"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 -top-px z-10 h-16 w-full scale-y-[-1] sm:h-26 ${className}`}
    >
      <path d={WAVE_PATH} fill={ground} />
    </svg>
  );
}

/* -------------------------------------------------------------------------
   01 — Hero (Header / 5, 2033:5352) — 720 tall, copy bottom-left
   ------------------------------------------------------------------------- */

export function WonderHero() {
  return (
    <header className="relative flex min-h-[720px] items-end overflow-hidden bg-roasted">
      <div className="absolute inset-0">
        <Slot slot={wonderHeroSlot} sizes={COVER_FULL_BLEED} priority />
      </div>
      {/* X5 — copy sits on media. Foot-weighted, never opaque. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-charcoal/70 via-charcoal/20 to-charcoal/10"
      />
      <div className="relative z-10 w-full px-16 pb-[120px]">
        <Container>
          <div className="flex w-[900px] max-w-full flex-col gap-6 text-canvas">
            <p className={H5}>{wonderHero.eyebrow}</p>
            <h1 className={H1}>{wonderHero.title}</h1>
          </div>
        </Container>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------
   02 — The facts (Layout / 18, 2033:5376) — canvas, the map artwork right
   ------------------------------------------------------------------------- */

export function WonderFacts() {
  const [left, right] = [
    wonderHero.facts.slice(0, 3),
    wonderHero.facts.slice(3),
  ];
  return (
    <section className="relative overflow-hidden bg-canvas px-16 py-16 text-charcoal">
      <WaveDivider ground="var(--color-canvas)" />
      {/* The illustrated map (2033:5376 › 3238:34073) — 1129 × 783, seated
          at x=205 y=83 in the 1440 frame, running behind the right column. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 h-full w-[1440px] -translate-x-1/2"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
        <img
          src="/wonder/facts-map.svg"
          alt=""
          className="absolute top-[83px] left-[205px] h-[783px] w-[1129px] max-w-none"
        />
      </div>
      <Container>
        <div className="flex items-start gap-20">
          <div className="flex min-w-0 flex-1 flex-col gap-8">
            <p className={H4}>{wonderHero.standfirst}</p>
            <div className="flex flex-wrap gap-2.5">
              {wonderHero.summary.map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
            </div>
            <div className="flex gap-4 py-2">
              {[left, right].map((column, i) => (
                <dl key={i} className="flex flex-col gap-6">
                  {column.map((fact) => (
                    <div key={fact.label} className="flex w-[378px] flex-col gap-2">
                      <dt className={`${H5} text-burnt`}>{fact.label}</dt>
                      <dd className="text-lg leading-normal font-medium">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ))}
            </div>
          </div>
          {/* The frame's Placeholder Image column — empty; the map fills it. */}
          <div aria-hidden className="aspect-[600/640] min-w-0 flex-1" />
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------
   03 — Highlights (Layout / 267, 2033:5436) — three 500px photo cards
   ------------------------------------------------------------------------- */

export function WonderHighlights() {
  return (
    <section className="relative bg-canvas px-16 pt-[120px] pb-[160px] text-charcoal">
      <Container className="flex flex-col gap-10">
        <h2 className={H4}>HIGHLIGHTS</h2>
        <div className="flex gap-12">
          {wonderHighlights.map((card, i) => {
            const media = wonderHighlightMedia[i];
            return (
              <article
                key={card.title}
                className="relative flex h-[500px] min-w-0 flex-1 flex-col justify-end gap-4 overflow-hidden rounded-3xl p-10 text-canvas"
              >
                <div className="absolute inset-0">
                  <Slot slot={media} sizes="(min-width: 1024px) 400px, 100vw" />
                </div>
                <div aria-hidden className="absolute inset-0 bg-charcoal/25" />
                <div className="relative flex flex-col items-start gap-4">
                  <Chip>{card.eyebrow}</Chip>
                  <div className="flex flex-col gap-2">
                    <h3 className={H3}>{card.title}</h3>
                    <p className="text-base leading-normal font-medium">
                      {card.body}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------
   04 — Getting here (Header / 5, 2033:5572) — charcoal, the route map right
   ------------------------------------------------------------------------- */

/** The route icons, in `gettingHere.stops` order — the frame's four vectors. */
const STOP_ICONS = [
  { src: "/wonder/icon-lake.svg", w: 32, h: 24 },
  { src: "/wonder/icon-sculpture.svg", w: 31, h: 30 },
  { src: "/wonder/icon-gorge.svg", w: 33, h: 32 },
  { src: "/wonder/icon-grayrock.svg", w: 28, h: 28 },
] as const;

/** The same icons as pins on the map, at the frame's own coordinates. */
const MAP_PINS = [
  { icon: 0, left: 1196, top: 325 },
  { icon: 1, left: 1131, top: 368 },
  { icon: 2, left: 1179, top: 403 },
  { icon: 3, left: 1227, top: 355 },
] as const;

export function WonderGettingHere() {
  return (
    <section className="relative min-h-[900px] overflow-hidden bg-charcoal px-16 pt-10 text-canvas">
      <WaveDivider ground="var(--color-charcoal)" />
      {/* The route map (3238:34130) — 2278 × 1580, clipped to 1973 wide and
          centred at (50% − 266px, 50% + 57px) in the frame. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 h-full w-[1440px] -translate-x-1/2"
      >
        <div className="absolute top-[calc(50%+57px)] left-[calc(50%-266px)] h-[1580px] w-[1973px] -translate-x-1/2 -translate-y-1/2 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
          <img
            src="/wonder/getting-here-map.svg"
            alt=""
            className="absolute top-0 left-0 h-[1580px] w-[2278px] max-w-none"
          />
        </div>
        {MAP_PINS.map((pin) => {
          const icon = STOP_ICONS[pin.icon];
          return (
            /* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */
            <img
              key={pin.icon}
              src={icon.src}
              alt=""
              width={icon.w}
              height={icon.h}
              className="absolute"
              style={{ left: pin.left, top: pin.top, width: icon.w, height: icon.h }}
            />
          );
        })}
      </div>

      <Container className="flex flex-col gap-20">
        <div className="flex w-[720px] max-w-full flex-col gap-6">
          <p className={`${H5} text-burnt`}>Getting here</p>
          <h2 className={H2}>{gettingHere.title}</h2>
          <div className="flex flex-col gap-7 text-xl leading-normal">
            {gettingHere.body.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
          <ul className="flex flex-col gap-6 text-xl leading-normal">
            {gettingHere.stops.map((stop, i) => {
              const icon = STOP_ICONS[i];
              return (
                <li key={stop.name} className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="flex w-[33px] shrink-0 items-center justify-center"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
                    <img
                      src={icon.src}
                      alt=""
                      width={icon.w}
                      height={icon.h}
                      style={{ width: icon.w, height: icon.h }}
                    />
                  </span>
                  <span>
                    <strong className="font-medium">{stop.name}</strong> — {stop.detail}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="text-xl leading-normal">{gettingHere.coda}</p>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------
   05 — Turraburra (Header / 5, 2033:5687) — full-bleed, copy right, 720 tall
   ------------------------------------------------------------------------- */

export function WonderTurraburra() {
  return (
    <section
      id="turraburra"
      className="relative flex min-h-[720px] items-end overflow-hidden bg-burnt px-16 pb-20 text-canvas"
    >
      <div className="absolute inset-0">
        <Slot slot={turraburraSlot} sizes={COVER_FULL_BLEED} />
      </div>
      <div aria-hidden className="absolute inset-0 bg-charcoal/10" />
      <WaveDrip ground="var(--color-charcoal)" />
      <Container className="flex items-start gap-20">
        <div aria-hidden className="min-w-0 flex-1" />
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <h2 className={H2}>{turraburra.title}</h2>
          <p className="text-xl leading-normal font-medium">{turraburra.body}</p>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------
   06 — What a stay looks like (Layout / 18, 2033:5889) — the stage list
   ------------------------------------------------------------------------- */

function DottedLine() {
  return (
    /* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */
    <img
      src="/wonder/dotted-line.svg"
      alt=""
      aria-hidden
      className="block h-[10px] w-full"
    />
  );
}

export function WonderStay() {
  return (
    <section id="experience" className="relative bg-canvas px-16 pt-28 pb-[164px] text-charcoal">
      <Container width="max-w-[1040px]" className="flex flex-col gap-10">
        <div className="flex flex-col gap-6">
          <p className={`${H5} text-burnt`}>Itinerary</p>
          <h2 className={H2}>What a stay looks like</h2>
        </div>

        <div className="flex flex-col">
          <DottedLine />
          {stayStages.map((stage, i) => {
            const media = stayStageMedia[stage.title];
            return (
              <div key={stage.title}>
                {/* Native disclosure — works before hydration, no client
                    boundary (see components/ui/Disclosure). The first stage
                    opens as the frame shows it. */}
                <details className="group py-12" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-8 [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center gap-4">
                      {/* The numbered badge (2033:6000) — the artist's mark
                          with the figure set on it. */}
                      <span className="relative block h-16 w-[71px] shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
                        <img
                          src="/wonder/stage-badge.svg"
                          alt=""
                          aria-hidden
                          className="absolute inset-0 h-full w-full"
                        />
                        <span
                          className={`absolute inset-0 flex items-center justify-center pt-1 text-canvas ${H5}`}
                        >
                          {i + 1}
                        </span>
                      </span>
                      <span className={H3}>{stage.title}</span>
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
                    <img
                      src="/wonder/chevron-up.svg"
                      alt=""
                      aria-hidden
                      className="h-8 w-[33px] shrink-0 rotate-180 transition-transform duration-(--dur-small) ease-quiet group-open:rotate-0"
                    />
                  </summary>

                  <div className="flex items-start gap-10 pt-[30px]">
                    <div className="flex min-w-0 flex-1 flex-col gap-4 text-xl leading-normal font-medium">
                      {stage.body.map((para) => (
                        <p key={para}>{para}</p>
                      ))}
                      {stage.points ? (
                        <ul className="list-disc space-y-1 pl-6">
                          {stage.points.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      ) : null}
                      {stage.coda ? (
                        <p className="callout text-scroll text-burnt">{stage.coda}</p>
                      ) : null}
                    </div>
                    <div className="relative h-[400px] min-w-0 flex-1 overflow-hidden rounded-3xl">
                      {media ? (
                        <Slot slot={media} sizes="(min-width: 1024px) 500px, 100vw" />
                      ) : null}
                    </div>
                  </div>
                </details>
                <DottedLine />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------
   07 — Before you come (Layout / 360, 2033:6742) — evergreen, centred
   ------------------------------------------------------------------------- */

export function WonderBeforeYouCome() {
  const [row1, row2] = [
    beforeYouCome.facts.slice(0, 2),
    beforeYouCome.facts.slice(2),
  ];
  return (
    <section className="relative flex flex-col items-center gap-14 bg-evergreen px-[120px] py-24 text-canvas">
      <WaveDivider ground="var(--color-evergreen)" />
      <Container className="flex flex-col items-center">
        <div className="flex w-full max-w-[768px] flex-col items-center gap-4">
          <p className={`${H5} text-gold text-center`}>{beforeYouCome.eyebrow}</p>
          <div className="flex w-full flex-col items-center gap-10">
            <h2 className={`${H2} text-center`}>{beforeYouCome.title}</h2>
            {/* `max-w-full` on the cells below is a guard, not a responsive
                pass — this file is desktop-first by decision and its own pass
                is still to come. Without it a 378px cell sits in a 247px
                column with nothing clipping it and pans the whole document
                sideways; the row at :178 already carries the same guard. */}
            {[row1, row2].map((row, i) => (
              <dl key={i} className="flex gap-6">
                {row.map((fact) => (
                  <div key={fact.label} className="flex w-[378px] max-w-full flex-col gap-2">
                    <dt className={`${H5} text-gold`}>{fact.label}</dt>
                    <dd className="text-lg leading-normal">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            ))}
            <div className="flex flex-col gap-7 text-center text-xl leading-normal">
              {beforeYouCome.body.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </Container>
      <BlobButton href={beforeYouCome.action.href} tone="oxide">
        {beforeYouCome.action.label}
      </BlobButton>
    </section>
  );
}

/* -------------------------------------------------------------------------
   08 — Where you sleep (Layout / 267, 2033:6782) — two 400px cards
   ------------------------------------------------------------------------- */

export function WonderWhereYouSleep() {
  return (
    <section className="relative bg-canvas px-16 pt-[120px] pb-28 text-charcoal">
      {/* The evergreen drips down into the canvas (frame wave 2033:6770). */}
      <WaveDrip ground="var(--color-evergreen)" />
      <Container className="flex flex-col gap-10">
        <div className="flex w-[720px] max-w-full flex-col gap-4">
          <h2 className={H2}>{whereYouSleep.title}</h2>
          <p className="text-base leading-normal font-medium">{whereYouSleep.body}</p>
        </div>
        <div className="flex gap-12">
          {whereYouSleepMedia.map((slot) => (
            <div
              key={slot.id}
              className="relative h-[400px] min-w-0 flex-1 overflow-hidden rounded-3xl"
            >
              <Slot slot={slot} sizes="(min-width: 1024px) 620px, 100vw" />
              <div aria-hidden className="absolute inset-0 bg-charcoal/10" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------
   09 — What it is like out here (Header / 5, 2033:6800) — full-bleed, right
   ------------------------------------------------------------------------- */

export function WonderOutHere() {
  return (
    <section className="relative flex min-h-[720px] items-end overflow-hidden bg-evergreen px-16 pb-28 text-canvas">
      <div className="absolute inset-0">
        <Slot slot={whatItIsLikeSlot} sizes={COVER_FULL_BLEED} />
      </div>
      <div aria-hidden className="absolute inset-0 bg-charcoal/10" />
      <WaveDrip ground="var(--color-canvas)" />
      <Container className="flex items-start gap-20">
        <div aria-hidden className="min-w-0 flex-1" />
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <h2 className={H2}>{whatItIsLike.title}</h2>
          <ul className="text-xl leading-normal font-medium">
            {whatItIsLike.points.map((point) => (
              <li key={point}>· {point}</li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------
   10 — Your hosts (Layout / 267, 2033:7003) — copy left, one card right
   ------------------------------------------------------------------------- */

export function WonderHosts() {
  return (
    <section className="relative bg-canvas px-16 py-28 text-charcoal">
      <WaveDivider ground="var(--color-canvas)" />
      <Container className="flex items-start gap-10">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <p className={`${H5} text-burnt`}>Your hosts</p>
          <h2 className={H2}>{whoYouAreWith.title}</h2>
          <p className="text-xl leading-normal font-medium">{whoYouAreWith.body}</p>
        </div>
        <div className="relative h-[400px] min-w-0 flex-1 overflow-hidden rounded-3xl">
          <Slot slot={hostsSlot} sizes="(min-width: 1024px) 620px, 100vw" />
          <div aria-hidden className="absolute inset-0 bg-charcoal/10" />
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------
   11 — Stories from out here (Layout / 267, 2033:7021) — three story cards
   ------------------------------------------------------------------------- */

export function WonderStories() {
  return (
    <section className="relative bg-canvas px-16 pt-[120px] pb-[160px] text-charcoal">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <p className="font-eyebrow text-base leading-[1.4] font-extrabold text-burnt uppercase">
            From Country
          </p>
          <h2 className={H2}>{wonderStories.title}.</h2>
        </div>
        <div className="flex gap-12">
          {wonderStories.items.map((item, i) => {
            const media = wonderStoryMedia[i];
            return (
              <article
                key={item.href}
                className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-3xl bg-charcoal text-canvas"
              >
                <div className="relative h-[320px] w-full">
                  <Slot slot={media} sizes="(min-width: 1024px) 400px, 100vw" />
                </div>
                <div className="flex flex-col items-start gap-4 px-9 py-10">
                  <Chip>{item.tag.replace("#", "")}</Chip>
                  <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-4">
                      <h3 className={H3}>{item.title}</h3>
                      <p className="text-base leading-normal font-medium">
                        {item.summary}
                      </p>
                    </div>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-2 font-eyebrow text-base leading-normal font-bold text-gold uppercase"
                    >
                      Read the story
                      {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork */}
                      <img
                        src="/wonder/chevron-right.svg"
                        alt=""
                        aria-hidden
                        className="size-6 transition-transform duration-(--dur-small) ease-quiet group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------
   12 — Come and see it (Layout / 360, 2033:7085) — roasted, centred, two
        buttons. pb-300 is the frame's own: it leaves room for the footer's
        double wave to ride up into the band.
   ------------------------------------------------------------------------- */

export function WonderClose() {
  return (
    <section className="relative flex flex-col items-center gap-14 bg-roasted px-[120px] pt-20 pb-[300px] text-canvas">
      <WaveDivider ground="var(--color-roasted)" />
      <Container className="flex flex-col items-center">
        <div className="flex w-full max-w-[768px] flex-col items-center gap-4">
          <p className={`${H5} text-center text-gold`}>{wonderClose.eyebrow}</p>
          <div className="flex w-full flex-col items-center gap-6">
            <h2 className={`${H2} text-center`}>{wonderClose.title}</h2>
            <p className="text-center text-xl leading-normal">{wonderClose.body}</p>
            <div className="flex flex-wrap justify-center gap-6">
              {wonderClose.facts.map((fact) => (
                <Chip key={fact}>{fact}</Chip>
              ))}
            </div>
            <p className="text-center text-xl leading-normal">{wonderClose.download}</p>
            <p className="text-center text-xl leading-normal">{wonderClose.note}</p>
          </div>
        </div>
      </Container>
      <div className="flex items-center gap-6">
        <BlobButton href="/connect" tone="oxide">
          Register your interest
        </BlobButton>
        {/* R14 — no brochure file exists yet; the shape renders held. */}
        <BlobHold>Download the brochure</BlobHold>
      </div>
    </section>
  );
}
