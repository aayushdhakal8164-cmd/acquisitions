import logger from "../config/logger.js";
import {
  signupschema,
  signinSchema,
} from "../validations/auth.validation.js";
import { formatValidationErrors } from "../utils/format.js";
import {
  signupService,
  signinService,
  getAllUsersService,
  getUserByIdService,
  deleteUserService,
  updateUserService,
} from "../services/auth.service.js";
import { successResponse } from "../utils/apiResponse.js";
// ===================== SIGN UP =====================
export const signup = async (req, res, next) => {
  try {
    const validationResult = signupschema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: formatValidationErrors(validationResult.error),
      });
    }

    const { name, email, password, role } = validationResult.data;

    const user = await signupService({
      name,
      email,
      password,
      role,
    });

    logger.info("User registered successfully", { email });

  return successResponse(
  res,
  201,
  "User registered successfully",
  user
);
  } catch (error) {
    logger.error("Error in signup controller", error);

    if (error.message === "User with this email already exists") {
      return res.status(409).json({
        error: "User with this email already exists",
      });
    }

    return next(error);
  }
};

// ===================== SIGN IN =====================
export const signin = async (req, res, next) => {
  try {
    const validationResult = signinSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: formatValidationErrors(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;

    const result = await signinService({
      email,
      password,
    });

    logger.info("User logged in successfully", { email });

  return successResponse(
  res,
  200,
  "Login successful",
  result
);
  } catch (error) {
    logger.error("Error in signin controller", error);

    if (error.message === "Invalid email or password") {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    return next(error);
  }
};

// ===================== PROFILE =====================
export const profile = (req, res) => {
return successResponse(
  res,
  200,
  "Protected route accessed successfully!",
  req.user
);
};
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserService(Number(id));

   return successResponse(
  res,
  200,
  "User deleted successfully",
  deletedUser
);
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({
        error: "User not found",
      });
    }

    next(error);
  }
};
// ===================== GET ALL USERS =====================
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();

   return successResponse(
  res,
  200,
  "Users fetched successfully",
  users
);
  } catch (error) {
    logger.error("Error fetching users", error);
    return next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await getUserByIdService(Number(id));

  return successResponse(
  res,
  200,
  "User fetched successfully",
  user
);
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({
        error: "User not found",
      });
    }

    next(error);
  }
};
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedUser = await updateUserService(
      Number(id),
      req.body
    );

  return successResponse(
  res,
  200,
  "User updated successfully",
  updatedUser
);
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({
        error: "User not found",
      });
    }

    next(error);
  }
};