"use client";

import Link from "next/link";
import { useId, useRef } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * The header's CONNECT button — the supplied blob asset
 * (public/brand/connect-button.svg, 31 Aug wireframe) inlined so the fill can
 * be animated. The label is baked into the asset as paths; a new label means a
 * new asset, not a text edit here.
 *
 * Hover behaviour: a gold "waterline" spreads across the blob from the point
 * the cursor entered, its edge roughened by animated turbulence so no two
 * fills look alike; on leave it recedes toward the exit point. Keyboard focus
 * runs the same fill from the centre. Reduced motion gets an instant fill —
 * the state change survives, the water does not.
 */

/** viewBox geometry of the supplied asset. */
const VB_W = 116;
const VB_H = 44;
/** Covers the whole blob from any entry point (diagonal ≈ 124). */
const COVER_R = 132;

const BLOB_D =
  "M115.893 26.3266C116.562 31.1624 114.025 34.5279 110.163 36.1087C104.465 38.4458 98.634 39.7292 92.3828 40.4006C68.8027 42.9502 45.386 44.0805 21.6501 43.9955C15.2822 43.9701 9.35015 42.5168 4.29002 38.7433C0.545535 35.9642 -0.64554 31.3664 0.319775 26.743C1.37072 21.7202 2.54623 16.9014 4.55471 12.3631C8.19799 4.12775 15.1887 -0.181136 23.5885 0.005837C43.1362 0.464771 62.3724 0.906708 81.85 2.3345C90.7169 2.98891 97.0615 3.71981 105.018 7.67174C111.635 10.9608 114.819 18.4992 115.893 26.3266Z";

const TEXT_D =
  "M27.648 27.24C24.512 27.24 22.864 25.016 22.864 21.24C22.864 17.544 24.48 15.56 27.52 15.56C29.456 15.56 30.784 16.376 31.504 17.944C31.68 18.328 31.536 18.616 31.168 18.776L30.256 19.16C29.888 19.32 29.616 19.192 29.392 18.856C28.896 18.12 28.304 17.752 27.568 17.752C26.08 17.752 25.344 18.888 25.344 21.224C25.344 23.784 26.128 25.032 27.712 25.032C28.576 25.032 29.216 24.68 29.728 23.848C29.936 23.496 30.208 23.384 30.576 23.544L31.392 23.88C31.76 24.04 31.92 24.328 31.76 24.68C31.008 26.344 29.664 27.24 27.648 27.24ZM37.6911 27.24C34.7151 27.24 33.0671 25.016 33.0671 21.24C33.0671 17.544 34.6351 15.56 37.6911 15.56C40.7311 15.56 42.3151 17.576 42.3151 21.24C42.3151 25 40.6511 27.24 37.6911 27.24ZM37.6911 25.032C39.1311 25.032 39.8351 23.72 39.8351 21.224C39.8351 18.952 39.1311 17.752 37.6911 17.752C36.2511 17.752 35.5471 18.952 35.5471 21.224C35.5471 23.72 36.2511 25.032 37.6911 25.032ZM44.9959 27C44.5959 27 44.3559 26.776 44.3559 26.36V16.44C44.3559 16.024 44.5959 15.8 44.9959 15.8H45.9879C46.3239 15.8 46.5639 15.928 46.7559 16.216L50.4359 21.912C50.5799 22.12 50.7559 22.072 50.7559 21.816V16.44C50.7559 16.024 50.9959 15.8 51.3959 15.8H52.5639C52.9639 15.8 53.2039 16.024 53.2039 16.44V26.36C53.2039 26.776 52.9639 27 52.5639 27H51.5719C51.2359 27 50.9959 26.872 50.8039 26.584L47.1239 20.888C46.9799 20.68 46.8039 20.728 46.8039 20.984V26.36C46.8039 26.776 46.5639 27 46.1639 27H44.9959ZM56.2146 27C55.8146 27 55.5746 26.776 55.5746 26.36V16.44C55.5746 16.024 55.8146 15.8 56.2146 15.8H57.2066C57.5426 15.8 57.7826 15.928 57.9746 16.216L61.6546 21.912C61.7986 22.12 61.9746 22.072 61.9746 21.816V16.44C61.9746 16.024 62.2146 15.8 62.6146 15.8H63.7826C64.1826 15.8 64.4226 16.024 64.4226 16.44V26.36C64.4226 26.776 64.1826 27 63.7826 27H62.7906C62.4546 27 62.2146 26.872 62.0226 26.584L58.3426 20.888C58.1986 20.68 58.0226 20.728 58.0226 20.984V26.36C58.0226 26.776 57.7826 27 57.3826 27H56.2146ZM67.4334 27C67.0334 27 66.7934 26.776 66.7934 26.36V16.44C66.7934 16.024 67.0334 15.8 67.4334 15.8H73.5774C73.9774 15.8 74.2174 16.024 74.2174 16.44V17.24C74.2174 17.656 73.9774 17.88 73.5774 17.88H69.5134C69.3534 17.88 69.2414 17.976 69.2414 18.152V20.104C69.2414 20.28 69.3534 20.376 69.5134 20.376H72.5534C72.9534 20.376 73.1934 20.6 73.1934 21.016V21.656C73.1934 22.072 72.9534 22.296 72.5534 22.296H69.5134C69.3534 22.296 69.2414 22.392 69.2414 22.568V24.632C69.2414 24.808 69.3534 24.904 69.5134 24.904H73.5774C73.9774 24.904 74.2174 25.128 74.2174 25.544V26.36C74.2174 26.776 73.9774 27 73.5774 27H67.4334ZM80.2261 27.24C77.0901 27.24 75.4421 25.016 75.4421 21.24C75.4421 17.544 77.0581 15.56 80.0981 15.56C82.0341 15.56 83.3621 16.376 84.0821 17.944C84.2581 18.328 84.1141 18.616 83.7461 18.776L82.8341 19.16C82.4661 19.32 82.1941 19.192 81.9701 18.856C81.4741 18.12 80.8821 17.752 80.1461 17.752C78.6581 17.752 77.9221 18.888 77.9221 21.224C77.9221 23.784 78.7061 25.032 80.2901 25.032C81.1541 25.032 81.7941 24.68 82.3061 23.848C82.5141 23.496 82.7861 23.384 83.1541 23.544L83.9701 23.88C84.3381 24.04 84.4981 24.328 84.3381 24.68C83.5861 26.344 82.2421 27.24 80.2261 27.24ZM88.5271 27C88.1271 27 87.8871 26.776 87.8871 26.36V18.248C87.8871 18.072 87.7751 17.976 87.6151 17.976H85.6631C85.2631 17.976 85.0231 17.752 85.0231 17.336V16.44C85.0231 16.024 85.2631 15.8 85.6631 15.8H92.5751C92.9751 15.8 93.2151 16.024 93.2151 16.44V17.336C93.2151 17.752 92.9751 17.976 92.5751 17.976H90.6071C90.4471 17.976 90.3351 18.072 90.3351 18.248V26.36C90.3351 26.776 90.0951 27 89.6951 27H88.5271Z";

