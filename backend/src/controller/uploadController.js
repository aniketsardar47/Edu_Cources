const Lesson = require("../models/Lesson");
const uploadVideoToCloud = require("../services/cloudUpload");
const fs = require("fs");

exports.uploadLessonVideo = async (req, res) => {
  try {
    const { title, textContent } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Video file is required" });
    }

    // Upload to cloud
    const cloudData = await uploadVideoToCloud(req.file.path);

    // Save lesson in DB
    const lesson = new Lesson({
      title,
      textContent,
      video: {
        url: cloudData.url,
        size: cloudData.size,
        duration: cloudData.duration,
        resolution: "360p"
      }
    });

    await lesson.save();

    // Delete local file
    fs.unlinkSync(req.file.path);

    res.json({
      message: "Video uploaded successfully",
      lesson
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};