CREATE TABLE "drive_folders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"parent_id" uuid,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "drive_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"folder_id" uuid,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"size" bigint NOT NULL,
	"key" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "drive_files_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "drive_folders" ADD CONSTRAINT "drive_folders_project_id_client_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."client_projects"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "drive_folders" ADD CONSTRAINT "drive_folders_parent_id_drive_folders_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."drive_folders"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "drive_files" ADD CONSTRAINT "drive_files_project_id_client_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."client_projects"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "drive_files" ADD CONSTRAINT "drive_files_folder_id_drive_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."drive_folders"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "drive_folders_place_idx" ON "drive_folders" USING btree ("project_id","parent_id");
--> statement-breakpoint
CREATE INDEX "drive_files_place_idx" ON "drive_files" USING btree ("project_id","folder_id");
