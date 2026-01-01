import type { Request, Response } from "express";
import Task from "../models/task.model.js";
import type { TaskPriority } from "../utils/enum.util.js";

export const createTask = async (req: Request, res: Response) => {
  if (req.user!.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Only admin can create tasks",
    });
  }

  const { title, description, dueDate, priority, assignedTo } = req.body;

  const task = await Task.create({
    title,
    description,
    dueDate,
    priority,
    assignedTo,
    createdBy: req.user!.userId,
  });

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    task,
  });
};


export const getTasksByPriority =
  (priority: TaskPriority) =>
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const filter =
      req.user!.role === "admin"
        ? { priority }
        : { priority, assignedTo: req.user!.userId };

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate("assignedTo", "_id name email role")
        .populate("createdBy", "_id name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      priority,
      page,
      totalPages: Math.ceil(total / limit),
      totalTasks: total,
      tasks,
    });
  };


export const getTaskById = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching task" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  if (req.user!.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Only admin can update tasks",
    });
  }

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!updatedTask) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    task: updatedTask,
  });
};

export const assignTask = async (req: Request, res: Response) => {
  if (req.user!.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Only admin can assign tasks",
    });
  }

  const { userId } = req.body;

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { assignedTo: userId },
    { new: true }
  );

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Task assigned successfully",
    task,
  });
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  const { status } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  // Normal user restrictions
  if (req.user!.role === "user") {
    // Task must be assigned
    if (!task.assignedTo) {
      return res.status(403).json({
        success: false,
        message: "Task is not assigned to you",
      });
    }

    // Task must be assigned to the logged-in user
    if (task.assignedTo.toString() !== req.user!.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this task",
      });
    }
  }

  try {
    task.status = status;
    await task.save();
  } catch (error) {
    console.error("Save error:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to update task status",
    });
  }

  res.status(200).json({
    success: true,
    message: "Task status updated",
    task,
  });
};


export const deleteTask = async (req: Request, res: Response) => {
  if (req.user!.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Only admin can delete tasks",
    });
  }

  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
};


