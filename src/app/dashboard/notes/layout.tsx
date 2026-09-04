import { Suspense } from "react";
import { headers } from "next/headers";
import { NotesRail, type RailModule } from "@/components/dashboard/NotesRail";
import { getLesson, lessonIdFromPath } from "@/lib/lessons";
import { createClient, getAccess } from "@/lib/supabase/server";
import { tocEntries } from "@/lib/toc";

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
  const [{ data }, headerList] = await Promise.all([
    supabase
      .from("modules")
      .select(
        "id, slug, title, position, lessons(id, day_label, title, position)",
      )
      .order("position"),
    headers(),
  ]);

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

  // A layout cannot see its child's params, so the open lesson comes from the
  // path header the middleware forwards. The fetch is shared with the page.
  const lessonId = lessonIdFromPath(headerList.get("x-pathname"));
  const lesson = lessonId ? await getLesson(lessonId) : null;
  const toc = lesson?.body_md ? tocEntries(lesson.body_md) : [];

  return (
    <div className="mx-auto grid w-full max-w-[110rem] gap-8 px-5 py-8 md:px-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12 lg:py-10 xl:px-10">
      <Suspense fallback={<div />}>
        <NotesRail modules={modules} toc={toc} />
      </Suspense>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
