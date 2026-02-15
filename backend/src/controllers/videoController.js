const Video = require("../models/Video");

// Get all videos of a specific course
exports.getVideosByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const videos = await Video.find({ courseId }).sort({ order: 1 });

    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get a specific video from a specific course
exports.getVideoById = async (req, res) => {
  try {
    const { courseId, videoId } = req.params;

    const video = await Video.findOne({
      _id: videoId,
      courseId: courseId
    });

    if (!video) {
      return res.status(404).json({ message: "Video not found in this course" });
    }

    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
