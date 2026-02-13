const fs = require("fs");
const Video = require("../models/Video");
const uploadVideo = require("../services/imagekitUpload");
const generateUrls = require("../services/videoTransformService");

exports.uploadVideoByAdmin = async (req, res) => {
  try {
    console.log("Start");

    const { courseId, title, textContent, order } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Video file required" });
    }

    if (!courseId) {
      return res.status(400).json({ message: "courseId is required" });
    }

    // Upload to ImageKit
    const fileData = await uploadVideo(req.file.path);
    console.log("Uploaded to ImageKit");

    // Generate resolution URLs
    const resolutions = generateUrls(fileData.url);

    // Save in DB
    const video = new Video({
      courseId,
      title,
      textContent,
      publicId: fileData.fileId,
      url: fileData.url,
      size: fileData.size,
      resolutions,
      order
    });

    await video.save();

    fs.unlinkSync(req.file.path);

    res.json({
      message: "Video uploaded successfully (ImageKit)",
      video
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
