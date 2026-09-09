"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AuthModal } from "@/components/auth/AuthModal";

/**
 * Opens the sign-in modal because the URL asked for it.
 *
 * Two things redirect here and neither used to be heard. The middleware sends
 * a signed-out visitor from /dashboard to /academy?signin=1, meaning "ask
 * them to sign in"; the Google callback adds &error=… when the flow failed.
 * Nothing read either, so both landed the student on the marketing home page
 * with the modal shut and no explanation — a failed Google sign-in looked
 * exactly like a mis-click.
 */
const REASONS: Record<string, string> = {
  state:
    "That sign-in did not come back the way it left — it may have taken too long, or started on a different address. Please try again.",
  exchange:
    "Google would not finish the sign-in. Please try again, or use a six-digit code instead.",
  unverified:
    "Google has not verified that email address, so we cannot sign you in with it. Use the six-digit code instead.",
  denied: "Sign-in with Google was cancelled.",
};

export function AuthLauncher() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const asked = params.get("signin") === "1";
  const reason = params.get("error");

  const [open, setOpen] = useState(asked);

  useEffect(() => {
    if (asked) setOpen(true);
  }, [asked]);

  const close = useCallback(() => {
    setOpen(false);
    /*
     * Take the parameters back out, so a refresh or a shared link does not
     * reopen a box the student has already dismissed. replace, not push —
     * this should not add a step to the back button.
     */
    if (asked || reason) router.replace(pathname, { scroll: false });
  }, [asked, reason, router, pathname]);

  if (!open) return null;

  return (
    <AuthModal
      onClose={close}
      initialError={reason ? (REASONS[reason] ?? REASONS.exchange) : ""}
    />
  );
}
