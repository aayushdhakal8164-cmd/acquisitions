import logger from "../config/logger.js";

const errorMiddleware = (err, req, res, next) => {
  logger.error(err);

  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Multer errors
  if (err.name === "MulterError") {
    statusCode = 400;

    if (err.code === "LIMIT_FILE_SIZE") {
      message = "Image size must be less than 2MB";
    }
  }

  // Invalid image type
  if (err.message === "Only image files are allowed") {
    statusCode = 400;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

export default errorMiddleware;