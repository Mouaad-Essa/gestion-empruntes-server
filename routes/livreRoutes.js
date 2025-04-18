import express from "express";
import {
  addLivre,
  deleteLivre,
  getAllLivres,
  getLivreById,
  updateLivre,
} from "../controllers/livreController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to get all livres
router.get("/livres", authenticateToken, getAllLivres);
// Route pour obtenir un livre par son ID
router.get("/livre/:id", authenticateToken, getLivreById);

// Route to add a new book
router.post("/livre", addLivre);

router.put("/livre/:id", updateLivre);
router.delete("/livre/:id", authenticateToken, deleteLivre);

export default router;
