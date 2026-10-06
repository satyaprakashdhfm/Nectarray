import "server-only";
import type { User } from "@/lib/db/schema";
import { enrolmentFor, isAdmin } from "@/lib/auth/access";
import type { Realm } from "@/lib/auth/session";

/**
 * What the Android app is told about whoever is signed in.
 *
 * Only what its account screen shows. The enrolment status and cohort name
 * are the student's own; the cohort's meeting link stays on the website,
 * behind the dashboard.
 */
export async function appProfile(user: User, realm: Realm) {
  const enrolment = realm === "student" ? await enrolmentFor(user.id) : null;
  return {
    realm,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    admin: isAdmin(user),
    enrolment: enrolment
      ? { status: enrolment.status, cohort: enrolment.cohortName }
      : null,
  };
}
