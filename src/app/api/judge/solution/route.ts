import { NextResponse } from "next/server";
import { getProblem } from "@/lib/python-tests";
import { createClient } from "@/lib/supabase/server";

/**
 * The reference solution for one problem, on request.
 *
 * Behind an endpoint rather than in the page, for the same reason the test
 * cases are: a student who wants it can have it, but it should be something
 * they chose to look at, not something sitting in the markup of every problem
 * they open.
 */
export const runtime = "nodejs";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const slug = new URL(request.url).searchParams.get("slug") ?? "";
  const problem = await getProblem(slug);
  if (!problem) {
    return NextResponse.json({ error: "Unknown problem." }, { status: 404 });
  }

  return NextResponse.json({ solution: problem.solution_py });
}
