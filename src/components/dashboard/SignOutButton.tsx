"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function signOut() {
    setBusy(true);
    await createClient().auth.signOut();
    router.push("/academy");
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
