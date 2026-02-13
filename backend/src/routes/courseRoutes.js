const express = require("express");
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  getCourseById
} = require("../controllers/courseController");

// Admin - Create Course
router.post("/create-course", createCourse);

// User - Get all courses (Home page)
router.get("/", getAllCourses);

// User - Get course by ID
router.get("/:id", getCourseById);

module.exports = router;
