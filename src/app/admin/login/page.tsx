import { ADMIN } from "@/lib/admin-path";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { Logo } from "@/components/layout/Logo";
import { adminGate } from "@/lib/auth/access";

/*
 * Rendered per request, never at build time.
 *
 * Without this Next tries each of these during "Generating static pages" to
 * find out whether it can prerender them — which means running the query,
 * against a database the build container cannot reach on the private
 * network. It does not fail; it hangs for sixty seconds and then retries,
 * and the build went from twenty seconds to nearly two minutes. Nothing here
 * could ever be static: it is all somebody's admin panel.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin sign-in — NectArray",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Its own route, outside the admin layout, so it is reachable while signed
 * out. The layout next door refuses everyone who is not an admin, which
 * would otherwise make the sign-in page unreachable by the only people who
 * need it.
 */
const REASONS: Record<string, string> = {
  state: "That sign-in did not come back the way it left. Please try again.",
  exchange: "Google would not finish the sign-in. Please try again.",
  unverified: "Google has not verified that address.",
  denied: "Sign-in with Google was cancelled.",
};

/**
 * Where Continue with Google goes. An admin sign-in only starts when it
 * carries the panel's address (the start route checks it), so a sign-in
 * begun anywhere else cannot be steered back into the panel.
 */
const startUrl = () =>
  `/api/auth/google/start?realm=admin&gate=${encodeURIComponent(ADMIN.slice(1))}`;

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  let state: "out" | "wrong-account" = "out";
  let email: string | null = null;

  const { error } = await searchParams;

  const gate = await adminGate();
  const user = gate.user;
  if (user) {
    if (gate.admin) redirect(gate.verified ? ADMIN : `${ADMIN}/verify`);
    // Signed into the panel, but with an account that is not an admin.
    // Since the admin cookie is separate from the student one, this can no
    // longer be a browser that merely holds a student session — it is the
    // wrong Google account, so the way out is to sign this one out and try
    // the other.
    state = "wrong-account";
    email = user.email;
  }

  return (
    <div className="bg-mist grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo markClassName="size-11" wordClassName="text-[1.5rem]" />
        </div>
        <div className="card p-8 text-center sm:p-10">
          <AdminLogin
            state={state}
            email={email}
            startUrl={startUrl()}
            initialError={error ? (REASONS[error] ?? REASONS.exchange) : ""}
          />
        </div>
      </div>
    </div>
  );
}
