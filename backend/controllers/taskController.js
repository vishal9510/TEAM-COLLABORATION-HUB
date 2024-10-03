// controllers/taskController.js
const Task = require('../model/task');

// Create a new task (User only)
const createTask = async (req, res) => {
    const { title, description, dueDate } = req.body;

    try {
        const task = new Task({
            title,
            description,
            dueDate,
            user: req.user.userId,  // User ID from the token
        });
        await task.save();  

        res.status(201).json({ task });

        // Check how many tasks the user already has
        const taskCount = await Task.countDocuments({ user: req.user.userId });

        // If user has 10 or more tasks, prevent further task creation
        if (taskCount >= 10) {
            return res.status(403).json({ msg: 'Task creation limit reached. You can only create up to 10 tasks.' });
        }
        
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get all tasks for the logged-in user (User only)
const getUserTasks = async (req, res) => {
    const { status, sortBy } = req.query;

    let filter = { user: req.user.userId };
    if (status) {
        filter.status = status;
    }

    let sort = {};
    if (sortBy) {
        const parts = sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
        sort = { createdAt: -1 };  // Default sort by creation date, descending
    }

    try {
        const tasks = await Task.find({ user: req.user.userId });

        // Check if tasks are overdue
        tasks.forEach((task) => {
            task.checkOverdue();
            task.save();  // Save updated status if overdue
        });

        res.status(200).json({ count: tasks.length, tasks });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Update a task (User only)
const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status, dueDate } = req.body;

    try {
        const task = await Task.findOne({ _id: id, user: req.user.userId });
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        task.dueDate = dueDate || task.dueDate;

        // Check if task is overdue
        task.checkOverdue();

        await task.save();
        res.status(200).json({ task });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Delete a task (User only)
const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findOne({ _id: id, user: req.user.userId });
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        await task.remove();
        res.status(200).json({ msg: 'Task removed' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Admin: Get all tasks for all users (Admin only)
const getAllTasks = async (req, res) => {
    const { status, sortBy } = req.query;

    let filter = {};
    if (status) {
        filter.status = status;
    }

    let sort = {};
    if (sortBy) {
        const parts = sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
        sort = { createdAt: -1 };  // Default sort by creation date, descending
    }
    try {
        const tasks = await Task.find().populate('user', 'username email');

        // Check if tasks are overdue
        tasks.forEach((task) => {
            task.checkOverdue();
            task.save();  // Save updated status if overdue
        });

        res.status(200).json({ count: tasks.length, tasks });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Admin: Delete any task (Admin only)
const adminDeleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        await task.remove();
        res.status(200).json({ msg: 'Task removed by admin' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = {
    createTask,
    getUserTasks,
    updateTask,
    deleteTask,
    getAllTasks,
    adminDeleteTask,

};
