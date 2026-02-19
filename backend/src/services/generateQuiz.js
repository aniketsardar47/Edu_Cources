require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMENI_API_KEY);

const generateQuiz = async (transcript) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
Based on the following educational transcript, generate 5 multiple choice questions.

Rules:
- Each question must have 4 options
- Only one correct answer
- Return ONLY JSON in this format:

[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0
  }
]

Transcript:
${transcript}
`;

    const result = await model.generateContent(prompt);
    const text = (await result.response).text();

    // Extract JSON safely
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]") + 1;
    const jsonString = text.slice(jsonStart, jsonEnd);

    const quiz = JSON.parse(jsonString);

    return quiz;

  } catch (error) {
    console.error("Quiz Generation Error:", error.message);
    return [];
  }
};

module.exports = generateQuiz;
