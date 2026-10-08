ALTER TABLE "sessions" ADD COLUMN "verified_at" timestamp with time zone;
--> statement-breakpoint
CREATE TABLE "admin_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_hash" text NOT NULL,
	"user_id" uuid NOT NULL,
	"code_hash" text NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin_codes" ADD CONSTRAINT "admin_codes_session_hash_sessions_token_hash_fk" FOREIGN KEY ("session_hash") REFERENCES "public"."sessions"("token_hash") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "admin_codes" ADD CONSTRAINT "admin_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "admin_codes_user_idx" ON "admin_codes" USING btree ("user_id","created_at");
