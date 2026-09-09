/**
 * The whole database, in one file.
 *
 * Ported from the Supabase schema, with two deliberate differences.
 *
 * `auth.users` is gone — it was Supabase's table, in a schema we did not own
 * and could not join against without a view. Its replacement, `users`, is an
 * ordinary table in the same schema as everything else, so a query for a
 * student and their enrolment is one join rather than an RPC.
 *
 * `profiles` is gone with it. It existed only because Supabase owned the user
 * row and we needed somewhere of our own to put a name and a phone number,
 * and keeping the two in step took a trigger, a metadata parser and a sync
 * function — three of the seven database functions this migration deletes.
 * The name and the phone number are columns on `users` now.
 */

import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

/** Every timestamp is stored with its zone. A date without one is a bug. */
const now = () => timestamp({ withTimezone: true }).notNull().defaultNow();

// ---------------------------------------------------------------------------
//  Identity
// ---------------------------------------------------------------------------

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  /** Lower-cased on the way in; sign-in matches on it exactly. */
  email: text().notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text(),
  /** 'student' or 'admin'. Checked in SQL as well as in the application. */
  role: text().notNull().default("student"),
  /**
   * Set the first time a code sent to this address is accepted. A row can
   * exist before that — asking for a code creates one — so "has an account"
   * and "has proved they read that inbox" are different questions.
   */
  emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
  createdAt: now(),
});

/**
 * A signed-in browser.
 *
 * The cookie carries an opaque random token and this table holds its hash, so
 * a leaked database backup cannot be used to sign in as anybody. Sessions are
 * rows rather than JWTs because a row can be deleted: signing someone out, or
 * out of everywhere, is a DELETE rather than a wait for expiry.
 */
export const sessions = pgTable(
  "sessions",
  {
    /** sha-256 of the token in the cookie. The token itself is never stored. */
    tokenHash: text("token_hash").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: now(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    /** For the "signed in on" list, and for spotting a stolen cookie. */
    userAgent: text("user_agent"),
  },
  (table) => [index("sessions_user_idx").on(table.userId)],
);

/**
 * A six-digit code, in flight.
 *
 * Hashed like a session token, for the same reason. `attempts` is what stops
 * a code being guessed: six digits is a million possibilities, which is a lot
 * for a person and nothing for a script, so the row dies after five tries.
 */
export const authCodes = pgTable(
  "auth_codes",
  {
    id: uuid().primaryKey().defaultRandom(),
    email: text().notNull(),
    codeHash: text("code_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    attempts: integer().notNull().default(0),
    createdAt: now(),
  },
  (table) => [index("auth_codes_email_idx").on(table.email)],
);

// ---------------------------------------------------------------------------
//  The programme
// ---------------------------------------------------------------------------

export const cohorts = pgTable("cohorts", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  startsOn: date("starts_on"),
  endsOn: date("ends_on"),
  seats: integer().notNull().default(5),
  /** The live-class room. Stable, so the link in a calendar keeps working. */
  meetUrl: text("meet_url"),
  roomSlug: text("room_slug"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: now(),
});

export const enrolments = pgTable(
  "enrolments",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    cohortId: uuid("cohort_id")
      .notNull()
      .references(() => cohorts.id, { onDelete: "cascade" }),
    /** applied · accepted · enrolled · completed · withdrawn */
    status: text().notNull().default("applied"),
    note: text(),
    amountPaid: numeric("amount_paid"),
    paidOn: date("paid_on"),
    paymentRef: text("payment_ref"),
    createdAt: now(),
  },
  (table) => [
    unique("enrolments_user_cohort").on(table.userId, table.cohortId),
  ],
);

/**
 * A code that turns an applicant into a student.
 *
 * One row, one use: `redeemed_by` going from null to a user id is the whole
 * mechanism, and it has to happen inside a transaction or two people pasting
 * the same code at once both get in.
 */
export const enrolmentCodes = pgTable("enrolment_codes", {
  code: text().primaryKey(),
  cohortId: uuid("cohort_id")
    .notNull()
    .references(() => cohorts.id, { onDelete: "cascade" }),
  note: text(),
  createdBy: uuid("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: now(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  redeemedBy: uuid("redeemed_by").references(() => users.id, {
    onDelete: "set null",
  }),
  redeemedAt: timestamp("redeemed_at", { withTimezone: true }),
});

// ---------------------------------------------------------------------------
//  Course material
// ---------------------------------------------------------------------------

export const modules = pgTable("modules", {
  id: uuid().primaryKey().defaultRandom(),
  slug: text().notNull().unique(),
  title: text().notNull(),
  summary: text(),
  position: integer().notNull(),
  /**
   * Who the module is written for: "student" or "admin".
   *
   * The same course is taught from two sets of notes. Students read a short,
   * precise version; whoever is teaching reads the long one, with the
   * background and the asides that would only slow a beginner down. Rather
   * than a second body column on every lesson, the long set is its own
   * module — so it carries its own lesson list, its own day labels and its
   * own positions, and neither version constrains the shape of the other.
   *
   * Defaulting to "student" matters: every existing module is one, and a new
   * module is far more likely to be. An admin module has to say so.
   */
  audience: text().notNull().default("student"),
});