export function ConnectButton({
  href,
  label = "Connect",
  className = "",
}: {
  href: string;
  label?: string;
  /** Rendered size of the blob. The header runs it small (9 Sep 2026). */
  className?: string;
}) {
  const uid = useId();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const rippleRef = useRef<SVGCircleElement | null>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement | null>(null);
  const shimmer = useRef<gsap.core.Tween | null>(null);
  const reduced = usePrefersReducedMotion();

  const clipId = `${uid}-clip`;
  const waterId = `${uid}-water`;

  /** Pointer position in viewBox coordinates. */
  const toLocal = (e: React.PointerEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: VB_W / 2, y: VB_H / 2 };
    return {
      x: ((e.clientX - rect.left) / rect.width) * VB_W,
      y: ((e.clientY - rect.top) / rect.height) * VB_H,
    };
  };

  const fillFrom = (x: number, y: number) => {
    const ripple = rippleRef.current;
    const turb = turbulenceRef.current;
    if (!ripple) return;
    gsap.killTweensOf(ripple);
    gsap.set(ripple, { attr: { cx: x, cy: y } });
    if (reduced) {
      gsap.set(ripple, { attr: { r: COVER_R } });
      return;
    }
    // A fresh seed per entry is what makes the pattern inconsistent —
    // the same hover never draws the same waterline twice.
    if (turb) {
      turb.setAttribute("seed", String(Math.floor(Math.random() * 1000)));
      shimmer.current?.kill();
      shimmer.current = gsap.to(turb, {
        attr: { baseFrequency: "0.035 0.16" },
        duration: 1.1,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }
    gsap.to(ripple, {
      attr: { r: COVER_R },
      duration: 0.65,
      ease: "power2.out",
    });
  };

  const drainTo = (x: number, y: number) => {
    const ripple = rippleRef.current;
    if (!ripple) return;
    gsap.killTweensOf(ripple);
    if (reduced) {
      gsap.set(ripple, { attr: { r: 0 } });
      return;
    }
    gsap.to(ripple, {
      attr: { cx: x, cy: y, r: 0 },
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        shimmer.current?.kill();
        shimmer.current = null;
      },
    });
  };

  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-block shrink-0 outline-offset-4"
      onPointerEnter={(e) => {
        const { x, y } = toLocal(e);
        fillFrom(x, y);
      }}
      onPointerLeave={(e) => {
        const { x, y } = toLocal(e);
        drainTo(x, y);
      }}
      onFocus={() => fillFrom(VB_W / 2, VB_H / 2)}
      onBlur={() => drainTo(VB_W / 2, VB_H / 2)}
    >
      <svg
        ref={svgRef}
        aria-hidden
        width={VB_W}
        height={VB_H}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        fill="none"
        className={`block ${className}`}
      >
        <defs>
          <clipPath id={clipId}>
            <path d={BLOB_D} />
          </clipPath>
          {/* The watery edge: turbulence displaces the expanding circle so it
              reads as a spill, not a radar ping. Filter region widened so the
              displaced edge is not cropped square. */}
          <filter id={waterId} x="-40%" y="-40%" width="180%" height="180%">
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.09 0.13"
              numOctaves="2"
              seed="7"
            />
            <feDisplacementMap in="SourceGraphic" scale="14" />
          </filter>
        </defs>

        {/* Base blob, as supplied. */}
        <path d={BLOB_D} fill="#F6F6EC" />

        {/* The water. */}
        <g clipPath={`url(#${clipId})`}>
          <circle
            ref={rippleRef}
            r="0"
            fill="var(--color-gold)"
            filter={`url(#${waterId})`}
          />
        </g>

        {/* CONNECT, baked into the asset. Midnight reads on cream and gold. */}
        <path d={TEXT_D} fill="#122449" />
      </svg>
    </Link>
  );
}
