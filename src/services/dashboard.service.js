import { db } from "../config/database.js";
import { users } from "../models/user.model.js";
import { companies } from "../models/company.model.js";
import { acquisitions } from "../models/acquisition.model.js";
import { count, desc, eq, sql } from "drizzle-orm";

export const getDashboardService = async () => {
  // Counts
  const [userStats] = await db
    .select({ totalUsers: count() })
    .from(users);

  const [companyStats] = await db
    .select({ totalCompanies: count() })
    .from(companies);

  const [acquisitionStats] = await db
    .select({
      totalAcquisitions: count(),
      totalDealValue: sql`COALESCE(SUM(${acquisitions.deal_value}),0)`,
    })
    .from(acquisitions);

  // Latest Companies
  const companiesData = await db
    .select()
    .from(companies)
    .orderBy(desc(companies.id))
    .limit(5);

  const latestCompanies = companiesData.map((company) => ({
    ...company,
    logo: company.logo
      ? `http://localhost:3000/uploads/companies/${company.logo}`
      : null,
  }));

  // Latest Acquisitions
  const acquisitionData = await db
    .select()
    .from(acquisitions)
    .orderBy(desc(acquisitions.id))
    .limit(5);

  const latestAcquisitions = [];

  for (const acquisition of acquisitionData) {
    const [buyer] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, acquisition.buyer_company_id));

    const [target] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, acquisition.target_company_id));

    latestAcquisitions.push({
      id: acquisition.id,
      buyer_company: buyer?.name ?? null,
      target_company: target?.name ?? null,
      deal_value: acquisition.deal_value,
      deal_status: acquisition.deal_status,
      acquired_at: acquisition.acquired_at,
    });
  }

  return {
    totalUsers: userStats.totalUsers,
    totalCompanies: companyStats.totalCompanies,
    totalAcquisitions: acquisitionStats.totalAcquisitions,
    totalDealValue: Number(acquisitionStats.totalDealValue),
    latestCompanies,
    latestAcquisitions,
  };
};