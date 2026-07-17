import express from "express";

import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getCompanyStats,
  getMyCompanies,
  uploadCompanyLogo,
} from "../controllers/company.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

import { uploadCompanyLogo as upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// Everyone logged in
router.get("/", authenticate, getAllCompanies);

// Current user's companies
router.get("/my", authenticate, getMyCompanies);

// Statistics
router.get("/stats", authenticate, getCompanyStats);

// Upload logo
router.post(
  "/:id/logo",
  authenticate,
  upload.single("logo"),
  uploadCompanyLogo
);

// Admin only
router.post(
  "/",
  authenticate,
  authorize("admin"),
  createCompany
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  updateCompany
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  deleteCompany
);

// Keep this LAST
router.get("/:id", authenticate, getCompanyById);

export default router;