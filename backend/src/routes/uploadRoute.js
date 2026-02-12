const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadLessonVideo } = require("../controller/uploadController");

// Store temporarily in uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// API: Upload lesson video
router.post("/upload-video", upload.single("video"), uploadLessonVideo);

module.exports = router;