import db from "../db.js";

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const [users] = await db.query("SELECT * FROM utilisateurs WHERE id = ?", [
      userId,
    ]);

    if (users.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
