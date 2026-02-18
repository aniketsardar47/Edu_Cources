const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyCNuKZn_RUhM9DBd6ZwTc0zLEzRh7dtg0s");

const generateDescription = async (transcript) => {
  try {
    // Validate input
    if (!transcript || transcript.trim().length === 0) {
      return "No content available to generate description.";
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
You are an educational content assistant.

Based on the following video transcript, generate a clear and concise educational description in detail.

Focus on:
- Main topic
- Key concepts explained
- Learning outcome

Transcript:
${transcript}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    const description = response.text();

    return description.trim();

  } catch (error) {
    console.error("Gemini Description Error:", error.message);
    return "Description could not be generated.";
  }
};

module.exports = generateDescription;
