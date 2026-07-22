import { z } from "zod";

export const acquisitionSchema = z.object({
  buyer_company_id: z.number().int().positive(),

  target_company_id: z.number().int().positive(),

  deal_value: z.number().positive(),

  deal_status: z.enum([
    "Pending",
    "Completed",
    "Cancelled",
  ]).default("Pending"),
});