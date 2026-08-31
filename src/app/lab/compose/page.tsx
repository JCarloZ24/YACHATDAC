import type { Metadata } from "next";
import Link from "next/link";
import { V2LivingWorkMotion } from "@/components/v2/V2LivingWorkMotion";
import {
  LivingWorkAperture,
  LivingWorkBreath,
  LivingWorkChallenges,
  LivingWorkHero,
  LivingWorkInvitation,
  LivingWorkOutputs,
  LivingWorkRangers,
  LivingWorkSpring,
  LivingWorkStreams,
} from "@/components/v2/LivingWorkSections";

export const metadata: Metadata = { title: "Screen recipes" };

/**
 * /lab/compose — one composed screen at a time.
 *
 * The effects gallery shows the vocabulary; this shows the sentences. Each
 * screen below is a real composition from /v2/living-work, rendered alone and
 * top-aligned so it can be judged on its own — which the full page makes hard,
 * because on the page every screen arrives after 300vh of something else.
 *
 * Also the honest way to review pacing: the loud channel of a screen is only
 * arguable when you can see that screen without its neighbours.
 */

const SCREENS = {
  hero: {
    label: "fullBleedOpen",
    channel: "media",
    span: "100vh",
    note: "Hi-fi §01. Photograph takes the screen, scrim ramps under the copy, heading settles, wave hands it into the page.",
    render: () => <LivingWorkHero />,
  },
  aperture: {
    label: "apertureSequence",
    channel: "type",
    span: "300vh · pinned",
    note: "Hi-fi §02, the signature. The counter of the 0, then the whole glyph, then the whole screen — while four figures change behind it.",
    render: () => <LivingWorkAperture />,
  },
  challenges: {
    label: "clusterDescent",
    channel: "transition",
    span: "330vh",
    note: "Hi-fi §03. The ground walks bone → dust → dry earth while you read a section about drought.",
    render: () => <LivingWorkChallenges />,
  },
  rangers: {
    label: "fullBleedOpen",
    channel: "media",
    span: "100vh",
    note: "Hi-fi §04. The page's second dark beat — the same recipe as the hero, on charcoal.",
    render: () => <LivingWorkRangers />,
  },
  spring: {
    label: "pinnedCount",
    channel: "media",
    span: "150vh · pinned, snapped",
    note: "Hi-fi §05. Eight days, counted. The only place on this page where scroll controls time.",
    render: () => <LivingWorkSpring />,
  },
  streams: {
    label: "stickyStreams",
    channel: "media",
    span: "360vh",
    note: "Hi-fi §06 + §07. Seven streams on their L2 tiers, a sticky index lighting each as it passes, anchor images bleeding past the column.",
    render: () => <LivingWorkStreams />,
  },
  breath: {
    label: "breath",
    channel: "none",
    span: "47vh",
    note: "Hi-fi §07b. One photograph, held, no caption. The composition declares no loud channel and the build fails if anything loud is added — the only screen where stillness is enforced by the compiler.",
    render: () => <LivingWorkBreath />,
  },
  outputs: {
    label: "vessels",
    channel: "none",
    span: "120vh",
    note: "Hi-fi §08. Five vessels, four filling. The fifth stays empty, which is the honest part.",
    render: () => <LivingWorkOutputs />,
  },
  invitation: {
    label: "quietArrival",
    channel: "type",
    span: "100vh",
    note: "Hi-fi §09. A screen that simply arrives. Most of a site is this.",
    render: () => <LivingWorkInvitation />,
  },
} as const;

type ScreenKey = keyof typeof SCREENS;

export default async function ComposeLabPage({
  searchParams,
}: {
  searchParams: Promise<{ screen?: string }>;
}) {
  const { screen } = await searchParams;
  const key = (screen && screen in SCREENS ? screen : "hero") as ScreenKey;
  const active = SCREENS[key];

  return (
    <>
      <V2LivingWorkMotion />

      <header className="border-b border-canvas/15 bg-charcoal px-6 pt-32 pb-6 lg:px-16">
        <Link href="/lab" className="eyebrow text-ochre hover:text-burnt">
          ← Prototypes
        </Link>
        <h1 className="headline mt-4 text-2xl text-canvas">Screen recipes</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-canvas/65">
          One composed screen at a time, from{" "}
          <Link href="/v2/living-work" className="text-ochre hover:underline">
            /v2/living-work
          </Link>
          . Effects are the vocabulary; these are the sentences — each one layers
          three or four on a single timeline and declares which channel it is
          allowed to be loud in.
        </p>

        <nav className="mt-6 flex flex-wrap gap-2">
          {(Object.keys(SCREENS) as ScreenKey[]).map((k) => (
            <Link
              key={k}
              href={`/lab/compose?screen=${k}`}
              className={`rounded-sm border px-3 py-1.5 text-xs transition-colors duration-(--dur-small) ease-quiet ${
                k === key
                  ? "border-ochre bg-ochre text-charcoal"
                  : "border-canvas/25 text-canvas/70 hover:border-ochre/60 hover:text-canvas"
              }`}
            >
              {SCREENS[k].label}
            </Link>
          ))}
        </nav>

        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-1 text-xs text-canvas/55">
          <div className="flex gap-2">
            <dt className="text-canvas/35">recipe</dt>
            <dd className="text-ochre">{active.label}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-canvas/35">loud channel</dt>
            <dd>{active.channel}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-canvas/35">span</dt>
            <dd>{active.span}</dd>
          </div>
        </dl>
        <p className="mt-3 max-w-3xl text-xs leading-relaxed text-canvas/45">
          {active.note}
        </p>
      </header>

      <main>{active.render()}</main>
    </>
  );
}
