/**
 * Who may reach /admin.
 *
 * This is a second, independent gate on top of `profiles.role = 'admin'`.
 * The database role is the real authorisation — it is what every RLS policy
 * checks — but the role lives in a table, and a table can be wrong. The
 * allowlist lives in configuration, so both have to agree before the admin
 * area opens.
 *
 * Set ADMIN_EMAILS in Vercel to change it without a deploy; comma-separated
 * for more than one. The fallback is the owner's account so the area is never
 * locked out by a missing variable.
 */
const FALLBACK = "satyaprakashreddy6789@gmail.com";

export const adminEmails = (process.env.ADMIN_EMAILS ?? FALLBACK)
  .split(",")
  .map((entry) => entry.trim().toLowerCase())
  .filter(Boolean);

export function isAllowedAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  return adminEmails.includes(email.trim().toLowerCase());
}
