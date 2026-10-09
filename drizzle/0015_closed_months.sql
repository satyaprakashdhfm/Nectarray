ALTER TABLE "project_details" ADD COLUMN "closed_months" jsonb DEFAULT '[]'::jsonb NOT NULL;
