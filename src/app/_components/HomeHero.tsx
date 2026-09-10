import Image from "next/image";
import { homeTruthScenes, homeTruthArtwork } from "@/content/home-truth-scenes";
import { HomeHeroCanvas } from "./HomeHeroCanvas";
import { Invitation } from "@/components/sections/Invitation";
import { WayForwardStatement } from "@/components/sections/WayForwardStatement";
import { WayForwardOffer } from "@/components/sections/WayForwardOffer";
import { Pathways } from "@/components/sections/Pathways";
import { HOME_PORTAL } from "@/content/kit";
import { homeHero, type Beat } from "@/content/homepage";
import "./home-hero.css";

/**
 * Home opens on Country — black beat, then the road, held (10 September 2026,
 * user direction). D5: verbatim draft words. F7: the photograph is the loud
 * channel and the welcome is quiet over it.
 *
 * ⚠ The three-second photo-collage entrance and the painting that followed it
 * are gone, along with their copy ("You are entering" / "Turraburra" / "Story
 * held in stone and starlight", still in `homePaintingCopy`). The whole of
 * that opening runs at /homepagev2, which is an independent fork; nothing
 * here reaches it. See home-hero.ts and effects/home.ts.
 *
 * R11: one photograph above the fold instead of twenty-six, and the DOM still
 * below shares its request with the canvas texture.
 */
