import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import livreRoutes from "./routes/livreRoutes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// lvire routes
app.use("/api", livreRoutes);

// 📌 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`)
);
