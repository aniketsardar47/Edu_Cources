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

router.get("/download/:id", async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).send("Not found");

  res.redirect(video.downloadUrl);
});


module.exports = router;
