const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { setupSwagger } = require("./config/swagger");

dotenv.config();
connectDB();

const app = express();

/* ========================
   CORS CONFIG (FIXED)
======================== */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://edunexa-lms-zx8q.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

/* ========================
   BODY PARSER
======================== */
app.use(express.json());
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
    message: "EduNexa LMS API is running 🚀",
  });
});

/* ========================
   ROUTES (SAFE LOADING)
======================== */
try {
  app.use("/api/auth", require("./routes/authRoutes"));
  app.use("/api/courses", require("./routes/courseRoutes"));
  app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
  app.use("/api/admin", require("./routes/adminRoutes"));
  app.use("/api/ai", require("./routes/aiRoutes"));
  app.use("/api/quizzes", require("./routes/quizRoutes"));
} catch (err) {
  console.error("❌ Route loading error:", err.message);
}

/* ========================
   EXTRA ROUTES
======================== */
const {
  enrollCourse,
  getMyEnrollments,
} = require("./controllers/enrollmentController");

const { protect } = require("./middleware/auth");

app.post("/api/enroll/:courseId", protect, enrollCourse);
app.get("/api/my-courses", protect, getMyEnrollments);

/* ========================
   404 HANDLER
======================== */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

/* ========================
   ERROR HANDLER
======================== */
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

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