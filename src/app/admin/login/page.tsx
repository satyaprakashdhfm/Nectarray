import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { Logo } from "@/components/layout/Logo";
import { isAllowedAdminEmail } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { authEnabled } from "@/lib/supabase/config";

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
export default async function AdminLoginPage() {
  let state: "out" | "wrong-account" = "out";
  let email: string | null = null;

  if (authEnabled) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: isAdmin } = await supabase.rpc("is_admin");
      if (isAdmin && isAllowedAdminEmail(user.email)) redirect("/admin");
      state = "wrong-account";
      email = user.email ?? null;
    }
  }

  return (
    <div className="bg-mist grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo markClassName="size-11" wordClassName="text-[1.5rem]" />
        </div>
        <div className="card p-8 text-center sm:p-10">
          <AdminLogin state={state} email={email} />
        </div>
      </div>
    </div>
  );
}
