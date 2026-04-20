const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI;

const getGenAI = () => {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY missing");
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

const MODELS = [
  "gemini-1.5-flash",
];

// 🔥 MAIN CHAT FUNCTION
const chatWithAI = async (message) => {
  const ai = getGenAI();
  let lastError;

  for (const modelName of MODELS) {
    try {
      console.log("Trying model:", modelName);

      const model = ai.getGenerativeModel({ model: modelName });

      const result = await model.generateContent(message);
      const response = await result.response;

      return response.text();
    } catch (err) {
      console.log("Failed:", modelName, err.message);
      lastError = err;
    }
  }

  throw new Error(lastError?.message || "All models failed");
};

module.exports = { chatWithAI };