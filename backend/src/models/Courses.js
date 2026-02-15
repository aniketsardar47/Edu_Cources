const mongoose = require("mongoose");
const videoSchema = require("./videoSchema");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: String,

  category: String,

  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner"
  },

  thumbnail: String,

  // Array of videos
  videos: [videoSchema],

  totalVideos: {
    type: Number,
    default: 0
  },

  totalDuration: {
    type: Number,
    default: 0
  },

  isPublished: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

courseSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Course", courseSchema);