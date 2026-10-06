ALTER TABLE "client_projects" ADD COLUMN "delivered_on" date;
--> statement-breakpoint
CREATE TABLE "work_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid,
	"title" text NOT NULL,
	"notes" text,
	"assignee" text,
	"status" text DEFAULT 'todo' NOT NULL,
	"priority" text DEFAULT 'normal' NOT NULL,
	"due_on" date,
	"done_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "work_items" ADD CONSTRAINT "work_items_project_id_client_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."client_projects"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "work_items_status_idx" ON "work_items" USING btree ("status");
--> statement-breakpoint
CREATE INDEX "work_items_due_idx" ON "work_items" USING btree ("due_on");
--> statement-breakpoint
CREATE INDEX "work_items_project_idx" ON "work_items" USING btree ("project_id");
