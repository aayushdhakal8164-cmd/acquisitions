import express from "express";
import logger from "./config/logger.js";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./route/auth.route.js";
import userRoutes from "./route/user.route.js";
import companyRoutes from "./route/company.route.js";
import acquisitionRoutes from "./route/acquisition.route.js";

import securityMiddleware from "./middleware/security.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import dashboardRoutes from "./route/dashboard.route.js";

// ES Module __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("trust proxy", 1);

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded files
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// Logger
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Arcjet
app.use(securityMiddleware);

// Routes
app.get("/", (req, res) => {
  logger.info("Hello from the acquisitions service!");
  res.status(200).send("Hello from the acquisitions service!");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Acquisitions API is running",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/acquisitions", acquisitionRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// Error handler (keep last)
app.use(errorMiddleware);

export default app;