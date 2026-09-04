import { Suspense } from "react";
import { NotesRail, type RailModule } from "@/components/dashboard/NotesRail";
import { createClient, getViewer } from "@/lib/supabase/server";

/**
 * The documentation shell: rail on the left, content beside it.
 *
 * The rail is fetched once here rather than in each page, so switching
 * lessons re-renders only the article — the rail keeps its scroll position
 * instead of jumping back to the top on every navigation.
 */
export default async function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { enrolment } = await getViewer();
  const status = enrolment?.status ?? "none";

  // Not enrolled: the page itself renders the gate, and a rail listing
  // lessons they cannot open would only be a menu of locked doors.
  if (status !== "enrolled" && status !== "completed") {
    return <div className="shell py-8 lg:py-10">{children}</div>;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("modules")
    .select(
      "id, slug, title, position, lessons(id, day_label, title, position)",
    )
    .order("position");

  const modules = ((data ?? []) as RailModule[]).map((module) => ({
    ...module,
    lessons: [...module.lessons].sort((a, b) => a.position - b.position),
  }));

  return (
    <div className="shell grid gap-8 py-8 lg:grid-cols-[17rem_1fr] lg:gap-10 lg:py-10">
      <Suspense fallback={<div />}>
        <NotesRail modules={modules} />
      </Suspense>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
