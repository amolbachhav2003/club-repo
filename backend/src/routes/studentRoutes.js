import express from "express";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";

const router = express.Router();

// GET /api/students - Get all students
router.get("/", getAllStudents);

// GET /api/students/:id - Get a specific student by ID
router.get("/:id", getStudentById);

// POST /api/students - Register a new student
router.post("/", createStudent);

// PUT /api/students/:id - Update student details
router.put("/:id", updateStudent);

// DELETE /api/students/:id - Remove a student
router.delete("/:id", deleteStudent);

export default router;
