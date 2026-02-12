const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: String,
  textContent: String,

  video: {
    publicId: String,
    url: String,
    size: Number,
    duration: Number,
    originalResolution: String,
    width: Number,
    height: Number,
    resolutions: {
      p240: String,
      p360: String,
      p720: String
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Lesson", lessonSchema);
