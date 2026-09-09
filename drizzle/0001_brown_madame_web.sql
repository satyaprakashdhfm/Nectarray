CREATE TABLE "practice_opens" (
	"user_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"opened_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "practice_opens_user_id_question_id_pk" PRIMARY KEY("user_id","question_id")
);
--> statement-breakpoint
ALTER TABLE "practice_questions" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "practice_opens" ADD CONSTRAINT "practice_opens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_opens" ADD CONSTRAINT "practice_opens_question_id_practice_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."practice_questions"("id") ON DELETE cascade ON UPDATE no action;