const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate('instructor', 'name email')
      .populate('lessons', 'title duration order')
      .lean();
    res.json(courses);
  } catch (error) {
    console.error('getCourses error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('lessons')
      .lean();

    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    console.error('getCourseById error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Instructor
const createCourse = async (req, res) => {
  try {
    const { title, description, category, level, price } = req.body;

    const course = await Course.create({
      title,
      description,
      instructor: req.user._id,
      category,
      level,
      price,
      isPublished: false,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Instructor
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is instructor or admin
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    const { title, description, category, level, price, isPublished } = req.body;

    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;
    course.level = level || course.level;
    course.price = price !== undefined ? price : course.price;
    course.isPublished = isPublished !== undefined ? isPublished : course.isPublished;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is instructor or admin
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await course.deleteOne();
    res.json({ message: 'Course removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get instructor courses
// @route   GET /api/courses/my-courses
// @access  Private
const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .populate('lessons', 'title duration order')
      .lean();
    res.json(courses);
  } catch (error) {
    console.error('getMyCourses error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create course review
// @route   POST /api/courses/:id/reviews
// @access  Private
const createCourseReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = course.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Course already reviewed' });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    course.reviews.push(review);
    course.numReviews = course.reviews.length;
    course.totalRatings = course.reviews.reduce((acc, item) => item.rating + acc, 0);
    course.rating = course.totalRatings / course.reviews.length;

    await course.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    console.error('createCourseReview error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get course reviews
// @route   GET /api/courses/:id/reviews
// @access  Public
const getCourseReviews = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).select('reviews rating numReviews');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Calculate rating distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    course.reviews.forEach(review => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });

    const total = course.reviews.length;
    const percentages = {};
    for (let i = 1; i <= 5; i++) {
      percentages[i] = total > 0 ? Math.round((distribution[i] / total) * 100) : 0;
    }

    res.json({
      reviews: course.reviews,
      rating: course.rating,
      numReviews: course.numReviews,
      distribution: percentages
    });
  } catch (error) {
    console.error('getCourseReviews error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getMyCourses,
  createCourseReview,
  getCourseReviews,
};
