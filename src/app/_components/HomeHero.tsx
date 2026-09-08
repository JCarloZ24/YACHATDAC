import Image from "next/image";
import { HomeHeroCanvas } from "./HomeHeroCanvas";
import { homeHeroFrames } from "@/content/homepage-media";
import { homeHero, homePaintingCopy, type Beat } from "@/content/homepage";
import "./home-hero.css";

/**
 * Home opens — black beat / three-second gallery entrance, 9 September 2026.
 * D5: verbatim draft words. F7: media moves, then holds for the heading.
 * R11: small WebP derivatives serve both DOM fallback and canvas textures.
 * The linked Figma node differs; latest screenshot governs (scenes.md).
 */
export function HomeHero({ beat, wonder }: { beat: Beat; wonder: Beat }) {
  const words = beat.headline?.split(/\s+/).filter(Boolean) ?? [];
  return (
    <section id={beat.id} data-home-hero className="relative isolate h-svh min-h-[680px] overflow-hidden bg-charcoal lg:min-h-[760px]">
      <div aria-hidden="true" data-hero-fallback className="home-hero-stage pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2">
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
      {/* 9 September screenshot: quiet opacity reveals over the same canvas. */}
      <div className="pointer-events-none absolute inset-0 z-[2] text-canvas">
        <h2 className="headline absolute left-6 right-6 top-[14%] text-h1 leading-[1.1] tracking-[-0.015em] lg:left-[3.3%] lg:right-[3.3%]">
          <span data-painting-entrance className="home-painting-copy painting-introduction block w-fit">{homePaintingCopy.entrance}</span>
          <span data-painting-place className="home-painting-copy painting-place block w-fit">{homePaintingCopy.place}</span>
        </h2>
        <p data-painting-story className="home-painting-copy painting-story headline absolute bottom-[7.5%] right-6 max-w-[260px] text-h3 leading-[1.15] tracking-normal text-right lg:right-[2.5%] lg:max-w-[440px]">{homePaintingCopy.story}</p>
      </div>
      {/* Media scrim is the palette's explicit gradient exception (X5). */}
      <div data-hero-scrim aria-hidden="true" className="pointer-events-none absolute inset-0 bg-charcoal/35" />
      <div data-hero-scrim aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-t from-charcoal/70 via-transparent to-charcoal/20" />
      <div data-hero-scrim aria-hidden="true" className="home-hero-edge-treatment pointer-events-none absolute inset-0" />
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
