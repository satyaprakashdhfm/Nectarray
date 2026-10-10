import { ADMIN } from "@/lib/admin-path";
import Link from "next/link";
import { ChartGantt, ListChecks } from "lucide-react";
import { PageHead } from "@/components/admin/Business";
import { WorkCalendar } from "@/components/admin/WorkCalendar";
import { todayIST } from "@/lib/work";
import { calendarView } from "@/lib/work-view";
import { cn } from "@/lib/utils";
import { TaskBoard } from "./board";
import { TimelineView } from "./timeline";

export const dynamic = "force-dynamic";

const TABS = [
  { id: "board", label: "Board", icon: ListChecks, href: `${ADMIN}/tasks` },
  {
    id: "timeline",
    label: "Timeline",
    icon: ChartGantt,
    href: `${ADMIN}/tasks?tab=timeline`,
  },
] as const;

/**
 * Tasks and the timeline of what got finished, one page with two views:
 * the board for what is still to do, the timeline for what is done. The
 * sprint calendar sits above both, since both are read against it.
 */
export default async function AdminTasksPage({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string;
    view?: string;
    project?: string;
    person?: string;
  }>;
}) {
  const params = await searchParams;
  const tab = params.tab === "timeline" ? "timeline" : "board";

  return (
    <>
      <PageHead
        title="Tasks and timeline"
        lede="Work items for every client project: what needs doing, by when, and who has it, and on the timeline, what got finished and when. Anything past its due date turns red until it is done."
      />

      <nav aria-label="Tasks views" className="mt-5">
        <ul className="bg-surface border-line inline-flex max-w-full overflow-x-auto rounded-lg border p-0.5">
          {TABS.map((t) => (
            <li key={t.id}>
              <Link
                href={t.href}
                aria-current={t.id === tab ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-[0.8125rem] font-semibold whitespace-nowrap transition-colors",
                  t.id === tab
                    ? "bg-mist text-ink"
                    : "text-ink-faint hover:text-ink",
                )}
              >
                <t.icon className="size-4" strokeWidth={1.9} aria-hidden />
                {t.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-5">
        <WorkCalendar view={calendarView(todayIST())} />
      </div>

      {tab === "timeline" ? <TimelineView /> : <TaskBoard params={params} />}
    </>
  );
}
