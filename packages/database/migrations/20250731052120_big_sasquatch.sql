CREATE SCHEMA "storage";
--> statement-breakpoint
CREATE TABLE "storage"."object" (
	"key" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"bucket" text NOT NULL,
	"name" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"owner" text,
	"resource_id" text,
	"session_id" text,
	"staled_at" timestamp with time zone
);
--> statement-breakpoint
CREATE UNIQUE INDEX "unique_storage_object_bucket_name" ON "storage"."object" USING btree ("bucket","name");--> statement-breakpoint
CREATE INDEX "idx_storage_object_owner" ON "storage"."object" USING btree ("owner");--> statement-breakpoint
CREATE INDEX "idx_storage_object_resource_id" ON "storage"."object" USING btree ("resource_id");--> statement-breakpoint
CREATE INDEX "idx_storage_object_session_id" ON "storage"."object" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "idx_storage_object_staled_at" ON "storage"."object" USING btree ("staled_at");