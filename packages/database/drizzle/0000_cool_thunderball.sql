CREATE TYPE "public"."form_status" AS ENUM('draft', 'published', 'unpublished', 'archived');--> statement-breakpoint
CREATE TYPE "public"."visibility_mode" AS ENUM('public', 'unlisted');--> statement-breakpoint
CREATE TYPE "public"."fieldEnum" AS ENUM('TEXT', 'NUMBER', 'EMAIL', 'YES_NO', 'PASSWORD');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(80) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false,
	"salt" text,
	"password" text,
	"otp" varchar(10) NOT NULL,
	"expires_at" timestamp with time zone,
	"profile_image_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "form" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(55) NOT NULL,
	"description" varchar(300),
	"created_by" uuid,
	"slug" text NOT NULL,
	"form_link" varchar(100),
	"status" "form_status" DEFAULT 'draft' NOT NULL,
	"visibility_mode" "visibility_mode" DEFAULT 'unlisted' NOT NULL,
	"is_password_protected" boolean DEFAULT false NOT NULL,
	"password_hash" text,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "form_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "formsFields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" varchar(100) NOT NULL,
	"label_key" varchar(100) NOT NULL,
	"placeholder" text,
	"is_required" boolean DEFAULT false,
	"index" numeric NOT NULL,
	"order" integer NOT NULL,
	"type" "fieldEnum" NOT NULL,
	"form_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "formsFields_index_unique" UNIQUE("index"),
	CONSTRAINT "formsFields_form_id_index_unique" UNIQUE("form_id","index")
);
--> statement-breakpoint
CREATE TABLE "form_submission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"respondent_id" uuid,
	"value" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "form" ADD CONSTRAINT "form_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formsFields" ADD CONSTRAINT "formsFields_form_id_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."form"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_submission" ADD CONSTRAINT "form_submission_form_id_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."form"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_submission" ADD CONSTRAINT "form_submission_respondent_id_users_id_fk" FOREIGN KEY ("respondent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "forms_user_id_idx" ON "form" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "forms_slug_idx" ON "form" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "forms_visibility_idx" ON "form" USING btree ("visibility_mode");--> statement-breakpoint
CREATE INDEX "responses_form_id_idx" ON "form_submission" USING btree ("form_id");