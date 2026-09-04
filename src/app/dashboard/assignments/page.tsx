import Link from "next/link";
import { EnrolmentPanel } from "@/components/dashboard/EnrolmentGate";
import {
  PracticeSheet,
  type Question,
} from "@/components/dashboard/PracticeSheet";
import { SqlPlayground } from "@/components/dashboard/SqlPlayground";
import { createClient, getViewer } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

const TRACKS = [
  { id: "python", label: "Python problems" },
  { id: "sql", label: "SQL questions" },
] as const;

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
    <div className="shell py-8 lg:py-10">
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
        <div className="mt-6">
          <SqlPlayground />
        </div>
      )}

      <PracticeSheet
        questions={(questions ?? []) as Question[]}
        solved={solved}
      />
    </div>
  );
}
