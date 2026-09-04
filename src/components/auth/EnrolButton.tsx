"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";
import { authEnabled } from "@/lib/supabase/client";

/**
 * The single entry point into the programme.
 *
 * While Supabase is unconfigured there is nothing to sign in to, so this
 * degrades to an anchor down to the application form rather than opening a
 * login box that cannot work. Once the environment variables are set it
 * becomes the real modal, with no other change anywhere.
 */
export function EnrolButton({
  label,
  className,
  withArrow = true,
  fallbackHref = "#enrol",
}: {
  label: string;
  className: string;
  withArrow?: boolean;
  /** Where to send people while auth is unconfigured. */
  fallbackHref?: string;
}) {
  const [open, setOpen] = useState(false);

  const inner = (
    <>
      {label}
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
        {inner}
      </Link>
    );
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {inner}
      </button>
      {open && <AuthModal onClose={() => setOpen(false)} />}
    </>
  );
}
