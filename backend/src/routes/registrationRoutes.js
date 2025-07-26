import express from "express";
const router = express.Router();

// Import controller functions
import {
  registerStudent,
  unregisterStudent,
  getRegistrationsByEvent,
  getRegistrationsByStudent,
} from "../controllers/registrationController.js";

// Routes
router.post("/register", registerStudent); // Register a student for an event
router.delete("/unregister", unregisterStudent); // Unregister a student
router.get("/event/:eventId", getRegistrationsByEvent); // All students in one event
router.get("/student/:studentId", getRegistrationsByStudent); // All events a student has registered for

export default router;

