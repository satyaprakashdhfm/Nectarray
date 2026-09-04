"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
  if (!userId || !cohortId) throw new Error("Missing student or class.");

  const supabase = await assertAdmin();
  const { error } = await supabase
    .from("enrolments")
    .insert({ user_id: userId, cohort_id: cohortId, status: "accepted" });
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
}

export async function updateCohort(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing class.");

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

/** Mints a code for a cohort. The database checks is_admin() again itself. */
export async function generateCode(formData: FormData) {
  const cohortId = String(formData.get("cohort_id") ?? "");
  const note = String(formData.get("note") ?? "").trim();
  if (!cohortId) throw new Error("Pick a class.");

  const supabase = await assertAdmin();
  const { error } = await supabase.rpc("generate_enrolment_code", {
    p_cohort_id: cohortId,
    p_note: note === "" ? null : note,
    p_expires_at: null,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/codes");
}

/** Records what a student paid for their seat. */
export async function updatePayment(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing enrolment.");

  const amountRaw = String(formData.get("amount_paid") ?? "").trim();
  const paidOn = String(formData.get("paid_on") ?? "").trim();
  const ref = String(formData.get("payment_ref") ?? "").trim();

  // Blank clears the figure; anything else must be a real, non-negative
  // number. A typo silently becoming 0 would read as "paid nothing".
  let amount: number | null = null;
  if (amountRaw !== "") {
    amount = Number(amountRaw);
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error("Amount must be a number of at least 0.");
    }
  }

  const supabase = await assertAdmin();
  const { error } = await supabase
    .from("enrolments")
    .update({
      amount_paid: amount,
      paid_on: paidOn === "" ? null : paidOn,
      payment_ref: ref === "" ? null : ref,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
}

/** Saves a lesson's notes. The markdown is stored exactly as typed. */
export async function updateLesson(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing lesson.");

  const dayLabel = String(formData.get("day_label") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const body = String(formData.get("body_md") ?? "");
  const published = formData.get("is_published") === "on";

  if (title === "") throw new Error("A lesson needs a title.");

  const supabase = await assertAdmin();
  const { error } = await supabase
    .from("lessons")
    .update({
      day_label: dayLabel === "" ? "Day —" : dayLabel,
      title,
      summary: summary === "" ? null : summary,
      body_md: body === "" ? null : body,
      is_published: published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/lessons");
  revalidatePath(`/admin/lessons/${id}`);
  revalidatePath(`/dashboard/notes/${id}`);
  redirect("/admin/lessons");
}

/** Adds an empty lesson to a module, ready to be written into. */
export async function createLesson(formData: FormData) {
  const moduleId = String(formData.get("module_id") ?? "");
  const dayLabel = String(formData.get("day_label") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  if (!moduleId) throw new Error("Pick a module.");
  if (title === "") throw new Error("A lesson needs a title.");

  const supabase = await assertAdmin();

  // Append to the end of the module rather than fighting over a position.
  const { data: last } = await supabase
    .from("lessons")
    .select("position")
    .eq("module_id", moduleId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from("lessons")
    .insert({
      module_id: moduleId,
      day_label: dayLabel === "" ? "Day —" : dayLabel,
      title,
      position: (last?.position ?? 0) + 1,
      is_published: false,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  revalidatePath("/admin/lessons");
  redirect(`/admin/lessons/${data.id}`);
}
