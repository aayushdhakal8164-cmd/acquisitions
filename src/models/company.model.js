import {
  pgTable,
  serial,
  varchar,
  bigint,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./user.model.js";

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),

  industry: varchar("industry", { length: 255 }).notNull(),

  country: varchar("country", { length: 100 }).notNull(),

  valuation: bigint("valuation", { mode: "number" }).notNull(),

  founded_year: integer("founded_year").notNull(),

  // NEW
  user_id: integer("user_id")
    .references(() => users.id)
    .notNull(),
    logo: varchar("logo", { length: 255 }),

  created_at: timestamp("created_at").defaultNow(),

  updated_at: timestamp("updated_at").defaultNow(),
});