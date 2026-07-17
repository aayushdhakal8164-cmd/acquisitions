import { companySchema } from "../validations/company.validation.js";
import { formatValidationErrors } from "../utils/format.js";
import {
  createCompanyService,
  getAllCompaniesService,
  getCompanyByIdService,
  getCompanyByIdAndUserService,
  updateCompanyService,
  deleteCompanyService,
  getMyCompaniesService,
  uploadCompanyLogoService
} from "../services/company.service.js";


export const createCompany = async (req, res, next) => {
  try {
    const validation = companySchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: formatValidationErrors(validation.error),
      });
    }

    const company = await createCompanyService({
      ...validation.data,
      user_id: req.user.id, // 👈 logged-in user's ID
    });

    return res.status(201).json({
      message: "Company created successfully",
      company,
    });
  } catch (err) {
    next(err);
  }
};
export const getAllCompanies = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const search = req.query.search || "";
    const country = req.query.country || "";
    const industry = req.query.industry || "";

    const sort = req.query.sort || "id";
    const order = req.query.order || "asc";

   const companies = await getAllCompaniesService(
  page,
  limit,
  search,
  country,
  industry,
  sort,
  order,
  req.user
);

    return res.status(200).json({
      message: "Companies fetched successfully",
      page,
      limit,
      search,
      country,
      industry,
      sort,
      order,
      companies,
    });
  } catch (err) {
    next(err);
  }
};
export const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const company = await getCompanyByIdService(Number(id));

    if (!company) {
      return res.status(404).json({
        error: "Company not found",
      });
    }

    return res.status(200).json({
      message: "Company fetched successfully",
      company,
    });
  } catch (err) {
    next(err);
  }
};
export const updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params;

    const validation = companySchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: formatValidationErrors(validation.error),
      });
    }

    const company = await getCompanyByIdAndUserService(
      Number(id),
      req.user.id
    );

    if (!company) {
      return res.status(403).json({
        error: "You are not allowed to modify this company.",
      });
    }

    const updatedCompany = await updateCompanyService(
      Number(id),
      validation.data
    );

    return res.status(200).json({
      message: "Company updated successfully",
      company: updatedCompany,
    });
  } catch (err) {
    next(err);
  }
};
export const deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;

    const company = await getCompanyByIdAndUserService(
      Number(id),
      req.user.id
    );

    if (!company) {
      return res.status(403).json({
        error: "You are not allowed to delete this company.",
      });
    }

    const deletedCompany = await deleteCompanyService(Number(id));

    return res.status(200).json({
      message: "Company deleted successfully",
      company: deletedCompany,
    });
  } catch (err) {
    next(err);
  }
};
export const getCompanyStats = async (req, res, next) => {
  try {
    const stats = await getCompanyStatsService();

    return res.status(200).json({
      message: "Company statistics fetched successfully",
      stats,
    });
  } catch (err) {
    next(err);
  }
};
export const getMyCompanies = async (req, res, next) => {
  try {
    const companies = await getMyCompaniesService(req.user.id);

    return res.status(200).json({
      message: "My companies fetched successfully",
      companies,
    });
  } catch (err) {
    next(err);
  }
};
export const uploadCompanyLogo = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        error: "Please upload an image",
      });
    }

    const company = await uploadCompanyLogoService(
      Number(id),
      req.file.filename
    );

    return res.status(200).json({
      message: "Logo uploaded successfully",
      company,
    });
  } catch (err) {
    next(err);
  }
};