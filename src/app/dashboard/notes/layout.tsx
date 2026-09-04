import { Suspense } from "react";
import { NotesRail, type RailModule } from "@/components/dashboard/NotesRail";
import { createClient, getAccess } from "@/lib/supabase/server";

/**
 * Short tab labels. The full module title is the heading above the lesson
 * list; a tab has room for a word.
 */
const SHORT: Record<string, string> = {
  python: "Python",
  sql: "SQL",
  "agentic-ai": "Agentic AI",
  placement: "Placement",
};

/**
 * The documentation shell: one rail on the left, the article beside it.
 *
 * The rail is fetched here rather than in each page, so switching lessons
 * re-renders only the article — the rail keeps its scroll position instead
 * of jumping back to the top on every navigation.
 *
 * The contents of the open lesson are deliberately *not* worked out here.
 * A layout is not re-rendered when you move between sibling routes, so
 * anything derived from the current path is frozen at whichever lesson you
 * opened first — which is exactly how the rail came to list Day 1's sections
 * underneath Day 7. The lesson page publishes them instead.
 */
export default async function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { active } = await getAccess();

  // Not enrolled: the page itself renders the gate, and a rail listing
  // lessons they cannot open would only be a menu of locked doors.
  if (!active) {
    return <div className="shell py-8 lg:py-10">{children}</div>;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("modules")
    .select("id, slug, title, position, lessons(id, title, position)")
    .order("position");

  /*
   * Modules with nothing published are dropped rather than shown empty.
   * "Placement Readiness" had no lessons and no short label, so it fell
   * through to the tab bar's else-branch and rendered a *second* tab reading
   * "SQL" — three tabs, two of them claiming to be the same course.
   */
  const modules: RailModule[] = ((data ?? []) as RailModule[])
    .filter((module) => module.lessons.length > 0)
    .map((module) => ({
      ...module,
      short: SHORT[module.slug] ?? module.title.split(" ")[0],
      lessons: [...module.lessons].sort((a, b) => a.position - b.position),
    }));

  return (
    <div className="mx-auto grid w-full max-w-[110rem] gap-8 px-5 py-8 md:px-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12 lg:py-10 xl:px-10">
      <Suspense fallback={<div />}>
        <NotesRail modules={modules} />
      </Suspense>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
