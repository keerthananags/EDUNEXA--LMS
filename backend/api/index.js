const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const { setupSwagger } = require('../config/swagger');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware - CORS setup (allow all origins in production for Vercel)
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    // Allow localhost in development
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow any Vercel domain in production
    if (origin.includes('vercel.app') || origin.includes(process.env.VERCEL_URL)) {
      return callback(null, true);
    }
    
    // Check against configured frontend URL
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    
    callback(null, true); // Allow all origins for now (customize as needed)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Swagger setup
setupSwagger(app);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'EduNexa LMS API is running...', env: process.env.NODE_ENV });
});

// API Routes
app.use('/api/auth', require('../routes/authRoutes'));
app.use('/api/courses', require('../routes/courseRoutes'));
app.use('/api/enrollments', require('../routes/enrollmentRoutes'));
app.use('/api/admin', require('../routes/adminRoutes'));

// Additional enrollment routes for specific paths
const { enrollCourse, getMyEnrollments } = require('../controllers/enrollmentController');
const { protect } = require('../middleware/auth');
app.post('/api/enroll/:courseId', protect, async (req, res, next) => {
  try {
    req.body = { ...req.body, courseId: req.params.courseId };
    await enrollCourse(req, res);
  } catch (error) {
    next(error);
  }
});
app.get('/api/my-courses', protect, async (req, res, next) => {
  try {
    await getMyEnrollments(req, res);
  } catch (error) {
    next(error);
  }
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route Not Found', path: req.originalUrl });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Export for Vercel serverless
module.exports = app;
