import { NextResponse } from "next/server";
import { company, contact } from "@/lib/content";

/**
 * Contact form endpoint.
 *
 * Posts the enquiry to Resend's REST API directly rather than pulling in the
 * SDK — it is one fetch call, and the project stays dependency-free.
 *
 * Environment variables (set in Vercel → Settings → Environment Variables):
 *   RESEND_KEY          required. The key from resend.com/api-keys.
 *   CONTACT_FROM_EMAIL  optional. Must be an address on a domain verified in
 *                       Resend. Until nectarray.com is verified there, Resend
 *                       only accepts its own onboarding@resend.dev sender.
 *   CONTACT_TO_EMAIL    optional. Defaults to the address in lib/content.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/** Guards against a bot pasting a novel into the form. */
const LIMITS = {
  name: 120,
  email: 200,
  company: 160,
  interest: 80,
  message: 5000,
} as const;

type Enquiry = {
  name: string;
  email: string;
  company: string;
  interest: string;
  message: string;
};

function readField(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Keeps submitted text from being interpreted as markup in the email body. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmail(enquiry: Enquiry) {
  const rows: Array<[string, string]> = [
    ["Name", enquiry.name],
    ["Email", enquiry.email],
    ["Company", enquiry.company || "—"],
    ["Interested in", enquiry.interest],
  ];

  const html = `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#0e1b26;line-height:1.6">
      <h2 style="margin:0 0 16px;font-size:18px">New enquiry from ${escapeHtml(company.name)}.com</h2>
      <table style="border-collapse:collapse;margin-bottom:20px">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:4px 16px 4px 0;color:#7a8b96;font-size:13px">${label}</td>
            <td style="padding:4px 0;font-size:14px">${escapeHtml(value)}</td>
          </tr>`,
          )
          .join("")}
      </table>
      <div style="padding:16px;background:#f6f9fa;border-radius:8px;white-space:pre-wrap;font-size:14px">${escapeHtml(
        enquiry.message,
      )}</div>
    </div>
  `;

  const text = [
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    enquiry.message,
  ].join("\n");

  return { html, text };
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_KEY;

  if (!apiKey) {
    // Surfaces in the Vercel function logs with the exact variable to add.
    console.error("[contact] RESEND_KEY is not set");
    return NextResponse.json(
      { error: "Email is not configured on the server." },
      { status: 500 },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const enquiry: Enquiry = {
    name: readField(payload.name, LIMITS.name),
    email: readField(payload.email, LIMITS.email),
    company: readField(payload.company, LIMITS.company),
    interest: readField(payload.interest, LIMITS.interest),
    message: readField(payload.message, LIMITS.message),
  };

  if (!enquiry.name || !enquiry.email || !enquiry.message) {
    return NextResponse.json(
      { error: "Name, email and message are all required." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(enquiry.email)) {
    return NextResponse.json(
      { error: "That email address does not look right." },
      { status: 400 },
    );
  }

  // Not in the allowed list means the value did not come from our own form.
  if (!contact.interests.includes(enquiry.interest)) {
    enquiry.interest = contact.interests[0];
  }

  const { html, text } = buildEmail(enquiry);

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.CONTACT_FROM_EMAIL ??
          `${company.name} <onboarding@resend.dev>`,
        to: [process.env.CONTACT_TO_EMAIL ?? company.email],
        // Lets you hit reply in the inbox and answer the person directly.
        reply_to: enquiry.email,
        subject: `${enquiry.interest} — enquiry from ${enquiry.name}`,
        html,
        text,
      }),
    });

    if (!response.ok) {
      // Resend explains refusals (unverified sender, bad key) in the body.
      console.error(
        `[contact] Resend responded ${response.status}:`,
        await response.text(),
      );
      return NextResponse.json(
        { error: "We could not send that just now." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("[contact] Request to Resend failed:", error);
    return NextResponse.json(
      { error: "We could not send that just now." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
