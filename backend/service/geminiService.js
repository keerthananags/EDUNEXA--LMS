const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

const getGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not set in environment');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};

const askGemini = async (prompt) => {
  try {
    const genAIInstance = getGenAI();
    const model = genAIInstance.getGenerativeModel({ model: 'gemini-1.5-flash-latest ' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    throw new Error(`AI Service Error: ${error.message}`);
  }
};

module.exports = { askGemini };
