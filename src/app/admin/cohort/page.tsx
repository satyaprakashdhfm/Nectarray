import { updateCohort } from "../actions";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCohortPage() {
  const supabase = await createClient();
  const { data: cohorts } = await supabase
    .from("cohorts")
    .select("*")
    .order("created_at");

  const field =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-[0.9375rem] text-ink transition-colors focus:border-brand focus:outline-none";
  const label = "mb-2 block text-[0.8125rem] font-semibold text-ink";

  return (
    <>
      <h1 className="display text-ink text-[1.875rem] sm:text-[2.25rem]">
        Cohort
      </h1>
      <p className="text-ink-soft mt-3 text-[0.9375rem]">
        The meeting link here is what the{" "}
        <strong className="text-ink">Join class</strong> button on every
        enrolled student&rsquo;s dashboard opens.
      </p>

      <div className="mt-8 space-y-6">
        {(cohorts ?? []).map((cohort) => (
          <form key={cohort.id} action={updateCohort} className="card p-7">
            <input type="hidden" name="id" value={cohort.id} />
            <h2 className="display text-ink text-[1.375rem]">{cohort.name}</h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={label} htmlFor={`meet-${cohort.id}`}>
                  Google Meet link
                </label>
                <input
                  id={`meet-${cohort.id}`}
                  name="meet_url"
                  type="url"
                  defaultValue={cohort.meet_url ?? ""}
                  placeholder="https://meet.google.com/abc-defg-hij"
                  className={field}
                />
              </div>
              <div>
                <label className={label} htmlFor={`seats-${cohort.id}`}>
                  Seats
                </label>
                <input
                  id={`seats-${cohort.id}`}
                  name="seats"
                  type="number"
                  min={1}
                  defaultValue={cohort.seats}
                  className={field}
                />
              </div>
              <div />
              <div>
                <label className={label} htmlFor={`starts-${cohort.id}`}>
                  Starts on
                </label>
                <input
                  id={`starts-${cohort.id}`}
                  name="starts_on"
                  type="date"
                  defaultValue={cohort.starts_on ?? ""}
                  className={field}
                />
              </div>
              <div>
                <label className={label} htmlFor={`ends-${cohort.id}`}>
                  Ends on
                </label>
                <input
                  id={`ends-${cohort.id}`}
                  name="ends_on"
                  type="date"
                  defaultValue={cohort.ends_on ?? ""}
                  className={field}
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-ink hover:bg-brand-deep mt-7 rounded-full px-6 py-3 text-[0.9375rem] font-semibold text-white transition-colors"
            >
              Save cohort
            </button>
          </form>
        ))}
      </div>
    </>
  );
}
