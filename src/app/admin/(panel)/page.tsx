import { createEnrolment, setEnrolmentStatus, updatePayment } from "./actions";
import { createClient } from "@/lib/supabase/server";
import { displayName } from "@/lib/utils";

const STATUSES = [
  "applied",
  "accepted",
  "enrolled",
  "completed",
  "withdrawn",
] as const;

const TONE: Record<string, string> = {
  applied: "bg-amber-wash text-amber-deep",
  accepted: "bg-brand-wash text-brand-deep",
  enrolled: "bg-leaf-wash text-leaf-deep",
  completed: "bg-teal-wash text-teal-deep",
  withdrawn: "bg-mist text-ink-faint",
};

type Enrolment = {
  id: string;
  status: string;
  cohort_id: string;
  created_at: string;
  amount_paid: number | null;
  paid_on: string | null;
  payment_ref: string | null;
};

type Row = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: string;
  created_at: string;
  enrolments: Enrolment[];
};

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const day = (value: string | null | undefined) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

/**
 * Everyone who has an account, and everything about where they stand.
 *
 * One row per person rather than one screen per person: who they are, which
 * code let them in, how far through each track they are, what they paid.
 * Teaching a small group means answering those four questions constantly,
 * and they were spread across three pages and the database.
 */
export default async function AdminStudentsPage() {
  const supabase = await createClient();

  const [
    { data: profiles },
    { data: cohorts },
    { data: codes },
    { data: questions },
    { data: progress },
    { data: attempts },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "*, enrolments(id, status, cohort_id, created_at, amount_paid, paid_on, payment_ref)",
      )
      .order("created_at", { ascending: false }),
    supabase.from("cohorts").select("id, name").order("created_at"),
    supabase
      .from("enrolment_codes")
      .select("code, note, redeemed_by, redeemed_at")
      .not("redeemed_by", "is", null),
    supabase
      .from("practice_questions")
      .select("id, track")
      .eq("is_published", true),
    supabase.from("practice_progress").select("user_id, question_id"),
    supabase
      .from("practice_attempts")
      .select("user_id, status")
      .eq("status", "pending"),
  ]);

  const rows = (profiles ?? []) as Row[];
  const defaultCohort = cohorts?.[0];

  // Which code let each student in — the codes table is the record of that,
  // so there is nothing to keep in sync on the enrolment itself.
  const codeFor = new Map(
    (codes ?? []).map((c) => [c.redeemed_by as string, c]),
  );

  const trackOf = new Map((questions ?? []).map((q) => [q.id, q.track]));
  const totals = { sql: 0, python: 0 };
  for (const track of trackOf.values()) {
    if (track === "sql") totals.sql += 1;
    if (track === "python") totals.python += 1;
  }

  const solvedBy = new Map<string, { sql: number; python: number }>();
  for (const row of progress ?? []) {
    const track = trackOf.get(row.question_id);
    if (!track) continue;
    const entry = solvedBy.get(row.user_id) ?? { sql: 0, python: 0 };
    if (track === "sql") entry.sql += 1;
    else entry.python += 1;
    solvedBy.set(row.user_id, entry);
  }

  const pendingBy = new Map<string, number>();
  for (const row of attempts ?? []) {
    pendingBy.set(row.user_id, (pendingBy.get(row.user_id) ?? 0) + 1);
  }

  const enrolled = rows.filter((r) =>
    r.enrolments?.some((e) => e.status === "enrolled" || e.status === "completed"),
  ).length;
  const collected = rows.reduce(
    (sum, r) => sum + Number(r.enrolments?.[0]?.amount_paid ?? 0),
    0,
  );

  const field =
    "w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[0.8125rem] text-ink focus:border-brand focus:outline-none";

  return (
    <>
      <h1 className="display text-ink text-[1.875rem] sm:text-[2.25rem]">
        Students
      </h1>
      <p className="text-ink-soft mt-3 max-w-2xl text-[0.9375rem]">
        Signing up creates an account, not a place. Move someone to{" "}
        <strong className="text-ink">enrolled</strong> and the course opens for
        them.
      </p>

      {/* Summary --------------------------------------------------------- */}
      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <Stat label="Accounts" value={String(rows.length)} />
        <Stat label="Enrolled" value={String(enrolled)} />
        <Stat
          label="Collected"
          value={collected ? rupees.format(collected) : "—"}
        />
      </div>

      {rows.length === 0 ? (
        <div className="card mt-8 p-8 text-center">
          <p className="text-ink-soft text-[0.9375rem]">
            Nobody has signed up yet.
          </p>
        </div>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full min-w-[68rem] text-left">
            <thead>
              <tr className="border-line-soft border-b">
                {[
                  "Student",
                  "Joined",
                  "Code",
                  "Progress",
                  "Status",
                  "Payment",
                ].map((head) => (
                  <th
                    key={head}
                    className="text-ink-faint px-4 py-3.5 text-[0.6875rem] font-semibold tracking-[0.1em] uppercase"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const enrolment = row.enrolments?.[0];
                const name =
                  displayName(
                    [row.first_name, row.last_name].filter(Boolean).join(" "),
                  ) || "—";
                const code = codeFor.get(row.id);
                const solved = solvedBy.get(row.id) ?? { sql: 0, python: 0 };
                const pending = pendingBy.get(row.id) ?? 0;

                return (
                  <tr
                    key={row.id}
                    className="border-line-soft border-b align-top last:border-0"
                  >
                    <td className="px-4 py-4">
                      <span className="text-ink block text-[0.9375rem] font-semibold">
                        {name}
                      </span>
                      <span className="text-ink-soft block text-[0.8125rem]">
                        {row.email ?? "—"}
                      </span>
                      <span className="text-ink-faint block text-[0.8125rem]">
                        {row.phone ?? "no phone"}
                      </span>
                      {row.role === "admin" && (
                        <span className="text-amber-deep text-[0.75rem] font-semibold">
                          admin
                        </span>
                      )}
                    </td>

                    <td className="text-ink-soft px-4 py-4 text-[0.8125rem] whitespace-nowrap">
                      {day(enrolment?.created_at ?? row.created_at)}
                    </td>

                    <td className="px-4 py-4">
                      {code ? (
                        <>
                          <span className="text-ink block font-mono text-[0.8125rem] font-semibold tracking-wide">
                            {code.code}
                          </span>
                          {code.note && (
                            <span className="text-ink-faint block text-[0.75rem]">
                              {code.note}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-ink-faint text-[0.8125rem]">
                          added by hand
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <Bar
                        label="SQL"
                        done={solved.sql}
                        total={totals.sql}
                      />
                      <Bar
                        label="Py"
                        done={solved.python}
                        total={totals.python}
                      />
                      {pending > 0 && (
                        <span className="bg-amber-wash text-amber-deep mt-1.5 inline-flex rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold">
                          {pending} awaiting check
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[0.75rem] font-semibold whitespace-nowrap ${
                          TONE[enrolment?.status ?? ""] ??
                          "bg-mist text-ink-faint"
                        }`}
                      >
                        {enrolment?.status ?? "no application"}
                      </span>

                      {enrolment ? (
                        <form
                          action={setEnrolmentStatus}
                          className="mt-2 flex gap-1.5"
                        >
                          <input type="hidden" name="id" value={enrolment.id} />
                          <select
                            name="status"
                            defaultValue={enrolment.status}
                            aria-label={`Status for ${name}`}
                            className={field}
                          >
                            {STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          <button
                            type="submit"
                            className="bg-ink hover:bg-brand-deep text-cta-fg shrink-0 rounded-lg px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors"
                          >
                            Save
                          </button>
                        </form>
                      ) : defaultCohort ? (
                        <form action={createEnrolment} className="mt-2">
                          <input type="hidden" name="user_id" value={row.id} />
                          <input
                            type="hidden"
                            name="cohort_id"
                            value={defaultCohort.id}
                          />
                          <button
                            type="submit"
                            className="border-line bg-surface text-ink hover:border-brand hover:text-brand-deep rounded-lg border px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors"
                          >
                            Add to {defaultCohort.name}
                          </button>
                        </form>
                      ) : (
                        <span className="text-ink-faint mt-2 block text-[0.8125rem]">
                          No class exists
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      {enrolment ? (
                        <form action={updatePayment} className="space-y-1.5">
                          <input type="hidden" name="id" value={enrolment.id} />
                          <input
                            name="amount_paid"
                            type="number"
                            min={0}
                            step="1"
                            inputMode="numeric"
                            defaultValue={enrolment.amount_paid ?? ""}
                            placeholder="Amount ₹"
                            aria-label={`Amount paid by ${name}`}
                            className={field}
                          />
                          <input
                            name="paid_on"
                            type="date"
                            defaultValue={enrolment.paid_on ?? ""}
                            aria-label={`Payment date for ${name}`}
                            className={field}
                          />
                          <input
                            name="payment_ref"
                            defaultValue={enrolment.payment_ref ?? ""}
                            placeholder="UPI / receipt ref"
                            aria-label={`Payment reference for ${name}`}
                            className={field}
                          />
                          <button
                            type="submit"
                            className="border-line bg-surface text-ink hover:border-brand hover:text-brand-deep w-full rounded-lg border px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors"
                          >
                            Save payment
                          </button>
                        </form>
                      ) : (
                        <span className="text-ink-faint text-[0.8125rem]">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <p className="eyebrow">{label}</p>
      <p className="display text-ink mt-1.5 text-[1.5rem]">{value}</p>
    </div>
  );
}

function Bar({
  label,
  done,
  total,
}: {
  label: string;
  done: number;
  total: number;
}) {
  return (
    <span className="mt-0.5 flex items-center gap-2">
      <span className="text-ink-faint w-6 text-[0.6875rem] font-semibold">
        {label}
      </span>
      <span className="bg-mist block h-1.5 w-20 overflow-hidden rounded-full">
        <span
          className="bg-leaf-deep block h-full rounded-full"
          style={{ width: `${total ? (done / total) * 100 : 0}%` }}
        />
      </span>
      <span className="text-ink-soft font-mono text-[0.6875rem] tabular-nums">
        {done}/{total}
      </span>
    </span>
  );
}
