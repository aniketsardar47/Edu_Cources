const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

// 🔹 Set FFmpeg path manually (Windows)
ffmpeg.setFfmpegPath("D:\\Softwares\\ffmpeg-8.0.1-essentials_build\\ffmpeg-8.0.1-essentials_build\\bin\\ffmpeg.exe");
ffmpeg.setFfprobePath("D:\\Softwares\\ffmpeg-8.0.1-essentials_build\\ffmpeg-8.0.1-essentials_build\\bin\\ffprobe.exe");

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
