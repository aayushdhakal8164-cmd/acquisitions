import {
  pgTable,
  serial,
  varchar,
  bigint,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),

  industry: varchar("industry", { length: 255 }).notNull(),

  country: varchar("country", { length: 100 }).notNull(),

  valuation: bigint("valuation", { mode: "number" }).notNull(),

  foundedYear: integer("founded_year").notNull(),

  created_at: timestamp("created_at").defaultNow(),

  updated_at: timestamp("updated_at").defaultNow(),
});