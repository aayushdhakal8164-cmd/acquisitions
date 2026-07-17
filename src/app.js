import express from "express";
import logger from "./config/logger.js";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./route/auth.route.js";
import securityMiddleware from "./middleware/security.middleware.js";
import userRoutes from "./route/user.route.js";
import companyRoutes from "./route/company.route.js";
import path from "path";

const app = express();
app.set("trust proxy", 1); // Trust first proxy (if behind a reverse proxy)

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  "/uploads",
  express.static(path.resolve("src/uploads"))
);

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.use(securityMiddleware);

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

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);

export default app;