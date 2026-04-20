const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

const getGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('🔑 GEMINI_API_KEY exists:', !!apiKey);
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not set in environment');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};

const askGemini = async (prompt) => {
  try {
    console.log('🤖 Asking Gemini:', prompt.substring(0, 50) + '...');
    const genAIInstance = getGenAI();
    const model = genAIInstance.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('✅ Gemini response received:', text.substring(0, 50) + '...');
    return text;
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    throw new Error(`AI Service Error: ${error.message}`);
  }
};

module.exports = { askGemini };
