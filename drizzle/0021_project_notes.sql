ALTER TABLE "project_details" ADD COLUMN "notes" jsonb DEFAULT '[]'::jsonb NOT NULL;
