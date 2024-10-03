// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createTask,
  getUserTasks,
  updateTask,
  deleteTask,
  getAllTasks,
  adminDeleteTask,
} = require('../controllers/taskController');

// Routes for users
router.route('/')
  .post(protect, createTask)         // Create a new task (user only)
  .get(protect, getUserTasks);       // Get tasks for the logged-in user with filtering & sorting

router.route('/:id')
  .put(protect, updateTask)          // Update user's task (user only)
  .delete(protect, deleteTask);      // Delete user's task (user only)

// Admin routes
router.route('/admin')
  .get(protect, authorize('admin'), getAllTasks);  // Get all tasks (admin only) with filtering & sorting

router.route('/admin/:id')
  .delete(protect, authorize('admin'), adminDeleteTask);  // Admin deletes any task

module.exports = router;
