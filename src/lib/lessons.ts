import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type Lesson = {
  id: string;
  module_id: string;
  day_label: string;
  title: string;
  summary: string | null;
  body_md: string | null;
  position: number;
};

/**
 * One lesson, fetched at most once per request.
 *
 * Both the documentation shell and the article itself need the body — the
 * shell to build the contents list in the rail, the page to render it. Left
 * alone that is the same 40 KB row pulled twice over the same request.
 */
export const getLesson = cache(async (id: string): Promise<Lesson | null> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lessons")
    .select("id, module_id, day_label, title, summary, body_md, position")
    .eq("id", id)
    .maybeSingle();
  return (data as Lesson | null) ?? null;
});

/**
 * The lesson id in a `/dashboard/notes/<id>` path, or null anywhere else.
 *
 * Guarded by a UUID shape so a future sibling route — `/dashboard/notes/new`,
 * say — cannot be mistaken for a lesson and sent to the database.
 */
export function lessonIdFromPath(pathname: string | null): string | null {
  if (!pathname) return null;
  const match = /^\/dashboard\/notes\/([0-9a-f-]{36})\/?$/i.exec(pathname);
  return match ? match[1] : null;
}

/**
 * Strips the leading H1 from a lesson body.
 *
 * Every imported note opens with its own title, and the page renders that
 * title above the body already — so the reader met "Day 1 - Python
 * Programming Fundamentals" twice, once as the page heading and again as the
 * first line of the article, with a rule between them.
 *
 * Only a heading appearing before any other content is removed; an H1 further
 * down is a real section and stays.
 */
export function stripLeadingHeading(markdown: string): string {
  return markdown.replace(/^\s*#\s+[^\n]*\n+/, "");
}
