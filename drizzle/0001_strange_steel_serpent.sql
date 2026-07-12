CREATE TABLE "companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"industry" varchar(255) NOT NULL,
	"country" varchar(100) NOT NULL,
	"valuation" bigint NOT NULL,
	"founded_year" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
