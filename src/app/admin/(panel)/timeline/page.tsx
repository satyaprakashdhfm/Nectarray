import { ADMIN } from "@/lib/admin-path";
import { redirect } from "next/navigation";

/** The timeline is now a view on the Tasks page; old links land there. */
export default function AdminTimelinePage() {
  redirect(`${ADMIN}/tasks?tab=timeline`);
}
