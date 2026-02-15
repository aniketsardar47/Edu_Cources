const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  title: String,
  textContent: String,

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
  },

  order: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Video", videoSchema);
