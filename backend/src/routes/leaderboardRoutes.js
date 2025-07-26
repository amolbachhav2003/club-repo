import express from "express";
import {
  getLeaderboard,
  updateScore,
  resetLeaderboard,
} from "../controllers/leaderboardController.js";

const router = express.Router();

// GET /api/leaderboard - Fetch leaderboard data
router.get("/", getLeaderboard);

// PUT /api/leaderboard/:teamId - Update score for a team
router.put("/:teamId", updateScore);

// DELETE /api/leaderboard/reset - Reset the leaderboard
router.delete("/reset", resetLeaderboard);

export default router;

