import jwt from "jsonwebtoken";
import logger from "./logger.js"; // change path if necessary

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-please-change-in-production";

const JWT_EXPIRES_IN = "1d";

export const jwtToken = {
  sign: (payload) => {
    try {
      return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });
    } catch (error) {
      logger.error("Error signing JWT token:", error);
      throw new Error("Error signing JWT token");
    }
  },

  verify: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logger.error("Error verifying JWT token:", error);
      throw new Error("Error verifying JWT token");
    }
  },
};