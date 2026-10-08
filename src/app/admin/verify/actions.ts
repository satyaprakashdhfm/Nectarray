"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN } from "@/lib/admin-path";
import { adminGate } from "@/lib/auth/access";
import { checkAdminCode, sendAdminCode } from "@/lib/auth/admin-otp";
import { markVerified } from "@/lib/auth/session";

/**
 * The emailed-code step of the admin sign-in. Both actions act only on the
 * caller's own admin session, and only once Google and the allowlist have
 * already passed it; neither can be pointed at anyone else.
 */

export type SendState = {
  sent: boolean;
  to?: string;
  error?: string;
  waitSeconds?: number;
};

export async function sendCode(): Promise<SendState> {
  const gate = await adminGate();
  if (!gate.user || !gate.admin || !("tokenHash" in gate))
    return { sent: false, error: "Sign in with Google again." };
  if (gate.verified) redirect(ADMIN);

  const result = await sendAdminCode({
    userId: gate.user.id,
    email: gate.user.email,
    sessionHash: gate.tokenHash,
    userAgent: (await headers()).get("user-agent"),
  });
  return result.ok
    ? { sent: true, to: result.to }
    : { sent: false, error: result.error, waitSeconds: result.waitSeconds };
}

export type VerifyState = { error?: string; spent?: boolean };

export async function verifyCode(
  _previous: VerifyState,
  form: FormData,
): Promise<VerifyState> {
  const gate = await adminGate();
  if (!gate.user || !gate.admin || !("tokenHash" in gate))
    return { error: "Sign in with Google again." };
  if (!gate.verified) {
    const result = await checkAdminCode(
      gate.tokenHash,
      String(form.get("code") ?? ""),
    );
    if (!result.ok) return { error: result.error, spent: result.spent };
    await markVerified(gate.tokenHash);
  }
  redirect(ADMIN);
}
