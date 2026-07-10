import logger from "../config/logger.js";
import {
  signupschema,
  signinSchema,
} from "../validations/auth.validation.js";
import { formatValidationErrors } from "../utils/format.js";
import {
  signupService,
  signinService,
} from "../services/auth.service.js";

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

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
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

    return res.status(200).json({
      message: "Login successful",
      ...result,
    });
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
  res.status(200).json({
    message: "Protected route accessed successfully!",
    user: req.user,
  });
};