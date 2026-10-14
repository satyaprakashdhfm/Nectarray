import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { generateText, isStepCount } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { agentTurns } from "@/lib/db/schema";
import { AccessError, requireAdmin } from "@/lib/auth/access";
import { agentTools, type AgentAction } from "@/lib/agent/tools";
import { costOf } from "@/lib/agent/cost";
import { num } from "@/lib/business";
import { todayIST } from "@/lib/work";

/**
 * The admin Agent: a message (typed or spoken) in, an answer out, with the
 * panel's records read and changed along the way through the tools in
 * lib/agent/tools.ts. Each answer is saved to agent_turns with its tokens
 * and cost, which the chat shows under the answer; GET totals today's and
 * this month's spend for the chat's header.
 *
 * Only for an admin all the way in. Gemini, on the key the site already
 * has; AGENT_MODEL picks another one.
 */
export const runtime = "nodejs";
export const maxDuration = 120;

const MODEL =
  process.env.AGENT_MODEL ?? process.env.GEMINI_MODEL ?? "gemini-3.6-flash";

const Body = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(20_000),
      }),
    )
    .min(1)
    .max(40),
});

function instructions(today: string) {
  const weekday = new Date(`${today}T12:00:00Z`).toLocaleDateString("en-IN", {
    weekday: "long",
    timeZone: "UTC",
  });
  return `You are the NectArray admin assistant. NectArray is a small company in India doing marketing, software and agentic-AI projects for clients, and an academy. You work inside its admin panel and can read and change its records with your tools: client projects, their tasks, payments received, and the company's money (Assets). You can also report on revenue, work and website visits.

Today is ${weekday}, ${today} (India time). Turn words like "Friday", "next week", "end of the month" into real YYYY-MM-DD dates; a week ends on Sunday.

How to work:
- The admin often speaks rather than types, so names may be misheard. Find a project by searching a short part of its name. If several match or none do, list the closest and ask; never guess between two.
- When given a list of tasks for a project, add them all in one add_tasks call. Use the end dates, people and priorities the admin gives; leave out what they did not say.
- Change only what was asked. Before deleting anything, say exactly what will be deleted and ask for a yes, unless the admin's latest message already asks to delete that specific item.
- Never claim you did something unless the tool call succeeded. If a tool returns an error, say so plainly.
- After a change, confirm it in one or two short lines, mentioning the end dates involved.
- For numbers, call the tools and answer from what they return; never make figures up. Money is in Indian rupees: write ₹1,20,000 style. Keep answers short. Use a small markdown table when listing more than three tasks or projects. Do not show ids unless asked.`;
}

/** What the Agent's answers have cost today and this month (India time). */
export async function GET() {
  try {
    await requireAdmin();
  } catch (error) {
    const status = error instanceof AccessError ? error.status : 401;
    return NextResponse.json({ error: "Not allowed." }, { status });
  }
  const ist = sql`(${agentTurns.createdAt} at time zone 'Asia/Kolkata')`;
  const today = sql`${ist}::date = (now() at time zone 'Asia/Kolkata')::date`;
  const month = sql`date_trunc('month', ${ist}) = date_trunc('month', now() at time zone 'Asia/Kolkata')`;
  const [spend] = await db
    .select({
      todayN: sql<number>`count(*) filter (where ${today})::int`,
      todayUsd: sql<string>`coalesce(sum(${agentTurns.costUsd}) filter (where ${today}), 0)`,
      monthN: sql<number>`count(*) filter (where ${month})::int`,
      monthUsd: sql<string>`coalesce(sum(${agentTurns.costUsd}) filter (where ${month}), 0)`,
    })
    .from(agentTurns);
  return NextResponse.json({
    todayN: spend.todayN,
    todayUsd: num(spend.todayUsd),
    monthN: spend.monthN,
    monthUsd: num(spend.monthUsd),
  });
}

export async function POST(request: Request) {
  let email: string;
  try {
    email = (await requireAdmin()).email;
  } catch (error) {
    const status = error instanceof AccessError ? error.status : 401;
    return NextResponse.json({ error: "Not allowed." }, { status });
  }
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY)
    return NextResponse.json(
      { error: "No AI key is configured (GOOGLE_GENERATIVE_AI_API_KEY)." },
      { status: 503 },
    );

  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  const { messages } = parsed.data;
  const question = messages.at(-1)!;
  if (question.role !== "user" || !question.content.trim())
    return NextResponse.json({ error: "Ask something." }, { status: 400 });

  const today = todayIST();
  const actions: AgentAction[] = [];
  const began = Date.now();
  try {
    const result = await generateText({
      model: google(MODEL),
      instructions: instructions(today),
      messages,
      tools: agentTools(actions),
      stopWhen: isStepCount(10),
      abortSignal: AbortSignal.timeout(100_000),
    });

    const inputTokens = result.totalUsage.inputTokens ?? 0;
    const outputTokens = result.totalUsage.outputTokens ?? 0;
    const costUsd = costOf(MODEL, today, inputTokens, outputTokens);
    const ms = Date.now() - began;
    const answer =
      result.text.trim() ||
      (actions.length ? "Done." : "I could not work that out. Try again.");

    await db.insert(agentTurns).values({
      question: question.content.slice(0, 20_000),
      answer,
      model: MODEL,
      inputTokens,
      outputTokens,
      costUsd: costUsd === null ? null : String(costUsd),
      actions,
      ms,
      askedBy: email,
    });
    if (actions.length) revalidatePath("/admin", "layout");

    return NextResponse.json({
      answer,
      actions,
      usage: { model: MODEL, inputTokens, outputTokens, costUsd, ms },
    });
  } catch (error) {
    console.error("[agent]", error);
    // Some tools may already have run: say what changed before it broke.
    if (actions.length) revalidatePath("/admin", "layout");
    return NextResponse.json(
      {
        error: "The assistant could not answer. Try again.",
        actions,
      },
      { status: 502 },
    );
  }
}
