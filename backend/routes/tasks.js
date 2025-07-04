const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// Create Task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, dueDate, dueTime, priority, reminder } = req.body;
    const task = new Task({
      userId: req.user.userId,
      title,
      description,
      dueDate,
      dueTime,
      priority,
      reminder,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get All Tasks (with optional filters)
router.get('/', auth, async (req, res) => {
  try {
    const { status, priority, dueDate } = req.query;
    let filter = { userId: req.user.userId };
    if (status === 'completed') filter.isCompleted = true;
    if (status === 'pending') filter.isCompleted = false;
    if (priority) filter.priority = priority;
    if (dueDate) filter.dueDate = { $lte: new Date(dueDate) };
    const tasks = await Task.find(filter).sort({ dueDate: 1, createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update Task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete Task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Toggle Complete
router.patch('/:id/complete', auth, async (req, res) => {
  console.log('Complete task request:', { taskId: req.params.id, userId: req.user.userId });
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!task) {
      console.log('Task not found:', req.params.id);
      return res.status(404).json({ message: 'Task not found' });
    }
    task.isCompleted = !task.isCompleted;
    await task.save();
    console.log('Task completed successfully:', { taskId: req.params.id, isCompleted: task.isCompleted });
    res.json(task);
  } catch (err) {
    console.error('Error completing task:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 