CREATE TABLE "placement_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"intro" text,
	"resume_files" jsonb,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "placement_profiles" ADD CONSTRAINT "placement_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
