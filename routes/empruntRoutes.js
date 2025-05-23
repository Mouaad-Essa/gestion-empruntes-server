import express from "express";
import {
  deleteEmprunt,
  emprunterLivre,
  getEmprunts,
  getEmpruntsByUser,
} from "../controllers/empruntController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route pour emprunter un livre (protégée par JWT)
router.post("/emprunter", authenticateToken, emprunterLivre);
// Route pour récupérer la liste des emprunts (protégée par authentification)
router.get("/emprunts", authenticateToken, getEmprunts);
// Route pour récupérer la liste des emprunts par user
router.get("/userEmprunt", authenticateToken, getEmpruntsByUser);

// Supprimer un emprunt
router.delete("/emprunts/:id", deleteEmprunt);

export default router;
