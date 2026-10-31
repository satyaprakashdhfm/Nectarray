import { ADMIN } from "@/lib/admin-path";
import { redirect } from "next/navigation";
import { adminPage } from "@/lib/auth/access";

/** The timeline is now a view on the Tasks page; old links land there. */
export default async function AdminTimelinePage() {
  await adminPage();
  redirect(`${ADMIN}/tasks?tab=timeline`);
}
