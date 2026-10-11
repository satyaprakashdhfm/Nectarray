import { notFound, redirect } from "next/navigation";
import { ADMIN } from "@/lib/admin-path";
import { isId } from "@/lib/drive";

/** An old Drive link: the Drive is on the project's own page now. */
export default async function AdminProjectDrivePage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ folder?: string }>;
}) {
  const [{ projectId }, { folder }] = await Promise.all([params, searchParams]);
  if (!isId(projectId)) notFound();
  const at = isId(folder) ? `?folder=${folder}` : "";
  redirect(`${ADMIN}/projects/${projectId}${at}#drive`);
}
