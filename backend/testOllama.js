require('dotenv').config();
const { askOllama } = require('./service/ollamaService');

const testOllama = async () => {
  try {
    const baseUrl = process.env.OLLAM_BASE_URL || "(not set)";
    const model = process.env.OLLAM_MODEL || "(not set)";
    
    console.log('--- Testing Ollama Service ---');
    console.log('Base URL:', baseUrl);
    console.log('Model:', model);
    
    const response = await askOllama('Say "Ollama is working perfectly"');
    console.log('\n✅ Response from Ollama:', response);
  } catch (error) {
    console.error('\n❌ Ollama Test Failed:', error.message);
    console.log('Make sure Ollama is running (ollama serve) and the model is downloaded (ollama pull ' + (process.env.OLLAM_MODEL || 'llama3') + ')');
  }
};

testOllama();
