CREATE TABLE "agent_turns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"model" text NOT NULL,
	"input_tokens" integer DEFAULT 0 NOT NULL,
	"output_tokens" integer DEFAULT 0 NOT NULL,
	"cost_usd" numeric,
	"actions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"ms" integer DEFAULT 0 NOT NULL,
	"asked_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "agent_turns_created_idx" ON "agent_turns" USING btree ("created_at");
