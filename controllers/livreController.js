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
    const { id } = req.params;

    const [rows] = await db.query("SELECT * FROM livres WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Livre non trouvé",
      });
    }

    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Erreur lors de la récupération du livre",
      error: err.message,
    });
  }
};

// Controller to add a new book
export const addLivre = async (req, res) => {
  try {
    const {
      titre,
      auteur,
      description,
      annee_publication,
      genre,
      isbn,
      est_emprunte,
      couverture,
    } = req.body;

    const [result] = await db.query(
      "INSERT INTO livres (titre, auteur, description, annee_publication, genre, isbn, est_emprunte, couverture) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        titre,
        auteur,
        description,
        annee_publication,
        genre,
        isbn,
        est_emprunte || false,
        couverture,
      ]
    );

    return res.status(201).json({
      message: "Livre ajouté avec succès",
      livreId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Erreur lors de l'ajout du livre",
      error: err.message,
    });
  }
};
