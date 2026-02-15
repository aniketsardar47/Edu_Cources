const imagekit = require("../config/imagekit");
const fs = require("fs");

const uploadVideo = async (filePath) => {
  try {
    const file = fs.readFileSync(filePath);

    const result = await imagekit.upload({
      file: file,
      fileName: `video_${Date.now()}.mp4`,
      folder: "/learning_app/videos"
    });

    return {
      fileId: result.fileId,
      url: result.url,
      size: result.size / (1024 * 1024)
    };

  } catch (error) {
    console.error("ImageKit Upload Error:", error);
    throw error;
  }
};

module.exports = uploadVideo;
