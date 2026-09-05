"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Loader2, UserRound } from "lucide-react";
import { useEscapeKey } from "@/hooks";
import { createClient } from "@/lib/supabase/client";
import { displayName } from "@/lib/utils";

type Profile = {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
};

/**
 * The student's own account, from the dashboard header.
 *
 * Writes straight from the browser with the student's own session rather
 * than through a server action, because the database already draws the line
 * in the right place: `authenticated` holds UPDATE on first_name, last_name
 * and phone and on nothing else, so `role` cannot be touched from here even
 * deliberately. That grant is what makes a client-side write safe — not
 * anything this component does.
 *
 * Email is shown but not editable. It is the identity the account is keyed
 * on, and changing it is an auth flow with a confirmation step rather than a
 * text field.
 */
export function AccountMenu({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [first, setFirst] = useState(profile.first_name ?? "");
  const [last, setLast] = useState(profile.last_name ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");

  const wrap = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const close = useCallback(() => setOpen(false), []);
  useEscapeKey(close);

  // Click-away. Bound only while the panel is open, so the document is not
  // carrying a listener for the whole session.
  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const label = displayName(profile.first_name) || "Account";

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setSaved(false);

    try {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Your session expired. Sign in again.");

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          first_name: first.trim() || null,
          last_name: last.trim() || null,
          phone: phone.trim() || null,
        })
        .eq("id", auth.user.id);
      if (updateError) throw new Error(updateError.message);

      setSaved(true);
      // The header greeting and the dashboard heading are server-rendered
      // from this row, so they need re-fetching to agree with the form.
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save that.");
    } finally {
      setBusy(false);
    }
  }

  const field =
    "w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[0.875rem] text-ink transition-colors focus:border-brand focus:outline-none";
  const label_ = "mb-1.5 block text-[0.75rem] font-semibold text-ink-soft";

  return (
    <div className="relative" ref={wrap}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="border-night-line inline-flex items-center gap-2 rounded-full border py-1.5 pr-2.5 pl-1.5 text-[0.875rem] text-white/70 transition-colors hover:border-white/30 hover:text-white"
      >
        <span className="bg-brand-deep grid size-6 place-items-center rounded-full text-white">
          <UserRound className="size-3.5" strokeWidth={2.25} aria-hidden />
        </span>
        <span className="hidden max-w-[8rem] truncate sm:inline">{label}</span>
        <ChevronDown
          className={`size-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          strokeWidth={2.25}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Your account"
          className="card absolute right-0 z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] p-5"
        >
          <p className="eyebrow">Your account</p>
          <p className="text-ink-soft mt-2 text-[0.8125rem] break-all">
            {profile.email ?? "No email on file"}
          </p>

          <form onSubmit={save} className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label_} htmlFor="acct-first">
                  First name
                </label>
                <input
                  id="acct-first"
                  value={first}
                  onChange={(e) => setFirst(e.target.value)}
                  autoComplete="given-name"
                  className={field}
                />
              </div>
              <div>
                <label className={label_} htmlFor="acct-last">
                  Last name
                </label>
                <input
                  id="acct-last"
                  value={last}
                  onChange={(e) => setLast(e.target.value)}
                  autoComplete="family-name"
                  className={field}
                />
              </div>
            </div>

            <div>
              <label className={label_} htmlFor="acct-phone">
                Phone
              </label>
              <input
                id="acct-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                autoComplete="tel"
                placeholder="+91 90000 00000"
                className={field}
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="bg-ink text-cta-fg hover:bg-brand-deep inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[0.875rem] font-semibold transition-colors disabled:opacity-60"
            >
              {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
              {saved && !busy && (
                <Check className="size-4" strokeWidth={2.5} aria-hidden />
              )}
              {busy ? "Saving…" : saved ? "Saved" : "Save changes"}
            </button>
          </form>

          <p aria-live="polite" className="sr-only">
            {error || (saved ? "Saved" : "")}
          </p>

          {error && (
            <p className="border-amber/30 bg-amber-wash text-amber-deep mt-3 rounded-lg border px-3 py-2 text-[0.8125rem]">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
