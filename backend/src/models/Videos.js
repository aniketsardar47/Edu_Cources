const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  publicId: {
    type: String,
    required: true
  },

  url: {
    type: String,
    required: true
  },

  size: Number,        // MB
  duration: Number,    // seconds

  originalResolution: String,
  width: Number,
  height: Number,

  resolutions: {
    p240: String,
    p360: String,
    p720: String
  },

  order: {
    type: Number,
    default: 1
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = videoSchema;