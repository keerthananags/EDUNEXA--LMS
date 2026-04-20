const { askGemini } = require("../service/geminiService");
const Chat = require("../models/Chat");

const chatWithAI = async (req, res) => {
  try {
    // ✅ Check API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        success: false,
        message: "AI service not configured"
      });
    }

    const { message, history = [], courseContext } = req.body;

    // ✅ Validate input
    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    // ✅ Safe user check (in case auth missing)
    const userId = req.user?._id || null;

    // ✅ Build prompt (clean + structured)
    let prompt = message;

    if (courseContext) {
      prompt = `
You are an AI tutor.

Course: ${courseContext.title}
Description: ${courseContext.description}

Question: ${message}

Answer clearly and helpfully.
      `;
    }

    // ✅ Call Gemini
    const aiResponse = await askGemini(prompt);

    // ✅ Save chat ONLY if user exists
    if (userId) {
      await Chat.findOneAndUpdate(
        { userId },
        {
          $push: {
            messages: {
              $each: [
                { role: "user", content: message },
                { role: "assistant", content: aiResponse }
              ],
              $slice: -50 // 🔥 keep last 50 messages only
            }
          }
        },
        { upsert: true, new: true }
      );
    }

    // ✅ Send response
    res.status(200).json({
      success: true,
      reply: aiResponse
    });

  } catch (error) {
    console.error("❌ AI Chat Error:", error.message);

    res.status(500).json({
      success: false,
      message: "AI Service Error",
      error: error.message
    });
  }
};

module.exports = { chatWithAI };