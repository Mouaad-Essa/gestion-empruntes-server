import db from "../db.js";

// 📌 Emprunter un livre
export const emprunterLivre = async (req, res) => {
  try {
    const { utilisateur_id, livre_id } = req.body;

    // Vérifier si le livre est déjà emprunté
    const [livre] = await db.query(
      "SELECT est_emprunte FROM livres WHERE id = ?",
      [livre_id]
    );

    if (livre.length === 0) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    if (livre[0].est_emprunte) {
      return res.status(400).json({ message: "Ce livre est déjà emprunté" });
    }

    // Définir la date d'emprunt et la date de retour prévue (ex: 14 jours après)
    const dateEmprunt = new Date();
    const dateRetourPrevue = new Date();
    dateRetourPrevue.setDate(dateRetourPrevue.getDate() + 14); // Ajout de 14 jours

    // Insérer l'emprunt dans la table "emprunts"
    await db.query(
      "INSERT INTO emprunts (utilisateur_id, livre_id, date_emprunt, date_retour_prevue) VALUES (?, ?, ?, ?)",
      [utilisateur_id, livre_id, dateEmprunt, dateRetourPrevue]
    );

    // Mettre à jour l'état du livre
    await db.query("UPDATE livres SET est_emprunte = true WHERE id = ?", [
      livre_id,
    ]);

    res
      .status(201)
      .json({ message: "Livre emprunté avec succès", dateRetourPrevue });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Obtenir la liste des emprunts avec les détails de l'utilisateur et du livre
export const getEmprunts = async (req, res) => {
  try {
    const [emprunts] = await db.query(
      `SELECT 
        emprunts.id,
        utilisateurs.nom AS utilisateur_nom,
        livres.titre AS livre_titre,
        livres.auteur AS livre_auteur,
        emprunts.date_emprunt,
        emprunts.date_retour_prevue
      FROM emprunts
      JOIN utilisateurs ON emprunts.utilisateur_id = utilisateurs.id
      JOIN livres ON emprunts.livre_id = livres.id`
    );

    res.json(emprunts);
  } catch (error) {
    console.error("Erreur lors de la récupération des emprunts:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const getEmpruntsByUser = async (req, res) => {
  const userId = req.user.id; // Assuming `req.user.id` is the logged-in user's ID (from a JWT or session)

  if (!userId) {
    return res.status(400).json({ message: "Utilisateur non authentifié" });
  }

  try {
    // Query to get borrowings of the logged-in user
    const [emprunts] = await db.query(
      `SELECT 
        emprunts.id,
        utilisateurs.nom AS utilisateur_nom,
        livres.titre AS livre_titre,
        livres.auteur AS livre_auteur,
        emprunts.date_emprunt,
        emprunts.date_retour_prevue
      FROM emprunts
      JOIN utilisateurs ON emprunts.utilisateur_id = utilisateurs.id
      JOIN livres ON emprunts.livre_id = livres.id
      WHERE emprunts.utilisateur_id = ?`,
      [userId] // Pass the user ID to filter the borrowings
    );

    res.json(emprunts);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des emprunts de l'utilisateur:",
      error
    );
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Supprimer un emprunt et mettre à jour l'état du livre
export const deleteEmprunt = async (req, res) => {
  const empruntId = req.params.id;

  try {
    // Vérifier si l'emprunt existe
    const [empruntRows] = await db.query(
      "SELECT livre_id FROM emprunts WHERE id = ?",
      [empruntId]
    );

    if (empruntRows.length === 0) {
      return res.status(404).json({ message: "Emprunt non trouvé" });
    }

    const livreId = empruntRows[0].livre_id;

    // Supprimer l'emprunt
    await db.query("DELETE FROM emprunts WHERE id = ?", [empruntId]);

    // Mettre à jour l'état du livre
    await db.query("UPDATE livres SET est_emprunte = false WHERE id = ?", [
      livreId,
    ]);

    res.json({ message: "Emprunt supprimé et livre mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'emprunt:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
