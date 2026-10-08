import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminVerify } from "@/components/admin/AdminVerify";
import { Logo } from "@/components/layout/Logo";
import { ADMIN } from "@/lib/admin-path";
import { adminGate } from "@/lib/auth/access";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Check your email | NectArray",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * The second step into the panel: the code emailed to the admin who just
 * signed in with Google. Outside the panel's layout, like sign-in, because
 * the layout turns away anyone who has not done this yet.
 */
export default async function AdminVerifyPage() {
  const gate = await adminGate();
  if (!gate.user || !gate.admin) redirect(`${ADMIN}/login`);
  if (gate.verified) redirect(ADMIN);

  return (
    <div className="bg-mist grid min-h-[100dvh] place-items-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo markClassName="size-11" wordClassName="text-[1.5rem]" />
        </div>
        <div className="card p-6 text-center sm:p-10">
          <AdminVerify email={gate.user.email} loginPath={`${ADMIN}/login`} />
        </div>
      </div>
    </div>
  );
}
