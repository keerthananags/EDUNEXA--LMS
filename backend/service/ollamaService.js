/**
 * Ask Ollama for a response
 * @param {string} prompt - The prompt to send
 * @param {string} systemPrompt - Optional system prompt
 * @returns {Promise<string>}
 */
const askOllama = async (prompt, systemPrompt = "") => {
  const baseUrl = (process.env.OLLAM_BASE_URL || "http://localhost:11434").trim().replace(/\/$/, "");
  const model = (process.env.OLLAM_MODEL || "llama3").trim();

  console.log(`🤖 Processing Ollama prompt (${model}):`, prompt.substring(0, 60) + "...");

  try {
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        system: systemPrompt,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Ollama error: ${response.status} ${errorData.error || response.statusText}`);
    }

    const data = await response.json();

    if (data && data.response) {
      console.log(` ✅ Ollama (${model}) WORKED!`);
      return data.response;
    } else {
      throw new Error("Unexpected response structure from Ollama");
    }
  } catch (error) {
    console.error(" ❌ Ollama Service Error:", error.message);
    if (error.cause && error.cause.code === 'ECONNREFUSED') {
      throw new Error(`Ollama service not running at ${baseUrl}. Please start Ollama or check your configuration.`);
    }
    throw error;
  }
};

module.exports = { askOllama };
