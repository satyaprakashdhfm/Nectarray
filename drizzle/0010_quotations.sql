CREATE TABLE "quotations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"number" text NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"company" text NOT NULL,
	"contact_name" text,
	"phone" text,
	"email" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"quote_date" date DEFAULT now() NOT NULL,
	"body" jsonb NOT NULL,
	"once_total" numeric DEFAULT '0' NOT NULL,
	"monthly_total" numeric DEFAULT '0' NOT NULL,
	"project_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quote_defaults" (
	"id" text PRIMARY KEY NOT NULL,
	"body" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
