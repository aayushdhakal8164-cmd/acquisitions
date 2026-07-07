import { slidingWindow } from "@arcjet/node";
import aj from "../controllers/arcjet.js";
import logger from "#config/logger.js";

const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || "guest";

    let limit = 5;

    if (role === "admin") {
      limit = 220;
    } else if (role === "user") {
      limit = 100;
    }

    const decision = await aj
      .withRule(
        slidingWindow({
          mode: "LIVE",
          interval: 60,
          max: limit,
        })
      )
      .protect(req);

    console.log({
      denied: decision.isDenied(),
      conclusion: decision.conclusion,
      reason: decision.reason,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        logger.warn("Rate limit exceeded", {
          ip: req.ip,
          role,
          path: req.path,
        });

        return res.status(429).json({
          error: "Too Many Requests",
          message: "Rate limit exceeded. Try again later.",
        });
      }

      return res.status(403).json({
        error: "Forbidden",
        message: "Request denied.",
      });
    }

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export default securityMiddleware;