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

// List of models to try in order
const MODELS_TO_TRY = [
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest', 
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro',
  'gemini-1.0-pro'
];

const askGemini = async (prompt) => {
  const genAIInstance = getGenAI();
  
  let lastError = null;
  
  for (const modelName of MODELS_TO_TRY) {
    try {
      console.log(`🤖 Trying model: ${modelName}`);
      const model = genAIInstance.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log(`✅ Model ${modelName} worked! Response:`, text.substring(0, 50) + '...');
      return text;
    } catch (error) {
      console.log(`❌ Model ${modelName} failed:`, error.message);
      lastError = error;
      // Continue to next model
    }
  }
  
  // All models failed
  console.error('❌ All Gemini models failed. Last error:', lastError?.message);
  throw new Error(`AI Service Error: ${lastError?.message || 'All models unavailable'}`);
};

module.exports = { askGemini };
