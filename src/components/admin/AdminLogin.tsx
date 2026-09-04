"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/**
 * The admin door. Google only, and deliberately not the student modal —
 * the two areas do not share an entry point.
 *
 * `state` is decided on the server: "out" means nobody is signed in,
 * "wrong-account" means someone is, but not an admin. The second case gets a
 * sign-out button rather than a silent failure, because the usual cause is
 * a browser still holding a student session.
 */
export function AdminLogin({
  state,
  email,
}: {
  state: "out" | "wrong-account";
  email?: string | null;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function signIn() {
    setBusy(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
        },
      });
      if (oauthError) throw oauthError;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
      setBusy(false);
    }
  }

  async function signOut() {
    setBusy(true);
    await createClient().auth.signOut();
    router.refresh();
    setBusy(false);
  }

  if (state === "wrong-account") {
    return (
      <>
        <span className="bg-amber-wash text-amber-deep mx-auto grid size-14 place-items-center rounded-full">
          <ShieldAlert className="size-7" strokeWidth={2} aria-hidden />
        </span>
        <h1 className="display text-ink mt-6 text-[1.5rem]">
          Not an admin account
        </h1>
        <p className="text-ink-soft mt-3 text-[0.9375rem] leading-relaxed">
          You are signed in as{" "}
          <span className="text-ink font-semibold">{email}</span>. Sign out and
          use the admin account.
        </p>
        <button
          type="button"
          onClick={signOut}
          disabled={busy}
          className="border-line bg-canvas text-ink hover:border-brand mt-7 inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[0.9375rem] font-semibold transition-colors disabled:opacity-50"
        >
          <LogOut className="size-4" strokeWidth={2} aria-hidden />
          {busy ? "Signing out…" : "Sign out"}
        </button>
      </>
    );
  }

  return (
    <>
      <h1 className="display text-ink text-[1.5rem]">Admin sign-in</h1>
      <p className="text-ink-soft mt-3 text-[0.9375rem] leading-relaxed">
        Restricted to the studio account. Students sign in from the main site.
      </p>

      <button
        type="button"
        onClick={signIn}
        disabled={busy}
        className="border-line bg-surface text-ink hover:border-brand mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full border px-6 py-3.5 text-[0.9375rem] font-semibold transition-colors disabled:opacity-50"
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <GoogleMark />
        )}
        Continue with Google
      </button>

      <p aria-live="polite" className="sr-only">
        {error}
      </p>
      {error && (
        <p className="border-amber/30 bg-amber-wash text-amber-deep mt-5 rounded-xl border px-4 py-3 text-[0.875rem]">
          {error}
        </p>
      )}
    </>
  );
}

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
