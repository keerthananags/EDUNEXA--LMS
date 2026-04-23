const { askGemini } = require("../service/geminiService");
const { askOllama } = require("../service/ollamaService");
const Chat = require("../models/Chat");
const Course = require("../models/Course");

const chatWithAI = async (req, res) => {
  try {
    const { message, history = [], courseContext } = req.body;

    const ollamaUrl = process.env.OLLAM_BASE_URL;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!ollamaUrl && !geminiKey) {
      return res.status(503).json({
        success: false,
        message: "AI service not configured"
      });
    }

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const userId = req.user?._id || null;
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

    let aiResponse;
    if (ollamaUrl) {
      aiResponse = await askOllama(prompt);
    } else {
      aiResponse = await askGemini(prompt);
    }

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
              $slice: -50
            }
          }
        },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({
      success: true,
      reply: aiResponse
    });

  } catch (error) {
    console.error("AI Chat Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const summarizeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lessons");

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const lessonsList = course.lessons
      .map((l, i) => `${i + 1}. ${l.title}: ${l.description || ""}`)
      .join("\n");

    const prompt = `
Summarize this course:
Title: ${course.title}
Description: ${course.description}
Lessons:
${lessonsList}

Provide Overview, Key Learning Outcomes (bullet points), and Target Audience.
    `;

    const ollamaUrl = process.env.OLLAM_BASE_URL;
    const geminiKey = process.env.GEMINI_API_KEY;

    let aiResponse;
    if (ollamaUrl) {
      aiResponse = await askOllama(prompt, "Summarize this course concisely.");
    } else if (geminiKey) {
      aiResponse = await askGemini(prompt);
    } else {
      return res.status(503).json({ success: false, message: "AI service missing" });
    }

    course.aiSummary = aiResponse;
    await course.save();

    res.status(200).json({ success: true, summary: aiResponse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { chatWithAI, summarizeCourse };