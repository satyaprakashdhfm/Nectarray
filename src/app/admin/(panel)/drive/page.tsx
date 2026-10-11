import { redirect } from "next/navigation";
import { ADMIN } from "@/lib/admin-path";

/** Drives live inside their projects now; the projects list links to each. */
export default function AdminDrivesPage() {
  redirect(`${ADMIN}/development`);
}
