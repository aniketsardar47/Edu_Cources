const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyBGNvplp8oCYrd3bNs_GKyv1VhLvlLhtD4");

const transcribeAudio = async (audioPath) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    // Read audio file as base64
    const audioData = fs.readFileSync(audioPath);
    const base64Audio = audioData.toString("base64");

    const result = await model.generateContent([
      {
        text: "Transcribe the spoken content from this audio accurately."
      },
      {
        inlineData: {
          mimeType: "audio/mp3",   // or audio/wav depending on file
          data: base64Audio
        }
      }
    ]);

    const response = await result.response;
    const transcript = response.text();

    return transcript.trim();

  } catch (error) {
    console.error("Gemini Transcription Error:", error.message);
    return "";
  }
};

module.exports = transcribeAudio;
