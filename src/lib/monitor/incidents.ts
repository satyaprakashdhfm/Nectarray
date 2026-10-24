import { and, desc, eq, gte, isNotNull, isNull } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { company } from "@/lib/content";

/**
 * Incidents: anything down, from either feed (Railway's webhook, the uptime
 * checker), kept in one table and shown on the Workspace.
 *
 * Opening one that is already open only refreshes it, so a service that
 * crashes five times in a row is one incident and one email. Recovery closes
 * it and sends the all-clear.
 *
 * Emails go through Resend (RESEND_KEY, as the contact form) to ALERT_EMAIL,
 * falling back to the contact address. No key means the board still works,
 * just without the email.
 *
 * No "server-only" here: the uptime checker starts from instrumentation.ts,
 * which is not a React server module.
 */

const { serviceIncidents } = schema;

export type IncidentInput = {
  source: "railway" | "uptime";
  target: string;
  project: string;
  title: string;
  detail?: string;
  href?: string | null;
};

export type Incident = {
  id: string;
  source: string;
  target: string;
  project: string;
  title: string;
  detail: string;
  href: string | null;
  openedAt: string;
  lastSeenAt: string;
  resolvedAt: string | null;
};

/** Opens an incident, or refreshes the open one for the same target. */
export async function openIncident(input: IncidentInput): Promise<void> {
  const [open] = await db
    .select({ id: serviceIncidents.id })
    .from(serviceIncidents)
    .where(
      and(
        eq(serviceIncidents.target, input.target),
        isNull(serviceIncidents.resolvedAt),
      ),
    )
    .limit(1);

  if (open) {
    await db
      .update(serviceIncidents)
      .set({
        lastSeenAt: new Date(),
        title: input.title,
        detail: input.detail ?? "",
      })
      .where(eq(serviceIncidents.id, open.id));
    return;
  }

  await db.insert(serviceIncidents).values({
    source: input.source,
    target: input.target,
    project: input.project,
    title: input.title,
    detail: input.detail ?? "",
    href: input.href ?? null,
  });
  await alert(
    `DOWN: ${input.title}`,
    [input.title, input.detail, input.href].filter(Boolean).join("\n\n"),
  );
}

/** Closes the open incident for a target, if there is one. */
export async function resolveIncident(target: string, note: string) {
  const closed = await db
    .update(serviceIncidents)
    .set({ resolvedAt: new Date() })
    .where(
      and(
        eq(serviceIncidents.target, target),
        isNull(serviceIncidents.resolvedAt),
      ),
    )
    .returning({
      title: serviceIncidents.title,
      openedAt: serviceIncidents.openedAt,
      href: serviceIncidents.href,
    });

  for (const row of closed) {
    const minutes = Math.max(
      1,
      Math.round((Date.now() - row.openedAt.getTime()) / 60_000),
    );
    await alert(
      `Recovered: ${row.title}`,
      [`${note} Down for about ${minutes} min.`, row.href]
        .filter(Boolean)
        .join("\n\n"),
    );
  }
}

/** Everything still open, and what recovered in the last week. */
export async function recentIncidents(): Promise<Incident[]> {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60_000);
  const [open, resolved] = await Promise.all([
    db
      .select()
      .from(serviceIncidents)
      .where(isNull(serviceIncidents.resolvedAt))
      .orderBy(desc(serviceIncidents.openedAt)),
    db
      .select()
      .from(serviceIncidents)
      .where(
        and(
          isNotNull(serviceIncidents.resolvedAt),
          gte(serviceIncidents.resolvedAt, weekAgo),
        ),
      )
      .orderBy(desc(serviceIncidents.resolvedAt))
      .limit(10),
  ]);

  return [...open, ...resolved].map((row) => ({
    id: row.id,
    source: row.source,
    target: row.target,
    project: row.project,
    title: row.title,
    detail: row.detail,
    href: row.href,
    openedAt: row.openedAt.toISOString(),
    lastSeenAt: row.lastSeenAt.toISOString(),
    resolvedAt: row.resolvedAt?.toISOString() ?? null,
  }));
}

async function alert(subject: string, text: string) {
  const apiKey = process.env.RESEND_KEY;
  if (!apiKey) return;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.CONTACT_FROM_EMAIL ??
          `${company.name} <onboarding@resend.dev>`,
        to: [
          process.env.ALERT_EMAIL ??
            ownerEmail() ??
            process.env.CONTACT_TO_EMAIL ??
            company.email,
        ],
        subject,
        text,
      }),
    });
    if (!response.ok)
      console.error(
        `[monitor] Resend responded ${response.status}:`,
        await response.text(),
      );
  } catch (error) {
    console.error("[monitor] Alert email failed:", error);
  }
}

/**
 * Without ALERT_EMAIL, alerts go to the owner: the admin address that starts
 * with "satyaprakash" in ADMIN_EMAILS (read the same way as in auth/access.ts).
 */
function ownerEmail(): string | undefined {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(/[\s,;]+/)
    .map((e) => e.replace(/^["']+|["']+$/g, "").toLowerCase())
    .find((e) => e.startsWith("satyaprakash") && e.includes("@"));
}
