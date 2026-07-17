import { db } from "../config/database.js";
import { companies } from "../models/company.model.js";
import { eq, ilike, and, asc, desc } from "drizzle-orm";
import { countDistinct, sql } from "drizzle-orm";
import fs from "fs";
import path from "path";


export const createCompanyService = async (data) => {
  const [company] = await db
    .insert(companies)
    .values(data)
    .returning();

  return company;
};


export const getCompanyByIdService = async (id) => {
  const [company] = await db
    .select()
    .from(companies)
    .where(eq(companies.id, id));

  return company;
};
export const getCompanyByIdAndUserService = async (companyId, userId) => {
  const [company] = await db
    .select()
    .from(companies)
    .where(
      and(
        eq(companies.id, companyId),
        eq(companies.user_id, userId)
      )
    );

  return company;
};
export const updateCompanyService = async (id, data) => {
  const [company] = await db
    .update(companies)
    .set(data)
    .where(eq(companies.id, id))
    .returning();

  return company;
};
export const deleteCompanyService = async (id) => {
  const [company] = await db
    .delete(companies)
    .where(eq(companies.id, id))
    .returning();

  return company;
};
export const getAllCompaniesService = async (
  page,
  limit,
  search = "",
  country = "",
  industry = "",
  sort = "id",
  order = "asc",
  user
) => {

  const offset = (page - 1) * limit;

  const filters = [];
  if (user.role !== "admin") {
  filters.push(eq(companies.user_id, user.id));
}

  if (search) {
    filters.push(ilike(companies.name, `%${search}%`));
  }

  if (country) {
    filters.push(ilike(companies.country, `%${country}%`));
  }

  if (industry) {
    filters.push(ilike(companies.industry, `%${industry}%`));
  }

  let query = db.select().from(companies);

  if (filters.length > 0) {
    query = query.where(and(...filters));
  }
const sortableColumns = {
  id: companies.id,
  name: companies.name,
  valuation: companies.valuation,
  founded_year: companies.founded_year, // ✅ correct
  country: companies.country,
};

const sortColumn = sortableColumns[sort] || companies.id;



query = query.orderBy(
  order === "desc"
    ? desc(sortColumn)
    : asc(sortColumn)
);

const result = await query
  .limit(limit)
  .offset(offset);



return result;

};
export const getCompanyStatsService = async () => {
  const [stats] = await db
    .select({
      totalCompanies: sql`COUNT(*)`,
      totalValuation: sql`SUM(${companies.valuation})`,
      averageValuation: sql`AVG(${companies.valuation})`,
      countries: countDistinct(companies.country),
      industries: countDistinct(companies.industry),
    })
    .from(companies);

  return stats;
};
export const getMyCompaniesService = async (userId) => {
  return await db
    .select()
    .from(companies)
    .where(eq(companies.user_id, userId));
};
export const uploadCompanyLogoService = async (companyId, logo) => {
  // Find the existing company
  const [existingCompany] = await db
    .select()
    .from(companies)
    .where(eq(companies.id, companyId));

  if (!existingCompany) {
    throw new Error("Company not found");
  }

  console.log("Existing company:", existingCompany);

  // Delete the old logo if it exists
  if (existingCompany.logo) {
    const oldLogoPath = path.resolve(
      "src/uploads/companies",
      existingCompany.logo
    );

    console.log("Old logo path:", oldLogoPath);
    console.log("Exists?", fs.existsSync(oldLogoPath));

    if (fs.existsSync(oldLogoPath)) {
      fs.unlinkSync(oldLogoPath);
      console.log("✅ Old logo deleted!");
    } else {
      console.log("❌ Old logo file not found.");
    }
  } else {
    console.log("ℹ️ Company has no previous logo.");
  }

  // Update the company with the new logo
  const [updatedCompany] = await db
    .update(companies)
    .set({
      logo,
      updated_at: new Date(),
    })
    .where(eq(companies.id, companyId))
    .returning();

  console.log("✅ New logo saved:", updatedCompany.logo);

  return updatedCompany;
};