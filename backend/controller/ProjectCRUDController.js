import ProjectModel from "../Models/ProjectModel.js";
import { logActivity } from "../utils/activityLogger.js";
import { logNotification } from "../utils/notificationLogger.js";

// CREATE PROJECT
// POST /api/projects
const createProject = async (req, res) => {
  try {
    const { title, description, status, priority, startDate, dueDate } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ message: "Title and Due Date are required fields." });
    }

    const project = await ProjectModel.create({
      title,
      description,
      status,
      priority,
      startDate,
      dueDate,
      owner: req.user._id
    });

    // Log project creation activity
    await logActivity({
      type: "project_created",
      message: `Project "${project.title}" was created successfully.`,
      projectId: project._id,
      ownerId: req.user._id
    });

    // Log Workspace Notification
    await logNotification({
      type: "project_created",
      title: "New Project Created",
      message: `Project "${project.title}" has been created as a new workspace.`,
      userId: req.user._id,
      projectId: project._id
    });

    return res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    console.error("Create Project error:", error);
    return res.status(500).json({ message: "Server error while creating project." });
  }
};

// GET ALL PROJECTS FOR LOGGED-IN USER
// GET /api/projects
const getProjects = async (req, res) => {
  try {
    // Return all projects in the workspace so team members can collaborate
    const projects = await ProjectModel.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ projects });
  } catch (error) {
    console.error("Get Projects error:", error);
    return res.status(500).json({ message: "Server error while fetching projects." });
  }
};

// GET SINGLE PROJECT BY ID
// GET /api/projects/:id
const getProjectById = async (req, res) => {
  try {
    const project = await ProjectModel.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Allow all logged-in team members to view the project workspace
    return res.status(200).json({ project });
  } catch (error) {
    console.error("Get Project By ID error:", error);
    return res.status(500).json({ message: "Server error while fetching project." });
  }
};

// UPDATE PROJECT
// PATCH /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const project = await ProjectModel.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Verify ownership
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied. You cannot modify this project." });
    }

    const { title, description, status, priority, startDate, dueDate } = req.body;

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (status !== undefined) project.status = status;
    if (priority !== undefined) project.priority = priority;
    if (startDate !== undefined) project.startDate = startDate;
    if (dueDate !== undefined) project.dueDate = dueDate;

    await project.save();

    // Log project update activity
    await logActivity({
      type: "project_updated",
      message: `Project parameters for "${project.title}" were updated.`,
      projectId: project._id,
      ownerId: req.user._id
    });

    // Log Workspace Notification
    await logNotification({
      type: "project_updated",
      title: "Project Parameters Updated",
      message: `Project workspace "${project.title}" has been modified.`,
      userId: req.user._id,
      projectId: project._id
    });

    return res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    console.error("Update Project error:", error);
    return res.status(500).json({ message: "Server error while updating project." });
  }
};

// DELETE PROJECT
// DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await ProjectModel.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Verify ownership
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied. You cannot delete this project." });
    }

    await ProjectModel.deleteOne({ _id: req.params.id });

    return res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    console.error("Delete Project error:", error);
    return res.status(500).json({ message: "Server error while deleting project." });
  }
};

export {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
};
