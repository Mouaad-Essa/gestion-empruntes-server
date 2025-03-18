import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// Vérifier si l'utilisateur est authentifié
export const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Accès refusé. Aucun token fourni." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    req.user = decoded; // Stocker l'utilisateur décodé dans req.user
    next();
  } catch (error) {
    res.status(403).json({ message: "Token invalide ou expiré" });
  }
};

// Vérifier si l'utilisateur est admin
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Accès interdit: administrateur requis" });
  }
  next();
};
