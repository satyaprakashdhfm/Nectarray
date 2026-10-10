CREATE TABLE "price_tables" (
	"id" text PRIMARY KEY NOT NULL,
	"rows" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text NOT NULL
);
