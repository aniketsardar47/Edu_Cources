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



// transtlate video description
const translationCache = {};

// Language name → code
const languageMap = {
  Hindi: "hi",
  Marathi: "mr",
  Telugu: "te",
  English: "en",
  Tamil: "ta"
};

// Function to split text into chunks (max ~450 chars)
const splitText = (text, maxLength = 450) => {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    chunks.push(text.substring(start, start + maxLength));
    start += maxLength;
  }

  return chunks;
};

// Translate single chunk
const translateChunk = async (chunk, targetCode) => {
  // Try MyMemory first
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      chunk
    )}&langpair=en|${targetCode}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    } else {
      throw new Error("MyMemory limit");
    }
  } catch (err) {
    // Fallback to Google
    const googleUrl =
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetCode}&dt=t&q=${encodeURIComponent(chunk)}`;

    const googleResponse = await fetch(googleUrl);
    const googleData = await googleResponse.json();

    return googleData[0].map(item => item[0]).join("");
  }
};

exports.translateVideoDescription = async (req, res) => {
  const { text, target } = req.body;

  if (!text || !target) {
    return res.status(400).json({
      error: "text and target required"
    });
  }

  const targetCode = languageMap[target];

  if (!targetCode) {
    return res.status(400).json({
      error: "Unsupported language"
    });
  }

  const cacheKey = `${text}_${targetCode}`;

  // Return cached result
  if (translationCache[cacheKey]) {
    return res.json({
      translatedText: translationCache[cacheKey],
      cached: true
    });
  }

  try {
    // Split long text
    const chunks = splitText(text);

    let translatedChunks = [];

    for (let chunk of chunks) {
      const translated = await translateChunk(chunk, targetCode);
      translatedChunks.push(translated);
    }

    const finalText = translatedChunks.join(" ");

    // Cache result
    translationCache[cacheKey] = finalText;

    res.json({
      originalLength: text.length,
      chunks: chunks.length,
      translatedText: finalText,
      cached: false
    });

  } catch (error) {
    console.error("Translation Error:", error.message);
    res.status(500).json({
      error: "Translation failed",
      details: error.message
    });
  }
};