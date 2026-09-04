"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Result = { ok: boolean; error?: string };

/**
 * Redeeming the code we hand over once payment has cleared.
 *
 * All the logic is in redeem_enrolment_code() in the database, because a
 * student is not allowed to write their own enrolment status — the browser
 * submits a string and the database decides what it means.
 */
export function RedeemCode() {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy || code.trim() === "") return;
    setBusy(true);
    setError("");

    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc(
        "redeem_enrolment_code",
        { p_code: code },
      );
      if (rpcError) throw rpcError;

      const result = data as Result;
      if (!result?.ok) {
        setError(result?.error ?? "That did not work.");
        return;
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not check that code.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="border-line bg-canvas rounded-2xl border p-6 sm:p-7"
    >
      <span className="bg-brand-wash text-brand-deep grid size-11 place-items-center rounded-xl">
        <KeyRound className="size-5" strokeWidth={1.9} aria-hidden />
      </span>

      <h3 className="text-ink mt-5 text-[1.0625rem] font-semibold">
        Have an enrolment code?
      </h3>
      <p className="text-ink-soft mt-2 text-[0.9375rem] leading-relaxed">
        We send one once your place is confirmed. Entering it opens the course
        straight away.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="enrolment-code">
          Enrolment code
        </label>
        <input
          id="enrolment-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="NECT-XXXX-XXXX"
          autoComplete="off"
          spellCheck={false}
          className="border-line bg-surface text-ink focus:border-brand w-full rounded-xl border px-4 py-3 font-mono text-[0.9375rem] tracking-wider uppercase transition-colors focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || code.trim() === ""}
          className="bg-ink hover:bg-brand-deep disabled:hover:bg-ink inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-6 py-3 text-[0.9375rem] font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {busy ? "Checking…" : "Redeem"}
        </button>
      </div>

      <p aria-live="polite" className="sr-only">
        {error}
      </p>

      {error && (
        <p className="border-amber/30 bg-amber-wash text-amber-deep mt-4 rounded-xl border px-4 py-3 text-[0.875rem]">
          {error}
        </p>
      )}
    </form>
  );
}
