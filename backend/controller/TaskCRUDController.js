import TaskModel from "../Models/TaskModel.js";
import ProjectModel from "../Models/ProjectModel.js";
import { logActivity } from "../utils/activityLogger.js";
import { logNotification, createNotification } from "../utils/notificationLogger.js";

// CREATE TASK
// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, projectId, assignee } = req.body;

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
      owner: req.user._id,
      assignee: assignee || null
    });

    // Log activity on task creation
    await logActivity({
      type: "task_created",
      message: `Task "${task.title}" was created.`,
      projectId: projectId,
      taskId: task._id,
      ownerId: req.user._id
    });

    // Log Workspace Notification (Legacy compatible)
    await logNotification({
      type: "task_created",
      title: "New Task Created",
      message: `Task "${task.title}" was created in this project.`,
      userId: req.user._id,
      projectId: projectId,
      taskId: task._id
    });

    // Trigger TASK_ASSIGNED notification if assignee is present
    if (task.assignee) {
      await createNotification({
        recipient: task.assignee,
        sender: req.user._id,
        type: "TASK_ASSIGNED",
        title: "New task assigned",
        message: `${req.user.name || "A user"} assigned you a task: ${task.title}`,
        entityType: "task",
        entityId: task._id,
        link: `/project/${projectId}`
      });
    }

    return res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error("Create Task error:", error);
    return res.status(500).json({ message: "Server error while creating task." });
  }
};

const analyzeDueDatesAndNotify = async (tasks, userId) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const task of tasks) {
      if (!task.dueDate || task.status === 'completed') continue;

      const dueDateObj = new Date(task.dueDate);
      dueDateObj.setHours(0, 0, 0, 0);

      if (dueDateObj < today) {
        // Overdue task detected
        await logNotification({
          type: "overdue",
          title: "Task Overdue Alert",
          message: `Task "${task.title}" is overdue (was due on ${dueDateObj.toLocaleDateString()}).`,
          userId,
          projectId: task.project,
          taskId: task._id
        });
      } else {
        const twoDaysLater = new Date(today);
        twoDaysLater.setDate(today.getDate() + 2);

        if (dueDateObj >= today && dueDateObj <= twoDaysLater) {
          // Due Soon task detected
          await logNotification({
            type: "due_soon",
            title: "Task Due Soon Warning",
            message: `Task "${task.title}" is due soon (due on ${dueDateObj.toLocaleDateString()}).`,
            userId,
            projectId: task.project,
            taskId: task._id
          });
        }
      }
    }
  } catch (err) {
    console.error("Error analyzing task due dates:", err);
  }
};

// GET ALL TASKS FOR A SPECIFIC PROJECT
// GET /api/tasks/project/:projectId
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verify project exists
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Retrieve all tasks associated with this project (shared workspace collaboration)
    const tasks = await TaskModel.find({ project: projectId })
      .populate("assignee", "name email profilepic")
      .sort({ createdAt: 1 });
    
    // Non-blocking asynchronous analysis of overdue/due-soon parameters
    analyzeDueDatesAndNotify(tasks, req.user._id).catch(err => {
      console.error("Async due date checker failure:", err);
    });

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

    // Verify task authorization (Allow project owner, task creator, OR assigned user to update)
    const isOwner = task.owner.toString() === req.user._id.toString();
    const isAssignee = task.assignee && task.assignee.toString() === req.user._id.toString();
    if (!isOwner && !isAssignee) {
      return res.status(403).json({ message: "Access denied. You are not authorized to update this task." });
    }

    const { title, description, status, priority, dueDate, assignee } = req.body;
    const originalStatus = task.status;
    const originalAssignee = task.assignee;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (assignee !== undefined) task.assignee = assignee || null;

    await task.save();

    // Log the specific type of task modification
    let activityType = "task_updated";
    let activityMessage = `Task "${task.title}" was updated.`;

    if (status !== undefined && status !== originalStatus) {
      if (status === "completed") {
        activityType = "task_completed";
        activityMessage = `Task "${task.title}" was completed!`;
      } else {
        activityType = "task_status_changed";
        const oldLabel = originalStatus === 'in-progress' ? 'In Progress' : originalStatus === 'todo' ? 'Todo' : 'Completed';
        const newLabel = status === 'in-progress' ? 'In Progress' : status === 'todo' ? 'Todo' : 'Completed';
        activityMessage = `Task "${task.title}" moved from "${oldLabel}" to "${newLabel}".`;
      }
    }

    await logActivity({
      type: activityType,
      message: activityMessage,
      projectId: task.project,
      taskId: task._id,
      ownerId: req.user._id,
      metadata: { originalStatus, newStatus: status }
    });

    // Log Workspace Notification (Legacy compatible)
    if (status !== undefined && status !== originalStatus) {
      if (status === "completed") {
        await logNotification({
          type: "task_completed",
          title: "Task Completed",
          message: `Task "${task.title}" has been marked as Completed!`,
          userId: req.user._id,
          projectId: task.project,
          taskId: task._id
        });
      } else {
        const oldLabel = originalStatus === 'in-progress' ? 'In Progress' : originalStatus === 'todo' ? 'Todo' : 'Completed';
        const newLabel = status === 'in-progress' ? 'In Progress' : status === 'todo' ? 'Todo' : 'Completed';
        await logNotification({
          type: "task_moved",
          title: "Task Status Updated",
          message: `Task "${task.title}" moved from "${oldLabel}" to "${newLabel}".`,
          userId: req.user._id,
          projectId: task.project,
          taskId: task._id
        });
      }
    }

    // Trigger TASK_ASSIGNED notification if assignee is newly added or changed
    if (task.assignee && (!originalAssignee || originalAssignee.toString() !== task.assignee.toString())) {
      await createNotification({
        recipient: task.assignee,
        sender: req.user._id,
        type: "TASK_ASSIGNED",
        title: "New task assigned",
        message: `${req.user.name || "A user"} assigned you a task: ${task.title}`,
        entityType: "task",
        entityId: task._id,
        link: `/project/${task.project}`
      });
    }

    // Trigger TASK_COMPLETED notification if status is completed by someone else
    if (status === "completed" && status !== originalStatus) {
      if (task.owner && task.owner.toString() !== req.user._id.toString()) {
        await createNotification({
          recipient: task.owner,
          sender: req.user._id,
          type: "TASK_COMPLETED",
          title: "Task completed",
          message: `${req.user.name || "A user"} completed your task: ${task.title}`,
          entityType: "task",
          entityId: task._id,
          link: `/project/${task.project}`
        });
      }
    }

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

    // Log task deletion activity
    await logActivity({
      type: "task_deleted",
      message: `Task "${task.title}" was deleted.`,
      projectId: task.project,
      ownerId: req.user._id
    });

    // Log Workspace Notification
    await logNotification({
      type: "task_deleted",
      title: "Task Deleted",
      message: `Task "${task.title}" was deleted.`,
      userId: req.user._id,
      projectId: task.project,
      taskId: task._id
    });

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
