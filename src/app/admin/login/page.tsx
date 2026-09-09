import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { Logo } from "@/components/layout/Logo";
import { currentUser } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/access";

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

  const user = await currentUser();
  if (user) {
    if (isAdmin(user)) redirect("/admin");
    // Signed in, but not as an admin. The usual cause is a browser still
    // holding a student session, so they get a sign-out button rather than a
    // door that silently refuses them.
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
          <AdminLogin state={state} email={email} />
        </div>
      </div>
    </div>
  );
}
