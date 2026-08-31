import { photoById } from "@/content/kit";
import {
  challenges,
  getInvolved,
  infrastructure,
  livingWorkHero,
  outputs,
  outputsNote,
  rangers,
  workStreams,
} from "@/content/living-work";

/**
 * /v2/living-work — the markup. Verb: ACCUMULATES.
 *
 * Built to `03 · Living Work · HI-FI · Desktop · the field notebook`
 * (Figma 2137:2613, 1440 × 18407 ≈ 2045vh, twelve sections).
 *
 * The server owns structure and stamps the `data-*` hooks the recipes in
 * src/lib/motion/recipes.ts read. Nothing here imports GSAP: with JavaScript
 * off this page is a readable document in the right order, which is both an
 * accessibility floor and the reason the reduced-motion cut works — the markup
 * IS the final state, and motion only ever animates toward it.
 *
 * PHOTOGRAPHY. The hi-fi names specific frames (1.40.2 the hero, 1.28.1 the
 * plain seen through the aperture, 1.65.1 for BREATH). Batch 1 gave us eight
 * general frames, so the closest match is used and the swap is a one-line
 * change in each slot. Two of the hi-fi's own picks are marked STAND-IN on the
 * design as well, so some of these slots are provisional by design rather than
 * by our shortfall.
 */

const HERO = photoById("work-botanical");
const PLAIN = photoById("country-wide");
const BREAK = photoById("country-sunset-grass");
const RANGERS = photoById("work-seed");
const SPRING = photoById("country-sunset-grass");
const BREATH_FRAME = photoById("escarpment-approach");

/** The four figures of §02, in the hi-fi's order. All figures of return. */
const FIGURES = [
  { value: "8,870", caption: "hectares of Iningai Country" },
  { value: "120", caption: "kilometres south to Barcaldine" },
  { value: "480", caption: "metre bore · one water system" },
  { value: "2019", caption: "bought back for the Iningai people" },
] as const;

/** §08's fills, in the content file's order. The fifth has not started. */
const FILLS = [78, 58, 42, 26, 0];

/* -------------------------------------------------------------------------
   01 — the hero
   ------------------------------------------------------------------------- */

