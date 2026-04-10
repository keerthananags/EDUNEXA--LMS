const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllCourses,
  publishCourse,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

// All routes are protected and admin-only

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get dashboard statistics (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics data
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin only access
 */
router.get('/stats', protect, adminOnly, getStats);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin only access
 */
router.get('/users', protect, adminOnly, getAllUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete user by ID (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin only access
 *       404:
 *         description: User not found
 */
router.delete('/users/:id', protect, adminOnly, deleteUser);

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   put:
 *     summary: Update user role by ID (Admin only)
 *     tags: [Admin]
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
 *               role:
 *                 type: string
 *                 enum: [student, instructor, admin]
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin only access
 *       404:
 *         description: User not found
 */
router.put('/users/:id/role', protect, adminOnly, updateUserRole);

/**
 * @swagger
 * /api/admin/courses:
 *   get:
 *     summary: Get all courses including unpublished (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all courses
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin only access
 */
router.get('/courses', protect, adminOnly, getAllCourses);

/**
 * @swagger
 * /api/admin/courses/{id}/publish:
 *   put:
 *     summary: Publish/Unpublish course (Admin only)
 *     tags: [Admin]
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
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Course publish status updated
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin only access
 *       404:
 *         description: Course not found
 */
router.put('/courses/:id/publish', protect, adminOnly, publishCourse);

module.exports = router;
