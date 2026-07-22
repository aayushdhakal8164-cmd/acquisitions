import { companySchema } from "../validations/company.validation.js";
import { formatValidationErrors } from "../utils/format.js";
import {
  createCompanyService,
  getAllCompaniesService,
  getCompanyByIdService,
  getCompanyByIdAndUserService,
  updateCompanyService,
  deleteCompanyService,
  getCompanyStatsService,
  getMyCompaniesService,
  uploadCompanyLogoService,
} from "../services/company.service.js";
import ApiError from "../utils/apiError.js";
import { successResponse } from "../utils/apiResponse.js";

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

    return successResponse(
  res,
  201,
  "Company created successfully",
  company
);
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

 return successResponse(
  res,
  200,
  "Companies fetched successfully",
  {
    page,
    limit,
    search,
    country,
    industry,
    sort,
    order,
    companies,
  }
);
  } catch (err) {
    next(err);
  }
};
export const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const company = await getCompanyByIdService(Number(id));

    if (!company) {
 throw new ApiError(404, "Company not found");
}

 return successResponse(
  res,
  200,
  "Company fetched successfully",
  company
);
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
 throw new ApiError(
    403,
    "You are not allowed to modify this company."
);
}

    const updatedCompany = await updateCompanyService(
      Number(id),
      validation.data
    );

 return successResponse(
  res,
  200,
  "Company updated successfully",
  updatedCompany
);
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
throw new ApiError(
    403,
    "You are not allowed to delete this company."
);
}

    const deletedCompany = await deleteCompanyService(Number(id));

 return successResponse(
  res,
  200,
  "Company deleted successfully",
  deletedCompany
);
  } catch (err) {
    next(err);
  }
};
export const getCompanyStats = async (req, res, next) => {
  try {
    const stats = await getCompanyStatsService();

return successResponse(
  res,
  200,
  "Company statistics fetched successfully",
  stats
);
  } catch (err) {
    next(err);
  }
};
export const getMyCompanies = async (req, res, next) => {
  try {
    const companies = await getMyCompaniesService(req.user.id);

 return successResponse(
  res,
  200,
  "My companies fetched successfully",
  companies
);
  } catch (err) {
    next(err);
  }
};
export const uploadCompanyLogo = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.file) {
  const error = new Error("Please upload an image");
  error.statusCode = 400;
  throw error;
}

    const company = await uploadCompanyLogoService(
      Number(id),
      req.file.filename
    );

return successResponse(
  res,
  200,
  "Logo uploaded successfully",
  {
    ...company,
    logoUrl: `${req.protocol}://${req.get("host")}/uploads/companies/${company.logo}`,
  }
);
  } catch (err) {
    next(err);
  }
};