const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { setupSwagger } = require("./config/swagger");

dotenv.config();
connectDB();

const app = express();

// ✅ CORS - Allow all origins
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight for all routes
app.options('*', cors());

// Parse JSON bodies
app.use(express.json());

// Swagger
setupSwagger(app);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "EduNexa LMS API is running ",
  });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/quizzes", require("./routes/quizRoutes"));

const {
  enrollCourse,
  getMyEnrollments,
} = require("./controllers/enrollmentController");

const { protect } = require("./middleware/auth");

app.post("/api/enroll/:courseId", protect, enrollCourse);
app.get("/api/my-courses", protect, getMyEnrollments);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: err.message });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on ${PORT}`);
}); 