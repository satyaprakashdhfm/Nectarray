"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

/**
 * Signs out of one realm.
 *
 * The panel and the dashboard hold separate sessions, so this has to say
 * which — signing out of the panel should not also end the student session
 * being used in the next tab to check what a student sees.
 */
export function SignOutButton({
  redirectTo = "/academy",
  realm = "student",
}: {
  redirectTo?: string;
  realm?: "student" | "admin";
} = {}) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function signOut() {
    setBusy(true);
    await fetch(`/api/auth/signout?realm=${realm}`, { method: "POST" });
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={busy}
      className="border-night-line inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.875rem] font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white disabled:opacity-50"
    >
      <LogOut className="size-4" strokeWidth={1.9} aria-hidden />
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
