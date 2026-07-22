import express from "express";
import {
  createAcquisition,
  getAllAcquisitions,
  getAcquisitionById,
  updateAcquisition,
  deleteAcquisition,
  getAcquisitionStats,
} from "../controllers/acquisition.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();

// Everyone logged in can view acquisitions
/**
 * @swagger
 * /api/acquisitions:
 *   get:
 *     summary: Get all acquisitions
 *     tags: [Acquisitions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of acquisitions
 */
router.get("/", authenticate, getAllAcquisitions);
/**
 * @swagger
 * /api/acquisitions/{id}:
 *   get:
 *     summary: Get acquisition by ID
 *     tags: [Acquisitions]
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
 *         description: Acquisition fetched successfully
 *       404:
 *         description: Acquisition not found
 */
/**
 * @swagger
 * /api/acquisitions/stats:
 *   get:
 *     summary: Get acquisition statistics
 *     tags: [Acquisitions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acquisition statistics fetched successfully
 */
router.get(
  "/stats",
  authenticate,
  getAcquisitionStats
);
router.get("/:id", authenticate, getAcquisitionById);

// Admin only
/**
 * @swagger
 * /api/acquisitions:
 *   post:
 *     summary: Create an acquisition
 *     tags: [Acquisitions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - buyer_company_id
 *               - target_company_id
 *               - deal_value
 *             properties:
 *               buyer_company_id:
 *                 type: integer
 *                 example: 1
 *               target_company_id:
 *                 type: integer
 *                 example: 2
 *               deal_value:
 *                 type: number
 *                 example: 5000000000
 *               deal_status:
 *                 type: string
 *                 example: Completed
 *     responses:
 *       201:
 *         description: Acquisition created successfully
 */
router.post(
  "/",
  authenticate,
  authorize("admin"),
  createAcquisition
);
/**
 * @swagger
 * /api/acquisitions/{id}:
 *   put:
 *     summary: Update an acquisition
 *     tags: [Acquisitions]
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               buyer_company_id:
 *                 type: integer
 *               target_company_id:
 *                 type: integer
 *               deal_value:
 *                 type: number
 *               deal_status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Acquisition updated successfully
 */
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  updateAcquisition
);
/**
 * @swagger
 * /api/acquisitions/{id}:
 *   delete:
 *     summary: Delete an acquisition
 *     tags: [Acquisitions]
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
 *         description: Acquisition deleted successfully
 */
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  deleteAcquisition
);

export default router;