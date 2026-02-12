const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Cloudinary config
cloudinary.config({
  cloud_name: "dzdgexvxu",
  api_key: "522722596367341",
  api_secret: "UtMmJKt8W3O4nRitu8kBYlmRw8Y"
});

// Upload video function
const uploadVideoToCloud = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "video",
      folder: "learning_app/videos"
    });

    return {
      url: result.secure_url,
      size: result.bytes / (1024 * 1024), // MB
      duration: result.duration
    };
  } catch (error) {
    throw error;
  }
};

module.exports = uploadVideoToCloud;