export const lessons = pgTable(
  "lessons",
  {
    id: uuid().primaryKey().defaultRandom(),
    moduleId: uuid("module_id")
      .notNull()
      .references(() => modules.id, { onDelete: "cascade" }),
    dayLabel: text("day_label").notNull(),
    title: text().notNull(),
    summary: text(),
    /** The lesson itself. Markdown, up to about 40 KB. */
    bodyMd: text("body_md"),
    /**
     * The sha-256 of the body as the last sync wrote it.
     *
     * Lesson text is authored in content/lessons/ and copied here by the
     * pre-deploy migration, which needs to tell "nobody has touched this
     * since I wrote it" from "somebody edited it in the admin panel". If the
     * stored body still hashes to this, the sync may overwrite it; if it does
     * not, the panel wins and the sync leaves it alone and says so.
     */
    sourceHash: text("source_hash"),
    position: integer().notNull(),
    isPublished: boolean("is_published").notNull().default(false),
    updatedAt: now(),
  },
  (table) => [index("lessons_module_idx").on(table.moduleId, table.position)],
);

export const assignments = pgTable("assignments", {
  id: uuid().primaryKey().defaultRandom(),
  lessonId: uuid("lesson_id")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  title: text().notNull(),
  promptMd: text("prompt_md").notNull(),
  starterCode: text("starter_code"),
  maxScore: integer("max_score").notNull().default(10),
  position: integer().notNull().default(1),
  isPublished: boolean("is_published").notNull().default(false),
});

export const submissions = pgTable(
  "submissions",
  {
    id: uuid().primaryKey().defaultRandom(),
    assignmentId: uuid("assignment_id")
      .notNull()
      .references(() => assignments.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    code: text().notNull(),
    language: text().notNull().default("python"),
    score: integer(),
    /** correct · partial · incorrect */
    verdict: text(),
    feedbackMd: text("feedback_md"),
    gradedAt: timestamp("graded_at", { withTimezone: true }),
    createdAt: now(),
  },
  (table) => [index("submissions_user_idx").on(table.userId, table.createdAt)],
);

// ---------------------------------------------------------------------------
//  Practice
// ---------------------------------------------------------------------------

export const practiceQuestions = pgTable(
  "practice_questions",
  {
    id: uuid().primaryKey().defaultRandom(),
    /** 'sql' or 'python'. */
    track: text().notNull(),
    /** easy · medium · hard */
    difficulty: text().notNull(),
    position: integer().notNull(),
    topic: text().notNull().default("General"),
    title: text().notNull(),
    promptMd: text("prompt_md").notNull(),
    hintMd: text("hint_md"),
    solutionSql: text("solution_sql"),
    mysqlNote: text("mysql_note"),
    /**
     * Kept for the questions that still carry their answer inline. The SQL
     * track's answers moved to content/sql-answers.json, because sending
     * fifty-four of them so that one could be compared was most of the weight
     * of that page.
     */
    expectedResult: jsonb("expected_result"),
    /**
     * The key into content/python-tests.json and content/python-statements.json.
     *
     * It used to be pulled back out of leetcode_url with a regular expression
     * at render time, which meant the link had to stay in the page for the
     * judge to know which problem it was looking at. The statements live here
     * now and the link is gone, so the slug is a column.
     */
    slug: text(),
    leetcodeUrl: text("leetcode_url"),
    hasJudge: boolean("has_judge").notNull().default(false),
    isPublished: boolean("is_published").notNull().default(true),
  },
  (table) => [
    index("practice_questions_track_idx").on(table.track, table.position),
  ],
);

/**
 * When a student first opened a problem.
 *
 * The reference solution is not available for the first fifteen minutes, and
 * this is the clock that says so. It is a row rather than something in the
 * browser because a lock a student can lift by clearing local storage is not
 * a lock, it is a suggestion — and the fifteen minutes are the point of the
 * exercise. Written once, on first open, and never moved: reopening a problem
 * tomorrow does not restart the wait.
 */
export const practiceOpens = pgTable(
  "practice_opens",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    questionId: uuid("question_id")
      .notNull()
      .references(() => practiceQuestions.id, { onDelete: "cascade" }),
    openedAt: now(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.questionId] })],
);

export const practiceProgress = pgTable(
  "practice_progress",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    questionId: uuid("question_id")
      .notNull()
      .references(() => practiceQuestions.id, { onDelete: "cascade" }),
    solvedAt: now(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.questionId] })],
);

