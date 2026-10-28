import { Select } from "@/components/admin/Select";
import { ADMIN } from "@/lib/admin-path";
import Link from "next/link";
import { Fragment } from "react";
import { AutoSaveForm } from "@/components/admin/autosave";
import { ChevronDown, ExternalLink, FolderOpen } from "lucide-react";
import {
  addPayment,
  createProject,
  deletePayment,
  deleteProject,
  setProjectMeetings,
  setProjectStatus,
  topUpProject,
  updateProject,
} from "@/app/admin/(panel)/business-actions";
import {
  Empty,
  StatusPill,
  deleteButton,
  field,
  primaryButton,
  quietButton,
  td,
  th,
} from "@/components/admin/Business";
import {
  PROJECT_SERVICES,
  PROJECT_STATUSES,
  daysBetween,
  num,
  projectMeetings,
  rupees,
  serviceLabel,
} from "@/lib/business";
import type { clientPayments, clientProjects } from "@/lib/db/schema";
import type { LinkRow } from "@/lib/project-details";

type Project = typeof clientProjects.$inferSelect;
type Payment = typeof clientPayments.$inferSelect;

const day = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

/** A dropdown that opens in place and closes again — no script needed. */
function Drop({
  label,
  children,
  tone = "quiet",
}: {
  label: string;
  children: React.ReactNode;
  tone?: "quiet" | "danger";
}) {
  return (
    <details className="group">
      <summary
        className={`inline-flex cursor-pointer list-none items-center gap-1 text-[0.75rem] font-semibold whitespace-nowrap transition-colors [&::-webkit-details-marker]:hidden ${
          tone === "danger"
            ? "text-ink-faint hover:text-danger"
            : "text-brand-deep hover:text-ink"
        }`}
      >
        {label}
        <ChevronDown
          className="size-3.5 transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="mt-2">{children}</div>
    </details>
  );
}

function ServiceOptions() {
  return PROJECT_SERVICES.map((s) => (
    <option key={s.id} value={s.id}>
      {s.label}
    </option>
  ));
}

function StatusOptions() {
  return PROJECT_STATUSES.map((s) => (
    <option key={s.id} value={s.id}>
      {s.label}
    </option>
  ));
}

const short = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

const days = (n: number) => `${n} day${n === 1 ? "" : "s"}`;

/**
 * The three client meetings a project is planned around, under its row: a
 * day for each and a tick once it is held. A planned day gone by without
 * the tick is late, and the strip says by how much, so a slipping project
 * shows long before its due date. The last meeting is when the work should
 * finish; if it falls after the due date, that shows too.
 */
