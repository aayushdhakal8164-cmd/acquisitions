import logger from "../config/logger.js";
import { signupschema } from "../validations/auth.validation.js";
import { formatValidationErrors } from "../utils/format.js";

export const signup = async (req, res, next) => {
  try {
    // Validate request body
    const validationResult = signupschema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: formatValidationErrors(validationResult.error),
      });
    }

    // Extract validated data
    const { name, email, password, role } = validationResult.data;

    // TODO: Replace this with your actual auth service / database logic

    logger.info("User registered successfully", { email });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        name,
        email,
        role,
      },
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