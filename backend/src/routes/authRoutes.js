import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  verifyEmail
} from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/register
router.post("/signup", signupUser);

// POST /api/auth/login
router.post("/login", loginUser);

// POST /api/auth/logout
router.post("/logout", logoutUser);

router.post('/verify-email', verifyEmail);

export default router;
