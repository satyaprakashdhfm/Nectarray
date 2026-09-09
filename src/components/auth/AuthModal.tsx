"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, X } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { useEscapeKey, useLockBodyScroll } from "@/hooks";

/**
 * Sign-in and registration.
 *
 * Google is the only way in. Handing off to Google means the name and an
 * address Google vouches for both arrive with the identity, so there is
 * nothing left for this dialog to ask: the callback creates the session and
 * lands the student on their dashboard itself.
 */
export function AuthModal({
  onClose,
  initialError = "",
}: {
  onClose: () => void;
  /** A message from a redirect — a Google sign-in that came back a failure. */
  initialError?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError);

  const dialogRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => onClose(), [onClose]);

  useLockBodyScroll(true);
  useEscapeKey(close);

  // Move focus into the dialog so keyboard and screen-reader users are not
  // left behind on the page underneath.
  useEffect(() => {
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
  }, []);

  async function signInWithGoogle() {
    setBusy(true);
    setError("");
    try {
      /*
       * A full navigation, not a router push. The route it lands on answers
       * with a redirect to Google, and the client router cannot follow a
       * cross-origin redirect out of a fetch — the browser has to make the
       * request itself.
       */
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/api/auth/google/start";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
      setBusy(false);
    }
  }

  /*
   * Portalled to <body>. The triggers sit inside sections that set
   * overflow-hidden and backdrop-blur, and either of those makes an ancestor
   * the containing block for position:fixed — which clipped the dialog to the
   * hero and left it hanging off the top of the screen.
   *
   * No mounted flag is needed: the modal only renders from a click, so it is
   * never evaluated during SSR. The guard is belt-and-braces for a stray
   * server render.
   */
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
    >
      {/* Scrim — clicking it closes, same as Escape */}
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="bg-night/60 absolute inset-0 backdrop-blur-sm"
      />

      <div
        ref={dialogRef}
        className="bg-canvas relative grid w-full max-w-4xl overflow-hidden rounded-[1.5rem] shadow-2xl md:grid-cols-[0.9fr_1.1fr]"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="text-ink-soft hover:bg-mist hover:text-ink absolute top-4 right-4 z-10 grid size-9 place-items-center rounded-full transition-colors"
        >
          <X className="size-5" strokeWidth={2} aria-hidden />
        </button>

        {/* Left panel ---------------------------------------------------- */}
        <div className="from-brand-wash to-leaf-wash relative hidden overflow-hidden bg-gradient-to-br p-10 md:block">
          <div
            className="grid-paper pointer-events-none absolute inset-0 opacity-60"
            aria-hidden
          />
          <div className="relative flex h-full flex-col">
            <Logo markClassName="size-10" wordClassName="text-[1.35rem]" />
            <div className="mt-auto">
              <p className="display text-ink text-[1.75rem] leading-tight">
                45 days.
                <br />
                <span className="ink-gradient">Five people.</span>
              </p>
              <p className="text-ink-soft mt-4 text-[0.9375rem] leading-relaxed">
                Sign in to reach your dashboard, notes, assignments and the
                practice environment.
              </p>
            </div>
          </div>
        </div>

        {/* Right panel --------------------------------------------------- */}
        <div className="flex flex-col justify-center p-8 sm:p-10">
          <h2 id="auth-title" className="display text-ink text-[1.5rem]">
            Log in or register
          </h2>
          <p className="text-ink-soft mt-2 text-[0.9375rem] leading-relaxed">
            Continue with your Google account. No password to forget.
          </p>

          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={busy}
            className="border-line bg-surface text-ink hover:border-brand mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full border px-6 py-3.5 text-[0.9375rem] font-semibold transition-colors disabled:opacity-40"
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <GoogleMark />
            )}
            {busy ? "Taking you to Google…" : "Continue with Google"}
          </button>

          <p aria-live="polite" className="sr-only">
            {error}
          </p>

          {error && (
            <p className="border-amber/30 bg-amber-wash text-amber-deep mt-5 rounded-xl border px-4 py-3 text-[0.875rem] leading-relaxed">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Google's mark, inlined — an external image would be blocked by the CSP. */
function GoogleMark() {
  return (
    <svg className="size-5" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}
