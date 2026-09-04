import { generateCode } from "../actions";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCodesPage() {
  const supabase = await createClient();

  const [{ data: cohorts }, { data: codes }] = await Promise.all([
    supabase.from("cohorts").select("id, name").order("created_at"),
    supabase
      .from("enrolment_codes")
      .select("code, note, created_at, redeemed_at, redeemed_by")
      .order("created_at", { ascending: false }),
  ]);

  const field =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-[0.9375rem] text-ink focus:border-brand focus:outline-none";

  return (
    <>
      <h1 className="display text-ink text-[1.875rem] sm:text-[2.25rem]">
        Enrolment codes
      </h1>
      <p className="text-ink-soft mt-3 max-w-2xl text-[0.9375rem] leading-relaxed">
        Generate one per paying student and send it to them. Redeeming it enrols
        them immediately, so treat a code like a receipt: one student, one code,
        and do not reuse them.
      </p>

      <form action={generateCode} className="card mt-8 p-7">
        <div className="grid gap-5 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
          <div>
            <label
              className="text-ink mb-2 block text-[0.8125rem] font-semibold"
              htmlFor="cohort"
            >
              Cohort
            </label>
            <select id="cohort" name="cohort_id" className={field}>
              {(cohorts ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="text-ink mb-2 block text-[0.8125rem] font-semibold"
              htmlFor="note"
            >
              Note{" "}
              <span className="text-ink-faint font-normal">
                (who it is for, payment reference)
              </span>
            </label>
            <input
              id="note"
              name="note"
              placeholder="Asha Iyer — paid 04 Sep, UPI 8891"
              className={field}
            />
          </div>
          <button
            type="submit"
            className="bg-ink hover:bg-brand-deep rounded-xl px-6 py-3 text-[0.9375rem] font-semibold text-white transition-colors"
          >
            Generate
          </button>
        </div>
      </form>

      {(codes ?? []).length === 0 ? (
        <div className="card mt-6 p-8 text-center">
          <p className="text-ink-soft text-[0.9375rem]">No codes yet.</p>
        </div>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left">
            <thead>
              <tr className="border-line-soft border-b">
                {["Code", "For", "Status"].map((h) => (
                  <th
                    key={h}
                    className="text-ink-faint px-5 py-4 text-[0.75rem] font-semibold tracking-[0.1em] uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(codes ?? []).map((c) => (
                <tr
                  key={c.code}
                  className="border-line-soft border-b last:border-0"
                >
                  <td className="text-ink px-5 py-4 font-mono text-[0.9375rem] font-semibold tracking-wider">
                    {c.code}
                  </td>
                  <td className="text-ink-soft px-5 py-4 text-[0.875rem]">
                    {c.note ?? "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[0.75rem] font-semibold ${
                        c.redeemed_at
                          ? "bg-mist text-ink-faint"
                          : "bg-leaf-wash text-leaf-deep"
                      }`}
                    >
                      {c.redeemed_at ? "used" : "unused"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
