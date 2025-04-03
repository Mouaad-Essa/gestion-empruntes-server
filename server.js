import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import livreRoutes from "./routes/livreRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import empruntRoutes from "./routes/empruntRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import { authenticateToken } from "./middleware/authMiddleware.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// lvire route
app.use("/api", livreRoutes);
// auth route
app.use("/api/auth", authRoutes);
//user route
app.use("/api/user", authenticateToken, userRoutes);
//emprunter route
app.use("/api/emp", empruntRoutes);

//stats route
app.use("/api/stats", statsRoutes);

// 📌 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`)
);
