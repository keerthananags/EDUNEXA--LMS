const mongoose = require('mongoose');
const Course = require('./models/Course');
const User = require('./models/User');
require('dotenv').config();

const sampleCourses = [
  {
    title: 'Complete Python Bootcamp',
    description: 'Learn Python from scratch! This comprehensive course covers everything from basics to advanced topics including OOP, web scraping, and data analysis. Perfect for beginners and those looking to master Python.',
    category: 'Development',
    level: 'beginner',
    price: 49.99,
    isPublished: true,
  },
  {
    title: 'Web Development Masterclass',
    description: 'Become a full-stack web developer with HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build real-world projects and deploy them to production.',
    category: 'Development',
    level: 'intermediate',
    price: 79.99,
    isPublished: true,
  },
  {
    title: 'Data Science & Machine Learning',
    description: 'Master data science with Python, Pandas, NumPy, Matplotlib, Scikit-learn, and TensorFlow. Learn to analyze data, create visualizations, and build predictive models.',
    category: 'Data Science',
    level: 'advanced',
    price: 99.99,
    isPublished: true,
  },
  {
    title: 'UI/UX Design Fundamentals',
    description: 'Learn the principles of user interface and user experience design. Create beautiful, user-friendly designs using Figma and Adobe XD.',
    category: 'Design',
    level: 'beginner',
    price: 39.99,
    isPublished: true,
  },
  {
    title: 'Digital Marketing Strategy',
    description: 'Learn SEO, social media marketing, email marketing, content strategy, and paid advertising. Grow your business or career in digital marketing.',
    category: 'Marketing',
    level: 'beginner',
    price: 29.99,
    isPublished: true,
  },
  {
    title: 'React Native Mobile Development',
    description: 'Build cross-platform mobile apps for iOS and Android using React Native. Learn navigation, state management, API integration, and app deployment.',
    category: 'Development',
    level: 'intermediate',
    price: 69.99,
    isPublished: true,
  },
  {
    title: 'Cloud Computing with AWS',
    description: 'Master Amazon Web Services (AWS) - EC2, S3, RDS, Lambda, and more. Prepare for AWS certification and deploy scalable applications to the cloud.',
    category: 'Cloud Computing',
    level: 'intermediate',
    price: 89.99,
    isPublished: true,
  },
  {
    title: 'Cybersecurity Fundamentals',
    description: 'Learn the basics of cybersecurity, ethical hacking, network security, and how to protect systems from cyber threats.',
    category: 'Security',
    level: 'beginner',
    price: 59.99,
    isPublished: true,
  },
  {
    title: 'Free Introduction to Programming',
    description: 'A free course for absolute beginners to understand programming concepts, algorithms, and problem-solving techniques. No prior experience needed.',
    category: 'Development',
    level: 'beginner',
    price: 0,
    isPublished: true,
  },
  {
    title: 'Advanced JavaScript Concepts',
    description: 'Deep dive into JavaScript - closures, prototypes, async/await, event loop, design patterns, and performance optimization.',
    category: 'Development',
    level: 'advanced',
    price: 54.99,
    isPublished: true,
  },
];

async function seedCourses() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edunexa');
    console.log('Connected to MongoDB');

    // Find an admin user to be the instructor
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.log('No admin user found. Please create an admin first.');
      process.exit(1);
    }

    console.log(`Using admin: ${adminUser.name} (${adminUser.email}) as instructor`);

    // Clear existing courses (optional - remove this if you want to keep existing)
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Create courses
    for (const courseData of sampleCourses) {
      const course = await Course.create({
        ...courseData,
        instructor: adminUser._id,
      });
      console.log(`Created course: ${course.title}`);
    }

    console.log(`\n✅ Successfully created ${sampleCourses.length} courses!`);
    console.log('\nCourses available:');
    sampleCourses.forEach((c, i) => {
      console.log(`  ${i + 1}. ${c.title} - $${c.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
}

seedCourses();
