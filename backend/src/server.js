import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import registrationRoutes from "./routes/registrationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/registration", registrationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/leaderboard", leaderboardRoutes);


// Base route
app.get("/", (req, res) => {
  res.send("Tech Club Backend is Running!");
});

// Start server

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})
