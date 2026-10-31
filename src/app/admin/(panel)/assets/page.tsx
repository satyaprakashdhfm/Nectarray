import { redirect } from "next/navigation";
import { ADMIN } from "@/lib/admin-path";
import { adminPage } from "@/lib/auth/access";

/** Assets are on the Revenue & assets dashboard now, at the bottom. */
export default async function AdminAssetsPage() {
  await adminPage();
  redirect(`${ADMIN}#assets`);
}
