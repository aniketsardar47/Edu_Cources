const express = require("express");
const router = express.Router();
const { translateVideoDescription } = require("../controllers/videoController");


// Admin - Create Course
router.post("/translate", translateVideoDescription);



module.exports = router;
