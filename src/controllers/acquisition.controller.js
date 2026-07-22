import { acquisitionSchema } from "../validations/acquisition.validation.js";
import { formatValidationErrors } from "../utils/format.js";
import {
  createAcquisitionService,
  getAllAcquisitionsService,
  getAcquisitionByIdService,
  updateAcquisitionService,
  deleteAcquisitionService,
  getAcquisitionStatsService,
} from "../services/acquisition.service.js";
import ApiError from "../utils/apiError.js";
import { successResponse } from "../utils/apiResponse.js";

// Create
export const createAcquisition = async (req, res, next) => {
  try {
    const validation = acquisitionSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: formatValidationErrors(validation.error),
      });
    }

    const acquisition = await createAcquisitionService(validation.data);

   return successResponse(
  res,
  201,
  "Acquisition created successfully",
  acquisition
);
  } catch (err) {
    next(err);
  }
};

// Get All
export const getAllAcquisitions = async (req, res, next) => {
  try {
    const acquisitions = await getAllAcquisitionsService();

return successResponse(
  res,
  200,
  "Acquisitions fetched successfully",
  acquisitions   // ✅ Correct
);
  } catch (err) {
    next(err);
  }
};

// Get By ID
export const getAcquisitionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const acquisition = await getAcquisitionByIdService(Number(id));

    if (!acquisition) {
      throw new ApiError(404, "Acquisition not found");
    }

   return successResponse(
  res,
  200,
  "Acquisition fetched successfully",
  acquisition
);
  } catch (err) {
    next(err);
  }
};

// Update
export const updateAcquisition = async (req, res, next) => {
  try {
    const { id } = req.params;

    const validation = acquisitionSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: formatValidationErrors(validation.error),
      });
    }

    const acquisition = await updateAcquisitionService(
      Number(id),
      validation.data
    );

    if (!acquisition) {
      throw new ApiError(404, "Acquisition not found");
    }

return successResponse(
  res,
  200,
  "Acquisition updated successfully",
  acquisition
);
  } catch (err) {
    next(err);
  }
};

// Delete
export const deleteAcquisition = async (req, res, next) => {
  try {
    const { id } = req.params;

    const acquisition = await deleteAcquisitionService(Number(id));

    if (!acquisition) {
      throw new ApiError(404, "Acquisition not found");
    }
return successResponse(
  res,
  200,
  "Acquisition deleted successfully",
  acquisition
);
  } catch (err) {
    next(err);
  }
};
export const getAcquisitionStats = async (req, res, next) => {
  try {
    const stats = await getAcquisitionStatsService();

  return successResponse(
  res,
  200,
  "Acquisition fetched successfully",
  acquisition
);
  } catch (err) {
    next(err);
  }
};