export function LivingWorkHero() {
  return (
    <section
      id="hero"
      data-lw="hero"
      className="relative flex min-h-svh items-end overflow-hidden bg-charcoal"
    >
      {HERO ? (
        <div data-media data-plane="far" className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO.src}
            alt=""
            width={HERO.width}
            height={HERO.height}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

      {/* X5 — required wherever copy sits on media. Bottom-weighted, because
          that is where the copy is. Test against the brightest frame. */}
      <div
        data-scrim
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-charcoal via-charcoal/50 to-charcoal/20"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 pt-32 pb-32 lg:px-16">
        <p className="eyebrow text-ochre">{livingWorkHero.eyebrow}</p>
        <h1
          data-heading
          className="headline mt-6 max-w-4xl text-5xl text-canvas sm:text-6xl lg:text-7xl"
        >
          {livingWorkHero.title}
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-canvas/80">
          {livingWorkHero.standfirst}
        </p>
      </div>

      {/* Marc's divider hands the photograph off into the page. */}
      <div
        data-wave
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 text-canvas"
      >
        <svg
          viewBox="0 0 1442 151"
          preserveAspectRatio="none"
          className="block h-[9vw] w-full"
        >
          <path
            d="M1470 8C1427.5 -2.1 1377.2 -2.7 1334 6.6c-63.6 13.6-109.7 36-176.5 44.2-44.4 5.5-85.4 1.5-129.4-.3-59-2.3-111-.6-167.3 9.8-52.9 9.7-104.2 22.3-159.8 27.2-67.6 6-136.5-3.7-201.6-15.2C434.4 62 369.3 48.6 300.8 46.8 195.6 44 95.7 68.9 1 93.1l0 12.2h1467.8L1470 8Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   02 — THE APERTURE
   ------------------------------------------------------------------------- */

/**
 * The 0 is a portal onto the plain.
 *
 * The photograph sits behind the figure and is clipped to an ellipse centred on
 * the `0`'s counter; the ellipse grows through three stages. The figure itself
 * is ordinary text in the display face — no SVG text, so it stays selectable
 * and the accessible name is just the number.
 *
 * `data-glyph` marks the `0` so the effect can measure its box rather than
 * trusting the design's fixed x=833. Block Berthold is gitignored (F5) and on a
 * machine without it the glyph is a different width, so measuring is what keeps
 * the portal inside the counter whichever face renders.
 */
export function LivingWorkAperture() {
  return (
    <section id="aperture" data-lw="aperture" className="relative min-h-svh bg-canvas">
      {/* Stage 3 lives here: the photograph, clipped. */}
      {PLAIN ? (
        <div data-aperture className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PLAIN.src}
            alt=""
            width={PLAIN.width}
            height={PLAIN.height}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

      <div className="relative mx-auto w-full max-w-7xl px-6 pt-32 lg:px-16">
        <p className="eyebrow text-oxide">The numbers</p>

        {/* The rail — four ticks, one per figure. */}
        <div className="mt-6 flex items-center gap-3">
          {FIGURES.map((f) => (
            <span
              key={f.value}
              data-rail-tick
              className="block h-px w-12 bg-oxide"
              aria-hidden
            />
          ))}
        </div>

        <div className="relative mt-16 h-[30vw] min-h-64">
          {FIGURES.map((figure, i) => (
            <p
              key={figure.value}
              data-figure
              className="headline absolute inset-0 text-right text-[22vw] leading-none text-evergreen"
            >
              {/* Right-aligned so every figure's last glyph lands at the same x.
                  The design pins this — "every figure is placed so its 0 lands
                  on x=833 · fixed for the whole sequence" — because the aperture
                  must not jump between figures. Measuring the first figure's
                  final glyph therefore gives the centre for all four. */}
              {figure.value.slice(0, -1)}
              <span data-glyph={i === 0 ? "" : undefined}>
                {figure.value.slice(-1)}
              </span>
            </p>
          ))}
        </div>

        <p className="mt-10 max-w-xl text-sm leading-relaxed text-evergreen/70">
          The aperture opens as the figures change — the counter of the 0, then
          the whole glyph, then the whole screen.
        </p>
      </div>

      {/* The four figures, once the aperture has closed.
          X5: the strip sits on the photograph at stage 3, so it carries its own
          scrim rather than relying on the frame being dark. mix-blend was the
          first instinct and is the wrong one — its contrast against arbitrary
          photography cannot be tested, and this text has to clear 4.5:1 against
          the brightest frame. */}
      <div className="relative mx-auto mt-24 w-full max-w-7xl px-6 pb-24 lg:px-16">
        <ul className="inline-flex flex-wrap gap-x-8 gap-y-2 rounded-sm bg-charcoal/85 px-5 py-3">
          {FIGURES.map((f) => (
            <li key={f.value} className="eyebrow text-xs text-canvas">
              {f.value} {f.caption}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   03 — the challenges, on a ground that thins
   ------------------------------------------------------------------------- */

export function LivingWorkChallenges() {
  return (
    <section
      id="challenges"
      data-lw="challenges"
      data-ground
      className="relative py-32"
      style={{ background: "var(--ground, #f6f6ec)" }}
    >
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-16">
        <p className="eyebrow text-oxide">Our challenges</p>
        <h2 className="headline mt-5 max-w-3xl text-4xl text-evergreen sm:text-5xl">
          What the work is up against
        </h2>

        <div className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge, i) => (
            <article
              key={challenge.title}
              data-cluster
              data-tier={i < 3 ? "anchor" : i < 8 ? "mid" : "detail"}
              className="border-t border-evergreen/25 pt-5"
            >
              <h3 className="headline text-xl text-evergreen">
                {challenge.title}
              </h3>
              <p data-line className="mt-3 text-sm leading-relaxed text-evergreen/75">
                {challenge.problem}
              </p>
              <p data-line className="mt-3 text-sm leading-relaxed text-evergreen/60">
                {challenge.response}
              </p>
            </article>
          ))}
        </div>
      </div>

      {/* The silent landscape that splits the clusters. No copy, by design. */}
      {BREAK ? (
        <div className="relative mt-24 h-[70svh] overflow-hidden">
          <div data-frame className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-frame-media
              src={BREAK.src}
              alt=""
              width={BREAK.width}
              height={BREAK.height}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}

/* -------------------------------------------------------------------------
   04 — the Rangers, the page's second dark beat
   ------------------------------------------------------------------------- */

export function LivingWorkRangers() {
  return (
    <section id="rangers" data-lw="rangers" className="relative overflow-hidden bg-charcoal py-32">
      {RANGERS ? (
        <div
          data-media
          data-plane="far"
          aria-hidden
          className="absolute inset-0 opacity-25"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={RANGERS.src}
            alt=""
            width={RANGERS.width}
            height={RANGERS.height}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-16">
        <p className="eyebrow text-ochre">Iningai Rangers</p>
        <h2
          data-heading
          className="headline mt-5 max-w-3xl text-4xl text-canvas sm:text-5xl"
        >
          {rangers.title}
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-canvas/75">
          {rangers.body}
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   05 — THE SPRING, the pinned moment
   ------------------------------------------------------------------------- */

/**
 * Eight days. The only place on this page where scroll controls time.
 *
 * ⚠ The hi-fi marks its photograph a STAND-IN: "the dry creek · brief: the
 * restored waterhole holding water, never photographed". The frame that belongs
 * here does not exist yet, and the section says so rather than pretending.
 */
export function LivingWorkSpring() {
  const days = Array.from({ length: 8 }, (_, i) => i + 1);
  return (
    <section
      id="spring"
      data-lw="spring"
      className="relative flex min-h-svh items-center overflow-hidden bg-evergreen"
    >
      {SPRING ? (
        <div data-media aria-hidden className="absolute inset-0 opacity-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SPRING.src}
            alt=""
            width={SPRING.width}
            height={SPRING.height}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-16">
        <p className="eyebrow text-ochre">The spring</p>
        <div className="relative mt-8 h-[26vw] min-h-52">
          {days.map((day) => (
            <p
              key={day}
              data-step
              className="headline absolute inset-0 text-[18vw] leading-none text-canvas"
            >
              Day {day}
            </p>
          ))}
        </div>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-canvas/80">
          It ran for eight days. Nobody alive had seen it run.
        </p>
        <p className="mt-4 max-w-xl text-xs leading-relaxed text-canvas/45">
          Photograph stands in — the restored waterhole holding water has never
          been photographed.
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   06 + 07 — the work, and what it takes
   ------------------------------------------------------------------------- */

export function LivingWorkStreams() {
  return (
    <section id="streams" data-lw="streams" className="relative bg-canvas py-32">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-16">
        <div className="lg:flex lg:gap-16">
          {/* The sticky index — two at a time, lighting as they pass. */}
          <aside className="lg:sticky lg:top-32 lg:h-fit lg:w-56 lg:shrink-0">
            <p className="eyebrow text-oxide">The work</p>
            <ol className="mt-6 space-y-3">
              {workStreams.map((stream) => (
                <li
                  key={stream.number}
                  data-index-item
                  className="text-xs tracking-[0.08em] text-evergreen uppercase"
                >
                  {stream.number} {stream.title}
                </li>
              ))}
            </ol>
          </aside>

          <div className="mt-16 flex-1 lg:mt-0">
            {workStreams.map((stream, i) => (
              <article
                key={stream.number}
                data-stream
                data-tier={i < 3 ? "anchor" : i < 5 ? "mid" : "detail"}
                className="border-t border-evergreen/20 py-12 first:border-t-0 first:pt-0"
              >
                <p className="headline text-3xl text-ochre">{stream.number}</p>
                <h3 className="headline mt-3 max-w-2xl text-2xl text-evergreen sm:text-3xl">
                  {stream.title}
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-evergreen/80">
                  {stream.lede}
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-evergreen/60">
                  {stream.detail}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* Infrastructure — what it takes, two at a time. */}
        <div className="mt-28 grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {infrastructure.map((block) => (
            <div key={block.title} className="border-t border-evergreen/25 pt-5">
              <h3 className="headline text-xl text-evergreen">{block.title}</h3>
              <ul className="mt-4 space-y-2">
                {block.points.map((point) => (
                  <li key={point} className="text-sm leading-relaxed text-evergreen/75">
                    {point}
                  </li>
                ))}
              </ul>
              {block.note ? (
                <p className="mt-4 text-sm text-evergreen/55 italic">{block.note}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   07b — BREATH
   ------------------------------------------------------------------------- */

/**
 * The hinge between the apparatus and what it earns.
 *
 * One photograph, held, no caption. After 360vh of streams and index the page
 * stops talking for half a screen. This section is the reason the ones either
 * side of it land, and it is a scene rather than padding — `breath` cites the
 * grammar's "the rest" row like anything else.
 */
export function LivingWorkBreath() {
  return (
    <section id="breath" data-lw="breath" className="relative h-[47svh] overflow-hidden bg-charcoal">
      {BREATH_FRAME ? (
        <div data-media className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BREATH_FRAME.src}
            alt=""
            width={BREATH_FRAME.width}
            height={BREATH_FRAME.height}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
    </section>
  );
}

/* -------------------------------------------------------------------------
   08 — what the work produces
   ------------------------------------------------------------------------- */

/**
 * Five vessels, four filling.
 *
 * ⚠ R14 — every status label here is an unconfirmed public claim about
 * registration and legal status. The draft's own note renders underneath, and
 * the labels come from the content file so they change in one place when the
 * client confirms them.
 */
export function LivingWorkOutputs() {
  return (
    <section id="outputs" data-lw="outputs" className="relative bg-evergreen py-32">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-16">
        <p className="eyebrow text-ochre">What the work produces</p>
        <h2 className="headline mt-5 max-w-3xl text-4xl text-canvas sm:text-5xl">
          Five streams. Four of them have started.
        </h2>

        <div className="mt-16 space-y-10">
          {outputs.map((output, i) => (
            <div key={output.title} className="relative">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h3 data-vessel-label className="headline text-2xl text-canvas">
                  {output.title}
                </h3>
                <p className="eyebrow text-xs text-ochre">{output.status}</p>
              </div>

              {/* The mark. scaleX to its own proportion — no counting text. */}
              <div className="mt-4 h-px w-full bg-canvas/20">
                <div
                  data-vessel
                  data-fill={FILLS[i]}
                  className="h-px w-full origin-left bg-ochre"
                />
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-canvas/70">
                {output.unwritten ? (
                  <span className="text-oxide italic">
                    [ For YACHATDAC to write ]
                  </span>
                ) : (
                  output.body
                )}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-12 max-w-2xl text-sm text-canvas/50 italic">
          {outputsNote}
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   09 — get involved
   ------------------------------------------------------------------------- */

export function LivingWorkInvitation() {
  return (
    <section id="invitation" data-lw="invitation" className="relative bg-charcoal py-32">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-16">
        <h2
          data-heading
          className="headline max-w-3xl text-4xl text-canvas sm:text-5xl"
        >
          {getInvolved.title}
        </h2>
        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-3">
          {getInvolved.paths.map((path) => (
            <article
              key={path.title}
              data-cluster
              data-tier="mid"
              className="border-t border-canvas/25 pt-5"
            >
              <h3 className="headline text-xl text-canvas">{path.title}</h3>
              <p data-line className="mt-3 text-sm leading-relaxed text-canvas/70">
                {path.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
