// Load env vars FIRST
require('dotenv').config();

const mongoose = require('mongoose');
const { askGemini } = require('./service/geminiService');

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected:', mongoose.connection.host);
    
    // Test Gemini API
    console.log('\nTesting Gemini API...');
    const response = await askGemini('Say "AI is working!" in 5 words');
    console.log('✅ Gemini API Working:', response);
    
    // Check courses count
    const Course = require('./models/Course');
    const count = await Course.countDocuments({ isPublished: true });
    console.log('\n📚 Published courses:', count);
    
    if (count === 0) {
      console.log('\n⚠️  WARNING: No courses found! Run: node seedCourses.js');
    }
    
    console.log('\n✅ All systems operational!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testConnection();
