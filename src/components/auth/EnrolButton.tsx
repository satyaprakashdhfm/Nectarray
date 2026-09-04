"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";
import { authEnabled } from "@/lib/supabase/client";
import { useSignedIn } from "@/lib/supabase/session";

/**
 * The single entry point into the programme.
 *
 * Three behaviours, one button:
 *
 *   not configured — an anchor to the application form, because opening a
 *                    login box with nothing behind it helps nobody
 *   signed out     — the auth modal
 *   signed in      — a link straight to the dashboard
 *
 * That last case is the one that used to be missing. A student who signed in,
 * clicked back to the marketing site and then wanted to return was shown
 * "Log in" again, as though the session had been dropped — and pressing it
 * opened a login box for an account they were already using.
 */
export function EnrolButton({
  label,
  className,
  withArrow = true,
  fallbackHref = "#enrol",
  signedInLabel = "Dashboard",
  hideWhenSignedIn = false,
}: {
  label: string;
  className: string;
  withArrow?: boolean;
  /** Where to send people while auth is unconfigured. */
  fallbackHref?: string;
  /** Shown once we know the browser holds a session. */
  signedInLabel?: string;
  /**
   * Render nothing once signed in, for a second copy of this button that
   * would otherwise say "Dashboard" alongside the header's.
   */
  hideWhenSignedIn?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const signedIn = useSignedIn();

  const inner = (text: string) => (
    <>
      {text}
      {withArrow && (
        <ArrowRight
          className="size-4 transition-transform duration-300 group-hover:translate-x-1"
          strokeWidth={2.25}
          aria-hidden
        />
      )}
    </>
  );

  if (!authEnabled) {
    return (
      <Link href={fallbackHref} className={className}>
        {inner(label)}
      </Link>
    );
  }

  if (signedIn === "in") {
    if (hideWhenSignedIn) return null;
    return (
      <Link href="/dashboard" className={className}>
        {inner(signedInLabel)}
      </Link>
    );
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {inner(label)}
      </button>
      {open && <AuthModal onClose={() => setOpen(false)} />}
    </>
  );
}
