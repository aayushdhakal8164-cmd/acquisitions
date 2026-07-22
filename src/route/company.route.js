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
/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Get all companies
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of companies
 */
router.get("/", authenticate, getAllCompanies);

// Current user's companies
router.get("/my", authenticate, getMyCompanies);

// Statistics
router.get("/stats", authenticate, getCompanyStats);

// Upload logo
/**
 * @swagger
 * /api/companies/{id}/logo:
 *   post:
 *     summary: Upload company logo
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Logo uploaded successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/:id/logo",
  authenticate,
  upload.single("logo"),
  uploadCompanyLogo
);

// Admin only
/**
 * @swagger
 * /api/companies:
 *   post:
 *     summary: Create a company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - industry
 *               - country
 *               - valuation
 *               - founded_year
 *             properties:
 *               name:
 *                 type: string
 *                 example: Apple
 *               industry:
 *                 type: string
 *                 example: Technology
 *               country:
 *                 type: string
 *                 example: USA
 *               valuation:
 *                 type: integer
 *                 example: 3500000000000
 *               founded_year:
 *                 type: integer
 *                 example: 1976
 *     responses:
 *       201:
 *         description: Company created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */
router.post(
  "/",
  authenticate,
  authorize("admin"),
  createCompany
);
/**
 * @swagger
 * /api/companies/{id}:
 *   put:
 *     summary: Update a company
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - industry
 *               - country
 *               - valuation
 *               - founded_year
 *             properties:
 *               name:
 *                 type: string
 *               industry:
 *                 type: string
 *               country:
 *                 type: string
 *               valuation:
 *                 type: number
 *               founded_year:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Company updated successfully
 *       403:
 *         description: Not allowed
 *       404:
 *         description: Company not found
 */
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  updateCompany
);
/**
 * @swagger
 * /api/companies/{id}:
 *   delete:
 *     summary: Delete a company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *       403:
 *         description: You are not allowed to delete this company
 *       404:
 *         description: Company not found
 */
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  deleteCompany
);

// Keep this LAST
/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     summary: Get company by ID
 *     tags:
 *       - Company
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Company fetched successfully
 *       404:
 *         description: Company not found
 */
router.get("/:id", authenticate, getCompanyById);

export default router;