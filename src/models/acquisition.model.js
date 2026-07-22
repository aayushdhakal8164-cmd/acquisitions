import {
  pgTable,
  serial,
  integer,
  bigint,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

import { companies } from "./company.model.js";

export const acquisitions = pgTable("acquisitions", {
  id: serial("id").primaryKey(),

  buyer_company_id: integer("buyer_company_id")
    .references(() => companies.id)
    .notNull(),

  target_company_id: integer("target_company_id")
    .references(() => companies.id)
    .notNull(),

  deal_value: bigint("deal_value", { mode: "number" }).notNull(),

  deal_status: varchar("deal_status", {
    length: 30,
  }).default("Pending"),

  acquired_at: timestamp("acquired_at").defaultNow(),

  created_at: timestamp("created_at").defaultNow(),

  updated_at: timestamp("updated_at").defaultNow(),
});