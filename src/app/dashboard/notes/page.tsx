import { redirect } from "next/navigation";
import { EnrolmentPanel } from "@/components/dashboard/EnrolmentGate";
import { createClient, getAccess } from "@/lib/supabase/server";

/**
 * The notes index does not exist as a page any more — it opens the first
 * lesson of the chosen course instead.
 *
 * It used to list every module and every lesson, which was the exact content
 * of the rail sitting next to it: the same twenty-three links, twice on one
 * screen, and a click that only ever led to the first one anyway. Landing on
 * the material is what a documentation site does.
 */
export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ module?: string }>;
}) {
  const { active, status } = await getAccess();
  if (!active) return <EnrolmentPanel status={status} />;

  const { module: wanted } = await searchParams;

  const supabase = await createClient();
  const { data } = await supabase
    .from("modules")
    .select("slug, position, lessons(id, position)")
    .order("position");

  const modules = (data ?? []).filter((m) => m.lessons.length > 0);
  const chosen = modules.find((m) => m.slug === wanted) ?? modules[0];
  const first = [...(chosen?.lessons ?? [])].sort(
    (a, b) => a.position - b.position,
  )[0];

  if (first) redirect(`/dashboard/notes/${first.id}`);

  return (
    <div className="card p-8 text-center">
      <p className="text-ink-soft text-[0.9375rem]">
        No notes have been published yet. They open as each day is taught.
      </p>
    </div>
  );
}
