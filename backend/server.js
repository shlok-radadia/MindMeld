import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import attentionTestsRoutes from "./routes/attentiontests.js";
import memoryTestsRoutes from "./routes/memorytests.js";
import problemTestsRoutes from "./routes/problemtests.js";
import reactionTestsRoutes from "./routes/reactiontests.js";
import publicProfileRoutes from "./routes/publicprofiles.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import aiRoutes from "./routes/ai.js";
import path from "path";
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.options("*", cors());
app.use(express.json());

app.use("/api/users", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/u", publicProfileRoutes);
app.use("/api/attentiontests", attentionTestsRoutes);
app.use("/api/memorytests", memoryTestsRoutes);
app.use("/api/problemtests", problemTestsRoutes);
app.use("/api/reactiontests", reactionTestsRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/ai", aiRoutes);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

connectDB();

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});