import { isAdmin } from "@/lib/auth/access";
import { appProfile } from "@/lib/auth/app-profile";
import { bearerUser } from "@/lib/auth/session";

/**
 * Who the app's stored token belongs to.
 *
 * `?realm=admin` is asked for the admin sign-in, and answers 403 the moment
 * the account stops being an admin, so removing an address from
 * ADMIN_EMAILS (or its admin role) signs it out of the app's admin side on
 * the next launch.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await bearerUser(request);
  if (!user) {
    return Response.json({ error: "Not signed in." }, { status: 401 });
  }

  const realm =
    new URL(request.url).searchParams.get("realm") === "admin"
      ? "admin"
      : "student";
  if (realm === "admin" && !isAdmin(user)) {
    return Response.json(
      { error: `${user.email} is not an admin account.` },
      { status: 403 },
    );
  }

  return Response.json({ profile: await appProfile(user, realm) });
}
