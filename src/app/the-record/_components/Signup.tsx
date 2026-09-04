"use client";

import { useId } from "react";
import { recordGrows } from "@/content/the-record";

/**
 * 06 · the signup, to the hi-fi frame (2537:17313 … 2537:17320): a 520-wide
 * column of heading, note, label and field, with the Subscribe blob set
 * alongside the field rather than under it — not a bordered panel.
 *
 * ⚠ Not wired up, exactly as SignupField is not. The newsletter list is an
 * external service and the comms system is Phase 2; submitting prevents
 * default and nothing else, deliberately, so no address is collected before
 * there is a privacy policy to collect it under (build doc §11).
 */
export function RecordSignup() {
  const id = useId();
  const { signup } = recordGrows;

  /* The frame sets the last sentence of the note apart, small and under the
     field. Derived from the one content string rather than retyped, so the
     copy still has exactly one home (src/content/the-record.ts). */
  const sentences = signup.note.match(/[^.]+\./g) ?? [signup.note];
  const privacy = sentences.at(-1)?.trim() ?? "";
  const blurb = sentences.slice(0, -1).join(" ").trim();

  return (
    <form className="mt-48" onSubmit={(event) => event.preventDefault()} data-record-arrive>
      {/* Work Sans SemiBold 24/32 — the frame does NOT set this in the
          headline face; the section already has one headline. */}
      <h3 className="max-w-[32.5rem] text-2xl leading-8 font-semibold">
        {signup.label}
      </h3>
      <p className="mt-3 max-w-[32.5rem] text-base leading-6 text-canvas/68">
        {blurb}
      </p>

      <label
        htmlFor={id}
        className="eyebrow mt-5 block text-[0.6875rem] leading-4 tracking-[1.4px] text-canvas/55"
      >
        Email
      </label>

      {/* field 420x52 at x=100, blob 276x56 at x=548 — a 28px gutter, the
          field centred against the taller blob. */}
      <div className="mt-2 flex flex-wrap items-center gap-7">
        <input
          id={id}
          type="email"
          name="email"
          placeholder={signup.placeholder}
          className="h-13 w-105 max-w-full rounded-[4px] border border-canvas/28 bg-canvas/6 px-4 text-canvas placeholder:text-canvas/40 focus:border-ochre focus:outline-none"
        />
        {/* The blob, as a submit control rather than a link — same shape, same
            tone as BlobButton; a <button> cannot be a <Link>. */}
        <button
          type="submit"
          className="relative inline-flex h-14 w-[17.25rem] max-w-full items-center justify-center px-6 transition-transform duration-(--dur-small) ease-quiet hover:-translate-y-0.5"
        >
          <span
            aria-hidden
            className="absolute inset-0 bg-burnt"
            style={{
              maskImage: "url(/artwork/blob-button.svg)",
              WebkitMaskImage: "url(/artwork/blob-button.svg)",
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
            }}
          />
          <span className="eyebrow relative text-base tracking-[0.08em] text-canvas">
            {signup.cta}
          </span>
        </button>
      </div>

      <p className="mt-5 max-w-[32.5rem] text-[0.8125rem] leading-5 text-canvas/56">
        {privacy}
      </p>
    </form>
  );
}