/**
 * A student's own in-progress work on one practice question — the SQL they
 * were typing, or the Python they had not submitted yet.
 *
 * Switching to the next question, or just closing the tab, used to throw
 * this away: the editor's only copy of it was a piece of React state with no
 * question attached, so leaving a problem reset it to the starter code. One
 * row per (user, question) instead, upserted on every autosave, is what
 * makes "come back tomorrow and carry on" true rather than aspirational.
 *
 * Shared by both tracks rather than a column per track, because the shape is
 * identical — one block of text a student is mid-way through — and a third
 * track (agentic) reads and writes it the same way with nothing to add.
 */
export const practiceDrafts = pgTable(
  "practice_drafts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    questionId: uuid("question_id")
      .notNull()
      .references(() => practiceQuestions.id, { onDelete: "cascade" }),
    code: text().notNull(),
    updatedAt: now(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.questionId] })],
);

/**
 * A student's screenshot of an accepted submission elsewhere, and what the
 * grader made of it.
 *
 * Nothing writes this any more. The two design problems were the only ones
 * that used it, and they were only unjudgeable because the statement lived on
 * somebody else's site — now that the problems are written out here there is
 * no elsewhere to screenshot, and they are marked done by hand. The table is
 * left in place rather than dropped: it costs nothing and it holds whatever
 * was graded before.
 *
 * The screenshot itself is not kept. It used to go into a storage bucket and
 * be read back once, seconds later, by the grading call — so the bucket was a
 * cupboard holding a few hundred pictures of other people's screens for no
 * reason anybody could name. The image now goes straight to the grader in the
 * request that uploads it, and what survives is the verdict.
 */
export const practiceAttempts = pgTable("practice_attempts", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  questionId: uuid("question_id")
    .notNull()
    .references(() => practiceQuestions.id, { onDelete: "cascade" }),
  /** pending · accepted · rejected */
  status: text().notNull().default("pending"),
  feedback: text(),
  model: text(),
  createdAt: now(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
});

// ---------------------------------------------------------------------------
//  Projects
// ---------------------------------------------------------------------------

export const projects = pgTable("projects", {
  id: uuid().primaryKey().defaultRandom(),
  moduleId: uuid("module_id")
    .notNull()
    .references(() => modules.id, { onDelete: "cascade" }),
  position: integer().notNull(),
  slug: text().notNull().unique(),
  title: text().notNull(),
  summary: text().notNull(),
  briefMd: text("brief_md").notNull(),
  rubricMd: text("rubric_md").notNull(),
  isPublished: boolean("is_published").notNull().default(true),
});

export const projectSubmissions = pgTable(
  "project_submissions",
  {
    id: uuid().primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    repoUrl: text("repo_url").notNull(),
    /** pending · passed · revise · error */
    status: text().notNull().default("pending"),
    score: integer(),
    feedbackMd: text("feedback_md"),
    model: text(),
    filesSeen: integer("files_seen"),
    createdAt: now(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  },
  (table) => [
    index("project_submissions_user_idx").on(table.userId, table.createdAt),
  ],
);

// ---------------------------------------------------------------------------
//  Enquiries
// ---------------------------------------------------------------------------

export const academyEnquiries = pgTable("academy_enquiries", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull(),
  phone: text(),
  background: text(),
  experience: text(),
  goal: text(),
  timeline: text(),
  message: text(),
  /** What the model made of them, and the reply it drafted. */
  fit: text(),
  reply: text(),
  model: text(),
  handled: boolean().notNull().default(false),
  note: text(),
  createdAt: now(),
});

// ---------------------------------------------------------------------------
//  Relations, for the query builder
// ---------------------------------------------------------------------------

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  enrolments: many(enrolments),
  submissions: many(submissions),
  projectSubmissions: many(projectSubmissions),
  practiceProgress: many(practiceProgress),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const enrolmentsRelations = relations(enrolments, ({ one }) => ({
  user: one(users, { fields: [enrolments.userId], references: [users.id] }),
  cohort: one(cohorts, {
    fields: [enrolments.cohortId],
    references: [cohorts.id],
  }),
}));

export const modulesRelations = relations(modules, ({ many }) => ({
  lessons: many(lessons),
  projects: many(projects),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  module: one(modules, {
    fields: [lessons.moduleId],
    references: [modules.id],
  }),
  assignments: many(assignments),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  module: one(modules, {
    fields: [projects.moduleId],
    references: [modules.id],
  }),
  submissions: many(projectSubmissions),
}));

export const projectSubmissionsRelations = relations(
  projectSubmissions,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectSubmissions.projectId],
      references: [projects.id],
    }),
    user: one(users, {
      fields: [projectSubmissions.userId],
      references: [users.id],
    }),
  }),
);

export type User = typeof users.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type Enrolment = typeof enrolments.$inferSelect;
