"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { useEscapeKey, useLockBodyScroll } from "@/hooks";
import { createClient } from "@/lib/supabase/client";

/**
 * Sign-in and registration, in the three states the flow actually has:
 *
 *   email   — ask for an address, send a six-digit code (or hand off to Google)
 *   code    — verify the code, which is what creates the session
 *   profile — collect the details Google/OTP does not give us, once signed in
 *
 * A returning student whose profile is already complete never sees the third
 * state; the modal closes as soon as the session exists.
 */
type Stage = "email" | "code" | "profile" | "done";

export function AuthModal({ onClose }: { onClose: () => void }) {
  const [stage, setStage] = useState<Stage>("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);

  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => onClose(), [onClose]);

  useLockBodyScroll(true);
  useEscapeKey(close);

  // Move focus into the dialog so keyboard and screen-reader users are not
  // left behind on the page underneath.
  useEffect(() => {
    dialogRef.current?.querySelector<HTMLElement>("input")?.focus();
  }, [stage]);

  async function sendCode(event: React.FormEvent) {
    event.preventDefault();
    if (busy || email.trim() === "") return;
    setBusy(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: true },
      });
      if (otpError) throw otpError;
      setStage("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the code.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(event: React.FormEvent) {
    event.preventDefault();
    if (busy || code.trim().length < 6) return;
    setBusy(true);
    setError("");
    try {
      const supabase = createClient();
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code.trim(),
        type: "email",
      });
      if (verifyError) throw verifyError;

      // A returning student already has a name on file — skip straight past
      // the profile step rather than asking again every sign-in.
      const meta = data.user?.user_metadata ?? {};
      if (meta.first_name) {
        setStage("done");
        router.push("/dashboard");
        router.refresh();
        return;
      }
      setStage("profile");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "That code was not accepted.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    if (busy || !agreed || firstName.trim() === "" || phone.trim() === "")
      return;
    setBusy(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim(),
        },
      });
      if (updateError) throw updateError;
      setStage("done");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save that.");
    } finally {
      setBusy(false);
    }
  }

  async function signInWithGoogle() {
    setBusy(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (oauthError) throw oauthError;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
      setBusy(false);
    }
  }

  const field =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-[0.9375rem] text-ink transition-colors focus:border-brand focus:outline-none";
  const label = "mb-2 block text-[0.8125rem] font-semibold text-ink";
  const primary =
    "w-full rounded-full bg-ink px-6 py-3.5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink inline-flex items-center justify-center gap-2";

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

        {/* Right panel — the form ---------------------------------------- */}
        <div className="p-8 sm:p-10">
          {stage === "email" && (
            <form onSubmit={sendCode}>
              <h2 id="auth-title" className="display text-ink text-[1.5rem]">
                Log in or register
              </h2>
              <p className="text-ink-soft mt-2 text-[0.9375rem]">
                We will email you a six-digit code. No password to forget.
              </p>

              <div className="mt-7">
                <label className={label} htmlFor="auth-email">
                  Email
                </label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={field}
                />
              </div>

              <button
                type="submit"
                disabled={busy || email.trim() === ""}
                className={`${primary} mt-6`}
              >
                {busy && (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                )}
                {busy ? "Sending…" : "Send code"}
              </button>

              <div className="my-6 flex items-center gap-4">
                <span className="bg-line h-px flex-1" aria-hidden />
                <span className="text-ink-faint text-[0.8125rem]">or</span>
                <span className="bg-line h-px flex-1" aria-hidden />
              </div>

              <button
                type="button"
                onClick={signInWithGoogle}
                disabled={busy}
                className="border-line bg-surface text-ink hover:border-brand inline-flex w-full items-center justify-center gap-3 rounded-full border px-6 py-3.5 text-[0.9375rem] font-semibold transition-colors disabled:opacity-40"
              >
                <GoogleMark />
                Continue with Google
              </button>
            </form>
          )}

          {stage === "code" && (
            <form onSubmit={verifyCode}>
              <h2 id="auth-title" className="display text-ink text-[1.5rem]">
                Check your email
              </h2>
              <p className="text-ink-soft mt-2 text-[0.9375rem] leading-relaxed">
                We sent a six-digit code to{" "}
                <span className="text-ink font-semibold">{email}</span>.
              </p>

              <div className="mt-7">
                <label className={label} htmlFor="auth-code">
                  Verification code
                </label>
                <input
                  id="auth-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  className={`${field} text-center font-mono text-[1.5rem] tracking-[0.5em]`}
                />
              </div>

              <button
                type="submit"
                disabled={busy || code.length < 6}
                className={`${primary} mt-6`}
              >
                {busy && (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                )}
                {busy ? "Verifying…" : "Verify and continue"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStage("email");
                  setCode("");
                  setError("");
                }}
                className="text-ink-soft hover:text-ink mt-4 w-full text-[0.875rem] transition-colors"
              >
                Use a different email
              </button>
            </form>
          )}

          {stage === "profile" && (
            <form onSubmit={saveProfile}>
              <h2 id="auth-title" className="display text-ink text-[1.5rem]">
                Account verification
              </h2>
              <p className="text-ink-soft mt-2 text-[0.9375rem]">
                Last step — who are we talking to?
              </p>

              <div className="mt-7 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={label} htmlFor="auth-first">
                      First name
                    </label>
                    <input
                      id="auth-first"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                      className={field}
                    />
                  </div>
                  <div>
                    <label className={label} htmlFor="auth-last">
                      Last name
                    </label>
                    <input
                      id="auth-last"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete="family-name"
                      className={field}
                    />
                  </div>
                </div>

                <div>
                  <label className={label} htmlFor="auth-phone">
                    Phone
                  </label>
                  <input
                    id="auth-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                    className={field}
                  />
                </div>

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="accent-brand-deep mt-0.5 size-4 shrink-0"
                  />
                  <span className="text-ink-soft text-[0.875rem] leading-relaxed">
                    I agree to the terms and to being contacted about my
                    application.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={
                  busy ||
                  !agreed ||
                  firstName.trim() === "" ||
                  phone.trim() === ""
                }
                className={`${primary} mt-7`}
              >
                {busy && (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                )}
                {busy ? "Saving…" : "Finish"}
              </button>
            </form>
          )}

          {stage === "done" && (
            <div className="flex min-h-[18rem] flex-col items-center justify-center text-center">
              <span className="bg-leaf-wash text-leaf-deep grid size-14 place-items-center rounded-full">
                <Check className="size-7" strokeWidth={2.5} aria-hidden />
              </span>
              <p className="text-ink mt-5 text-[1.0625rem] font-semibold">
                Signed in. Taking you to your dashboard…
              </p>
            </div>
          )}

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
