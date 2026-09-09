import Image from "next/image";
import { HOME_LOADER_ARTWORK } from "@/content/kit";
import { recordPortalCopy } from "@/content/the-record";

/** SYS-02, user direction 2026-09-09: the homepage's supplied artwork
 * covers The Record until actual assets and the first canvas frame are ready.
 * Server-rendered outside the stage's stacking context to cover navigation. */
export function RecordLoadingCover() {
  return (
    <div
      data-record-loader
      data-lenis-prevent
      role="progressbar"
      aria-label={recordPortalCopy.loading}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      className="fixed inset-0 z-[100] overflow-hidden bg-night-black text-gold motion-reduce:hidden"
    >
      <noscript><style>{"[data-record-loader]{display:none!important}"}</style></noscript>
      <div data-loader-art className="absolute inset-x-0 top-1/2 -translate-y-1/2">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-64 top-1/2 h-[32rem] w-[32rem] -translate-y-1/2 bg-canvas lg:-left-80 lg:h-[40rem] lg:w-[40rem]"
          style={{ maskImage: `url(${HOME_LOADER_ARTWORK.ring})`, maskSize: "contain", maskRepeat: "no-repeat" }}
        />
        <div aria-hidden="true" className="relative mx-6 lg:mx-20">
          <Image
            src={HOME_LOADER_ARTWORK.wave}
            alt=""
            width={823.37}
            height={93.25}
            className="block h-auto w-full opacity-10"
          />
          <div data-loader-wave className="absolute inset-0 [clip-path:inset(0_100%_0_0)]">
            <Image
              src={HOME_LOADER_ARTWORK.wave}
              alt=""
              width={823.37}
              height={93.25}
              className="block h-auto w-full"
            />
          </div>
        </div>
        <p aria-hidden="true" className="absolute inset-x-0 top-full mt-10 text-center text-sm tabular-nums leading-none tracking-[0.08em] lg:mt-14 lg:text-base">
          <span data-loader-count>0</span><span className="ml-1">%</span>
        </p>
      </div>
    </div>
  );
}
