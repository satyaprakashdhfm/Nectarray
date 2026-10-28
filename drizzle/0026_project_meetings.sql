ALTER TABLE "client_projects" ADD COLUMN "meetings" jsonb DEFAULT '[]'::jsonb NOT NULL;
