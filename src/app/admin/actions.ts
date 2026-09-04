"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Admin mutations.
 *
 * Deliberately written against the *user's own* session rather than the
 * service role: the admin-only RLS policies are then doing the enforcing on
 * every write, so a bug in this file cannot escalate past what the database
 * already allows. Nothing here needs to bypass RLS.
 */

async function assertAdmin() {
  const supabase = await createClient();
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) throw new Error("Not authorised.");
  return supabase;
}

const STATUSES = [
  "applied",
  "accepted",
  "enrolled",
  "completed",
  "withdrawn",
] as const;

export async function setEnrolmentStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id) throw new Error("Missing enrolment.");
  if (!STATUSES.includes(status as (typeof STATUSES)[number])) {
    throw new Error(`Unknown status: ${status}`);
  }

  const supabase = await assertAdmin();
  const { error } = await supabase
    .from("enrolments")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/dashboard");
}

/** Enrol someone who signed up but never applied — e.g. paid over the phone. */
export async function createEnrolment(formData: FormData) {
  const userId = String(formData.get("user_id") ?? "");
  const cohortId = String(formData.get("cohort_id") ?? "");
  if (!userId || !cohortId) throw new Error("Missing student or cohort.");

  const supabase = await assertAdmin();
  const { error } = await supabase
    .from("enrolments")
    .insert({ user_id: userId, cohort_id: cohortId, status: "accepted" });
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
}

export async function updateCohort(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing cohort.");

  const meetUrl = String(formData.get("meet_url") ?? "").trim();
  const seatsRaw = String(formData.get("seats") ?? "").trim();
  const startsOn = String(formData.get("starts_on") ?? "").trim();
  const endsOn = String(formData.get("ends_on") ?? "").trim();

  // An unparseable seat count must not silently become 0 and close the cohort.
  const seats = Number.parseInt(seatsRaw, 10);
  if (seatsRaw !== "" && (Number.isNaN(seats) || seats < 1)) {
    throw new Error("Seats must be a whole number of at least 1.");
  }

  if (meetUrl !== "" && !/^https:\/\//.test(meetUrl)) {
    throw new Error("The meeting link must be an https:// URL.");
  }

  const supabase = await assertAdmin();
  const { error } = await supabase
    .from("cohorts")
    .update({
      meet_url: meetUrl === "" ? null : meetUrl,
      seats: seatsRaw === "" ? undefined : seats,
      starts_on: startsOn === "" ? null : startsOn,
      ends_on: endsOn === "" ? null : endsOn,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/cohort");
  revalidatePath("/dashboard");
}
