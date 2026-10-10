import { ADMIN } from "@/lib/admin-path";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  createWorkItem,
  deleteWorkItem,
  setWorkItemStatus,
  updateWorkItem,
} from "@/app/admin/(panel)/work-actions";
import {
  Empty,
  Section,
  deleteButton,
  field,
  primaryButton,
  quietButton,
} from "@/components/admin/Business";
import { serviceLabel } from "@/lib/business";
import {
  PRIORITIES,
  WORK_STATUSES,
  addDays,
  dueState,
  dueText,
  nextSprint,
  shortDay,
  sprintOf,
  todayIST,
  type DueState,
} from "@/lib/work";
import {
  loadProjectOptions,
  loadWorkItems,
  type ProjectOption,
  type WorkRow,
} from "@/lib/work-data";
import { cn } from "@/lib/utils";

const VIEWS = [
  { id: "sprint", label: "This sprint" },
  { id: "next", label: "Next sprint" },
  { id: "quarter", label: "This quarter" },
  { id: "all", label: "Everything" },
] as const;

type View = (typeof VIEWS)[number]["id"];

const ANYONE = "__anyone";

const label = "text-ink-faint mb-1 block text-[0.6875rem] font-semibold";

/**
 * The work board: every task for every client project, who has it and by
 * when, in the sprint and quarter it falls in. Overdue work is red until
 * it is done. The Board view of the Tasks page.
 */
