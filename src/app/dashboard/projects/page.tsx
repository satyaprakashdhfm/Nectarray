import { EnrolmentPanel } from "@/components/dashboard/EnrolmentGate";
import { ProjectsList } from "@/components/dashboard/ProjectsList";
import { getAccess } from "@/lib/auth/access";

/**
 * Projects now live inside Assignments, as a fourth track alongside Python,
 * SQL and Agentic — one place for everything a student is asked to build or
 * solve, rather than a fifth top-level tab for one fifth of it.
 *
 * This route is kept, rendering the same list, because a bookmark or a link
 * out on the internet still points here and a 404 is a worse answer than
 * "the page moved, here it is anyway."
 */
export default async function ProjectsPage() {
  const { user, active, status } = await getAccess();
  if (!active) {
    return (
      <div className="shell py-8 lg:py-10">
        <EnrolmentPanel status={status} />
      </div>
    );
  }

  return <ProjectsList userId={user?.id ?? null} />;
}
