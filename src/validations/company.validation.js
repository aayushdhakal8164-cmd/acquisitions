import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(2),
  industry: z.string().min(2),
  country: z.string().min(2),
  valuation: z.number().positive(),
  founded_year: z.number().int().min(1800).max(new Date().getFullYear()),
});