export async function TaskBoard({
  params,
}: {
  params: { view?: string; project?: string; person?: string };
}) {
  const view: View = VIEWS.some((v) => v.id === params.view)
    ? (params.view as View)
    : "sprint";
  const [items, projects] = await Promise.all([
    loadWorkItems(),
    loadProjectOptions(),
  ]);

  const today = todayIST();
  const sprint = sprintOf(today);
  const next = nextSprint(sprint);
  const quarter = sprint.quarter;
  const people = [
    ...new Set(items.map((i) => i.assignee).filter((a): a is string => !!a)),
  ].sort((a, b) => a.localeCompare(b));

  const doneOn = (i: WorkRow) =>
    i.doneAt ? todayIST(i.doneAt.getTime()) : null;
  const within = (d: string | null, a: string, b: string) =>
    !!d && d >= a && d <= b;

  /* Which tasks the chosen view holds. Open work that is overdue or has no
     date stays on the current sprint and quarter until it is done. */
  const inView = (i: WorkRow) => {
    if (view === "all") return true;
    if (view === "next") return within(i.dueOn, next.start, next.end);
    const [a, b] =
      view === "sprint"
        ? [sprint.start, sprint.end]
        : [quarter.start, quarter.end];
    if (i.status === "done") return within(doneOn(i), a, b);
    return !i.dueOn || i.dueOn <= b;
  };
  const filtered = items.filter(
    (i) =>
      inView(i) &&
      (!params.project || i.projectId === params.project) &&
      (!params.person ||
        (params.person === ANYONE
          ? !i.assignee
          : i.assignee === params.person)),
  );

  /* The numbers across the top are for the whole board, not the filter. */
  const open = items.filter((i) => i.status !== "done");
  const overdue = open.filter((i) => dueState(i, today) === "overdue");
  const dueToday = open.filter((i) => dueState(i, today) === "today");
  const sprintDue = items.filter(
    (i) =>
      within(i.dueOn, sprint.start, sprint.end) ||
      within(doneOn(i), sprint.start, sprint.end),
  );
  const sprintDone = sprintDue.filter((i) => i.status === "done");
  const unassigned = open.filter((i) => !i.assignee);

  const rank: Record<DueState, number> = {
    overdue: 0,
    today: 1,
    soon: 2,
    later: 3,
    none: 4,
    done: 5,
  };
  const prio: Record<string, number> = { high: 0, normal: 1, low: 2 };
  const sorted = (rows: WorkRow[]) =>
    [...rows].sort(
      (a, b) =>
        rank[dueState(a, today)] - rank[dueState(b, today)] ||
        (a.dueOn ?? "9999").localeCompare(b.dueOn ?? "9999") ||
        (prio[a.priority] ?? 1) - (prio[b.priority] ?? 1),
    );
  const columns = WORK_STATUSES.map((s) => ({
    ...s,
    rows:
      s.id === "done"
        ? [...filtered.filter((i) => i.status === "done")]
            .sort(
              (a, b) => (b.doneAt?.getTime() ?? 0) - (a.doneAt?.getTime() ?? 0),
            )
            .slice(0, 30)
        : sorted(filtered.filter((i) => i.status === s.id)),
  }));

  const href = (patch: Record<string, string | undefined>) => {
    const q = new URLSearchParams();
    const merged = {
      view,
      project: params.project,
      person: params.person,
      ...patch,
    };
    for (const [k, v] of Object.entries(merged)) if (v) q.set(k, v);
    return `${ADMIN}/tasks?${q.toString()}`;
  };

  /* Progress per project, over all of its tasks. */
  const byProject = projects
    .map((p) => {
      const rows = items.filter((i) => i.projectId === p.id);
      const done = rows.filter((i) => i.status === "done").length;
      const late = rows.filter((i) => dueState(i, today) === "overdue").length;
      const nextDue = sorted(
        rows.filter((i) => i.status !== "done" && i.dueOn),
      )[0];
      return { p, total: rows.length, done, late, nextDue };
    })
    .filter((r) => r.total > 0)
    .sort((a, b) => b.late - a.late || a.done / a.total - b.done / b.total);

  const byPerson = [...people, null]
    .map((person) => {
      const rows = open.filter((i) =>
        person ? i.assignee === person : !i.assignee,
      );
      return {
        person,
        open: rows.length,
        late: rows.filter((i) => dueState(i, today) === "overdue").length,
        today: rows.filter((i) => dueState(i, today) === "today").length,
      };
    })
    .filter((r) => r.open > 0);

  return (
    <>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        <Tile
          label="Open"
          value={open.length}
          hint={`${unassigned.length} for anyone`}
        />
        <Tile
          label="Due today"
          value={dueToday.length}
          tone={dueToday.length ? "amber" : undefined}
        />
        <Tile
          label="Overdue"
          value={overdue.length}
          tone={overdue.length ? "danger" : undefined}
          hint={overdue.length ? "Past the due date, not done" : "Nothing late"}
        />
        <Tile
          label="Done this sprint"
          value={sprintDone.length}
          hint={`of ${sprintDue.length} due this sprint`}
        />
        <Tile
          label="Sprint completion"
          value={
            sprintDue.length
              ? `${Math.round((sprintDone.length / sprintDue.length) * 100)}%`
              : "–"
          }
          bar={sprintDue.length ? sprintDone.length / sprintDue.length : 0}
        />
      </div>

      <Section title="Add a task">
        <form
          action={createWorkItem}
          className="card grid gap-3 p-4 sm:p-5 lg:grid-cols-12"
        >
          <label className="block lg:col-span-4">
            <span className={label}>What needs doing</span>
            <input
              name="title"
              required
              maxLength={300}
              placeholder="Set up the payment gateway"
              className={cn(field, "py-2")}
            />
          </label>
          <label className="block lg:col-span-3">
            <span className={label}>Project</span>
            <ProjectSelect projects={projects} />
          </label>
          <label className="block lg:col-span-2">
            <span className={label}>Assigned to</span>
            <input
              name="assignee"
              list="task-people"
              maxLength={80}
              placeholder="Anyone"
              className={cn(field, "py-2")}
            />
          </label>
          <label className="block lg:col-span-2">
            <span className={label}>Complete by</span>
            <input
              name="due_on"
              type="date"
              defaultValue={addDays(today, 2)}
              className={cn(field, "py-2")}
            />
          </label>
          <label className="block lg:col-span-1">
            <span className={label}>Priority</span>
            <PrioritySelect />
          </label>
          <label className="block lg:col-span-10">
            <span className={label}>Notes (optional)</span>
            <input
              name="notes"
              maxLength={4000}
              placeholder="Links, details, what done looks like"
              className={cn(field, "py-2")}
            />
          </label>
          <div className="flex items-end lg:col-span-2">
            <button type="submit" className={cn(primaryButton, "w-full py-2")}>
              Add task
            </button>
          </div>
          <datalist id="task-people">
            {people.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </form>
      </Section>

      <Section title="Board">
        <div className="flex flex-wrap items-center gap-2">
          {VIEWS.map((v) => (
            <Link
              key={v.id}
              href={href({ view: v.id })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[0.75rem] font-semibold transition-colors",
                v.id === view
                  ? "border-ink bg-ink text-cta-fg"
                  : "border-line bg-surface text-ink-soft hover:border-brand hover:text-brand-deep",
              )}
            >
              {v.label}
            </Link>
          ))}
          <form
            className="ml-auto flex flex-wrap items-center gap-2"
            action={`${ADMIN}/tasks`}
          >
            <input type="hidden" name="view" value={view} />
            <select
              name="project"
              defaultValue={params.project ?? ""}
              className={cn(field, "w-auto py-1.5")}
              aria-label="Project"
            >
              <option value="">All projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.client}: {p.title}
                </option>
              ))}
            </select>
            <select
              name="person"
              defaultValue={params.person ?? ""}
              className={cn(field, "w-auto py-1.5")}
              aria-label="Person"
            >
              <option value="">Everyone</option>
              <option value={ANYONE}>Not assigned</option>
              {people.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <button type="submit" className={quietButton}>
              Filter
            </button>
            {(params.project || params.person) && (
              <Link
                href={href({ project: undefined, person: undefined })}
                className="text-ink-faint hover:text-ink text-[0.75rem] font-semibold"
              >
                Clear
              </Link>
            )}
          </form>
        </div>
        <p className="text-ink-faint mt-2 text-[0.75rem]">
          {view === "sprint" &&
            `Sprint ${sprint.n}, ${shortDay(sprint.start, today)} to ${shortDay(sprint.end, today)}. Late and undated work stays here until it is done.`}
          {view === "next" &&
            `Sprint ${next.n} of ${next.quarter.short}, ${shortDay(next.start, today)} to ${shortDay(next.end, today)}.`}
          {view === "quarter" &&
            `${quarter.label}, ${shortDay(quarter.start, today)} to ${shortDay(quarter.end, today)}.`}
          {view === "all" && "Every task there is."}
        </p>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {columns.map((c) => (
            <div
              key={c.id}
              className="bg-mist min-w-0 rounded-2xl p-2.5 sm:p-3"
            >
              <h3 className="text-ink flex items-center justify-between px-1 pb-2 text-[0.8125rem] font-semibold">
                {c.label}
                <span className="bg-surface text-ink-soft rounded-full px-2 py-0.5 text-[0.6875rem]">
                  {c.rows.length}
                </span>
              </h3>
              {c.rows.length === 0 ? (
                <p className="text-ink-faint px-1 py-6 text-center text-[0.75rem]">
                  {c.id === "done"
                    ? "Nothing finished in this view yet."
                    : "Nothing here."}
                </p>
              ) : (
                <ul className="space-y-2">
                  {c.rows.map((item) => (
                    <TaskCard
                      key={item.id}
                      item={item}
                      today={today}
                      projects={projects}
                    />
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Section>

      <div className="grid gap-x-6 lg:grid-cols-[1.6fr_1fr]">
        <Section title="By project">
          {byProject.length === 0 ? (
            <Empty>No tasks on any project yet.</Empty>
          ) : (
            <ul className="card divide-line divide-y">
              {byProject.map(({ p, total, done, late, nextDue }) => (
                <li key={p.id} className="p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <Link
                      href={`${ADMIN}/projects/${p.id}`}
                      className="text-ink hover:text-brand-deep text-[0.875rem] font-semibold"
                    >
                      {p.title}
                      <span className="text-ink-faint font-normal">
                        {" "}
                        · {p.client}
                      </span>
                    </Link>
                    <span className="text-ink-soft text-[0.75rem]">
                      {done} of {total} done
                      {late > 0 && (
                        <span className="text-danger font-semibold">
                          {" "}
                          · {late} overdue
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="bg-mist-deep mt-2 h-1.5 overflow-hidden rounded-full">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        late ? "bg-danger" : "bg-leaf-deep",
                      )}
                      style={{ width: `${Math.max(3, (done / total) * 100)}%` }}
                    />
                  </div>
                  <p className="text-ink-faint mt-1.5 text-[0.6875rem]">
                    {serviceLabel(p.service)}
                    {nextDue &&
                      ` · next: ${nextDue.title}, ${dueText(nextDue, today).toLowerCase()}`}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="By person">
          {byPerson.length === 0 ? (
            <Empty>No open tasks.</Empty>
          ) : (
            <ul className="card divide-line divide-y">
              {byPerson.map((r) => (
                <li
                  key={r.person ?? ANYONE}
                  className="flex items-center justify-between gap-3 p-4"
                >
                  <Link
                    href={href({ person: r.person ?? ANYONE })}
                    className="text-ink hover:text-brand-deep text-[0.875rem] font-semibold"
                  >
                    {r.person ?? "Anyone (not assigned)"}
                  </Link>
                  <span className="text-ink-soft text-right text-[0.75rem]">
                    {r.open} open
                    {r.today > 0 && ` · ${r.today} today`}
                    {r.late > 0 && (
                      <span className="text-danger font-semibold">
                        {" "}
                        · {r.late} overdue
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </>
  );
}

function Tile({
  label,
  value,
  hint,
  tone,
  bar,
}: {
  label: string;
  value: number | string;
  hint?: string;
  tone?: "danger" | "amber";
  bar?: number;
}) {
  return (
    <div
      className={cn(
        "card min-w-0 p-4 sm:p-5",
        tone === "danger" && "border-danger/50 bg-danger/5",
      )}
    >
      <p className={cn("eyebrow", tone === "danger" && "text-danger")}>
        {label}
      </p>
      <p
        className={cn(
          "display mt-1.5 text-[1.5rem] tabular-nums sm:text-[1.75rem]",
          tone === "danger"
            ? "text-danger"
            : tone === "amber"
              ? "text-amber-deep"
              : "text-ink",
        )}
      >
        {value}
      </p>
      {hint && <p className="text-ink-faint mt-0.5 text-[0.75rem]">{hint}</p>}
      {bar !== undefined && (
        <div className="bg-mist-deep mt-2 h-1.5 overflow-hidden rounded-full">
          <div
            className="bg-leaf-deep h-full rounded-full"
            style={{ width: `${Math.round(bar * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}

function ProjectSelect({
  projects,
  value,
}: {
  projects: ProjectOption[];
  value?: string | null;
}) {
  return (
    <select
      name="project_id"
      defaultValue={value ?? ""}
      className={cn(field, "py-2")}
    >
      <option value="">No project (internal)</option>
      {projects.map((p) => (
        <option key={p.id} value={p.id}>
          {p.client}: {p.title}
        </option>
      ))}
    </select>
  );
}

function PrioritySelect({ value = "normal" }: { value?: string }) {
  return (
    <select name="priority" defaultValue={value} className={cn(field, "py-2")}>
      {PRIORITIES.map((p) => (
        <option key={p.id} value={p.id}>
          {p.label}
        </option>
      ))}
    </select>
  );
}

const DUE_TONE: Record<DueState, string> = {
  overdue: "text-danger font-semibold",
  today: "text-amber-deep font-semibold",
  soon: "text-ink-soft",
  later: "text-ink-faint",
  none: "text-ink-faint",
  done: "text-leaf-deep",
};

function TaskCard({
  item,
  today,
  projects,
}: {
  item: WorkRow;
  today: string;
  projects: ProjectOption[];
}) {
  const state = dueState(item, today);
  const move = (status: string, text: string) => (
    <form action={setWorkItemStatus}>
      <input type="hidden" name="id" value={item.id} />
      <input type="hidden" name="status" value={status} />
      <button
        type="submit"
        className={cn(
          "rounded-md border px-2 py-1 text-[0.6875rem] font-semibold transition-colors",
          status === "done"
            ? "border-leaf-deep/40 text-leaf-deep hover:bg-leaf-wash"
            : "border-line text-ink-soft hover:border-brand hover:text-brand-deep",
        )}
      >
        {text}
      </button>
    </form>
  );

  return (
    <li
      className={cn(
        "bg-surface border-line relative rounded-xl border p-3 shadow-[0_1px_0_rgba(14,27,38,0.04)]",
        state === "overdue" && "border-danger/60 bg-danger/5 border-l-4",
        state === "today" && "border-l-amber-deep border-l-4",
        item.status === "done" && "opacity-80",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className={cn(
            "text-ink min-w-0 text-[0.875rem] leading-snug font-semibold",
            item.status === "done" && "text-ink-soft line-through decoration-1",
          )}
        >
          {item.title}
        </p>
        {item.priority === "high" && item.status !== "done" && (
          <span className="bg-danger/10 text-danger shrink-0 rounded-full px-2 py-0.5 text-[0.625rem] font-bold uppercase">
            High
          </span>
        )}
      </div>
      {item.projectTitle && (
        <p className="text-brand-deep mt-1 truncate text-[0.75rem] font-medium">
          {item.projectClient}: {item.projectTitle}
        </p>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.75rem]">
        <span className={DUE_TONE[state]}>
          {item.status === "done" && item.doneAt
            ? `Done ${shortDay(todayIST(item.doneAt.getTime()), today)}`
            : dueText(item, today)}
        </span>
        <span
          className={item.assignee ? "text-ink-soft" : "text-ink-faint italic"}
        >
          {item.assignee ?? "Anyone"}
        </span>
      </div>
      {item.notes && (
        <p className="text-ink-faint mt-1.5 line-clamp-2 text-[0.75rem]">
          {item.notes}
        </p>
      )}

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        {item.status === "todo" && move("doing", "Start")}
        {item.status !== "done" && move("done", "Mark done")}
        {item.status === "done" && move("todo", "Reopen")}
        <details className="group ml-auto">
          <summary className="text-brand-deep hover:text-ink inline-flex cursor-pointer list-none items-center gap-1 text-[0.6875rem] font-semibold [&::-webkit-details-marker]:hidden">
            Edit
            <ChevronDown
              className="size-3 transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <div className="border-line bg-surface absolute right-2 left-2 z-10 mt-2 rounded-xl border p-3 shadow-lg sm:relative sm:right-auto sm:left-auto sm:w-72">
            <form action={updateWorkItem} className="space-y-2">
              <input type="hidden" name="id" value={item.id} />
              <input
                name="title"
                defaultValue={item.title}
                required
                maxLength={300}
                className={field}
                aria-label="Title"
              />
              <ProjectSelect projects={projects} value={item.projectId} />
              <input
                name="assignee"
                list="task-people"
                defaultValue={item.assignee ?? ""}
                placeholder="Anyone"
                maxLength={80}
                className={field}
                aria-label="Assigned to"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  name="due_on"
                  type="date"
                  defaultValue={item.dueOn ?? ""}
                  className={field}
                  aria-label="Complete by"
                />
                <PrioritySelect value={item.priority} />
              </div>
              <select
                name="status"
                defaultValue={item.status}
                className={field}
                aria-label="Status"
              >
                {WORK_STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <textarea
                name="notes"
                defaultValue={item.notes ?? ""}
                rows={3}
                maxLength={4000}
                placeholder="Notes"
                className={cn(field, "resize-y")}
              />
              <button type="submit" className={cn(primaryButton, "w-full")}>
                Save
              </button>
            </form>
            <form action={deleteWorkItem} className="mt-2 text-right">
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" className={deleteButton}>
                Delete task
              </button>
            </form>
          </div>
        </details>
      </div>
    </li>
  );
}
