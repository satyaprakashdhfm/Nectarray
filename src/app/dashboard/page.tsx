import { Video } from "lucide-react";
import { EnrolmentPanel } from "@/components/dashboard/EnrolmentGate";
import { academy } from "@/lib/content";
import { getViewer } from "@/lib/supabase/server";

/** The 45 days spread over the 12 weeks the cohort actually runs. */
const WEEKS = 12;

export default async function DashboardPage() {
  const { profile, enrolment } = await getViewer();
  const status = enrolment?.status ?? "none";
  const active = status === "enrolled" || status === "completed";

  if (!active) {
    return (
      <>
        <Heading name={profile?.first_name} />
        <div className="mt-8">
          <EnrolmentPanel status={status} />
        </div>
      </>
    );
  }

  const cohort = enrolment?.cohorts as {
    name?: string;
    meet_url?: string;
  } | null;

  return (
    <div className="shell py-8 lg:py-10">
      <Heading name={profile?.first_name} />

      {/* Live class ------------------------------------------------------ */}
      <div className="border-night-line bg-night relative mt-8 overflow-hidden rounded-2xl border p-7 text-white sm:p-8">
        <div
          className="bg-leaf/20 pointer-events-none absolute -top-24 -right-16 size-64 rounded-full blur-[90px]"
          aria-hidden
        />
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-white/40 uppercase">
              {cohort?.name ?? "Your cohort"}
            </p>
            <p className="display mt-2 text-[1.5rem]">Today&rsquo;s class</p>
            <p className="mt-1.5 text-[0.9375rem] text-white/60">
              {cohort?.meet_url
                ? "The room is open — join when you are ready."
                : "No meeting link has been set for this cohort yet."}
            </p>
          </div>

          {cohort?.meet_url && (
            <a
              href={cohort.meet_url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-night hover:bg-leaf inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[0.9375rem] font-semibold transition-colors"
            >
              <Video className="size-4" strokeWidth={2} aria-hidden />
              Join class
            </a>
          )}
        </div>
      </div>

      {/* Path ------------------------------------------------------------ */}
      <section className="mt-8">
        <h2 className="eyebrow">Your path</h2>
        <p className="text-ink-soft mt-3 text-[0.9375rem] leading-relaxed">
          45 days of material across {WEEKS} weeks, in three modules. Notes open
          as each day is taught.
        </p>

        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {academy.course.curriculum.map((module) => (
            <li key={module.n} className="card p-6">
              <span className="text-ink-faint font-mono text-[0.75rem]">
                {module.n}
              </span>
              <h3 className="text-ink mt-2 text-[1.0625rem] font-semibold">
                {module.title}
              </h3>
              <p className="text-ink-faint mt-1 text-[0.8125rem]">
                {module.days} · {module.topics.length} topics
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Heading({ name }: { name?: string | null }) {
  return (
    <header>
      <h1 className="display text-ink text-[1.875rem] sm:text-[2.25rem]">
        {name ? `Welcome back, ${name}.` : "Welcome back."}
      </h1>
    </header>
  );
}
