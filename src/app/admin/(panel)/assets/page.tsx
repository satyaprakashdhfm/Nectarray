import { redirect } from "next/navigation";
import { ADMIN } from "@/lib/admin-path";

/** Assets are on the Revenue & assets dashboard now, at the bottom. */
export default function AdminAssetsPage() {
  redirect(`${ADMIN}#assets`);
}
