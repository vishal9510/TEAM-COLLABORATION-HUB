// models/Task.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'overdue'],
      default: 'pending',
    },
    dueDate: {
      type: Date,
      required: true,  // Due date is required for each task
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Mark task as overdue if past the due date
TaskSchema.methods.checkOverdue = function () {
  const currentDate = new Date();
  if (this.dueDate < currentDate && this.status !== 'completed') {
    this.status = 'overdue';
  }
};

module.exports = mongoose.model('Task', TaskSchema);
