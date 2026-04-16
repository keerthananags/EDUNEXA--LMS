const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Enroll in a course with payment
// @route   POST /api/enrollments
// @access  Private
const enrollCourse = async (req, res) => {
  try {
    const { courseId, paymentMethod, amount, transactionId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const alreadyEnrolled = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Determine payment status and method
    const isFreeCourse = course.price === 0 || amount === 0;
    const paymentStatus = isFreeCourse ? 'completed' : (paymentMethod ? 'completed' : 'pending');
    const paymentMethodValue = isFreeCourse ? 'free' : (paymentMethod || null);

    // Create enrollment with payment info
    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
      payment: {
        amount: amount || course.price || 0,
        currency: 'USD',
        status: paymentStatus,
        method: paymentMethodValue,
        transactionId: transactionId || null,
        paidAt: paymentStatus === 'completed' ? Date.now() : null,
      },
    });

    // Add student to course enrolled students
    course.enrolledStudents.push(req.user._id);
    await course.save();

    // Safely populate course data
    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate('course', 'title description thumbnail');
    
    res.status(201).json({
      message: 'Enrolled successfully',
      enrollment: populatedEnrollment || enrollment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my enrollments
// @route   GET /api/enrollments/my-enrollments
// @access  Private
const getMyEnrollments = async (req, res) => {
  try {
    // Get enrollments with basic course populate
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        select: 'title description thumbnail instructor category level',
        populate: {
          path: 'instructor',
          select: 'name email',
          options: { strictPopulate: false }
        }
      })
      .lean();
    
    // Clean up data - remove problematic fields that might cause frontend issues
    const cleanEnrollments = enrollments.map(e => ({
      ...e,
      course: e.course ? {
        _id: e.course._id,
        title: e.course.title || 'Untitled Course',
        description: e.course.description || '',
        thumbnail: e.course.thumbnail || '',
        category: e.course.category || 'Development',
        level: e.course.level || 'beginner',
        instructor: e.course.instructor || { name: 'Unknown Instructor', email: '' }
      } : null
    })).filter(e => e.course !== null); // Remove enrollments with deleted courses
    
    res.json(cleanEnrollments);
  } catch (error) {
    console.error('getMyEnrollments error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update lesson progress
// @route   PUT /api/enrollments/:id/progress
// @access  Private
const updateProgress = async (req, res) => {
  try {
    const { lessonId } = req.body;
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check if user owns this enrollment
    if (enrollment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if lesson already marked as completed
    const alreadyCompleted = enrollment.completedLessons.find(
      (item) => item.lesson.toString() === lessonId
    );

    if (!alreadyCompleted) {
      enrollment.completedLessons.push({ lesson: lessonId });
    }

    // Calculate progress percentage
    const course = await Course.findById(enrollment.course);
    const totalLessons = course.lessons.length;
    const completedCount = enrollment.completedLessons.length;
    enrollment.progress = Math.round((completedCount / totalLessons) * 100);

    // Mark as completed if 100%
    if (enrollment.progress === 100) {
      enrollment.status = 'completed';
    }

    await enrollment.save();
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get course students (for instructors)
// @route   GET /api/enrollments/course/:courseId
// @access  Private/Instructor
const getCourseStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is instructor or admin
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const enrollments = await Enrollment.find({ course: req.params.courseId })
      .populate('student', 'name email')
      .populate('completedLessons.lesson', 'title');

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all enrollments with payment data (admin only)
// @route   GET /api/enrollments/all
// @access  Private/Admin
const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'name email')
      .populate('course', 'title price')
      .sort({ createdAt: -1 });

    // Calculate revenue stats
    const stats = {
      totalEnrollments: enrollments.length,
      totalRevenue: enrollments
        .filter(e => e.payment?.status === 'completed')
        .reduce((sum, e) => sum + (e.payment?.amount || 0), 0),
      pendingPayments: enrollments.filter(e => e.payment?.status === 'pending').length,
      freeEnrollments: enrollments.filter(e => e.payment?.method === 'free').length,
    };

    res.json({
      stats,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update payment status (admin only)
// @route   PUT /api/enrollments/:id/payment
// @access  Private/Admin
const updatePaymentStatus = async (req, res) => {
  try {
    const { status, transactionId } = req.body;
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    enrollment.payment.status = status || enrollment.payment.status;
    if (transactionId) enrollment.payment.transactionId = transactionId;
    if (status === 'completed') enrollment.payment.paidAt = Date.now();

    await enrollment.save();
    res.json({ message: 'Payment status updated', enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin assign course to user
// @route   POST /api/enrollments/admin-assign
// @access  Private/Admin
const adminAssignCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user exists
    const User = require('../models/User');
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already enrolled
    const alreadyEnrolled = await Enrollment.findOne({
      student: userId,
      course: courseId,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'User is already enrolled in this course' });
    }

    // Create enrollment (free/admin assignment)
    const enrollment = await Enrollment.create({
      student: userId,
      course: courseId,
      payment: {
        amount: 0,
        currency: 'USD',
        status: 'completed',
        method: 'admin-assigned',
        paidAt: Date.now(),
      },
    });

    // Add student to course enrolled students
    course.enrolledStudents.push(userId);
    await course.save();

    res.status(201).json({
      message: 'Course assigned successfully',
      enrollment: await enrollment.populate('course', 'title description thumbnail').populate('student', 'name email'),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  enrollCourse,
  getMyEnrollments,
  updateProgress,
  getCourseStudents,
  getAllEnrollments,
  updatePaymentStatus,
  adminAssignCourse,
};
