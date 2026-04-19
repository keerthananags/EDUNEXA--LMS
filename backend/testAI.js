// Load env vars FIRST
require('dotenv').config();

const { askGemini } = require('./service/geminiService');

const testAI = async () => {
  try {
    console.log('Testing Gemini API...');
    console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
    console.log('API Key length:', process.env.GEMINI_API_KEY?.length || 0);
    
    const response = await askGemini('Say "AI is working perfectly" in exactly 4 words');
    console.log('✅ AI Response:', response);
  } catch (error) {
    console.error('❌ AI Test Failed:', error.message);
  }
};

testAI();
