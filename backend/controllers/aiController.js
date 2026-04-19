const { askGemini } = require('../service/geminiService');
const Chat = require('../models/Chat');

const chatWithAI = async (req, res) => {
  try {
    const { message, history = [], courseContext } = req.body;
    const userId = req.user._id;

    let prompt = message;
    if (courseContext) {
      prompt = `Context: This is about the course "${courseContext.title}". ${courseContext.description}\n\nUser question: ${message}`;
    }

    const response = await askGemini(prompt);

    // Save chat history
    await Chat.findOneAndUpdate(
      { userId },
      {
        $push: {
          messages: {
            $each: [
              { role: 'user', content: message },
              { role: 'assistant', content: response }
            ]
          }
        }
      },
      { upsert: true, new: true }
    );

    res.json({ response });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ message: error.message || 'Failed to process chat' });
  }
};

module.exports = { chatWithAI };
