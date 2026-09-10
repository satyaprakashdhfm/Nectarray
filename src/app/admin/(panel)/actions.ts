"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { cohorts, enrolments, lessonReleases, lessons } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/access";

/**
 * Admin mutations.
 *
 * Every one of these opens by throwing if the caller is not an admin. That
 * used to be belt and braces — the admin-only RLS policies enforced it in the
 * database whatever this file did — and it is now the only thing standing
 * between a mislabelled form action and somebody else's payment record. A
 * server action is a public HTTP endpoint with a generated name; it is not
 * protected by being imported into an admin page.
 */

async function assertAdmin() {
  await requireAdmin();
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

  await assertAdmin();
  await db.update(enrolments).set({ status }).where(eq(enrolments.id, id));

  revalidatePath("/admin");
  revalidatePath("/dashboard");
}

/** Enrol someone who signed up but never applied — e.g. paid over the phone. */
export async function createEnrolment(formData: FormData) {
  const userId = String(formData.get("user_id") ?? "");
  const cohortId = String(formData.get("cohort_id") ?? "");
  if (!userId || !cohortId) throw new Error("Missing student or class.");

  await assertAdmin();
  await db
    .insert(enrolments)
    .values({ userId, cohortId, status: "accepted" })
    .onConflictDoNothing();

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

  await assertAdmin();
  await db
    .update(cohorts)
    .set({
      meetUrl: meetUrl === "" ? null : meetUrl,
      ...(seatsRaw === "" ? {} : { seats }),
      startsOn: startsOn === "" ? null : startsOn,
      endsOn: endsOn === "" ? null : endsOn,
    })
    .where(eq(cohorts.id, id));

  revalidatePath("/admin/cohort");
  revalidatePath("/dashboard");
}

/**
 * Opens or closes one lesson for one batch.
 *
 * Writing the grant rather than a flag means unlocking is an insert and
 * locking is a delete, and the absence of a row is what keeps a lesson shut.
 * `onConflictDoNothing` makes a double-click harmless rather than an error.
 *
 * Locking again is deliberately allowed. A topic unlocked a day early should
 * be retractable, and since the body is fetched per request the student loses
 * it on their next navigation rather than keeping a copy open.
 */
export async function setLessonRelease(formData: FormData) {
  const cohortId = String(formData.get("cohort_id") ?? "");
  const lessonId = String(formData.get("lesson_id") ?? "");
  const unlock = String(formData.get("unlock") ?? "") === "1";
  if (!cohortId || !lessonId) throw new Error("Missing batch or lesson.");

  await assertAdmin();

  if (unlock) {
    await db
      .insert(lessonReleases)
      .values({ cohortId, lessonId })
      .onConflictDoNothing();
  } else {
    await db
      .delete(lessonReleases)
      .where(
        and(
          eq(lessonReleases.cohortId, cohortId),
          eq(lessonReleases.lessonId, lessonId),
        ),
      );
  }

  revalidatePath("/admin/unlocking");
  revalidatePath("/dashboard/notes", "layout");
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

  await assertAdmin();
  await db
    .update(enrolments)
    .set({
      amountPaid: amount === null ? null : String(amount),
      paidOn: paidOn === "" ? null : paidOn,
      paymentRef: ref === "" ? null : ref,
    })
    .where(eq(enrolments.id, id));

  revalidatePath("/admin");
}

/** Saves a lesson's notes. The markdown is stored exactly as typed. */
export async function updateLesson(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing lesson.");

  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const body = String(formData.get("body_md") ?? "");
  const published = formData.get("is_published") === "on";

  if (title === "") throw new Error("A lesson needs a title.");

  await assertAdmin();
  await db
    .update(lessons)
    .set({
      title,
      summary: summary === "" ? null : summary,
      bodyMd: body === "" ? null : body,
      isPublished: published,
      updatedAt: new Date(),
    })
    .where(eq(lessons.id, id));

  revalidatePath("/admin/lessons");
  revalidatePath(`/admin/lessons/${id}`);
  revalidatePath(`/dashboard/notes/${id}`);
  redirect("/admin/lessons");
}

/** Adds an empty lesson to a module, ready to be written into. */
export async function createLesson(formData: FormData) {
  const moduleId = String(formData.get("module_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!moduleId) throw new Error("Pick a module.");
  if (title === "") throw new Error("A lesson needs a title.");

  await assertAdmin();

  // Append to the end of the module rather than fighting over a position.
  const [last] = await db
    .select({ position: lessons.position })
    .from(lessons)
    .where(eq(lessons.moduleId, moduleId))
    .orderBy(desc(lessons.position))
    .limit(1);

  const [data] = await db
    .insert(lessons)
    .values({
      moduleId,
      title,
      position: (last?.position ?? 0) + 1,
      isPublished: false,
    })
    .returning({ id: lessons.id });

  revalidatePath("/admin/lessons");
  redirect(`/admin/lessons/${data.id}`);
}
