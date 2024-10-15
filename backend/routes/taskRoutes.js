const express = require('express');
const { protect, admin, manager } = require('../middleware/authMiddleware');
const {
    createTask,
    getTasks,
    updateTask,
    deleteTask
} = require('../controllers/taskController');

const router = express.Router();

// @route   POST /api/tasks
// @desc    Create a new task (protected, manager/admin only)
// @access  Manager/Admin
router.post('/', protect, manager, createTask);

// @route   GET /api/tasks
// @desc    Get all tasks assigned to the current user (protected)
// @access  Team-member, Manager, Admin
router.get('/', protect, getTasks);

// @route   PUT /api/tasks/:taskId
// @desc    Update a task (protected, only task creator can update)
// @access  Team-member, Manager, Admin
router.put('/:taskId', protect, updateTask);

// @route   DELETE /api/tasks/:taskId
// @desc    Delete a task (protected, only task creator can delete)
// @access  Team-member, Manager, Admin
router.delete('/:taskId', protect, deleteTask);

module.exports = router;
