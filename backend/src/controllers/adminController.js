const generateDescription = require("../services/generateDescription");
const createDescriptionFile = require("../services/createDescriptionFile");
const uploadTextFile = require("../services/uploadTextToImagekit");
const uploadVideo = require("../services/imagekitUpload");
const generateUrls = require("../services/videoTransformService");
const Video = require("../models/Video");
const fs = require("fs");
const extractAudio = require("../services/extractAudio");
const transcribeAudio = require("../services/transcribeAudio");

exports.uploadVideoByAdmin = async (req, res) => {
  let videoPath = null;
  let audioPath = null;
  let descFilePath = null;

  try {
    const { courseId, title, textContent, order } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Video file required" });
    }

    videoPath = req.file.path;

    // Step 1: Upload video to ImageKit
    const fileData = await uploadVideo(videoPath);
    const videoUrl = fileData.url;
    console.log("Video uploaded");

    // Step 2: Extract audio
    audioPath = await extractAudio(videoPath);
    console.log("Audio extracted");

    // Step 3: Transcribe audio
    const transcript = await transcribeAudio(audioPath);
    console.log("Transcript generated");

    // Step 4: Generate AI description
    const descriptionText = await generateDescription(transcript);
    console.log("AI description generated");

    // Step 5: Create description file
    descFilePath = createDescriptionFile(descriptionText);

    // Step 6: Upload description file to ImageKit
    const descriptionUrl = await uploadTextFile(descFilePath);
    console.log("Description uploaded to ImageKit");

    // Step 7: Generate resolution URLs
    const resolutions = generateUrls(videoUrl);

    // Step 8: Save to DB
    const video = new Video({
      courseId,
      title,
      textContent,
      publicId: fileData.fileId,
      url: videoUrl,
      downloadUrl: fileData.downloadUrl,
      descriptionUrl,
      size: fileData.size,
      resolutions,
      order
    });

    await video.save();
    console.log("Video saved in DB");

    // Step 9: Cleanup local files
    deleteLocalFile(videoPath);
    deleteLocalFile(audioPath);
    deleteLocalFile(descFilePath);

    res.json({
      message: "Video uploaded with AI description",
      video
    });

  } catch (err) {
    console.error("Upload Pipeline Error:", err);

    // Cleanup even if error occurs
    deleteLocalFile(videoPath);
    deleteLocalFile(audioPath);
    deleteLocalFile(descFilePath);

    res.status(500).json({ error: err.message });
  }
};


// Utility: Safe delete
const deleteLocalFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("File delete error:", err);
      } else {
        console.log("Local file deleted:", filePath);
      }
    });
  }
};