import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/register
router.post("/signup", signupUser);

// POST /api/auth/login
router.post("/login", loginUser);

// POST /api/auth/logout
router.post("/logout", logoutUser);

// POST /api/auth/verify
router.post('/verify-email', verifyEmail);

// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

// POST /api/auth/reset-password
router.post('/reset-password/:token', resetPassword);


export default router;
