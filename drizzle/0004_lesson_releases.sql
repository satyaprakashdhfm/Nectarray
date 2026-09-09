CREATE TABLE "lesson_releases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cohort_id" uuid NOT NULL,
	"lesson_id" uuid NOT NULL,
	"released_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lesson_releases_cohort_lesson" UNIQUE("cohort_id","lesson_id")
);
--> statement-breakpoint
ALTER TABLE "lesson_releases" ADD CONSTRAINT "lesson_releases_cohort_id_cohorts_id_fk" FOREIGN KEY ("cohort_id") REFERENCES "public"."cohorts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_releases" ADD CONSTRAINT "lesson_releases_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lesson_releases_cohort_idx" ON "lesson_releases" USING btree ("cohort_id");
