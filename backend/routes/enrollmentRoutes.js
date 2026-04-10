const express = require('express');
const router = express.Router();
const {
  enrollCourse,
  getMyEnrollments,
  updateProgress,
  getCourseStudents,
} = require('../controllers/enrollmentController');
const { protect, instructorOrAdmin } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Enrollment
 *   description: Course enrollment endpoints
 */

/**
 * @swagger
 * /api/enroll/{courseId}:
 *   post:
 *     summary: Enroll in a course
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID to enroll in
 *     responses:
 *       201:
 *         description: Successfully enrolled
 *       400:
 *         description: Already enrolled
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Course not found
 */
// Wrapper to handle the path parameter
router.post('/enroll/:courseId', protect, async (req, res) => {
  // Convert path param to body format expected by controller
  req.body = { ...req.body, courseId: req.params.courseId };
  await enrollCourse(req, res);
});

/**
 * @swagger
 * /api/my-courses:
 *   get:
 *     summary: Get my enrolled courses
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of enrolled courses with progress
 *       401:
 *         description: Not authorized
 */
// Alias for my-enrollments
router.get('/my-courses', protect, getMyEnrollments);

// Original routes (kept for compatibility)

/**
 * @swagger
 * /api/enrollments:
 *   post:
 *     summary: Enroll in a course (Alternate)
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully enrolled
 *       400:
 *         description: Already enrolled or missing ID
 */
router.post('/', protect, enrollCourse);

/**
 * @swagger
 * /api/enrollments/my-enrollments:
 *   get:
 *     summary: Get my enrollments
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of enrollments
 */
router.get('/my-enrollments', protect, getMyEnrollments);

/**
 * @swagger
 * /api/enrollments/{id}/progress:
 *   put:
 *     summary: Update course progress
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               progress:
 *                 type: number
 *                 description: Progress percentage (0-100)
 *     responses:
 *       200:
 *         description: Progress updated
 */
router.put('/:id/progress', protect, updateProgress);

/**
 * @swagger
 * /api/enrollments/course/{courseId}:
 *   get:
 *     summary: Get students enrolled in a course (Instructor/Admin only)
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of students
 */
router.get('/course/:courseId', protect, instructorOrAdmin, getCourseStudents);

module.exports = router;
