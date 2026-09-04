import Link from "next/link";
import { ArrowRight, BookOpen, PenSquare, Video } from "lucide-react";
import { EnrolmentPanel } from "@/components/dashboard/EnrolmentGate";
import { cohortRoom } from "@/lib/meeting";
import { createClient, getAccess } from "@/lib/supabase/server";
import { displayName } from "@/lib/utils";

type ModuleRow = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  position: number;
  lessons: { id: string; position: number }[];
};

export default async function DashboardPage() {
  const { profile, enrolment, active, status } = await getAccess();
  const name = displayName(profile?.first_name);

  if (!active) {
    return (
      <div className="shell py-8 lg:py-10">
        <Heading name={name} />
        <div className="mt-8">
          <EnrolmentPanel status={status} />
        </div>
      </div>
    );
  }

  const cohort = enrolment?.cohorts as {
    name?: string;
    meet_url?: string | null;
    room_slug?: string | null;
  } | null;
  const room = cohort ? cohortRoom(cohort) : null;

  const supabase = await createClient();
  const [{ data: modules }, { data: questions }, { data: progress }] =
    await Promise.all([
      supabase
        .from("modules")
        .select("id, slug, title, summary, position, lessons(id, position)")
        .order("position"),
      supabase
        .from("practice_questions")
        .select("id, track")
        .eq("is_published", true),
      supabase.from("practice_progress").select("question_id"),
    ]);

  const solvedIds = new Set((progress ?? []).map((row) => row.question_id));
  const track = (name: string) => {
    const rows = (questions ?? []).filter((q) => q.track === name);
    return {
      done: rows.filter((q) => solvedIds.has(q.id)).length,
      total: rows.length,
    };
  };
  const python = track("python");
  const sql = track("sql");

  const taught = ((modules ?? []) as ModuleRow[]).filter(
    (m) => m.lessons.length > 0,
  );

  return (
    <div className="shell py-8 lg:py-10">
      <Heading name={name} />

      {/* Live class ------------------------------------------------------ */}
      <div className="border-night-line bg-night relative mt-8 overflow-hidden rounded-2xl border p-7 text-white sm:p-8">
        <div
          className="bg-leaf/20 pointer-events-none absolute -top-24 -right-16 size-64 rounded-full blur-[90px]"
          aria-hidden
        />
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-white/40 uppercase">
              Live class
            </p>
            <p className="display mt-2 text-[1.5rem]">Today&rsquo;s class</p>
            <p className="mt-1.5 text-[0.9375rem] text-white/60">
              {room
                ? "Always the same room. Open it and wait, or join whoever is already there."
                : "No meeting link has been set yet."}
            </p>
          </div>

          {room && (
            <a
              href={room.url}
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

      {/* Practice -------------------------------------------------------- */}
      <section className="mt-8">
        <h2 className="eyebrow">Your practice</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ProgressCard
            href="/dashboard/assignments?track=python"
            label="Python problems"
            done={python.done}
            total={python.total}
          />
          <ProgressCard
            href="/dashboard/assignments?track=sql"
            label="SQL questions"
            done={sql.done}
            total={sql.total}
          />
        </div>
      </section>

      {/* Path ------------------------------------------------------------ */}
      <section className="mt-8">
        <h2 className="eyebrow">Your path</h2>
        <p className="text-ink-soft mt-3 max-w-2xl text-[0.9375rem] leading-relaxed">
          Notes open as each day is taught. Pick up wherever you left off.
        </p>

        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {taught.map((module) => {
            const first = [...module.lessons].sort(
              (a, b) => a.position - b.position,
            )[0];
            return (
              <li key={module.id}>
                {/*
                 * These were plain cards before — they looked exactly like
                 * something you press, and pressing them did nothing. Now
                 * each one opens the first lesson of its module.
                 */}
                <Link
                  href={`/dashboard/notes/${first.id}`}
                  className="card card-hover group flex h-full flex-col p-6"
                >
                  <span className="bg-brand-wash text-brand-deep grid size-10 place-items-center rounded-xl">
                    <BookOpen
                      className="size-[1.125rem]"
                      strokeWidth={1.9}
                      aria-hidden
                    />
                  </span>
                  <h3 className="text-ink mt-4 text-[1.0625rem] font-semibold">
                    {module.title}
                  </h3>
                  <p className="text-ink-faint mt-1 text-[0.8125rem]">
                    {module.lessons.length} lesson
                    {module.lessons.length === 1 ? "" : "s"} published
                  </p>
                  <span className="text-brand-deep mt-4 inline-flex items-center gap-1.5 text-[0.875rem] font-semibold">
                    Open notes
                    <ArrowRight
                      className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                      strokeWidth={2.25}
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function ProgressCard({
  href,
  label,
  done,
  total,
}: {
  href: string;
  label: string;
  done: number;
  total: number;
}) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <Link href={href} className="card card-hover group block p-6">
      <div className="flex items-center justify-between gap-4">
        <span className="text-ink inline-flex items-center gap-2.5 text-[0.9375rem] font-semibold">
          <PenSquare className="size-4" strokeWidth={2} aria-hidden />
          {label}
        </span>
        <span className="text-ink-faint font-mono text-[0.875rem]">
          {done} / {total}
        </span>
      </div>
      <span className="bg-mist mt-4 block h-2 overflow-hidden rounded-full">
        <span
          className="bg-leaf-deep block h-full rounded-full transition-[width] duration-700"
          style={{ width: `${pct}%` }}
        />
      </span>
      <span className="text-brand-deep mt-4 inline-flex items-center gap-1.5 text-[0.875rem] font-semibold">
        Continue
        <ArrowRight
          className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
          strokeWidth={2.25}
          aria-hidden
        />
      </span>
    </Link>
  );
}

function Heading({ name }: { name: string }) {
  return (
    <header>
      <h1 className="display text-ink text-[1.875rem] sm:text-[2.25rem]">
        {name ? `Welcome back, ${name}.` : "Welcome back."}
      </h1>
    </header>
  );
}
