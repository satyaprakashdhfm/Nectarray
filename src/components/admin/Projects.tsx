import { ChevronDown } from "lucide-react";
import {
  addPayment,
  createProject,
  deletePayment,
  deleteProject,
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
  num,
  rupees,
  serviceLabel,
} from "@/lib/business";
import type { clientPayments, clientProjects } from "@/lib/db/schema";

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

/**
 * Projects with everything that can be done to one: status, an Edit panel
 * for every field, a top-up to the agreed value, and payments in and out.
 */
export function ProjectsTable({
  projects,
  payments,
  paidByProject,
  showService = false,
}: {
  projects: Project[];
  payments: Payment[];
  paidByProject: Map<string, number>;
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
              <tr
                key={p.id}
                className="border-line-soft border-b last:border-0"
              >
                <td className={td}>
                  <span className="text-ink block text-[0.9375rem] font-semibold">
                    {p.title}
                  </span>
                  <span className="block">{p.client}</span>
                  {p.note && (
                    <span className="text-ink-faint mt-1 block max-w-xs text-[0.75rem]">
                      {p.note}
                    </span>
                  )}
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    <Drop label="Edit">
                      <form
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
                          <select
                            name="service"
                            defaultValue={p.service}
                            className={`${field} mt-1`}
                          >
                            <ServiceOptions />
                          </select>
                        </label>
                        <label className="block">
                          <span className="eyebrow">Status</span>
                          <select
                            name="status"
                            defaultValue={p.status}
                            className={`${field} mt-1`}
                          >
                            <StatusOptions />
                          </select>
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
                        <div className="col-span-2">
                          <button className={primaryButton}>
                            Save changes
                          </button>
                        </div>
                      </form>
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
                  <form action={setProjectStatus} className="mt-2 flex gap-1.5">
                    <input type="hidden" name="id" value={p.id} />
                    <select
                      name="status"
                      defaultValue={p.status}
                      aria-label="Status"
                      className={`${field} w-28`}
                    >
                      <StatusOptions />
                    </select>
                    <button className={quietButton}>Set</button>
                  </form>
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
        <select
          name="service"
          defaultValue={service ?? "software"}
          className={`${field} mt-1`}
        >
          <ServiceOptions />
        </select>
      </label>
      <label className="block">
        <span className="eyebrow">Status</span>
        <select name="status" defaultValue="lead" className={`${field} mt-1`}>
          <StatusOptions />
        </select>
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
