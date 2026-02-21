require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateDescription = async (transcript) => {
  try {
    if (!transcript || transcript.trim().length === 0) {
      return {
        english: "No content available",
        hindi: "कोई सामग्री उपलब्ध नहीं",
        marathi: "कोणतीही सामग्री उपलब्ध नाही",
        telugu: "కంటెంట్ అందుబాటులో లేదు",
        tamil: "உள்ளடக்கம் கிடைக்கவில்லை"
      };
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
Generate an educational video description in:
English, Hindi, Marathi, Telugu, Tamil.

Return ONLY valid JSON in this format:

{
  "english": "...",
  "hindi": "...",
  "marathi": "...",
  "telugu": "...",
  "tamil": "..."
}

Transcript:
${transcript}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return JSON.parse(response.text());

  } catch (error) {
    console.error("Gemini Error:", error.message);

    return {
      english: "Description not generated.",
      hindi: "विवरण उत्पन्न नहीं हुआ।",
      marathi: "वर्णन तयार झाले नाही.",
      telugu: "వివరణ సృష్టించబడలేదు.",
      tamil: "விளக்கம் உருவாக்கப்படவில்லை."
    };
  }
};

module.exports = generateDescription;