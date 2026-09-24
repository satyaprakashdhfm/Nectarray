"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  adCampaigns,
  blogPosts,
  clientPayments,
  clientProjects,
  seoKeywords,
} from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/access";
import {
  BLOG_STATUSES,
  CAMPAIGN_STATUSES,
  PLATFORMS,
  PROJECT_SERVICES,
  PROJECT_STATUSES,
  isService,
} from "@/lib/business";

/**
 * Mutations for the business dashboard: projects, payments, keywords, the
 * blog plan and ad campaigns.
 *
 * Same rule as actions.ts — every one checks for an admin before touching
 * anything, because a server action is a public endpoint whatever page
 * imports it.
 */

const text = (form: FormData, key: string) =>
  String(form.get(key) ?? "").trim();

const optional = (form: FormData, key: string) => text(form, key) || null;

/** Blank is null; anything else must be a real, non-negative number. */
function amount(form: FormData, key: string, label: string) {
  const raw = text(form, key);
  if (raw === "") return null;
  const value = Number(raw.replace(/,/g, ""));
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be a number of at least 0.`);
  }
  return value;
}

function service(form: FormData, projectsOnly = false) {
  const id = text(form, "service");
  const ok = projectsOnly
    ? PROJECT_SERVICES.some((s) => s.id === id)
    : isService(id);
  if (!ok) throw new Error(`Unknown service: ${id}`);
  return id;
}

function oneOf<T extends string>(value: string, allowed: readonly T[]) {
  if (!allowed.includes(value as T)) throw new Error(`Unknown value: ${value}`);
  return value as T;
}

const projectStatus = (value: string) =>
  oneOf(
    value,
    PROJECT_STATUSES.map((s) => s.id),
  );

function done() {
  revalidatePath("/admin", "layout");
}

// Projects and payments -----------------------------------------------------

export async function createProject(form: FormData) {
  await requireAdmin();
  const client = text(form, "client");
  const title = text(form, "title");
  if (!client || !title)
    throw new Error("A project needs a client and a title.");
  const value = amount(form, "value", "Value");

  await db.insert(clientProjects).values({
    service: service(form, true),
    client,
    title,
    status: projectStatus(text(form, "status") || "lead"),
    value: value === null ? null : String(value),
    startsOn: optional(form, "starts_on"),
    dueOn: optional(form, "due_on"),
    note: optional(form, "note"),
  });
  done();
}

export async function setProjectStatus(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  if (!id) throw new Error("Missing project.");
  await db
    .update(clientProjects)
    .set({ status: projectStatus(text(form, "status")) })
    .where(eq(clientProjects.id, id));
  done();
}

export async function deleteProject(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  if (!id) throw new Error("Missing project.");
  await db.delete(clientProjects).where(eq(clientProjects.id, id));
  done();
}

export async function addPayment(form: FormData) {
  await requireAdmin();
  const projectId = text(form, "project_id");
  const value = amount(form, "amount", "Amount");
  const receivedOn = text(form, "received_on");
  if (!projectId) throw new Error("Missing project.");
  if (!value) throw new Error("Enter the amount received.");
  if (!receivedOn) throw new Error("Enter the date it was received.");

  await db.insert(clientPayments).values({
    projectId,
    amount: String(value),
    receivedOn,
    ref: optional(form, "ref"),
  });
  done();
}

export async function deletePayment(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  if (!id) throw new Error("Missing payment.");
  await db.delete(clientPayments).where(eq(clientPayments.id, id));
  done();
}

// SEO -----------------------------------------------------------------------

export async function addKeyword(form: FormData) {
  await requireAdmin();
  const keyword = text(form, "keyword");
  if (!keyword) throw new Error("Enter a keyword.");
  const position = amount(form, "position", "Position");

  await db.insert(seoKeywords).values({
    service: service(form),
    keyword,
    targetPath: optional(form, "target_path"),
    position: position === null ? null : String(position),
    checkedOn: position === null ? null : new Date().toISOString().slice(0, 10),
  });
  done();
}

export async function updateKeywordPosition(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  if (!id) throw new Error("Missing keyword.");
  const position = amount(form, "position", "Position");

  await db
    .update(seoKeywords)
    .set({
      position: position === null ? null : String(position),
      checkedOn: new Date().toISOString().slice(0, 10),
    })
    .where(eq(seoKeywords.id, id));
  done();
}

export async function deleteKeyword(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  if (!id) throw new Error("Missing keyword.");
  await db.delete(seoKeywords).where(eq(seoKeywords.id, id));
  done();
}

export async function addBlogPost(form: FormData) {
  await requireAdmin();
  const title = text(form, "title");
  if (!title) throw new Error("Enter a title.");

  await db.insert(blogPosts).values({
    service: service(form),
    title,
    keyword: optional(form, "keyword"),
  });
  done();
}

export async function updateBlogPost(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  if (!id) throw new Error("Missing post.");
  const status = oneOf(text(form, "status"), BLOG_STATUSES);
  const url = optional(form, "url");
  if (url && !/^(https:\/\/|\/)/.test(url)) {
    throw new Error("The link must be an https:// URL or a path on the site.");
  }

  const [current] = await db
    .select({ publishedOn: blogPosts.publishedOn })
    .from(blogPosts)
    .where(eq(blogPosts.id, id));

  await db
    .update(blogPosts)
    .set({
      status,
      url,
      // Stamped the first time it goes out, and kept after that.
      publishedOn:
        status === "published"
          ? (current?.publishedOn ?? new Date().toISOString().slice(0, 10))
          : null,
    })
    .where(eq(blogPosts.id, id));
  done();
}

export async function deleteBlogPost(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  if (!id) throw new Error("Missing post.");
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  done();
}

// Ads -----------------------------------------------------------------------

const whole = (form: FormData, key: string, label: string) =>
  Math.round(amount(form, key, label) ?? 0);

export async function addCampaign(form: FormData) {
  await requireAdmin();
  const name = text(form, "name");
  if (!name) throw new Error("Enter a campaign name.");

  await db.insert(adCampaigns).values({
    service: service(form),
    platform: oneOf(
      text(form, "platform"),
      PLATFORMS.map((p) => p.id),
    ),
    name,
    spend: String(amount(form, "spend", "Spend") ?? 0),
    clicks: whole(form, "clicks", "Clicks"),
    leads: whole(form, "leads", "Leads"),
    startedOn: optional(form, "started_on"),
  });
  done();
}

export async function updateCampaign(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  if (!id) throw new Error("Missing campaign.");

  await db
    .update(adCampaigns)
    .set({
      status: oneOf(text(form, "status"), CAMPAIGN_STATUSES),
      spend: String(amount(form, "spend", "Spend") ?? 0),
      clicks: whole(form, "clicks", "Clicks"),
      leads: whole(form, "leads", "Leads"),
    })
    .where(eq(adCampaigns.id, id));
  done();
}

export async function deleteCampaign(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  if (!id) throw new Error("Missing campaign.");
  await db.delete(adCampaigns).where(eq(adCampaigns.id, id));
  done();
}
