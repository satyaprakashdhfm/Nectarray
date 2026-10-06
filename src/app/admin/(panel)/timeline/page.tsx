import { PageHead } from "@/components/admin/Business";
import {
  TimelineCharts,
  type GanttRow,
  type HeatDay,
  type MonthBar,
  type FeedEvent,
} from "@/components/admin/TimelineCharts";
import { WorkCalendar } from "@/components/admin/WorkCalendar";
import { serviceLabel } from "@/lib/business";
import {
  addDays,
  daysBetween,
  quarterOf,
  shortDay,
  todayIST,
} from "@/lib/work";
import { loadTimelineProjects, loadWorkItems } from "@/lib/work-data";
import { calendarView } from "@/lib/work-view";

export const dynamic = "force-dynamic";

const MONTHS = 12;
const WEEKS = 26;

/**
 * What got finished, and when: projects delivered and tasks done by month,
 * a day-by-day map of the last six months, and every project laid out
 * across the quarters it ran in. Admin-only.
 */
export default async function AdminTimelinePage() {
  const [projects, items] = await Promise.all([
    loadTimelineProjects(),
    loadWorkItems(),
  ]);
  const today = todayIST();
  const dayOf = (d: Date) => todayIST(d.getTime());

  const doneTasks = items
    .filter((i) => i.status === "done" && i.doneAt)
    .map((i) => ({ ...i, on: dayOf(i.doneAt as Date) }));
  const delivered = projects.filter(
    (p) => p.status === "delivered" && p.deliveredOn,
  );

  /* By month, the last twelve including this one. */
  const months: MonthBar[] = Array.from({ length: MONTHS }, (_, i) => {
    const d = new Date(`${today.slice(0, 7)}-01T00:00:00Z`);
    d.setUTCMonth(d.getUTCMonth() - (MONTHS - 1 - i));
    const key = d.toISOString().slice(0, 7);
    const projectsIn = delivered.filter((p) => p.deliveredOn!.startsWith(key));
    const tasksIn = doneTasks.filter((t) => t.on.startsWith(key));
    return {
      key,
      label: d.toLocaleDateString("en-IN", { month: "short", timeZone: "UTC" }),
      long: d.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }),
      projects: projectsIn.length,
      tasks: tasksIn.length,
      projectNames: projectsIn.map((p) => p.title).slice(0, 4),
    };
  });

  /* By day: whole weeks, Monday first, ending this week. */
  const weekday = (new Date(`${today}T00:00:00Z`).getUTCDay() + 6) % 7;
  const first = addDays(today, -weekday - (WEEKS - 1) * 7);
  const days: HeatDay[] = Array.from({ length: WEEKS * 7 }, (_, i) => {
    const date = addDays(first, i);
    const tasks = doneTasks.filter((t) => t.on === date);
    const shipped = delivered.filter((p) => p.deliveredOn === date);
    return {
      date,
      label: shortDay(date, today),
      future: date > today,
      count: tasks.length + shipped.length,
      names: [
        ...shipped.map((p) => `Delivered: ${p.title}`),
        ...tasks.map((t) => t.title),
      ].slice(0, 4),
    };
  });

  /* The project timeline: the current quarter and the three before it. */
  const current = quarterOf(today);
  let from = current.start;
  for (let k = 0; k < 3; k++) from = quarterOf(addDays(from, -1)).start;
  const to = current.end;
  const quarters: { label: string; start: string; end: string }[] = [];
  for (let s = from; s <= to; s = addDays(quarterOf(s).end, 1)) {
    const q = quarterOf(s);
    quarters.push({ label: q.label, start: q.start, end: q.end });
  }

  const rows: GanttRow[] = projects
    .map((p) => {
      const start = p.startsOn ?? dayOf(p.createdAt);
      const isDone = p.status === "delivered";
      const end = isDone ? (p.deliveredOn ?? p.dueOn ?? start) : today;
      const late = !isDone && !!p.dueOn && p.dueOn < today;
      return {
        id: p.id,
        title: p.title,
        client: p.client,
        service: p.service,
        serviceLabel: serviceLabel(p.service),
        status: p.status,
        start,
        end: end < start ? start : end,
        due: p.dueOn,
        done: isDone,
        late,
        days: Math.max(1, daysBetween(start, end) + 1),
        startLabel: shortDay(start, today),
        endLabel: shortDay(end, today),
        dueLabel: p.dueOn ? shortDay(p.dueOn, today) : null,
      };
    })
    .filter((r) => r.end >= from && r.start <= to)
    .sort((a, b) => a.start.localeCompare(b.start));

  /* The latest things finished, newest first. */
  const feed: FeedEvent[] = [
    ...delivered.map((p) => ({
      kind: "project" as const,
      date: p.deliveredOn!,
      title: p.title,
      meta: `${p.client} · ${serviceLabel(p.service)}`,
    })),
    ...doneTasks.map((t) => ({
      kind: "task" as const,
      date: t.on,
      title: t.title,
      meta:
        [t.projectTitle, t.assignee].filter(Boolean).join(" · ") || "Internal",
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 14)
    .map((e) => ({ ...e, label: shortDay(e.date, today) }));

  /* This quarter, in four numbers. */
  const inQuarter = (d: string) => d >= current.start && d <= current.end;
  const qProjects = delivered.filter((p) => inQuarter(p.deliveredOn!)).length;
  const qTasks = doneTasks.filter((t) => inQuarter(t.on));
  const dated = qTasks.filter((t) => t.dueOn);
  const onTime = dated.filter((t) => t.on <= (t.dueOn as string)).length;
  const spans = delivered
    .filter((p) => inQuarter(p.deliveredOn!))
    .map((p) => daysBetween(p.startsOn ?? dayOf(p.createdAt), p.deliveredOn!));

  return (
    <>
      <PageHead
        title="Timeline"
        lede="What got finished, and when. Projects count on the day they were marked delivered; tasks on the day they were marked done."
      />
      <WorkCalendar view={calendarView(today)} />
      <TimelineCharts
        quarterLabel={current.label}
        summary={{
          projects: qProjects,
          tasks: qTasks.length,
          onTime: dated.length
            ? Math.round((onTime / dated.length) * 100)
            : null,
          avgDays: spans.length
            ? Math.round(spans.reduce((a, b) => a + b, 0) / spans.length)
            : null,
        }}
        months={months}
        days={days}
        gantt={{
          from,
          to,
          today,
          todayLabel: shortDay(today, today),
          span: daysBetween(from, to) + 1,
          quarters,
          rows,
        }}
        feed={feed}
      />
    </>
  );
}
