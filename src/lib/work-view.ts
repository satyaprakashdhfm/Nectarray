import type { CalendarView } from "@/components/admin/WorkCalendar";
import {
  addDays,
  daysBetween,
  quarterOf,
  shortDay,
  sprintOf,
  todayIST,
} from "@/lib/work";

/** The quarter and sprint strip, worked out for a day (today by default). */
export function calendarView(today = todayIST()): CalendarView {
  const sprint = sprintOf(today);
  const q = sprint.quarter;
  const range = (a: string, b: string) =>
    `${shortDay(a, today)} to ${shortDay(b, today)}`;
  const sprints = Array.from({ length: sprint.of }, (_, i) => {
    const start = addDays(q.start, i * 14);
    const end = i === sprint.of - 1 ? q.end : addDays(start, 13);
    return {
      n: i + 1,
      range: range(start, end),
      state:
        i + 1 < sprint.n
          ? ("past" as const)
          : i + 1 === sprint.n
            ? ("now" as const)
            : ("next" as const),
    };
  });
  return {
    quarterLabel: q.label,
    quarterRange: range(q.start, q.end),
    quarterDay: daysBetween(q.start, today) + 1,
    quarterDays: daysBetween(q.start, q.end) + 1,
    sprintLabel: `Sprint ${sprint.n}`,
    sprintRange: range(sprint.start, sprint.end),
    sprintDaysLeft: daysBetween(today, sprint.end),
    sprintDay: daysBetween(sprint.start, today) + 1,
    sprintDays: daysBetween(sprint.start, sprint.end) + 1,
    sprints,
  };
}
