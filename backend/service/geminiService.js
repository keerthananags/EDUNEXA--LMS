const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;

const getGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not set in environment");
    }
    console.log("🔑 GEMINI_API_KEY configured");
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};

// CORRECT model names that actually work with Google AI API
const WORKING_MODELS = [
  "gemini-1.5-flash-001",      // Stable version
  "gemini-1.5-pro-001",        // Stable version
  "gemini-1.0-pro-001",        // Legacy stable
  "gemini-1.5-flash-002",      // Latest stable
  "gemini-1.5-pro-002",        // Latest stable
];

const askGemini = async (prompt) => {
  const ai = getGenAI();
  let lastError = null;

  console.log("🤖 Processing prompt:", prompt.substring(0, 60) + "...");

  // Try each model until one works
  for (const modelName of WORKING_MODELS) {
    try {
      console.log(`  → Trying ${modelName}...`);
      const model = ai.getGenerativeModel({ model: modelName });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const response = await result.response;
      const text = response.text();

      console.log(`  ✅ ${modelName} WORKED!`);
      return text;
    } catch (err) {
      console.log(`  ❌ ${modelName} failed:`, err.message);
      lastError = err;
      continue; // Try next model
    }
  }

  // All models failed
  console.error("❌ ALL MODELS FAILED");
  throw new Error(`AI Error: ${lastError?.message || "No models available"}`);
};

module.exports = { askGemini };