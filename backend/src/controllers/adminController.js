const generateDescription = require("../services/generateDescription");
const createDescriptionFile = require("../services/createDescriptionFile");
const uploadTextFile = require("../services/uploadTextToImagekit");
const { uploadVideo, uploadFile } = require("../services/imagekitUpload");
const generateUrls = require("../services/videoTransformService");
const Video = require("../models/Video");
const fs = require("fs");
const path = require("path");
const extractAudio = require("../services/extractAudio");
const transcribeAudio = require("../services/transcribeAudio");
const generateQuiz = require("../services/generateQuiz");

exports.uploadVideoByAdmin = async (req, res) => {
  let videoPath = null;
  let audioPath = null;
  let descFilePath = null;

  try {
    const { courseId, title, textContent, order, notes } = req.body;

    // =========================
    // Correct file check
    // =========================
    if (!req.files || !req.files.video) {
      return res.status(400).json({ message: "Video file required" });
    }

    videoPath = req.files.video[0].path;

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

    const quiz = await generateQuiz(transcript);
    console.log("Quiz generated:", quiz.length);

    // Step 5: Create description file
    descFilePath = createDescriptionFile(descriptionText);

    // Step 6: Upload description file
    const descriptionUrl = await uploadTextFile(descFilePath);
    console.log("Description uploaded");

    // =========================
    // Upload Attachments
    // =========================
    let attachments = [];

    if (req.files && req.files.files) {
      console.log("Attachments found");

      for (const file of req.files.files) {
        const fileData = await uploadFile(file.path);
        attachments.push(fileData);
        deleteLocalFile(file.path);
      }
    }

    // Step 7: Generate resolution URLs
    const resolutions = generateUrls(videoUrl);

    // Step 8: Save to DB
    const video = new Video({
      courseId,
      title,
      textContent,
      notes,
      publicId: fileData.fileId,
      url: videoUrl,
      downloadUrl: fileData.downloadUrl,
      attachments,
      quiz,
      descriptionUrl,
      size: fileData.size,
      resolutions,
      order
    });

    await video.save();
    console.log("Video saved in DB");

    // Step 9: Cleanup
    deleteLocalFile(videoPath);
    deleteLocalFile(audioPath);
    deleteLocalFile(descFilePath);

    res.json({
      message: "Video uploaded successfully",
      video
    });

  } catch (err) {
    console.error("Upload Pipeline Error:", err);

    deleteLocalFile(videoPath);
    deleteLocalFile(audioPath);
    deleteLocalFile(descFilePath);

    res.status(500).json({ error: err.message });
  }
};


// Safe delete
const deleteLocalFile = (filePath) => {
  try {
    const absolutePath = path.resolve(filePath);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      console.log("Deleted:", absolutePath);
    }
  } catch (err) {
    console.error("Delete error:", err.message);
  }
};
