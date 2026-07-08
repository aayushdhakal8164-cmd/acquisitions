import { slidingWindow } from "@arcjet/node";
import aj from "../controllers/arcjet.js";
import logger from "#config/logger.js";

const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || "guest";

    let limit = 5;

    switch (role) {
      case "admin":
        limit = 220;
        break;
      case "user":
        limit = 100;
        break;
      default:
        limit = 5;
        break;
    }

    // Debug information
    console.log("========== REQUEST ==========");
    console.log("IP:", req.ip);
    console.log("Forwarded For:", req.headers["x-forwarded-for"]);
    console.log("Host:", req.hostname);
    console.log("Method:", req.method);
    console.log("Path:", req.path);
    console.log("=============================");

    const client = aj.withRule(
      slidingWindow({
        mode: "LIVE",
        interval: 60,
        max: limit,
        name: `${role}-rate-limit`,
      })
    );

    const decision = await client.protect(req);

    console.log("Arcjet Decision:", {
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

      if (decision.reason.isBot()) {
        logger.warn("Bot detected", {
          ip: req.ip,
          role,
          path: req.path,
        });

        return res.status(403).json({
          error: "Forbidden",
          message: "Bot detected.",
        });
      }

      if (decision.reason.isShield()) {
        logger.warn("Shield blocked request", {
          ip: req.ip,
          role,
          path: req.path,
        });

        return res.status(403).json({
          error: "Forbidden",
          message: "Blocked by Arcjet Shield.",
        });
      }

      return res.status(403).json({
        error: "Forbidden",
        message: "Request denied.",
      });
    }

    next();
  } catch (err) {
    logger.error("Security middleware error", {
      error: err.message,
      stack: err.stack,
    });

    next(err);
  }
};

export default securityMiddleware;