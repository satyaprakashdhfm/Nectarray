CREATE TABLE "client_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service" text NOT NULL,
	"client" text NOT NULL,
	"title" text NOT NULL,
	"status" text DEFAULT 'lead' NOT NULL,
	"value" numeric,
	"starts_on" date,
	"due_on" date,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "client_projects_service_idx" ON "client_projects" USING btree ("service");
--> statement-breakpoint
CREATE TABLE "client_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"amount" numeric NOT NULL,
	"received_on" date NOT NULL,
	"ref" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "client_payments" ADD CONSTRAINT "client_payments_project_id_client_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."client_projects"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "client_payments_project_idx" ON "client_payments" USING btree ("project_id");
--> statement-breakpoint
CREATE TABLE "seo_keywords" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service" text NOT NULL,
	"keyword" text NOT NULL,
	"target_path" text,
	"position" numeric,
	"checked_on" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service" text NOT NULL,
	"title" text NOT NULL,
	"keyword" text,
	"status" text DEFAULT 'idea' NOT NULL,
	"url" text,
	"published_on" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ad_campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service" text NOT NULL,
	"platform" text NOT NULL,
	"name" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"spend" numeric DEFAULT '0' NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL,
	"leads" integer DEFAULT 0 NOT NULL,
	"started_on" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
