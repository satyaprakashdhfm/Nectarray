import Link from "next/link";
import { EnrolmentPanel } from "@/components/dashboard/EnrolmentGate";
import {
  PracticeSheet,
  type Question,
} from "@/components/dashboard/PracticeSheet";
import { createClient, getViewer } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

const TRACKS = [
  { id: "python", label: "Python problems" },
  { id: "sql", label: "SQL questions" },
] as const;

/** The practice database SQL questions are written against. */
const SCHEMA = [
  "courses(course_id, course_name, duration_days, fee)",
  "students(student_id, name, city, age, course_id, marks, joined_on)",
  "employees(emp_id, emp_name, manager_id, salary, department)",
  "payments(payment_id, student_id, amount, paid_on, method)",
];

export default async function AssignmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string }>;
}) {
  const { enrolment } = await getViewer();
  const status = enrolment?.status ?? "none";
  if (status !== "enrolled" && status !== "completed") {
    return <EnrolmentPanel status={status} />;
  }

  const { track: requested } = await searchParams;
  const track = requested === "sql" ? "sql" : "python";

  const supabase = await createClient();
  const [{ data: questions }, { data: progress }] = await Promise.all([
    supabase
      .from("practice_questions")
      .select(
        "id, track, topic, difficulty, position, title, prompt_md, hint_md, solution_sql, leetcode_url",
      )
      .eq("track", track)
      .eq("is_published", true)
      .order("position"),
    supabase.from("practice_progress").select("question_id"),
  ]);

  const solved = (progress ?? []).map((row) => row.question_id as string);

  return (
    <>
      <h1 className="display text-ink text-[1.875rem] sm:text-[2.25rem]">
        Assignments
      </h1>
      <p className="text-ink-soft mt-3 max-w-2xl text-[0.9375rem] leading-relaxed">
        {track === "python"
          ? "Arrays, strings and dictionaries, easy to hard. Solve each one on LeetCode and tick it off here — deliberately not a full DSA grind, just the patterns that actually come up in screens."
          : "Written against the training database below, ordered easy to hard. Every question has a hint, and a solution you should only open after a real attempt."}
      </p>

      {/* Track switch ---------------------------------------------------- */}
      <nav aria-label="Practice track" className="mt-6">
        <ul className="border-line bg-surface inline-flex gap-1 rounded-full border p-1">
          {TRACKS.map((entry) => (
            <li key={entry.id}>
              <Link
                href={`/dashboard/assignments?track=${entry.id}`}
                aria-current={track === entry.id ? "page" : undefined}
                className={cn(
                  "inline-flex rounded-full px-4 py-2 text-[0.875rem] font-medium transition-colors",
                  track === entry.id
                    ? "bg-ink text-white"
                    : "text-ink-soft hover:bg-mist hover:text-ink",
                )}
              >
                {entry.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {track === "sql" && (
        <div className="card mt-6 p-5 sm:p-6">
          <h2 className="eyebrow">The practice database</h2>
          <ul className="mt-4 space-y-1.5">
            {SCHEMA.map((table) => (
              <li
                key={table}
                className="text-ink-soft font-mono text-[0.8125rem]"
              >
                {table}
              </li>
            ))}
          </ul>
        </div>
      )}

      <PracticeSheet
        questions={(questions ?? []) as Question[]}
        solved={solved}
      />
    </>
  );
}
