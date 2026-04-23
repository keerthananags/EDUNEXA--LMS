const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;

const getGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("🔑 Checking GEMINI_API_KEY...");
    console.log("   Key exists:", !!apiKey);
    console.log("   Key length:", apiKey ? apiKey.length : 0);
    console.log("   Key starts with:", apiKey ? apiKey.substring(0, 10) + "..." : "N/A");
    
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not set in environment");
    }
    
    if (apiKey.length < 20) {
      throw new Error("GEMINI_API_KEY appears to be invalid (too short)");
    }
    
    console.log("✅ GEMINI_API_KEY looks valid, initializing...");
    genAI = new GoogleGenerativeAI(apiKey);
    console.log("✅ GoogleGenerativeAI initialized");
  }
  return genAI;
};

// Sleep function for retry delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const askGemini = async (prompt) => {
  const ai = getGenAI();
  
  console.log("🤖 Processing prompt:", prompt.substring(0, 60) + "...");

  // PRIMARY MODEL: gemini-2.5-flash (STABLE + CONFIRMED WORKING)
  const PRIMARY_MODEL = "gemini-2.5-flash";
  
  // FALLBACK MODELS
  const FALLBACK_MODELS = [
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash"
  ];

  let lastError = null;

  // Try primary model with exponential backoff (3 retries)
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`  → ${PRIMARY_MODEL} attempt ${attempt}/3...`);
      const model = ai.getGenerativeModel({ model: PRIMARY_MODEL });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const response = await result.response;
      const text = response.text();

      console.log(`  ✅ ${PRIMARY_MODEL} WORKED on attempt ${attempt}!`);
      return text;
    } catch (err) {
      lastError = err;
      const is503 = err.message?.includes('503') || err.message?.includes('high demand');
      const isKeyError = err.message?.includes('API key') || err.message?.includes('invalid');
      
      console.log(`  ❌ ${PRIMARY_MODEL} attempt ${attempt} failed: ${err.message}`);
      
      // If API key is wrong, don't bother retrying or trying fallbacks
      if (isKeyError) {
        throw err;
      }

      // If 503 (high demand), wait and retry
      if (is503 && attempt < 3) {
        const delay = attempt * 1000;
        console.log(`  ⏳ Waiting ${delay}ms before retry...`);
        await sleep(delay);
        continue;
      }
      
      if (attempt === 3) {
        console.log(`  ⚠️ ${PRIMARY_MODEL} failed, trying fallbacks...`);
      }
    }
  }

  // Try fallback models
  for (const modelName of FALLBACK_MODELS) {
    try {
      console.log(`  → Trying fallback ${modelName}...`);
      const model = ai.getGenerativeModel({ model: modelName });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const response = await result.response;
      return response.text();
    } catch (err) {
      lastError = err;
      console.log(`  ❌ Fallback ${modelName} failed: ${err.message}`);
      if (err.message?.includes('API key')) throw err;
      continue;
    }
  }

  throw lastError || new Error("AI Service unavailable. All models failed.");
};

module.exports = { askGemini };