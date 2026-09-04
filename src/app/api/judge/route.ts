import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isCorrect } from "@/lib/judge";
import { getProblem } from "@/lib/python-tests";

/**
 * Judging a Python submission.
 *
 * This sits between the student and the runner, and it is where everything
 * that matters happens: who is asking, how often they may ask, which problem
 * this is, what the right answer looks like, and what they are allowed to be
 * told about why they were wrong. The runner downstream knows none of it — it
 * receives code and inputs, and reports what came back.
 *
 * That split is deliberate. The expected outputs never reach the machine
 * executing untrusted code, and they never reach the browser either.
 */

export const runtime = "nodejs";
export const maxDuration = 30;

const RUNNER_URL = process.env.JUDGE_URL ?? "";
const RUNNER_TOKEN = process.env.JUDGE_TOKEN ?? "";

/** Per user, per minute. A judge is not a compute service. */
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;

/*
 * In memory, and therefore per instance — which is the honest amount of
 * effort for a cohort this size. It stops a stuck retry loop, not a determined
 * attacker; if that ever matters this moves to a table with a unique index on
 * (user, minute).
 */
const hits = new Map<string, number[]>();

function rateLimited(userId: string): boolean {
  const now = Date.now();
  const recent = (hits.get(userId) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS,
  );
  recent.push(now);
  hits.set(userId, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }

  return recent.length > RATE_LIMIT;
}

type Body = { questionId?: unknown; slug?: unknown; source?: unknown };

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  if (!RUNNER_URL || !RUNNER_TOKEN) {
    return NextResponse.json(
      {
        error:
          "The judge is not configured yet. Set JUDGE_URL and JUDGE_TOKEN on the deployment.",
      },
      { status: 503 },
    );
  }

  if (rateLimited(user.id)) {
    return NextResponse.json(
      { error: "That is a lot of runs in a minute. Give it a moment." },
      { status: 429 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const { questionId, slug, source } = body;
  if (
    typeof questionId !== "string" ||
    typeof slug !== "string" ||
    typeof source !== "string"
  ) {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  if (source.length > 64_000) {
    return NextResponse.json({ error: "That is too long." }, { status: 413 });
  }

  const problem = await getProblem(slug);
  if (!problem) {
    return NextResponse.json({ error: "Unknown problem." }, { status: 404 });
  }

  // The runner gets the inputs and nothing else — no expectations travel to
  // the machine that runs student code.
  let payload: {
    results?: { got?: unknown; error?: string }[];
    fatal?: string;
    timeout?: boolean;
    ms?: number;
  };

  try {
    const response = await fetch(`${RUNNER_URL.replace(/\/$/, "")}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Judge-Token": RUNNER_TOKEN,
      },
      body: JSON.stringify({
        source,
        entry: problem.entry_point,
        cases: problem.tests.cases.map((c) => ({ args: c.args })),
        compare: problem.tests.compare,
      }),
      signal: AbortSignal.timeout(25_000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `The runner returned ${response.status}.` },
        { status: 502 },
      );
    }
    payload = await response.json();
  } catch {
    return NextResponse.json(
      { error: "The runner could not be reached. Try again in a moment." },
      { status: 502 },
    );
  }

  if (payload.timeout) {
    return NextResponse.json({ verdict: "timeout", ms: payload.ms ?? null });
  }
  if (payload.fatal) {
    return NextResponse.json({
      verdict: "error",
      message: payload.fatal,
      ms: payload.ms ?? null,
    });
  }

  const cases = problem.tests.cases;
  const raw = payload.results ?? [];
  const results = cases.map((testCase, i) => ({
    ok:
      raw[i] !== undefined &&
      raw[i].error === undefined &&
      isCorrect(raw[i].got, testCase.expect, problem.tests.compare),
    error: raw[i]?.error,
  }));

  const passed = results.filter((r) => r.ok).length;
  const accepted = passed === cases.length && cases.length > 0;

  /*
   * On failure the student sees one case — the first that failed — with its
   * input, the expected value and what they returned. That is how LeetCode
   * does it and it is the right amount: enough to debug, not enough to read
   * the whole answer key off a handful of wrong submissions.
   */
  const index = results.findIndex((r) => !r.ok);
  const failing =
    index === -1
      ? null
      : {
          number: index + 1,
          args: cases[index].args,
          expect: cases[index].expect,
          got: raw[index]?.got ?? null,
          error: results[index].error ?? null,
        };

  if (accepted) {
    const admin = createAdminClient();
    if (admin) {
      await admin
        .from("practice_progress")
        .upsert(
          { user_id: user.id, question_id: questionId },
          { onConflict: "user_id,question_id" },
        );
    }
  }

  return NextResponse.json({
    verdict: accepted ? "accepted" : "wrong",
    passed,
    total: cases.length,
    ms: payload.ms ?? null,
    results: results.map((r) => r.ok),
    failing,
  });
}
