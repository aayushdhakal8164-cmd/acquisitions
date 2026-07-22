CREATE TABLE "acquisitions" (
	"id" serial PRIMARY KEY NOT NULL,
	"buyer_company_id" integer NOT NULL,
	"target_company_id" integer NOT NULL,
	"deal_value" bigint NOT NULL,
	"deal_status" varchar(30) DEFAULT 'Pending',
	"acquired_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "acquisitions" ADD CONSTRAINT "acquisitions_buyer_company_id_companies_id_fk" FOREIGN KEY ("buyer_company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acquisitions" ADD CONSTRAINT "acquisitions_target_company_id_companies_id_fk" FOREIGN KEY ("target_company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;