import db from "../db.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT * FROM utilisateurs WHERE role != 'admin'"
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé" });
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des utilisateurs",
      error: error.message,
    });
  }
};

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

// Créer un utilisateur
export const createUser = async (req, res) => {
  try {
    const { nom, email, mot_de_passe, role } = req.body;

    // Vérification si l'utilisateur existe déjà
    const [existingUser] = await db.query(
      "SELECT * FROM utilisateurs WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ message: "Un utilisateur avec cet email existe déjà" });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    // Insertion de l'utilisateur
    const [result] = await db.query(
      "INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?)",
      [nom, email, hashedPassword, role]
    );

    res
      .status(201)
      .json({ message: "Utilisateur créé avec succès", id: result.insertId });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de l'utilisateur",
      error: error.message,
    });
  }
};

// Mettre à jour un utilisateur
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { nom, email, mot_de_passe, role } = req.body;

    let hashedPassword = null;

    if (mot_de_passe) {
      // Hachage
      hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    }

    let query = "UPDATE utilisateurs SET nom = ?, email = ?, role = ? ";
    let queryParams = [nom, email, role];

    if (mot_de_passe) {
      query += ", mot_de_passe = ?";
      queryParams.push(hashedPassword);
    }

    query += " WHERE id = ?";
    queryParams.push(userId);

    const [result] = await db.query(query, queryParams);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ message: "Utilisateur mis à jour avec succès" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de l'utilisateur",
      error: error.message,
    });
  }
};

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const [result] = await db.query("DELETE FROM utilisateurs WHERE id = ?", [
      userId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de l'utilisateur",
      error: error.message,
    });
  }
};
