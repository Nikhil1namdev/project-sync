import TaskModel from "../Models/TaskModel.js";
import ProjectModel from "../Models/ProjectModel.js";

// CREATE TASK
// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, projectId } = req.body;

    if (!title || !dueDate || !projectId) {
      return res.status(400).json({ message: "Title, Due Date, and Project ID are required." });
    }

    // Verify project exists and user owns it
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Parent project not found." });
    }
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to add tasks to this project." });
    }

    const task = await TaskModel.create({
      title,
      description,
      status,
      priority,
      dueDate,
      project: projectId,
      owner: req.user._id
    });

    return res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error("Create Task error:", error);
    return res.status(500).json({ message: "Server error while creating task." });
  }
};

// GET ALL TASKS FOR A SPECIFIC PROJECT
// GET /api/tasks/project/:projectId
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verify project ownership
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied. You do not own this project." });
    }

    const tasks = await TaskModel.find({ project: projectId, owner: req.user._id }).sort({ createdAt: 1 });
    return res.status(200).json({ tasks });
  } catch (error) {
    console.error("Get Tasks error:", error);
    return res.status(500).json({ message: "Server error while retrieving tasks." });
  }
};

// UPDATE TASK
// PATCH /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await TaskModel.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Verify task ownership
    if (task.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied. You do not own this task." });
    }

    const { title, description, status, priority, dueDate } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    return res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Update Task error:", error);
    return res.status(500).json({ message: "Server error while updating task." });
  }
};

// DELETE TASK
// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await TaskModel.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Verify task ownership
    if (task.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied. You do not own this task." });
    }

    await TaskModel.deleteOne({ _id: req.params.id });

    return res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error("Delete Task error:", error);
    return res.status(500).json({ message: "Server error while deleting task." });
  }
};

export {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask
};
