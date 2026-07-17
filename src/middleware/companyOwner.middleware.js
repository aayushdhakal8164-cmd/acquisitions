import { getCompanyByIdService } from "../services/company.service.js";

export const companyOwner = async (req, res, next) => {
  try {
    const company = await getCompanyByIdService(Number(req.params.id));

    if (!company) {
      return res.status(404).json({
        error: "Company not found",
      });
    }

    // Admin can access everything
    if (req.user.role === "admin") {
      return next();
    }

    // User owns this company
    if (company.user_id === req.user.id) {
      return next();
    }

    return res.status(403).json({
      error: "You do not own this company.",
    });
  } catch (err) {
    next(err);
  }
};