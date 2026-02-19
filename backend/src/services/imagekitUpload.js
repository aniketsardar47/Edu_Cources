const imagekit = require("../config/imagekit");
const fs = require("fs");
const path = require("path");

/**
 * Generic uploader (internal use)
 */
const uploadToImagekit = async (filePath, folder) => {
  try {
    // Get file name
    const fileName = path.basename(filePath);

    // Read file
    const file = fs.readFileSync(filePath);

    // Upload to ImageKit
    const result = await imagekit.upload({
      file: file,
      fileName: fileName,
      folder: folder
    });

    // Streaming URL
    const streamUrl = result.url;

    // Forced download URL
    const downloadUrl = `${result.url}?dl=${fileName}`;

    return {
      fileId: result.fileId,
      url: streamUrl,
      downloadUrl,
      fileName,
      fileType: path.extname(fileName),
      size: result.size / (1024 * 1024) // MB
    };

  } catch (error) {
    console.error("ImageKit Upload Error:", error);
    throw error;
  }
};


/**
 * Upload Video
 */
const uploadVideo = async (filePath) => {
  return uploadToImagekit(filePath, "/learning_app/videos");
};


/**
 * Upload Attachment File (PDF, PPT, Notes, etc.)
 */
const uploadFile = async (filePath) => {
  return uploadToImagekit(filePath, "/learning_app/attachments");
};

module.exports = {
  uploadVideo,
  uploadFile
};
