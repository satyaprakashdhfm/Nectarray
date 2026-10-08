"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MailCheck } from "lucide-react";
import {
  sendCode,
  verifyCode,
  type SendState,
  type VerifyState,
} from "@/app/admin/verify/actions";

/**
 * Enter the code from the email. The first code goes out by itself when the
 * page opens; after that, Send a new code, at most once a minute.
 */
export function AdminVerify({
  email,
  loginPath,
}: {
  email: string;
  loginPath: string;
}) {
  const router = useRouter();
  const [send, setSend] = useState<SendState | null>(null);
  const [sending, setSending] = useState(false);
  const [wait, setWait] = useState(0);
  const [state, submit, checking] = useActionState<VerifyState, FormData>(
    verifyCode,
    {},
  );
  const asked = useRef(false);

  async function request() {
    setSending(true);
    const result = await sendCode();
    setSending(false);
    setSend(result);
    setWait(result.waitSeconds ?? (result.sent ? 60 : 0));
  }

  useEffect(() => {
    // Once per visit. A reload inside the minute is told the code already went.
    if (asked.current) return;
    asked.current = true;
    void request();
  }, []);

  useEffect(() => {
    if (wait <= 0) return;
    const timer = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(timer);
  }, [wait]);

  const message = state.error ?? (send?.sent ? null : send?.error);

  return (
    <>
      <span className="bg-brand-wash text-brand-deep mx-auto grid size-14 place-items-center rounded-full">
        <MailCheck className="size-7" strokeWidth={2} aria-hidden />
      </span>
      <h1 className="display text-ink mt-6 text-[1.5rem]">Check your email</h1>
      <p className="text-ink-soft mt-3 text-[0.9375rem] leading-relaxed">
        {sending && !send
          ? "Sending a sign-in code to "
          : "A six-digit code goes to "}
        <span className="text-ink font-semibold break-all">{email}</span>. Enter
        it to open the panel. You will be asked again after 5 hours.
      </p>

      <form action={submit} className="mt-7 space-y-3 text-left">
        <label
          htmlFor="code"
          className="text-ink-faint block text-[0.75rem] font-semibold"
        >
          Code from the email
        </label>
        <input
          id="code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9 ]*"
          maxLength={7}
          required
          autoFocus
          className="border-line bg-surface text-ink focus:border-brand w-full rounded-xl border px-4 py-3 text-center font-mono text-[1.5rem] tracking-[0.4em] focus:outline-none"
        />
        <button
          type="submit"
          disabled={checking}
          className="bg-ink text-cta-fg hover:bg-brand-deep inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[0.9375rem] font-semibold transition-colors active:scale-[0.99] disabled:opacity-50"
        >
          {checking && <Loader2 className="size-4 animate-spin" aria-hidden />}
          Open the panel
        </button>
      </form>

      <p aria-live="polite" className="sr-only">
        {message}
      </p>
      {message && (
        <p className="border-amber/30 bg-amber-wash text-amber-deep mt-5 rounded-xl border px-4 py-3 text-[0.875rem]">
          {message}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.875rem]">
        <button
          type="button"
          onClick={() => void request()}
          disabled={sending || wait > 0}
          className="text-brand-deep font-semibold hover:underline disabled:no-underline disabled:opacity-50"
        >
          {wait > 0 ? `Send a new code in ${wait}s` : "Send a new code"}
        </button>
        <button
          type="button"
          onClick={async () => {
            await fetch("/api/auth/signout?realm=admin", { method: "POST" });
            router.replace(loginPath);
          }}
          className="text-ink-faint hover:text-ink font-semibold"
        >
          Use another account
        </button>
      </div>
    </>
  );
}
