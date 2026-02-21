const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

// 🔹 FFmpeg should be in the system PATH
// If not, you can set it manually using ffmpeg.setFfmpegPath()
ffmpeg.setFfmpegPath("E:\\ffmpeg.exe");
ffmpeg.setFfprobePath("E:\\ffprobe.exe");
const extractAudio = (videoPath) => {
  return new Promise((resolve, reject) => {
    const audioPath = `uploads/audio_${Date.now()}.mp3`;

    ffmpeg(videoPath)
      .noVideo()
      .audioCodec("libmp3lame")
      .format("mp3")
      .save(audioPath)
      .on("start", (commandLine) => {
        console.log("FFmpeg started:", commandLine);
      })
      .on("end", () => {
        console.log("Audio extracted:", audioPath);
        resolve(audioPath);
      })
      .on("error", (err) => {
        console.error("FFmpeg Error:", err.message);
        reject(err);
      });
  });
};

module.exports = extractAudio;
