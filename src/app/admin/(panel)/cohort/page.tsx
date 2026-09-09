import { Video } from "lucide-react";
import { updateCohort } from "../actions";
import { cohortRoom } from "@/lib/meeting";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { cohorts as cohortsTable } from "@/lib/db/schema";

/*
 * Rendered per request, never at build time.
 *
 * Without this Next tries each of these during "Generating static pages" to
 * find out whether it can prerender them — which means running the query,
 * against a database the build container cannot reach on the private
 * network. It does not fail; it hangs for sixty seconds and then retries,
 * and the build went from twenty seconds to nearly two minutes. Nothing here
 * could ever be static: it is all somebody's admin panel.
 */
export const dynamic = "force-dynamic";

export default async function AdminCohortPage() {
  const cohorts = (
    await db.select().from(cohortsTable).orderBy(asc(cohortsTable.createdAt))
  ).map((cohort) => ({
    id: cohort.id,
    name: cohort.name,
    seats: cohort.seats,
    is_active: cohort.isActive,
    starts_on: cohort.startsOn,
    ends_on: cohort.endsOn,
    meet_url: cohort.meetUrl,
    room_slug: cohort.roomSlug,
  }));

  const field =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-[0.9375rem] text-ink transition-colors focus:border-brand focus:outline-none";
  const label = "mb-2 block text-[0.8125rem] font-semibold text-ink";

  return (
    <>
      <h1 className="display text-ink text-[1.875rem] sm:text-[2.25rem]">
        Class
      </h1>
      <p className="text-ink-soft mt-3 max-w-2xl text-[0.9375rem] leading-relaxed">
        The class already has a room, and the{" "}
        <strong className="text-ink">Join class</strong> button on each
        student&rsquo;s dashboard opens it.
      </p>

      <div className="mt-8 space-y-6">
        {(cohorts ?? []).map((cohort) => {
          const room = cohortRoom(cohort);
          return (
            <form key={cohort.id} action={updateCohort} className="card p-7">
              <input type="hidden" name="id" value={cohort.id} />
              <h2 className="display text-ink text-[1.375rem]">
                {cohort.name}
              </h2>

              {/* The room ------------------------------------------------ */}
              {room && (
                <div className="border-line bg-mist mt-5 rounded-xl border p-5">
                  <p className="text-ink flex items-center gap-2 text-[0.9375rem] font-semibold">
                    <Video
                      className="text-brand-deep size-4"
                      strokeWidth={2}
                      aria-hidden
                    />
                    {room.custom
                      ? "Using your own meeting link"
                      : "The class room"}
                  </p>
                  <a
                    href={room.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-brand-deep mt-2 block font-mono text-[0.8125rem] break-all underline underline-offset-2"
                  >
                    {room.url}
                  </a>
                  <p className="text-ink-soft mt-3 max-w-prose text-[0.8125rem] leading-relaxed">
                    {room.custom
                      ? "Your link is what students see. Clear the field below to go back to the built-in room."
                      : "Open it and the class starts; open it while a class is running and you join it. Same address every day, nothing to set up or renew."}
                  </p>
                </div>
              )}

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={label} htmlFor={`meet-${cohort.id}`}>
                    Your own meeting link{" "}
                    <span className="text-ink-faint font-normal">
                      (optional — overrides the room above)
                    </span>
                  </label>
                  <input
                    id={`meet-${cohort.id}`}
                    name="meet_url"
                    type="url"
                    defaultValue={cohort.meet_url ?? ""}
                    placeholder="https://meet.google.com/abc-defg-hij"
                    className={field}
                  />
                  <p className="text-ink-faint mt-2 max-w-prose text-[0.8125rem] leading-relaxed">
                    Google Meet has no permanent room on a personal Gmail
                    account &mdash;{" "}
                    <code className="text-ink-soft font-mono">
                      meet.google.com/new
                    </code>{" "}
                    creates a different meeting every time it is opened. To use
                    Meet, make one event in Google Calendar, add a Meet link to
                    it, and paste that link here: it stays valid and behaves the
                    same way.
                  </p>
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
                className="bg-ink hover:bg-brand-deep text-cta-fg mt-7 rounded-full px-6 py-3 text-[0.9375rem] font-semibold transition-colors"
              >
                Save
              </button>
            </form>
          );
        })}
      </div>
    </>
  );
}