function Meetings({ project: p, today }: { project: Project; today: string }) {
  const meetings = projectMeetings(p.meetings);
  const open = !["delivered", "lost"].includes(p.status);
  const late = meetings
    .map((m, i) => ({ ...m, n: i + 1 }))
    .filter((m) => open && m.on && !m.held && m.on < today);
  const last = meetings[meetings.length - 1].on;
  const pastDue = last && p.dueOn ? daysBetween(p.dueOn, last) : 0;

  const summary = !open
    ? null
    : late.length > 0
      ? {
          tone: "bg-danger/10 text-danger",
          text: `Behind · meeting ${late[0].n} is ${days(daysBetween(late[0].on!, today))} late`,
        }
      : meetings.every((m) => m.held)
        ? { tone: "bg-leaf-wash text-leaf-deep", text: "All meetings held" }
        : meetings.some((m) => m.on)
          ? { tone: "bg-brand-wash text-brand-deep", text: "On track" }
          : { tone: "bg-mist text-ink-faint", text: "Set the meeting days" };

  return (
    <div className="bg-mist border-line-soft flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border px-3 py-2">
      <span className="eyebrow">Meetings</span>
      <AutoSaveForm
        action={setProjectMeetings}
        className="flex flex-wrap items-center gap-2"
      >
        <input type="hidden" name="id" value={p.id} />
        {meetings.map((m, i) => {
          const n = i + 1;
          const gap = m.on ? daysBetween(today, m.on) : null;
          const state = m.held
            ? { text: "Held", tone: "text-leaf-deep" }
            : gap === null
              ? { text: "Not set", tone: "text-ink-faint" }
              : gap === 0
                ? { text: "Today", tone: "text-brand-deep" }
                : gap > 0
                  ? { text: `In ${days(gap)}`, tone: "text-ink-faint" }
                  : open
                    ? { text: `${days(-gap)} late`, tone: "text-danger" }
                    : { text: "Not marked", tone: "text-ink-faint" };
          return (
            <div
              key={n}
              className={`bg-surface flex items-center gap-2 rounded-lg border py-1 pr-2.5 pl-1.5 ${
                state.tone === "text-danger"
                  ? "border-danger/40"
                  : "border-line"
              }`}
            >
              <span
                className={`grid size-6 shrink-0 place-items-center rounded-full text-[0.6875rem] font-bold ${
                  m.held
                    ? "bg-leaf-wash text-leaf-deep"
                    : "bg-brand-wash text-brand-deep"
                }`}
                aria-hidden
              >
                {n}
              </span>
              <input
                name={`meeting_${n}`}
                type="date"
                defaultValue={m.on ?? ""}
                aria-label={`Meeting ${n} date`}
                className={`${field} w-[8.5rem] py-1`}
              />
              <label className="text-ink-soft flex items-center gap-1 text-[0.75rem] font-semibold">
                <input
                  name={`meeting_${n}_held`}
                  type="checkbox"
                  defaultChecked={m.held}
                  className="accent-brand size-3.5"
                />
                Held
              </label>
              <span
                className={`w-[5.5rem] text-[0.75rem] font-semibold whitespace-nowrap ${state.tone}`}
              >
                {state.text}
              </span>
            </div>
          );
        })}
      </AutoSaveForm>
      <div className="ml-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.75rem]">
        {last && (
          <span className="text-ink-soft whitespace-nowrap">
            Finishes {short(last)}
            {pastDue > 0 && open && (
              <span className="text-amber-deep font-semibold">
                {" "}
                · {days(pastDue)} after due
              </span>
            )}
          </span>
        )}
        {summary && (
          <span
            className={`rounded-full px-2.5 py-0.5 font-semibold whitespace-nowrap ${summary.tone}`}
          >
            {summary.text}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Projects with everything that can be done to one: status, an Edit panel
 * for every field, a top-up to the agreed value, and payments in and out.
 */
export function ProjectsTable({
  projects,
  payments,
  paidByProject,
  links = new Map(),
  showService = false,
}: {
  projects: Project[];
  payments: Payment[];
  paidByProject: Map<string, number>;
  /** Each project's deployment links (lib/project-data loadProjectLinks). */
  links?: Map<string, LinkRow[]>;
  showService?: boolean;
}) {
  if (projects.length === 0) {
    return <Empty>No projects yet. Add the first one below.</Empty>;
  }

  const today = new Date().toISOString().slice(0, 10);
  const heads = [
    "Project",
    ...(showService ? ["Service"] : []),
    "Status",
    "Dates",
    "Value",
    "Received",
    "Payments",
  ];

  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[68rem] text-left">
        <thead>
          <tr className="border-line-soft border-b">
            {heads.map((h) => (
              <th key={h} className={th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => {
            const paid = paidByProject.get(p.id) ?? 0;
            const owed = Math.max(0, num(p.value) - paid);
            const mine = payments.filter((x) => x.projectId === p.id);
            return (
              <Fragment key={p.id}>
                <tr>
                  <td className={td}>
                    <Link
                      href={`${ADMIN}/projects/${p.id}`}
                      className="text-ink hover:text-brand-deep block text-[0.9375rem] font-semibold underline-offset-2 hover:underline"
                    >
                      {p.title}
                    </Link>
                    <span className="block">{p.client}</span>
                    <ul className="mt-1.5 flex max-w-xs flex-wrap gap-1.5">
                      {(links.get(p.id) ?? []).map((l) => (
                        <li key={l.id}>
                          <a
                            href={l.url}
                            target="_blank"
                            rel="noreferrer"
                            title={l.url}
                            className="bg-brand-wash text-brand-deep hover:border-brand inline-flex items-center gap-1 rounded-md border border-transparent px-2 py-0.5 text-[0.75rem] font-semibold"
                          >
                            {l.label || l.url.replace(/^https?:\/\//, "")}
                            <ExternalLink className="size-3" aria-hidden />
                          </a>
                        </li>
                      ))}
                      <li>
                        <Link
                          href={`${ADMIN}/projects/${p.id}#drive`}
                          className="border-line text-ink-soft hover:border-brand hover:text-brand-deep inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[0.75rem] font-semibold"
                        >
                          <FolderOpen className="size-3" aria-hidden />
                          Drive
                        </Link>
                      </li>
                    </ul>
                    {p.note && (
                      <span className="text-ink-faint mt-1 block max-w-xs text-[0.75rem]">
                        {p.note}
                      </span>
                    )}
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                      <Drop label="Edit">
                        <AutoSaveForm
                          action={updateProject}
                          className="border-line bg-mist grid w-[22rem] grid-cols-2 gap-2 rounded-lg border p-3"
                        >
                          <input type="hidden" name="id" value={p.id} />
                          <label className="col-span-2 block">
                            <span className="eyebrow">Project</span>
                            <input
                              name="title"
                              defaultValue={p.title}
                              required
                              className={`${field} mt-1`}
                            />
                          </label>
                          <label className="block">
                            <span className="eyebrow">Client</span>
                            <input
                              name="client"
                              defaultValue={p.client}
                              required
                              className={`${field} mt-1`}
                            />
                          </label>
                          <label className="block">
                            <span className="eyebrow">Service</span>
                            <Select
                              name="service"
                              defaultValue={p.service}
                              className={`${field} mt-1`}
                            >
                              <ServiceOptions />
                            </Select>
                          </label>
                          <label className="block">
                            <span className="eyebrow">Status</span>
                            <Select
                              name="status"
                              defaultValue={p.status}
                              className={`${field} mt-1`}
                            >
                              <StatusOptions />
                            </Select>
                          </label>
                          <label className="block">
                            <span className="eyebrow">Value (₹)</span>
                            <input
                              name="value"
                              inputMode="decimal"
                              defaultValue={p.value ? num(p.value) : ""}
                              className={`${field} mt-1`}
                            />
                          </label>
                          <label className="block">
                            <span className="eyebrow">Starts</span>
                            <input
                              name="starts_on"
                              type="date"
                              defaultValue={p.startsOn ?? ""}
                              className={`${field} mt-1`}
                            />
                          </label>
                          <label className="block">
                            <span className="eyebrow">Due</span>
                            <input
                              name="due_on"
                              type="date"
                              defaultValue={p.dueOn ?? ""}
                              className={`${field} mt-1`}
                            />
                          </label>
                          <label className="col-span-2 block">
                            <span className="eyebrow">Note</span>
                            <input
                              name="note"
                              defaultValue={p.note ?? ""}
                              className={`${field} mt-1`}
                            />
                          </label>
                          <p className="text-ink-faint col-span-2 text-[0.6875rem]">
                            Changes save by themselves.
                          </p>
                        </AutoSaveForm>
                      </Drop>
                      <Drop label="Delete" tone="danger">
                        <form action={deleteProject}>
                          <input type="hidden" name="id" value={p.id} />
                          <button className="text-danger text-[0.75rem] font-semibold whitespace-nowrap">
                            Yes, delete with its payments
                          </button>
                        </form>
                      </Drop>
                    </div>
                  </td>
                  {showService && (
                    <td className={`${td} whitespace-nowrap`}>
                      {serviceLabel(p.service)}
                    </td>
                  )}
                  <td className={td}>
                    <StatusPill status={p.status} />
                    <AutoSaveForm
                      action={setProjectStatus}
                      className="mt-2 flex gap-1.5"
                    >
                      <input type="hidden" name="id" value={p.id} />
                      <Select
                        name="status"
                        defaultValue={p.status}
                        aria-label="Status"
                        className={`${field} w-28`}
                      >
                        <StatusOptions />
                      </Select>
                    </AutoSaveForm>
                  </td>
                  <td className={`${td} whitespace-nowrap`}>
                    <span className="block">Start {day(p.startsOn)}</span>
                    <span
                      className={`block ${
                        p.dueOn && p.dueOn < today && p.status === "active"
                          ? "text-danger font-semibold"
                          : ""
                      }`}
                    >
                      Due {day(p.dueOn)}
                    </span>
                  </td>
                  <td className={`${td} whitespace-nowrap`}>
                    <span className="text-ink block font-semibold">
                      {p.value ? rupees.format(num(p.value)) : "—"}
                    </span>
                    <form action={topUpProject} className="mt-2 flex gap-1.5">
                      <input type="hidden" name="id" value={p.id} />
                      <input
                        name="top_up"
                        inputMode="decimal"
                        placeholder="+ ₹"
                        aria-label="Top up amount"
                        required
                        className={`${field} w-20`}
                      />
                      <button className={quietButton}>Top up</button>
                    </form>
                  </td>
                  <td className={`${td} whitespace-nowrap`}>
                    <span className="text-ink block font-semibold">
                      {rupees.format(paid)}
                    </span>
                    {owed > 0 && (
                      <span className="text-amber-deep block text-[0.75rem]">
                        {rupees.format(owed)} owed
                      </span>
                    )}
                  </td>
                  <td className={td}>
                    {mine.length > 0 && (
                      <ul className="mb-2 space-y-1">
                        {mine.map((x) => (
                          <li
                            key={x.id}
                            className="flex items-center gap-2 whitespace-nowrap"
                          >
                            <span className="text-ink">
                              {rupees.format(num(x.amount))}
                            </span>
                            <span className="text-ink-faint text-[0.75rem]">
                              {day(x.receivedOn)}
                              {x.ref && ` · ${x.ref}`}
                            </span>
                            <form action={deletePayment}>
                              <input type="hidden" name="id" value={x.id} />
                              <button
                                className={deleteButton}
                                aria-label="Remove payment"
                              >
                                ×
                              </button>
                            </form>
                          </li>
                        ))}
                      </ul>
                    )}
                    <Drop label="Add payment">
                      <form
                        action={addPayment}
                        className="grid grid-cols-[6rem_8.5rem_auto] gap-1.5"
                      >
                        <input type="hidden" name="project_id" value={p.id} />
                        <input
                          name="amount"
                          inputMode="decimal"
                          placeholder="₹ amount"
                          required
                          className={field}
                        />
                        <input
                          name="received_on"
                          type="date"
                          defaultValue={today}
                          required
                          className={field}
                        />
                        <button className={quietButton}>Add</button>
                        <input
                          name="ref"
                          placeholder="Reference (optional)"
                          className={`${field} col-span-2`}
                        />
                      </form>
                    </Drop>
                  </td>
                </tr>
                <tr className="border-line-soft border-b last:border-0">
                  <td colSpan={heads.length} className="px-4 pt-0 pb-4">
                    <Meetings project={p} today={today} />
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** A new project. `service` fixes it to a tab; without one it is chosen. */
export function NewProjectForm({ service }: { service?: string }) {
  return (
    <form
      action={createProject}
      className="card grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4"
    >
      <label className="block">
        <span className="eyebrow">Client</span>
        <input name="client" required className={`${field} mt-1`} />
      </label>
      <label className="block lg:col-span-2">
        <span className="eyebrow">Project</span>
        <input name="title" required className={`${field} mt-1`} />
      </label>
      <label className="block">
        <span className="eyebrow">Service</span>
        <Select
          name="service"
          defaultValue={service ?? "software"}
          className={`${field} mt-1`}
        >
          <ServiceOptions />
        </Select>
      </label>
      <label className="block">
        <span className="eyebrow">Status</span>
        <Select name="status" defaultValue="lead" className={`${field} mt-1`}>
          <StatusOptions />
        </Select>
      </label>
      <label className="block">
        <span className="eyebrow">Value (₹)</span>
        <input name="value" inputMode="decimal" className={`${field} mt-1`} />
      </label>
      <label className="block">
        <span className="eyebrow">Starts</span>
        <input name="starts_on" type="date" className={`${field} mt-1`} />
      </label>
      <label className="block">
        <span className="eyebrow">Due</span>
        <input name="due_on" type="date" className={`${field} mt-1`} />
      </label>
      <label className="block sm:col-span-2 lg:col-span-3">
        <span className="eyebrow">Note</span>
        <input name="note" className={`${field} mt-1`} />
      </label>
      <div className="flex items-end">
        <button className={primaryButton}>Add project</button>
      </div>
    </form>
  );
}
