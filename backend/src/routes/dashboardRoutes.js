import express from "express";
import {
  getDashboardStats,
  getRevenueGraph
} from "../controllers/dashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();

router.use(authMiddleware)
router.get("/stats", getDashboardStats);
router.get("/graph", getRevenueGraph);

export default router;
