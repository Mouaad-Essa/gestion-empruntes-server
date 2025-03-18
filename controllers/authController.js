import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../db.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// inscription
export const register = async (req, res) => {
  try {
    const { nom, email, mot_de_passe } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const [existingUser] = await db.query(
      "SELECT * FROM utilisateurs WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    // Insérer un nouvel utilisateur
    const [result] = await db.query(
      "INSERT INTO utilisateurs (nom, email, mot_de_passe) VALUES (?, ?, ?)",
      [nom, email, hashedPassword]
    );

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      userId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// con
export const login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    // Vérifier si l'utilisateur existe
    const [users] = await db.query(
      "SELECT * FROM utilisateurs WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe invalide" });
    }

    const user = users[0];

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe invalide" });
    }

    // Générer un token JWT
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Connexion réussie", token });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
