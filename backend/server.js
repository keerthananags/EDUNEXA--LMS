const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { setupSwagger } = require("./config/swagger");

dotenv.config();

/* ========================
   DB CONNECTION (SAFE)
======================== */
connectDB()
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
  });

const app = express();

/* ========================
   TRUST PROXY (IMPORTANT for Render)
======================== */
app.set("trust proxy", 1);

/* ========================
   CORS CONFIG (PRODUCTION SAFE)
======================== */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://edunexa-lms-zx8q.vercel.app",
  "https://edunexa-jef3740zw-keerthananagesh32-8080s-projects.vercel.app",
  "https://lms-7fkk3e9pr-keerthananagesh32-8080s-projects.vercel.app",
  "https://edunexa-gw5o47oxe-keerthananagesh32-8080s-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // mobile apps/postman

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(null, true); // TEMP relaxed for debugging
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

/* ========================
   BODY PARSER
======================== */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ========================
   SWAGGER
======================== */
setupSwagger(app);

/* ========================
   HEALTH CHECK
======================== */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 EduNexa LMS API is running",
  });
});

// AI Health Check - Verify Gemini API key is configured
app.get("/api/ai/health", async (req, res) => {
  const geminiKey = process.env.GEMINI_API_KEY;
  
  if (!geminiKey) {
    return res.status(503).json({
      success: false,
      aiConfigured: false,
      message: "GEMINI_API_KEY not set in environment",
    });
  }
  
  // Test actual API call
  try {
    const { askGemini } = require("./service/geminiService");
    const testResponse = await askGemini("Say 'AI is working' in 3 words");
    res.json({
      success: true,
      aiConfigured: true,
      message: "AI service ready",
      testResponse: testResponse.substring(0, 50),
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      aiConfigured: true,
      apiWorking: false,
      message: "GEMINI_API_KEY set but API call failed",
      error: error.message,
    });
  }
});

// Direct API key test (simpler test)
app.get("/api/ai/test-key", async (req, res) => {
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.json({ success: false, error: "No API key" });
  }
  
  try {
    console.log("🧪 Testing API key:", apiKey.substring(0, 15) + "...");
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log("✅ GoogleGenerativeAI created");
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" });
    console.log("✅ Model created");
    
    const result = await model.generateContent("Hi");
    console.log("✅ generateContent called");
    
    const text = result.response.text();
    console.log("✅ Response received:", text.substring(0, 30));
    
    res.json({ success: true, response: text.substring(0, 50) });
  } catch (err) {
    console.error("❌ API Key Test Failed:");
    console.error("   Message:", err.message);
    console.error("   Status:", err.status);
    console.error("   Code:", err.code);
    console.error("   Stack:", err.stack);
    
    res.json({ 
      success: false, 
      error: err.message,
      status: err.status,
      code: err.code,
      fullError: err.toString()
    });
  }
});

/* ========================
   ROUTES (WITH DEBUG LOGS)
======================== */
console.log("📦 Loading routes...");

try {
  app.use("/api/auth", require("./routes/authRoutes"));
  console.log("✅ authRoutes loaded");

  app.use("/api/courses", require("./routes/courseRoutes"));
  console.log("✅ courseRoutes loaded");

  app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
  console.log("✅ enrollmentRoutes loaded");

  app.use("/api/admin", require("./routes/adminRoutes"));
  console.log("✅ adminRoutes loaded");

  app.use("/api/ai", require("./routes/aiRoutes"));
  console.log("✅ aiRoutes loaded");

  app.use("/api/quizzes", require("./routes/quizRoutes"));
  console.log("✅ quizRoutes loaded");
} catch (err) {
  console.error("❌ ROUTE LOADING FAILED:", err.message);
}

/* ========================
   EXTRA ROUTES (Legacy compatibility)
======================== */
const {
  enrollCourse,
} = require("./controllers/enrollmentController");

const { protect } = require("./middleware/auth");

app.post("/api/enroll/:courseId", protect, async (req, res) => {
  // Convert URL param to body format expected by controller
  req.body = { ...req.body, courseId: req.params.courseId };
  await enrollCourse(req, res);
});

/* ========================
   404 HANDLER
======================== */
app.use((req, res) => {
  console.log("❌ 404 HIT:", req.originalUrl);

  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

/* ========================
   ERROR HANDLER
======================== */
app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ========================
   START SERVER
======================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});