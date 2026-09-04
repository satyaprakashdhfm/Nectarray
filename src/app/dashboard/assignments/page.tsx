import { EnrolmentGate } from "@/components/dashboard/EnrolmentGate";
import { getViewer } from "@/lib/supabase/server";

export default async function AssignmentsPage() {
  const { enrolment } = await getViewer();
  const status = enrolment?.status ?? "none";
  if (status !== "enrolled" && status !== "completed") {
    return <EnrolmentGate status={status} />;
  }

  return (
    <>
      <h1 className="display text-ink text-[1.875rem] sm:text-[2.25rem]">
        Assignments
      </h1>
      <p className="text-ink-soft mt-3 text-[0.9375rem]">
        Submit your solution and get it back scored out of ten — on whether it
        is correct, whether it reads well, and whether it would survive review.
      </p>

      <div className="card mt-8 p-8 text-center">
        <p className="text-ink-soft text-[0.9375rem]">
          No assignments published yet. They appear here as each day is taught.
        </p>
      </div>
    </>
  );
}
