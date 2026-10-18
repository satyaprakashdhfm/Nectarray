ALTER TABLE "project_details" ADD COLUMN "commissions" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "enrolments" ADD COLUMN "commissions" jsonb DEFAULT '[]'::jsonb NOT NULL;
