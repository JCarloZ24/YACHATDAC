"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";

/**
 * Floating, hideable controls for the /lab prototypes.
 *
 * Each prototype is simulated at the full viewport — the frame it would really
 * get — so the controls cannot sit in the document flow or in a sticky bar
 * without cropping the thing being reviewed. They float over it instead, and
 * they can be put away entirely: press C, or use the button.
 *
 * Hidden/shown is remembered across the three prototype pages, so a reviewer
 * who wants a clean frame gets one for the whole session rather than dismissing
 * the panel again on every page.
 */

const STORAGE_KEY = "yachatdac:lab-controls";

/* -------------------------------------------------------------------------
   The stored preference, as an external store.

   localStorage is not readable while the page is being rendered on the server,
   so this is subscribed to rather than read into state: the first client render
   matches the server (panel shown), and a stored preference is applied straight
   after hydration. Reading it in an effect instead would be a second render
   either way, and would trip the cascading-render rule.
   ------------------------------------------------------------------------- */

const listeners = new Set<() => void>();
let hiddenCache: boolean | null = null;

function isHidden(): boolean {
  if (hiddenCache === null) {
    hiddenCache = window.localStorage.getItem(STORAGE_KEY) === "hidden";
  }
  return hiddenCache;
}

/** Panels are shown until something says otherwise — including on the server. */
function isHiddenOnServer(): boolean {
  return false;
}

function setHidden(hidden: boolean) {
  hiddenCache = hidden;
  window.localStorage.setItem(STORAGE_KEY, hidden ? "hidden" : "shown");
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // Other tabs and the other two prototype pages, if one is open beside this.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    hiddenCache = null;
    listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function LabControlPanel({
  label = "Prototype controls",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  const open = !useSyncExternalStore(subscribe, isHidden, isHiddenOnServer);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const change = useCallback((next: boolean) => setHidden(!next), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      // Never take a keystroke off something the reviewer is typing into.
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;

      if (event.key === "Escape") {
        if (!open) return;
        change(false);
        // The panel goes inert on close, so focus has to be caught before it
        // falls off the document.
        toggleRef.current?.focus();
        return;
      }

      if (event.key.toLowerCase() === "c") change(!open);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, change]);

  return (
    /* Bottom right, clear of the caption each prototype carries bottom left.
       The wrapper is pointer-transparent so only the panel and its button take
       clicks — the rest of the viewport still belongs to the prototype. */
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-end px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="flex w-[min(23rem,100%)] flex-col items-end gap-2">
        <div
          id={panelId}
          role="group"
          aria-label={label}
          /* Inert rather than merely faded: a hidden panel has to leave the
             focus order too, or tabbing lands in controls nobody can see. */
          inert={!open}
          className={`w-full rounded-sm border border-canvas/20 bg-charcoal/90 shadow-[0_24px_60px_rgba(9,14,18,0.6)] backdrop-blur-md transition-[opacity,transform] duration-(--dur-small) ease-quiet ${
            open
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "translate-y-3 opacity-0"
          }`}
        >
          <div className="flex max-h-[62svh] flex-col gap-6 overflow-y-auto p-5">
            <div>
              <p className="eyebrow text-ochre">{label}</p>
              <p className="mt-2 text-xs leading-relaxed text-canvas/50">
                Floats over the prototype so the frame stays whole. The site
                has no panel like this.
              </p>
            </div>
            {children}
          </div>
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => change(!open)}
          aria-expanded={open}
          aria-controls={panelId}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-sm border border-ochre/50 bg-charcoal/90 px-4 py-2 text-sm text-ochre backdrop-blur transition-colors duration-(--dur-small) ease-quiet hover:border-ochre hover:text-canvas"
        >
          <span
            aria-hidden="true"
            className={`inline-block transition-transform duration-(--dur-small) ease-quiet ${
              open ? "rotate-0" : "rotate-180"
            }`}
          >
            ▾
          </span>
          {open ? "Hide controls" : "Controls"}
          <kbd className="rounded-xs border border-current/40 px-1.5 py-0.5 text-[0.625rem] tracking-[0.12em]">
            C
          </kbd>
        </button>
      </div>
    </div>
  );
}
