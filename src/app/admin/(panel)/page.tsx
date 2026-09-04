import { createEnrolment, setEnrolmentStatus } from "./actions";
import { createClient } from "@/lib/supabase/server";

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

type Enrolment = { id: string; status: string; cohort_id: string };
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

export default async function AdminStudentsPage() {
  const supabase = await createClient();

  const [{ data: profiles }, { data: cohorts }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*, enrolments(id, status, cohort_id)")
      .order("created_at", { ascending: false }),
    supabase.from("cohorts").select("id, name").order("created_at"),
  ]);

  const rows = (profiles ?? []) as Row[];
  const defaultCohort = cohorts?.[0];

  return (
    <>
      <h1 className="display text-ink text-[1.875rem] sm:text-[2.25rem]">
        Students
      </h1>
      <p className="text-ink-soft mt-3 text-[0.9375rem]">
        Signing up creates an account, not a seat. Move someone to{" "}
        <strong className="text-ink">enrolled</strong> and the course opens for
        them.
      </p>

      {rows.length === 0 ? (
        <div className="card mt-8 p-8 text-center">
          <p className="text-ink-soft text-[0.9375rem]">
            Nobody has signed up yet.
          </p>
        </div>
      ) : (
        <div className="card mt-8 overflow-x-auto">
          <table className="w-full min-w-[46rem] text-left">
            <thead>
              <tr className="border-line-soft border-b">
                {["Student", "Contact", "Status", "Change to"].map((head) => (
                  <th
                    key={head}
                    className="text-ink-faint px-5 py-4 text-[0.75rem] font-semibold tracking-[0.1em] uppercase"
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
                  [row.first_name, row.last_name].filter(Boolean).join(" ") ||
                  "—";

                return (
                  <tr
                    key={row.id}
                    className="border-line-soft border-b last:border-0"
                  >
                    <td className="px-5 py-4">
                      <span className="text-ink block text-[0.9375rem] font-semibold">
                        {name}
                      </span>
                      {row.role === "admin" && (
                        <span className="text-amber-deep text-[0.75rem] font-semibold">
                          admin
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-ink-soft block text-[0.875rem]">
                        {row.email ?? "—"}
                      </span>
                      <span className="text-ink-faint block text-[0.8125rem]">
                        {row.phone ?? "—"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[0.75rem] font-semibold ${
                          TONE[enrolment?.status ?? ""] ??
                          "bg-mist text-ink-faint"
                        }`}
                      >
                        {enrolment?.status ?? "no application"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {enrolment ? (
                        <form
                          action={setEnrolmentStatus}
                          className="flex gap-2"
                        >
                          <input type="hidden" name="id" value={enrolment.id} />
                          <select
                            name="status"
                            defaultValue={enrolment.status}
                            className="border-line bg-surface text-ink rounded-lg border px-3 py-2 text-[0.875rem]"
                          >
                            {STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          <button
                            type="submit"
                            className="bg-ink hover:bg-brand-deep text-cta-fg rounded-lg px-4 py-2 text-[0.875rem] font-semibold transition-colors"
                          >
                            Save
                          </button>
                        </form>
                      ) : defaultCohort ? (
                        <form action={createEnrolment}>
                          <input type="hidden" name="user_id" value={row.id} />
                          <input
                            type="hidden"
                            name="cohort_id"
                            value={defaultCohort.id}
                          />
                          <button
                            type="submit"
                            className="border-line bg-surface text-ink hover:border-brand hover:text-brand-deep rounded-lg border px-4 py-2 text-[0.875rem] font-semibold transition-colors"
                          >
                            Add to {defaultCohort.name}
                          </button>
                        </form>
                      ) : (
                        <span className="text-ink-faint text-[0.875rem]">
                          No cohort exists
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
