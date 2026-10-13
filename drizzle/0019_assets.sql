CREATE TABLE "asset_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" text NOT NULL,
	"amount" numeric NOT NULL,
	"on" date NOT NULL,
	"reason" text NOT NULL,
	"added_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "asset_entries_on_idx" ON "asset_entries" USING btree ("on");
