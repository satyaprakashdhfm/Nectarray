CREATE TABLE "project_details" (
	"project_id" uuid PRIMARY KEY NOT NULL,
	"status_note" text DEFAULT '' NOT NULL,
	"links" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"paid" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"recurring" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"access" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_details" ADD CONSTRAINT "project_details_project_id_client_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."client_projects"("id") ON DELETE cascade ON UPDATE no action;
