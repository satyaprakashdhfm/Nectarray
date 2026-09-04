import Link from "next/link";
import { EnrolmentPanel } from "@/components/dashboard/EnrolmentGate";
import {
  PythonJudge,
  type PyQuestion,
} from "@/components/dashboard/PythonJudge";
import { briefs } from "@/lib/python-tests";
import {
  SqlPractice,
  type SqlQuestion,
} from "@/components/dashboard/SqlPractice";
import { createClient, getAccess } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

const TRACKS = [
  { id: "python", label: "Python problems" },
  { id: "sql", label: "SQL questions" },
] as const;

function TrackTabs({ track }: { track: string }) {
  return (
    <nav aria-label="Practice track">
      <ul className="border-line bg-surface inline-flex gap-1 rounded-full border p-1">
        {TRACKS.map((entry) => (
          <li key={entry.id}>
            <Link
              href={`/dashboard/assignments?track=${entry.id}`}
              aria-current={track === entry.id ? "page" : undefined}
              className={cn(
                "inline-flex rounded-full px-4 py-1.5 text-[0.875rem] font-medium transition-colors",
                track === entry.id
                  ? "bg-ink text-cta-fg"
                  : "text-ink-soft hover:bg-mist hover:text-ink",
              )}
            >
              {entry.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default async function AssignmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string }>;
}) {
  const { active, status } = await getAccess();
  if (!active) {
    return (
      <div className="shell py-8 lg:py-10">
        <EnrolmentPanel status={status} />
      </div>
    );
  }

  const { track: requested } = await searchParams;
  const track = requested === "sql" ? "sql" : "python";

  const supabase = await createClient();
  const [{ data: questions }, { data: progress }] = await Promise.all([
    supabase
      .from("practice_questions")
      .select(
        "id, track, topic, difficulty, position, title, prompt_md, hint_md, solution_sql, leetcode_url, mysql_note, expected_result, has_judge",
      )
      .eq("track", track)
      .eq("is_published", true)
      .order("position"),
    supabase.from("practice_progress").select("question_id"),
  ]);

  // Starter code and a few sample cases per problem. The expectations behind
  // the rest of the cases stay on the server.
  const problemBriefs = track === "python" ? await briefs() : {};

  /*
   * Progress is stored per question, so it spans both tracks. Narrow it to
   * the questions actually on this page — otherwise the Python sheet counted
   * SQL solves in its total while the easy/medium/hard breakdown, which only
   * looks at questions it can see, stayed at zero. One solved SQL question
   * showed up as "1 / 54" over three zeroes.
   */
  const onThisTrack = new Set((questions ?? []).map((row) => row.id as string));
  const solved = (progress ?? [])
    .map((row) => row.question_id as string)
    .filter((id) => onThisTrack.has(id));

  /*
   * Both tracks get the whole viewport. They are tools, not pages: something
   * to read, something to write and a result to compare, all wanted at once.
   * Wrapping either in the usual 80rem gutter left it competing for a third of
   * a desktop screen with empty margins on either side.
   */
  return (
    <div className="flex h-[calc(100dvh-125px)] flex-col">
      <div className="border-line bg-canvas flex shrink-0 items-center gap-4 border-b px-4 py-2.5">
        <TrackTabs track={track} />
        <p className="text-ink-faint hidden text-[0.8125rem] xl:block">
          {track === "sql"
            ? "Written against the training database on the left. Run a query that matches the expected output and it ticks itself off."
            : "Write the solution and run it against the test cases. It executes in your browser — pass them all and it ticks itself off."}
        </p>
      </div>
      <div className="min-h-0 flex-1">
        {track === "sql" ? (
          <SqlPractice
            questions={(questions ?? []) as unknown as SqlQuestion[]}
            solved={solved}
          />
        ) : (
          <PythonJudge
            questions={(questions ?? []) as unknown as PyQuestion[]}
            briefs={problemBriefs}
            solved={solved}
          />
        )}
      </div>
    </div>
  );
}
