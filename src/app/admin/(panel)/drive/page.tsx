import { redirect } from "next/navigation";
import { ADMIN } from "@/lib/admin-path";
import { adminPage } from "@/lib/auth/access";

/** Drives live inside their projects now; the projects list links to each. */
export default async function AdminDrivesPage() {
  await adminPage();
  redirect(`${ADMIN}/development`);
}
