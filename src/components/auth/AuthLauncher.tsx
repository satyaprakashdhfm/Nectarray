"use client";

import { useCallback, useState } from "react";
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

  /*
   * Open is derived, not synchronised. The URL asking for the modal is the
   * state; the only thing worth remembering separately is that this visitor
   * has already dismissed it, which stops the box reappearing for the moment
   * between the close and the router catching up with the new URL.
   */
  const [dismissed, setDismissed] = useState(false);

  const close = useCallback(() => {
    setDismissed(true);
    /*
     * Take the parameters back out, so a refresh or a shared link does not
     * reopen a box the student has already dismissed. replace, not push —
     * this should not add a step to the back button.
     */
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  if (!asked || dismissed) return null;

  return (
    <AuthModal
      onClose={close}
      initialError={reason ? (REASONS[reason] ?? REASONS.exchange) : ""}
    />
  );
}
