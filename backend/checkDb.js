const mongoose = require('mongoose');
const Course = require('./models/Course');
require('dotenv').config();

const checkDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edulms');
    console.log('Connected to MongoDB\n');
    
    const courses = await Course.find();
    console.log('Total courses in database:', courses.length);
    console.log('\nCourses:');
    courses.forEach(c => {
      console.log(`  - ${c.title}`);
      console.log(`    Published: ${c.isPublished}`);
      console.log(`    ID: ${c._id}`);
      console.log('');
    });
    
    const published = await Course.find({ isPublished: true });
    console.log(`\nPublished courses: ${published.length}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

checkDb();
