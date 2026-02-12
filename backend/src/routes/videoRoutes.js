const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadLessonVideo } = require("../controllers/videoController");
// Temp storage
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/upload-video", upload.single("video"), uploadLessonVideo);

module.exports = router;
