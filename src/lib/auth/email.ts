import "server-only";
import { company } from "@/lib/content";

/**
 * Sends the six-digit sign-in code.
 *
 * Through Resend, which the contact form already uses, so there is one email
 * provider and one key rather than two of each.
 *
 * The code is in the subject line as well as the body. Most people read it
 * off the notification without opening anything, and the ones who do open it
 * are usually on a phone where the body has to be scrolled to.
 */

const ENDPOINT = "https://api.resend.com/emails";

export async function sendCode(to: string, code: string): Promise<boolean> {
  const key = process.env.RESEND_KEY;
  if (!key) {
    // In development, with no key, put it where the developer can see it.
    if (process.env.NODE_ENV !== "production") {
      console.info(`[auth] sign-in code for ${to}: ${code}`);
      return true;
    }
    console.error("[auth] RESEND_KEY is not set; no code was sent");
    return false;
  }

  const from =
    process.env.CONTACT_FROM_EMAIL ?? `${company.name} <onboarding@resend.dev>`;

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `${code} is your NectArray sign-in code`,
        text: [
          `Your sign-in code is ${code}.`,
          "",
          "It works once and expires in ten minutes.",
          "If you did not ask to sign in, you can ignore this — somebody",
          "typed your address into the form and that is all that happened.",
        ].join("\n"),
        html: codeEmail(code),
      }),
    });

    if (!response.ok) {
      console.error("[auth] Resend refused the message:", response.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[auth] could not reach Resend:", error);
    return false;
  }
}

function codeEmail(code: string): string {
  return `
<div style="font-family:ui-sans-serif,system-ui,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#0e1b26">
  <p style="margin:0 0 24px;font-size:15px;color:#4c5a66">
    Here is your sign-in code for NectArray.
  </p>
  <p style="margin:0 0 24px;font-family:ui-monospace,monospace;font-size:34px;
            font-weight:700;letter-spacing:0.22em;color:#0e1b26">${code}</p>
  <p style="margin:0 0 8px;font-size:14px;color:#4c5a66">
    It works once and expires in ten minutes.
  </p>
  <p style="margin:0;font-size:13px;color:#7c8894">
    If you did not ask to sign in, you can ignore this. Somebody typed your
    address into the form, and that is all that happened.
  </p>
</div>`.trim();
}
