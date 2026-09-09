import "server-only";
import { cache } from "react";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { cohorts, enrolments, users, type User } from "@/lib/db/schema";
import { currentUser } from "@/lib/auth/session";

/**
 * Who is asking, and what they are allowed to see.
 *
 * This is the one place that answers both questions, and it exists because
 * of what we gave up by leaving Supabase. Row-level security was
 * deny-by-default: a query that forgot to scope itself returned nothing.
 * A single application-level database role inverts that — a query that
 * forgets to scope itself returns everything — so the scoping has to be
 * somewhere deliberate rather than remembered at each call site.
 *
 * The rule is simple and worth keeping: no route handler, server component or
 * action reads a table belonging to a person without first calling one of
 * these. The `require*` helpers throw rather than return, because a caller
 * that forgets to check a boolean is exactly the mistake RLS used to catch.
 */

export type Viewer = {
  user: User | null;
  enrolment: {
    id: string;
    status: string;
    cohortId: string;
    meetUrl: string | null;
    roomSlug: string | null;
    cohortName: string | null;
  } | null;
};

/**
 * Cached for the length of one request.
 *
 * A lesson page asks three times — the layout, the page and the rail — and
 * without this that is three round trips to Postgres for an answer that
 * cannot have changed between them.
 */
export const getViewer = cache(async (): Promise<Viewer> => {
  const user = await currentUser();
  if (!user) return { user: null, enrolment: null };

  const [row] = await db
    .select({
      id: enrolments.id,
      status: enrolments.status,
      cohortId: enrolments.cohortId,
      meetUrl: cohorts.meetUrl,
      roomSlug: cohorts.roomSlug,
      cohortName: cohorts.name,
    })
    .from(enrolments)
    .innerJoin(cohorts, eq(cohorts.id, enrolments.cohortId))
    .where(eq(enrolments.userId, user.id))
    .orderBy(desc(enrolments.createdAt))
    .limit(1);

  return { user, enrolment: row ?? null };
});

/**
 * Whether the viewer can open course material.
 *
 * Every gated page used to ask this its own way and got it subtly different.
 * One helper keeps "enrolled" meaning one thing.
 */
export async function getAccess() {
  const viewer = await getViewer();
  const status = viewer.enrolment?.status ?? "none";
  return {
    ...viewer,
    status,
    active: status === "enrolled" || status === "completed",
  };
}

/** Thrown by the require* helpers. Route handlers turn it into a status. */
export class AccessError extends Error {
  constructor(readonly status: 401 | 403) {
    super(status === 401 ? "Not signed in." : "Not allowed.");
    this.name = "AccessError";
  }
}

export async function requireUser(): Promise<User> {
  const { user } = await getViewer();
  if (!user) throw new AccessError(401);
  return user;
}

export async function requireEnrolled(): Promise<User> {
  const { user, active } = await getAccess();
  if (!user) throw new AccessError(401);
  if (!active) throw new AccessError(403);
  return user;
}

/**
 * Whoever is signed into the admin realm — admin or not.
 *
 * A separate cookie from the student one, so the studio account and a
 * student account can both be live in the same browser at once. It returns
 * the user without judging them, because /admin/login needs to tell a
 * stranger ("sign in") from the wrong Google account ("that one is not an
 * admin"); requireAdmin does the judging.
 */
export const adminViewer = cache(async (): Promise<User | null> => {
  return currentUser("admin");
});

/**
 * Admin, by the role column — with the environment as a bootstrap.
 *
 * `ADMIN_EMAILS` is how the first admin exists at all, since there is nobody
 * to promote them. It is checked against a verified address, so it grants
 * nothing to somebody who merely types an admin's email into the form.
 *
 * Note which session this reads. Being signed in as a student, even as a
 * student whose address is on the allowlist, is not being signed into the
 * panel: the admin cookie is set only by a sign-in that went through
 * /admin/login, and that separation is the whole point of the two realms.
 */
export async function requireAdmin(): Promise<User> {
  const user = await adminViewer();
  if (!user) throw new AccessError(401);
  if (isAdmin(user)) return user;
  throw new AccessError(403);
}

export function isAdmin(user: User | null): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
  return Boolean(user.emailVerifiedAt) && allowed.includes(user.email);
}

/** The display name for a greeting, falling back to the address. */
export function displayName(user: User | null): string {
  if (!user) return "there";
  return user.firstName?.trim() || user.email.split("@")[0];
}

/** Promotes anybody listed in ADMIN_EMAILS, so the role column stays true. */
export async function syncAdminRole(user: User): Promise<void> {
  if (user.role !== "admin" && isAdmin(user)) {
    await db.update(users).set({ role: "admin" }).where(eq(users.id, user.id));
  }
}
