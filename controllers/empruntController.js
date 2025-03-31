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
