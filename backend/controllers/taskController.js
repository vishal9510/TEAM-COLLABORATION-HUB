const Task = require('../model/task.model');

// Create a task
const createTask = async (req, res) => {
    const { title, description, dueDate, assignedTo } = req.body;

    try {
        const task = await Task.create({
            title,
            description,
            dueDate,
            assignedTo,
            createdBy: req.user._id, // The user creating the task
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get tasks for a user
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update task
const updateTask = async (req, res) => {
    const { title, description, status, dueDate, assignedTo } = req.body;

    try {
        const task = await Task.findById(req.params.taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this task' });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        task.dueDate = dueDate || task.dueDate;
        task.assignedTo = assignedTo || task.assignedTo;

        const updatedTask = await task.save();
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete task
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this task' });
        }

        await task.remove();
        res.status(200).json({ message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
};
