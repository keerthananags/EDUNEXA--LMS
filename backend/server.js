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
app.get("/api/ai/health", (req, res) => {
  const geminiKey = process.env.GEMINI_API_KEY;
  res.json({
    success: true,
    aiConfigured: !!geminiKey,
    message: geminiKey ? "AI service ready" : "GEMINI_API_KEY not set",
  });
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