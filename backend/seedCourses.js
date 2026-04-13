const mongoose = require('mongoose');
const Course = require('./models/Course');
const User = require('./models/User');
const Enrollment = require('./models/Enrollment');
require('dotenv').config();

const sampleCourses = [
  {
    title: 'Complete React Development Bootcamp',
    description: 'Master React from basics to advanced concepts including Hooks, Redux, Next.js, and deployment. Build 10+ real-world projects.',
    category: 'Development',
    level: 'beginner',
    price: 89.99,
    isPublished: true,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'
  },
  {
    title: 'Advanced Node.js & Microservices',
    description: 'Build scalable backend systems with Node.js, Express, MongoDB, Docker, and Kubernetes. Learn microservices architecture.',
    category: 'Development',
    level: 'advanced',
    price: 129.99,
    isPublished: true,
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400'
  },
  {
    title: 'UI/UX Design Masterclass',
    description: 'Learn to design beautiful interfaces with Figma. Master color theory, typography, wireframing, and prototyping.',
    category: 'Design',
    level: 'beginner',
    price: 69.99,
    isPublished: true,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400'
  },
  {
    title: 'Data Science with Python',
    description: 'Master data analysis, visualization, machine learning with Pandas, NumPy, Matplotlib, Scikit-learn. Real datasets included.',
    category: 'Data Science',
    level: 'intermediate',
    price: 99.99,
    isPublished: true,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400'
  },
  {
    title: 'Digital Marketing Strategy 2024',
    description: 'Learn SEO, social media marketing, email campaigns, Google Ads, and analytics. Grow any business online.',
    category: 'Marketing',
    level: 'beginner',
    price: 59.99,
    isPublished: true,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'
  },
  {
    title: 'Business Leadership & Management',
    description: 'Develop leadership skills, team management, strategic planning, and effective communication for business success.',
    category: 'Business',
    level: 'intermediate',
    price: 79.99,
    isPublished: true,
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400'
  },
  {
    title: 'Machine Learning & AI Fundamentals',
    description: 'Introduction to AI, neural networks, deep learning with TensorFlow. Build intelligent applications.',
    category: 'AI & ML',
    level: 'intermediate',
    price: 119.99,
    isPublished: true,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400'
  },
  {
    title: 'Full Stack Web Development',
    description: 'Complete guide to MERN stack. MongoDB, Express, React, Node.js. Deploy full applications to production.',
    category: 'Development',
    level: 'beginner',
    price: 94.99,
    isPublished: true,
    thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=400'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edulms');
    console.log('Connected to MongoDB');

    // Find or create an admin/instructor user
    let instructor = await User.findOne({ role: 'admin' });
    
    if (!instructor) {
      // Create a default admin if none exists
      instructor = await User.create({
        name: 'Admin Instructor',
        email: 'admin@edulms.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Created default admin user:', instructor.email);
    } else {
      console.log('Using existing admin:', instructor.email);
    }

    // Find a student user for demo enrollments
    let student = await User.findOne({ role: 'student' });
    
    if (!student) {
      // Create a demo student
      student = await User.create({
        name: 'Demo Student',
        email: 'student@edulms.com',
        password: 'student123',
        role: 'student'
      });
      console.log('Created demo student:', student.email);
    } else {
      console.log('Using existing student:', student.email);
    }

    // Clear existing published courses (optional - remove if you want to keep existing)
    // await Course.deleteMany({ isPublished: true });
    // console.log('Cleared existing published courses');

    // Create courses
    const createdCourses = [];
    for (const courseData of sampleCourses) {
      const existingCourse = await Course.findOne({ title: courseData.title });
      
      if (!existingCourse) {
        const course = await Course.create({
          ...courseData,
          instructor: instructor._id
        });
        createdCourses.push(course);
        console.log(`Created course: ${course.title}`);
      } else {
        console.log(`Course already exists: ${courseData.title}`);
        createdCourses.push(existingCourse);
      }
    }

    // Enroll student in first 3 courses for "My Courses" demo
    const coursesToEnroll = createdCourses.slice(0, 3);
    
    for (const course of coursesToEnroll) {
      const existingEnrollment = await Enrollment.findOne({
        student: student._id,
        course: course._id
      });
      
      if (!existingEnrollment) {
        const enrollment = await Enrollment.create({
          student: student._id,
          course: course._id,
          progress: Math.floor(Math.random() * 60) + 10, // Random progress 10-70%
          payment: {
            amount: course.price,
            currency: 'USD',
            status: 'completed',
            method: 'credit_card',
            paidAt: new Date()
          }
        });
        
        // Add student to course's enrolledStudents
        if (!course.enrolledStudents.includes(student._id)) {
          course.enrolledStudents.push(student._id);
          await course.save();
        }
        
        console.log(`Enrolled student in: ${course.title} (${enrollment.progress}% complete)`);
      } else {
        console.log(`Already enrolled in: ${course.title}`);
      }
    }

    console.log('\n✅ Database seeded successfully!');
    console.log(`📚 Total courses: ${createdCourses.length}`);
    console.log(`🎓 Enrolled in: ${coursesToEnroll.length} courses`);
    console.log('\nLogin credentials:');
    console.log('  Admin: admin@edulms.com / admin123');
    console.log('  Student: student@edulms.com / student123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

seedDatabase();
