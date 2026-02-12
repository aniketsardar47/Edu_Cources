const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: "dzdgexvxu",
  api_key: "522722596367341",
  api_secret: "UtMmJKt8W3O4nRitu8kBYlmRw8Y"
});

const generateResolutionUrls = (publicId) => {
  return {
    p240: cloudinary.url(publicId, {
      resource_type: "video",
      transformation: [{ width: 426, height: 240, crop: "scale" }]
    }),

    p360: cloudinary.url(publicId, {
      resource_type: "video",
      transformation: [{ width: 640, height: 360, crop: "scale" }]
    }),

    p720: cloudinary.url(publicId, {
      resource_type: "video",
      transformation: [{ width: 1280, height: 720, crop: "scale" }]
    })
  };
};

module.exports = generateResolutionUrls;
