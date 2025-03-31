import express from "express";
import { emprunterLivre } from "../controllers/empruntController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route pour emprunter un livre (protégée par JWT)
router.post("/emprunter", authenticateToken, emprunterLivre);

export default router;
