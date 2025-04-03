import express from "express";
import {
  addLivre,
  getAllLivres,
  getLivreById,
} from "../controllers/livreController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to get all livres
router.get("/livres", authenticateToken, getAllLivres);
// Route pour obtenir un livre par son ID
router.get("/livre/:id", authenticateToken, getLivreById);

// Route to add a new book (expects Base64 image)
router.post("/livre", addLivre);

export default router;
