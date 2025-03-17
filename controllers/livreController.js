import db from "../db.js";

// Controller select livre
export const getAllLivres = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM livres");

    if (rows.length === 0) {
      return res.status(404).json({
        message: "No livres found",
      });
    }

    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error retrieving livres",
      error: err.message,
    });
  }
};

// Contrôleur pour obtenir un livre par son ID
export const getLivreById = async (req, res) => {
  try {
    // Récupérer l'ID du livre à partir des paramètres de la requête
    const { id } = req.params;

    // Exécuter la requête pour récupérer le livre par son ID
    const [rows] = await db.query("SELECT * FROM livres WHERE id = ?", [id]);

    // Vérifier si le livre existe
    if (rows.length === 0) {
      return res.status(404).json({
        message: "Livre non trouvé", // Si le livre n'existe pas
      });
    }

    // Réponse réussie avec le livre trouvé
    return res.status(200).json(rows[0]);
  } catch (err) {
    // Erreur serveur (500)
    console.error(err); // Journaliser l'erreur pour le débogage
    return res.status(500).json({
      message: "Erreur lors de la récupération du livre",
      error: err.message,
    });
  }
};
