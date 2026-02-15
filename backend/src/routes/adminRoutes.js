const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadVideoByAdmin } = require("../controllers/adminController");

// Temp storage
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });
router.post("/upload-video", upload.single("video"), uploadVideoByAdmin);

module.exports = router;
