import { getDashboardService } from "../services/dashboard.service.js";
import { successResponse } from "../utils/apiResponse.js";

export const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await getDashboardService();

    return successResponse(
      res,
      200,
      "Dashboard data fetched successfully",
      dashboard
    );
  } catch (err) {
    next(err);
  }
};