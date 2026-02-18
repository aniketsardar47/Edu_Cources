const imagekit = require("../config/imagekit");
const fs = require("fs");
const path = require("path");

const uploadVideo = async (filePath) => {
  try {
    // Get file name from path
    const fileName = path.basename(filePath);

    const file = fs.readFileSync(filePath);

    const result = await imagekit.upload({
      file: file,
      fileName: fileName,
      folder: "/learning_app/videos"
    });

    // Streaming URL
    const streamUrl = result.url;

    // Force download URL
    const downloadUrl = `${result.url}?dl=${fileName}`;

    return {
      fileId: result.fileId,
      url: streamUrl,
      downloadUrl,
      fileName,
      size: result.size / (1024 * 1024)
    };

  } catch (error) {
    console.error("ImageKit Upload Error:", error);
    throw error;
  }
};

module.exports = uploadVideo;
