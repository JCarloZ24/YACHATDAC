"use client";

import { useId } from "react";

/**
 * Minimal underline-style input with a text-only arrow CTA (build doc §5).
 *
 * ⚠ Not wired up. The newsletter list is an external service and the
 * email/comms system is Phase 2, built from the ImHereTravels reference
 * (build doc §10). Submitting currently does nothing but prevent default —
 * deliberately, so no address is silently collected before there is a privacy
 * policy in place (§11: legal pages must exist before any form goes live).
 */
export function SignupField({
  label,
  placeholder,
  cta,
  note,
}: {
  label: string;
  placeholder: string;
  cta: string;
  note: string;
}) {
  const id = useId();

  return (
    <form
      className="max-w-md space-y-3"
      onSubmit={(event) => event.preventDefault()}
    >
      <label htmlFor={id} className="eyebrow block text-canvas/70">
        {label}
      </label>

      <div className="flex items-center gap-4 border-b border-canvas/30 pb-2 focus-within:border-ochre">
        <input
          id={id}
          type="email"
          name="email"
          placeholder={placeholder}
          className="w-full bg-transparent text-canvas placeholder:text-canvas/40 focus:outline-none"
        />
        <button
          type="submit"
          className="eyebrow shrink-0 text-ochre transition-transform duration-300 hover:translate-x-1"
        >
          {cta} &rarr;
        </button>
      </div>

      <p className="text-xs text-canvas/50">{note}</p>
    </form>
  );
}
