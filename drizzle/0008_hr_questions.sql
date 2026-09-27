CREATE TABLE "hr_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"position" integer NOT NULL,
	"question" text NOT NULL,
	"also_asked" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"note" text,
	"is_guide" boolean DEFAULT false NOT NULL,
	"answer" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
