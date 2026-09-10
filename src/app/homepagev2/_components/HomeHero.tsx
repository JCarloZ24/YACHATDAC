import Image from "next/image";
import { homeTruthScenes, homeTruthArtwork } from "../_content/home-truth-scenes";
import { HomeHeroCanvas } from "./HomeHeroCanvas";
import { Invitation } from "./Invitation";
import { WayForwardStatement } from "./WayForwardStatement";
import { WayForwardOffer } from "./WayForwardOffer";
import { Pathways } from "./Pathways";
import { homeHeroFrames } from "../_content/homepage-media";
import { homeHero, homePaintingCopy, type Beat } from "../_content/homepage";
import "./home-hero.css";

/**
 * /homepagev2 copy, 10 September 2026, user direction.
 *
 * A duplicate of the live homepage component of the same name, so the two
 * can be worked on apart. What is COPIED is the markup; what is SHARED is
 * everything the markup reaches for -- the content modules, the stylesheets,
 * the motion library and the effects registry. A change to a hook name, an
 * effect, a CSS class or a content string still lands on both pages, and an
 * edit here that renames a data attribute breaks the live page silently
 * unless the effect is forked too. Diverge deliberately, and say so here
 * when you do.
 */

/**
 * Home opens — black beat / three-second gallery entrance, 9 September 2026.
 * D5: verbatim draft words. F7: media moves, then holds for the heading.
 * R11: small WebP derivatives serve both DOM fallback and canvas textures.
 * The linked Figma node differs; latest screenshot governs (scenes.md).
 */
export function HomeHero({ beat, wonder, truth, belonging }: { beat: Beat; wonder: Beat; truth: Beat; belonging: Beat }) {
  const words = beat.headline?.split(/\s+/).filter(Boolean) ?? [];
  const truthParagraphs = [[truth.sequence?.subjectDetail[0] ?? ""], ...(truth.sequence?.steps.map(step => [step.text]) ?? []), [truth.body[0] ?? ""], truth.body.slice(1)];
  return (
    <section id={beat.id} data-home-hero className="relative isolate h-svh min-h-[680px] overflow-hidden bg-charcoal lg:min-h-[760px]">
      <div aria-hidden="true" data-hero-fallback className="v2-home-hero-stage pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2">
        {homeHeroFrames.map((frame) => (
          <div key={frame.id} className="absolute overflow-hidden bg-evergreen" style={{
            left: `${frame.x}%`, top: `${frame.y}%`, width: `${frame.w}%`, aspectRatio: frame.aspect,
            transform: `translate(-50%, -50%) rotate(${frame.angle}deg)`, opacity: frame.opacity,
          }}>
            {/* Sized WebPs: share exact decoded bytes with the GPU. */}
            <Image data-hero-image={frame.id} src={frame.src} alt="" width={frame.width} height={frame.height}
              unoptimized loading="eager" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
      <HomeHeroCanvas frames={homeHeroFrames} />
      <div data-landscape-exit-shade aria-hidden="true" className="v2-home-landscape-exit-shade pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[30svh]" />
      {/* SCR-09: screenshot's opening Truth frame, sourced from the v3 sequence. */}
      <div data-home-truth className="v2-home-truth-copy absolute inset-x-6 top-[13.75%] z-[3] mx-auto max-w-[720px] text-center text-canvas">
        <p className="eyebrow text-base leading-[1.4] tracking-normal lg:text-xl">{truth.eyebrow}</p>
        <h2 className="headline mt-6 text-h1 leading-none tracking-normal">{truth.sequence?.subject}</h2>
        <div className="v2-home-truth-panels mt-6">
          {truthParagraphs.map((paragraphs, index) => (
            <div key={index} data-truth-panel={index} className="v2-home-truth-panel text-base font-medium leading-[1.5] lg:text-xl">
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
      <div data-truth-timeline className="v2-home-truth-timeline pointer-events-none absolute inset-0 z-[3] text-canvas">
        <Image src={homeTruthArtwork.path} alt="" width={1778} height={45} unoptimized className="v2-home-truth-path" />
        <div data-truth-marker className="v2-home-truth-marker">
          <div className="v2-home-truth-years">{homeTruthScenes.map((scene, index) => <p key={scene.year} data-truth-year={index} className="headline text-h1 leading-none">{scene.year}</p>)}</div>
          <Image src={homeTruthArtwork.marker} alt="" width={48} height={94} unoptimized className="v2-home-truth-marker-art" />
        </div>
      </div>
      {/* SCR-10: Figma 3371:41578 composition; D5 retains full draft wording. */}
      <div data-home-belonging className="v2-home-belonging-copy absolute inset-x-6 z-[3] text-canvas lg:left-[5.55%] lg:right-auto lg:w-[800px]">
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
      <div data-home-wonder className="v2-home-wonder-copy absolute inset-x-6 top-[25%] z-[3] max-w-[740px] text-canvas lg:left-[5.5%] lg:right-auto lg:w-[52%]">
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
      {/* 9 September screenshot: quiet opacity reveals over the same canvas. */}
      <div className="pointer-events-none absolute inset-0 z-[2] text-canvas">
        <h2 className="headline absolute left-6 right-6 top-[14%] text-h1 leading-[1.1] tracking-[-0.015em] lg:left-[3.3%] lg:right-[3.3%]">
          <span data-painting-entrance className="v2-home-painting-copy v2-painting-introduction block w-fit">{homePaintingCopy.entrance}</span>
          <span data-painting-place className="v2-home-painting-copy v2-painting-place block w-fit">{homePaintingCopy.place}</span>
        </h2>
        <p data-painting-story className="v2-home-painting-copy v2-painting-story headline absolute bottom-[7.5%] right-6 max-w-[260px] text-h3 leading-[1.15] tracking-normal text-right lg:right-[2.5%] lg:max-w-[440px]">{homePaintingCopy.story}</p>
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
      {/* Media scrim is the palette's explicit gradient exception (X5). */}
      <div data-hero-scrim aria-hidden="true" className="pointer-events-none absolute inset-0 bg-charcoal/35" />
      <div data-hero-scrim aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-t from-charcoal/70 via-transparent to-charcoal/20" />
      <div data-hero-scrim aria-hidden="true" className="v2-home-hero-edge-treatment pointer-events-none absolute inset-0" />
      <div data-hero-black aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-night-black" />
      <div data-hero-copy className="absolute inset-x-0 top-[30%] px-6 text-center lg:px-16">
        <p data-hero-quiet className="eyebrow text-sm leading-[1.4] tracking-[0.1em] text-ochre lg:text-base">{beat.eyebrow}</p>
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
