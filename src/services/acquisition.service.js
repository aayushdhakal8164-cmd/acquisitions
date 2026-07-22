import { db } from "../config/database.js";
import { acquisitions } from "../models/acquisition.model.js";
import { eq } from "drizzle-orm";
import { companies } from "../models/company.model.js";

// Create Acquisition
export const createAcquisitionService = async (data) => {
  const [acquisition] = await db
    .insert(acquisitions)
    .values(data)
    .returning();

  return acquisition;
};

// Get All Acquisitions
export const getAllAcquisitionsService = async () => {
  const data = await db
    .select()
    .from(acquisitions);

  const result = [];

  for (const acquisition of data) {
    const [buyer] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, acquisition.buyer_company_id));

    const [target] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, acquisition.target_company_id));

    result.push({
      ...acquisition,
      buyer_company_name: buyer?.name || null,
      target_company_name: target?.name || null,
    });
  }

  return result;
};
// Get Acquisition By ID
export const getAcquisitionByIdService = async (id) => {
  const [acquisition] = await db
    .select()
    .from(acquisitions)
    .where(eq(acquisitions.id, id));

  return acquisition;
};

// Update Acquisition
export const updateAcquisitionService = async (id, data) => {
  const [acquisition] = await db
    .update(acquisitions)
    .set(data)
    .where(eq(acquisitions.id, id))
    .returning();

  return acquisition;
};

// Delete Acquisition
export const deleteAcquisitionService = async (id) => {
  const [acquisition] = await db
    .delete(acquisitions)
    .where(eq(acquisitions.id, id))
    .returning();

  return acquisition;
};
import { count, sql } from "drizzle-orm";

export const getAcquisitionStatsService = async () => {
  const [stats] = await db
    .select({
      totalAcquisitions: count(),
      totalDealValue: sql`COALESCE(SUM(${acquisitions.deal_value}),0)`,
      completedDeals:
        sql`COUNT(*) FILTER (WHERE ${acquisitions.deal_status} = 'Completed')`,
      pendingDeals:
        sql`COUNT(*) FILTER (WHERE ${acquisitions.deal_status} = 'Pending')`,
      cancelledDeals:
        sql`COUNT(*) FILTER (WHERE ${acquisitions.deal_status} = 'Cancelled')`,
    })
    .from(acquisitions);

  return stats;
};