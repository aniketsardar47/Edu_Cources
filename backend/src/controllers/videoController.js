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



exports.translateVideoDescription = async (req, res) => {
  const { text, target } = req.body;

  if (!text || !target) {
    return res.status(400).json({
      error: "text and target language are required"
    });
  }

  // Full language name → code
  const languageMap = {
    hindi: "hi",
    marathi: "mr",
    telugu: "te",
    english: "en",
    tamil: "ta"
  };

  const targetCode = languageMap[target.toLowerCase()];

  if (!targetCode) {
    return res.status(400).json({
      error: "Unsupported language. Use Hindi, Marathi, Telugu, etc."
    });
  }

  try {
    // MyMemory format: langpair=source|target
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=en|${targetCode}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Translation API error");
    }

    const data = await response.json();

    res.json({
      originalText: text,
      sourceLanguage: "English",
      targetLanguage: target,
      translatedText: data.responseData.translatedText
    });

  } catch (error) {
    console.error("Translation Error:", error.message);
    res.status(500).json({
      error: "Translation failed",
      details: error.message
    });
  }
};