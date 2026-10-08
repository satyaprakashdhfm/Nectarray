import "server-only";
import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { and, count, desc, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { adminCodes } from "@/lib/db/schema";
import { company } from "@/lib/content";

/**
 * The panel's second step: a six-digit code emailed to whoever just signed
 * in with Google, needed once per admin session. Sessions last five hours
 * (session.ts), so every admin enters a fresh code at least that often.
 *
 * - A code belongs to one session and is stored only as a hash salted with
 *   that session, so it cannot be replayed from a backup or another browser.
 * - Ten minutes to use it, five guesses, then it is dead.
 * - At most one email a minute and six an hour per admin, so the button
 *   cannot be used to flood a mailbox.
 */

const CODE_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const RESEND_GAP_MS = 60 * 1000;
const HOURLY_LIMIT = 6;

const digest = (sessionHash: string, code: string) =>
  createHash("sha256").update(`${sessionHash}:${code}`).digest();

export type SendResult =
  { ok: true; to: string } | { ok: false; error: string; waitSeconds?: number };

export async function sendAdminCode({
  userId,
  email,
  sessionHash,
  userAgent,
}: {
  userId: string;
  email: string;
  sessionHash: string;
  userAgent: string | null;
}): Promise<SendResult> {
  const [latest] = await db
    .select({ createdAt: adminCodes.createdAt })
    .from(adminCodes)
    .where(eq(adminCodes.sessionHash, sessionHash))
    .orderBy(desc(adminCodes.createdAt))
    .limit(1);
  if (latest) {
    const wait = latest.createdAt.getTime() + RESEND_GAP_MS - Date.now();
    if (wait > 0)
      return {
        ok: false,
        error: "A code was just sent. Check your inbox and spam folder.",
        waitSeconds: Math.ceil(wait / 1000),
      };
  }

  const [{ sent }] = await db
    .select({ sent: count() })
    .from(adminCodes)
    .where(
      and(
        eq(adminCodes.userId, userId),
        gt(adminCodes.createdAt, new Date(Date.now() - 60 * 60 * 1000)),
      ),
    );
  if (sent >= HOURLY_LIMIT)
    return {
      ok: false,
      error: "Too many codes this hour. Wait a while and try again.",
    };

  const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
  await db.insert(adminCodes).values({
    sessionHash,
    userId,
    codeHash: digest(sessionHash, code).toString("hex"),
    expiresAt: new Date(Date.now() + CODE_TTL_MS),
  });

  const delivered = await deliver(email, code, userAgent);
  if (!delivered) {
    /*
     * Break-glass, so a mail outage cannot lock every admin out of the
     * panel: the code goes to the server log, which only the owner of the
     * Railway project can read.
     */
    console.error(
      `[admin-otp] Email to ${email} failed. Code for this sign-in: ${code}`,
    );
    return {
      ok: false,
      error:
        "The email could not be sent. The code is in the Web service's logs on Railway.",
    };
  }
  return { ok: true, to: email };
}

export type CheckResult =
  { ok: true } | { ok: false; error: string; spent?: boolean };

/** Checks a typed code against the newest live code for this session. */
export async function checkAdminCode(
  sessionHash: string,
  typed: string,
): Promise<CheckResult> {
  const clean = typed.replace(/\D/g, "");
  if (clean.length !== 6)
    return { ok: false, error: "Enter the six digits from the email." };

  const [row] = await db
    .select()
    .from(adminCodes)
    .where(
      and(
        eq(adminCodes.sessionHash, sessionHash),
        isNull(adminCodes.usedAt),
        gt(adminCodes.expiresAt, new Date()),
      ),
    )
    .orderBy(desc(adminCodes.createdAt))
    .limit(1);
  if (!row)
    return {
      ok: false,
      error: "That code has expired. Send a new one.",
      spent: true,
    };
  if (row.attempts >= MAX_ATTEMPTS)
    return {
      ok: false,
      error: "Too many wrong tries. Send a new code.",
      spent: true,
    };

  const expected = Buffer.from(row.codeHash, "hex");
  const given = digest(sessionHash, clean);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    await db
      .update(adminCodes)
      .set({ attempts: row.attempts + 1 })
      .where(eq(adminCodes.id, row.id));
    const left = MAX_ATTEMPTS - row.attempts - 1;
    return left > 0
      ? {
          ok: false,
          error: `That code is not right. ${left} ${left === 1 ? "try" : "tries"} left.`,
        }
      : {
          ok: false,
          error: "Too many wrong tries. Send a new code.",
          spent: true,
        };
  }

  await db
    .update(adminCodes)
    .set({ usedAt: new Date() })
    .where(eq(adminCodes.id, row.id));
  return { ok: true };
}

/** Through Resend's REST API, as the contact form does. */
async function deliver(
  to: string,
  code: string,
  userAgent: string | null,
): Promise<boolean> {
  const apiKey = process.env.RESEND_KEY;
  if (!apiKey) {
    console.error("[admin-otp] RESEND_KEY is not set");
    return false;
  }
  const from =
    process.env.ADMIN_OTP_FROM_EMAIL ??
    process.env.CONTACT_FROM_EMAIL ??
    `${company.name} <onboarding@resend.dev>`;
  const when = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
  const device = (userAgent ?? "an unknown browser").slice(0, 160);
  const text = [
    `Your NectArray admin sign-in code is ${code}`,
    "",
    "It works for 10 minutes, for the sign-in that asked for it.",
    `Requested ${when} (IST) from ${device}.`,
    "",
    "If this was not you, someone has your Google sign-in: change your Google password now and remove the address from ADMIN_EMAILS until it is safe.",
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `${code} is your NectArray admin code`,
        text,
        html: `<div style="font-family:system-ui,sans-serif;font-size:15px;color:#0e1b26;line-height:1.5">
<p>Your NectArray admin sign-in code is</p>
<p style="font-size:30px;font-weight:700;letter-spacing:6px;margin:12px 0">${code}</p>
<p>It works for 10 minutes, for the sign-in that asked for it.<br>Requested ${when} (IST) from ${escapeHtml(device)}.</p>
<p style="color:#7c8894;font-size:13px">If this was not you, someone has your Google sign-in: change your Google password now.</p>
</div>`,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) {
      console.error(
        `[admin-otp] Resend responded ${response.status}:`,
        (await response.text()).slice(0, 300),
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error("[admin-otp] Request to Resend failed:", error);
    return false;
  }
}

const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
