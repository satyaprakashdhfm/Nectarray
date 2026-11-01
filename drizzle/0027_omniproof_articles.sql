CREATE TABLE "omniproof_articles" (
	"slug" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"date" date NOT NULL,
	"field" text NOT NULL,
	"subfield" text NOT NULL,
	"short" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"cover_src" text,
	"cover_alt" text,
	"source_label" text DEFAULT '' NOT NULL,
	"source_href" text DEFAULT '' NOT NULL,
	"lands" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
