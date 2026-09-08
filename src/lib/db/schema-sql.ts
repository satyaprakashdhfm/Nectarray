/**
 * The schema, as statements to run.
 *
 * GENERATED from drizzle/0000_bitter_champions.sql by scripts/build-schema-sql.mjs.
 *
 * It exists as a module rather than a file read at runtime because the one
 * place this has to work is a Vercel function, where the repository is not on
 * disk unless it was traced into the bundle — and a migration that fails
 * because a .sql file was not packaged is a bad first five minutes.
 *
 * Every statement is idempotent, so running the bootstrap twice is harmless.
 */
export const SCHEMA_STATEMENTS: string[] = [
  'CREATE TABLE IF NOT EXISTS "academy_enquiries" (\n\t"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,\n\t"name" text NOT NULL,\n\t"email" text NOT NULL,\n\t"phone" text,\n\t"background" text,\n\t"experience" text,\n\t"goal" text,\n\t"timeline" text,\n\t"message" text,\n\t"fit" text,\n\t"reply" text,\n\t"model" text,\n\t"handled" boolean DEFAULT false NOT NULL,\n\t"note" text,\n\t"created_at" timestamp with time zone DEFAULT now() NOT NULL\n);',
  'CREATE TABLE IF NOT EXISTS "assignments" (\n\t"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,\n\t"lesson_id" uuid NOT NULL,\n\t"title" text NOT NULL,\n\t"prompt_md" text NOT NULL,\n\t"starter_code" text,\n\t"max_score" integer DEFAULT 10 NOT NULL,\n\t"position" integer DEFAULT 1 NOT NULL,\n\t"is_published" boolean DEFAULT false NOT NULL\n);',
  'CREATE TABLE IF NOT EXISTS "auth_codes" (\n\t"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,\n\t"email" text NOT NULL,\n\t"code_hash" text NOT NULL,\n\t"expires_at" timestamp with time zone NOT NULL,\n\t"attempts" integer DEFAULT 0 NOT NULL,\n\t"created_at" timestamp with time zone DEFAULT now() NOT NULL\n);',
  'CREATE TABLE IF NOT EXISTS "cohorts" (\n\t"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,\n\t"name" text NOT NULL,\n\t"starts_on" date,\n\t"ends_on" date,\n\t"seats" integer DEFAULT 5 NOT NULL,\n\t"meet_url" text,\n\t"room_slug" text,\n\t"is_active" boolean DEFAULT true NOT NULL,\n\t"created_at" timestamp with time zone DEFAULT now() NOT NULL\n);',
  'CREATE TABLE IF NOT EXISTS "enrolment_codes" (\n\t"code" text PRIMARY KEY NOT NULL,\n\t"cohort_id" uuid NOT NULL,\n\t"note" text,\n\t"created_by" uuid,\n\t"created_at" timestamp with time zone DEFAULT now() NOT NULL,\n\t"expires_at" timestamp with time zone,\n\t"redeemed_by" uuid,\n\t"redeemed_at" timestamp with time zone\n);',
  'CREATE TABLE IF NOT EXISTS "enrolments" (\n\t"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,\n\t"user_id" uuid NOT NULL,\n\t"cohort_id" uuid NOT NULL,\n\t"status" text DEFAULT \'applied\' NOT NULL,\n\t"note" text,\n\t"amount_paid" numeric,\n\t"paid_on" date,\n\t"payment_ref" text,\n\t"created_at" timestamp with time zone DEFAULT now() NOT NULL,\n\tCONSTRAINT "enrolments_user_cohort" UNIQUE("user_id","cohort_id")\n);',
  'CREATE TABLE IF NOT EXISTS "lessons" (\n\t"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,\n\t"module_id" uuid NOT NULL,\n\t"day_label" text NOT NULL,\n\t"title" text NOT NULL,\n\t"summary" text,\n\t"body_md" text,\n\t"position" integer NOT NULL,\n\t"is_published" boolean DEFAULT false NOT NULL,\n\t"updated_at" timestamp with time zone DEFAULT now() NOT NULL\n);',
  'CREATE TABLE IF NOT EXISTS "modules" (\n\t"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,\n\t"slug" text NOT NULL,\n\t"title" text NOT NULL,\n\t"summary" text,\n\t"position" integer NOT NULL,\n\tCONSTRAINT "modules_slug_unique" UNIQUE("slug")\n);',
  'CREATE TABLE IF NOT EXISTS "practice_attempts" (\n\t"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,\n\t"user_id" uuid NOT NULL,\n\t"question_id" uuid NOT NULL,\n\t"image_path" text NOT NULL,\n\t"status" text DEFAULT \'pending\' NOT NULL,\n\t"feedback" text,\n\t"model" text,\n\t"created_at" timestamp with time zone DEFAULT now() NOT NULL,\n\t"reviewed_at" timestamp with time zone\n);',
  'CREATE TABLE IF NOT EXISTS "practice_progress" (\n\t"user_id" uuid NOT NULL,\n\t"question_id" uuid NOT NULL,\n\t"solved_at" timestamp with time zone DEFAULT now() NOT NULL,\n\tCONSTRAINT "practice_progress_user_id_question_id_pk" PRIMARY KEY("user_id","question_id")\n);',
  'CREATE TABLE IF NOT EXISTS "practice_questions" (\n\t"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,\n\t"track" text NOT NULL,\n\t"difficulty" text NOT NULL,\n\t"position" integer NOT NULL,\n\t"topic" text DEFAULT \'General\' NOT NULL,\n\t"title" text NOT NULL,\n\t"prompt_md" text NOT NULL,\n\t"hint_md" text,\n\t"solution_sql" text,\n\t"mysql_note" text,\n\t"expected_result" jsonb,\n\t"leetcode_url" text,\n\t"has_judge" boolean DEFAULT false NOT NULL,\n\t"is_published" boolean DEFAULT true NOT NULL\n);',
  'CREATE TABLE IF NOT EXISTS "project_submissions" (\n\t"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,\n\t"project_id" uuid NOT NULL,\n\t"user_id" uuid NOT NULL,\n\t"repo_url" text NOT NULL,\n\t"status" text DEFAULT \'pending\' NOT NULL,\n\t"score" integer,\n\t"feedback_md" text,\n\t"model" text,\n\t"files_seen" integer,\n\t"created_at" timestamp with time zone DEFAULT now() NOT NULL,\n\t"reviewed_at" timestamp with time zone\n);',
  'CREATE TABLE IF NOT EXISTS "projects" (\n\t"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,\n\t"module_id" uuid NOT NULL,\n\t"position" integer NOT NULL,\n\t"slug" text NOT NULL,\n\t"title" text NOT NULL,\n\t"summary" text NOT NULL,\n\t"brief_md" text NOT NULL,\n\t"rubric_md" text NOT NULL,\n\t"is_published" boolean DEFAULT true NOT NULL,\n\tCONSTRAINT "projects_slug_unique" UNIQUE("slug")\n);',
  'CREATE TABLE IF NOT EXISTS "sessions" (\n\t"token_hash" text PRIMARY KEY NOT NULL,\n\t"user_id" uuid NOT NULL,\n\t"created_at" timestamp with time zone DEFAULT now() NOT NULL,\n\t"expires_at" timestamp with time zone NOT NULL,\n\t"user_agent" text\n);',
  'CREATE TABLE IF NOT EXISTS "submissions" (\n\t"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,\n\t"assignment_id" uuid NOT NULL,\n\t"user_id" uuid NOT NULL,\n\t"code" text NOT NULL,\n\t"language" text DEFAULT \'python\' NOT NULL,\n\t"score" integer,\n\t"verdict" text,\n\t"feedback_md" text,\n\t"graded_at" timestamp with time zone,\n\t"created_at" timestamp with time zone DEFAULT now() NOT NULL\n);',
  'CREATE TABLE IF NOT EXISTS "users" (\n\t"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,\n\t"email" text NOT NULL,\n\t"first_name" text,\n\t"last_name" text,\n\t"phone" text,\n\t"role" text DEFAULT \'student\' NOT NULL,\n\t"email_verified_at" timestamp with time zone,\n\t"created_at" timestamp with time zone DEFAULT now() NOT NULL,\n\tCONSTRAINT "users_email_unique" UNIQUE("email")\n);',
  'ALTER TABLE "assignments" ADD CONSTRAINT "assignments_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;',
  'ALTER TABLE "enrolment_codes" ADD CONSTRAINT "enrolment_codes_cohort_id_cohorts_id_fk" FOREIGN KEY ("cohort_id") REFERENCES "public"."cohorts"("id") ON DELETE cascade ON UPDATE no action;',
  'ALTER TABLE "enrolment_codes" ADD CONSTRAINT "enrolment_codes_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;',
  'ALTER TABLE "enrolment_codes" ADD CONSTRAINT "enrolment_codes_redeemed_by_users_id_fk" FOREIGN KEY ("redeemed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;',
  'ALTER TABLE "enrolments" ADD CONSTRAINT "enrolments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;',
  'ALTER TABLE "enrolments" ADD CONSTRAINT "enrolments_cohort_id_cohorts_id_fk" FOREIGN KEY ("cohort_id") REFERENCES "public"."cohorts"("id") ON DELETE cascade ON UPDATE no action;',
  'ALTER TABLE "lessons" ADD CONSTRAINT "lessons_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;',
  'ALTER TABLE "practice_attempts" ADD CONSTRAINT "practice_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;',
  'ALTER TABLE "practice_attempts" ADD CONSTRAINT "practice_attempts_question_id_practice_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."practice_questions"("id") ON DELETE cascade ON UPDATE no action;',
  'ALTER TABLE "practice_progress" ADD CONSTRAINT "practice_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;',
  'ALTER TABLE "practice_progress" ADD CONSTRAINT "practice_progress_question_id_practice_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."practice_questions"("id") ON DELETE cascade ON UPDATE no action;',
  'ALTER TABLE "project_submissions" ADD CONSTRAINT "project_submissions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;',
  'ALTER TABLE "project_submissions" ADD CONSTRAINT "project_submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;',
  'ALTER TABLE "projects" ADD CONSTRAINT "projects_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;',
  'ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;',
  'ALTER TABLE "submissions" ADD CONSTRAINT "submissions_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE cascade ON UPDATE no action;',
  'ALTER TABLE "submissions" ADD CONSTRAINT "submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;',
  'CREATE INDEX IF NOT EXISTS "auth_codes_email_idx" ON "auth_codes" USING btree ("email");',
  'CREATE INDEX IF NOT EXISTS "lessons_module_idx" ON "lessons" USING btree ("module_id","position");',
  'CREATE INDEX IF NOT EXISTS "practice_questions_track_idx" ON "practice_questions" USING btree ("track","position");',
  'CREATE INDEX IF NOT EXISTS "project_submissions_user_idx" ON "project_submissions" USING btree ("user_id","created_at");',
  'CREATE INDEX IF NOT EXISTS "sessions_user_idx" ON "sessions" USING btree ("user_id");',
  'CREATE INDEX IF NOT EXISTS "submissions_user_idx" ON "submissions" USING btree ("user_id","created_at");',
];
