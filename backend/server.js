const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { setupSwagger } = require("./config/swagger");

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ✅ SIMPLE & SAFE CORS (for deployment)
app.use(
  cors({
    origin: true, // allow all origins (safe for now)
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Swagger Docs
setupSwagger(app);

// ✅ Root route (health check)
app.get("/", (req, res) => {
  res.json({
    message: "EduNexa LMS API is running 🚀",
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ================= ROUTES =================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/quizzes", require("./routes/quizRoutes"));

// Extra routes (custom)
const {
  enrollCourse,
  getMyEnrollments,
} = require("./controllers/enrollmentController");

const { protect } = require("./middleware/auth");

// Enroll in course
app.post("/api/enroll/:courseId", protect, async (req, res, next) => {
  try {
    req.body = { ...req.body, courseId: req.params.courseId };
    await enrollCourse(req, res);
  } catch (error) {
    next(error);
  }
});

// Get my courses
app.get("/api/my-courses", protect, async (req, res, next) => {
  try {
    await getMyEnrollments(req, res);
  } catch (error) {
    next(error);
  }
});

// ================= ERROR HANDLING =================

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    message: "Route Not Found",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

// Bind to 0.0.0.0 (required for Render)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Server bound to 0.0.0.0:${PORT}`);
});