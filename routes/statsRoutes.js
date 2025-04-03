import express from "express";
import { getDashboardStats } from "../controllers/statsController.js";
import { authenticateToken } from "../middleware/authMiddleware.js"; // assuming you have an authentication middleware

const router = express.Router();

// Route to get dashboard stats
router.get("/count", getDashboardStats);

export default router;
