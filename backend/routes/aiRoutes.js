const express = require("express");
const router = express.Router();
const { chatWithAI, summarizeCourse } = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

/**
 * @swagger
 * /api/ai/chat:
 *   post:
 *     summary: Chat with AI Tutor (Gemini)
 *     description: |
 *       Chat with AI tutor powered by Google Gemini.
 *       **Primary Model:** `gemini-1.5-flash-002` (with 3 retry attempts on 503 errors)
 *       
 *       **Retry Logic:**
 *       - Attempt 1: Immediate call
 *       - Attempt 2: Wait 1 second if 503 error
 *       - Attempt 3: Wait 2 seconds if 503 error
 *       
 *       **Fallback Models (if primary fails):**
 *       1. gemini-1.5-flash-001
 *       2. gemini-1.5-pro-002
 *       3. gemini-1.5-pro-001
 *       4. gemini-1.0-pro-001
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: User's message to the AI
 *                 example: "Explain machine learning in simple terms"
 *               courseContext:
 *                 type: object
 *                 description: Optional course context for better responses
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: "Introduction to AI"
 *                   description:
 *                     type: string
 *                     example: "Basic concepts of artificial intelligence"
 *     responses:
 *       200:
 *         description: Successful AI response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 reply:
 *                   type: string
 *                   example: "Machine learning is a type of artificial intelligence..."
 *       400:
 *         description: Bad request - missing message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Message is required"
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Not authorized, no token"
 *       503:
 *         description: AI service not configured
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "AI service not configured. Please set GEMINI_API_KEY"
 *       500:
 *         description: AI service error (model unavailable, rate limit, etc.)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "AI Service Error"
 *                 error:
 *                   type: string
 *                   example: "[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/... [503 Service Unavailable] This model is currently experiencing high demand..."
 */

// 🔐 Protected route (production)
router.post("/chat", protect, chatWithAI);
router.get("/summarize-course/:courseId", protect, summarizeCourse);

// 🔓 OPTIONAL: Public route for testing (REMOVE in production)
// router.post("/chat", chatWithAI);

module.exports = router;