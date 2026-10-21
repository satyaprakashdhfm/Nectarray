CREATE TABLE "web_domain_sites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"domain" text NOT NULL,
	"position" integer NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"score" integer,
	"note" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
