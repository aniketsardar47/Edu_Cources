const Lesson = require("../models/Lesson");
const uploadVideoToCloud = require("../services/cloudUpload");
const generateResolutionUrls = require("../services/videoTransformService");
const fs = require("fs");

exports.uploadLessonVideo = async (req, res) => {
  try {
    const { title, textContent } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Video file is required" });
    }

    // Upload to cloud
    const cloudData = await uploadVideoToCloud(req.file.path);

    // Calculate original resolution
    const originalResolution = `${cloudData.width}x${cloudData.height}`;

    // Generate different resolution URLs
    const resolutions = generateResolutionUrls(cloudData.publicId);

    // Save lesson in DB
    const lesson = new Lesson({
      title,
      textContent,
      video: {
        publicId: cloudData.publicId,
        url: cloudData.url,
        size: cloudData.size,
        duration: cloudData.duration,
        originalResolution: originalResolution,
        width: cloudData.width,
        height: cloudData.height,
        resolutions: resolutions
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