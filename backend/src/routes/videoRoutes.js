const express = require("express");
const router = express.Router();

const {
  getVideosByCourse,
  getVideoById
} = require("../controllers/videoController");

// Get all videos of a course
router.get("/course/:courseId", getVideosByCourse);

// Get specific video from a course
router.get("/course/:courseId/:videoId", getVideoById);

module.exports = router;
