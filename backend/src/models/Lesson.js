const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: String,
  textContent: String,

  video: {
    url: String,
    size: Number,
    duration: Number,
    resolution: String
  },

});

module.exports = mongoose.model("Lesson", lessonSchema);