export function HomeHero({ beat, wonder, truth, belonging }: { beat: Beat; wonder: Beat; truth: Beat; belonging: Beat }) {
  const words = beat.headline?.split(/\s+/).filter(Boolean) ?? [];
  const truthParagraphs = [[truth.sequence?.subjectDetail[0] ?? ""], ...(truth.sequence?.steps.map(step => [step.text]) ?? []), [truth.body[0] ?? ""], truth.body.slice(1)];
  return (
    <section id={beat.id} data-home-hero data-nav-hero className="relative isolate h-svh min-h-[680px] overflow-hidden bg-charcoal lg:min-h-[760px]">
      {/* The scene itself, as markup. The canvas draws this same photograph,
          so a machine with no WebGL — and a reader who asked for less motion —
          gets the hero it was meant to have rather than a black screen.
          `unoptimized` deliberately: the canvas fetches this exact URL, so
          the two share one request and one decode. `object-bottom` matches
          the plate's LANDSCAPE_BOTTOM_BIAS, or the fallback would be a
          differently cropped photograph. */}
      <div aria-hidden="true" data-hero-fallback className="pointer-events-none absolute inset-0">
        <Image src={HOME_PORTAL.src} alt="" width={HOME_PORTAL.width} height={HOME_PORTAL.height}
          unoptimized loading="eager" className="h-full w-full object-cover object-bottom" />
      </div>
      <HomeHeroCanvas />
      <div data-landscape-exit-shade aria-hidden="true" className="home-landscape-exit-shade pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[30svh]" />
      {/* SCR-09: screenshot's opening Truth frame, sourced from the v3 sequence. */}
      <div data-home-truth className="home-truth-copy absolute inset-x-6 top-[13.75%] z-[3] mx-auto max-w-[720px] text-center text-canvas">
        <p className="eyebrow text-base leading-[1.4] tracking-normal lg:text-xl">{truth.eyebrow}</p>
        <h2 className="headline mt-6 text-h1 leading-none tracking-normal">{truth.sequence?.subject}</h2>
        <div className="home-truth-panels mt-6">
          {truthParagraphs.map((paragraphs, index) => (
            <div key={index} data-truth-panel={index} className="home-truth-panel text-base font-medium leading-[1.5] lg:text-xl">
              {paragraphs.map((paragraph, p) => <p key={p} className={p ? "mt-6" : undefined}>{paragraph}</p>)}
              {index === truthParagraphs.length - 1 && truth.cta && <a href={truth.cta.href} className="relative mt-8 inline-flex min-h-14 items-center gap-5 px-6 py-4 text-charcoal focus-visible:outline-2 focus-visible:outline-offset-4">
                <span aria-hidden="true" className="absolute inset-0 bg-canvas [mask-image:url('/artwork/blob-button.svg')] [mask-size:100%_100%]" />
                <span className="eyebrow relative text-base leading-[1.4] tracking-normal">{truth.cta.label}</span><span aria-hidden="true" className="relative text-2xl">&rsaquo;</span>
              </a>}
            </div>
          ))}
        </div>
        <div className="sr-only">{truth.sequence?.subjectDetail.slice(1).map((p, i) => <p key={i}>{p}</p>)}</div>
      </div>
      <div data-truth-timeline className="home-truth-timeline pointer-events-none absolute inset-0 z-[3] text-canvas">
        <Image src={homeTruthArtwork.path} alt="" width={1778} height={45} unoptimized className="home-truth-path" />
        <div data-truth-marker className="home-truth-marker">
          <div className="home-truth-years">{homeTruthScenes.map((scene, index) => <p key={scene.year} data-truth-year={index} className="headline text-h1 leading-none">{scene.year}</p>)}</div>
          <Image src={homeTruthArtwork.marker} alt="" width={48} height={94} unoptimized className="home-truth-marker-art" />
        </div>
      </div>
      {/* SCR-10: Figma 3371:41578 composition; D5 retains full draft wording. */}
      <div data-home-belonging className="home-belonging-copy absolute inset-x-6 z-[3] text-canvas lg:left-[5.55%] lg:right-auto lg:w-[800px]">
        <p className="eyebrow text-base leading-[1.4] tracking-normal lg:text-xl">{belonging.eyebrow}</p>
        <h2 className="headline mt-6 text-h1 leading-none tracking-normal">{belonging.headline}</h2>
        <div className="mt-6 max-w-[720px] space-y-6 text-base font-medium leading-[1.5] lg:text-xl">
          {belonging.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
        {belonging.cta && <a href={belonging.cta.href} className="relative mt-8 inline-flex min-h-14 items-center gap-4 px-6 py-4 text-charcoal focus-visible:outline-2 focus-visible:outline-offset-4">
          <span aria-hidden="true" className="absolute inset-0 bg-canvas [mask-image:url('/artwork/blob-button.svg')] [mask-size:100%_100%]" />
          <span className="eyebrow relative text-base leading-[1.4] tracking-normal">{belonging.cta.label}</span>
          <span aria-hidden="true" className="relative text-2xl">&rsaquo;</span>
        </a>}
      </div>
      {/* SCR-09, 9 September: accessible copy over the shared canvas, scrubbed as one block. */}
      <div data-home-wonder className="home-wonder-copy absolute inset-x-6 top-[25%] z-[3] max-w-[740px] text-canvas lg:left-[5.5%] lg:right-auto lg:w-[52%]">
        <p className="eyebrow text-base leading-[1.4] tracking-normal lg:text-xl">{wonder.eyebrow}</p>
        <h2 className="headline mt-6 text-h1 leading-[1.1] tracking-[-0.015em]">{wonder.headline}</h2>
        <div className="mt-7 space-y-4 text-base leading-[1.5] lg:text-xl">
          {wonder.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        {wonder.cta && <a href={wonder.cta.href} className="relative mt-8 inline-flex min-h-14 items-center gap-5 px-6 py-4 text-charcoal focus-visible:outline-2 focus-visible:outline-offset-4">
          <span aria-hidden="true" className="absolute inset-0 bg-canvas [mask-image:url('/artwork/blob-button.svg')] [mask-size:100%_100%]" />
          <span className="eyebrow relative text-base leading-[1.4] tracking-normal">{wonder.cta.label}</span>
          <span aria-hidden="true" className="relative text-2xl">›</span>
        </a>}
      </div>
      {/* Beat 6 rides the same pinned canvas as Wonder, Truth and Belonging
          (9 September 2026, user direction). It arrives last, travelling up
          one viewport over the drifting land — see homeHeroDissolve. */}
      <Invitation />
      {/* The page ends on this line, still on the same canvas: it comes up as
          The Invitation leaves and the lift finishes carrying the land off. */}
      <WayForwardStatement />
      {/* The line clears and the offer takes the same canvas: deck 22 and 23. */}
      <WayForwardOffer />
      {/* And the last screen of the page, still on this canvas: deck 24. */}
      <Pathways />
      {/* Media scrim is the palette's explicit gradient exception (X5). These
          two are the whole of the darkening the welcome is read against, and
          the scroll takes them off to leave the photograph clean — turn the
          first one's opacity if the land wants to be lighter or heavier under
          the copy. The feathered blur vignette that used to sit here went
          with the collage: it was made to soften the gaps between scattered
          plates, and over a single photograph it read as a smeared edge. */}
      <div data-hero-scrim aria-hidden="true" className="pointer-events-none absolute inset-0 bg-charcoal/35" />
      <div data-hero-scrim aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-t from-charcoal/70 via-transparent to-charcoal/20" />
      <div data-hero-black aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-night-black" />
      <div data-hero-copy className="absolute inset-x-0 top-[30%] px-6 text-center lg:px-16">
        {/* -0.1em of end margin cancels the TRAILING letter-space. Tracking is
            applied after every character including the last, so the line box is
            one letter-space wider than the glyphs and `text-center` centres the
            box — parking the word left of true centre by half a space. It is
            the only centred eyebrow on the page carrying tracking (the panel
            and Invitation eyebrows all run tracking-normal), so it is the only
            one that shows it. Small, and the kind of small that reads as
            "slightly off" without being nameable. */}
        <p data-hero-quiet className="eyebrow text-sm leading-[1.4] tracking-[0.1em] text-ochre me-[-0.1em] lg:text-base">{beat.eyebrow}</p>
        <h1 aria-label={beat.headline} className="headline mx-auto mt-14 max-w-[1120px] text-h1 leading-[1.15] tracking-[-0.015em] text-canvas lg:mt-24">
          {words.map((word, index) => (
            <span key={`${index}-${word}`} aria-hidden="true">
              <span className="inline-block overflow-hidden align-bottom pb-[0.1em]"><span data-hero-word>{word}</span></span>
              {index < words.length - 1 ? " " : ""}
            </span>
          ))}
        </h1>
        <div data-hero-quiet className="mx-auto mt-7 max-w-[580px] text-sm leading-[1.5] text-canvas/80 lg:text-base">
          {beat.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>
      <div data-hero-copy className="absolute inset-x-0 bottom-10 text-center lg:bottom-16">
        <a data-hero-quiet href="#wonder" className="callout inline-flex items-center gap-2 text-2xl text-gold focus-visible:outline-2 focus-visible:outline-offset-8">
          <span aria-hidden="true">↓</span>{homeHero.scrollLabel}
        </a>
      </div>
    </section>
  );
}
