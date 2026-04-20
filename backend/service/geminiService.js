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

// ✅ Only supported models (cleaned)
const MODELS_TO_TRY = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest'
];

const askGemini = async (prompt) => {
  const genAIInstance = getGenAI();

  let lastError = null;

  for (const modelName of MODELS_TO_TRY) {
    try {
      console.log(`🤖 Trying model: ${modelName}`);

      const model = genAIInstance.getGenerativeModel({
        model: modelName,
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;

      const text = response.text();

      console.log(`✅ Success with model: ${modelName}`);

      return text; // ✅ STOP here on success
    } catch (err) {
      console.log(`❌ Model failed: ${modelName} ->`, err.message);
      lastError = err;
    }
  }

  console.error('❌ All Gemini models failed:', lastError?.message);

  throw new Error(
    `AI Service Error: ${lastError?.message || 'All models unavailable'}`
  );
};

module.exports = { askGemini };