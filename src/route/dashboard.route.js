import express from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data fetched successfully
 *       401:
 *         description: Unauthorized
 */

const router = express.Router();

router.get("/", authenticate, getDashboard);

export default router;