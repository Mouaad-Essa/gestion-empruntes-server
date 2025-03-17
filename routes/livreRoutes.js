import express from "express";
import { getAllLivres, getLivreById } from "../controllers/livreController.js";

const router = express.Router();

// Route to get all livres
router.get("/livres", getAllLivres);
// Route pour obtenir un livre par son ID
router.get("/livre/:id", getLivreById);

export default router;
