import type { Metadata } from "next";
import { sql } from "drizzle-orm";
import { PageHead, Stat } from "@/components/admin/Business";
import { AgentChat } from "@/components/admin/AgentChat";
import { db } from "@/lib/db";
import { agentTurns } from "@/lib/db/schema";
import { num } from "@/lib/business";
import { inr } from "@/lib/agent/cost";

export const metadata: Metadata = {
  title: "Agent | NectArray Admin",
};

/* Rendered per request: live spend from the database. */
export const dynamic = "force-dynamic";

/**
 * The admin Agent: a chat that reads and changes the panel's projects,
 * tasks, payments and Assets, and answers with the numbers. Above it, what
 * its answers have cost, from agent_turns (India time for "today").
 */
export default async function AdminAgentPage() {
  const ist = sql`(${agentTurns.createdAt} at time zone 'Asia/Kolkata')`;
  const today = sql`${ist}::date = (now() at time zone 'Asia/Kolkata')::date`;
  const month = sql`date_trunc('month', ${ist}) = date_trunc('month', now() at time zone 'Asia/Kolkata')`;
  const [spend] = await db
    .select({
      todayN: sql<number>`count(*) filter (where ${today})::int`,
      todayUsd: sql<string>`coalesce(sum(${agentTurns.costUsd}) filter (where ${today}), 0)`,
      monthN: sql<number>`count(*) filter (where ${month})::int`,
      monthUsd: sql<string>`coalesce(sum(${agentTurns.costUsd}) filter (where ${month}), 0)`,
      allN: sql<number>`count(*)::int`,
      allUsd: sql<string>`coalesce(sum(${agentTurns.costUsd}), 0)`,
    })
    .from(agentTurns);
  const answers = (n: number) => `${n} answer${n === 1 ? "" : "s"}`;
  const average = spend.allN ? num(spend.allUsd) / spend.allN : 0;

  return (
    <>
      <PageHead
        title="Agent"
        lede="Talk or type to it. It adds, changes and deletes projects, tasks, payments and Assets entries, and answers with the numbers: revenue, what is due and late, who has what, and website visits. Every answer shows what it cost."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat
          label="Spent today"
          value={inr(num(spend.todayUsd))}
          hint={answers(spend.todayN)}
        />
        <Stat
          label="This month"
          value={inr(num(spend.monthUsd))}
          hint={answers(spend.monthN)}
        />
        <Stat
          label="All time"
          value={inr(num(spend.allUsd))}
          hint={answers(spend.allN)}
        />
        <Stat label="Per answer" value={inr(average)} hint="On average" />
      </div>

      <AgentChat />
    </>
  );
}
