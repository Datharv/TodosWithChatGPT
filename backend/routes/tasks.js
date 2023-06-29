const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Task = require("../models/Task");



// create task
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = new Task({
      user: req.userId,
      title,
      description,
    });
    await task.save();
    res.status(201).json({ task });
  } catch (error) {
    console.error("Failed to create task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// get all task
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId });
    res.json({ tasks });
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// get single task
router.get("/:taskId", authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findOne({ _id: taskId, user: req.userId });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ task });
  } catch (error) {
    console.error("Failed to fetch task:", error);
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

// update a task
router.put("/:taskId", authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, completed } = req.body;
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, user: req.userId },
      { title, description, completed },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ task: updatedTask });
  } catch (error) {
    console.error("Failed to update task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// delete task
router.delete("/:taskId", authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      user: req.userId,
    });
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Failed to delete task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
